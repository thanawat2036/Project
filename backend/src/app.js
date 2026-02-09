import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "bourbonyard",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));


app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use(errorMiddleware);

export default app;
