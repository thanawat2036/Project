// middlewares/auth.middleware.js

// ต้อง login
export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// ต้องเป็น admin
export const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login.html");
  }

  if (!req.session.isAdmin) {
    return res.status(403).send("Forbidden");
  }

  next();
};

// backward compatible (เผื่อที่อื่นยัง import default)
export default function authMiddleware(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
