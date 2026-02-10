import * as auth from "../services/auth.service.js";

/* ===============================
   REGISTER
================================ */
export const register = async (req, res, next) => {
  try {
    await auth.createUser(req.body);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   LOGIN
================================ */
export const login = async (req, res) => {
  const user = await auth.loginUser(req.body);
  if (!user)
    return res.status(401).json({ message: "Login failed" });

  req.session.userId = user.id;
  req.session.isAdmin = user.role === "admin";

  res.json({
    success: true,
    role: user.role   // ⭐ สำคัญ
  });
};

/* ===============================
   ME
================================ */
export const me = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  const user = await auth.getUserById(req.session.userId);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: req.session.isAdmin
  });
};

/* ===============================
   LOGOUT
================================ */
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("bourbonyard.sid"); // ⭐ ให้ตรงกับ session name
    res.json({ success: true });
  });
};
