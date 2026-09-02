import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseBody, updateProfileSchema, ValidationError } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session?.user as any)?.id;
    const sessionEmail = session?.user?.email;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(sessionUserId ? [{ id: sessionUserId }] : []),
          ...(sessionEmail ? [{ email: sessionEmail }] : []),
        ],
      },
      include: {
        matters: { select: { id: true } },
        bookings: { select: { id: true } },
        documents: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city || "New Delhi",
      phone: user.phone || null,
      createdAt: user.createdAt,
      mattersCount: user.matters.length,
      bookingsCount: user.bookings.length,
      documentsCount: user.documents.length,
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session?.user as any)?.id;
    const sessionEmail = session?.user?.email;

    const body = await req.json();
    const data = parseBody(updateProfileSchema, body);

    const caller = await prisma.user.findFirst({
      where: {
        OR: [
          ...(sessionUserId ? [{ id: sessionUserId }] : []),
          ...(sessionEmail ? [{ email: sessionEmail }] : []),
        ],
      },
    });

    if (!caller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: caller.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        city: updated.city,
        phone: updated.phone,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
