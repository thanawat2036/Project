import db from "../config/db.js";

export const create = async ({ date, time, table_no }, userId) => {
  const check = await db.query(
    `SELECT 1 FROM bookings
     WHERE book_date=$1 AND book_time=$2
     AND table_no=$3 AND status='booked'`,
    [date, time, table_no]
  );
  if (check.rowCount)
    throw new Error("โต๊ะถูกจองแล้ว");

  await db.query(
    `INSERT INTO bookings (user_id,book_date,book_time,table_no)
     VALUES ($1,$2,$3,$4)`,
    [userId, date, time, table_no]
  );
};

export const findByUser = async (userId) => {
  const { rows } = await db.query(
    "SELECT * FROM bookings WHERE user_id=$1",
    [userId]
  );
  return rows;
};

export const cancel = async (id, userId) => {
  await db.query(
    "UPDATE bookings SET status='cancelled' WHERE id=$1 AND user_id=$2",
    [id, userId]
  );
};

export const findBookedTables = async (date, time) => {
  const { rows } = await db.query(
    `SELECT table_no FROM bookings
     WHERE book_date=$1
     AND book_time=$2
     AND status='booked'`,
    [date, time]
  );

  return rows.map(r => r.table_no);
};