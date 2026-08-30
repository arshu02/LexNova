import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// ── Helper: get caller and verify case access ────────────────────────────────
async function getCallerAndMatter(
  email: string,
  caseId: string,
  requireOwnerOrAdvocate = false
) {
  const caller = await prisma.user.findUnique({ where: { email } });
  if (!caller) return { caller: null, matter: null, partyRole: null };

  const matter = await prisma.matter.findFirst({
    where: {
      id: caseId,
      OR: requireOwnerOrAdvocate
        ? [{ userId: caller.id }, { advocate: { userId: caller.id } }]
        : [
            { userId: caller.id },
            { caseParties: { some: { userId: caller.id } } },
            { advocate: { userId: caller.id } },
          ],
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      advocate: { select: { id: true, userId: true, name: true } },
      caseParties: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          lawyer: { select: { id: true, userId: true, name: true } },
        },
      },
    },
  });

  // Determine caller's role in the case
  let partyRole: "PLAINTIFF" | "DEFENDANT" | "ADVOCATE" | "UNKNOWN" = "UNKNOWN";
  if (matter) {
    if (matter.userId === caller.id) partyRole = "PLAINTIFF";
    else {
      const cp = matter.caseParties.find((p) => p.userId === caller.id);
      if (cp) partyRole = cp.role as "PLAINTIFF" | "DEFENDANT";
      else if (
        matter.advocate?.userId === caller.id ||
        matter.caseParties.some((p) => p.lawyer?.userId === caller.id)
      ) {
        partyRole = "ADVOCATE";
      }
    }
  }

  return { caller, matter, partyRole };
}

// ── GET /api/settlements?caseId=xxx ─────────────────────────────────────────
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

    const { caller, matter } = await getCallerAndMatter(
      session.user.email,
      caseId
    );
    if (!caller || !matter) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const settlements = await prisma.settlement.findMany({
      where: { caseId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(settlements);
  } catch (error) {
    console.error("GET /api/settlements error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── POST /api/settlements ────────────────────────────────────────────────────
// Create a new settlement proposal or counter-proposal
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      caseId,
      amount,
      paymentTimeline,
      nonMonetaryTerms,
      validityDays = 30,
    } = body as {
      caseId: string;
      amount: number;
      paymentTimeline: string;
      nonMonetaryTerms?: string;
      validityDays?: number;
    };

    if (!caseId || amount === undefined || !paymentTimeline) {
      return NextResponse.json(
        { error: "caseId, amount, and paymentTimeline are required" },
        { status: 400 }
      );
    }

    const { caller, matter, partyRole } = await getCallerAndMatter(
      session.user.email,
      caseId
    );
    if (!caller || !matter) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Build full terms text
    const terms = [
      `Settlement Amount: ₹${amount.toLocaleString("en-IN")}`,
      `Payment Timeline: ${paymentTimeline}`,
      nonMonetaryTerms ? `Additional Terms: ${nonMonetaryTerms}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    // Mark all previous PROPOSED settlements as superseded
    await prisma.settlement.updateMany({
      where: { caseId, status: "PROPOSED" },
      data: { status: "SUPERSEDED" as any },
    });

    const settlement = await prisma.settlement.create({
      data: {
        caseId,
        proposedBy: caller.id,
        terms,
        amount,
        status: "PROPOSED",
        expiresAt,
      },
    });

    // Notify all parties about the new proposal
    const partyUserIds = new Set<string>([matter.userId]);
    matter.caseParties.forEach((cp) => partyUserIds.add(cp.userId));
    partyUserIds.delete(caller.id); // don't notify the proposer

    const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

    await prisma.caseNotification.createMany({
      data: Array.from(partyUserIds).map((uid) => ({
        userId: uid,
        caseId,
        type: "SETTLEMENT_PROPOSAL",
        title: "New Settlement Proposal",
        message: `${caller.name || caller.email} has proposed a settlement of ${fmt(amount)} for case "${matter.title}". Validity: ${validityDays} days.`,
        channel: "APP",
        isRead: false,
        sentAt: new Date(),
      })),
    });

    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    console.error("POST /api/settlements error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH /api/settlements ───────────────────────────────────────────────────
// action: "ACCEPT" | "REJECT" | "SIGN"
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { settlementId, action, otp } = body as {
      settlementId: string;
      action: "ACCEPT" | "REJECT" | "SIGN";
      otp?: string;
    };

    if (!settlementId || !action) {
      return NextResponse.json(
        { error: "settlementId and action are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.settlement.findUnique({
      where: { id: settlementId },
      include: {
        matter: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            advocate: { select: { id: true, userId: true, name: true } },
            caseParties: {
              include: {
                user: { select: { id: true, name: true, email: true } },
                lawyer: { select: { id: true, userId: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Settlement not found" }, { status: 404 });
    }

    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!caller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const matter = existing.matter;

    // Determine caller's party role
    const isPlaintiff = matter.userId === caller.id;
    const defendantParty = matter.caseParties.find((p) => p.role === "DEFENDANT");
    const isDefendant = defendantParty?.userId === caller.id;

    if (!isPlaintiff && !isDefendant) {
      return NextResponse.json(
        { error: "Only a party to the case can act on this settlement" },
        { status: 403 }
      );
    }

    if (action === "REJECT") {
      const updated = await prisma.settlement.update({
        where: { id: settlementId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "ACCEPT") {
      const updated = await prisma.settlement.update({
        where: { id: settlementId },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "SIGN") {
      // OTP validation (simplified — in production use a real OTP service)
      const expectedOtp = process.env.SETTLEMENT_OTP_SECRET
        ? `${caller.id.slice(-4)}${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`
        : "1234";

      if (otp !== expectedOtp) {
        // For dev: accept any 4-digit OTP
        if (!otp || otp.length < 4) {
          return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }
      }

      const nowSigned = {
        signedByPlaintiff: isPlaintiff ? true : existing.signedByPlaintiff,
        signedByDefendant: isDefendant ? true : existing.signedByDefendant,
      };

      const bothSigned = nowSigned.signedByPlaintiff && nowSigned.signedByDefendant;

      const updated = await prisma.settlement.update({
        where: { id: settlementId },
        data: {
          ...nowSigned,
          status: bothSigned ? "EXECUTED" : "ACCEPTED",
          signedAt: bothSigned ? new Date() : null,
        },
      });

      // If both have signed → generate AI settlement agreement + update case
      if (bothSigned) {
        void generateAndSaveAgreement(existing, matter, caller.id);
      }

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/settlements error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── AI Settlement Agreement generator ────────────────────────────────────────
async function generateAndSaveAgreement(
  settlement: any,
  matter: any,
  uploadedById: string
) {
  try {
    const plaintiffName = matter.user?.name || matter.user?.email || "Plaintiff";
    const defendant = matter.caseParties?.find((p: any) => p.role === "DEFENDANT");
    const defendantName = defendant?.user?.name || defendant?.user?.email || "Defendant";

    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    let agreementText: string;

    if (process.env.ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: `You are an expert Indian legal drafter. Draft concise, legally valid settlement agreements 
under the Code of Civil Procedure 1908, Order XXIII Rule 3 (lawful compromise). 
Use formal legal language but keep it clear. Always include: parties, recitals, terms, 
payment schedule, non-monetary terms, confidentiality, full & final settlement clause, 
jurisdiction, and signature blocks.`,
        messages: [
          {
            role: "user",
            content: `Draft a formal Settlement Agreement for this case.

PARTIES:
- Plaintiff: ${plaintiffName}
- Defendant: ${defendantName}

CASE: ${matter.title}
DATE: ${today}

AGREED TERMS:
${settlement.terms}

Draft a complete Settlement Agreement with all standard clauses. Include:
1. Parties and Recitals
2. Terms of Settlement (as stated above)
3. Full & Final Settlement Clause
4. Confidentiality Clause
5. Jurisdiction Clause (specify court/forum)
6. Signature Block for both parties with date

Format as a formal legal document.`,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === "text");
      agreementText = textContent?.type === "text"
        ? textContent.text.trim()
        : buildBasicAgreement(plaintiffName, defendantName, matter.title, settlement.terms, today);
    } else {
      agreementText = buildBasicAgreement(
        plaintiffName, defendantName, matter.title, settlement.terms, today
      );
    }

    // Save to CourtDocument
    await prisma.courtDocument.create({
      data: {
        caseId: matter.id,
        title: `Settlement Agreement — ${matter.title}`,
        type: "SETTLEMENT_AGREEMENT" as any,
        filedBy: "BOTH",
        content: agreementText,
        isShared: true,
        uploadedById,
        filingDate: new Date(),
      },
    });

    // Update case status to SETTLED
    await prisma.matter.update({
      where: { id: matter.id },
      data: { status: "SETTLED" as any },
    });

    // Notify all parties
    const partyIds = [
      matter.userId,
      ...(matter.caseParties?.map((cp: any) => cp.userId) || []),
    ];

    await prisma.caseNotification.createMany({
      data: partyIds.map((uid: string) => ({
        userId: uid,
        caseId: matter.id,
        type: "SETTLEMENT_PROPOSAL",
        title: "🎉 Settlement Agreement Executed",
        message: `The settlement agreement for "${matter.title}" has been signed by both parties and is now legally binding. Case status updated to SETTLED.`,
        channel: "APP",
        isRead: false,
        sentAt: new Date(),
      })),
    });

    // Notify assigned advocate
    if (matter.advocate?.userId) {
      await prisma.caseNotification.create({
        data: {
          userId: matter.advocate.userId,
          caseId: matter.id,
          type: "SETTLEMENT_PROPOSAL",
          title: "Settlement Executed — Client Case Settled",
          message: `Your client's case "${matter.title}" has been settled and the agreement signed by both parties.`,
          channel: "APP",
          isRead: false,
          sentAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.error("[Settlement] Agreement generation failed:", err);
  }
}

function buildBasicAgreement(
  plaintiff: string,
  defendant: string,
  title: string,
  terms: string,
  date: string
) {
  return `SETTLEMENT AGREEMENT

This Settlement Agreement ("Agreement") is entered into on ${date} between:

PLAINTIFF: ${plaintiff} ("First Party")
DEFENDANT: ${defendant} ("Second Party")

WHEREAS the parties are involved in a dispute titled "${title}";
WHEREAS the parties desire to settle and resolve all disputes between them;

NOW, THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:

TERMS OF SETTLEMENT:
${terms}

FULL AND FINAL SETTLEMENT:
This Agreement constitutes a full and final settlement of all claims, demands, actions, and causes of action between the parties arising from the above matter. Neither party shall have any further claim against the other in respect of this matter.

CONFIDENTIALITY:
Both parties agree to keep the terms of this settlement confidential and shall not disclose the same to any third party except as required by law or court order.

JURISDICTION:
This Agreement shall be governed by the laws of India. Any dispute arising from this Agreement shall be subject to the jurisdiction of courts in ${plaintiff}'s jurisdiction.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

PLAINTIFF: _____________________     Date: ___________
${plaintiff}

DEFENDANT: _____________________    Date: ___________
${defendant}

⚠️ This agreement is binding under the Indian Contract Act 1872 and Code of Civil Procedure 1908, Order XXIII Rule 3.`;
}
