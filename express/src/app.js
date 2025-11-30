const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const { globalLimiter } = require("./middlewares/rateLimiter");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const helmet = require('helmet');

/**
 * INISIALISASI EXPRESS APP
 */

const app = express();

/**
 * CORS CONFIG (BEST PRACTICE)
 *
 * - origin harus spesifik, TIDAK boleh "*"
 * - credentials: true wajib jika pakai cookie HttpOnly
 * - method dan allowedHeaders bisa di-set agar stabil
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * PARSER JSON
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * RATE LIMITING - Global untuk semua request
 * Proteksi dari abuse dan DDoS
 */
app.use(globalLimiter);

/**
 * SECURITY HEADERS - Menggunakan Helmet
 * Melindungi dari beberapa kerentanan web umum
 */

app.use(helmet());

/**
 * REQUEST TIMEOUT - Prevent hanging requests
 * Set timeout 30 seconds untuk semua requests
 */
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000); // 30 seconds
  next();
});

/**
 * REQUEST LOGGER - Catat semua request/response
 * Untuk debugging, monitoring, dan audit trail
 */
app.use(requestLogger);

/**
 * PREFIX API GLOBAL
 * Semua route masuk ke /api/v1
 */
app.use("/api/v1", routes);

// Swagger UI - dokumentasi API interaktif
// Akses: /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * HEALTH CHECK ENDPOINTS - Untuk monitoring dan readiness checks
 * /health - Server status
 * /ready - Database connectivity check
 * /alive - Simple liveness probe
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/ready', (req, res) => {
  // Simple readiness check - dapat diperluas untuk check database connectivity
  res.json({
    status: 'READY',
    timestamp: new Date().toISOString()
  });
});

app.get('/alive', (req, res) => {
  res.json({ alive: true });
});

/**
 * ERROR HANDLER - HARUS PALING AKHIR
 * Menangani semua error dari routes di atas
 */
app.use(errorHandler);

module.exports = app;
