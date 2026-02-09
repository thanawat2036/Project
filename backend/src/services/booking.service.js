import  db  from "../config/db.js";

/* =========================
   TABLES ที่ถูกจองแล้ว
========================= */
export async function getBookedTables({ date, time }) {
  const {rows} = await db.query(
    `
    SELECT table_no
    FROM bookings
    WHERE booking_date = ?
      AND (
        (? BETWEEN start_time AND end_time)
        OR (start_time BETWEEN ? AND ADDTIME(?, '02:00'))
      )
    `,
    [date, time, time, time]
  );

  return rows.map(r => r.table_no);
}

/* =========================
   CREATE BOOKING
========================= */
export async function createBooking(userId, data) {
  const { table, date, time, people } = data;

  // 🔒 เช็กชนโต๊ะ
  const booked = await getBookedTables({ date, time });
  if (booked.includes(Number(table))) {
    throw new Error("โต๊ะนี้ถูกจองแล้ว");
  }

  // ⏱ เวลา 2 ชั่วโมง
  await db.query(
    `
    INSERT INTO bookings
      (user_id, table_no, booking_date, start_time, end_time, people)
    VALUES
      (?, ?, ?, ?, ADDTIME(?, '02:00'), ?)
    `,
    [userId, table, date, time, time, people]
  );
}
