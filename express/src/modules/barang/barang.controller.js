// src/modules/barang/barang.controller.js
const BarangService = require('./barang.service')
const { success, error } = require('../../utils/response')

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
    const data = await BarangService.createBarang(req.validated)
    return success(res, data, 'Berhasil membuat barang', null, 201)
  } catch (err) {
    next(err)
  }
}

exports.updateBarang = async (req, res, next) => {
  try {
    const data = await BarangService.updateBarang(req.params.id, req.validated)
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
