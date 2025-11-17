const categoryService = require("./category.service");

module.exports.getAll = async (req, res) => {
    try {
        const data = await categoryService.getAllCategories();
        res.json({
            status: true,
            message: "Berhasil mengambil data kategori",
            data,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports.getById = async (req, res) => {
    try {
        const data = await categoryService.getCategoryById(req.params.id);
        res.json({
            status: true,
            message: "Berhasil mengambil kategori",
            data,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports.create = async (req, res) => {
    try {
        const data = await categoryService.createCategory(req.body);
        res.json({
            status: true,
            message: "Kategori berhasil dibuat",
            data,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports.update = async (req, res) => {
    try {
        const data = await categoryService.updateCategory(req.params.id, req.body);
        res.json({
            status: true,
            message: "Kategori berhasil diupdate",
            data,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

module.exports.delete = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.json({
            status: true,
            message: "Kategori berhasil dihapus",
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
