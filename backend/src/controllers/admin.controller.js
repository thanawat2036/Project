import {db} from "../config/db.js";

/* ======================
   BOOKINGS
====================== */
export const bookings = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id,
        u.name AS customer,
        b.table_no,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.people
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC, b.start_time DESC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await db.query("DELETE FROM bookings WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "booking deleted" });
  } catch (err) {
    next(err);
  }
};

/* ======================
   USERS
====================== */
export const users = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, role
      FROM users
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    await db.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, userId]
    );

    res.json({ message: "role updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "user deleted" });
  } catch (err) {
    next(err);
  }
};

/* ======================
   MESSAGES
====================== */
export const messages = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, message, created_at
      FROM messages
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
