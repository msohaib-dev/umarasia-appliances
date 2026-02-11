import categoriesData from "../data/categories.json";
import heroSlidesData from "../data/hero-slides.json";
import productsData from "../data/products.json";
import type { CartItem, Category, HeroSlide, Product } from "../types";

type RawProduct = {
  id?: string;
  slug: string;
  name: string;
  category?: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  popularity: number;
  description: string;
  images: string[];
  features?: string[];
  shippingDelivery?: string;
  warranty?: string;
  specifications: Product["specifications"];
};

const transformImageUrl = (url: string, seed: string) => {
  if (!url.includes("images.unsplash.com")) return url;
  const widthMatch = url.match(/[?&]w=(\d+)/);
  const width = widthMatch ? Number(widthMatch[1]) : 900;
  const height = Math.round(width * 0.66);
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
};

export const heroSlides: HeroSlide[] = (heroSlidesData as HeroSlide[]).map((slide, index) => ({
  ...slide,
  image: transformImageUrl(slide.image, `hero-slide-${index}`)
}));

export const categories: Category[] = (categoriesData as Category[]).map((category, index) => ({
  ...category,
  image: transformImageUrl(category.image, `category-${category.slug}-${index}`)
}));

const defaultFeatureSet = [
  "Energy efficient motor",
  "Inverter compatible",
  "Low voltage safe",
  "Durable copper winding"
];

const getCategoryTitle = (slug: string) => categories.find((item) => item.slug === slug)?.title ?? "General";

export const products: Product[] = (productsData as RawProduct[]).map((product, index) => {
  const stock = typeof product.stock === "number" ? product.stock : product.inStock ? 12 : 0;

  return {
    id: product.id ?? `prod-${index + 1}`,
    slug: product.slug,
    name: product.name,
    category: product.category ?? getCategoryTitle(product.categorySlug),
    categorySlug: product.categorySlug,
    price: product.price,
    oldPrice: product.oldPrice,
    stock,
    rating: product.rating ?? 4.5,
    reviewCount: product.reviewCount ?? 120 + index * 7,
    popularity: product.popularity,
    description: product.description,
    images: product.images.map((image, imageIndex) => transformImageUrl(image, `${product.slug}-${imageIndex}`)),
    features: product.features?.length ? product.features : defaultFeatureSet,
    shippingDelivery: product.shippingDelivery ?? "2–4 working days across Pakistan.",
    warranty: product.warranty ?? "1 Year official service warranty.",
    specifications: product.specifications ?? []
  };
});

export const defaultCartItems: CartItem[] = [
  { productSlug: "dc-ceiling-fan-56-premium", quantity: 1 },
  { productSlug: "solar-water-pump-1hp", quantity: 1 }
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getProductsByCategory = (slug: string) =>
  products.filter((product) => product.categorySlug === slug);

export const getPopularProducts = (count = 6) =>
  [...products].sort((a, b) => b.popularity - a.popularity).slice(0, count);

export const getRelatedProducts = (product: Product, count = 4) => {
  const sameCategory = products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug);
  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  const fallback = products.filter((item) => item.slug !== product.slug && item.categorySlug !== product.categorySlug);
  return [...sameCategory, ...fallback].slice(0, count);
};

export const getCartDetailedItems = () =>
  defaultCartItems
    .map((item) => {
      const product = getProductBySlug(item.productSlug);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity
      };
    })
    .filter(
      (item): item is { productSlug: string; quantity: number; product: Product; lineTotal: number } =>
        item !== null
    );
