import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  requireAuth,
  isAdmin,
  canModifyMatter,
  notFoundResponse,
  internalErrorResponse,
} from '@/lib/auth-helpers';
import {
  parseBody,
  createMatterSchema,
  updateMatterSchema,
  ValidationError,
} from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

// Valid matter status transitions — enforced server-side
const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT:              ['INTAKE', 'ACTIVE'],
  INTAKE:             ['ACTIVE', 'CLOSED'],
  ACTIVE:             ['AWAITING_DOCUMENTS', 'LAWYER_MATCHING', 'LAWYER_ASSIGNED', 'ON_HOLD', 'RESOLVED', 'CLOSED'],
  AWAITING_DOCUMENTS: ['ACTIVE', 'ON_HOLD', 'CLOSED'],
  LAWYER_MATCHING:    ['LAWYER_ASSIGNED', 'ACTIVE', 'ON_HOLD', 'CLOSED'],
  LAWYER_ASSIGNED:    ['CONSULTATION_SCHEDULED', 'ACTIVE', 'ON_HOLD', 'RESOLVED', 'CLOSED'],
  CONSULTATION_SCHEDULED: ['ACTIVE', 'ON_HOLD', 'RESOLVED', 'CLOSED'],
  ON_HOLD:            ['ACTIVE', 'CLOSED'],
  RESOLVED:           ['ARCHIVED', 'CLOSED'],
  CLOSED:             ['ARCHIVED'],
  ARCHIVED:           [],
};

// ── GET /api/matters ─────────────────────────────────────────
// Returns paginated matters for the authenticated user.
// Supports ?cursor=&limit=20&status=ACTIVE
export async function GET(req: NextRequest) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const url    = new URL(req.url);
    const limit  = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 100);
    const cursor = url.searchParams.get('cursor') ?? undefined;
    const status = url.searchParams.get('status') ?? undefined;

    const whereClause = isAdmin(user.role)
      ? { ...(status ? { status } : {}) }
      : {
          OR: [
            { userId: user.id },
            { advocate: { userId: user.id } },
            { caseParties: { some: { userId: user.id } } },
          ],
          ...(status ? { status } : {}),
        };

    const matters = await prisma.matter.findMany({
      where:   whereClause,
      orderBy: { createdAt: 'desc' },
      take:    limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        advocate: {
          select: { id: true, name: true, specialization: true, rating: true, city: true },
        },
        _count: {
          select: { documents: true, messages: true, bookings: true, timeline: true },
        },
      },
    });

    const hasMore    = matters.length > limit;
    const items      = hasMore ? matters.slice(0, limit) : matters;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({ items, nextCursor, hasMore, total: items.length });
  } catch (error) {
    console.error('[GET /api/matters] error:', error);
    return internalErrorResponse('Failed to fetch matters.');
  }
}

// ── POST /api/matters ─────────────────────────────────────────
// Creates a new matter for the authenticated user.
export async function POST(req: Request) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    let data: ReturnType<typeof parseBody<typeof createMatterSchema>>;
    try {
      data = parseBody(createMatterSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation Failed', details: err.messages },
          { status: 400 }
        );
      }
      throw err;
    }

    const newMatter = await prisma.matter.create({
      data: {
        title:        data.title,
        description:  data.description,
        jurisdiction: data.jurisdiction,
        urgency:      data.urgency      || 'MEDIUM',
        category:     data.category     || 'GENERAL',
        priority:     data.priority     || 'MEDIUM',
        status:       'ACTIVE',
        userId:       user.id,
        ...(user.orgId ? { orgId: user.orgId } : {}),
      },
    });

    await logAuditEvent({
      action:       'CASE_CREATED',
      userId:       user.id,
      orgId:        user.orgId ?? undefined,
      resourceId:   newMatter.id,
      resourceType: 'MATTER',
      metadata:     { title: data.title, jurisdiction: data.jurisdiction },
    });

    return NextResponse.json(newMatter, { status: 201 });
  } catch (error) {
    console.error('[POST /api/matters] error:', error);
    return internalErrorResponse('Failed to create matter.');
  }
}

// ── PATCH /api/matters ────────────────────────────────────────
// Updates a matter. Enforces ownership and valid status transitions.
export async function PATCH(req: Request) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    let data: ReturnType<typeof parseBody<typeof updateMatterSchema>>;
    try {
      data = parseBody(updateMatterSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation Failed', details: err.messages },
          { status: 400 }
        );
      }
      throw err;
    }

    // Verify ownership
    const authorized = await canModifyMatter(user.id, user.role, data.id);
    if (!authorized) {
      return notFoundResponse('Matter');
    }

    // Fetch current matter to validate status transition
    const currentMatter = await prisma.matter.findUnique({
      where:  { id: data.id },
      select: { status: true },
    });

    if (!currentMatter) {
      return notFoundResponse('Matter');
    }

    // Validate status transition
    if (data.status && data.status !== currentMatter.status) {
      const validNext = VALID_TRANSITIONS[currentMatter.status] || [];
      if (!isAdmin(user.role) && !validNext.includes(data.status)) {
        return NextResponse.json(
          {
            error:   'Invalid transition',
            message: `Cannot transition matter from '${currentMatter.status}' to '${data.status}'.`,
            validTransitions: validNext,
          },
          { status: 422 }
        );
      }
    }

    const updated = await prisma.matter.update({
      where: { id: data.id },
      data: {
        ...(data.status    ? { status:    data.status }    : {}),
        ...(data.urgency   ? { urgency:   data.urgency }   : {}),
        ...(data.title     ? { title:     data.title }     : {}),
      },
    });

    await logAuditEvent({
      action:       'CASE_UPDATED',
      userId:       user.id,
      resourceId:   data.id,
      resourceType: 'MATTER',
      metadata:     {
        previousStatus: currentMatter.status,
        newStatus:      data.status,
        changes:        data,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/matters] error:', error);
    return internalErrorResponse('Failed to update matter.');
  }
}
