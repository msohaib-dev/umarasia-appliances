const crypto = require("crypto");
const xss = require("xss");

const sanitizeText = (value) =>
  xss(String(value || ""), { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
    .trim()
    .replace(/\s+/g, " ");

const sanitizeSlugInput = (value) => sanitizeText(value).replace(/[^a-zA-Z0-9\s-]/g, "");

const slugify = (value) =>
  sanitizeSlugInput(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const signImageToken = (filename, expiresAt) => {
  const secret = process.env.IMAGE_TOKEN_SECRET || process.env.JWT_SECRET || "umarasia-image-secret";
  const payload = `${filename}:${expiresAt}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
};

const generateImageAccessQuery = (filename, ttlSeconds = 300) => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const token = signImageToken(filename, expiresAt);
  return `expires=${expiresAt}&token=${token}`;
};

const toPublicImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return raw;

  if (raw.startsWith("upload:")) {
    const filename = raw.replace("upload:", "");
    const base = process.env.PUBLIC_API_BASE_URL || "http://localhost:5000";
    return `${base}/api/image/${encodeURIComponent(filename)}?${generateImageAccessQuery(filename)}`;
  }

  return raw;
};

const isValidImageAccess = ({ filename, token, expires }) => {
  const expiresAt = Number(expires);
  if (!filename || !token || Number.isNaN(expiresAt) || expiresAt < Date.now()) {
    return false;
  }
  const expected = signImageToken(filename, expiresAt);
  if (expected.length !== String(token).length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(token)));
};

module.exports = {
  sanitizeText,
  slugify,
  generateImageAccessQuery,
  isValidImageAccess,
  toPublicImageUrl
};
