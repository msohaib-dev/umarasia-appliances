const bcrypt = require("bcryptjs");

let cachedAdmin = null;

const getAdminUser = async () => {
  if (cachedAdmin) return cachedAdmin;

  const email = String(process.env.ADMIN_EMAIL || "admin@umarasia.com").toLowerCase().trim();
  const plainPassword = String(process.env.ADMIN_PASSWORD || "Admin@123");
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  cachedAdmin = {
    id: "admin-1",
    email,
    passwordHash: hashedPassword,
    role: "admin"
  };

  return cachedAdmin;
};

module.exports = {
  getAdminUser
};
