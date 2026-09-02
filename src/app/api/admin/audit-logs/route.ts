import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/audit-logs — Fetch ISO 27001 / SOC 2 security logs
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);
    const targetType = searchParams.get("targetType");
    const adminId = searchParams.get("adminId");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = {};
    if (targetType) where.targetType = targetType;
    if (adminId) where.adminId = adminId;

    // Pull from the new AdminLog table
    const [adminLogs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }).catch(() => []),
      prisma.adminLog.count({ where }).catch(() => 0),
    ]);

    // Also pull old-style audit logs from CaseNotification table for backward compat
    const legacyLogs = await prisma.caseNotification.findMany({
      where: { channel: "AUDIT_LOG" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }).catch(() => []);

    return NextResponse.json({
      logs: adminLogs,
      legacyLogs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("[Admin Audit Logs Error]:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
