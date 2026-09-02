import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit-logger";

// GET /api/admin/organizations — List all enterprise firm workspaces
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const orgs = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        members: {
          select: { id: true, name: true, email: true, role: true, isActive: true },
        },
        cases: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    return NextResponse.json(orgs);
  } catch (error: any) {
    console.error("[Admin Organizations GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

// POST /api/admin/organizations — Provision new Enterprise Law Firm workspace
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const adminUserId = (session.user as any).id;
    const body = await req.json();
    const { name, plan = "ENTERPRISE" } = body;

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        plan,
        isActive: true,
      },
    });

    await logAuditEvent({
      action: "ADMIN_OVERRIDE",
      userId: adminUserId,
      resourceId: org.id,
      resourceType: "Organization",
      metadata: { action: "ORGANIZATION_CREATED", name: org.name, plan: org.plan },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (error: any) {
    console.error("[Admin Organizations POST Error]:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}
