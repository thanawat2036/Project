export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session?.userId || !req.session.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
