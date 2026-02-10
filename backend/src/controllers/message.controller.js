import db from "../config/db.js";

/* ===============================
   USER SEND MESSAGE
================================ */
export const sendMessage = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  if (!req.body.message)
    return res.status(400).json({ message: "กรุณากรอกข้อความ" });

  await db.query(
    `INSERT INTO messages (user_id, message)
     VALUES ($1, $2)`,
    [req.session.userId, req.body.message]
  );

  res.json({ success: true });
};

/* ===============================
   ADMIN: GET ALL MESSAGES
================================ */
export const getAllMessages = async (req, res) => {
  if (!req.session.isAdmin)
    return res.status(403).json({ message: "Admin only" });

  const { rows } = await db.query(`
    SELECT 
      m.id,
      m.message,
      m.reply,
      m.created_at,
      u.name AS user_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
  `);

  res.json(rows);
};

/* ===============================
   ADMIN: REPLY MESSAGE
================================ */
export const replyMessage = async (req, res) => {
  if (!req.session.isAdmin)
    return res.status(403).json({ message: "Admin only" });

  await db.query(
    `UPDATE messages
     SET reply = $1
     WHERE id = $2`,
    [req.body.reply, req.params.id]
  );

  res.json({ success: true });
};
