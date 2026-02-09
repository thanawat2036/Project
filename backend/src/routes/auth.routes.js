// auth.routes.js
import express from "express";
import { login, register, me, logout } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", me);
router.post("/logout", logout);

export default router;
