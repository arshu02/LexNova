import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caseId } = await params;
    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    }

    // Resolve caller's DB user
    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!caller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const matter = await prisma.matter.findFirst({
      where: {
        id: caseId,
        OR: [
          // Plaintiff (matter owner)
          { userId: caller.id },
          // Defendant or Witness (CaseParty record)
          { caseParties: { some: { userId: caller.id } } },
          // Advocate assigned to the matter
          { advocate: { userId: caller.id } },
        ],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        advocate: {
          select: { name: true, specialization: true, city: true },
        },
        caseParties: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            lawyer: {
              select: { name: true, specialization: true, city: true },
            },
          },
        },
        hearings: {
          orderBy: { hearingDate: "asc" },
        },
        courtDocuments: {
          orderBy: { filingDate: "desc" },
        },
        settlements: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        judgment: true,
      },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Case not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(matter);
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
