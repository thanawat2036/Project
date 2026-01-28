import express from "express";
import mysql from "mysql2/promise";
import path from "path";

const app = express();
const PORT = 5000;

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "../frontend")));

/* ===== DB CONNECTION ===== */
const db = await mysql.createPool({
  host: "localhost",
  user: "bourbon",
  password: "080549",
  database: "bourbon_yard",
  waitForConnections: true,
  connectionLimit: 10,
});

/* ===== HOME ===== */
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/index.html"));
});

/* =====================================================
   BOOK TABLE
   ===================================================== */
app.post("/api/book", async (req, res) => {
  try {
    const { date, time, table, people, name } = req.body;

    if (!date || !time || !table || !people || !name) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
    }

    const startTime = time;
    const endTime = "20:30:00";

    /* 🔎 หา table_id */
    const [[tableRow]] = await db.query(
      `SELECT id FROM tables WHERE table_no = ?`,
      [table]
    );

    if (!tableRow) {
      return res.status(404).json({ error: "ไม่พบโต๊ะ" });
    }

    const tableId = tableRow.id;

    /* ⛔ ตรวจเวลาซ้อน */
    const [exists] = await db.query(
      `
      SELECT 1
      FROM bookings
      WHERE booking_date = ?
        AND table_id = ?
        AND (? < end_time AND ? > start_time)
      `,
      [date, tableId, startTime, endTime]
    );

    if (exists.length > 0) {
      return res
        .status(409)
        .json({ error: "โต๊ะนี้ถูกจองแล้วในช่วงเวลานี้" });
    }

    /* ✅ INSERT */
    await db.query(
      `
      INSERT INTO bookings
      (customer_name, booking_date, start_time, end_time, people, table_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, date, startTime, endTime, people, tableId]
    );

    res.json({ success: true, message: "จองโต๊ะสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   GET BOOKED TABLES (lock เวลา)
   ===================================================== */
app.get("/api/booked", async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) return res.json([]);

    const endTime = "20:30:00";

    const [rows] = await db.query(
      `
      SELECT DISTINCT t.table_no
      FROM bookings b
      JOIN tables t ON b.table_id = t.id
      WHERE b.booking_date = ?
        AND (? < b.end_time AND ? > b.start_time)
      `,
      [date, time, endTime]
    );

    res.json(rows.map(r => r.table_no));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* =====================================================
   ADMIN – ดูรายการจอง
   ===================================================== */
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const { date } = req.query;

    let sql = `
      SELECT
        b.id,
        b.customer_name,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.people,
        t.table_no,
        b.created_at
      FROM bookings b
      JOIN tables t ON b.table_id = t.id
    `;

    const params = [];

    if (date) {
      sql += ` WHERE b.booking_date = ?`;
      params.push(date);
    }

    sql += ` ORDER BY b.booking_date DESC, b.start_time ASC`;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log(`🔥 Server running → http://localhost:${PORT}`);
});
