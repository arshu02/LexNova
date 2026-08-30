import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/api-auth';
import { dispatchAIGateway } from '@/lib/ai-gateway';
import prisma from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  const { org, errorResponse } = await authenticateApiKey(req);
  if (errorResponse || !org) return errorResponse;

  try {
    const body = await req.json();
    const { title, description, jurisdiction = 'India', partyRole = 'PLAINTIFF' } = body;

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Field "description" must be at least 10 characters.' },
        { status: 400 }
      );
    }

    // 1. Dispatch through Enterprise AI Gateway
    const aiAnalysis = await dispatchAIGateway({
      messages: [
        {
          role: 'user',
          content: `Analyze the following Indian legal dispute facts and return a structured assessment:\n\n${description}`,
        },
      ],
      systemPrompt:
        'You are an enterprise legal intake AI for India. Identify: (1) Applicable Indian Statutes and Sections, (2) Recommended Forum / Court, (3) Key Merits and Risks, (4) Immediate recommended action items.',
    });

    // 2. Persist Matter under the Organization
    const dummyUser = await prisma.user.findFirst({ where: { orgId: org.id } });
    const fallbackUserId = dummyUser ? dummyUser.id : (await prisma.user.findFirst())?.id || 'sys_user';

    const matter = await prisma.matter.create({
      data: {
        title: title || description.slice(0, 50) + '...',
        description,
        jurisdiction,
        status: 'ACTIVE',
        priority: 'MEDIUM',
        orgId: org.id,
        userId: fallbackUserId,
      },
    });

    // 3. Log Audit Event
    await logAuditEvent({
      action: 'CASE_CREATED',
      orgId: org.id,
      resourceId: matter.id,
      resourceType: 'Matter',
      metadata: { source: 'API_v1', latencyMs: aiAnalysis.latencyMs, model: aiAnalysis.model },
    });

    return NextResponse.json(
      {
        success: true,
        caseId: matter.id,
        organization: org.name,
        analysis: aiAnalysis.content,
        meta: {
          model: aiAnalysis.model,
          provider: aiAnalysis.provider,
          latencyMs: aiAnalysis.latencyMs,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API v1 Intake Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'Failed to process case intake.' },
      { status: 500 }
    );
  }
}
