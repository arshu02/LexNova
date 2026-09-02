import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/settings — Get all platform settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;

    return NextResponse.json({ settings: map, raw: settings });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PATCH /api/admin/settings — Update platform settings
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 });
    }

    const updated = await prisma.appSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action: "UPDATE_SETTING",
        targetType: "USER",
        targetId: key,
        details: JSON.stringify({ key, value }),
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

// POST /api/admin/settings — Bulk update settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { settings } = await req.json();
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "settings object required" }, { status: 400 });
    }

    const updates = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );

    await prisma.adminLog.create({
      data: {
        adminId: (session.user as any).id || "unknown",
        action: "BULK_UPDATE_SETTINGS",
        targetType: "USER",
        details: JSON.stringify(settings),
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to bulk update settings" }, { status: 500 });
  }
}
