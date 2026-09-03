import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireAuth,
  isAdmin,
  canAccessMatter,
  notFoundResponse,
  forbiddenResponse,
  internalErrorResponse,
} from '@/lib/auth-helpers';
import {
  parseBody,
  createBookingSchema,
  ValidationError,
} from '@/lib/validators';
import {
  sendUserBookingConfirmation,
  sendLawyerBookingNotification,
} from '@/lib/email';
import { logAuditEvent } from '@/lib/audit-logger';

// ── Helpers ────────────────────────────────────────────────────

function generateConfirmationCode(): string {
  const year   = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LN-${year}-${random}`;
}

function generateMeetLink(bookingId: string): string {
  // Uses Jitsi — replace with a managed video provider in production
  const room = `lexnova-${bookingId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
  return `https://meet.jit.si/${room}`;
}

// ── GET /api/bookings ─────────────────────────────────────────
// Returns all bookings for the authenticated user (or all if admin).
// Supports ?limit=&cursor= for pagination.
export async function GET(req: NextRequest) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const url    = new URL(req.url);
    const limit  = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 100);
    const cursor = url.searchParams.get('cursor') ?? undefined;

    const whereClause = isAdmin(user.role)
      ? {}
      : {
          OR: [
            { userId:    user.id },
            { advocate: { userId: user.id } },
          ],
        };

    const bookings = await prisma.booking.findMany({
      where:   whereClause,
      include: { advocate: true, matter: true },
      orderBy: { createdAt: 'desc' },
      take:    limit + 1, // fetch one extra to determine if there's a next page
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore    = bookings.length > limit;
    const items      = hasMore ? bookings.slice(0, limit) : bookings;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({ items, nextCursor, hasMore });
  } catch (error) {
    console.error('[GET /api/bookings] error:', error);
    return internalErrorResponse('Failed to fetch bookings.');
  }
}

// ── POST /api/bookings ────────────────────────────────────────
// Creates a new booking. REQUIRES authentication.
// Validates advocate existence, matter ownership, and prevents double-booking
// via a DB-level unique constraint + transaction.
export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    // Validate request body
    let data: ReturnType<typeof parseBody<typeof createBookingSchema>>;
    try {
      data = parseBody(createBookingSchema, body);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: 'Validation Failed', details: err.messages },
          { status: 400 }
        );
      }
      throw err;
    }

    // ── 1. Resolve advocate — must exist in DB, no fallbacks ──────────────
    const advocate = await prisma.advocate.findUnique({
      where: { id: data.advocateId },
    });

    if (!advocate) {
      return NextResponse.json(
        { error: 'Advocate not found', message: `No advocate with id '${data.advocateId}' exists.` },
        { status: 422 }
      );
    }

    // ── 2. Verify matter ownership if matterId supplied ───────────────────
    if (data.matterId) {
      const authorized = await canAccessMatter(user.id, user.role, data.matterId);
      if (!authorized) {
        return NextResponse.json(
          { error: 'Matter access denied', message: 'You are not authorized to book for this matter.' },
          { status: 403 }
        );
      }
    }

    // ── 3. Create booking inside a transaction (eliminates race condition) ─
    // The DB-level unique constraint on (advocateId, date, time) is the
    // authoritative guard. The pre-check below is an early fast-fail UX path.
    const existing = await prisma.booking.findFirst({
      where: {
        advocateId: advocate.id,
        date:       data.date,
        time:       data.time,
        status:     { in: ['CONFIRMED', 'PENDING'] },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:   'Slot unavailable',
          message: 'This time slot is already booked. Please choose another time.',
        },
        { status: 409 }
      );
    }

    const confirmationCode  = generateConfirmationCode();
    const consultationFee   = advocate.consultationFee || 999;
    const meetLink          = generateMeetLink(`${advocate.id}-${Date.now()}`);

    let booking;
    try {
      booking = await prisma.$transaction(async (tx) => {
        // Re-check inside the transaction for concurrent requests
        const conflict = await tx.booking.findFirst({
          where: {
            advocateId: advocate.id,
            date:       data.date,
            time:       data.time,
            status:     { in: ['CONFIRMED', 'PENDING'] },
          },
        });

        if (conflict) {
          throw new Error('SLOT_CONFLICT');
        }

        return tx.booking.create({
          data: {
            userId:           user.id,
            advocateId:       advocate.id,
            matterId:         data.matterId ?? null,
            date:             data.date,
            time:             data.time,
            duration:         data.duration,
            consultationType: data.consultationType,
            status:           'CONFIRMED',
            meetLink,
            userNotes:        data.userNotes ?? null,
            consultationFee,
            paymentStatus:    'PENDING',
            confirmationCode,
            userEmailSent:    false,
            lawyerEmailSent:  false,
          },
          include: { advocate: true, user: true, matter: true },
        });
      });
    } catch (txErr: any) {
      if (txErr?.message === 'SLOT_CONFLICT') {
        return NextResponse.json(
          {
            error:   'Slot unavailable',
            message: 'This time slot was just booked by another user. Please choose another time.',
          },
          { status: 409 }
        );
      }
      throw txErr;
    }

    // ── 4. Audit log ──────────────────────────────────────────────────────
    await logAuditEvent({
      action:       'CONSULTATION_BOOKED',
      userId:       user.id,
      resourceId:   booking.id,
      resourceType: 'BOOKING',
      metadata: {
        confirmationCode,
        advocateId: advocate.id,
        date:       data.date,
        time:       data.time,
      },
    });

    // ── 5. Send confirmation emails (fire-and-forget) ─────────────────────
    const emailData = {
      bookingId:             booking.id,
      confirmationCode,
      userName:              user.name || user.email,
      userEmail:             user.email,
      lawyerName:            advocate.name,
      lawyerEmail:           advocate.email || '',
      lawyerSpecialization:  advocate.specialization || 'Legal Consultant',
      date:                  data.date,
      time:                  data.time,
      duration:              data.duration,
      meetLink,
      consultationFee,
      userNotes:             data.userNotes || '',
      caseType:              booking.matter?.category || '',
    };

    sendUserBookingConfirmation(emailData)
      .then((sent) => {
        if (sent) {
          prisma.booking
            .update({ where: { id: booking.id }, data: { userEmailSent: true } })
            .catch(console.error);
        }
      })
      .catch((err) => console.error('[Booking] User email dispatch error:', err));

    if (advocate.email) {
      sendLawyerBookingNotification(emailData)
        .then((sent) => {
          if (sent) {
            prisma.booking
              .update({ where: { id: booking.id }, data: { lawyerEmailSent: true } })
              .catch(console.error);
          }
        })
        .catch((err) => console.error('[Booking] Lawyer email dispatch error:', err));
    }

    return NextResponse.json(
      {
        success: true,
        booking: {
          id:               booking.id,
          confirmationCode,
          meetLink,
          date:             data.date,
          time:             data.time,
          advocateName:     advocate.name,
          consultationFee,
          status:           'CONFIRMED',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/bookings] error:', error);
    return internalErrorResponse('Failed to create booking.');
  }
}

// ── PATCH /api/bookings ───────────────────────────────────────
// Cancels or updates a booking. Verifies ownership before any mutation.
export async function PATCH(req: NextRequest) {
  const { user, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { bookingId, action, reason } = body;

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields', message: "Both 'bookingId' and 'action' are required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where:   { id: bookingId },
      include: { advocate: true, user: true },
    });

    if (!booking) {
      return notFoundResponse('Booking');
    }

    // Authorization: must be booking owner, the advocate, or an admin
    const isAuthorized =
      isAdmin(user.role) ||
      booking.userId               === user.id ||
      booking.advocate.userId      === user.id;

    if (!isAuthorized) {
      return forbiddenResponse('You are not authorized to modify this booking.');
    }

    if (action === 'CANCEL') {
      if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
        return NextResponse.json(
          { error: 'Invalid action', message: `Booking is already ${booking.status.toLowerCase()}.` },
          { status: 409 }
        );
      }

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status:      'CANCELLED',
          cancelReason: reason || 'Cancelled by user',
          cancelledAt:  new Date(),
          cancelledBy:  user.id,
        },
      });

      await logAuditEvent({
        action:       'CONSULTATION_BOOKED', // repurpose until BOOKING_CANCELLED is added
        userId:       user.id,
        resourceId:   bookingId,
        resourceType: 'BOOKING',
        metadata:     { action: 'CANCEL', reason },
      });

      // Send cancellation email (fire-and-forget)
      try {
        const { sendCancellationEmail } = await import('@/lib/email');
        await sendCancellationEmail(
          {
            bookingId:            booking.id,
            confirmationCode:     booking.confirmationCode,
            userName:             booking.user.name || 'User',
            userEmail:            booking.user.email,
            lawyerName:           booking.advocate.name,
            lawyerEmail:          booking.advocate.email || '',
            lawyerSpecialization: booking.advocate.specialization || '',
            date:                 booking.date,
            time:                 booking.time,
            duration:             booking.duration,
            meetLink:             booking.meetLink || '',
            consultationFee:      booking.consultationFee,
          },
          'user',
          reason
        );
      } catch (emailErr) {
        console.error('[Booking] Cancellation email error:', emailErr);
      }

      return NextResponse.json({ success: true, message: 'Booking cancelled.' });
    }

    return NextResponse.json(
      { error: 'Unknown action', message: `Unsupported action: '${action}'.` },
      { status: 400 }
    );
  } catch (error) {
    console.error('[PATCH /api/bookings] error:', error);
    return internalErrorResponse('Failed to update booking.');
  }
}
