const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Basic info tentang API
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sewa-In Rental API',
      version: '1.0.0',
      description: 'API dokumentasi untuk aplikasi Sewa-In - rental equipment online platform',
      contact: {
        name: 'Sewa-In Team',
        url: 'https://github.com/aslamabdika18/Sewa-In',
        email: 'support@sewa-in.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development server',
      },
      {
        url: `https://api.sewa-in.com/api/v1`,
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Login, register, dan authentication management',
      },
      {
        name: 'Barang (Items)',
        description: 'Kelola daftar barang/equipment yang dapat disewa',
      },
      {
        name: 'Category',
        description: 'Kelola kategori barang',
      },
      {
        name: 'Booking (Sewa)',
        description: 'Membuat dan mengelola booking/pesanan sewa',
      },
      {
        name: 'Payment',
        description: 'Pembayaran menggunakan Midtrans payment gateway',
      },
      {
        name: 'User',
        description: 'Mengelola profil user dan admin management',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sewa_token',
          description: 'JWT token disimpan di HttpOnly cookie',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token di Authorization header',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '081234567890',
            },
            address: {
              type: 'string',
              example: 'Jl. Raya No. 123',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              example: 'USER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Electronics',
            },
            description: {
              type: 'string',
              example: 'Kategori untuk elektronik dan gadget',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Barang: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Laptop Dell XPS 13',
            },
            description: {
              type: 'string',
              example: 'Laptop gaming dengan spesifikasi tinggi',
            },
            categoryId: {
              type: 'integer',
              example: 1,
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
            price: {
              type: 'number',
              format: 'float',
              example: 150000,
              description: 'Harga per hari dalam Rupiah',
            },
            stock: {
              type: 'integer',
              example: 10,
            },
            image: {
              type: 'string',
              format: 'url',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Sewa: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 42,
            },
            userId: {
              type: 'integer',
              example: 1,
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-20T10:00:00Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-25T10:00:00Z',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'ONGOING', 'FINISHED', 'CANCELLED'],
              example: 'PAID',
            },
            totalPrice: {
              type: 'number',
              format: 'float',
              example: 750000,
              description: 'Total harga sewa',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  barangId: {
                    type: 'integer',
                  },
                  quantity: {
                    type: 'integer',
                  },
                  barang: {
                    $ref: '#/components/schemas/Barang',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            sewaId: {
              type: 'integer',
              example: 42,
            },
            orderId: {
              type: 'string',
              example: 'sewa-42-1700000000',
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 750000,
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
              example: 'SUCCESS',
            },
            paymentType: {
              type: 'string',
              example: 'credit_card',
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Validation error',
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
          },
        },
      },
    },
  },
  // Path ke file yang berisi JSDoc comments
  apis: [
    './src/modules/auth/auth.route.js',
    './src/modules/barang/barang.route.js',
    './src/modules/category/category.route.js',
    './src/modules/sewa/sewa.route.js',
    './src/modules/midtrans/midtrans.route.js',
    './src/modules/user/user.route.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
