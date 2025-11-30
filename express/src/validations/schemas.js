//src/validations/schemas.js

/**
 * Validation schemas menggunakan Zod
 * Digunakan untuk validate request body sebelum masuk ke controller
 * 
 * Best Practice:
 * 1. Setiap field punya clear error message
 * 2. Data otomatis di-coerce ke tipe yang benar
 * 3. Input sanitization (trim, lowercase, etc)
 * 4. Business logic validation (dates, ranges, etc)
 * 5. Prevent SQL injection & XSS via strict type checking
 * 6. Reusable untuk multiple routes
 * 
 * Security:
 * - Zod prevents type coercion attacks
 * - String inputs di-trim untuk prevent whitespace injection
 * - Regex patterns untuk phone/special formats
 * - Min/Max length untuk prevent DoS
 * - Email validation untuk prevent spoofing
 */

const { z } = require('zod');

// ===== AUTH SCHEMAS =====
const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Email tidak valid')
    .toLowerCase()
    .refine((email) => email.length <= 100, 'Email terlalu panjang'),
  name: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Nama mengandung karakter tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .refine((pwd) => /[A-Z]/.test(pwd), 'Password minimal 1 huruf besar')
    .refine((pwd) => /[0-9]/.test(pwd), 'Password minimal 1 angka')
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Email tidak valid')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(1, 'Password wajib diisi')
    .max(100, 'Password terlalu panjang')
});

// ===== BARANG SCHEMAS =====
const barangCreateSchema = z.object({
  name: z
    .string({ required_error: 'Nama barang wajib diisi' })
    .min(2, 'Nama barang minimal 2 karakter')
    .max(150, 'Nama barang maksimal 150 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Nama mengandung karakter tidak valid'),
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .trim()
    .optional()
    .nullable(),
  pricePerDay: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), 'Harga harus berupa angka')
    .transform((val) => Number(val))
    .refine((val) => val > 0, 'Harga harus lebih dari 0')
    .refine((val) => val <= 999999999, 'Harga maksimal 999999999'),
  categoryId: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), 'Category ID harus berupa angka')
    .transform((val) => Number(val))
    .refine((val) => val > 0, 'Category ID harus lebih dari 0'),
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .default(1)
    .refine((val) => val >= 1, 'Stock minimal 1')
    .refine((val) => val <= 999999, 'Stock maksimal 999999')
});

const barangUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama barang minimal 2 karakter')
    .max(150, 'Nama barang maksimal 150 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Nama mengandung karakter tidak valid')
    .optional(),
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .trim()
    .optional()
    .nullable(),
  pricePerDay: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), 'Harga harus berupa angka')
    .transform((val) => Number(val))
    .refine((val) => val > 0, 'Harga harus lebih dari 0')
    .refine((val) => val <= 999999999, 'Harga maksimal 999999999')
    .optional(),
  categoryId: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), 'Category ID harus berupa angka')
    .transform((val) => Number(val))
    .refine((val) => val > 0, 'Category ID harus lebih dari 0')
    .optional(),
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, 'Stock minimal 1')
    .refine((val) => val <= 999999, 'Stock maksimal 999999')
    .optional()
});

// ===== CATEGORY SCHEMAS =====
const categoryCreateSchema = z.object({
  name: z
    .string({ required_error: 'Nama kategori wajib diisi' })
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(100, 'Nama kategori maksimal 100 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Kategori mengandung karakter tidak valid')
});

const categoryUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(100, 'Nama kategori maksimal 100 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Kategori mengandung karakter tidak valid')
    .optional()
});

// ===== SEWA SCHEMAS =====
/**
 * Schema untuk create sewa dengan validasi:
 * - startDate harus lebih besar dari sekarang
 * - endDate harus lebih besar dari startDate
 * - Minimal sewa 1 hari
 * - Items harus valid (barangId, quantity)
 * - totalPrice otomatis dihitung dari server
 */
const sewaCreateSchema = z.object({
  startDate: z
    .string({ required_error: 'Tanggal mulai wajib diisi' })
    .datetime('Format tanggal tidak valid')
    .refine(
      (val) => new Date(val) > new Date(),
      'Tanggal mulai harus lebih besar dari hari ini'
    ),
  endDate: z
    .string({ required_error: 'Tanggal berakhir wajib diisi' })
    .datetime('Format tanggal tidak valid'),
  items: z
    .array(
      z.object({
        barangId: z
          .union([z.string(), z.number()])
          .refine((val) => !isNaN(Number(val)), 'Barang ID harus angka')
          .transform((val) => Number(val))
          .refine((val) => val > 0, 'Barang ID harus lebih dari 0'),
        quantity: z
          .union([z.string(), z.number()])
          .transform((val) => Number(val))
          .default(1)
          .refine((val) => val >= 1, 'Quantity minimal 1')
      })
    )
    .min(1, 'Minimal harus ada 1 barang')
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'Tanggal berakhir harus lebih besar dari tanggal mulai',
    path: ['endDate']
  }
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 1;
  },
  {
    message: 'Minimal durasi sewa adalah 1 hari',
    path: ['endDate']
  }
);

/**
 * Schema untuk update sewa status
 * Hanya admin/owner bisa update status
 */
const sewaUpdateSchema = z.object({
  status: z
    .enum(['PENDING', 'PAID', 'ONGOING', 'FINISHED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Status tidak valid' })
    })
    .optional()
});

// ===== USER SCHEMAS =====
const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim()
    .refine((name) => !/[<>\"'%;()&+]/.test(name), 'Nama mengandung karakter tidak valid')
    .optional(),
  phone: z
    .string()
    .regex(/^(\+62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid (format: +62... atau 08...)')
    .optional()
    .nullable()
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: 'Password lama wajib diisi' })
    .min(1, 'Password lama wajib diisi')
    .max(100, 'Password terlalu panjang'),
  newPassword: z
    .string({ required_error: 'Password baru wajib diisi' })
    .min(6, 'Password baru minimal 6 karakter')
    .max(100, 'Password baru maksimal 100 karakter')
    .refine((pwd) => /[A-Z]/.test(pwd), 'Password minimal 1 huruf besar')
    .refine((pwd) => /[0-9]/.test(pwd), 'Password minimal 1 angka'),
  confirmPassword: z
    .string({ required_error: 'Konfirmasi password wajib diisi' })
    .max(100, 'Password terlalu panjang')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password baru tidak cocok',
  path: ['confirmPassword']
}).refine((data) => data.oldPassword !== data.newPassword, {
  message: 'Password baru tidak boleh sama dengan password lama',
  path: ['newPassword']
});

module.exports = {
  // Auth
  registerSchema,
  loginSchema,
  // Barang
  barangCreateSchema,
  barangUpdateSchema,
  // Category
  categoryCreateSchema,
  categoryUpdateSchema,
  // Sewa
  sewaCreateSchema,
  sewaUpdateSchema,
  // User
  userUpdateSchema,
  changePasswordSchema
};
