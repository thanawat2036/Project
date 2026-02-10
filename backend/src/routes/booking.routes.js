import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

/* ===== CREATE BOOKING ===== */
router.post("/", createBooking);

/* ===== GET MY BOOKINGS ===== */
router.get("/my", getMyBookings);

/* ===== CANCEL ===== */
router.delete("/:id", cancelBooking);

/* ===== GET BOOKED TABLES ===== */
router.get("/booked", getBookedTables);

export default router;
router.get("/", (req, res) => {
  res.json({ ok: true });
});