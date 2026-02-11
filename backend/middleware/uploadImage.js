const path = require("path");
const multer = require("multer");
const { uploadsDir } = require("../services/adminDataService");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

const fileFilter = (_req, file, cb) => {
  if (!allowedTypes.has(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
  }
  return cb(null, true);
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

module.exports = uploadImage;
