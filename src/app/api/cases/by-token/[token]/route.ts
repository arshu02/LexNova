import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const matter = await prisma.matter.findFirst({
      where: { caseInviteToken: token },
      select: {
        // ── ONLY public/non-sensitive fields ──────────────────────────────
        caseType: true,
        filingDate: true,
        courtName: true,
        status: true,
        category: true,
        jurisdiction: true,
        // !! Do NOT include userId, user details, or plaintiff-identifying info
      },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Invalid or expired invite token" },
        { status: 404 }
      );
    }

    return NextResponse.json(matter);
  } catch (error) {
    console.error("Error fetching case by token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
