import * as service from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const user = await service.login(req.body);
    req.session.user = user;
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    await service.register(req.body);
    res.json({ message: "register success" });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.json({ message: "logout" });
  });
}

export function me(req, res) {
  res.json(req.session.user);
}
