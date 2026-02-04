// src/services/auth.service.js
import  db  from "../config/db.js";
import bcrypt from "bcrypt";

export async function login({ email, password }) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) throw new Error("ไม่พบผู้ใช้");

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("รหัสผ่านไม่ถูกต้อง");

  delete user.password;
  return user;
}

export async function register({ name, email, password }) {
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?, 'user')",
    [name, email, hash]
  );
}
