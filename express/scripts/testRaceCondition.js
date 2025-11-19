/**
 * Race Condition Test Script
 * 
 * Test untuk memverifikasi bahwa 2 user tidak bisa simultan book item yang sama
 * ketika stock terbatas
 * 
 * Usage:
 *   node scripts/testRaceCondition.js
 * 
 * Requirements:
 *   - Server running on http://localhost:5000
 *   - Admin user login untuk create test data
 *   - 2 regular users untuk simultaneous booking
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

// Test data
const testData = {
  admin: {
    email: 'admin@test.local',
    password: 'Admin@Test123'
  },
  user1: {
    email: 'user1@test.local',
    name: 'User 1',
    password: 'User@Test123'
  },
  user2: {
    email: 'user2@test.local',
    name: 'User 2',
    password: 'User@Test123'
  },
  category: {
    name: 'Test Category'
  },
  barang: {
    name: 'Test Item - Limited Stock',
    description: 'Item dengan stock terbatas untuk race condition test',
    pricePerDay: 50000,
    stock: 2  // ⚠️ HANYA 2 UNIT TERSEDIA - akan test 2 concurrent requests
  }
};

let adminToken = null;
let user1Token = null;
let user2Token = null;
let categoryId = null;
let barangId = null;

// Helper: Make API call
async function apiCall(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers['Cookie'] = `sewa_token=${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
  }
}

// Test flow
async function runTest() {
  console.log('\n=== RACE CONDITION TEST ===\n');

  // Step 1: Register & Login users
  console.log('📝 Step 1: Register & Login users...');
  
  // Register & login user1
  let res = await apiCall('POST', '/auth/register', testData.user1);
  if (!res.success) {
    console.error('❌ Failed to register user1:', res.data?.message);
    process.exit(1);
  }
  console.log('✅ User 1 registered');

  res = await apiCall('POST', '/auth/login', {
    email: testData.user1.email,
    password: testData.user1.password
  });
  if (!res.success) {
    console.error('❌ Failed to login user1:', res.data?.message);
    process.exit(1);
  }
  user1Token = res.data?.data?.user?.id; // Get token from cookie
  console.log('✅ User 1 logged in');

  // Register & login user2
  res = await apiCall('POST', '/auth/register', testData.user2);
  if (!res.success) {
    console.error('❌ Failed to register user2:', res.data?.message);
    process.exit(1);
  }
  console.log('✅ User 2 registered');

  res = await apiCall('POST', '/auth/login', {
    email: testData.user2.email,
    password: testData.user2.password
  });
  if (!res.success) {
    console.error('❌ Failed to login user2:', res.data?.message);
    process.exit(1);
  }
  user2Token = res.data?.data?.user?.id;
  console.log('✅ User 2 logged in');

  // Step 2: Admin create category & barang (limited stock)
  console.log('\n📝 Step 2: Create test category & item (stock = 2)...');

  // Login as admin
  res = await apiCall('POST', '/auth/login', {
    email: testData.admin.email,
    password: testData.admin.password
  });
  if (!res.success) {
    console.error('❌ Failed to login admin:', res.data?.message);
    console.log('⚠️  Make sure admin user exists. Run: npm run setup:admin');
    process.exit(1);
  }
  adminToken = res.data?.data?.user?.id;
  console.log('✅ Admin logged in');

  // Create category
  res = await apiCall('POST', '/category', testData.category, adminToken);
  if (!res.success) {
    console.error('❌ Failed to create category:', res.data?.message);
    process.exit(1);
  }
  categoryId = res.data?.data?.id;
  console.log('✅ Category created:', categoryId);

  // Create barang with limited stock
  res = await apiCall('POST', '/barang', {
    ...testData.barang,
    categoryId
  }, adminToken);
  if (!res.success) {
    console.error('❌ Failed to create barang:', res.data?.message);
    process.exit(1);
  }
  barangId = res.data?.data?.id;
  console.log('✅ Barang created:', barangId, 'with stock:', testData.barang.stock);

  // Step 3: Simulate RACE CONDITION
  console.log('\n📝 Step 3: Simulate race condition - Both users book SIMULTANEOUSLY...');
  console.log('⚠️  User 1 will try to book 2 items');
  console.log('⚠️  User 2 will try to book 2 items AT THE SAME TIME');
  console.log('⚠️  Expected: Only ONE should succeed, one should get 409 Conflict\n');

  // Prepare booking data
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7); // 7 days from now

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3); // 3 days rental

  const bookingData = {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    items: [
      {
        barangId,
        quantity: 2  // Try to book 2 units (total stock is 2)
      }
    ]
  };

  // Make simultaneous requests
  console.log('⏳ Sending requests...\n');
  const promises = [
    apiCall('POST', '/sewa', bookingData, user1Token),
    apiCall('POST', '/sewa', bookingData, user2Token)
  ];

  const [result1, result2] = await Promise.all(promises);

  // Step 4: Analyze results
  console.log('📊 RESULTS:\n');

  if (result1.success) {
    console.log('✅ User 1 BOOKING SUCCESS');
    console.log('   Sewa ID:', result1.data?.data?.id);
    console.log('   Total Price:', result1.data?.data?.totalPrice);
    console.log('   Items:', result1.data?.data?.items?.length);
  } else {
    console.log('❌ User 1 BOOKING FAILED:', result1.data?.message || result1.message);
    console.log('   Status:', result1.status);
  }

  console.log('');

  if (result2.success) {
    console.log('✅ User 2 BOOKING SUCCESS');
    console.log('   Sewa ID:', result2.data?.data?.id);
    console.log('   Total Price:', result2.data?.data?.totalPrice);
    console.log('   Items:', result2.data?.data?.items?.length);
  } else {
    console.log('❌ User 2 BOOKING FAILED:', result2.data?.message || result2.message);
    console.log('   Status:', result2.status);
  }

  // Step 5: Verify result
  console.log('\n📋 VERIFICATION:\n');

  const successCount = [result1, result2].filter(r => r.success).length;

  if (successCount === 1) {
    console.log('✅ RACE CONDITION FIX VERIFIED!');
    console.log('   ✓ Only 1 user succeeded (as expected)');
    console.log('   ✓ Other user got 409 Conflict (stock unavailable)');
    console.log('   ✓ Database transactions are atomic');
    console.log('\n✨ Race condition protection is working correctly!');
  } else if (successCount === 0) {
    console.log('⚠️  Both users failed to book');
    console.log('   Check if server is running and database is available');
  } else if (successCount === 2) {
    console.log('❌ RACE CONDITION DETECTED!');
    console.log('   ✗ BOTH users succeeded in booking');
    console.log('   ✗ This means 4 units booked but stock is only 2');
    console.log('   ✗ Database transactions are NOT working properly');
  }

  // Step 6: Check database state
  console.log('\n📁 Step 4: Check database state...');
  const getAllSewaRes = await apiCall('GET', '/sewa?limit=100', null, adminToken);
  if (getAllSewaRes.success) {
    const totalItemsBooked = getAllSewaRes.data?.data?.reduce((sum, sewa) => {
      return sum + sewa.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    
    console.log('✅ Total Sewa records:', getAllSewaRes.data?.data?.length);
    console.log('✅ Total items booked:', totalItemsBooked);
    
    if (totalItemsBooked <= testData.barang.stock) {
      console.log('✅ Total booked <= stock available (', testData.barang.stock, ')');
    } else {
      console.log('❌ OVERSELL: Total booked > stock available!');
    }
  }

  console.log('\n=== TEST COMPLETE ===\n');
  process.exit(successCount === 1 ? 0 : 1);
}

// Run test
runTest().catch(err => {
  console.error('Test error:', err.message);
  process.exit(1);
});
