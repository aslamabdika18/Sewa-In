const UserService = require("./user.service");
const { success } = require("../../utils/response");

module.exports.getAll = async (req, res) => {
  return success(res, await UserService.getAllUsers());
};

module.exports.getById = async (req, res) => {
  return success(res, await UserService.getUserById(Number(req.params.id)));
};
