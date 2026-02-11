require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const ordersRoutes = require("./routes/orders");
const searchRoutes = require("./routes/search");
const heroSlidesRoutes = require("./routes/heroSlides");
const contactRoutes = require("./routes/contact");
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/admin");
const imageRoutes = require("./routes/image");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = String(process.env.CORS_ORIGIN || "http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (isProduction && allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGIN must be configured in production.");
}

const corsConfig = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS policy."));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later." }
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);

if (isProduction) {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    const forwardedProto = req.headers["x-forwarded-proto"];
    if (req.secure || forwardedProto === "https") {
      return next();
    }

    return res.status(400).json({ success: false, message: "HTTPS is required." });
  });
}

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use("/api", apiLimiter);
app.use("/api/admin/auth/login", authLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

if (!isProduction) {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  return res.status(200).json({ success: true, message: "Backend is running." });
});

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hero-slides", heroSlidesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

app.use((_req, res) => {
  return res.status(404).json({ success: false, message: "Route not found." });
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";
  return res.status(statusCode).json({ success: false, message });
});

app.listen(port, () => {
  console.log(`UmarAsia backend listening on port ${port}`);
});
