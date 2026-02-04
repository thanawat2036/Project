import { login as loginService, register as registerService } 
  from "../services/auth.service.js";

export const login = async (req, res) => {
  const user = await loginService(req.body);
  req.session.user = user;
  res.json({ user });
};

export const register = async (req, res) => {
  await registerService(req.body);
  res.json({ message: "register success" });
};

export function logout(req, res) {
  req.session.destroy(() => {
    res.json({ message: "logout" });
  });
}

export function me(req, res) {
  res.json(req.session.user);
}
