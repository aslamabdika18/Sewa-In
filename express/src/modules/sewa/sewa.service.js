const prisma = require("../../config/database");

/**
 * BUSINESS LOGIC HELPER FUNCTIONS
 */

/**
 * Hitung durasi sewa dalam hari
 * @param {Date} startDate - Tanggal mulai
 * @param {Date} endDate - Tanggal berakhir
 * @returns {number} Jumlah hari
 */
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, days); // Minimal 1 hari
}

/**
 * Check apakah barang tersedia pada tanggal tersebut
 * @param {number} barangId - ID barang
 * @param {Date} startDate - Tanggal mulai
 * @param {Date} endDate - Tanggal berakhir
 * @param {number} quantity - Jumlah yang ingin disewa
 * @returns {Promise<boolean>} True jika tersedia
 */
async function checkStockAvailability(barangId, startDate, endDate, quantity) {
  // Get barang dengan stock-nya
  const barang = await prisma.barang.findUnique({
    where: { id: barangId }
  });

  if (!barang) {
    throw new Error(`Barang dengan ID ${barangId} tidak ditemukan`);
  }

  if (barang.stock < quantity) {
    throw new Error(`Stock tidak cukup. Tersedia: ${barang.stock}, diminta: ${quantity}`);
  }

  // Check apakah ada booking overlap
  const overlappingBooking = await prisma.sewaItem.findMany({
    where: {
      barangId,
      sewa: {
        startDate: { lt: new Date(endDate) },
        endDate: { gt: new Date(startDate) },
        status: { in: ['PENDING', 'PAID', 'ONGOING'] } // Exclude FINISHED & CANCELLED
      }
    },
    include: {
      sewa: true
    }
  });

  // Hitung total quantity yang sudah disewa pada tanggal tersebut
  const totalRented = overlappingBooking.reduce((sum, item) => sum + item.quantity, 0);

  if (totalRented + quantity > barang.stock) {
    const available = barang.stock - totalRented;
    throw new Error(`Stock tidak cukup pada tanggal tersebut. Tersedia: ${available}, diminta: ${quantity}`);
  }

  return true;
}

/**
 * Hitung total price berdasarkan items dan durasi
 * @param {Array} items - Array dengan {barangId, quantity}
 * @param {Date} startDate - Tanggal mulai
 * @param {Date} endDate - Tanggal berakhir
 * @returns {Promise<number>} Total price
 */
async function calculateTotalPrice(items, startDate, endDate) {
  const duration = calculateDuration(startDate, endDate);

  // Get semua barang yang dirental
  const barangIds = items.map(item => item.barangId);
  const barangs = await prisma.barang.findMany({
    where: { id: { in: barangIds } }
  });

  // Hitung total price
  let totalPrice = 0;
  items.forEach(item => {
    const barang = barangs.find(b => b.id === item.barangId);
    if (barang) {
      totalPrice += barang.pricePerDay * item.quantity * duration;
    }
  });

  return totalPrice;
}

/**
 * LIST SEWA - dengan pagination
 */
module.exports.getAllSewa = async (query = {}) => {
  const { page, limit, skip, take, isAll } = require('../../utils/pagination').getPagination(query);

  const [sewas, total] = await Promise.all([
    prisma.sewa.findMany({
      where: { deletedAt: null }, // SOFT DELETE: Exclude deleted sewas
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: { barang: true }
        },
        payment: true
      }
    }),
    prisma.sewa.count({ where: { deletedAt: null } }) // Count only active
  ]);

  return {
    items: sewas,
    pagination: isAll ? null : {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * GET SEWA BY ID - dengan items & payment (exclude soft-deleted)
 */
module.exports.getSewaById = async (id) => {
  return prisma.sewa.findFirst({
    where: { id, deletedAt: null }, // SOFT DELETE: Exclude deleted
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true }
      },
      items: {
        include: {
          barang: {
            select: { id: true, name: true, pricePerDay: true }
          }
        }
      },
      payment: true
    }
  });
};

/**
 * CREATE SEWA - dengan validation & business logic
 * 
 * RACE CONDITION FIX:
 * Menggunakan Prisma transaction dengan isolationLevel: 'Serializable'
 * Ini memastikan:
 * 1. Check stock + Create sewa atomic (semua atau tidak sama sekali)
 * 2. Tidak ada 2 user bisa book item yang sama pada waktu bersamaan
 * 3. Stock tidak pernah oversell
 */
module.exports.createSewa = async (data, userId) => {
  const { startDate, endDate, items } = data;
  const transactionStartTime = Date.now();

  // Wrap semua dalam transaction dengan Serializable isolation
  // Ini lock database rows yang diakses, prevent concurrent modifications
  const sewa = await prisma.$transaction(
    async (tx) => {
      // STEP 1: Check availability untuk SEMUA items (dalam transaction)
      for (const item of items) {
        const barang = await tx.barang.findUnique({
          where: { id: item.barangId }
        });

        if (!barang) {
          throw new Error(`Barang dengan ID ${item.barangId} tidak ditemukan`);
        }

        // Check physical stock
        if (barang.stock < item.quantity) {
          throw new Error(
            `Stock tidak cukup untuk ${barang.name}. Tersedia: ${barang.stock}, diminta: ${item.quantity}`
          );
        }

        // Check date overlap dengan active rentals
        const overlappingBooking = await tx.sewaItem.findMany({
          where: {
            barangId: item.barangId,
            sewa: {
              startDate: { lt: new Date(endDate) },
              endDate: { gt: new Date(startDate) },
              status: { in: ['PENDING', 'PAID', 'ONGOING'] }
            }
          }
        });

        const totalRented = overlappingBooking.reduce(
          (sum, sewaItem) => sum + sewaItem.quantity,
          0
        );

        const available = barang.stock - totalRented;

        if (item.quantity > available) {
          throw new Error(
            `Stock tidak cukup pada tanggal ${startDate.toString()} - ${endDate.toString()} ` +
            `untuk ${barang.name}. Tersedia: ${available}, diminta: ${item.quantity}`
          );
        }
      }

      // STEP 2: Calculate total price
      const barangIds = items.map(item => item.barangId);
      const barangs = await tx.barang.findMany({
        where: { id: { in: barangIds } }
      });

      const duration = calculateDuration(startDate, endDate);
      let totalPrice = 0;

      items.forEach(item => {
        const barang = barangs.find(b => b.id === item.barangId);
        if (barang) {
          totalPrice += barang.pricePerDay * item.quantity * duration;
        }
      });

      // STEP 3: Create sewa + items (semua dalam 1 transaction)
      // Jika ada error di step 1 atau 2, transaction di-rollback otomatis
      const newSewa = await tx.sewa.create({
        data: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          status: 'PENDING',
          items: {
            create: items.map(item => ({
              barangId: item.barangId,
              quantity: item.quantity || 1
            }))
          }
        },
        include: {
          items: {
            include: { barang: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return newSewa;
    },
    {
      isolationLevel: 'Serializable',  // 🔒 Highest isolation - prevent race condition
      timeout: 5000  // Timeout 5 detik untuk prevent deadlock
    }
  );

  // Log transaction success
  const transactionDuration = Date.now() - transactionStartTime;
  console.log(`[SEWA] Transaction SUCCESS - userId: ${userId}, sewaId: ${sewa.id}, duration: ${transactionDuration}ms, items: ${items.length}`);

  return sewa;
};

/**
 * UPDATE SEWA STATUS
 */
module.exports.updateSewa = async (id, data) => {
  const { status } = data;

  if (!status) {
    throw new Error('Status tidak boleh kosong');
  }

  return prisma.sewa.update({
    where: { id },
    data: { status },
    include: {
      items: { include: { barang: true } },
      user: { select: { id: true, name: true, email: true } },
      payment: true
    }
  });
};

/**
 * CANCEL SEWA - soft delete dengan status CANCELLED
 * 
 * SOFT DELETE PATTERN:
 * - Set deletedAt = NOW
 * - Set status = CANCELLED
 * - Record tetap di database (bisa di-restore)
 * - Automatically excluded dari queries (deletedAt filter)
 */
module.exports.deleteSewa = async (id) => {
  const sewa = await prisma.sewa.findFirst({ where: { id, deletedAt: null } });

  if (!sewa) {
    throw new Error('Sewa tidak ditemukan');
  }

  // Hanya bisa cancel jika status PENDING atau PAID
  if (!['PENDING', 'PAID'].includes(sewa.status)) {
    throw new Error(`Tidak bisa cancel sewa dengan status ${sewa.status}`);
  }

  return prisma.sewa.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      deletedAt: new Date() // SOFT DELETE: Mark as deleted
    },
    include: {
      items: { include: { barang: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });
};
