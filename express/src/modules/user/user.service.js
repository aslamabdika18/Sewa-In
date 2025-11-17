const prisma = require("../../config/database");

module.exports.getAllUsers = () => prisma.user.findMany();

module.exports.getUserById = (id) =>
  prisma.user.findUnique({ where: { id } });
