const categoryService = require("../services/categoryService");

const getCategories = async (_req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};
