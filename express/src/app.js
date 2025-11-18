const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");

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
 * PREFIX API GLOBAL
 * Semua route masuk ke /api/v1
 */
app.use("/api/v1", routes);

module.exports = app;
