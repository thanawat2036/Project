import express from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import * as users from "../controllers/user.admin.controller.js";

const router = express.Router();
router.use(adminMiddleware);

router.get("/", users.getAllUsers);
router.delete("/:id", users.deleteUser);

export default router;
