import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
    }

    const demoPassword = "supabase_oauth_user_pass_123";
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || "Gmail User",
        passwordHash: passwordHash,
      },
      create: {
        name: name || "Gmail User",
        email,
        passwordHash: passwordHash,
        role: "USER",
      },
    });

    return NextResponse.json({
      success: true,
      email: user.email,
      password: demoPassword,
      user,
    });
  } catch (error: any) {
    console.error("Supabase sync error:", error);
    return NextResponse.json({ error: "Failed to sync Supabase user" }, { status: 500 });
  }
}
