import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

/* ===============================
   FIX __dirname (ESM)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   MIDDLEWARE
================================ */
app.set("trust proxy", 1); // ถ้าใช้กับ Heroku ต้องตั้งค่านี้
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "bourbon-yard-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);

/* ===============================
   STATIC FILES (⭐ สำคัญมาก)
================================ */
app.use(express.static(path.join(__dirname, "../../frontend")));

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

/* ===============================
   ROOT ROUTE
================================ */
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

/* ===============================
   FALLBACK (404)
================================ */
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

export default app;
