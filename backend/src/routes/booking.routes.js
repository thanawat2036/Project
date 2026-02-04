import { Router } from "express";
import * as booking from "../controllers/booking.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/booked-tables", booking.bookedTables);
router.post("/book", requireLogin, booking.bookTable);

export default router;
