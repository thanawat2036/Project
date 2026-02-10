import db from "../config/db.js";

/* ===============================
   CREATE BOOKING (ปิดทั้งวัน)
================================ */
export const create = async ({ date, time, table_no }, userId) => {
  if (!date || !table_no) {
    throw new Error("ข้อมูลไม่ครบ");
  }

  // ❗ กันโต๊ะซ้ำทั้งวัน (ไม่สนเวลา)
  const tableCheck = await db.query(
    `
    SELECT 1 FROM bookings
    WHERE book_date = $1
      AND table_no = $2
      AND status = 'booked'
    `,
    [date, table_no]
  );

  if (tableCheck.rowCount > 0) {
    throw new Error("โต๊ะนี้ถูกจองแล้วทั้งวัน");
  }

  await db.query(
    `
    INSERT INTO bookings
      (user_id, book_date, book_time, table_no, status)
    VALUES ($1, $2, $3, $4, 'booked')
    `,
    [userId, date, time || null, table_no]
  );
};

/* ===============================
   GET BOOKED TABLES (ทั้งวัน)
================================ */
export const getBookedTablesByDate = async (date) => {
  const { rows } = await db.query(
    `
    SELECT table_no FROM bookings
    WHERE book_date=$1 AND status='booked'
    UNION
    SELECT table_no FROM table_closures
    WHERE close_date=$1
    `,
    [date]
  );

  return rows.map(r => r.table_no);
};


/* ===============================
   CANCEL BOOKING
================================ */
export const cancel = async (id, userId) => {
  await db.query(
    `
    UPDATE bookings
    SET status='cancelled'
    WHERE id=$1 AND user_id=$2
    `,
    [id, userId]
  );
};

/* ===============================
   FIND BY USER (PROFILE)
================================ */
export const findByUser = async (userId) => {
  const { rows } = await db.query(
    `
    SELECT id, book_date, book_time, table_no, status, created_at
    FROM bookings
    WHERE user_id=$1
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return rows;
};