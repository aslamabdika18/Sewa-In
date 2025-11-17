const prisma = require("../../config/database");

// LIST ringan
module.exports.getAllSewa = async () => {
  return prisma.sewa.findMany({
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });
};

// DETAIL lengkap + barang
module.exports.getSewaById = async (id) => {
  return prisma.sewa.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          barang: true,
        },
      },
    },
  });
};

module.exports.createSewa = async (data) => {
  return prisma.sewa.create({
    data,
    include: {
      items: true,
    },
  });
};

module.exports.updateSewa = async (id, data) => {
  return prisma.sewa.update({
    where: { id },
    data,
  });
};

module.exports.deleteSewa = async (id) => {
  return prisma.sewa.delete({
    where: { id },
  });
};
