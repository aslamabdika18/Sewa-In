// src/modules/barang/barang.controller.js
const BarangService = require('./barang.service')
const { success, error } = require('../../utils/response')
const { processImageUpload, deleteImages } = require('../../middlewares/fileUpload')

exports.getAllBarang = async (req, res, next) => {
  try {
    const { items, pagination } = await BarangService.getAllBarang(req.query)
    return success(res, items, 'Berhasil mengambil data barang', pagination)
  } catch (err) {
    next(err)
  }
}

exports.getBarangById = async (req, res, next) => {
  try {
    const data = await BarangService.getBarangById(req.params.id)

    if (!data) {
      return error(res, 'Barang tidak ditemukan', 404)
    }

    return success(res, data, 'Berhasil mengambil detail barang')
  } catch (err) {
    next(err)
  }
}

exports.createBarang = async (req, res, next) => {
  try {
    const payload = req.validated

    // Process image if uploaded
    if (req.file) {
      const imageResult = await processImageUpload(req.file, 'barang')
      payload.images = imageResult.images
      payload.imageId = imageResult.id
    }

    const data = await BarangService.createBarang(payload)
    return success(res, data, 'Berhasil membuat barang', null, 201)
  } catch (err) {
    next(err)
  }
}

exports.updateBarang = async (req, res, next) => {
  try {
    const payload = req.validated
    const barangId = Number(req.params.id)
    const prisma = require('../../config/database')

    // Get current barang to check for old image
    const currentBarang = await prisma.barang.findUnique({
      where: { id: barangId }
    })

    // Process new image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (currentBarang?.imageId) {
        await deleteImages('barang', currentBarang.imageId)
      }

      const imageResult = await processImageUpload(req.file, 'barang')
      payload.images = imageResult.images
      payload.imageId = imageResult.id
    }

    const data = await BarangService.updateBarang(barangId, payload)
    return success(res, data, 'Berhasil mengupdate barang')
  } catch (err) {
    next(err)
  }
}

exports.deleteBarang = async (req, res, next) => {
  try {
    await BarangService.deleteBarang(req.params.id)
    return success(res, null, 'Berhasil menghapus barang')
  } catch (err) {
    next(err)
  }
}
