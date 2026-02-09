// booking.routes.js
import express from "express";
import { bookedTables, book } from "../controllers/booking.controller.js";
const router = express.Router();

router.get("/booked-tables", bookedTables);
router.post("/book", book);

export default router;
