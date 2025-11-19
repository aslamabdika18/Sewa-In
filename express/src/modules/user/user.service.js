const prisma = require("../../config/database");
const bcrypt = require("bcrypt");
const { getPagination } = require("../../utils/pagination");

module.exports.getAllUsers = async (query) => {
  const { page, limit, skip, take, isAll } = getPagination(query);

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    }),
    prisma.user.count()
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
};

module.exports.getUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true
    }
  });

module.exports.updateUser = async (id, data) => {
  const updateData = {};
  
  if (data.name) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true
    }
  });
};

module.exports.changePassword = async (id, oldPassword, newPassword) => {
  // Cari user berdasarkan ID
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // Bandingkan old password dengan yang tersimpan
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new Error("Password lama tidak sesuai");
  }

  // Hash password baru
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password di database
  await prisma.user.update({
    where: { id },
    data: { password: newPasswordHash }
  });
};
