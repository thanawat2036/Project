export function adminMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.session.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
  console.log("SESSION:", req.session);
}