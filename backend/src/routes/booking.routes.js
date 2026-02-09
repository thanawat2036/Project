import express from "express";
import {
  createBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getBookedTables);
router.post("/", createBooking);

export default router;
