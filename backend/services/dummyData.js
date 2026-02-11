const rawProducts = require("../../frontend/data/products.json");
const rawCategories = require("../../frontend/data/categories.json");

const categories = rawCategories.map((category, index) => ({
  id: `cat-${index + 1}`,
  name: category.title,
  slug: category.slug,
  description: category.description,
  image: category.image,
  created_at: new Date().toISOString()
}));

const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]));
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

const products = rawProducts.map((product, index) => {
  const stock = typeof product.stock === "number" ? product.stock : product.inStock ? 12 : 0;
  const categoryName = categoryNameBySlug.get(product.categorySlug) || "General";

  return {
    id: product.id || `prod-${index + 1}`,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    old_price: product.oldPrice,
    stock,
    rating: product.rating || 4.5,
    images: product.images || [],
    tags: [
      ...new Set([
        ...(product.name || "")
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean),
        categoryName.toLowerCase(),
        (product.categorySlug || "").toLowerCase().replace(/-/g, " ")
      ])
    ],
    is_featured: false,
    category_id: categoryBySlug.get(product.categorySlug)?.id || null,
    categories: categoryBySlug.get(product.categorySlug)
      ? {
          id: categoryBySlug.get(product.categorySlug).id,
          name: categoryBySlug.get(product.categorySlug).name,
          slug: categoryBySlug.get(product.categorySlug).slug
        }
      : null,
    features: product.features || [],
    specifications: product.specifications || [],
    created_at: new Date().toISOString()
  };
});

module.exports = {
  products,
  categories
};
