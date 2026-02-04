import { Router } from "express";
import {
  login,
  register,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = Router();

// DEBUG (ชั่วคราว)
console.log("login:", login);
console.log("register:", register);
console.log("logout:", logout);
console.log("me:", me);
console.log("requireLogin:", requireLogin);

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", requireLogin, me);

export default router;
