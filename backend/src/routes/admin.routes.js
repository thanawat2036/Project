import express from "express";
import * as admin from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/bookings", requireAdmin, admin.getAllBookings);
router.delete("/bookings/:id", requireAdmin, admin.cancelBooking);
router.post("/close-table", requireAdmin, admin.closeTable);

export default router;
