const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const duplicate = await prisma.user.findUnique({
    where: { email: 'arshu@lexnova.in' },
  });

  if (duplicate) {
    // Delete any dependent records if any exist
    await prisma.adminLog.deleteMany({ where: { adminId: duplicate.id } }).catch(() => null);
    await prisma.user.delete({ where: { id: duplicate.id } });
    console.log('✅ Successfully removed duplicate super admin: arshu@lexnova.in');
  } else {
    console.log('ℹ️ arshu@lexnova.in does not exist in database.');
  }

  // Ensure arshusingh26@gmail.com is configured as SUPER_ADMIN
  const primaryAdmin = await prisma.user.findUnique({
    where: { email: 'arshusingh26@gmail.com' },
  });

  if (primaryAdmin) {
    await prisma.user.update({
      where: { email: 'arshusingh26@gmail.com' },
      data: {
        role: 'SUPER_ADMIN',
        plan: 'ENTERPRISE',
        isActive: true,
        isBanned: false,
      },
    });
    console.log('✅ Primary super admin verified: arshusingh26@gmail.com (Role: SUPER_ADMIN)');
  }

  const remainingUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, plan: true },
  });
  console.log('\n📋 Current Users in Database:');
  console.table(remainingUsers);
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
