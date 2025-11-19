// src/routes/index.js
const express = require("express");
const router = express.Router();

// Import semua route module
const barangRoute = require("../modules/barang/barang.route");
const categoryRoute = require("../modules/category/category.route");
const sewaRoute = require("../modules/sewa/sewa.route");
const userRoute = require("../modules/user/user.route");
const midtransRoutes = require("../modules/midtrans/midtrans.route");
const authRoutes = require("../modules/auth/auth.route");
const adminRoute = require("./admin.route");

// Gabungkan semua dalam 1 router
router.use("/auth", authRoutes);
router.use("/barang", barangRoute);
router.use("/category", categoryRoute);
router.use("/sewa", sewaRoute);
router.use("/user", userRoute);
router.use("/payments", midtransRoutes);
router.use("/admin/audit", adminRoute);

module.exports = router;
