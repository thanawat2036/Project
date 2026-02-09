import express from "express";
import * as ctrl from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", ctrl.createBooking);
router.get("/my", ctrl.myBookings);
router.put("/:id/cancel", ctrl.cancelBooking);
router.get("/", ctrl.getBookedTables);

export default router;
