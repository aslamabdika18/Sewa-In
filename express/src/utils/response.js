// src/utils/response.js

/**
 * Response sukses standard:
 * {
 *   success: true,
 *   message: string,
 *   data: ...,
 *   pagination: { ... } | null
 * }
 */
exports.success = (res, data, message = 'OK', pagination = null, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
        pagination,
    })
}

/**
 * Response error standard:
 * {
 *   success: false,
 *   message: string,
 *   data: null
 * }
 */
exports.error = (res, message = 'Terjadi kesalahan', status = 400, data = null) => {
    return res.status(status).json({
        success: false,
        message,
        data,
    })
}
