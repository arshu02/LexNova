import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { parseBody, signupSchema, ValidationError } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
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

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name:         data.name,
        email:        data.email,
        passwordHash,
        role:         data.role,
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
