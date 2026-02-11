export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

export type Category = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  description: string;
  images: string[];
  features: string[];
  shippingDelivery: string;
  warranty: string;
  specifications: ProductSpec[];
};

export type CartItem = {
  productSlug: string;
  quantity: number;
};
