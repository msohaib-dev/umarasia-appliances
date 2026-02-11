const rawHeroSlides = require("../../frontend/data/hero-slides.json");
const { supabase, isSupabaseEnabled } = require("../config/supabaseClient");
const { sanitizeText } = require("../utils/security");

let dummyHeroSlides = (rawHeroSlides || []).map((slide, index) => ({
  id: Number(slide.id) || index + 1,
  title: sanitizeText(slide.title),
  subtitle: sanitizeText(slide.subtitle),
  image: sanitizeText(slide.image),
  sort_order: index + 1,
  is_active: true
}));

const normalizeSlides = (slides = []) => {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error("At least one hero slide is required.");
  }

  const normalized = slides
    .map((slide, index) => ({
      title: sanitizeText(slide?.title),
      subtitle: sanitizeText(slide?.subtitle),
      image: sanitizeText(slide?.image),
      sort_order: index + 1,
      is_active: slide?.is_active !== false
    }))
    .filter((slide) => slide.title && slide.subtitle && slide.image);

  if (normalized.length === 0) {
    throw new Error("Hero slides contain invalid entries.");
  }

  return normalized;
};

const mapSlide = (slide) => ({
  id: Number(slide.id),
  title: slide.title,
  subtitle: slide.subtitle,
  image: slide.image,
  sort_order: Number(slide.sort_order || 0),
  is_active: Boolean(slide.is_active)
});

const getHeroSlides = async () => {
  if (!isSupabaseEnabled) {
    return dummyHeroSlides
      .filter((slide) => slide.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapSlide);
  }

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id,title,subtitle,image,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    if (error.code === "42P01") {
      return dummyHeroSlides
        .filter((slide) => slide.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(mapSlide);
    }
    throw error;
  }

  return (data || []).map(mapSlide);
};

const replaceHeroSlides = async (slides) => {
  const normalized = normalizeSlides(slides);

  if (!isSupabaseEnabled) {
    dummyHeroSlides = normalized.map((slide, index) => ({
      ...slide,
      id: index + 1
    }));
    return dummyHeroSlides.map(mapSlide);
  }

  const { error: deleteError } = await supabase.from("hero_slides").delete().gte("id", 0);
  if (deleteError) {
    if (deleteError.code === "42P01") {
      throw new Error("hero_slides table missing. Run SQL 2 first.");
    }
    throw deleteError;
  }

  const { data, error } = await supabase
    .from("hero_slides")
    .insert(normalized)
    .select("id,title,subtitle,image,sort_order,is_active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSlide);
};

module.exports = {
  getHeroSlides,
  replaceHeroSlides
};
