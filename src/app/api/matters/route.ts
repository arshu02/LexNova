import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  parseBody,
  createMatterSchema,
  updateMatterSchema,
  ValidationError,
} from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session?.user as any)?.id;
    const sessionEmail = session?.user?.email;

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

    // Admins can view all matters, regular users only view matters they own, are assigned to, or are a party to
    const isAdmin = caller.role === "ADMIN";
    const whereClause = isAdmin
      ? {}
      : {
          OR: [
            { userId: caller.id },
            { advocate: { userId: caller.id } },
            { caseParties: { some: { userId: caller.id } } },
          ],
        };

    const matters = await prisma.matter.findMany({
      where: whereClause,
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
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session?.user as any)?.id;
    const sessionEmail = session?.user?.email;

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

    const body = await req.json();
    const data = parseBody(createMatterSchema, body);

    const newMatter = await prisma.matter.create({
      data: {
        title: data.title,
        description: data.description,
        jurisdiction: data.jurisdiction,
        urgency: data.urgency || "MEDIUM",
        category: data.category || "GENERAL",
        priority: data.priority || "MEDIUM",
        status: "ACTIVE",
        userId: caller.id,
      },
    });

    return NextResponse.json(newMatter, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Error creating matter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session?.user as any)?.id;
    const sessionEmail = session?.user?.email;

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

    const body = await req.json();
    const data = parseBody(updateMatterSchema, body);

    // Verify caller has permission to modify this matter (owner, assigned advocate, or admin)
    const matter = await prisma.matter.findFirst({
      where: {
        id: data.id,
        ...(caller.role !== "ADMIN"
          ? {
              OR: [
                { userId: caller.id },
                { advocate: { userId: caller.id } },
              ],
            }
          : {}),
      },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    const updated = await prisma.matter.update({
      where: { id: data.id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.urgency ? { urgency: data.urgency } : {}),
        ...(data.title ? { title: data.title } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Error updating matter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
