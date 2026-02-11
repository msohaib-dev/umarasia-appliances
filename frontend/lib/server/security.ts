import crypto from "crypto";

export const sanitizeText = (value: unknown): string =>
  String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .replace(/\s+/g, " ");

export const slugify = (value: unknown): string =>
  sanitizeText(value)
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const signImageToken = (filename: string, expiresAt: number): string => {
  const secret = process.env.IMAGE_TOKEN_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("IMAGE_TOKEN_SECRET or JWT_SECRET must be configured.");
  }

  return crypto.createHmac("sha256", secret).update(`${filename}:${expiresAt}`).digest("hex");
};

export const generateImageAccessQuery = (filename: string, ttlSeconds = 300): string => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const token = signImageToken(filename, expiresAt);
  return `expires=${expiresAt}&token=${token}`;
};

export const toPublicImageUrl = (value: unknown): string => {
  const raw = String(value ?? "").trim();
  if (!raw) return raw;

  if (raw.startsWith("upload:")) {
    const filename = raw.replace("upload:", "");
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return `${base}/api/image/${encodeURIComponent(filename)}?${generateImageAccessQuery(filename)}`;
  }

  return raw;
};
