const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAdminUser } = require("../services/adminAuthService");
const { sanitizeText } = require("../utils/security");

const loginAdmin = async (req, res, next) => {
  try {
    const email = sanitizeText(req.body?.email).toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required." });
    }

    const admin = await getAdminUser();

    if (admin.email !== email) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const passwordOk = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "umarasia-admin-secret",
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { id: admin.id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    return next(error);
  }
};

const logoutAdmin = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  return res.status(200).json({ success: true, message: "Logged out." });
};

const getSession = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.admin?.id,
      email: req.admin?.email,
      role: req.admin?.role
    }
  });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getSession
};
