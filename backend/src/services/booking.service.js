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
