import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/api-auth';
import { dispatchAIGateway } from '@/lib/ai-gateway';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  const { org, errorResponse } = await authenticateApiKey(req);
  if (errorResponse || !org) return errorResponse;

  try {
    const body = await req.json();
    const {
      documentType = 'LEGAL_NOTICE',
      senderName,
      senderAddress,
      recipientName,
      recipientAddress,
      disputeSummary,
      claimAmount,
      statuteCited,
      responseDays = 15,
    } = body;

    if (!senderName || !recipientName || !disputeSummary) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Fields "senderName", "recipientName", and "disputeSummary" are required.',
        },
        { status: 400 }
      );
    }

    const prompt = `
Draft a formal, court-ready ${documentType.replace(/_/g, ' ')} under Indian Law with the following parameters:
- Sender (Client): ${senderName}, Address: ${senderAddress || 'As per record'}
- Recipient (Opposite Party): ${recipientName}, Address: ${recipientAddress || 'As per record'}
- Claim / Demand Amount: ₹${claimAmount || 'To be quantified'}
- Statutory Basis: ${statuteCited || 'Applicable Indian laws'}
- Notice Period for Compliance: ${responseDays} days
- Facts of Dispute:
${disputeSummary}

Requirements:
1. Include formal legal notice header with registered post acknowledgment due (RPAD) notice line.
2. Structure into clear numbered chronological paragraphs.
3. State the precise cause of action and legal injury.
4. Conclude with a strict ${responseDays}-day demand to comply, failing which legal proceedings (civil and/or criminal) will be initiated at recipient's sole cost and consequence.
`;

    const aiResponse = await dispatchAIGateway({
      messages: [{ role: 'user', content: prompt }],
      systemPrompt:
        'You are an expert Senior Advocate of the Supreme Court of India specializing in legal drafting. Output precise, formal, and court-compliant legal notices.',
      temperature: 0.2,
      maxTokens: 3000,
    });

    await logAuditEvent({
      action: 'DOCUMENT_UPLOADED',
      orgId: org.id,
      metadata: { documentType, recipientName, source: 'API_v1' },
    });

    return NextResponse.json({
      success: true,
      documentType,
      draftContent: aiResponse.content,
      meta: {
        model: aiResponse.model,
        provider: aiResponse.provider,
        latencyMs: aiResponse.latencyMs,
      },
    });
  } catch (error: any) {
    console.error('[API v1 Draft Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'Drafting failed.' },
      { status: 500 }
    );
  }
}
