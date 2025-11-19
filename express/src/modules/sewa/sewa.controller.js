const SewaService = require("./sewa.service");
const NotificationService = require("../../services/notification.service");
const { success } = require("../../utils/response");
const logger = require("../../config/logger");

/**
 * GET ALL SEWA dengan pagination
 * User bisa lihat semua sewa mereka (akan diimplementasi di service)
 */
module.exports.getAll = async (req, res, next) => {
  try {
    const { items, pagination } = await SewaService.getAllSewa(req.query);
    return success(res, items, "Berhasil mengambil daftar sewa", pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * GET SEWA DETAIL
 * Check bahwa user hanya bisa lihat sewa mereka sendiri (atau admin)
 */
module.exports.getById = async (req, res, next) => {
  try {
    const sewaId = Number(req.params.id);
    const sewa = await SewaService.getSewaById(sewaId);

    if (!sewa) {
      return res.status(404).json({
        success: false,
        message: 'Sewa tidak ditemukan (atau sudah dihapus)'
      });
    }

    // Authorization: USER hanya bisa lihat sewa mereka sendiri, ADMIN bisa lihat semua
    if (req.user.role === 'USER' && sewa.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke sewa ini'
      });
    }

    return success(res, sewa, "Berhasil mengambil detail sewa");
  } catch (err) {
    next(err);
  }
};

/**
 * CREATE SEWA - dengan business logic
 * Steps:
 * 1. Validate input (sudah via middleware)
 * 2. Check stock availability (di service, DALAM TRANSACTION)
 * 3. Calculate total price (di service, DALAM TRANSACTION)
 * 4. Create sewa dengan items (ATOMIC - semua atau tidak sama sekali)
 * 5. Return response dengan detail
 * 
 * TRANSACTION GUARANTEE:
 * Jika terjadi error di step 2-4, transaction otomatis di-rollback
 * Tidak akan ada sewa tanpa items atau items tanpa sewa
 */
module.exports.create = async (req, res, next) => {
  try {
    const userId = req.user.id; // Dari auth middleware
    const data = req.validated;

    // Service handle semua business logic + atomic transaction
    const sewa = await SewaService.createSewa(data, userId);

    // Send booking confirmation email asynchronously (don't block response)
    setImmediate(async () => {
      try {
        await NotificationService.sendBookingConfirmation(sewa);
        logger.logRequest(`✉️  Booking confirmation email sent`, { sewaId: sewa.id });
      } catch (err) {
        logger.logError(`Failed to send booking confirmation email`, {
          sewaId: sewa.id,
          error: err.message
        });
      }
    });

    return success(
      res,
      sewa,
      "Sewa berhasil dibuat. Lanjutkan ke pembayaran.",
      null,
      201
    );
  } catch (err) {
    // Handle transaction timeout (race condition detected)
    if (err.code === 'P2028' || err.message.includes('Serialization failure')) {
      return res.status(409).json({
        success: false,
        message: 'Terjadi conflict dengan booking lain. Silakan coba lagi.',
        errorCode: 'BOOKING_CONFLICT'
      });
    }

    // Handle transaction timeout
    if (err.message.includes('Transaction timeout')) {
      return res.status(408).json({
        success: false,
        message: 'Request timeout. Silakan coba lagi.',
        errorCode: 'REQUEST_TIMEOUT'
      });
    }

    // Handle constraint violations (unique, FK, etc)
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Data sudah ada. Silakan gunakan data yang berbeda.',
        errorCode: 'DUPLICATE_DATA'
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Referensi data tidak valid.',
        errorCode: 'INVALID_REFERENCE'
      });
    }

    // Handle business logic errors (stock, dates, etc)
    if (err.message.includes('Stock tidak cukup') || 
        err.message.includes('tidak ditemukan')) {
      return res.status(400).json({
        success: false,
        message: err.message,
        errorCode: 'BUSINESS_RULE_VIOLATION'
      });
    }

    // Pass other errors to error handler middleware
    next(err);
  }
};

/**
 * UPDATE SEWA STATUS
 * Biasanya dipanggil setelah payment berhasil atau untuk update status lainnya
 */
module.exports.update = async (req, res, next) => {
  try {
    const sewaId = Number(req.params.id);
    const data = req.validated;

    const sewa = await SewaService.updateSewa(sewaId, data);
    return success(res, sewa, "Status sewa berhasil diupdate");
  } catch (err) {
    next(err);
  }
};

/**
 * CANCEL SEWA
 * Soft delete: ubah status jadi CANCELLED
 * User bisa cancel sewa jika statusnya masih PENDING atau PAID
 */
module.exports.remove = async (req, res, next) => {
  try {
    const sewaId = Number(req.params.id);
    const sewa = await SewaService.deleteSewa(sewaId);

    // Send cancellation email asynchronously (don't block response)
    setImmediate(async () => {
      try {
        await NotificationService.sendBookingCancellation(sewaId, "Permintaan pembatalan pengguna");
        logger.logRequest(`✉️  Booking cancellation email sent`, { sewaId });
      } catch (err) {
        logger.logError(`Failed to send cancellation email`, {
          sewaId,
          error: err.message
        });
      }
    });

    return success(res, sewa, "Sewa berhasil dibatalkan");
  } catch (err) {
    next(err);
  }
};
