import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/advocates — List all advocates with stats
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");
    const verified = searchParams.get("verified");
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

    const where: any = {};
    if (verified === "true") where.verified = true;
    if (verified === "false") where.verified = false;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { specialization: { contains: search, mode: "insensitive" } },
        { barNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [advocates, total] = await Promise.all([
      prisma.advocate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, email: true, isActive: true, isBanned: true, plan: true } },
          _count: { select: { bookings: true, matters: true } },
        },
      }),
      prisma.advocate.count({ where }),
    ]);

    return NextResponse.json({ advocates, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch advocates", details: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/advocates — Verify, suspend, or update an advocate
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { advocateId, action, value } = await req.json();
    if (!advocateId || !action) {
      return NextResponse.json({ error: "advocateId and action required" }, { status: 400 });
    }

    let data: any = {};
    switch (action) {
      case "VERIFY":
        data = { verified: true };
        break;
      case "UNVERIFY":
        data = { verified: false };
        break;
      case "SET_AVAILABLE":
        data = { isAvailable: value };
        break;
      case "SET_FEE":
        data = { consultationFee: parseFloat(value) };
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await prisma.advocate.update({ where: { id: advocateId }, data });

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action,
        targetType: "LAWYER",
        targetId: advocateId,
        details: JSON.stringify({ value }),
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, advocate: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update advocate", details: error.message }, { status: 500 });
  }
}
