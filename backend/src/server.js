import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// frontend path
const frontendPath = path.join(__dirname, "../../frontend");
console.log("Frontend path:", frontendPath);

app.use(express.static(frontendPath));

// fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
  console.log("DATABASE_URL =", process.env.DATABASE_URL ? "✅ SET" : "❌ UNDEFINED");
});
