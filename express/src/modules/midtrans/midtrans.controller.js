// src/modules/midtrans/midtrans.controller.js
const midtransService = require("./midtrans.service");
const { success, error } = require("../../utils/response");

module.exports = {
  async create(req, res) {
    try {
      const { sewaId } = req.body;
      const trx = await midtransService.createSnapTransaction(sewaId);
      return success(res, trx, "Midtrans Snap transaction created");
    } catch (err) {
      return error(res, err.message, 500);
    }
  },

  async status(req, res) {
    try {
      const { orderId } = req.params;
      const status = await midtransService.getTransactionStatus(orderId);
      return success(res, status);
    } catch (err) {
      return error(res, err.message, 500);
    }
  },

  async notification(req, res) {
    try {
      const payload = req.body;
      const result = await midtransService.handleNotification(payload);
      // menurut dokumentasi, respond 200 OK
      return success(res, result, "Notification processed");
    } catch (err) {
      return error(res, err.message, 500);
    }
  },
};
