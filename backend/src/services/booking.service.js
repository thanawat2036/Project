import db from "../config/db.js";

/* ===== CREATE BOOKING ===== */
export const create = async ({ user_id, date, time, table_no }) => {

  // 1. เช็คโต๊ะซ้ำ
  const check = await db.query(
    `SELECT 1 FROM bookings
     WHERE book_date=$1 
     AND book_time=$2
     AND table_no=$3
     AND status='booked'`,
    [date, time, table_no]
  );

  if (check.rowCount > 0) {
    throw new Error("โต๊ะถูกจองแล้ว");
  }

  // 2. บันทึกการจอง
  await db.query(
    `INSERT INTO bookings 
      (user_id, book_date, book_time, table_no, status)
     VALUES ($1,$2,$3,$4,'booked')`,
    [user_id, date, time, table_no]
  );
};

/* ===== USER BOOKINGS ===== */
export const findByUser = async (user_id) => {
  const { rows } = await db.query(
    `SELECT id, book_date, book_time, table_no, status
     FROM bookings
     WHERE user_id=$1
     ORDER BY book_date DESC`,
    [user_id]
  );
  return rows;
};

/* ===== CANCEL BOOKING (USER) ===== */
export const cancel = async (id, user_id) => {
  const result = await db.query(
    `UPDATE bookings 
     SET status='cancelled'
     WHERE id=$1 AND user_id=$2`,
    [id, user_id]
  );

  if (!result.rowCount) {
    throw new Error("ไม่สามารถยกเลิกการจองได้");
  }
};

/* ===== BOOKED TABLES ===== */
export const findBookedTables = async (date, time) => {
  const { rows } = await db.query(
    `SELECT table_no 
     FROM bookings
     WHERE book_date=$1
     AND book_time=$2
     AND status='booked'`,
    [date, time]
  );

  return rows.map(r => r.table_no);
};
