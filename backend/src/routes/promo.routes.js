import express from "express";
import * as controller from "../controllers/promo.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", auth, controller.create);

export default router;
