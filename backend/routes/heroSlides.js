const express = require("express");
const heroSlidesController = require("../controllers/heroSlidesController");

const router = express.Router();

router.get("/", heroSlidesController.getHeroSlides);

module.exports = router;
