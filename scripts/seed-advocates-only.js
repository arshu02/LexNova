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
  const passwordHash = await bcrypt.hash("password123", 10);

  for (const adv of advocates) {
    let user = await prisma.user.findUnique({ where: { email: adv.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: adv.email,
          name: adv.name,
          passwordHash,
          role: "ADVOCATE",
          city: adv.location,
        },
      });
    }

    const existingAdv = await prisma.advocate.findFirst({ where: { email: adv.email } });
    if (!existingAdv) {
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
      console.log(`✅ Seeded advocate: ${adv.name}`);
    } else {
      console.log(`ℹ️ Advocate already exists: ${adv.name}`);
    }
  }
}

main().then(() => prisma.$disconnect());
