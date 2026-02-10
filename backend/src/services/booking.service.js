import db from "../config/db.js";

export const create = async (
  { date, time, table_no, people },
  userId
) => {

  if (!date || !time || !table_no) {
    throw new Error("ข้อมูลไม่ครบ");
  }

  // กันโต๊ะซ้ำ
  const tableCheck = await db.query(
    `
    SELECT 1 FROM bookings
    WHERE book_date=$1
      AND book_time=$2
      AND table_no=$3
      AND status='booked'
    `,
    [date, time, table_no]
  );

  if (tableCheck.rowCount > 0) {
    throw new Error("โต๊ะนี้ถูกจองแล้ว");
  }

  // กัน user ซ้ำ
  const userCheck = await db.query(
    `
    SELECT 1 FROM bookings
    WHERE book_date=$1
      AND book_time=$2
      AND user_id=$3
      AND status='booked'
    `,
    [date, time, userId]
  );

  if (userCheck.rowCount > 0) {
    throw new Error("คุณจองไปแล้วในช่วงเวลานี้");
  }

  await db.query(
    `
    INSERT INTO bookings
      (user_id, book_date, book_time, table_no, people, status)
    VALUES ($1, $2, $3, $4, $5, 'booked')
    `,
    [userId, date, time, table_no, people]
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

export const findByUser = async (userId) => {
  const { rows } = await db.query(
    `SELECT id, book_date, book_time, table_no, status, created_at
     FROM bookings
     WHERE user_id=$1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};
