import { cookies } from "next/headers";
import { verifyAdminJwt } from "./jwt";

export const getAdminFromCookie = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || "";
  return verifyAdminJwt(token);
};

export const requireAdmin = async () => {
  const admin = await getAdminFromCookie();
  if (!admin) {
    const error = new Error("Unauthorized.");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
  return admin;
};
