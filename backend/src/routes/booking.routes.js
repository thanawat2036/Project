import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/booked-tables", getBookedTables);

router.post("/", createBooking);

router.get("/me", getMyBookings);

router.delete("/:id", cancelBooking);

export default router;
