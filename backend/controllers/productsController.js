const productService = require("../services/productService");

const getProducts = async (_req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug
};
