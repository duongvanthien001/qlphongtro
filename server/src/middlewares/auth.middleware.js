const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại" });
  }

  const [_bearer, authToken] = token.split(" ");

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const checkRoles = (roles) => {
  return (req, res, next) => {
    // Check if user's role is included in allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập",
      });
    }
    next();
  };
};

module.exports = { authMiddleware, checkRoles };
