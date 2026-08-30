import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  sendUserBookingConfirmation,
  sendLawyerBookingNotification 
} from '@/lib/email';

// ── Generate confirmation code ─────────────────────
function generateConfirmationCode(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LN-${year}-${random}`;
}

// ── Generate Jitsi meet link ───────────────────────
function generateMeetLink(bookingId: string): string {
  const roomName = `lexnova-${bookingId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
  return `https://meet.jit.si/${roomName}`;
}

// ── GET: Fetch bookings for user ───────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || 
                   req.nextUrl.searchParams.get('userId');

    if (!userId || userId === 'user_placeholder') {
      // If user is not logged in or no userId, return empty or filter by email if provided
      const email = session?.user?.email || req.nextUrl.searchParams.get('email');
      if (email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            include: { advocate: true, matter: true },
            orderBy: { createdAt: 'desc' },
          });
          return NextResponse.json(bookings);
        }
      }
      return NextResponse.json([]);
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        advocate: true,
        matter: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('GET bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' }, 
      { status: 500 }
    );
  }
}

// ── POST: Create new booking ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    const { 
      advocateId, 
      advocateName,
      advocateEmail,
      date, 
      time, 
      userNotes,
      userName: bodyUserName,
      userEmail: bodyUserEmail,
      matterId,
      consultationType = 'VIDEO',
      duration = 60
    } = body;

    // Resolve User: from session, body userId, or body email
    let user = null;
    const sessionUserId = (session?.user as any)?.id;
    const sessionUserEmail = session?.user?.email;

    if (sessionUserId) {
      user = await prisma.user.findUnique({ where: { id: sessionUserId } });
    }

    if (!user && body.userId && body.userId !== 'user_placeholder') {
      user = await prisma.user.findUnique({ where: { id: body.userId } });
    }

    const targetEmail = bodyUserEmail || sessionUserEmail || 'client@lexnova.in';
    const targetName = bodyUserName || session?.user?.name || 'Client';

    if (!user && targetEmail) {
      user = await prisma.user.findUnique({ where: { email: targetEmail } });
      if (!user) {
        // Create user on the fly for guest booking
        user = await prisma.user.create({
          data: {
            email: targetEmail,
            name: targetName,
            role: 'USER',
            passwordHash: 'guest_auth_hash',
          }
        });
      }
    }

    // Fallback default user if somehow still null
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'client@lexnova.in',
            name: 'Client',
            role: 'USER',
            passwordHash: 'guest_auth_hash',
          }
        });
      }
    }

    // Resolve Advocate: by ID, Name, or Email
    let advocate = null;
    if (advocateId && advocateId !== 'adv_1' && advocateId !== 'adv_2' && advocateId !== 'adv_3' && advocateId !== 'adv_4' && advocateId !== 'adv_5' && advocateId !== 'adv_6') {
      advocate = await prisma.advocate.findUnique({ where: { id: advocateId } });
    }

    if (!advocate && advocateName) {
      advocate = await prisma.advocate.findFirst({
        where: {
          name: { contains: advocateName.replace('Advocate ', '').trim() }
        }
      });
    }

    if (!advocate && advocateEmail) {
      advocate = await prisma.advocate.findFirst({
        where: { email: advocateEmail }
      });
    }

    if (!advocate) {
      // Find first available advocate in database
      advocate = await prisma.advocate.findFirst();
    }

    // If no advocate exists in database, create one
    if (!advocate) {
      const advUser = await prisma.user.create({
        data: {
          email: advocateEmail || 'priya.mehta@lexnova.in',
          name: advocateName || 'Advocate Priya Mehta',
          role: 'ADVOCATE',
          passwordHash: 'advocate_hash',
        }
      });

      advocate = await prisma.advocate.create({
        data: {
          userId: advUser.id,
          name: advocateName || 'Advocate Priya Mehta',
          email: advocateEmail || 'priya.mehta@lexnova.in',
          specialization: 'PROPERTY_DISPUTE',
          pricing: '₹999/session',
          consultationFee: 999,
          experienceYears: 9,
          city: 'Bengaluru',
          languages: 'Hindi, English',
          availability: 'Available Today',
          rating: 4.8,
          verified: true,
          isAvailable: true,
        }
      });
    }

    // Check for double booking (same advocate, same slot)
    const existing = await prisma.booking.findFirst({
      where: {
        advocateId: advocate.id,
        date,
        time,
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another.' },
        { status: 409 }
      );
    }

    // Generate codes
    const confirmationCode = generateConfirmationCode();
    const meetLink = generateMeetLink(
      `${advocate.id}-${Date.now()}`
    );
    const consultationFee = advocate.consultationFee || 999;

    // Get matter details if provided
    let matter = null;
    if (matterId) {
      matter = await prisma.matter.findUnique({
        where: { id: matterId }
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        advocateId: advocate.id,
        matterId: matterId || null,
        date,
        time,
        duration,
        consultationType,
        status: 'CONFIRMED',
        meetLink,
        userNotes: userNotes || null,
        consultationFee,
        paymentStatus: 'PENDING',
        confirmationCode,
        userEmailSent: false,
        lawyerEmailSent: false,
      },
      include: {
        advocate: true,
        user: true,
        matter: true,
      }
    });

    // ── Send emails via Resend ───────────────────────
    const emailData = {
      bookingId: booking.id,
      confirmationCode,
      userName: user.name || targetName || 'User',
      userEmail: user.email || targetEmail,
      lawyerName: advocate.name,
      lawyerEmail: advocate.email || 'advocate@lexnova.in',
      lawyerSpecialization: (advocate as any).type || advocate.specialization || 'Legal Consultant',
      date,
      time,
      duration,
      meetLink,
      consultationFee,
      userNotes: userNotes || '',
      caseType: matter?.category || '',
    };

    // Send user confirmation via Resend (fire and forget, log error without crashing)
    sendUserBookingConfirmation(emailData)
      .then(sent => {
        if (sent) {
          prisma.booking.update({
            where: { id: booking.id },
            data: { userEmailSent: true }
          }).catch(console.error);
        }
      })
      .catch(err => console.error('Resend user email dispatch error:', err));

    // Send lawyer notification via Resend
    if (advocate.email) {
      sendLawyerBookingNotification(emailData)
        .then(sent => {
          if (sent) {
            prisma.booking.update({
              where: { id: booking.id },
              data: { lawyerEmailSent: true }
            }).catch(console.error);
          }
        })
        .catch(err => console.error('Resend lawyer email dispatch error:', err));
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        confirmationCode,
        meetLink,
        date,
        time,
        advocateName: advocate.name,
        consultationFee,
        status: 'CONFIRMED'
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST booking error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// ── PATCH: Cancel or update booking ───────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, action, reason } = body;

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: 'Missing bookingId or action' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { advocate: true, user: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (action === 'CANCEL') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelReason: reason || 'Cancelled by user',
          cancelledAt: new Date(),
        }
      });

      // Send cancellation email
      try {
        const { sendCancellationEmail } = await import('@/lib/email');
        await sendCancellationEmail({
          bookingId: booking.id,
          confirmationCode: booking.confirmationCode,
          userName: booking.user.name || 'User',
          userEmail: booking.user.email,
          lawyerName: booking.advocate.name,
          lawyerEmail: booking.advocate.email || '',
          lawyerSpecialization: (booking.advocate as any).type || booking.advocate.specialization || '',
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          meetLink: booking.meetLink || '',
          consultationFee: booking.consultationFee,
        }, 'user', reason);
      } catch (err) {
        console.error('Cancellation email error:', err);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Booking cancelled' 
      });
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('PATCH booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
