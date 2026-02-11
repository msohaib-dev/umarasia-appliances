export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const API_ROUTES = {
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  search: `${API_BASE_URL}/api/search`,
  heroSlides: `${API_BASE_URL}/api/hero-slides`,
  orders: `${API_BASE_URL}/api/orders`,
  contact: `${API_BASE_URL}/api/contact`
};
