import db from "../config/db.js";

export const create = async ({ date, time, table_no }, userId) => {

  /* ❌ กันโต๊ะซ้ำ */
  const tableCheck = await db.query(
    `SELECT 1 FROM bookings
     WHERE book_date=$1
     AND book_time=$2
     AND table_no=$3
     AND status='booked'`,
    [date, time, table_no]
  );

  if (tableCheck.rowCount > 0) {
    throw new Error("โต๊ะนี้ถูกจองแล้ว");
  }

  /* ❌ กัน user จองหลายโต๊ะเวลาเดียวกัน */
  const userCheck = await db.query(
    `SELECT 1 FROM bookings
     WHERE book_date=$1
     AND book_time=$2
     AND user_id=$3
     AND status='booked'`,
    [date, time, userId]
  );

  if (userCheck.rowCount > 0) {
    throw new Error("คุณได้จองโต๊ะในช่วงเวลานี้แล้ว");
  }

  /* ✅ บันทึก */
  await db.query(
    `INSERT INTO bookings (user_id, book_date, book_time, table_no, status)
     VALUES ($1,$2,$3,$4,'booked')`,
    [userId, date, time, table_no]
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
    `SELECT table_no FROM bookings
     WHERE book_date=$1
     AND book_time=$2
     AND status='booked'`,
    [date, time]
  );

  return rows.map(r => Number(r.table_no));
};
