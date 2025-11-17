// src/modules/midtrans/midtrans.route.js
const express = require("express");
const router = express.Router();

const controller = require("./midtrans.controller");

// Create Snap transaction
router.post("/snap", controller.create);

// Check transaction status
router.get("/snap/status/:orderId", controller.status);

// Midtrans Notification Callback (Webhook)
router.post("/snap/notification", express.json(), controller.notification);

module.exports = router;
