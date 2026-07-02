// Database connection test script
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    datasourceUrl: 'file:./dev.db'
  });

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    // Check if users table exists and has data
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('✅ No users in database (clean state)');
    } else {
      console.log(`ℹ️ Found ${userCount} users in database`);
    }

    // Check schema by trying to query a model
    try {
      const user = await prisma.user.findFirst();
      if (user) {
        console.log('✅ User model is accessible');
      } else {
        console.log('ℹ️ No users found, but model exists');
      }
    } catch (e) {
      console.log(`⚠️ Schema check: ${e.message}`);
    }

    // Disconnect and report success
    await prisma.$disconnect();
    console.log('\n🎉 Database test completed successfully!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

main();