import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json().catch(() => ({}));
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : body.token;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing Supabase access token." },
        { status: 401 }
      );
    }

    // Cryptographically verify the Supabase JWT token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired Supabase session." },
        { status: 401 }
      );
    }

    const verifiedEmail = authData.user.email.toLowerCase().trim();
    const verifiedName =
      authData.user.user_metadata?.full_name ||
      authData.user.user_metadata?.name ||
      body.name ||
      verifiedEmail.split("@")[0];

    // Generate a secure, one-time random password for this OAuth session
    const ephemeralPassword = `ln_oauth_${crypto.randomBytes(24).toString("hex")}!9A`;
    const passwordHash = await bcrypt.hash(ephemeralPassword, 12);

    const existingUser = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name || verifiedName,
          passwordHash: passwordHash,
          emailVerified: existingUser.emailVerified || new Date(),
          isActive: true,
          lockedUntil: null,
          loginAttempts: 0,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: verifiedName,
          email: verifiedEmail,
          passwordHash: passwordHash,
          role: "USER",
          emailVerified: new Date(),
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      password: ephemeralPassword,
    });
  } catch (error: any) {
    console.error("[SupabaseSync Error]:", error);
    return NextResponse.json(
      { error: "Failed to synchronize authenticated user" },
      { status: 500 }
    );
  }
}
