import crypto from "crypto";
import { ensureSupabaseConfigured, supabase } from "./supabase";
import { sanitizeText, slugify } from "./security";

const requireSupabase = () => {
  ensureSupabaseConfigured();
};

const PRODUCT_SELECT = `
  id,
  name,
  slug,
  description,
  price,
  old_price,
  stock,
  images,
  features,
  specifications,
  rating,
  is_featured,
  created_at,
  category_id,
  categories:category_id (
    id,
    name,
    slug
  )
`;

const mapProductPublic = (row: any) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: Number(row.price),
  oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
  stock: Number(row.stock || 0),
  images: Array.isArray(row.images) ? row.images : [],
  features: Array.isArray(row.features) ? row.features : [],
  specifications: Array.isArray(row.specifications) ? row.specifications : [],
  rating: Number(row.rating || 0),
  category: row.categories?.name ?? null,
  categorySlug: row.categories?.slug ?? null,
  categoryId: row.categories?.id ?? null
});

const mapProductAdmin = (row: any) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: Number(row.price),
  old_price: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
  stock: Number(row.stock || 0),
  rating: Number(row.rating || 0),
  tags: [],
  is_featured: Boolean(row.is_featured),
  images: Array.isArray(row.images) ? row.images : [],
  features: Array.isArray(row.features) ? row.features : [],
  specifications: Array.isArray(row.specifications) ? row.specifications : [],
  category_id: row.category_id,
  categories: row.categories
    ? {
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug
      }
    : null,
  created_at: row.created_at
});

const mapCategory = (row: any) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: row.image,
  created_at: row.created_at
});

const validateProductPayload = (payload: any) => {
  const name = sanitizeText(payload?.name);
  const slug = slugify(payload?.slug || name);
  const description = sanitizeText(payload?.description);
  const category_id = sanitizeText(payload?.category_id);
  const price = Number(payload?.price);
  const stock = Number(payload?.stock ?? 0);
  const oldPriceRaw = payload?.old_price ?? payload?.oldPrice;
  const old_price = oldPriceRaw === "" || oldPriceRaw === null || oldPriceRaw === undefined ? null : Number(oldPriceRaw);

  if (!name) throw new Error("name is required.");
  if (!slug) throw new Error("valid slug is required.");
  if (!description) throw new Error("description is required.");
  if (!category_id) throw new Error("category_id is required.");
  if (Number.isNaN(price) || price < 0) throw new Error("price must be a valid non-negative number.");
  if (Number.isNaN(stock) || stock < 0) throw new Error("stock must be a valid non-negative number.");
  if (old_price !== null && (Number.isNaN(old_price) || old_price < 0)) {
    throw new Error("old_price must be a valid non-negative number.");
  }

  const images = Array.isArray(payload?.images)
    ? payload.images.map((item: unknown) => String(item || "").trim()).filter(Boolean)
    : [];
  if (images.length === 0) throw new Error("At least one image is required.");

  const features = Array.isArray(payload?.features)
    ? payload.features.map((item: unknown) => sanitizeText(item)).filter(Boolean)
    : [];

  const specifications = Array.isArray(payload?.specifications)
    ? payload.specifications
        .map((item: any) => ({ label: sanitizeText(item?.label), value: sanitizeText(item?.value) }))
        .filter((item: { label: string; value: string }) => item.label && item.value)
    : [];

  const tags = Array.isArray(payload?.tags)
    ? payload.tags.map((item: unknown) => sanitizeText(item)).filter(Boolean)
    : [];

  return {
    name,
    slug,
    description,
    price,
    old_price,
    stock,
    category_id,
    images,
    features,
    specifications,
    tags,
    is_featured: Boolean(payload?.is_featured)
  };
};

export const getProducts = async () => {
  requireSupabase();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProductPublic);
};

export const getProductByIdOrSlug = async (idOrSlug: string) => {
  requireSupabase();
  const byId = await supabase.from("products").select(PRODUCT_SELECT).eq("id", idOrSlug).maybeSingle();
  if (byId.error) throw byId.error;
  if (byId.data) return mapProductPublic(byId.data);

  const bySlug = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", idOrSlug).maybeSingle();
  if (bySlug.error) throw bySlug.error;
  return bySlug.data ? mapProductPublic(bySlug.data) : null;
};

export const getCategories = async () => {
  requireSupabase();
  const { data, error } = await supabase.from("categories").select("id,name,slug,description,image,created_at").order("name");
  if (error) throw error;
  return (data || []).map(mapCategory);
};

export const getCategoryBySlug = async (slug: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image,created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCategory(data) : null;
};

export const createContactMessage = async (payload: { name: string; email: string; phone: string; message: string }) => {
  requireSupabase();
  const tryInsert = async (table: string): Promise<{ data: any; error: any }> => {
    const result = await supabase.from(table).insert(payload).select("id, created_at").single();
    return result;
  };

  const contactMessageResult = await tryInsert("contact_messages");
  if (!contactMessageResult.error) return contactMessageResult.data;

  const contactsResult = await tryInsert("contacts");
  if (!contactsResult.error) return contactsResult.data;

  throw new Error(
    "Contact table not found. Create `contact_messages` (recommended) or `contacts` in Supabase and enable insert policy."
  );
};

export const createOrder = async (payload: any) => {
  requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
      items: payload.items,
      total_amount: payload.total_amount,
      status: "Pending"
    })
    .select("id, status, created_at")
    .single();

  if (error) throw error;
  return data;
};

export const searchProductsAndSuggestions = async (query: string) => {
  requireSupabase();
  const q = query.trim();
  if (!q) {
    return { suggestions: [], products: [], categories: [] };
  }

  const categoryQuery = await supabase.from("categories").select("id,name,slug").ilike("name", `%${q}%`).limit(20);
  if (categoryQuery.error) throw categoryQuery.error;

  const categoryIds = (categoryQuery.data || []).map((category) => category.id);

  const nameMatchQuery = await supabase
    .from("products")
    .select("id,name,slug,price,old_price,stock,rating,images,category_id,categories:category_id(id,name,slug)")
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
    .limit(20);

  if (nameMatchQuery.error) throw nameMatchQuery.error;

  let categoryMatchProducts: any[] = [];
  if (categoryIds.length > 0) {
    const byCategory = await supabase
      .from("products")
      .select("id,name,slug,price,old_price,stock,rating,images,category_id,categories:category_id(id,name,slug)")
      .in("category_id", categoryIds)
      .limit(20);
    if (byCategory.error) throw byCategory.error;
    categoryMatchProducts = byCategory.data || [];
  }

  const mergedProducts = [...(nameMatchQuery.data || []), ...categoryMatchProducts].filter(
    (item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index
  );

  const products = mergedProducts.slice(0, 20).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
    stock: Number(row.stock || 0),
    rating: Number(row.rating || 0),
    images: Array.isArray(row.images) ? row.images : [],
    category: row.categories?.name ?? null,
    categorySlug: row.categories?.slug ?? null
  }));

  const suggestions = products.slice(0, 8).map((product) => ({
    label: product.name,
    slug: product.slug,
    href: `/product/${product.slug}`
  }));

  return {
    suggestions,
    products: products.slice(0, 12),
    categories: (categoryQuery.data || []).slice(0, 8).map((category) => ({ name: category.name, slug: category.slug }))
  };
};

export const listAdminProducts = async () => {
  requireSupabase();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProductAdmin);
};

export const getAdminProductById = async (id: string) => {
  requireSupabase();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Product not found.");
  return mapProductAdmin(data);
};

export const createAdminProduct = async (payload: any) => {
  requireSupabase();
  const normalized = validateProductPayload(payload);
  const existing = await supabase.from("products").select("id").eq("slug", normalized.slug).limit(1);
  if (existing.error) throw existing.error;
  if ((existing.data || []).length > 0) throw new Error("Product slug already exists.");

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...normalized,
      rating: 4.5
    })
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return mapProductAdmin(data);
};

export const updateAdminProduct = async (id: string, payload: any) => {
  requireSupabase();
  const normalized = validateProductPayload(payload);
  const existing = await supabase.from("products").select("id").eq("slug", normalized.slug).neq("id", id).limit(1);
  if (existing.error) throw existing.error;
  if ((existing.data || []).length > 0) throw new Error("Product slug already exists.");

  const { data, error } = await supabase
    .from("products")
    .update({
      ...normalized
    })
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return mapProductAdmin(data);
};

export const deleteAdminProduct = async (id: string) => {
  requireSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

export const listAdminCategories = async () => {
  requireSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapCategory);
};

export const getAdminCategoryById = async (id: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Category not found.");
  return mapCategory(data);
};

const validateCategoryPayload = (payload: any) => {
  const name = sanitizeText(payload?.name);
  const description = sanitizeText(payload?.description);
  const image = String(payload?.image || "").trim();
  const slug = slugify(payload?.slug || name);

  if (!name) throw new Error("name is required.");
  if (!description) throw new Error("description is required.");
  if (!image) throw new Error("image is required.");
  if (!slug) throw new Error("valid slug is required.");

  return { name, description, image, slug };
};

export const createAdminCategory = async (payload: any) => {
  requireSupabase();
  const normalized = validateCategoryPayload(payload);
  const existing = await supabase.from("categories").select("id").eq("slug", normalized.slug).limit(1);
  if (existing.error) throw existing.error;
  if ((existing.data || []).length > 0) throw new Error("Category slug already exists.");

  const { data, error } = await supabase
    .from("categories")
    .insert(normalized)
    .select("id,name,slug,description,image,created_at")
    .single();
  if (error) throw error;
  return mapCategory(data);
};

export const updateAdminCategory = async (id: string, payload: any) => {
  requireSupabase();
  const normalized = validateCategoryPayload(payload);
  const existing = await supabase.from("categories").select("id").eq("slug", normalized.slug).neq("id", id).limit(1);
  if (existing.error) throw existing.error;
  if ((existing.data || []).length > 0) throw new Error("Category slug already exists.");

  const { data, error } = await supabase
    .from("categories")
    .update(normalized)
    .eq("id", id)
    .select("id,name,slug,description,image,created_at")
    .single();
  if (error) throw error;
  return mapCategory(data);
};

export const deleteAdminCategory = async (id: string) => {
  requireSupabase();
  const linked = await supabase.from("products").select("id").eq("category_id", id).limit(1);
  if (linked.error) throw linked.error;
  if ((linked.data || []).length > 0) throw new Error("Cannot delete category with linked products.");

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
};

export const listAdminOrders = async () => {
  requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("id,customer_name,email,phone,city,address,items,total_amount,status,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getAdminOrderById = async (id: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("id,customer_name,email,phone,city,address,items,total_amount,status,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Order not found.");
  return data;
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
  requireSupabase();
  const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) throw new Error("Invalid status.");

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id,customer_name,email,phone,city,address,items,total_amount,status,created_at")
    .single();
  if (error) throw error;
  return data;
};

export const getAdminStats = async () => {
  const [products, categories, orders] = await Promise.all([listAdminProducts(), listAdminCategories(), listAdminOrders()]);

  return {
    productCount: products.length,
    categoryCount: categories.length,
    orderCount: orders.length,
    pendingOrders: orders.filter((order) => order.status === "Pending").length
  };
};

export const getHeroSlides = async () => {
  requireSupabase();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id,title,subtitle,image,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const replaceHeroSlides = async (slides: any[]) => {
  requireSupabase();
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("At least one hero slide is required.");
  }

  const normalized = slides
    .map((slide, index) => ({
      title: sanitizeText(slide?.title),
      subtitle: sanitizeText(slide?.subtitle),
      image: String(slide?.image || "").trim(),
      sort_order: index + 1,
      is_active: slide?.is_active !== false
    }))
    .filter((slide) => slide.title && slide.subtitle && slide.image);

  if (!normalized.length) {
    throw new Error("Hero slides contain invalid entries.");
  }

  const deleted = await supabase.from("hero_slides").delete().gte("id", 0);
  if (deleted.error) throw deleted.error;

  const { data, error } = await supabase
    .from("hero_slides")
    .insert(normalized)
    .select("id,title,subtitle,image,sort_order,is_active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const uploadImageToStorage = async (file: File) => {
  requireSupabase();
  const originalName = String(file.name || "image").replace(/[^a-zA-Z0-9_.-]/g, "-");
  const extension = originalName.includes(".") ? originalName.split(".").pop() : "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
  const filePath = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const upload = await supabase.storage.from(bucket).upload(filePath, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (upload.error) {
    throw upload.error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Unable to generate public URL.");
  }

  return {
    value: data.publicUrl,
    path: filePath
  };
};
