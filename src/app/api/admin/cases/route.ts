import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit-logger";

// GET /api/admin/cases — Global case index with full details
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const where: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }

    const cases = await prisma.matter.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, city: true } },
        advocate: { select: { id: true, name: true, specialization: true, city: true } },
        _count: {
          select: {
            documents: true,
            hearings: true,
            settlements: true,
            messages: true,
          },
        },
      },
    });

    return NextResponse.json(cases);
  } catch (error: any) {
    console.error("[Admin Cases GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

// PATCH /api/admin/cases — Update matter status or assign advocate
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const adminUserId = (session.user as any).id;
    const body = await req.json();
    const { caseId, status, advocateId, priority } = body;

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (advocateId !== undefined) updateData.advocateId = advocateId || null;

    const updated = await prisma.matter.update({
      where: { id: caseId },
      data: updateData,
    });

    await logAuditEvent({
      action: "ADMIN_OVERRIDE",
      userId: adminUserId,
      resourceId: caseId,
      resourceType: "Matter",
      metadata: { action: "CASE_UPDATED", status, advocateId, priority },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[Admin Cases PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }
}
