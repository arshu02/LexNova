/**
 * Admin seed script — creates SUPER_ADMIN user "Arshu Singh"
 * Run: node prisma/seed-admin.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log("🌱 Seeding admin user...");

  const passwordHash = await bcrypt.hash("Admin@LexNova2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "arshusingh26@gmail.com" },
    update: {
      role: "SUPER_ADMIN",
      plan: "ENTERPRISE",
      name: "Arshu Singh",
      passwordHash,
      isActive: true,
      isBanned: false,
      loginAttempts: 0,
      lockedUntil: null,
      emailVerified: new Date(),
    },
    create: {
      email: "arshusingh26@gmail.com",
      name: "Arshu Singh",
      passwordHash,
      role: "SUPER_ADMIN",
      plan: "ENTERPRISE",
      isActive: true,
      isBanned: false,
      emailVerified: new Date(),
      createdByAdmin: true,
    },
  });

  // Seed default AppSettings
  const defaultSettings = [
    { key: "ai.maxFreeQuestions", value: "5" },
    { key: "ai.maxFreeDocuments", value: "2" },
    { key: "ai.model", value: "claude-3-5-sonnet-20241022" },
    { key: "ai.maxTokens", value: "4096" },
    { key: "email.fromEmail", value: "noreply@lexnova.in" },
    { key: "email.supportEmail", value: "support@lexnova.in" },
    { key: "email.bookingConfirmations", value: "true" },
    { key: "email.weeklyDigest", value: "false" },
    { key: "payment.proPlanPriceINR", value: "499" },
    { key: "payment.businessPlanPriceINR", value: "4999" },
    { key: "payment.lawyerCommissionPct", value: "10" },
    { key: "feature.documentGeneration", value: "true" },
    { key: "feature.lawyerMarketplace", value: "true" },
    { key: "feature.hindiLanguage", value: "false" },
    { key: "feature.voiceInput", value: "false" },
    { key: "maintenance.enabled", value: "false" },
    { key: "maintenance.message", value: "We are currently performing maintenance. Please try again shortly." },
  ];

  for (const setting of defaultSettings) {
    await prisma.appSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("\n✅ Admin user created/updated:");
  console.log("   Email:     arshusingh26@gmail.com");
  console.log("   Password:  Admin@LexNova2026");
  console.log("   Role:      SUPER_ADMIN");
  console.log("   Plan:      ENTERPRISE");
  console.log("\n✅ Default AppSettings seeded.");
  console.log("\n🚀 Login at: /auth/login");
  console.log("📊 Admin dashboard: /admin");
}

seedAdmin()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
