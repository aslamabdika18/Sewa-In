/**
 * Soft Delete Utility Functions
 * 
 * Soft delete pattern:
 * - Set deletedAt field instead of hard delete
 * - Queries automatically exclude soft-deleted records
 * - Can restore by setting deletedAt back to NULL
 * 
 * Benefits:
 * 1. Data Recovery: Accidental deletes dapat di-restore
 * 2. Audit Trail: Track kapan & siapa yang delete
 * 3. Financial Reporting: Tetap include dalam reporting
 * 4. Referential Integrity: Foreign keys masih valid
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * SOFT DELETE - Set deletedAt instead of hard delete
 * 
 * Usage:
 *   await softDeleteSewa(sewaId);
 * 
 * Result:
 *   - Sewa marked as deleted (deletedAt = NOW)
 *   - But data still in database (can be restored)
 */
exports.softDeleteSewa = async (sewaId) => {
  return prisma.sewa.update({
    where: { id: sewaId },
    data: {
      status: 'CANCELLED', // Update status
      deletedAt: new Date() // Mark as deleted
    }
  });
};

/**
 * GET ACTIVE ONLY - Exclude soft-deleted records
 * 
 * Automatically filter out records dengan deletedAt != NULL
 * 
 * Usage:
 *   // Get sewa by ID (only if not deleted)
 *   const sewa = await getActiveSewas({ where: { id: sewaId } });
 *
 *   // Get user sewas (only active ones)
 *   const userSewas = await getActiveSewas({ where: { userId: userId } });
 */
exports.getActiveSewas = async (prismaQuery) => {
  return prisma.sewa.findMany({
    ...prismaQuery,
    where: {
      ...prismaQuery?.where,
      deletedAt: null // IMPORTANT: Exclude soft-deleted
    }
  });
};

/**
 * GET ACTIVE BY ID - Single record, exclude if deleted
 */
exports.getActiveSewaById = async (sewaId) => {
  return prisma.sewa.findFirst({
    where: {
      id: sewaId,
      deletedAt: null // Exclude soft-deleted
    }
  });
};

/**
 * RESTORE SOFT-DELETED - Set deletedAt back to NULL
 * 
 * Usage:
 *   await restoreSewa(sewaId);
 */
exports.restoreSewa = async (sewaId) => {
  return prisma.sewa.update({
    where: { id: sewaId },
    data: {
      deletedAt: null,
      status: 'PENDING' // Reset status to PENDING
    }
  });
};

/**
 * GET DELETED ONLY - For admin audit trail
 * 
 * Usage:
 *   const deletedSewas = await getDeletedSewas({ userId: userId });
 */
exports.getDeletedSewas = async (whereClause = {}) => {
  return prisma.sewa.findMany({
    where: {
      ...whereClause,
      deletedAt: { not: null } // Only deleted records
    },
    include: {
      user: true,
      items: { include: { barang: true } },
      payment: true
    },
    orderBy: { deletedAt: 'desc' }
  });
};

/**
 * HARD DELETE - Permanently remove record
 * 
 * WARNING: Use dengan hati-hati! Ini permanent!
 * Only for:
 * - Test data cleanup
 * - Admin maintenance
 * - Data retention policy (delete records older than X years)
 * 
 * Usage:
 *   await hardDeleteSewa(sewaId);
 */
exports.hardDeleteSewa = async (sewaId) => {
  // First delete related SewaItems
  await prisma.sewaItem.deleteMany({
    where: { sewaId }
  });

  // Then delete related Payment
  await prisma.payment.deleteMany({
    where: { sewaId }
  });

  // Finally delete Sewa
  return prisma.sewa.delete({
    where: { id: sewaId }
  });
};

/**
 * CLEANUP POLICY - Delete old soft-deleted records (retention policy)
 * 
 * Usage:
 *   // Keep soft-deleted records for 90 days, then hard delete
 *   await cleanupOldDeletedSewas(90);
 */
exports.cleanupOldDeletedSewas = async (retentionDays = 90) => {
  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() - retentionDays);

  const oldDeletedSewas = await prisma.sewa.findMany({
    where: {
      deletedAt: {
        lte: retentionDate // Deleted before this date
      }
    }
  });

  for (const sewa of oldDeletedSewas) {
    await exports.hardDeleteSewa(sewa.id);
  }

  return {
    message: `Cleaned up ${oldDeletedSewas.length} soft-deleted sewas older than ${retentionDays} days`,
    count: oldDeletedSewas.length
  };
};

module.exports = exports;
