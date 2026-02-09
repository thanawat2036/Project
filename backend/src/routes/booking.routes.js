import express from "express";
import {
  createBooking,
  myBookings,
  cancelBooking,
  getBookedTables,
} from "../controllers/booking.controller.js";

const router = express.Router();

/* ===== USER BOOKINGS ===== */
router.get("/", myBookings);

/* ===== CREATE BOOKING ===== */
router.post("/", createBooking);

/* ===== CANCEL BOOKING ===== */
router.put("/:id/cancel", cancelBooking);

router.get("/", getBookedTables);

export default router;
