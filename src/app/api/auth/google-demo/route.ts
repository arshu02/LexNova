import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const demoEmail = "google.user@lexnova.com";
    const demoPassword = "google_demo_pass_123";
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: demoEmail },
      update: {
        passwordHash: passwordHash,
        name: "Google User",
      },
      create: {
        name: "Google User",
        email: demoEmail,
        passwordHash: passwordHash,
        role: "USER",
        city: "New Delhi",
      },
    });

    return NextResponse.json({
      success: true,
      email: demoEmail,
      password: demoPassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Google demo auth error:", error);
    return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 });
  }
}
