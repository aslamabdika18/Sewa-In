const BarangService = require("./barang.service");
const { success, error } = require("../../utils/response");

module.exports.getAll = async (req, res) => {
  try {
    const data = await BarangService.getAllBarang(req.query);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await BarangService.getBarangById(id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports.create = async (req, res) => {
  try {
    const data = await BarangService.createBarang(req.body);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await BarangService.updateBarang(id, req.body);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await BarangService.deleteBarang(id);
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
};
