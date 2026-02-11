const express = require("express");
const contactController = require("../controllers/contactController");
const validateRequest = require("../middleware/validateRequest");
const { contactValidator } = require("../middleware/validators");

const router = express.Router();

router.post("/", contactValidator, validateRequest, contactController.createContact);

module.exports = router;
