import db from "../config/db.js";

/* ALL BOOKINGS */
export const getAllBookings = async (req, res) => {
  const { rows } = await db.query(
    `SELECT b.*, u.name
     FROM bookings b
     JOIN users u ON b.user_id=u.id
     ORDER BY b.created_at DESC`
  );
  res.json(rows);
};

/* CANCEL BOOKING */
export const cancelBooking = async (req, res) => {
  await db.query(
    `UPDATE bookings SET status='cancelled' WHERE id=$1`,
    [req.params.id]
  );
  res.json({ success: true });
};

/* CLOSE TABLE */
export const closeTable = async (req, res) => {
  const { table_no, date, reason } = req.body;

  await db.query(
    `INSERT INTO table_closures (table_no, close_date, reason)
     VALUES ($1,$2,$3)`,
    [table_no, date, reason]
  );

  res.json({ success: true });
};
