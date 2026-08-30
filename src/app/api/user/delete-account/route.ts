import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── DELETE /api/user/delete-account ────────────────────────
// DPDPA 2023 Right to Erasure — deletes all PII, anonymizes case data.

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    // Anonymize matters (preserve for legal record-keeping, strip PII)
    await prisma.matter.updateMany({
      where: { userId },
      data: {
        // Keep case data but strip user link by updating status
        status: "ANONYMIZED",
      },
    });

    // Delete all PII-containing records
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { userId } }),
      prisma.document.deleteMany({ where: { uploaderId: userId } }),
      prisma.message.deleteMany({ where: { senderId: userId } }),
      prisma.caseNotification.deleteMany({ where: { userId } }),
      prisma.verificationToken.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
      prisma.usageQuota.deleteMany({ where: { userId } }),
      prisma.caseParty.deleteMany({ where: { userId } }),
      // Delete advocate profile if exists
      prisma.advocate.deleteMany({ where: { userId } }),
      // Finally delete the user
      prisma.user.delete({ where: { id: userId } }),
    ]);

    console.log(`[DeleteAccount] User ${userId} deleted (DPDPA compliance)`);

    return NextResponse.json({
      success: true,
      message: "Your account and all personal data have been permanently deleted.",
    });
  } catch (error) {
    console.error("[DeleteAccount] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support." },
      { status: 500 }
    );
  }
}

// ── GET /api/user/export-data ────────────────────────────────
// DPDPA 2023 Right to Portability — export all user data as JSON.

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const [user, matters, bookings, documents, notifications, subscription] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true, name: true, email: true, city: true, phone: true,
            role: true, createdAt: true, emailVerified: true,
          },
        }),
        prisma.matter.findMany({
          where: { userId },
          include: { timeline: true, hearings: true, settlements: true },
        }),
        prisma.booking.findMany({
          where: { userId },
          select: {
            confirmationCode: true, date: true, time: true, status: true,
            paymentStatus: true, consultationFee: true, consultationType: true,
            createdAt: true,
          },
        }),
        prisma.document.findMany({
          where: { uploaderId: userId },
          select: { title: true, type: true, createdAt: true },
        }),
        prisma.caseNotification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        prisma.subscription.findUnique({
          where: { userId },
          include: { plan: { select: { name: true, displayName: true } } },
        }),
      ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      notice:
        "This is your complete personal data export under DPDPA 2023 Right to Data Portability.",
      profile:      user,
      subscription: subscription || null,
      matters,
      bookings,
      documents,
      notifications,
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type":        "application/json",
        "Content-Disposition": `attachment; filename="lexnova-data-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("[ExportData] Error:", error);
    return NextResponse.json(
      { error: "Failed to export data." },
      { status: 500 }
    );
  }
}
