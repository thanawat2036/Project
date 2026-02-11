import express from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import * as admin from "../controllers/admin.controller.js";

const router = express.Router();

router.use(adminMiddleware);

/* การจอง */
router.get("/bookings", admin.getAllBookings);
router.put("/bookings/:id/cancel", admin.cancelBooking);

/* โต๊ะ */
router.get("/tables", admin.getTables);
router.put("/tables/:id/open", admin.openTable);
router.put("/tables/:id/close", admin.closeTable);

/* USERS */
router.get("/users", admin.getAllUsers);
router.delete("/users/:id", admin.removeUser);

/* MESSAGES */
router.get("/messages", admin.getAllMessages);
router.post("/messages/:id/reply", admin.sendReply);
/* ===== TABLES CLOSE BY DATE ===== */
router.post("/close-table", admin.closeTableByDate);
router.post("/open-table", admin.openTableByDate);


export default router;
