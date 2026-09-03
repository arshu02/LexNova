import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import {
  requireAuth,
  isAdmin,
  canAccessMatter,
  internalErrorResponse,
  notFoundResponse,
} from '@/lib/auth-helpers';
import {
  parseBody,
  createDocumentRecordSchema,
  updateDocumentRecordSchema,
  ValidationError,
} from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';
import dispatchAIGateway from '@/lib/ai-gateway';

// ── Document type → AI generation prompt ────────────────────────
const DOC_GENERATION_PROMPTS: Record<string, string> = {
  Legal_Notice: `You are a senior Indian advocate. Draft a formal legal notice under the Transfer of Property Act, Indian Contract Act, or applicable statute based on the provided case details. The notice must: (1) state the relevant law and section, (2) clearly state the grievance and relief demanded, (3) give 15 days to comply, (4) state consequences of non-compliance, (5) be in formal legal language. End with standard advocate signature block. DO NOT invent specific names or amounts not provided.`,

  Non_Disclosure_Agreement: `You are a senior corporate lawyer. Draft a comprehensive Non-Disclosure Agreement (NDA) suitable for Indian law. Include: (1) parties and purpose, (2) definition of confidential information, (3) obligations of receiving party, (4) exclusions, (5) term and termination, (6) remedies for breach, (7) governing law and jurisdiction. Use professional, enforceable legal language. DO NOT fill in specific names — use [DISCLOSING PARTY] and [RECEIVING PARTY] as placeholders.`,

  Rental_Agreement: `You are a property lawyer experienced in Indian Rent Control Acts. Draft a residential rental agreement compliant with applicable state rent laws. Include: (1) parties and premises, (2) rent and deposit terms, (3) maintenance obligations, (4) prohibited uses, (5) notice period, (6) security deposit refund conditions, (7) registration and stamp duty note, (8) dispute resolution. Use [LANDLORD] and [TENANT] as placeholders.`,

  Complaint: `You are a consumer rights advocate. Draft a formal complaint letter to the appropriate authority (Consumer Forum / NCDRC / Ombudsman) based on the provided facts. Include: (1) complainant details placeholder, (2) respondent details, (3) clear statement of facts, (4) violations of Consumer Protection Act 2019, (5) relief sought, (6) supporting documents to be attached.`,

  Affidavit: `You are an Indian advocate. Draft a sworn affidavit for the stated purpose. Include: (1) deponent details placeholder, (2) sworn statement format, (3) numbered paragraphs of facts, (4) verification clause, (5) oath/affirmation language per Indian law. Use formal, legally precise language.`,

  Demand_Letter: `You are a dispute resolution lawyer. Draft a firm but professional demand letter. Include: (1) clear statement of the dispute, (2) what was agreed versus what occurred, (3) specific demand with deadline (7 days), (4) consequences of non-compliance, (5) offer to resolve amicably. Use assertive but non-threatening language.`,
};

// ── GET /api/documents ────────────────────────────────────────
export async function GET(req: Request) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const matterId = searchParams.get('caseId') || searchParams.get('matterId');

  if (!matterId) {
    return NextResponse.json({ error: 'Missing matterId' }, { status: 400 });
  }

  // Authorization: must be able to access the matter
  const authorized = await canAccessMatter(user.id, user.role, matterId);
  if (!authorized) {
    return notFoundResponse('Matter');
  }

  try {
    const docs = await prisma.document.findMany({
      where:   { matterId },
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take:    1, // Only latest version metadata
          select:  { version: true, contentHash: true, createdAt: true, createdById: true },
        },
      },
    });

    await logAuditEvent({
      action:       'DOCUMENT_VIEWED',
      userId:       user.id,
      resourceId:   matterId,
      resourceType: 'MATTER',
      metadata:     { documentCount: docs.length },
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error('[GET /api/documents] error:', error);
    return internalErrorResponse('Failed to fetch documents.');
  }
}

// ── POST /api/documents ───────────────────────────────────────
// AI-assisted document generation
export async function POST(req: Request) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const data = parseBody(createDocumentRecordSchema, body);
    const targetMatterId = data.matterId || data.caseId;

    if (!targetMatterId) {
      return NextResponse.json({ error: 'Missing matterId' }, { status: 400 });
    }

    const authorized = await canAccessMatter(user.id, user.role, targetMatterId);
    if (!authorized) {
      return notFoundResponse('Matter');
    }

    const matterData = await prisma.matter.findUnique({
      where:  { id: targetMatterId },
      select: { id: true, title: true, description: true, jurisdiction: true, category: true },
    });

    if (!matterData) {
      return notFoundResponse('Matter');
    }

    // Normalize doc type key for prompt lookup
    const docTypeKey = data.docType.replace(/\s+/g, '_');
    const systemPrompt = DOC_GENERATION_PROMPTS[docTypeKey] || DOC_GENERATION_PROMPTS['Demand_Letter'];

    // ── AI-generated document content ──────────────────────────
    let content: string;
    const aiStart = Date.now();
    let aiProvider = 'fallback';

    try {
      const aiResult = await dispatchAIGateway({
        messages: [
          {
            role: 'user',
            content: `Matter Title: ${matterData.title}
Jurisdiction: ${matterData.jurisdiction}
Category: ${matterData.category || 'General'}
Additional Details: ${data.details}

Please generate the ${data.docType} document now.`,
          },
        ],
        systemPrompt,
        temperature:         0.2, // low temperature for consistent legal docs
        maxTokens:           3000,
        enableCache:         false, // never cache legal documents
        enablePIIRedaction:  true,
        modelTier:           'PREMIUM',
      });

      content    = aiResult.content;
      aiProvider = aiResult.provider;

      // Track AI usage
      await prisma.aIInteraction.create({
        data: {
          userId:       user.id,
          orgId:        user.orgId ?? null,
          matterId:     targetMatterId,
          workflowType: 'DOCUMENT_GENERATION',
          provider:     aiResult.provider,
          model:        aiResult.model,
          latencyMs:    Date.now() - aiStart,
          status:       'SUCCESS',
        },
      }).catch(console.error);
    } catch (aiErr) {
      console.error('[Documents] AI generation failed:', aiErr);
      content = `[Document generation failed. Please try again or contact support.]\n\nDocument Type: ${data.docType}\nDetails provided: ${data.details}`;
    }

    // Add mandatory legal disclaimer footer
    const disclaimerFooter = `\n\n---\n⚠️ IMPORTANT LEGAL NOTICE: This document was generated with AI assistance and is provided for informational purposes only. It has NOT been reviewed by a licensed advocate. Do not use this document in legal proceedings without first having it reviewed, approved, and signed by a qualified legal professional. LexNova does not provide legal advice.`;
    content = content + disclaimerFooter;

    const contentHash = crypto.createHash('sha256').update(content).digest('hex');
    const docTitle    = `${data.docType} — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    // Create document record + initial version in a transaction
    const { newDoc } = await prisma.$transaction(async (tx) => {
      const doc = await tx.document.create({
        data: {
          title:      docTitle,
          type:       data.docType,
          content,
          matterId:   targetMatterId,
          uploaderId: user.id,
        },
      });

      await tx.documentVersion.create({
        data: {
          documentId:  doc.id,
          version:     1,
          title:       docTitle,
          content,
          sizeBytes:   Buffer.byteLength(content, 'utf8'),
          contentHash,
          createdById: user.id,
          changeNote:  `AI-generated via ${aiProvider}`,
        },
      });

      return { newDoc: doc };
    });

    await logAuditEvent({
      action:       'DOCUMENT_GENERATED',
      userId:       user.id,
      orgId:        user.orgId ?? undefined,
      resourceId:   newDoc.id,
      resourceType: 'DOCUMENT',
      metadata:     { docType: data.docType, matterId: targetMatterId, aiProvider },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation Failed', details: error.messages },
        { status: 400 }
      );
    }
    console.error('[POST /api/documents] error:', error);
    return internalErrorResponse('Failed to generate document.');
  }
}

// ── PATCH /api/documents ──────────────────────────────────────
// Updates a document and creates a new version snapshot
export async function PATCH(req: Request) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const data = parseBody(updateDocumentRecordSchema, body);

    const doc = await prisma.document.findUnique({
      where:   { id: data.docId },
      include: { matter: { select: { userId: true, advocateId: true } }, versions: { orderBy: { version: 'desc' }, take: 1 } },
    });

    if (!doc) {
      return notFoundResponse('Document');
    }

    const isAuthorized =
      isAdmin(user.role)              ||
      doc.uploaderId              === user.id ||
      doc.matter.userId           === user.id ||
      doc.matter.advocateId       === user.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updateData: any = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.title   !== undefined) updateData.title   = data.title;

    const currentVersion = doc.versions[0]?.version ?? 0;

    // Update document + create version snapshot in a transaction
    const { updatedDoc } = await prisma.$transaction(async (tx) => {
      const updated = await tx.document.update({
        where: { id: data.docId },
        data:  updateData,
      });

      // Create version snapshot of the new content
      if (data.content !== undefined) {
        const contentHash = crypto.createHash('sha256').update(data.content).digest('hex');
        await tx.documentVersion.create({
          data: {
            documentId:  doc.id,
            version:     currentVersion + 1,
            title:       data.title || doc.title,
            content:     data.content,
            sizeBytes:   Buffer.byteLength(data.content, 'utf8'),
            contentHash,
            createdById: user.id,
            changeNote:  (body.changeNote as string | undefined) || 'Document updated',
          },
        });
      }

      return { updatedDoc: updated };
    });

    await logAuditEvent({
      action:       'DOCUMENT_VERSION_CREATED',
      userId:       user.id,
      resourceId:   doc.id,
      resourceType: 'DOCUMENT',
      metadata:     { newVersion: currentVersion + 1, changes: Object.keys(updateData) },
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation Failed', details: error.messages },
        { status: 400 }
      );
    }
    console.error('[PATCH /api/documents] error:', error);
    return internalErrorResponse('Failed to update document.');
  }
}
