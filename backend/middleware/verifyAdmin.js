const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "umarasia-admin-secret");
    req.admin = decoded;
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
};

module.exports = verifyAdmin;
