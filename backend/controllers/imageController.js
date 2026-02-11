const path = require("path");
const fs = require("fs");
const { uploadsDir } = require("../services/adminDataService");
const { isValidImageAccess } = require("../utils/security");

const streamImage = (req, res) => {
  const filename = String(req.params.filename || "");
  const token = String(req.query.token || "");
  const expires = String(req.query.expires || "");

  if (!isValidImageAccess({ filename, token, expires })) {
    return res.status(401).json({ success: false, message: "Invalid or expired image access." });
  }

  const absolutePath = path.join(uploadsDir, filename);
  if (!absolutePath.startsWith(uploadsDir) || !fs.existsSync(absolutePath)) {
    return res.status(404).json({ success: false, message: "Image not found." });
  }

  res.setHeader("Content-Disposition", "inline");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return res.sendFile(absolutePath);
};

module.exports = {
  streamImage
};
