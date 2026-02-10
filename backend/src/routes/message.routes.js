import express from "express";
import * as msg from "../controllers/message.controller.js";

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
   USER SEND MESSAGE
================================ */
router.post("/", msg.sendMessage);

/* ===============================
   ADMIN: VIEW + REPLY
================================ */
router.get("/", adminOnly, msg.getAllMessages);
router.post("/reply/:id", adminOnly, msg.replyMessage);

export default router;
