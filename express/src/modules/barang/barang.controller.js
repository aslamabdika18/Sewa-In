// src/modules/barang/barang.controller.js
const BarangService = require('./barang.service')
const { success, error } = require('../../utils/response')

exports.getAllBarang = async (req, res) => {
  try {
    const { items, pagination } = await BarangService.getAllBarang(req.query)

    return success(res, items, 'Berhasil mengambil data barang', pagination)
  } catch (err) {
    console.error(err)
    return error(res, 'Gagal mengambil data barang', 500)
  }
}

exports.getBarangById = async (req, res) => {
  try {
    const data = await BarangService.getBarangById(req.params.id)

    if (!data) {
      return error(res, 'Barang tidak ditemukan', 404)
    }

    return success(res, data, 'Berhasil mengambil detail barang')
  } catch (err) {
    console.error(err)
    return error(res, 'Gagal mengambil detail barang', 500)
  }
}

exports.createBarang = async (req, res) => {
  try {
    const data = await BarangService.createBarang(req.body)
    return success(res, data, 'Berhasil membuat barang', null, 201)
  } catch (err) {
    console.error(err)
    return error(res, 'Gagal membuat barang', 500)
  }
}

exports.updateBarang = async (req, res) => {
  try {
    const data = await BarangService.updateBarang(req.params.id, req.body)
    return success(res, data, 'Berhasil mengupdate barang')
  } catch (err) {
    console.error(err)
    return error(res, 'Gagal mengupdate barang', 500)
  }
}

exports.deleteBarang = async (req, res) => {
  try {
    await BarangService.deleteBarang(req.params.id)
    return success(res, null, 'Berhasil menghapus barang')
  } catch (err) {
    console.error(err)
    return error(res, 'Gagal menghapus barang', 500)
  }
}
