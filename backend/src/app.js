const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const config = require("./config");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const { globalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa Origin (Postman, curl, mobile app)
      if (!origin) {
        return callback(null, true);
      }

      if (config.corsOrigin.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} tidak diizinkan.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate Limiting
app.use(globalLimiter);

// Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie Parser
app.use(cookieParser());

// Compression
app.use(compression());

// Request Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Static Files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger Documentation
const swaggerUiOptions = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "SIMM API Documentation",
};
app.use("/api-docs", swaggerUi.serveFiles(swaggerSpec, swaggerUiOptions), swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SIMM API is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
