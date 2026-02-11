const express = require("express");
const searchController = require("../controllers/searchController");
const validateRequest = require("../middleware/validateRequest");
const { searchValidator } = require("../middleware/validators");

const router = express.Router();

router.get("/", searchValidator, validateRequest, searchController.searchProducts);

module.exports = router;
