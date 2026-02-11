import crypto from "crypto";
import { sanitizeText } from "./security";

const safeEqual = (a: string, b: string): boolean => {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  if (first.length !== second.length) return false;
  return crypto.timingSafeEqual(first, second);
};

export const getAdminUser = () => {
  const email = String(process.env.ADMIN_EMAIL || "admin@umarasia.com").toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || "Admin@123");

  return {
    id: "admin-1",
    email,
    password,
    role: "admin"
  };
};

export const validateAdminCredentials = (emailInput: unknown, passwordInput: unknown) => {
  const admin = getAdminUser();
  const email = sanitizeText(emailInput).toLowerCase();
  const password = String(passwordInput || "");

  const emailOk = safeEqual(email, admin.email);
  const passwordOk = safeEqual(password, admin.password);

  if (!emailOk || !passwordOk) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role
  };
};
