import express from "express";
import {
  createBooking,
  myBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

/* ===== USER BOOKINGS ===== */
router.get("/", myBookings);

/* ===== CREATE BOOKING ===== */
router.post("/", createBooking);

/* ===== CANCEL BOOKING ===== */
router.put("/:id/cancel", cancelBooking);

export default router;
