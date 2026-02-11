const contactService = require("../services/contactService");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPakistanPhone = (phone) => /^(?:\+92|0)3\d{9}$/.test(String(phone || "").replace(/[\s-]/g, ""));

const createContact = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload?.name?.trim()) {
      return res.status(400).json({ success: false, message: "name is required." });
    }
    if (!payload?.email?.trim() || !isValidEmail(payload.email)) {
      return res.status(400).json({ success: false, message: "A valid email is required." });
    }
    if (!payload?.phone?.trim()) {
      return res.status(400).json({ success: false, message: "phone is required." });
    }
    if (!isValidPakistanPhone(payload.phone)) {
      return res.status(400).json({ success: false, message: "A valid Pakistan phone number is required." });
    }
    if (!payload?.message?.trim() || payload.message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "message is required." });
    }

    const contact = await contactService.createContactMessage(payload);

    return res.status(201).json({
      success: true,
      message: "Your message has been received.",
      data: contact
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createContact
};
