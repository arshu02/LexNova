import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAuditEvent } from "@/lib/audit-logger";

// GET /api/admin/profile — Get authenticated admin profile & security telemetry
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const adminId = (session.user as any).id;
    const adminEmail = session.user.email;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(adminId ? [{ id: adminId }] : []),
          ...(adminEmail ? [{ email: adminEmail }] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      admin: user,
      security: {
        twoFactorStatus: "Hardware Key / Authenticator Recommended",
        sessionStrategy: "JWT (Encrypted, 30-day rolling)",
        roleScope: "Full Institutional Clearance (ADMIN)",
        rateLimiterStatus: "Active",
      },
    });
  } catch (error: any) {
    console.error("[Admin Profile GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch admin profile" }, { status: 500 });
  }
}

// PUT /api/admin/profile — Update admin name, phone, city, or password
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const adminId = (session.user as any).id;
    const body = await req.json();
    const { name, city, phone, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!user) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (phone !== undefined) updateData.phone = phone;

    // Handle password update if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      if (user.passwordHash) {
        const matches = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!matches) {
          return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 400 }
          );
        }
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        phone: true,
      },
    });

    await logAuditEvent({
      action: "ADMIN_PROFILE_UPDATED",
      userId: adminId,
      resourceId: adminId,
      resourceType: "User",
      metadata: { updatedFields: Object.keys(updateData) },
    });

    return NextResponse.json({
      success: true,
      admin: updated,
    });
  } catch (error: any) {
    console.error("[Admin Profile PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update admin profile" }, { status: 500 });
  }
}
