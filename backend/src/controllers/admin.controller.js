import db from "../config/db.js";

/* ===== ADMIN GUARD (ง่าย + เร็ว) ===== */
const adminGuard = (req, res) => {
  if (!req.session.userId || !req.session.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
};

/* ===============================
   GET ALL BOOKINGS
================================ */
export const getAllBookings = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { rows } = await db.query(`
    SELECT 
      b.id,
      b.book_date,
      b.book_time,
      b.table_no,
      b.status,
      b.created_at,
      u.name AS user_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `);

  res.json(rows);
};

/* ===============================
   CLOSE TABLE (ทั้งวัน)
================================ */
export const closeTable = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { date, table_no } = req.body;

  if (!date || !table_no) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  // กันซ้ำ
  const check = await db.query(
    `SELECT 1 FROM table_closures WHERE table_no=$1 AND close_date=$2`,
    [table_no, date]
  );

  if (check.rowCount > 0) {
    return res.status(400).json({ message: "โต๊ะนี้ถูกปิดแล้ว" });
  }

  await db.query(
    `INSERT INTO table_closures (table_no, close_date)
     VALUES ($1, $2)`,
    [table_no, date]
  );

  res.json({ success: true });
};

/* ===============================
   OPEN TABLE
================================ */
export const openTable = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { date, table_no } = req.body;

  await db.query(
    `DELETE FROM table_closures
     WHERE table_no=$1 AND close_date=$2`,
    [table_no, date]
  );

  res.json({ success: true });
};

/* ===============================
   GET USERS
================================ */
export const getUsers = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { rows } = await db.query(`
    SELECT id, name, email, is_admin, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  res.json(rows);
};

/* ===============================
   GET MESSAGES
================================ */
export const getMessages = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { rows } = await db.query(`
    SELECT 
      m.id,
      m.message,
      m.reply,
      m.created_at,
      u.name AS user_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
  `);

  res.json(rows);
};

/* ===============================
   REPLY MESSAGE
================================ */
export const replyMessage = async (req, res) => {
  if (!adminGuard(req, res)) return;

  const { reply } = req.body;
  const { id } = req.params;

  if (!reply) {
    return res.status(400).json({ message: "กรุณากรอกข้อความตอบกลับ" });
  }

  await db.query(
    `UPDATE messages SET reply=$1 WHERE id=$2`,
    [reply, id]
  );

  res.json({ success: true });
};
