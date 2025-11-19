// src/modules/barang/barang.route.js
const express = require('express')
const router = express.Router()
const barangController = require('./barang.controller')
// const auth = require('../../middlewares/auth') // kalau sudah ada

// Kalau mau pakai auth, tinggal ganti jadi: router.get('/', auth, barangController.getAllBarang)
router.get('/', barangController.getAllBarang)
router.get('/:id', barangController.getBarangById)
router.post('/', barangController.createBarang)
router.put('/:id', barangController.updateBarang)
router.delete('/:id', barangController.deleteBarang)

module.exports = router
