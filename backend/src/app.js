import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

/* 🔥 FIX ตรงนี้ */
app.use(express.static(
  path.join(__dirname, "../../frontend")
));

app.use(session({
  secret: "bourbonyard",
  resave: false,
  saveUninitialized: false
}));

app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use(errorMiddleware);

export default app;
