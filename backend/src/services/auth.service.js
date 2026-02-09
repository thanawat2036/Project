// src/services/auth.service.js
import db from "../config/db.js";
import bcrypt from "bcrypt";

export async function login({ email, password }) {
  const {rows} = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
};

export const loginUser = async ({ email, password }) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = rows[0];
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
};

export const getUserById = async id => {
  const { rows } = await db.query(
    "SELECT id,name,email FROM users WHERE id=$1",
    [id]
  );
  return rows[0];
};
