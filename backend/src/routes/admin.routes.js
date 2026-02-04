import { Router } from "express";
import * as admin from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// ต้อง login + เป็น admin เท่านั้น
router.use(requireAdmin);

router.get("/bookings", admin.bookings);
router.delete("/bookings/:id", admin.deleteBooking);

router.get("/users", admin.users);
router.put("/users/role", admin.changeRole);
router.delete("/users/:id", admin.deleteUser);

router.get("/messages", admin.messages);

export default router;
