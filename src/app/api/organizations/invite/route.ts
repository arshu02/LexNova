import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const { name, email, role = 'ASSOCIATE' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { orgId: true, name: true },
    });

    if (!currentUser?.orgId) {
      return NextResponse.json({ error: 'User does not belong to an organization.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      if (existingUser.orgId === currentUser.orgId) {
        return NextResponse.json(
          { error: 'User is already a member of this workspace.' },
          { status: 409 }
        );
      }
      if (existingUser.orgId) {
        return NextResponse.json(
          { error: 'This user already belongs to another organization workspace.' },
          { status: 400 }
        );
      }
      // Connect unaffiliated existing user to the org
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { orgId: currentUser.orgId, role: role.toUpperCase() },
      });

      await logAuditEvent({
        action: 'ORGANIZATION_MEMBER_INVITED',
        userId: currentUserId,
        orgId: currentUser.orgId,
        metadata: { invitedEmail: email, role },
      });

      return NextResponse.json({ success: true, message: 'Member added to workspace.' });
    }

    // Create a new member account with a temporary placeholder password
    const tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role.toUpperCase(),
        orgId: currentUser.orgId,
        emailVerified: new Date(),
      },
    });

    await logAuditEvent({
      action: 'ORGANIZATION_MEMBER_INVITED',
      userId: currentUserId,
      orgId: currentUser.orgId,
      metadata: { invitedUserId: newUser.id, invitedEmail: email, role },
    });

    return NextResponse.json({
      success: true,
      message: `Team member ${email} invited successfully.`,
      member: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('[Invite Member Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
