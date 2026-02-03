import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import sessionConfig from "../config/session.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(session(sessionConfig));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(errorMiddleware);

export default app;
