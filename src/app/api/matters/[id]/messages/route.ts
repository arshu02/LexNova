/**
 * GET  /api/matters/[id]/messages  — Fetch paginated messages for a matter
 * POST /api/matters/[id]/messages  — Send a new message to a matter
 *
 * Authorization: user must own the matter, be the assigned advocate,
 * or be a case party. Admins can access all.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAuth,
  canAccessMatter,
  internalErrorResponse,
  notFoundResponse,
} from '@/lib/auth-helpers';
import { parseBody, createMessageSchema, ValidationError } from '@/lib/validators';

// ── GET /api/matters/[id]/messages ───────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const matterId = params.id;

  // Authorization check
  const authorized = await canAccessMatter(user.id, user.role, matterId);
  if (!authorized) {
    return notFoundResponse('Matter');
  }

  try {
    const url    = new URL(req.url);
    const limit  = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);
    const cursor = url.searchParams.get('cursor') ?? undefined;

    const messages = await prisma.message.findMany({
      where:   { matterId },
      orderBy: { createdAt: 'desc' }, // newest first for cursor pagination
      take:    limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id:        true,
        text:      true,
        isRead:    true,
        createdAt: true,
        sender: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
      },
    });

    const hasMore    = messages.length > limit;
    const items      = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    // Mark unread messages as read for the current user
    const unreadIds = items
      .filter((m) => !m.isRead && m.sender.id !== user.id)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      // Fire-and-forget — don't block response on this
      prisma.message
        .updateMany({ where: { id: { in: unreadIds } }, data: { isRead: true } })
        .catch(console.error);
    }

    return NextResponse.json({
      items:      items.reverse(), // return in chronological order
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('[GET /api/matters/[id]/messages] error:', error);
    return internalErrorResponse('Failed to fetch messages.');
  }
}

// ── POST /api/matters/[id]/messages ──────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const matterId = params.id;

  // Authorization check
  const authorized = await canAccessMatter(user.id, user.role, matterId);
  if (!authorized) {
    return notFoundResponse('Matter');
  }

  try {
    const body = await req.json();

    let data: ReturnType<typeof parseBody<typeof createMessageSchema>>;
    try {
      data = parseBody(createMessageSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation Failed', details: err.messages },
          { status: 400 }
        );
      }
      throw err;
    }

    const message = await prisma.message.create({
      data: {
        text:     data.text,
        matterId,
        senderId: user.id,
        isRead:   false,
      },
      select: {
        id:        true,
        text:      true,
        isRead:    true,
        createdAt: true,
        sender: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('[POST /api/matters/[id]/messages] error:', error);
    return internalErrorResponse('Failed to send message.');
  }
}
