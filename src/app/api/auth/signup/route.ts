import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, city, specialization, experience, fees } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Validate role
    if (!["USER", "ADVOCATE"].includes(role)) {
      return NextResponse.json({ message: "Invalid role. Must be USER or ADVOCATE." }, { status: 400 });
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        city: city || null,
      },
    });

    // If ADVOCATE, create Advocate profile with verified=false
    if (role === "ADVOCATE") {
      if (!specialization || !city) {
        // Cleanup the user we just created if advocate fields are missing
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { message: "Advocates must provide specialization and city." },
          { status: 400 }
        );
      }

      await prisma.advocate.create({
        data: {
          userId: user.id,
          name,
          specialization,
          city,
          experienceYears: parseInt(experience) || 0,
          pricing: fees ? `₹${fees}/session` : "Contact for pricing",
          verified: false, // Admin must approve before they appear in search
        },
      });
    }

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup", error: error.message },
      { status: 500 }
    );
  }
}
