const adminDataService = require("../services/adminDataService");
const heroSlidesService = require("../services/heroSlidesService");
const { sanitizeText } = require("../utils/security");

const getDashboardStats = async (_req, res, next) => {
  try {
    const stats = await adminDataService.getAdminStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return next(error);
  }
};

const listProducts = async (_req, res, next) => {
  try {
    const data = await adminDataService.listAdminProducts();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const data = await adminDataService.getAdminProductById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "Product not found." });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const data = await adminDataService.createAdminProduct(req.body || {});
    return res.status(201).json({ success: true, message: "Product created.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to create product." });
  }
};

const updateProduct = async (req, res, _next) => {
  try {
    const data = await adminDataService.updateAdminProduct(req.params.id, req.body || {});
    return res.status(200).json({ success: true, message: "Product updated.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to update product." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await adminDataService.deleteAdminProduct(req.params.id);
    return res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to delete product." });
  }
};

const listCategories = async (_req, res, next) => {
  try {
    const data = await adminDataService.listAdminCategories();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const data = await adminDataService.getAdminCategoryById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "Category not found." });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = await adminDataService.createAdminCategory(req.body || {});
    return res.status(201).json({ success: true, message: "Category created.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to create category." });
  }
};

const updateCategory = async (req, res) => {
  try {
    const data = await adminDataService.updateAdminCategory(req.params.id, req.body || {});
    return res.status(200).json({ success: true, message: "Category updated.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to update category." });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await adminDataService.deleteAdminCategory(req.params.id);
    return res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to delete category." });
  }
};

const listOrders = async (req, res, next) => {
  try {
    const status = sanitizeText(req.query?.status || "");
    const all = await adminDataService.listAdminOrders();
    const filtered = status ? all.filter((item) => item.status === status) : all;
    return res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const data = await adminDataService.getAdminOrderById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "Order not found." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const data = await adminDataService.updateAdminOrderStatus(req.params.id, sanitizeText(req.body?.status));
    return res.status(200).json({ success: true, message: "Order status updated.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to update order." });
  }
};

const uploadImage = async (req, res) => {
  if (!req.file?.filename) {
    return res.status(400).json({ success: false, message: "Image file is required." });
  }

  return res.status(201).json({
    success: true,
    message: "Image uploaded.",
    data: {
      value: `upload:${req.file.filename}`
    }
  });
};

const listHeroSlides = async (_req, res, next) => {
  try {
    const data = await heroSlidesService.getHeroSlides();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const replaceHeroSlides = async (req, res) => {
  try {
    const slides = Array.isArray(req.body?.slides) ? req.body.slides : [];
    const data = await heroSlidesService.replaceHeroSlides(slides);
    return res.status(200).json({ success: true, message: "Hero slides updated.", data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to update hero slides." });
  }
};

module.exports = {
  getDashboardStats,
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  listOrders,
  getOrderById,
  updateOrderStatus,
  uploadImage,
  listHeroSlides,
  replaceHeroSlides
};
