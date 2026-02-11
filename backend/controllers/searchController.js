const searchService = require("../services/searchService");

const searchProducts = async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : "";

    if (!q.trim()) {
      return res.status(200).json({ success: true, data: { suggestions: [], products: [] } });
    }

    const results = await searchService.searchProductsAndSuggestions(q);
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  searchProducts
};
