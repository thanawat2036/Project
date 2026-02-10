import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userAdminRoutes from "./routes/user.admin.routes.js";

const app = express();

/* ===============================
   FIX __dirname (ESM)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   MIDDLEWARE
================================ */
app.set("trust proxy", 1);
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
   STATIC FILES
================================ */
app.use(express.static(path.join(__dirname, "../../frontend")));

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

/* ⭐ ADMIN & MESSAGE */
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin/users", userAdminRoutes);

/* ===============================
   ROOT
================================ */
app.get("/", (req, res) => {
  res.redirect("/login.html");
});
app.get("/admin", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/admin.html"));
});

/* ===============================
   404
================================ */
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

export default app;
console.log("BOOKING ROUTE LOADED");
console.log(bookingRoutes);