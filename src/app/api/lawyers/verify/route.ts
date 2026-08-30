import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Admin-only: verify or unverify an advocate
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { advocateId, verified } = await req.json();

    if (!advocateId) {
      return NextResponse.json({ error: "Missing advocateId" }, { status: 400 });
    }

    const updated = await prisma.advocate.update({
      where: { id: advocateId },
      data: { verified: Boolean(verified) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Verification toggle error:", error);
    return NextResponse.json({ error: "Failed to update advocate verification" }, { status: 500 });
  }
}

// Admin-only: fetch diagnostic data (advocates, users, matters, bookings)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const advocates = await prisma.advocate.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    });
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, city: true, createdAt: true },
    });
    const matters = await prisma.matter.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ advocates, users, matters, bookings });
  } catch (error) {
    console.error("Admin diagnostic data error:", error);
    return NextResponse.json({ error: "Failed to fetch admin diagnostic data" }, { status: 500 });
  }
}
