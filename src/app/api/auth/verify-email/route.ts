import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Verification token is required." },
      { status: 400 }
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.type !== "EMAIL_VERIFY") {
    return NextResponse.json(
      { error: "Invalid or expired verification link." },
      { status: 400 }
    );
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json(
      { error: "Verification link has expired. Please request a new one." },
      { status: 410 }
    );
  }

  if (record.usedAt) {
    return NextResponse.json(
      { error: "This link has already been used." },
      { status: 409 }
    );
  }

  // Mark email as verified
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data:  { emailVerified: new Date() },
    }),
    prisma.verificationToken.update({
      where: { token },
      data:  { usedAt: new Date() },
    }),
  ]);

  // Redirect to login with success flag
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(
    `${baseUrl}/auth/login?verified=1`,
    { status: 302 }
  );
}
