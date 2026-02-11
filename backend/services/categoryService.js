const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");
const { categories: dummyCategories } = require("./dummyData");
const { toPublicImageUrl } = require("../utils/security");

const mapCategoryRow = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: toPublicImageUrl(row.image)
});

const getAllCategories = async () => {
  if (!isSupabaseEnabled) {
    return dummyCategories.map(mapCategoryRow);
  }

  const { data, error } = await supabase.from("categories").select("id, name, slug, description, image").order("name");

  if (error) {
    throw error;
  }

  return data.map(mapCategoryRow);
};

const getCategoryBySlug = async (slug) => {
  if (!isSupabaseEnabled) {
    const found = dummyCategories.find((category) => category.slug === slug);
    return found ? mapCategoryRow(found) : null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapCategoryRow(data);
};

module.exports = {
  getAllCategories,
  getCategoryBySlug
};
