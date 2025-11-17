const prisma = require("../../config/database");

/**
 * Get All Categories
 */
module.exports.getAllCategories = async () => {
    try {
        return await prisma.category.findMany({
            include: {
                barangs: true, // relasi yang benar sesuai schema
            },
            orderBy: { id: "desc" },
        });
    } catch (err) {
        console.error("Service Error (getAllCategories):", err);
        throw new Error("Gagal mengambil kategori");
    }
};

/**
 * Get Category By ID
 */
module.exports.getCategoryById = async (id) => {
    try {
        return await prisma.category.findUnique({
            where: { id: Number(id) },
            include: {
                barangs: true,
            },
        });
    } catch (err) {
        console.error("Service Error (getCategoryById):", err);
        throw new Error("Gagal mengambil kategori");
    }
};

/**
 * Create Category
 */
module.exports.createCategory = async (data) => {
    try {
        return await prisma.category.create({
            data: {
                name: data.name,
            },
        });
    } catch (err) {
        console.error("Service Error (createCategory):", err);
        throw new Error("Gagal membuat kategori");
    }
};

/**
 * Update Category
 */
module.exports.updateCategory = async (id, data) => {
    try {
        return await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
            },
        });
    } catch (err) {
        console.error("Service Error (updateCategory):", err);
        throw new Error("Gagal mengupdate kategori");
    }
};

/**
 * Delete Category
 */
module.exports.deleteCategory = async (id) => {
    try {
        return await prisma.category.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error("Service Error (deleteCategory):", err);
        throw new Error("Gagal menghapus kategori");
    }
};
