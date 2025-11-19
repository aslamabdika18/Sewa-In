const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "sewa_token";

async function registerUser({ email, name, password }) {
  if (!email || !name || !password) {
    throw new Error("Email, nama, dan password wajib diisi");
  }

  // cek apakah email sudah dipakai
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  // 🔧 HASH password, jangan redeclare password yang sama
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: 'USER'  // Default role untuk user baru
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  // kembalikan data user tanpa password
  return user; // { id, email, name, role }
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  // cari user by email
  const user = await prisma.user.findUnique({
    where: { email }
    // bisa pakai select kalau mau:
    // select: { id: true, email: true, name: true, password: true }
  });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  // ⚠️ SESUAIKAN DENGAN FIELD PRISMA
  // Kalau di DB field-nya "password":
  const storedPasswordHash = user.password;

  // Kalau kamu pakai "passwordHash", ganti jadi:
  // const storedPasswordHash = user.passwordHash;

  if (!storedPasswordHash) {
    // ini untuk jaga-jaga kalau row lama belum punya password
    throw new Error("Password pengguna belum tersimpan dengan benar");
  }

  const isMatch = await bcrypt.compare(password, storedPasswordHash);

  if (!isMatch) {
    throw new Error("Email atau password salah");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role  // Include role dalam JWT payload
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return { token, user: payload };
}

module.exports = {
  COOKIE_NAME,
  registerUser,
  loginUser
};
