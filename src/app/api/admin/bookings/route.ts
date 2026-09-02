import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/bookings — All bookings with revenue analysis
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (paymentStatus && paymentStatus !== "ALL") where.paymentStatus = paymentStatus;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          advocate: { select: { id: true, name: true, specialization: true } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    // Revenue stats
    const [totalRevenue, pendingRevenue] = await Promise.all([
      prisma.booking.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { consultationFee: true },
        _count: true,
        _avg: { consultationFee: true },
      }),
      prisma.booking.aggregate({
        where: { paymentStatus: "PENDING" },
        _sum: { consultationFee: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      revenueStats: {
        totalRevenue: totalRevenue._sum.consultationFee || 0,
        paidCount: totalRevenue._count,
        avgFee: totalRevenue._avg.consultationFee || 0,
        pendingRevenue: pendingRevenue._sum.consultationFee || 0,
        pendingCount: pendingRevenue._count,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch bookings", details: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/bookings — Update booking status, process refund
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { bookingId, action } = await req.json();
    if (!bookingId || !action) {
      return NextResponse.json({ error: "bookingId and action required" }, { status: 400 });
    }

    let data: any = {};
    switch (action) {
      case "CANCEL":
        data = { status: "CANCELLED", cancelledBy: "ADMIN", cancelledAt: new Date() };
        break;
      case "MARK_PAID":
        data = { paymentStatus: "PAID" };
        break;
      case "MARK_REFUNDED":
        data = { paymentStatus: "REFUNDED" };
        break;
      case "CONFIRM":
        data = { status: "CONFIRMED" };
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await prisma.booking.update({ where: { id: bookingId }, data });

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action,
        targetType: "BOOKING",
        targetId: bookingId,
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update booking", details: error.message }, { status: 500 });
  }
}
