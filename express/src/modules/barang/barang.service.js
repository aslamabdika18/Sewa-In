const prisma = require("../../config/database");
const { getPagination } = require("../../utils/pagination");

/**
 * Get All Barang with Pagination
 */
module.exports.getAllBarang = async (query) => {
    try {
        const { take, skip, isAll, page, limit } = getPagination(query);

        const [data, total] = await Promise.all([
            prisma.barang.findMany({
                skip,
                take,
                include: {
                    category: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.barang.count(),
        ]);

        return {
            status: true,
            message: "Berhasil mendapatkan data barang",
            data,
            pagination: isAll
                ? null
                : {
                      total,
                      page,
                      limit,
                      totalPages: Math.ceil(total / limit),
                  },
        };
    } catch (err) {
        console.error("Service Error (getAllBarang):", err);
        throw new Error("Gagal mengambil data barang");
    }
};

/**
 * Get Barang by ID
 */
module.exports.getBarangById = async (id) => {
    try {
        return await prisma.barang.findUnique({
            where: { id: Number(id) },
            include: {
                category: true,
            },
        });
    } catch (err) {
        console.error("Service Error (getBarangById):", err);
        throw new Error("Gagal mengambil data barang");
    }
};

/**
 * Create Barang
 */
module.exports.createBarang = async (data) => {
    try {
        return await prisma.barang.create({
            data: {
                name: data.name,
                description: data.description, // sesuai schema
                pricePerDay: Number(data.pricePerDay),
                stock: Number(data.stock),
                categoryId: Number(data.categoryId),
            },
        });
    } catch (err) {
        console.error("Service Error (createBarang):", err);
        throw new Error("Gagal membuat barang");
    }
};

/**
 * Update Barang
 */
module.exports.updateBarang = async (id, data) => {
    try {
        return await prisma.barang.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                description: data.description,
                pricePerDay: Number(data.pricePerDay),
                stock: Number(data.stock),
                categoryId: Number(data.categoryId),
            },
        });
    } catch (err) {
        console.error("Service Error (updateBarang):", err);
        throw new Error("Gagal mengupdate barang");
    }
};

/**
 * Delete Barang
 */
module.exports.deleteBarang = async (id) => {
    try {
        return await prisma.barang.delete({
            where: { id: Number(id) },
        });
    } catch (err) {
        console.error("Service Error (deleteBarang):", err);
        throw new Error("Gagal menghapus barang");
    }
};
