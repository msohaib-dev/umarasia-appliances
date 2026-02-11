const express = require("express");
const adminController = require("../controllers/adminController");
const verifyAdmin = require("../middleware/verifyAdmin");
const uploadImage = require("../middleware/uploadImage");
const validateRequest = require("../middleware/validateRequest");
const {
  idParamValidator,
  categoryPayloadValidator,
  productPayloadValidator,
  orderStatusValidator
} = require("../middleware/validators");

const router = express.Router();

router.use(verifyAdmin);

router.get("/dashboard", adminController.getDashboardStats);

router.get("/products", adminController.listProducts);
router.get("/products/:id", idParamValidator, validateRequest, adminController.getProductById);
router.post("/products", productPayloadValidator, validateRequest, adminController.createProduct);
router.put("/products/:id", idParamValidator, productPayloadValidator, validateRequest, adminController.updateProduct);
router.delete("/products/:id", idParamValidator, validateRequest, adminController.deleteProduct);

router.get("/categories", adminController.listCategories);
router.get("/categories/:id", idParamValidator, validateRequest, adminController.getCategoryById);
router.post("/categories", categoryPayloadValidator, validateRequest, adminController.createCategory);
router.put("/categories/:id", idParamValidator, categoryPayloadValidator, validateRequest, adminController.updateCategory);
router.delete("/categories/:id", idParamValidator, validateRequest, adminController.deleteCategory);

router.get("/orders", adminController.listOrders);
router.get("/orders/:id", idParamValidator, validateRequest, adminController.getOrderById);
router.put("/orders/:id/status", idParamValidator, orderStatusValidator, validateRequest, adminController.updateOrderStatus);

router.get("/hero-slides", adminController.listHeroSlides);
router.put("/hero-slides", adminController.replaceHeroSlides);

router.post("/upload-image", uploadImage.single("image"), adminController.uploadImage);

module.exports = router;
