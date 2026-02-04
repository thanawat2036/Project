import {
  login as loginService,
  register as registerService,
} from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const user = await loginService(req.body);

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    req.session.user = user;
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    await registerService(req.body);
    res.json({ message: "register success" });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "logout" });
  });
};

export const me = (req, res) => {
  res.json(req.session.user || null);
};
