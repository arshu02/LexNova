import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    const matterData = await prisma.matter.findFirst({
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
      include: {
        user: {
          select: { id: true, name: true, email: true, city: true },
        },
        advocate: true,
        bookings: {
          include: {
            advocate: true,
          },
          orderBy: { createdAt: "desc" },
        },
        documents: true,
        timeline: true,
      },
    });

    if (!matterData) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(matterData);
  } catch (error) {
    console.error("Fetch matter error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matter details" },
      { status: 500 }
    );
  }
}

// Allows updating the status of the matter
export async function PATCH(
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

    const { status } = await req.json();

    const existingMatter = await prisma.matter.findFirst({
      where: {
        id: matterId,
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

    if (!existingMatter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    const updatedMatter = await prisma.matter.update({
      where: { id: matterId },
      data: {
        status: status || existingMatter.status,
      },
    });

    return NextResponse.json(updatedMatter);
  } catch (error) {
    console.error("Update matter error:", error);
    return NextResponse.json(
      { error: "Failed to update matter details" },
      { status: 500 }
    );
  }
}
