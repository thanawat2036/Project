import db from "../config/db.js";

/* ===== BOOKINGS ===== */
export const getBookings = async () => {
  const result = await db.query(`
    SELECT 
      b.id,
      b.book_date,
      b.book_time,
      b.table_no,
      b.status,
      b.people,
      u.name AS customer
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.book_date DESC
  `);

  return result.rows;
};


export const cancelBooking = async (id) => {
  await db.query(
    "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
    [id]
  );
};

/* ===== TABLES ===== */
export const getTables = async () => {
  const result = await db.query(
    "SELECT id, table_no, status FROM tables ORDER BY table_no"
  );
  return result.rows;
};

export const updateTableStatus = async (id, status) => {
  await db.query(
    "UPDATE tables SET status = $1 WHERE id = $2",
    [status, id]
  );
};
