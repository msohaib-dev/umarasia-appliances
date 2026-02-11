import { categories as fallbackCategories, products as fallbackProducts } from "../data";
import { getCategories, getProducts } from "./data";
import { mapApiCategoryToCategory, mapApiProductToProduct } from "../storefront-mappers";
import type { Category, Product } from "../../types";

export const getStorefrontCategories = async (): Promise<Category[]> => {
  try {
    const data = await getCategories();
    if (!Array.isArray(data) || data.length === 0) return fallbackCategories;
    return data.map(mapApiCategoryToCategory);
  } catch (_error) {
    return fallbackCategories;
  }
};

export const getStorefrontProducts = async (): Promise<Product[]> => {
  try {
    const data = await getProducts();
    if (!Array.isArray(data) || data.length === 0) return fallbackProducts;
    return data.map(mapApiProductToProduct);
  } catch (_error) {
    return fallbackProducts;
  }
};

export const getStorefrontCatalog = async (): Promise<{ categories: Category[]; products: Product[] }> => {
  const [categories, products] = await Promise.all([getStorefrontCategories(), getStorefrontProducts()]);
  return { categories, products };
};
