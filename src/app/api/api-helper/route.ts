import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    const { matterId, caseId, message } = await req.json();
    const targetMatterId = matterId || caseId;

    if (!targetMatterId || !message) {
      return NextResponse.json({ error: "Missing matterId or message" }, { status: 400 });
    }

    const matterData = await prisma.matter.findFirst({
      where: {
        id: targetMatterId,
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

    if (!matterData) {
      return NextResponse.json({ error: "Matter not found or access denied" }, { status: 404 });
    }

    const lowerMsg = message.toLowerCase();
    let replyText = "";

    // 1. Check if the message is asking to draft a document
    if (lowerMsg.includes("draft") || lowerMsg.includes("generate")) {
      let docType = "Legal Notice";
      if (lowerMsg.includes("nda") || lowerMsg.includes("disclosure")) {
        docType = "Non-Disclosure Agreement";
      } else if (lowerMsg.includes("rent") || lowerMsg.includes("tenant") || lowerMsg.includes("lease")) {
        docType = "Rental Agreement";
      } else if (lowerMsg.includes("demand")) {
        docType = "Demand Letter";
      }

      const today = new Date().toLocaleDateString();
      let docContent = "";
      if (docType === "Legal Notice") {
        docContent = `BY REGISTERED AD POST\nDate: ${today}\n\nTo,\nOpponent Entity,\nJurisdiction: ${matterData.jurisdiction}\n\nSUBJECT: Legal Notice for dispute resolution.\n\nDear Sirs,\n\nWe write under instructions of our client. Regarding: ${matterData.description || "outstanding dispute claim"}.\n\nYou are required to resolve this breach within 15 days or face legal action.\n\nSincerely,\nAdvocate Node`;
      } else {
        docContent = `${docType.toUpperCase()}\nDate: ${today}\n\nThis agreement outlines the terms negotiated under case file MATTER-${targetMatterId.slice(-6).toUpperCase()}.\n\nTerms of dispute: "${matterData.description || "Commercial negotiations"}"\n\nGoverning Law: Jurisdiction of ${matterData.jurisdiction}, India.`;
      }

      await prisma.document.create({
        data: {
          title: `${docType} - AI Draft`,
          type: docType,
          content: docContent,
          matterId: targetMatterId,
          uploaderId: matterData.userId,
        }
      });

      replyText = `System Node: I have drafted a **${docType}** for this case based on the fact telemetry. You can view, modify, and sign this draft inside the **Documents** tab.`;
    } 
    // 2. Check if the message is asking for required documents list
    else if (lowerMsg.includes("documents") || lowerMsg.includes("files") || lowerMsg.includes("upload")) {
      replyText = `System Node: Based on the Matter classification, please review the required documents in the Matter Profile. Typical documents include:\n\n1. Identity Proof\n2. Relevant Contracts/Invoices\n3. Proof of Communication\n\nPlease upload these documents to help counsel review your claims.`;
    }
    // 3. Check if the message is asking for timelines or milestones
    else if (lowerMsg.includes("timeline") || lowerMsg.includes("milestone") || lowerMsg.includes("step")) {
      const timelineList = await prisma.timelineEvent.findMany({
          where: { matterId: targetMatterId },
          orderBy: { date: 'asc' }
      });
      if (timelineList.length > 0) {
          replyText = `System Node: Current Case Milestones Status:\n\n` +
                      timelineList.map((m: any) => `• ${m.title} - ${m.description || ''}`).join("\n");
      } else {
          replyText = `System Node: No timeline events recorded yet.`;
      }
    }
    // 4. Fallback to generic legal co-pilot guidance
    else {
      replyText = `System Node: Acknowledged. Under Indian statutory regulations:
1. For Labour issues: Payment of Wages Act guarantees timeline payouts.
2. For Tenancy: State Rent Control guidelines govern eviction protections.
3. For Consumer claims: Consumer Protection Act 2019 allows direct district forum filings.

How else can the Co-Pilot assist in structured drafting or milestone tracking?`;
    }

    // Write AI message to the Room database
    const savedMsg = await prisma.message.create({
      data: {
        matterId: targetMatterId,
        senderId: "ai_assistant",
        text: replyText
      }
    });

    return NextResponse.json(savedMsg);
  } catch (error) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json({ error: "Failed to process AI query" }, { status: 500 });
  }
}
