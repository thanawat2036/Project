import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   ADMIN ONLY MIDDLEWARE
================================ */
const adminOnly = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

/* ===============================
   GET ALL USERS
================================ */
router.get("/", adminOnly, async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, name, email, role
     FROM users
     ORDER BY id`
  );
  res.json(rows);
});

/* ===============================
   DELETE USER
================================ */
router.delete("/:id", adminOnly, async (req, res) => {
  const userId = Number(req.params.id);

  // ❗ กันลบตัวเอง
  if (req.session.userId === userId) {
    return res.status(400).json({ message: "ไม่สามารถลบบัญชีตัวเองได้" });
  }

  const result = await db.query(
    `DELETE FROM users WHERE id=$1`,
    [userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "ไม่พบผู้ใช้" });
  }

  res.json({ success: true });
});

export default router;
