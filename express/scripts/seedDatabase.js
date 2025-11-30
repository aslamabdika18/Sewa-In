const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await prisma.barang.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('✅ Data cleared');

    // Create categories
    console.log('📝 Creating categories...');
    const categories = await prisma.category.createMany({
      data: [
        { name: 'Camping', description: 'Perlengkapan camping dan berkemah' },
        { name: 'Hiking & Trekking', description: 'Peralatan hiking dan pendakian gunung' },
        { name: 'Outdoor Gear', description: 'Perlengkapan outdoor umum' },
        { name: 'Water Sports', description: 'Peralatan olahraga air' },
      ],
    });
    console.log(`✅ Created ${categories.count} categories`);

    // Get created categories
    const campingCat = await prisma.category.findFirst({ where: { name: 'Camping' } });
    const hikingCat = await prisma.category.findFirst({ where: { name: 'Hiking & Trekking' } });
    const outdoorCat = await prisma.category.findFirst({ where: { name: 'Outdoor Gear' } });
    const waterCat = await prisma.category.findFirst({ where: { name: 'Water Sports' } });

    // Create barang items
    console.log('🎒 Creating barang items...');
    const barangData = [
      {
        name: 'Tenda Camping 2 Person',
        description: 'Tenda berkapasitas 2 orang dengan waterproof coating. Mudah dipasang dan ringan untuk dibawa.',
        category: { connect: { id: campingCat.id } },
        pricePerDay: 50000,
        stock: 8,
        image: 'https://via.placeholder.com/400x300?text=Tenda+Camping',
      },
      {
        name: 'Sleeping Bag Thermal',
        description: 'Sleeping bag dengan material thermal untuk cuaca dingin. Cocok untuk camping musim dingin.',
        category: { connect: { id: campingCat.id } },
        pricePerDay: 35000,
        stock: 12,
        image: 'https://via.placeholder.com/400x300?text=Sleeping+Bag',
      },
      {
        name: 'Backpack 60L',
        description: 'Backpack besar kapasitas 60 liter dengan rangka yang nyaman untuk perjalanan panjang.',
        category: { connect: { id: hikingCat.id } },
        pricePerDay: 40000,
        stock: 6,
        image: 'https://via.placeholder.com/400x300?text=Backpack+60L',
      },
      {
        name: 'Hiking Boots Professional',
        description: 'Sepatu hiking dengan grip yang baik dan ankle support untuk medan berat.',
        category: { connect: { id: hikingCat.id } },
        pricePerDay: 25000,
        stock: 10,
        image: 'https://via.placeholder.com/400x300?text=Hiking+Boots',
      },
      {
        name: 'Kompas & Map Digital',
        description: 'Kompas analog dan GPS digital untuk navigasi outdoor yang akurat.',
        category: { connect: { id: outdoorCat.id } },
        pricePerDay: 20000,
        stock: 15,
        image: 'https://via.placeholder.com/400x300?text=Kompas+Digital',
      },
      {
        name: 'Headlamp LED',
        description: 'Lampu kepala LED dengan brightness tinggi dan baterai tahan lama untuk aktivitas malam.',
        category: { connect: { id: outdoorCat.id } },
        pricePerDay: 15000,
        stock: 20,
        image: 'https://via.placeholder.com/400x300?text=Headlamp+LED',
      },
      {
        name: 'Kayak Single Seat',
        description: 'Kayak satu orang dengan material tahan lama, cocok untuk pemula hingga menengah.',
        category: { connect: { id: waterCat.id } },
        pricePerDay: 75000,
        stock: 4,
        image: 'https://via.placeholder.com/400x300?text=Kayak+Single',
      },
      {
        name: 'Snorkel Gear Set',
        description: 'Set lengkap snorkel dengan masker, snorkel, dan fins untuk snorkeling di laut.',
        category: { connect: { id: waterCat.id } },
        pricePerDay: 45000,
        stock: 9,
        image: 'https://via.placeholder.com/400x300?text=Snorkel+Gear',
      },
      {
        name: 'Camping Stove Portable',
        description: 'Kompor portable untuk camping dengan bahan bakar cair, ringan dan efisien.',
        category: { connect: { id: campingCat.id } },
        pricePerDay: 30000,
        stock: 14,
        image: 'https://via.placeholder.com/400x300?text=Camping+Stove',
      },
      {
        name: 'Rope & Carabiner Set',
        description: 'Tali climbing dan carabiner profesional untuk keamanan aktivitas outdoor ekstrem.',
        category: { connect: { id: hikingCat.id } },
        pricePerDay: 55000,
        stock: 7,
        image: 'https://via.placeholder.com/400x300?text=Rope+Set',
      },
    ];

    const barang = await prisma.barang.createMany({
      data: barangData,
    });
    console.log(`✅ Created ${barang.count} barang items`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`📊 Total categories: 4`);
    console.log(`📦 Total barang items: 10`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
