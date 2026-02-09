import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "bourbonyard",
    resave: false,
    saveUninitialized: false,
  })
);

// api
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

export default app;