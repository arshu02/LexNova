import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  try {
    if (!email && !userId) {
      return NextResponse.json({ error: "Missing email or userId parameter" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(userId ? [{ id: userId }] : []),
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
    const { email, name, city } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: {
        ...(name ? { name } : {}),
        ...(city ? { city } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        city: updated.city,
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
