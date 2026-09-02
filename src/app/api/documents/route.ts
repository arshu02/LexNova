import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  parseBody,
  createDocumentRecordSchema,
  updateDocumentRecordSchema,
  ValidationError,
} from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const matterId = searchParams.get("caseId") || searchParams.get("matterId");

    if (!matterId) {
      return NextResponse.json({ error: "Missing matterId" }, { status: 400 });
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

    // Verify caller has permission to view documents of this matter
    const matter = await prisma.matter.findFirst({
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
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 403 }
      );
    }

    const docs = await prisma.document.findMany({
      where: { matterId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Fetch documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

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

    const body = await req.json();
    const data = parseBody(createDocumentRecordSchema, body);
    const targetMatterId = data.matterId || data.caseId;

    if (!targetMatterId) {
      return NextResponse.json({ error: "Missing matterId" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const docType = data.docType;
    const details = data.details;

    let content = "";
    if (docType === "Legal Notice") {
      content = `BY REGISTERED AD POST\nDate: ${today}\n\nTo,\nOpposing Party Node,\nJurisdiction: ${matterData.jurisdiction}\n\nSUBJECT: Legal Notice for recovery of outstanding claims.\n\nSir/Madam,\n\nUnder instructions from our client, we hereby issue this legal notice regarding the dispute:\n\n"${details}"\n\nYou are hereby called upon to settle this dispute within 15 days of this notice, failing which legal actions will be initiated.\n\nSincerely,\nLexNova Digital Synthesis Console`;
    } else if (docType === "Non-Disclosure Agreement") {
      content = `NON-DISCLOSURE AGREEMENT\nDate: ${today}\n\nBetween:\nDisclosing Party: Client Node\nReceiving Party: Opposing Party Node\n\n1. Purpose: Evaluation of strategic business/legal synergy.\n2. Scope: "${details}"\n3. Duration: 2 Years from execution date.\n\nGoverning Law: Jurisdiction of ${matterData.jurisdiction}, India.\n\nExecuted by authorized nodes.`;
    } else if (docType === "Rental Agreement") {
      content = `RENTAL LEASE AGREEMENT\nDate: ${today}\n\nBetween:\nLandlord Node & Tenant Node\n\n1. Premises: Property located in ${matterData.jurisdiction}.\n2. Terms & Special Conditions: "${details}"\n3. Security Deposit: Refundable within 15 days of vacating.\n\nExecuted under Rent Control Act provisions.`;
    } else {
      content = `DEMAND LETTER\nDate: ${today}\n\nTo,\nThe Managing Director,\nOpponent Entity,\n\nSubject: Formal demand for resolution of dispute.\n\nDear Sir,\n\nWe write to formally demand resolution regarding:\n\n"${details}"\n\nProvide resolution requested within 7 days.\n\nSincerely,\nClient Representative`;
    }

    const newDoc = await prisma.document.create({
      data: {
        title: `${docType} - Synthesis`,
        type: docType,
        content,
        matterId: targetMatterId,
        uploaderId: caller.id,
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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

    const body = await req.json();
    const data = parseBody(updateDocumentRecordSchema, body);

    const doc = await prisma.document.findUnique({
      where: { id: data.docId },
      include: { matter: true },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const isAuthorized =
      caller.role === "ADMIN" ||
      doc.uploaderId === caller.id ||
      doc.matter.userId === caller.id ||
      doc.matter.advocateId === caller.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updateData: any = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.title !== undefined) updateData.title = data.title;

    const updatedDoc = await prisma.document.update({
      where: { id: data.docId },
      data: updateData,
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.messages },
        { status: 400 }
      );
    }
    console.error("Update document error:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}
