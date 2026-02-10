import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import promoRoutes from "./routes/promo.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "bourbonyard.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false   // Render https = true (ถ้าเปิด https)
    }
  })
);

// frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// api
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promos", promoRoutes);

app.use(express.static(frontendPath));

// pages
const serve = (file) => (req, res) =>
  res.sendFile(path.join(frontendPath, file));

app.get("/", serve("user.html"));
app.get("/user.html", serve("user.html"));
app.get("/profile.html", serve("profile.html"));
app.get("/booking.html", serve("booking.html"));
app.get("/wine.html", serve("wine.html"));
app.get("/admin.html", serve("admin.html"));

export default app;