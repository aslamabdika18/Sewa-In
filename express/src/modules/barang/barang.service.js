// src/modules/barang/barang.service.js
const { prisma } = require('../../database')
const { getPagination } = require('../../utils/pagination')

/**
 * Ambil list barang dari DB.
 * Support:
 * - search (by name)
 * - filter categoryId
 * - pagination
 * TIDAK ada N+1 karena pakai include + Promise.all
 */
exports.getAllBarang = async (query) => {
    const { page, limit, skip, take, isAll } = getPagination(query)

    const where = {}

    if (query.search) {
        where.name = {
            contains: query.search,
            mode: 'insensitive',
        }
    }

    if (query.categoryId) {
        where.categoryId = Number(query.categoryId)
    }

    // 2 query paralel: list + total
    const [items, total] = await Promise.all([
        prisma.barang.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true, // <--- ini yang menghindari N+1
            },
        }),
        prisma.barang.count({ where }),
    ])

    return {
        items,
        pagination: isAll
            ? null
            : {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
    }
}

/**
 * Ambil 1 barang by ID (sekalian kategori).
 */
exports.getBarangById = async (id) => {
    return prisma.barang.findUnique({
        where: { id: Number(id) },
        include: { category: true },
    })
}

/**
 * Buat barang baru.
 */
exports.createBarang = async (payload) => {
    return prisma.barang.create({
        data: {
            name: payload.name,
            description: payload.description || null,
            pricePerDay: payload.pricePerDay,
            stock: payload.stock,
            categoryId: payload.categoryId,
        },
    })
}

/**
 * Update barang.
 */
exports.updateBarang = async (id, payload) => {
    return prisma.barang.update({
        where: { id: Number(id) },
        data: {
            name: payload.name,
            description:
                payload.description === undefined ? undefined : payload.description,
            pricePerDay: payload.pricePerDay,
            stock: payload.stock,
            categoryId: payload.categoryId,
        },
    })
}

/**
 * Hapus barang.
 */
exports.deleteBarang = async (id) => {
    return prisma.barang.delete({
        where: { id: Number(id) },
    })
}
