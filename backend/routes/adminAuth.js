const express = require("express");
const adminAuthController = require("../controllers/adminAuthController");
const verifyAdmin = require("../middleware/verifyAdmin");
const validateRequest = require("../middleware/validateRequest");
const { loginValidator } = require("../middleware/validators");

const router = express.Router();

router.post("/login", loginValidator, validateRequest, adminAuthController.loginAdmin);
router.post("/logout", verifyAdmin, adminAuthController.logoutAdmin);
router.get("/session", verifyAdmin, adminAuthController.getSession);

module.exports = router;
