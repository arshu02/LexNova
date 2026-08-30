import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const matterId = searchParams.get("caseId") || searchParams.get("matterId");

  if (!matterId) {
    return NextResponse.json({ error: "Missing matterId" }, { status: 400 });
  }

  try {
    const docs = await prisma.document.findMany({
      where: { matterId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Fetch documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Note: client might still be sending caseId, so we check both
    const { caseId, matterId, docType, details } = await req.json();
    const targetMatterId = matterId || caseId;

    if (!targetMatterId || !docType || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const matterData = await prisma.matter.findUnique({
      where: { id: targetMatterId }
    });

    if (!matterData) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const today = new Date().toLocaleDateString();
    
    // Synthesis of document body based on type and input details
    let content = "";
    if (docType === "Legal Notice") {
      content = `BY REGISTERED AD POST\nDate: ${today}\n\nTo,\nOpposing Party Node,\nJurisdiction: ${matterData.jurisdiction}\n\nSUBJECT: Legal Notice for recovery of outstanding claims.\n\nSir/Madam,\n\nUnder instructions from our client, we hereby issue this legal notice regarding the dispute:\n\n"${details}"\n\nYou are hereby called upon to settle this dispute within 15 days of this notice, failing which legal actions will be initiated.\n\nSincerely,\nLexNova Digital Synthesis Console`;
    } else if (docType === "Non-Disclosure Agreement") {
      content = `NON-DISCLOSURE AGREEMENT\nDate: ${today}\n\nBetween:\nDisclosing Party: Client Node\nReceiving Party: Opposing Party Node\n\n1. Purpose: Evaluation of strategic business/legal synergy.\n2. Scope: "${details}"\n3. Duration: 2 Years from execution date.\n\nGoverning Law: Jurisdiction of ${matterData.jurisdiction}, India.\n\nExecuted by authorized nodes.`;
    } else if (docType === "Rental Agreement") {
      content = `RENTAL LEASE AGREEMENT\nDate: ${today}\n\nBetween:\nLandlord Node & Tenant Node\n\n1. Premises: Property located in ${matterData.jurisdiction}.\n2. Terms & Special Conditions: "${details}"\n3. Security Deposit: Refundable within 15 days of vacating.\n\nExecuted under Rent Control Act provisions.`;
    } else {
      content = `DEMAND LETTER\nDate: ${today}\n\nTo,\nThe Managing Director,\nOpponent Entity,\n\nSubject: Formal demand for resolution of dispute.\n\nDear Sir,\n\nWe write to formally demand resolution regarding:\n\n"${details}"\n\nProvide resolution size requested within 7 days.\n\nSincerely,\nClient Representative`;
    }

    const newDoc = await prisma.document.create({
      data: {
        title: `${docType} - Synthesis`,
        type: docType,
        content,
        matterId: targetMatterId,
        uploaderId: matterData.userId, // Assuming the user who owns the matter is generating it
      }
    });

    return NextResponse.json(newDoc);
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { docId, content, title } = await req.json();

    if (!docId) {
      return NextResponse.json({ error: "Missing docId" }, { status: 400 });
    }

    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;

    const updatedDoc = await prisma.document.update({
      where: { id: docId },
      data: updateData
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    console.error("Update document error:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
