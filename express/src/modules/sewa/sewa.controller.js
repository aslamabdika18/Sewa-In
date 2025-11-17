const SewaService = require("./sewa.service");
const { success } = require("../../utils/response");

module.exports.getAll = async (req, res) => {
  return success(res, await SewaService.getAllSewa());
};

module.exports.getById = async (req, res) => {
  return success(res, await SewaService.getSewaById(Number(req.params.id)));
};

module.exports.create = async (req, res) => {
  return success(res, await SewaService.createSewa(req.body));
};

module.exports.update = async (req, res) => {
  return success(res, await SewaService.updateSewa(Number(req.params.id), req.body));
};

module.exports.remove = async (req, res) => {
  return success(res, await SewaService.deleteSewa(Number(req.params.id)));
};
