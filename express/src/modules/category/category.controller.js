const categoryService = require("./category.service");
const { success } = require("../../utils/response");

module.exports.getAll = async (req, res, next) => {
    try {
        const { items, pagination } = await categoryService.getAllCategories(req.query);
        return success(res, items, "Berhasil mengambil data kategori", pagination);
    } catch (err) {
        next(err);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        const data = await categoryService.getCategoryById(req.params.id);
        return success(res, data, "Berhasil mengambil detail kategori");
    } catch (err) {
        next(err);
    }
};

module.exports.create = async (req, res, next) => {
    try {
        const data = await categoryService.createCategory(req.validated);
        return success(res, data, "Kategori berhasil dibuat", null, 201);
    } catch (err) {
        next(err);
    }
};

module.exports.update = async (req, res, next) => {
    try {
        const data = await categoryService.updateCategory(req.params.id, req.validated);
        return success(res, data, "Kategori berhasil diupdate");
    } catch (err) {
        next(err);
    }
};

module.exports.delete = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return success(res, null, "Kategori berhasil dihapus");
    } catch (err) {
        next(err);
    }
};
