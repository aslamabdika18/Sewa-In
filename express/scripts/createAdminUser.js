#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * Usage:
 *   node scripts/createAdminUser.js
 *   
 * With custom credentials:
 *   ADMIN_EMAIL=admin@example.com \
 *   ADMIN_PASSWORD=SecurePass@123 \
 *   ADMIN_NAME="Administrator" \
 *   node scripts/createAdminUser.js
 */

const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sewa-in.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@Sewa123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

async function createAdmin() {
  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (existing) {
      console.log('❌ Admin already exists with email:', ADMIN_EMAIL);
      console.log('   Role:', existing.role);
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: passwordHash,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   • Change password immediately on first login');
    console.log('   • Do NOT share default credentials');
    console.log('   • Use strong password (min 8 chars with upper, lower, number, special char)');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
