import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { parseBody, signupSchema, ValidationError } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0].trim() ?? "unknown";
    const rl = await rateLimit(`signup:${ip}`, 5, 60);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const data = parseBody(signupSchema, body);

    // Check for existing user
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const isRootAdmin = ["arshusingh26@gmail.com", "arshu@lexnova.in"].includes(data.email.toLowerCase().trim());
    // Force safe roles (never allow ADMIN on public signup unless root admin email)
    const assignedRole = isRootAdmin
      ? "SUPER_ADMIN"
      : data.role === "ADVOCATE"
      ? "ADVOCATE"
      : "USER";

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name:         data.name,
        email:        data.email.toLowerCase().trim(),
        passwordHash,
        role:         assignedRole,
        ...(isRootAdmin ? { emailVerified: new Date(), isActive: true } : {}),
      },
    });

    // Create email verification token (24hr expiry)
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        userId:    user.id,
        token,
        type:      "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send welcome + verification email (non-blocking)
    sendWelcomeEmail({
      name:             data.name,
      email:            data.email,
      verificationToken: token,
    }).catch((e) => console.error("[Signup] Email send error:", e));

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("[Signup] Error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
