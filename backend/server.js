import express from "express";
import mysql from "mysql2/promise";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== SESSION ===== */
app.use(
  session({
    secret: "bourbon-yard-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 4,
      sameSite: "lax",
    },
  })
);

app.use(express.static(path.join(__dirname, "../frontend")));

/* ===== DB ===== */
const db = await mysql.createPool({
  host: "localhost",
  user: "bourbon",
  password: "080549",
  database: "bourbon_yard",
  waitForConnections: true,
  connectionLimit: 10,
  timezone: "+07:00",
});

/* =========================
   AUTH
========================= */

/* REGISTER */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const [[exists]] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );
    if (exists) {
      return res.status(409).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,'user')",
      [name, email, hash]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "สมัครสมาชิกไม่สำเร็จ" });
  }
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
    if (!user) {
      return res.status(401).json({ message: "ไม่พบบัญชี" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "รหัสผ่านผิด" });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    res.json({ success: true, user: req.session.user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "เข้าสู่ระบบไม่สำเร็จ" });
  }
});

/* LOGOUT */
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

/* CURRENT USER */
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "unauthorized" });
  }
  res.json(req.session.user);
});

app.post("/api/contact-admin", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "กรุณากรอกข้อความ" });
  }

  await db.query(
    "INSERT INTO messages (user_id, message) VALUES (?, ?)",
    [req.session.user.id, message]
  );

  res.json({ success: true });
});

app.get("/api/admin/messages", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json([]);
  }

  const [rows] = await db.query(`
    SELECT
      m.id,
      u.name,
      u.email,
      m.message,
      m.created_at
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
  `);

  res.json(rows);
});

/* =========================
   BOOKING
========================= */

/* helper: เวลาสิ้นสุดไม่เกิน 20:30 */
function calcEndTime(startTime) {
  const [h, m] = startTime.split(":").map(Number);

  const start = new Date();
  start.setHours(h, m, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 3); // จอง 2 ชม.

  const closing = new Date(start);
  closing.setHours(20, 30, 0);

  const finalEnd = end > closing ? closing : end;
  return finalEnd.toTimeString().slice(0, 8);
}

/* BOOK */
app.post("/api/book", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    }

    const { date, time, table, people } = req.body;
    if (!date || !time || !table || !people) {
      return res.status(400).json({ message: "ข้อมูลการจองไม่ครบ" });
    }

    const endTime = calcEndTime(time);

    /* ❗ user ละ 1 โต๊ะ / วัน */
    // ❗ user จองได้แค่ 1 โต๊ะต่อวัน
const [[userBooked]] = await db.query(
  `
  SELECT id FROM bookings
  WHERE user_id = ?
    AND booking_date = ?
  `,
  [req.session.user.id, date]
);

if (userBooked) {
  return res.status(409).json({
    message: "คุณได้จองโต๊ะไปแล้วในวันนี้",
  });
}


    /* หาโต๊ะ */
    const [[t]] = await db.query(
      "SELECT id FROM tables WHERE table_no=?",
      [table]
    );
    if (!t) {
      return res.status(404).json({ message: "ไม่พบโต๊ะ" });
    }

    /* กันจองซ้อน */
    const [exists] = await db.query(
      `
      SELECT id FROM bookings
      WHERE booking_date=?
        AND table_id=?
        AND (? < end_time AND ? > start_time)
      `,
      [date, t.id, time, endTime]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "โต๊ะไม่ว่าง" });
    }

    /* INSERT */
    await db.query(
      `
      INSERT INTO bookings
      (user_id, booking_date, start_time, end_time, people, table_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [req.session.user.id, date, time, endTime, people, t.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ message: "จองโต๊ะไม่สำเร็จ" });
  }
});

/* BOOKED TABLES */
app.get("/api/booked-tables", async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) return res.json([]);

    const endTime = calcEndTime(time);

    const [rows] = await db.query(
      `
      SELECT DISTINCT t.table_no
      FROM bookings b
      JOIN tables t ON b.table_id=t.id
      WHERE b.booking_date=?
        AND (? < b.end_time AND ? > b.start_time)
      `,
      [date, time, endTime]
    );

    res.json(rows.map(r => Number(r.table_no)));
  } catch (err) {
    console.error("BOOKED TABLES ERROR:", err);
    res.status(500).json([]);
  }
});

/* =========================
   ADMIN
========================= */
app.get("/api/admin/bookings", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json([]);
  }

  const [rows] = await db.query(`
    SELECT
      b.id,
      u.name AS customer,
      t.table_no,
      b.booking_date,
      b.start_time,
      b.end_time,
      b.people
    FROM bookings b
    JOIN users u ON b.user_id=u.id
    JOIN tables t ON b.table_id=t.id
    ORDER BY b.booking_date DESC
  `);

  res.json(rows);
});

app.get("/api/admin/users", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json([]);
  }

  const [rows] = await db.query(
    "SELECT name,email,role FROM users ORDER BY id DESC"
  );
  res.json(rows);
});

app.delete("/api/admin/bookings/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "forbidden" });
  }

  await db.query("DELETE FROM bookings WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post(
  "/api/admin/upload-image",
  upload.single("image"),
  async (req, res) => {
    if (req.session.user.role !== "admin") {
      return res.sendStatus(403);
    }

    await db.query(
      "UPDATE site_settings SET value=? WHERE `key`='hero_image'",
      [req.file.filename]
    );

    res.json({ success: true });
  }
);

/* ===== START ===== */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
