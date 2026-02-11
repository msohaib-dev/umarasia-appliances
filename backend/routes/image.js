const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.get("/:filename", imageController.streamImage);

module.exports = router;
