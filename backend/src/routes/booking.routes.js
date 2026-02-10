import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

import { requireAuth } from "../middlewares/auth.middleware.js";

router.post("/", requireAuth, createBooking);
router.get("/me", requireAuth, getMyBookings);
router.delete("/:id", requireAuth, cancelBooking);
router.get("/booked-tables", getBookedTables);

export default router;
router.get("/", (req, res) => {
  res.json({ ok: true });
});