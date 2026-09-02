import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/users — List all users with filters, search, pagination
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role");
    const searchQuery = searchParams.get("q");
    const planFilter = searchParams.get("plan");
    const statusFilter = searchParams.get("status"); // "active" | "banned" | "locked"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const sortBy = searchParams.get("sort") || "createdAt";
    const sortDir = searchParams.get("dir") === "asc" ? "asc" : "desc";

    const where: any = {};
    if (roleFilter && roleFilter !== "ALL") {
      where.role = roleFilter;
    }
    if (planFilter && planFilter !== "ALL") {
      where.plan = planFilter;
    }
    if (statusFilter === "active") {
      where.isActive = true;
      where.isBanned = false;
    } else if (statusFilter === "banned") {
      where.isBanned = true;
    } else if (statusFilter === "locked") {
      where.lockedUntil = { gt: new Date() };
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
        { city: { contains: searchQuery, mode: "insensitive" } },
        { phone: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          city: true,
          phone: true,
          isActive: true,
          isBanned: true,
          banReason: true,
          loginAttempts: true,
          lockedUntil: true,
          lastLoginAt: true,
          loginCount: true,
          emailVerified: true,
          orgId: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              matters: true,
              bookings: true,
              documents: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[Admin Users GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch users", details: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/users — Update user role, status, ban, plan
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, value, reason, notes } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "userId and action are required" }, { status: 400 });
    }

    // Cannot modify another SUPER_ADMIN unless you are SUPER_ADMIN
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, email: true } });
    if (target?.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot modify a Super Admin" }, { status: 403 });
    }

    let data: any = {};
    switch (action) {
      case "SET_ROLE":
        const validRoles = ["USER", "ADVOCATE", "ADMIN"];
        if (role === "SUPER_ADMIN") validRoles.push("SUPER_ADMIN");
        if (!validRoles.includes(value)) {
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        data = { role: value };
        break;

      case "SET_PLAN":
        const validPlans = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"];
        if (!validPlans.includes(value)) {
          return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }
        data = { plan: value };
        break;

      case "BAN":
        data = { isBanned: true, isActive: false, banReason: reason || "Violated Terms of Service" };
        break;

      case "UNBAN":
        data = { isBanned: false, isActive: true, banReason: null };
        break;

      case "DEACTIVATE":
        data = { isActive: false };
        break;

      case "ACTIVATE":
        data = { isActive: true };
        break;

      case "UNLOCK":
        data = { loginAttempts: 0, lockedUntil: null };
        break;

      case "SET_NOTES":
        data = { notes: notes || "" };
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, role: true, isActive: true, isBanned: true, plan: true },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action,
        targetType: "USER",
        targetId: userId,
        details: JSON.stringify({ value, reason, updated }),
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("[Admin Users PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update user", details: error.message }, { status: 500 });
  }
}

// POST /api/admin/users — Create a new user (admin-created)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bcrypt = await import("bcryptjs");
    const { name, email, password, userRole, plan } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.default.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: userRole || "USER",
        plan: plan || "FREE",
        isActive: true,
        emailVerified: new Date(),
        createdByAdmin: true,
      },
      select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true },
    });

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action: "CREATE_USER",
        targetType: "USER",
        targetId: newUser.id,
        details: JSON.stringify({ email, role: userRole, plan }),
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("[Admin Users POST Error]:", error);
    return NextResponse.json({ error: "Failed to create user", details: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/users — Delete a user (SUPER_ADMIN only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Cannot delete self
    if (userId === (session.user as any).id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action: "DELETE_USER",
        targetType: "USER",
        targetId: userId,
      },
    }).catch(() => null);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin Users DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete user", details: error.message }, { status: 500 });
  }
}
