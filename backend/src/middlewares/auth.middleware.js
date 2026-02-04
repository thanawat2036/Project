export function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (
    !req.session ||
    !req.session.user ||
    req.session.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}
