// src/config/midtrans.js
const midtrans = require("midtrans-client");
const { midtrans: midtransConfig } = require("./env");  // ambil dari env config yang sudah kita punya

// Inisialisasi Snap API sesuai dokumentasi Midtrans
const snap = new midtrans.Snap({
  isProduction: midtransConfig.production,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey
});

// Kamu bisa atur timeout, custom header, dll sesuai contoh Midtrans
// Contoh men-set axios timeout:
snap.httpClient.http_client.defaults.timeout = 5000;

module.exports = snap;
