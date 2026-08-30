import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logAuditEvent } from '@/lib/audit-logger';

// ── GET /api/organizations (load user's organization & team members) ──
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        org: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                city: true,
                createdAt: true,
              },
            },
            cases: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
              },
              take: 20,
            },
          },
        },
      },
    });

    // If user doesn't have an org yet, auto-create a default personal/firm workspace
    if (!user?.org) {
      const slug = (user?.name || 'firm')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') + '-' + crypto.randomBytes(3).toString('hex');

      const newOrg = await prisma.organization.create({
        data: {
          name: `${user?.name || 'My'}'s Legal Workspace`,
          slug,
          apiKey: `ln_live_${crypto.randomBytes(24).toString('hex')}`,
          members: {
            connect: { id: userId },
          },
        },
        include: {
          members: { select: { id: true, name: true, email: true, role: true, city: true, createdAt: true } },
          cases: true,
        },
      });

      return NextResponse.json({ organization: newOrg });
    }

    return NextResponse.json({ organization: user.org });
  } catch (error: any) {
    console.error('[Organization API Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// ── POST /api/organizations (Regenerate API Key or Update Name) ──
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const { action, name } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { orgId: true },
    });

    if (!user?.orgId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (action === 'REGENERATE_API_KEY') {
      const newApiKey = `ln_live_${crypto.randomBytes(24).toString('hex')}`;
      const updatedOrg = await prisma.organization.update({
        where: { id: user.orgId },
        data: { apiKey: newApiKey },
      });

      await logAuditEvent({
        action: 'API_KEY_GENERATED',
        userId,
        orgId: user.orgId,
      });

      return NextResponse.json({ success: true, apiKey: updatedOrg.apiKey });
    }

    if (action === 'UPDATE_NAME' && name) {
      const updatedOrg = await prisma.organization.update({
        where: { id: user.orgId },
        data: { name },
      });
      return NextResponse.json({ success: true, organization: updatedOrg });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
