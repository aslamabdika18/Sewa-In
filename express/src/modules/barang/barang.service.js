// src/modules/barang/barang.service.js
const prisma = require('../../config/database')
const { getPagination } = require('../../utils/pagination')
const { getCachedOrFetch, invalidateCachePattern, invalidateCache } = require('../../services/cache.service')
const logger = require('../../config/logger')

/**
 * Ambil list barang dari DB dengan caching, filtering, dan sorting.
 * Support:
 * - search (by name dan description)
 * - filter categoryId
 * - filter price range (priceMin, priceMax)
 * - pagination
 * - sorting (newest, oldest, price-low, price-high)
 * - Redis caching
 */
exports.getAllBarang = async (query) => {
    const { page = 1, limit = 10, search, categoryId, priceMin, priceMax, sort = 'newest' } = query
    
    // Sanitize limit (max 100)
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100)
    const safePage = Math.max(parseInt(page) || 1, 1)
    const skip = (safePage - 1) * safeLimit

    // Build cache key
    const cacheKey = `barang:list:${JSON.stringify({ page: safePage, limit: safeLimit, search, categoryId, priceMin, priceMax, sort })}`

    return getCachedOrFetch(cacheKey, async () => {
        const where = {}

        // Search by name atau description
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Filter by category
        if (categoryId) {
            where.categoryId = Number(categoryId)
        }

        // Filter by price range
        if (priceMin !== undefined || priceMax !== undefined) {
            where.pricePerDay = {}
            if (priceMin !== undefined) {
                where.pricePerDay.gte = Number(priceMin)
            }
            if (priceMax !== undefined) {
                where.pricePerDay.lte = Number(priceMax)
            }
        }

        // Build sort order
        let orderBy = { createdAt: 'desc' }
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' }
        } else if (sort === 'price-low') {
            orderBy = { pricePerDay: 'asc' }
        } else if (sort === 'price-high') {
            orderBy = { pricePerDay: 'desc' }
        }

        // Build findMany options
        const findOptions = {
            where,
            skip,
            take: safeLimit,
            orderBy,
            select: {
                id: true,
                name: true,
                description: true,
                pricePerDay: true,
                stock: true,
                images: true,
                categoryId: true,
                category: { select: { id: true, name: true } },
                createdAt: true
            }
        }

        // 2 query paralel: list + total
        const [items, total] = await Promise.all([
            prisma.barang.findMany(findOptions),
            prisma.barang.count({ where }),
        ])

        return {
            items,
            pagination: {
                total,
                page: safePage,
                limit: safeLimit,
                totalPages: Math.ceil(total / safeLimit),
            },
        }
    }, 3600) // Cache 1 hour
}

/**
 * Ambil 1 barang by ID dengan caching.
 */
exports.getBarangById = async (id) => {
    const barangId = Number(id)
    const cacheKey = `barang:${barangId}`

    return getCachedOrFetch(cacheKey, async () => {
        return prisma.barang.findUnique({
            where: { id: barangId },
            include: { 
                category: true,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5 // Get latest 5 reviews
                }
            }
        })
    }, 1800) // Cache 30 minutes
}

/**
 * Buat barang baru dengan support untuk images.
 */
exports.createBarang = async (payload) => {
    const barang = await prisma.barang.create({
        data: {
            name: payload.name,
            description: payload.description || null,
            pricePerDay: payload.pricePerDay,
            stock: payload.stock,
            categoryId: payload.categoryId,
            images: payload.images || null,
            imageId: payload.imageId || null,
        },
        include: { category: true }
    })

    // Invalidate list cache
    await invalidateCachePattern('barang:list:*')

    logger.info(`Barang created: ${barang.id}`)
    return barang
}

/**
 * Update barang dengan cache invalidation.
 */
exports.updateBarang = async (id, payload) => {
    const barangId = Number(id)
    
    const barang = await prisma.barang.update({
        where: { id: barangId },
        data: {
            name: payload.name,
            description: payload.description === undefined ? undefined : payload.description,
            pricePerDay: payload.pricePerDay,
            stock: payload.stock,
            categoryId: payload.categoryId,
            images: payload.images === undefined ? undefined : payload.images,
            imageId: payload.imageId === undefined ? undefined : payload.imageId,
        },
        include: { category: true }
    })

    // Invalidate both detail and list cache
    await invalidateCache(`barang:${barangId}`)
    await invalidateCachePattern('barang:list:*')

    logger.info(`Barang updated: ${barangId}`)
    return barang
}

/**
 * Hapus barang dengan cache invalidation.
 * Also deletes associated images.
 */
exports.deleteBarang = async (id) => {
    const barangId = Number(id)

    // Get barang to get imageId
    const barang = await prisma.barang.findUnique({
        where: { id: barangId }
    })

    if (!barang) {
        throw new Error('Barang tidak ditemukan')
    }

    // Delete from database
    await prisma.barang.delete({
        where: { id: barangId }
    })

    // Delete images if exists
    if (barang.imageId) {
        const { deleteImages } = require('../../middlewares/fileUpload')
        await deleteImages('barang', barang.imageId)
    }

    // Invalidate cache
    await invalidateCache(`barang:${barangId}`)
    await invalidateCachePattern('barang:list:*')

    logger.info(`Barang deleted: ${barangId}`)
    return { id: barangId }
}
