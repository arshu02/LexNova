import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ── Vercel Cron — runs daily at 08:00 UTC ───────────────────────────────────
// vercel.json: { "crons": [{ "path": "/api/cron/hearing-reminders", "schedule": "0 8 * * *" }] }

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds

export async function GET(req: Request) {
  try {
    // ── Auth: only allow Vercel cron or internal calls ─────────────────────
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    }

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);

    // ── Find all upcoming hearings in next 7 days not yet reminded ─────────
    const upcomingHearings = await prisma.hearing.findMany({
      where: {
        reminderSent: false,
        hearingDate: {
          gte: now,
          lte: in7Days,
        },
      },
      include: {
        matter: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            caseParties: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (upcomingHearings.length === 0) {
      return NextResponse.json({
        processed: 0,
        message: "No upcoming hearings needing reminders.",
      });
    }

    let notificationsCreated = 0;
    const processedHearingIds: string[] = [];

    for (const hearing of upcomingHearings) {
      const matter = hearing.matter;
      const hearingDateStr = hearing.hearingDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const daysUntil = Math.ceil(
        (hearing.hearingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const title = `Hearing Reminder: ${daysUntil === 0 ? "Today" : `${daysUntil} day${daysUntil === 1 ? "" : "s"} away`}`;
      const message = `Your hearing for "${matter.title}" is scheduled on ${hearingDateStr} at ${hearing.hearingTime}, ${hearing.courtName}${hearing.courtNumber ? ` (Court No. ${hearing.courtNumber})` : ""}${hearing.judgeName ? ` before Hon. ${hearing.judgeName}` : ""}.`;

      // ── Collect all party user IDs (plaintiff + CaseParty members) ─────
      const partyUserIds = new Set<string>();
      partyUserIds.add(matter.userId); // plaintiff
      for (const cp of matter.caseParties) {
        partyUserIds.add(cp.userId);
      }

      // ── Create CaseNotification for each party ─────────────────────────
      const notifications = Array.from(partyUserIds).map((userId) => ({
        userId,
        caseId: matter.id,
        type: "HEARING_REMINDER",
        title,
        message,
        channel: "APP",
        isRead: false,
        scheduledAt: now,
        sentAt: now,
      }));

      await prisma.caseNotification.createMany({ data: notifications });
      notificationsCreated += notifications.length;

      // ── Mark hearing as reminded ───────────────────────────────────────
      await prisma.hearing.update({
        where: { id: hearing.id },
        data: { reminderSent: true },
      });

      processedHearingIds.push(hearing.id);
    }

    console.log(
      `[cron/hearing-reminders] Processed ${processedHearingIds.length} hearings, created ${notificationsCreated} notifications.`
    );

    return NextResponse.json({
      processed: processedHearingIds.length,
      notificationsCreated,
      hearingIds: processedHearingIds,
    });
  } catch (error) {
    console.error("[cron/hearing-reminders] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
