const UserService = require("./user.service");
const { success } = require("../../utils/response");

module.exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return success(res, user, "Data user berhasil diambil");
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await UserService.updateUser(userId, req.validated);
    return success(res, data, "Profil berhasil diupdate");
  } catch (err) {
    next(err);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.validated;
    await UserService.changePassword(userId, oldPassword, newPassword);
    return success(res, null, "Password berhasil diubah");
  } catch (err) {
    next(err);
  }
};

module.exports.getAll = async (req, res, next) => {
  try {
    const { items, pagination } = await UserService.getAllUsers(req.query);
    return success(res, items, "Daftar user berhasil diambil", pagination);
  } catch (err) {
    next(err);
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const data = await UserService.getUserById(Number(req.params.id));
    return success(res, data, "Detail user berhasil diambil");
  } catch (err) {
    next(err);
  }
};
