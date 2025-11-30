const prisma = require("../../config/database");
const { getPagination } = require("../../utils/pagination");

/**
 * Get All Categories dengan pagination
 */
module.exports.getAllCategories = async (query = {}) => {
    try {
        const { page, limit, skip, take, isAll } = getPagination(query);

        // Build findMany options
        const findOptions = {
            include: {
                barangs: true
            },
            orderBy: { id: "desc" }
        };

        // Add pagination only if not "all"
        if (!isAll) {
            findOptions.skip = skip;
            findOptions.take = take;
        }

        const [items, total] = await Promise.all([
            prisma.category.findMany(findOptions),
            prisma.category.count()
        ]);

        return {
            items,
            pagination: isAll ? null : {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (err) {
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
                barangs: true
            }
        });
    } catch (err) {
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
                name: data.name
            }
        });
    } catch (err) {
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
                name: data.name
            }
        });
    } catch (err) {
        throw new Error("Gagal mengupdate kategori");
    }
};

/**
 * Delete Category
 */
module.exports.deleteCategory = async (id) => {
    try {
        return await prisma.category.delete({
            where: { id: Number(id) }
        });
    } catch (err) {
        throw new Error("Gagal menghapus kategori");
    }
};
