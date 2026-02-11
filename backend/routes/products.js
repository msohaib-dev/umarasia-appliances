const express = require("express");
const productsController = require("../controllers/productsController");
const validateRequest = require("../middleware/validateRequest");
const { slugParamValidator } = require("../middleware/validators");

const router = express.Router();

router.get("/", productsController.getProducts);
router.get("/:slug", slugParamValidator, validateRequest, productsController.getProductBySlug);

module.exports = router;
