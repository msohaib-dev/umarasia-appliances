import type { Category, Product } from "@/types";

type ApiCategory = {
  slug?: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
};

type ApiProduct = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string | null;
  categorySlug?: string | null;
  price?: number;
  oldPrice?: number | null;
  stock?: number;
  rating?: number;
  description?: string;
  images?: string[];
  features?: string[];
  specifications?: Product["specifications"];
};

const toShort = (text: string, limit = 90) => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
};

export const mapApiCategoryToCategory = (item: ApiCategory): Category => {
  const title = String(item?.name || item?.title || "General");
  const description = String(item?.description || "").trim() || `${title} products`;

  return {
    slug: String(item?.slug || "general"),
    title,
    shortDescription: toShort(description, 80),
    description,
    image: String(item?.image || "https://picsum.photos/seed/category-fallback/1200/800")
  };
};

export const mapApiProductToProduct = (item: ApiProduct, index = 0): Product => {
  const name = String(item?.name || "Product");
  const slug = String(item?.slug || `product-${index + 1}`);
  const description = String(item?.description || "").trim() || `${name} details`;
  const rating = Number(item?.rating || 4.5);

  return {
    id: String(item?.id || slug),
    slug,
    name,
    category: String(item?.category || "General"),
    categorySlug: String(item?.categorySlug || "general"),
    price: Number(item?.price || 0),
    oldPrice: item?.oldPrice ?? undefined,
    stock: Number(item?.stock || 0),
    rating,
    reviewCount: 100 + index * 3,
    popularity: Math.round(rating * 20),
    description,
    images: Array.isArray(item?.images) && item.images.length > 0 ? item.images : ["https://picsum.photos/seed/product-fallback/1200/800"],
    features: Array.isArray(item?.features) && item.features.length > 0 ? item.features : ["Durable build", "Energy efficient"],
    shippingDelivery: "2–4 working days across Pakistan.",
    warranty: "1 Year official service warranty.",
    specifications: Array.isArray(item?.specifications) ? item.specifications : []
  };
};
