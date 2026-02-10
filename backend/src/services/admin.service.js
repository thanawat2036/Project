import db from "../config/db.js";

/* ===== BOOKINGS ===== */
export const getAllBookings = async () => {
  const { rows } = await db.query(`
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
    ORDER BY b.booking_date DESC
  `);
  return rows;
};

export const cancelBooking = async (id) => {
  await db.query("DELETE FROM bookings WHERE id = $1", [id]);
};

/* ===== TABLES ===== */
export const getTables = async () => {
  const { rows } = await db.query(
    "SELECT id, table_no, status FROM tables ORDER BY table_no"
  );
  return rows;
};

export const updateTableStatus = async (id, status) => {
  await db.query(
    "UPDATE tables SET status = $1 WHERE id = $2",
    [status, id]
  );
};
