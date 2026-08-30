const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const advocates = [
  {
    name: 'Advocate Priya Mehta',
    type: 'Property & Tenancy Lawyer',
    specialization: 'PROPERTY_DISPUTE',
    email: 'priya.mehta@lexnova.in',
    experience: 9,
    rating: 4.8,
    qualification: 'LLB, Delhi University | High Court Enrolled',
    consultationFee: 999,
    language: 'Hindi, English',
    availability: 'Available Today',
    location: 'Bengaluru',
    isAvailable: true,
  },
  {
    name: 'Advocate Rajesh Sharma',
    type: 'Employment & Labour Lawyer',
    specialization: 'LABOUR_DISPUTE',
    email: 'rajesh.sharma@lexnova.in',
    experience: 12,
    rating: 4.9,
    qualification: 'LLB, NLU Mumbai | Supreme Court Enrolled',
    consultationFee: 1499,
    language: 'Hindi, English, Marathi',
    availability: 'Available Tomorrow',
    location: 'Mumbai',
    isAvailable: true,
  },
  {
    name: 'Advocate Ananya Iyer',
    type: 'Consumer Protection Lawyer',
    specialization: 'CONSUMER_GRIEVANCE',
    email: 'ananya.iyer@lexnova.in',
    experience: 6,
    rating: 4.7,
    qualification: 'LLB, NALSAR | Consumer Forum Specialist',
    consultationFee: 799,
    language: 'English, Tamil, Kannada',
    availability: 'Available Today',
    location: 'Chennai',
    isAvailable: true,
  },
  {
    name: 'Advocate Sanjay Gupta',
    type: 'Criminal & Cyber Lawyer',
    specialization: 'CRIMINAL_CYBER',
    email: 'sanjay.gupta@lexnova.in',
    experience: 15,
    rating: 4.9,
    qualification: 'LLB, BHU | Sessions Court Specialist',
    consultationFee: 1999,
    language: 'Hindi, English',
    availability: 'Next Slot: 3 PM',
    location: 'Delhi',
    isAvailable: true,
  },
  {
    name: 'Advocate Meera Krishnan',
    type: 'Family & Divorce Lawyer',
    specialization: 'FAMILY_DIVORCE',
    email: 'meera.krishnan@lexnova.in',
    experience: 8,
    rating: 4.8,
    qualification: 'LLB, Kerala University | Family Court Specialist',
    consultationFee: 1299,
    language: 'English, Malayalam, Tamil',
    availability: 'Available Today',
    location: 'Bengaluru',
    isAvailable: true,
  },
  {
    name: 'Advocate Vikram Singh',
    type: 'Corporate & Contract Lawyer',
    specialization: 'CORPORATE_CONTRACT',
    email: 'vikram.singh@lexnova.in',
    experience: 11,
    rating: 4.7,
    qualification: 'LLB + MBA, Symbiosis | Corporate Specialist',
    consultationFee: 2499,
    language: 'Hindi, English',
    availability: 'Available Tomorrow',
    location: 'Mumbai',
    isAvailable: true,
  },
];

async function main() {
  console.log("🧹 Clearing existing data...");

  // Delete in order respecting FK constraints
  await prisma.caseNotification.deleteMany({});
  await prisma.settlement.deleteMany({});
  await prisma.judgment.deleteMany({});
  await prisma.limitationPeriod.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.courtDocument.deleteMany({});
  await prisma.hearing.deleteMany({});
  await prisma.caseParty.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.matter.deleteMany({});
  await prisma.advocate.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Seeding users and advocates...");

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  // ─── Admin User ─────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: "admin@legalnavigator.in",
      name: "Platform Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      city: "New Delhi",
    },
  });
  console.log("  ✅ Admin user created (admin@legalnavigator.in / admin123)");

  // ─── AI Assistant System User ────────────────────────────
  await prisma.user.create({
    data: {
      id: "ai_assistant",
      email: "ai_assistant@legalnavigator.in",
      name: "AI Assistant",
      passwordHash: passwordHash,
      role: "ADMIN",
      city: "System",
    },
  });
  console.log("  ✅ AI Assistant system user created (id: ai_assistant)");

  // ─── Test Citizen User ──────────────────────────────────
  const citizenUser = await prisma.user.create({
    data: {
      email: "citizen@example.com",
      name: "Raj Patel",
      passwordHash: passwordHash,
      role: "USER",
      city: "Mumbai",
    },
  });
  console.log("  ✅ Citizen user created (citizen@example.com / password123)");

  // ─── Advocates with Real Emails ──────────────────────────
  for (const adv of advocates) {
    const user = await prisma.user.create({
      data: {
        email: adv.email,
        name: adv.name,
        passwordHash: passwordHash,
        role: "ADVOCATE",
        city: adv.location,
      },
    });

    await prisma.advocate.create({
      data: {
        userId: user.id,
        name: adv.name,
        specialization: adv.specialization,
        email: adv.email,
        experienceYears: adv.experience,
        city: adv.location,
        pricing: `₹${adv.consultationFee}/session`,
        consultationFee: adv.consultationFee,
        languages: adv.language,
        availability: adv.availability,
        rating: adv.rating,
        verified: true,
        isAvailable: adv.isAvailable,
      },
    });

    console.log(`  ✅ Advocate: ${adv.name} (${adv.email}) - ₹${adv.consultationFee}`);
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:    admin@legalnavigator.in / admin123");
  console.log("  Citizen:  citizen@example.com / password123");
  console.log("  Advocate: priya.mehta@lexnova.in / password123 (any advocate)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
