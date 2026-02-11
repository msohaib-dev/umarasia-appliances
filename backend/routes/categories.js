const express = require("express");
const categoriesController = require("../controllers/categoriesController");
const validateRequest = require("../middleware/validateRequest");
const { slugParamValidator } = require("../middleware/validators");

const router = express.Router();

router.get("/", categoriesController.getCategories);
router.get("/:slug", slugParamValidator, validateRequest, categoriesController.getCategoryBySlug);

module.exports = router;
