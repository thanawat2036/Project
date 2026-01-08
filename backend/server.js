const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(express.json());

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== Database =====
const db = new sqlite3.Database("./bookings.db", err => {
  if (err) console.error(err.message);
  else console.log("📦 SQLite connected");
});

db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT,
    table_no TEXT,
    people INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ===== Create Booking =====
app.post("/api/book", (req, res) => {
  const { date, time, table, people } = req.body;

  if (!date || !time || !table || !people) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
  }

  db.get(
    `SELECT 1 FROM bookings WHERE date=? AND time=? AND table_no=?`,
    [date, time, table],
    (err, row) => {
      if (row) {
        return res.status(409).json({ error: "โต๊ะนี้ถูกจองแล้ว" });
      }

      db.run(
        `INSERT INTO bookings (date, time, table_no, people)
         VALUES (?, ?, ?, ?)`,
        [date, time, table, people],
        () => {
          res.json({ success: true, message: "จองโต๊ะสำเร็จ" });
        }
      );
    }
  );
});

// ===== Get Booked Tables =====
app.get("/api/booked", (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) return res.json([]);

  db.all(
    `SELECT table_no FROM bookings WHERE date=? AND time=?`,
    [date, time],
    (err, rows) => {
      res.json(rows.map(r => r.table_no));
    }
  );
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🔥 Server running → http://localhost:${PORT}`);
});

// ===== Admin : Get All Bookings =====
app.get("/api/admin/bookings", (req, res) => {
  const { date } = req.query;

  let sql = `SELECT * FROM bookings`;
  let params = [];

  if (date) {
    sql += ` WHERE date = ?`;
    params.push(date);
  }

  sql += ` ORDER BY date DESC, time ASC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
