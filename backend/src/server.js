import express from "express";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";
import {db} from "./config/db.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 frontend อยู่ที่ project-root/frontend
const frontendPath = path.join(__dirname, "../../frontend");

console.log("Frontend path:", frontendPath); // debug ได้

app.use(express.static(frontendPath));

// fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

db.query("SELECT 1")
  .then(() => console.log("✅ MySQL connected"))
  .catch(err => console.error("❌ MySQL error", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
