import express from "express";
import session from "express-session";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* =========================
   SESSION
========================= */
app.use(
  session({
    name: "bourbon.sid",
    secret: process.env.SESSION_SECRET || "bourbon-yard-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 4, // 4 ชั่วโมง
    },
  })
);

/* =========================
   ROUTES
========================= */
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

export default app;
