import * as service from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    await service.createUser(req.body);
    res.json({ message: "registered" });
  } catch (e) { next(e); }
};

export const login = async (req, res) => {
  const user = await service.loginUser(req.body);
  if (!user) return res.status(401).json({ message: "Login failed" });

  req.session.userId = user.id;
  res.json({ success: true });
};

export const me = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  const user = await service.getUserById(req.session.userId);
  res.json(user);
};

export const logout = (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
};
