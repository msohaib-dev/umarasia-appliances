const express = require("express");
const ordersController = require("../controllers/ordersController");
const validateRequest = require("../middleware/validateRequest");
const { orderValidator } = require("../middleware/validators");

const router = express.Router();

router.post("/", orderValidator, validateRequest, ordersController.createOrder);

module.exports = router;
