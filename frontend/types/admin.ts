export type AdminSession = {
  id: string;
  email: string;
  role: string;
};

export type AdminStats = {
  productCount: number;
  categoryCount: number;
  orderCount: number;
  pendingOrders: number;
};

export type AdminHeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  sort_order: number;
  is_active: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  created_at: string;
};

export type AdminSpecification = {
  label: string;
  value: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  stock: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  images: string[];
  features: string[];
  specifications: AdminSpecification[];
  category_id: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  created_at: string;
};

export type AdminOrder = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
  total_amount: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  created_at: string;
};
