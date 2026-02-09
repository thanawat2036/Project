import db from "../config/db.js";

export const create = async (data, userId) => {
  await db.query(
    `INSERT INTO bookings (user_id, book_date, book_time, table_no)
     VALUES ($1,$2,$3,$4)`,
    [userId, data.date, data.time, data.table_no]
  );
};

export const getBookedTables = async (date, time) => {
  const { rows } = await db.query(
    `SELECT table_no FROM bookings
     WHERE book_date=$1 AND book_time=$2 AND status='booked'`,
    [date, time]
  );
  return rows.map(r => r.table_no);
};

export const cancel = async (id, userId) => {
  await db.query(
    `UPDATE bookings SET status='cancelled'
     WHERE id=$1 AND user_id=$2`,
    [id, userId]
  );
};
