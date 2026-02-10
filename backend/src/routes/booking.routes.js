import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/me", getMyBookings);
router.delete("/:id", cancelBooking);
router.get("/booked-tables", getBookedTables);

export default router;
router.get("/", (req, res) => {
  res.json({ ok: true });
});