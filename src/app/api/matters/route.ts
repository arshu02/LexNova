import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");

    let userObj = null;
    if (session?.user?.email) {
      userObj = await prisma.user.findUnique({ where: { email: session.user.email } });
    }

    const targetUserId = userObj?.id || (queryUserId !== "user_placeholder" ? queryUserId : null) || (session?.user as any)?.id;

    if (!targetUserId) {
      return NextResponse.json([]);
    }

    let matters = await prisma.matter.findMany({
      where: {
        OR: [
          { userId: targetUserId },
          ...(userObj?.email ? [{ user: { email: userObj.email } }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        advocate: true,
      },
    });

    return NextResponse.json(matters);
  } catch (error) {
    console.error("Error fetching matters:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, description, jurisdiction, urgency, category, userId: bodyUserId } = body;

    let targetUserId = bodyUserId;

    if (session?.user?.email) {
      const userObj = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (userObj) targetUserId = userObj.id;
    }

    if (!targetUserId) {
      targetUserId = (session?.user as any)?.id || "user_placeholder";
    }

    // Ensure target user exists
    const userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!userExists) {
      const newUser = await prisma.user.create({
        data: {
          id: targetUserId,
          name: session?.user?.name || "Client",
          email: session?.user?.email || `user_${Date.now()}@lexnova.com`,
          role: "USER",
        },
      });
      targetUserId = newUser.id;
    }

    const newMatter = await prisma.matter.create({
      data: {
        title: title || "Legal Consultation Request",
        description: description || "New matter submitted via dashboard",
        jurisdiction: jurisdiction || "National",
        urgency: urgency || "MEDIUM",
        category: category || "GENERAL",
        status: "ACTIVE",
        userId: targetUserId,
      },
    });

    return NextResponse.json(newMatter, { status: 201 });
  } catch (error) {
    console.error("Error creating matter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, urgency, title } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing matter ID" }, { status: 400 });
    }

    const updated = await prisma.matter.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(urgency ? { urgency } : {}),
        ...(title ? { title } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating matter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
