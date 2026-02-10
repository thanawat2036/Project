import express from "express";
import * as admin from "../controllers/admin.controller.js";

const router = express.Router();

/* ===== TABLE MANAGEMENT ===== */
router.post("/close-table", admin.closeTable);
router.post("/open-table", admin.openTable);

/* ===== BOOKINGS ===== */
router.get("/bookings", admin.getAllBookings);

/* ===== USERS ===== */
router.get("/users", admin.getUsers);

/* ===== MESSAGES ===== */
router.get("/messages", admin.getMessages);
router.post("/reply/:id", admin.replyMessage);

export default router;
