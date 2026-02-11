export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const API_ROUTES = {
  search: `${API_BASE_URL}/api/search`,
  heroSlides: `${API_BASE_URL}/api/hero-slides`,
  orders: `${API_BASE_URL}/api/orders`,
  contact: `${API_BASE_URL}/api/contact`
};
