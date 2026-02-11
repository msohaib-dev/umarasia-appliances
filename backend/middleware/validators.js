const { body, param, query } = require("express-validator");

const slugRule = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pkPhoneRule = /^(?:\+92|0)3\d{9}$/;

const loginValidator = [
  body("email").isString().trim().notEmpty().withMessage("email is required.").isEmail().withMessage("email must be valid."),
  body("password").isString().notEmpty().withMessage("password is required.")
];

const orderValidator = [
  body("customer_name").isString().trim().notEmpty().withMessage("customer_name is required."),
  body("phone")
    .isString()
    .customSanitizer((value) => String(value || "").replace(/[\s-]/g, ""))
    .matches(pkPhoneRule)
    .withMessage("phone must be a valid Pakistan mobile number."),
  body("email").isString().trim().matches(emailRule).withMessage("email must be valid."),
  body("city").isString().trim().notEmpty().withMessage("city is required."),
  body("address").isString().trim().notEmpty().withMessage("address is required."),
  body("items").isArray({ min: 1 }).withMessage("items must be a non-empty array."),
  body("items.*.name").isString().trim().notEmpty().withMessage("items contain invalid product entries."),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("items contain invalid product entries.")
    .toInt(),
  body("items.*.unit_price")
    .isFloat({ min: 0 })
    .withMessage("items contain invalid product entries.")
    .toFloat(),
  body("total_amount").isFloat({ gt: 0 }).withMessage("total_amount must be a valid number.").toFloat()
];

const contactValidator = [
  body("name").isString().trim().notEmpty().withMessage("name is required."),
  body("email").isString().trim().matches(emailRule).withMessage("A valid email is required."),
  body("phone")
    .isString()
    .customSanitizer((value) => String(value || "").replace(/[\s-]/g, ""))
    .matches(pkPhoneRule)
    .withMessage("A valid Pakistan phone number is required."),
  body("message")
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage("message is required.")
];

const slugParamValidator = [param("slug").matches(slugRule).withMessage("Invalid slug format.")];

const searchValidator = [
  query("q")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("q must be a valid string.")
];

const idParamValidator = [param("id").isString().trim().notEmpty().withMessage("id is required.")];

const categoryPayloadValidator = [
  body("name").isString().trim().notEmpty().withMessage("name is required."),
  body("slug")
    .optional({ nullable: true })
    .isString()
    .trim()
    .matches(/^[a-zA-Z0-9\s-]*$/)
    .withMessage("slug contains invalid characters."),
  body("description").isString().trim().notEmpty().withMessage("description is required."),
  body("image").isString().trim().notEmpty().withMessage("image is required.")
];

const productPayloadValidator = [
  body("name").isString().trim().notEmpty().withMessage("name is required."),
  body("slug")
    .optional({ nullable: true })
    .isString()
    .trim()
    .matches(/^[a-zA-Z0-9\s-]*$/)
    .withMessage("slug contains invalid characters."),
  body("description").isString().trim().notEmpty().withMessage("description is required."),
  body("price").isFloat({ min: 0 }).withMessage("price must be a valid non-negative number.").toFloat(),
  body("old_price")
    .optional({ nullable: true })
    .custom((value) => value === "" || value === null || value === undefined || !Number.isNaN(Number(value)))
    .withMessage("old_price must be a valid non-negative number."),
  body("stock").optional().isInt({ min: 0 }).withMessage("stock must be a valid non-negative number.").toInt(),
  body("category_id").isString().trim().notEmpty().withMessage("category_id is required."),
  body("images").isArray({ min: 1 }).withMessage("At least one image is required."),
  body("features").optional().isArray().withMessage("features must be an array."),
  body("specifications").optional().isArray().withMessage("specifications must be an array."),
  body("tags").optional().isArray().withMessage("tags must be an array.")
];

const orderStatusValidator = [
  body("status")
    .isIn(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status.")
];

module.exports = {
  loginValidator,
  orderValidator,
  contactValidator,
  slugParamValidator,
  searchValidator,
  idParamValidator,
  categoryPayloadValidator,
  productPayloadValidator,
  orderStatusValidator
};
