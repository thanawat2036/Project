import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedTables
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getBookedTables);              // ?date=&time=
router.post("/", createBooking);               // จองโต๊ะ
router.get("/me", getMyBookings);               // ⭐ ประวัติฉัน
router.delete("/:id", cancelBooking);           // ⭐ ยกเลิก

export default router;
