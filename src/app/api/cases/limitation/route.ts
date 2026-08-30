import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  LIMITATION_PERIODS,
  calculateLimitation,
  resolveLimitationKey,
} from "@/lib/limitation-periods";

// ── POST /api/cases/limitation ───────────────────────────────────────────────
// Body: { caseId, caseType, incidentDate }
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { caseId, caseType: rawCaseType, incidentDate } = body as {
      caseId: string;
      caseType: string;
      incidentDate: string;
    };

    if (!caseId || !rawCaseType || !incidentDate) {
      return NextResponse.json(
        { error: "caseId, caseType and incidentDate are required" },
        { status: 400 }
      );
    }

    // ── Resolve the limitation key ──────────────────────────────────────────
    const caseType = resolveLimitationKey(rawCaseType) ?? rawCaseType.toUpperCase();

    if (!LIMITATION_PERIODS[caseType]) {
      return NextResponse.json(
        {
          error: `Unknown case type: ${rawCaseType}. Valid types: ${Object.keys(LIMITATION_PERIODS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Verify access ───────────────────────────────────────────────────────
    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const matter = await prisma.matter.findFirst({
      where: {
        id: caseId,
        OR: [
          { userId: caller?.id },
          { advocate: { userId: caller?.id } },
        ],
      },
      select: { id: true },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    // ── Calculate ───────────────────────────────────────────────────────────
    const incident = new Date(incidentDate);
    const result = calculateLimitation(caseType, incident);

    const period = LIMITATION_PERIODS[caseType];

    // ── Upsert LimitationPeriod record ──────────────────────────────────────
    const warningDays = JSON.stringify([30, 15, 7, 1]);
    const record = await (prisma.limitationPeriod as any).upsert({
      where: { caseId },
      create: {
        caseId,
        caseType,
        filingDeadline: result.deadline ?? new Date(incident.getTime() + (period.days ?? 0) * 86400000),
        warningDays,
        warningsSent: "[]",
        isExpired: result.isExpired,
        legalBasis: period.law,
      },
      update: {
        caseType,
        filingDeadline: result.deadline ?? new Date(incident.getTime() + (period.days ?? 0) * 86400000),
        warningDays,
        isExpired: result.isExpired,
        legalBasis: period.law,
      },
    });

    // ── Response ────────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      deadline: result.deadline?.toISOString() ?? null,
      daysRemaining: result.daysRemaining,
      isUrgent: result.isUrgent,
      isCritical: result.isCritical,
      isExpired: result.isExpired,
      hasFixedPeriod: result.hasFixedPeriod,
      legalBasis: result.legalBasis,
      description: result.description,
      recordId: record.id,
    });
  } catch (error) {
    console.error("POST /api/cases/limitation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── GET /api/cases/limitation?caseId=xxx ─────────────────────────────────────
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

    const record = await (prisma.limitationPeriod as any).findUnique({
      where: { caseId },
    });

    if (!record) {
      return NextResponse.json({ error: "No limitation period set for this case" }, { status: 404 });
    }

    const now = new Date();
    const msRemaining = new Date(record.filingDeadline).getTime() - now.getTime();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      ...record,
      daysRemaining,
      isUrgent: daysRemaining > 0 && daysRemaining < 30,
      isCritical: daysRemaining > 0 && daysRemaining < 7,
    });
  } catch (error) {
    console.error("GET /api/cases/limitation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
