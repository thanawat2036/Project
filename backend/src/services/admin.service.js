import  db  from "../config/db.js";

export const getBookings = async () => {
  const {rows} = await db.query(`
    SELECT b.id, u.name customer, b.table_no,
           b.booking_date, b.start_time, b.end_time, b.people
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.booking_date DESC
  `);
  return rows;
};

export const deleteBooking = id =>
  db.query("DELETE FROM bookings WHERE id=?", [id]);

export const getUsers = async () => {
  const {rows} = await db.query(
    "SELECT id,name,email,role FROM users"
  );
  return rows;
};

export const changeRole = ({ userId, role }) =>
  db.query("UPDATE users SET role=? WHERE id=?", [role, userId]);

export const deleteUser = id =>
  db.query("DELETE FROM users WHERE id=?", [id]);

export const getMessages = async () => {
  const {rows} = await db.query(
    "SELECT * FROM messages ORDER BY created_at DESC"
  );
  return rows;
};
