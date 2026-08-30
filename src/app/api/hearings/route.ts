import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── GET /api/hearings?caseId=xxx ─────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    }

    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!caller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Guard: caller must be plaintiff, defendant/party, or assigned advocate
    const matter = await prisma.matter.findFirst({
      where: {
        id: caseId,
        OR: [
          { userId: caller.id },
          { caseParties: { some: { userId: caller.id } } },
          { advocate: { userId: caller.id } },
        ],
      },
      select: { id: true },
    });

    if (!matter) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const hearings = await prisma.hearing.findMany({
      where: { caseId },
      orderBy: { hearingDate: "asc" },
    });

    return NextResponse.json(hearings);
  } catch (error) {
    console.error("GET /api/hearings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── POST /api/hearings ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      caseId,
      hearingDate,
      hearingTime,
      courtName,
      courtNumber,
      judgeName,
      purpose,
      notes,
    } = body as {
      caseId: string;
      hearingDate: string;
      hearingTime: string;
      courtName: string;
      courtNumber?: string;
      judgeName?: string;
      purpose: string;
      notes?: string;
    };

    if (!caseId || !hearingDate || !hearingTime || !courtName || !purpose) {
      return NextResponse.json(
        { error: "caseId, hearingDate, hearingTime, courtName and purpose are required" },
        { status: 400 }
      );
    }

    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!caller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only plaintiff or assigned advocate may add hearings
    const matter = await prisma.matter.findFirst({
      where: {
        id: caseId,
        OR: [
          { userId: caller.id },
          { advocate: { userId: caller.id } },
        ],
      },
      select: { id: true },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Only the plaintiff or assigned advocate may add hearings" },
        { status: 403 }
      );
    }

    const hearing = await prisma.hearing.create({
      data: {
        caseId,
        hearingDate: new Date(hearingDate),
        hearingTime,
        courtName,
        courtNumber: courtNumber || null,
        judgeName: judgeName || null,
        purpose,
        notes: notes || null,
      },
    });

    // Also update Matter.nextHearingDate if this new date is sooner
    const existing = await prisma.matter.findUnique({
      where: { id: caseId },
      select: { nextHearingDate: true },
    });

    const newDate = new Date(hearingDate);
    if (
      !existing?.nextHearingDate ||
      newDate < new Date(existing.nextHearingDate)
    ) {
      await prisma.matter.update({
        where: { id: caseId },
        data: { nextHearingDate: newDate },
      });
    }

    return NextResponse.json(hearing, { status: 201 });
  } catch (error) {
    console.error("POST /api/hearings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH /api/hearings ──────────────────────────────────────────────────────
// Body: { id, outcome?, adjournReason?, nextDate?, notes?, reminderSent? }
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, outcome, adjournReason, nextDate, notes, reminderSent } = body as {
      id: string;
      outcome?: string;
      adjournReason?: string;
      nextDate?: string | null;
      notes?: string;
      reminderSent?: boolean;
    };

    if (!id) {
      return NextResponse.json({ error: "Hearing id is required" }, { status: 400 });
    }

    // Verify access through the associated matter
    const hearing = await prisma.hearing.findUnique({
      where: { id },
      select: { caseId: true },
    });
    if (!hearing) {
      return NextResponse.json({ error: "Hearing not found" }, { status: 404 });
    }

    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const matter = await prisma.matter.findFirst({
      where: {
        id: hearing.caseId,
        OR: [
          { userId: caller?.id },
          { advocate: { userId: caller?.id } },
        ],
      },
      select: { id: true },
    });

    if (!matter) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updated = await prisma.hearing.update({
      where: { id },
      data: {
        ...(outcome !== undefined ? { outcome } : {}),
        ...(adjournReason !== undefined ? { adjournReason } : {}),
        ...(nextDate !== undefined ? { nextDate: nextDate ? new Date(nextDate) : null } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(reminderSent !== undefined ? { reminderSent } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/hearings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
