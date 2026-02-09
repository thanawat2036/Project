import * as auth from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    await auth.createUser(req.body);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res) => {
  const user = await auth.loginUser(req.body);
  if (!user)
    return res.status(401).json({ message: "Login failed" });

  req.session.userId = user.id;
  req.session.role = user.role;

  res.json({ success: true });
};

export const me = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  const user = await auth.getUserById(req.session.userId);
  res.json(user);
};

/* ===== LOGOUT ===== */
export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err)
      return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("connect.sid"); // สำคัญมากตอน deploy
    res.json({ success: true });
  });
};
