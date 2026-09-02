const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'arshusingh26@gmail.com';
  const name = 'Arshu Singh';
  const defaultPassword = 'AdminPassword123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  let user;
  if (existing) {
    user = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        emailVerified: existing.emailVerified || new Date(),
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        ...(existing.passwordHash ? {} : { passwordHash }),
      },
    });
    console.log('✅ Updated existing user to ADMIN role:', user.email, 'Role:', user.role);
  } else {
    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
        isActive: true,
      },
    });
    console.log('✅ Created new ADMIN user:', user.email, 'Role:', user.role);
    console.log('Default credentials if logging in via email/password:');
    console.log('Email:', email);
    console.log('Password:', defaultPassword);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
