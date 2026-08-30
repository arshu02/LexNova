import { NextRequest, NextResponse } from 'next/server';
import { sendUserBookingConfirmation } from '@/lib/email';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || 'hnlragnar01@gmail.com';
    const rawKey = process.env.RESEND_API_KEY || '';

    if (!rawKey || rawKey === 're_your_key_here' || !rawKey.startsWith('re_')) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY is not set or is still the placeholder "re_your_key_here". Please update RESEND_API_KEY in .env.local and .env.',
        currentKey: rawKey ? `${rawKey.slice(0, 5)}...` : 'not_set',
      }, { status: 400 });
    }

    const testData = {
      bookingId: 'test_booking_123',
      confirmationCode: 'LN-2026-6808',
      userName: 'Ragnar Lothbrok',
      userEmail: email,
      lawyerName: 'Advocate Rajesh Sharma',
      lawyerEmail: 'rajesh.sharma@lexnova.in',
      lawyerSpecialization: 'Labour & Employment Counsel',
      date: '2026-08-27',
      time: '12:00 PM',
      duration: 60,
      meetLink: 'https://meet.jit.si/lexnova-test-booking-123',
      consultationFee: 1499,
      userNotes: 'Employment contract review and legal roadmap strategy.',
      caseType: 'Labour Dispute',
    };

    const resend = new Resend(rawKey);
    const from = process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('lexnova.in')
      ? process.env.EMAIL_FROM
      : 'LexNova <onboarding@resend.dev>';

    const result = await resend.emails.send({
      from,
      to: email,
      subject: `✅ Booking Confirmed: Advocate Rajesh Sharma on Thursday, 27 August 2026 — LN-2026-6808`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; color: #1E293B;">
          <div style="background: #080808; padding: 36px 32px; text-align: center; border-bottom: 1px solid #222;">
            <div style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">⚖️ LexNova</div>
            <div style="font-size: 11px; color: #94A3B8; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Legal OS · Verified Consultation</div>
            <div style="display: inline-block; background: #10B981; color: #ffffff; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; margin-top: 14px;">✓ Booking Confirmed</div>
          </div>
          
          <div style="padding: 32px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0;">Hello, Ragnar Lothbrok!</h2>
            <p style="font-size: 14px; color: #64748B; margin: 0 0 24px 0; line-height: 1.6;">
              Your 1-on-1 legal strategy consultation has been locked with <strong>Advocate Rajesh Sharma</strong>.
            </p>

            <div style="background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Confirmation Code</div>
              <div style="font-size: 28px; font-weight: 700; font-family: monospace; color: #0F172A; letter-spacing: 4px; margin-top: 4px;">LN-2026-6808</div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px 20px; margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">📅 Session Details</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 8px 0; color: #64748B;">Date & Time</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #0F172A; text-align: right;">Thursday, 27 Aug 2026 @ 12:00 PM IST</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 8px 0; color: #64748B;">Advocate</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #0F172A; text-align: right;">Advocate Rajesh Sharma</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 8px 0; color: #64748B;">Specialization</td>
                  <td style="padding: 8px 0; font-weight: 500; color: #2563EB; text-align: right;">Labour & Employment Counsel</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748B;">Consultation Fee</td>
                  <td style="padding: 8px 0; font-weight: 700; color: #10B981; text-align: right;">₹1,499</td>
                </tr>
              </table>
            </div>

            <div style="background: #0F172A; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">🎥 Join Encrypted HD Video Consultation</div>
              <div style="font-size: 12px; color: #94A3B8; margin-bottom: 16px;">Direct camera & microphone encrypted link</div>
              <a href="https://meet.jit.si/lexnova-test-booking-123" style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
                Join Video Call →
              </a>
              <div style="font-size: 11px; color: #60A5FA; margin-top: 10px; word-break: break-all; font-family: monospace;">
                https://meet.jit.si/lexnova-test-booking-123
              </div>
            </div>

            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 14px 16px; font-size: 12px; color: #92400E; line-height: 1.5;">
              <strong>📋 Preparation Tips:</strong><br/>
              • Have relevant employment agreements and bank statements ready.<br/>
              • Join 2–3 minutes early to check audio and video.<br/>
              • A quiet, private room is recommended for confidential legal discussion.
            </div>
          </div>

          <div style="background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0;">
            LexNova Technologies · Bar Council Verified Legal Consultations<br/>
            This is an automated confirmation email.
          </div>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      recipient: email,
      message: `Confirmation email dispatched successfully to ${email}`,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to dispatch email',
    }, { status: 500 });
  }
}
