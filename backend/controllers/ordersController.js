const orderService = require("../services/orderService");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPakistanPhone = (phone) => /^(?:\+92|0)3\d{9}$/.test(String(phone || "").replace(/[\s-]/g, ""));

const validateOrderPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "Invalid request body.";
  }

  const requiredStringFields = ["customer_name", "phone", "city", "address", "email"];

  for (const field of requiredStringFields) {
    if (typeof payload[field] !== "string" || !payload[field].trim()) {
      return `${field} is required.`;
    }
  }

  if (!isValidEmail(payload.email)) {
    return "email must be valid.";
  }

  if (!isValidPakistanPhone(payload.phone)) {
    return "phone must be a valid Pakistan mobile number.";
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return "items must be a non-empty array.";
  }

  const hasInvalidItem = payload.items.some(
    (item) =>
      !item ||
      typeof item !== "object" ||
      typeof item.name !== "string" ||
      !item.name.trim() ||
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      typeof item.unit_price !== "number" ||
      item.unit_price < 0
  );

  if (hasInvalidItem) {
    return "items contain invalid product entries.";
  }

  if (typeof payload.total_amount !== "number" || Number.isNaN(payload.total_amount) || payload.total_amount <= 0) {
    return "total_amount must be a valid number.";
  }

  return null;
};

const createOrder = async (req, res, next) => {
  try {
    const validationMessage = validateOrderPayload(req.body);

    if (validationMessage) {
      return res.status(400).json({ success: false, message: validationMessage });
    }

    const order = await orderService.createOrder(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder
};
