import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseBody, createMessageSchema, ValidationError } from "@/lib/validators";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const matterId = params.id;

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

    const matter = await prisma.matter.findFirst({
      where: {
        id: matterId,
        ...(caller.role !== "ADMIN"
          ? {
              OR: [
                { userId: caller.id },
                { advocate: { userId: caller.id } },
                { caseParties: { some: { userId: caller.id } } },
              ],
            }
          : {}),
      },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { matterId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const matterId = params.id;

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

    const matter = await prisma.matter.findFirst({
      where: {
        id: matterId,
        ...(caller.role !== "ADMIN"
          ? {
              OR: [
                { userId: caller.id },
                { advocate: { userId: caller.id } },
                { caseParties: { some: { userId: caller.id } } },
              ],
            }
          : {}),
      },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { text } = parseBody(createMessageSchema, body);

    const message = await prisma.message.create({
      data: {
        matterId,
        senderId: caller.id, // Strictly bind to authenticated user
        text,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
