import db from "../config/db.js";

/* ===============================
   GET ALL USERS
================================ */
export const getAll = async () => {
  const [rows] = await db.query(`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
  `);
  return rows;
};

/* ===============================
   DELETE USER
================================ */
export const remove = async (id) => {
  await db.query(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
};
