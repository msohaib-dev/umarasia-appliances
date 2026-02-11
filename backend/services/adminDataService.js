const fs = require("fs");
const path = require("path");
const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");
const { products: dummyProducts, categories: dummyCategories } = require("./dummyData");
const { dummyOrders } = require("./orderService");
const { generateImageAccessQuery, sanitizeText, slugify } = require("../utils/security");

const uploadsDir = path.join(__dirname, "..", "uploads");

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

ensureUploadsDir();

const secureImageUrl = (value) => {
  if (!value) return value;
  if (String(value).startsWith("upload:")) {
    const filename = value.replace("upload:", "");
    const base = process.env.PUBLIC_API_BASE_URL || "http://localhost:5000";
    return `${base}/api/image/${encodeURIComponent(filename)}?${generateImageAccessQuery(filename)}`;
  }
  return value;
};

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: secureImageUrl(row.image),
  created_at: row.created_at
});

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: Number(row.price),
  old_price: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
  stock: Number(row.stock || 0),
  rating: Number(row.rating || 0),
  tags: Array.isArray(row.tags)
    ? row.tags
    : String(row.tags || "")
        .split(",")
        .map((item) => sanitizeText(item))
        .filter(Boolean),
  is_featured: Boolean(row.is_featured),
  images: Array.isArray(row.images) ? row.images.map(secureImageUrl) : [],
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

const validateImageList = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("At least one image is required.");
  }

  const sanitized = images
    .map((item) => sanitizeText(item))
    .filter(Boolean)
    .map((item) => {
      if (item.startsWith("upload:")) return item;
      if (/^https?:\/\//i.test(item)) return item;
      throw new Error("Image value must be an uploaded file or a valid URL.");
    });

  if (sanitized.length === 0) {
    throw new Error("At least one valid image is required.");
  }

  return sanitized;
};

const validateCategoryImage = (value) => {
  const image = sanitizeText(value);
  if (!image) {
    throw new Error("image is required.");
  }

  if (image.startsWith("upload:")) return image;
  if (/^https?:\/\//i.test(image)) return image;

  throw new Error("Category image must be uploaded or a valid URL.");
};

const validateFeatures = (features) => {
  if (!Array.isArray(features)) return [];
  return features.map((item) => sanitizeText(item)).filter(Boolean);
};

const validateSpecs = (specs) => {
  if (!Array.isArray(specs)) return [];
  return specs
    .map((spec) => ({
      label: sanitizeText(spec?.label),
      value: sanitizeText(spec?.value)
    }))
    .filter((spec) => spec.label && spec.value);
};

const normalizePayload = (payload, opts = {}) => {
  const name = sanitizeText(payload.name);
  const slugInput = sanitizeText(payload.slug) || name;
  const slug = slugify(slugInput);

  if (!name) throw new Error("name is required.");
  if (!slug) throw new Error("valid slug is required.");

  const price = Number(payload.price);
  if (Number.isNaN(price) || price < 0) throw new Error("price must be a valid non-negative number.");

  const oldPriceRaw = payload.old_price ?? payload.oldPrice;
  const old_price = oldPriceRaw === "" || oldPriceRaw === null || oldPriceRaw === undefined ? null : Number(oldPriceRaw);
  if (old_price !== null && (Number.isNaN(old_price) || old_price < 0)) {
    throw new Error("old_price must be a valid non-negative number.");
  }

  const stock = Number(payload.stock ?? 0);
  if (Number.isNaN(stock) || stock < 0) throw new Error("stock must be a valid non-negative number.");

  const description = sanitizeText(payload.description);
  if (!description) throw new Error("description is required.");

  const category_id = sanitizeText(payload.category_id);
  if (!category_id) throw new Error("category_id is required.");

  const images = validateImageList(payload.images || []);
  const features = validateFeatures(payload.features || []);
  const specifications = validateSpecs(payload.specifications || []);
  const tags = validateFeatures(payload.tags || []);

  return {
    id: opts.id,
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
    is_featured: Boolean(payload.is_featured)
  };
};

const ensureUniqueProductSlugDummy = (slug, ignoreId) => {
  const exists = dummyProducts.some((item) => item.slug === slug && item.id !== ignoreId);
  if (exists) throw new Error("Product slug already exists.");
};

const ensureUniqueCategorySlugDummy = (slug, ignoreId) => {
  const exists = dummyCategories.some((item) => item.slug === slug && item.id !== ignoreId);
  if (exists) throw new Error("Category slug already exists.");
};

const listAdminProducts = async () => {
  if (!isSupabaseEnabled) {
    return dummyProducts.map(mapProduct);
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,description,price,old_price,stock,rating,tags,is_featured,images,features,specifications,category_id,created_at,categories:category_id(id,name,slug)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
};

const getAdminProductById = async (id) => {
  const products = await listAdminProducts();
  const product = products.find((item) => item.id === id);
  if (!product) throw new Error("Product not found.");
  return product;
};

const createAdminProduct = async (payload) => {
  const normalized = normalizePayload(payload);

  if (!isSupabaseEnabled) {
    ensureUniqueProductSlugDummy(normalized.slug);
    const category = dummyCategories.find((item) => item.id === normalized.category_id);
    if (!category) throw new Error("category not found.");

    const created = {
      ...normalized,
      id: `prod-${Date.now()}`,
      rating: 4.5,
      categories: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      created_at: new Date().toISOString()
    };
    dummyProducts.unshift(created);
    return mapProduct(created);
  }

  const { data: existing, error: existsError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", normalized.slug)
    .limit(1);
  if (existsError) throw existsError;
  if ((existing || []).length > 0) throw new Error("Product slug already exists.");

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...normalized,
      tags: normalized.tags.join(", "),
      rating: 4.5
    })
    .select("id,name,slug,description,price,old_price,stock,rating,tags,is_featured,images,features,specifications,category_id,created_at,categories:category_id(id,name,slug)")
    .single();

  if (error) throw error;
  return mapProduct(data);
};

const updateAdminProduct = async (id, payload) => {
  const normalized = normalizePayload(payload, { id });

  if (!isSupabaseEnabled) {
    ensureUniqueProductSlugDummy(normalized.slug, id);
    const productIndex = dummyProducts.findIndex((item) => item.id === id);
    if (productIndex === -1) throw new Error("Product not found.");
    const category = dummyCategories.find((item) => item.id === normalized.category_id);
    if (!category) throw new Error("category not found.");

    const updated = {
      ...dummyProducts[productIndex],
      ...normalized,
      categories: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
    dummyProducts[productIndex] = updated;
    return mapProduct(updated);
  }

  const { data: existing, error: existsError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", normalized.slug)
    .neq("id", id)
    .limit(1);
  if (existsError) throw existsError;
  if ((existing || []).length > 0) throw new Error("Product slug already exists.");

  const { data, error } = await supabase
    .from("products")
    .update({
      ...normalized,
      tags: normalized.tags.join(", ")
    })
    .eq("id", id)
    .select("id,name,slug,description,price,old_price,stock,rating,tags,is_featured,images,features,specifications,category_id,created_at,categories:category_id(id,name,slug)")
    .single();

  if (error) throw error;
  return mapProduct(data);
};

const deleteAdminProduct = async (id) => {
  if (!isSupabaseEnabled) {
    const index = dummyProducts.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Product not found.");
    dummyProducts.splice(index, 1);
    return true;
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
};

const listAdminCategories = async () => {
  if (!isSupabaseEnabled) {
    return dummyCategories.map(mapCategory);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapCategory);
};

const getAdminCategoryById = async (id) => {
  const categories = await listAdminCategories();
  const category = categories.find((item) => item.id === id);
  if (!category) throw new Error("Category not found.");
  return category;
};

const createAdminCategory = async (payload) => {
  const name = sanitizeText(payload.name);
  const description = sanitizeText(payload.description);
  const image = validateCategoryImage(payload.image);
  const slug = slugify(payload.slug || name);

  if (!name) throw new Error("name is required.");
  if (!description) throw new Error("description is required.");
  if (!slug) throw new Error("valid slug is required.");

  if (!isSupabaseEnabled) {
    ensureUniqueCategorySlugDummy(slug);
    const created = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description,
      image,
      created_at: new Date().toISOString()
    };
    dummyCategories.unshift(created);
    return mapCategory(created);
  }

  const { data: existing, error: existsError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .limit(1);
  if (existsError) throw existsError;
  if ((existing || []).length > 0) throw new Error("Category slug already exists.");

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, description, image })
    .select("id,name,slug,description,image,created_at")
    .single();

  if (error) throw error;
  return mapCategory(data);
};

const updateAdminCategory = async (id, payload) => {
  const name = sanitizeText(payload.name);
  const description = sanitizeText(payload.description);
  const image = validateCategoryImage(payload.image);
  const slug = slugify(payload.slug || name);

  if (!name) throw new Error("name is required.");
  if (!description) throw new Error("description is required.");
  if (!slug) throw new Error("valid slug is required.");

  if (!isSupabaseEnabled) {
    ensureUniqueCategorySlugDummy(slug, id);
    const index = dummyCategories.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Category not found.");
    const updated = {
      ...dummyCategories[index],
      name,
      slug,
      description,
      image
    };
    dummyCategories[index] = updated;

    dummyProducts.forEach((product) => {
      if (product.category_id === id) {
        product.categories = {
          id,
          name,
          slug
        };
      }
    });

    return mapCategory(updated);
  }

  const { data: existing, error: existsError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .limit(1);
  if (existsError) throw existsError;
  if ((existing || []).length > 0) throw new Error("Category slug already exists.");

  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug, description, image })
    .eq("id", id)
    .select("id,name,slug,description,image,created_at")
    .single();

  if (error) throw error;
  return mapCategory(data);
};

const deleteAdminCategory = async (id) => {
  if (!isSupabaseEnabled) {
    const hasProducts = dummyProducts.some((item) => item.category_id === id);
    if (hasProducts) throw new Error("Cannot delete category with linked products.");
    const index = dummyCategories.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Category not found.");
    dummyCategories.splice(index, 1);
    return true;
  }

  const { data: linkedProducts, error: checkError } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id)
    .limit(1);
  if (checkError) throw checkError;
  if ((linkedProducts || []).length > 0) throw new Error("Cannot delete category with linked products.");

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
};

const listAdminOrders = async () => {
  if (!isSupabaseEnabled) {
    return [...dummyOrders].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id,customer_name,email,phone,city,address,items,total_amount,status,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

const getAdminOrderById = async (id) => {
  const orders = await listAdminOrders();
  const order = orders.find((item) => item.id === id);
  if (!order) throw new Error("Order not found.");
  return order;
};

const updateAdminOrderStatus = async (id, status) => {
  const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid status.");
  }

  if (!isSupabaseEnabled) {
    const order = dummyOrders.find((item) => item.id === id);
    if (!order) throw new Error("Order not found.");
    order.status = status;
    return order;
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id,customer_name,email,phone,city,address,items,total_amount,status,created_at")
    .single();

  if (error) throw error;
  return data;
};

const getAdminStats = async () => {
  const [products, categories, orders] = await Promise.all([
    listAdminProducts(),
    listAdminCategories(),
    listAdminOrders()
  ]);

  return {
    productCount: products.length,
    categoryCount: categories.length,
    orderCount: orders.length,
    pendingOrders: orders.filter((order) => order.status === "Pending").length
  };
};

module.exports = {
  uploadsDir,
  listAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  listAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  listAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getAdminStats
};
