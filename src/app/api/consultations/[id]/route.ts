import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const matterId = params.id;

  try {
    const matterData = await prisma.matter.findUnique({
      where: { id: matterId },
      include: {
        user: {
          select: { id: true, name: true, email: true, city: true }
        },
        advocate: true,
        bookings: {
          include: {
            advocate: true
          },
          orderBy: { createdAt: "desc" }
        },
        documents: true,
        timeline: true
      }
    });

    if (!matterData) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    return NextResponse.json(matterData);
  } catch (error) {
    console.error("Fetch matter error:", error);
    return NextResponse.json({ error: "Failed to fetch matter details" }, { status: 500 });
  }
}

// Allows updating the status of the matter
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const matterId = params.id;

  try {
    const { status } = await req.json();

    const existingMatter = await prisma.matter.findUnique({
      where: { id: matterId }
    });

    if (!existingMatter) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const updatedMatter = await prisma.matter.update({
      where: { id: matterId },
      data: {
        status: status || existingMatter.status,
      }
    });

    return NextResponse.json(updatedMatter);
  } catch (error) {
    console.error("Update matter error:", error);
    return NextResponse.json({ error: "Failed to update matter details" }, { status: 500 });
  }
}
