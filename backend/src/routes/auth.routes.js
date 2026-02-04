import { Router } from "express";
import {
  login,
  register,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", requireLogin, me);

export default router;
