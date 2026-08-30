import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { parseBody, forgotPasswordSchema, resetPasswordSchema, ValidationError } from "@/lib/validators";
import { sendPasswordResetEmail } from "@/lib/email";

// ── POST /api/auth/forgot-password → send reset link ──────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = parseBody(forgotPasswordSchema, body);

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.isActive) {
      // Delete any existing reset tokens
      await prisma.verificationToken.deleteMany({
        where: { userId: user.id, type: "PASSWORD_RESET" },
      });

      const token = crypto.randomBytes(32).toString("hex");
      await prisma.verificationToken.create({
        data: {
          userId:    user.id,
          token,
          type:      "PASSWORD_RESET",
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      sendPasswordResetEmail({
        name:  user.name || "User",
        email: user.email,
        token,
      }).catch((e) => console.error("[ForgotPassword] Email error:", e));
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, you will receive a password reset link shortly.",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}

// ── PUT /api/auth/forgot-password → reset password ────────
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = parseBody(resetPasswordSchema, body);

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.type !== "PASSWORD_RESET" || record.usedAt) {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 410 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data:  {
          passwordHash,
          loginAttempts: 0,
          lockedUntil:   null,
        },
      }),
      prisma.verificationToken.update({
        where: { token },
        data:  { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as ValidationError).messages },
        { status: 400 }
      );
    }
    console.error("[ResetPassword] Error:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
