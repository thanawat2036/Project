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

/* ===== USERS ===== */
export const getUsers = async () => {
  const result = await db.query(`
    SELECT id, name, email, role
    FROM users
    ORDER BY id DESC
  `);
  return result.rows;
};

export const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = $1", [id]);
};

/* ===== TABLE CLOSURES ===== */

export const closeTable = async (table_no, date) => {
  await db.query(
    "INSERT INTO table_closures (table_no, close_date) VALUES ($1, $2)",
    [table_no, date]
  );
};

export const openTable = async (table_no, date) => {
  await db.query(
    "DELETE FROM table_closures WHERE table_no = $1 AND close_date = $2",
    [table_no, date]
  );
};

/* ===== MESSAGES ===== */
export const getMessages = async () => {
  const result = await db.query(`
    SELECT m.id, m.message, m.reply, m.created_at,
           u.name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
  `);
  return result.rows;
};

export const replyMessage = async (id, reply) => {
  await db.query(
    "UPDATE messages SET reply = $1 WHERE id = $2",
    [reply, id]
  );
};
