const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");
const { products: dummyProducts } = require("./dummyData");
const { toPublicImageUrl } = require("../utils/security");

const mapProductRow = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: row.price,
  oldPrice: row.old_price,
  stock: row.stock,
  images: (row.images ?? []).map(toPublicImageUrl),
  features: row.features ?? [],
  specifications: row.specifications ?? [],
  rating: row.rating,
  category: row.categories?.name ?? null,
  categorySlug: row.categories?.slug ?? null,
  categoryId: row.categories?.id ?? null
});

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
  categories:category_id (
    id,
    name,
    slug
  )
`;

const getAllProducts = async () => {
  if (!isSupabaseEnabled) {
    return dummyProducts.map(mapProductRow);
  }

  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapProductRow);
};

const getProductBySlug = async (slug) => {
  if (!isSupabaseEnabled) {
    const found = dummyProducts.find((product) => product.slug === slug);
    return found ? mapProductRow(found) : null;
  }

  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapProductRow(data);
};

module.exports = {
  getAllProducts,
  getProductBySlug
};
