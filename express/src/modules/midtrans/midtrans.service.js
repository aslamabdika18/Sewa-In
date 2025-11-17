// src/modules/midtrans/midtrans.service.js
const prisma = require("../../config/database");
const snap = require("../../config/midtrans");

module.exports = {
  async createSnapTransaction(sewaId) {
    // Ambil data sewa (dengan user dan item) dari DB
    const sewa = await prisma.sewa.findUnique({
      where: { id: Number(sewaId) },
      include: { user: true, item: true },
    });

    if (!sewa) {
      throw new Error("Sewa tidak ditemukan");
    }

    // Siapkan parameter transaksi untuk Snap (sesuai dokumentasi)
    const parameter = {
      transaction_details: {
        order_id: `SEWA-${sewa.id}-${Date.now()}`,
        gross_amount: sewa.totalPrice,
      },
      customer_details: {
        first_name: sewa.user.name,
        email: sewa.user.email,
        phone: sewa.user.phone,
      },
      item_details: [
        {
          id: String(sewa.item.id),
          price: sewa.item.pricePerDay,
          quantity: 1,
          name: sewa.item.name,
        }
      ]
    };

    // Panggil API Midtrans Snap
    const transaction = await snap.createTransaction(parameter);

    // transaction adalah object yang dikembalikan oleh client Midtrans, misalnya:
    // {
    //   token: "token-string",
    //   redirect_url: "https://..."
    // }

    return transaction;
  },

  async getTransactionStatus(orderId) {
    // dokumentasi Snap client: kamu bisa cek status transaksi
    // menggunakan snap.transaction.status(orderId)
    const statusResponse = await snap.transaction.status(orderId);
    return statusResponse;
  },

  async handleNotification(notificationPayload) {
    // midtrans-client punya method notification untuk cek status-notifikasi dari Midtrans
    const statusResponse = await snap.transaction.notification(notificationPayload);

    // Kemudian update status di DB sesuai statusResponse.order_id
    const orderId = statusResponse.order_id;

    // Cari sewa berdasarkan order_id (kamu mungkin menyimpan order_id Midtrans di Sewa atau tabel transaksi)
    // Misalkan kamu menyimpan orderId Midtrans di tabel Sewa
    const sewa = await prisma.sewa.findFirst({
      where: { /* kondisi orderId Midtrans bisa disimpan di sewa */ }
    });

    // Simpel: ubah status sewa berdasarkan transaction_status
    let newStatus = sewa.status;

    if (statusResponse.transaction_status === "settlement") {
      newStatus = "PAID";
    } else if (statusResponse.transaction_status === "pending") {
      newStatus = "PENDING";
    } else if (statusResponse.transaction_status === "expire" || statusResponse.transaction_status === "cancel") {
      newStatus = "CANCELLED";
    }

    await prisma.sewa.update({
      where: { id: sewa.id },
      data: { status: newStatus }
    });

    return { statusResponse, sewaId: sewa.id };
  }
};
