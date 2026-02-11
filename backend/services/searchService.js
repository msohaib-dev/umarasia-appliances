const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");
const { products: dummyProducts, categories: dummyCategories } = require("./dummyData");
const { toPublicImageUrl } = require("../utils/security");

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  price: row.price,
  oldPrice: row.old_price,
  stock: row.stock,
  rating: row.rating,
  images: (row.images ?? []).map(toPublicImageUrl),
  category: row.categories?.name ?? null,
  categorySlug: row.categories?.slug ?? null
});

const normalize = (value) => String(value || "").toLowerCase().trim();

const levenshteinDistance = (a, b) => {
  const source = normalize(a);
  const target = normalize(b);

  if (!source.length) return target.length;
  if (!target.length) return source.length;

  const matrix = Array.from({ length: source.length + 1 }, () => Array(target.length + 1).fill(0));

  for (let i = 0; i <= source.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= target.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= source.length; i += 1) {
    for (let j = 1; j <= target.length; j += 1) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[source.length][target.length];
};

const isFieldMatch = (query, value) => {
  const normalizedQuery = normalize(query);
  const normalizedValue = normalize(value);

  if (!normalizedQuery || !normalizedValue) {
    return false;
  }

  if (normalizedValue.includes(normalizedQuery)) {
    return true;
  }

  if (normalizedQuery.length <= 2) {
    return false;
  }

  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const compactValue = normalizedValue.replace(/\s+/g, "");

  if (compactValue.includes(compactQuery)) {
    return true;
  }

  const tokens = normalizedValue.split(/\s+/).filter(Boolean);
  return tokens.some((token) => {
    if (token.includes(normalizedQuery)) return true;
    const distance = levenshteinDistance(normalizedQuery, token);
    return distance <= 1;
  });
};

const isProductMatch = (query, product) => {
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const categoryName = product.categories?.name || "";

  return [product.name, categoryName, ...tags].some((field) => isFieldMatch(query, field));
};

const isCategoryMatch = (query, category) => isFieldMatch(query, category.name);

const buildSuggestions = (matchedProducts) => {
  const productSuggestions = [];
  const productSeen = new Set();

  for (const product of matchedProducts) {
    const key = normalize(product.name);
    if (!key || productSeen.has(key)) continue;
    productSeen.add(key);
    productSuggestions.push({
      label: product.name,
      slug: product.slug,
      href: `/product/${product.slug}`
    });
    if (productSuggestions.length >= 8) break;
  }

  return productSuggestions;
};

const searchProductsAndSuggestions = async (query) => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return { suggestions: [], products: [], categories: [] };
  }

  let productsSource = dummyProducts;
  let categoriesSource = dummyCategories;

  if (isSupabaseEnabled) {
    const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] = await Promise.all([
      supabase
        .from("products")
        .select(
          `id,name,slug,price,old_price,stock,rating,images,tags,categories:category_id(id,name,slug)`
        )
        .limit(200),
      supabase.from("categories").select("id,name,slug").limit(100)
    ]);

    if (productsError) {
      throw productsError;
    }

    if (categoriesError) {
      throw categoriesError;
    }

    productsSource = productsData || [];
    categoriesSource = categoriesData || [];
  }

  const matchedCategories = categoriesSource.filter((category) => isCategoryMatch(normalizedQuery, category)).slice(0, 8);

  const matchedProducts = productsSource
    .filter((product) => isProductMatch(normalizedQuery, product))
    .slice(0, 20);

  const suggestions = buildSuggestions(matchedProducts);

  return {
    suggestions,
    products: matchedProducts.slice(0, 12).map(mapProduct),
    categories: matchedCategories.map((category) => ({
      name: category.name,
      slug: category.slug
    }))
  };
};

module.exports = {
  searchProductsAndSuggestions
};
