import db from "../config/db.js";

/* =========================
   GET BOOKED TABLES
========================= */
export const getBookedTables = async ({ date, time }) => {
  const { rows } = await db.query(
    `
    SELECT table_no
    FROM bookings
    WHERE booking_date = $1
      AND $2 BETWEEN start_time AND end_time
    `,
    [date, time]
  );

  return rows.map(r => r.table_no);
};

/* =========================
   CREATE BOOKING
========================= */
export const createBooking = async (userId, data) => {
  const {
    table_no,
    booking_date,
    start_time,
    end_time,
    people,
  } = data;

  await db.query(
    `
    INSERT INTO bookings
      (user_id, table_no, booking_date, start_time, end_time, people)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    `,
    [
      userId,
      table_no,
      booking_date,
      start_time,
      end_time,
      people,
    ]
  );
};
