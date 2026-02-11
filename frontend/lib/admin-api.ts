import { API_BASE_URL } from "@/lib/api";

export const ADMIN_API = {
  login: `${API_BASE_URL}/api/admin/auth/login`,
  logout: `${API_BASE_URL}/api/admin/auth/logout`,
  session: `${API_BASE_URL}/api/admin/auth/session`,
  dashboard: `${API_BASE_URL}/api/admin/dashboard`,
  heroSlides: `${API_BASE_URL}/api/admin/hero-slides`,
  products: `${API_BASE_URL}/api/admin/products`,
  categories: `${API_BASE_URL}/api/admin/categories`,
  orders: `${API_BASE_URL}/api/admin/orders`,
  uploadImage: `${API_BASE_URL}/api/admin/upload-image`
};

export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers || {})
    }
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Admin request failed.");
  }

  return payload.data as T;
}
