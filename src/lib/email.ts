import { Resend } from 'resend';

const rawKey = process.env.RESEND_API_KEY || '';
const isValidKey = rawKey && rawKey !== 're_your_key_here' && rawKey.startsWith('re_');
const resend = isValidKey ? new Resend(rawKey) : new Resend('re_placeholder');

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('lexnova.in')
  ? process.env.EMAIL_FROM
  : 'LexNova <onboarding@resend.dev>';

// ── Types ──────────────────────────────────────────
interface BookingEmailData {
  bookingId: string;
  confirmationCode: string;
  userName: string;
  userEmail: string;
  lawyerName: string;
  lawyerEmail: string;
  lawyerSpecialization: string;
  date: string;
  time: string;
  duration: number;
  meetLink: string;
  consultationFee: number;
  userNotes?: string;
  caseType?: string;
}

// ── Helper: format date nicely ─────────────────────
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ── USER CONFIRMATION EMAIL ────────────────────────
export async function sendUserBookingConfirmation(
  data: BookingEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed — LexNova</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
           sans-serif; background: #F8FAFC; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; 
                 border-radius: 12px; overflow: hidden; 
                 box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%); 
              padding: 40px 32px; text-align: center; }
    .header-logo { font-size: 24px; font-weight: 700; color: white; 
                   letter-spacing: -0.5px; }
    .header-tag { font-size: 12px; color: #93C5FD; 
                  letter-spacing: 2px; margin-top: 4px; }
    .badge { display: inline-block; background: #10B981; color: white; 
             font-size: 13px; font-weight: 600; padding: 6px 16px; 
             border-radius: 20px; margin-top: 16px; }
    .body { padding: 32px; }
    .greeting { font-size: 22px; font-weight: 600; color: #1E293B; 
                margin-bottom: 8px; }
    .subtext { font-size: 15px; color: #64748B; margin-bottom: 28px; 
               line-height: 1.6; }
    .conf-box { background: #EFF6FF; border: 1.5px solid #BFDBFE; 
                border-radius: 10px; padding: 16px 20px; 
                margin-bottom: 24px; text-align: center; }
    .conf-label { font-size: 11px; color: #3B82F6; font-weight: 600; 
                  letter-spacing: 1px; text-transform: uppercase; }
    .conf-code { font-size: 28px; font-weight: 700; color: #1D4ED8; 
                 letter-spacing: 4px; margin-top: 4px; }
    .detail-card { background: #F8FAFC; border: 1px solid #E2E8F0; 
                   border-radius: 10px; padding: 20px; 
                   margin-bottom: 20px; }
    .detail-title { font-size: 13px; font-weight: 600; color: #64748B; 
                    text-transform: uppercase; letter-spacing: 0.5px; 
                    margin-bottom: 14px; }
    .detail-row { display: flex; justify-content: space-between; 
                  align-items: center; padding: 8px 0; 
                  border-bottom: 1px solid #E2E8F0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-key { font-size: 14px; color: #64748B; }
    .detail-val { font-size: 14px; font-weight: 500; color: #1E293B; 
                  text-align: right; }
    .meet-box { background: #1E3A5F; border-radius: 10px; 
                padding: 20px; margin-bottom: 20px; text-align: center; }
    .meet-title { font-size: 15px; font-weight: 600; color: white; 
                  margin-bottom: 8px; }
    .meet-sub { font-size: 13px; color: #93C5FD; margin-bottom: 14px; }
    .meet-btn { display: inline-block; background: #3B82F6; color: white; 
                text-decoration: none; font-size: 14px; font-weight: 600; 
                padding: 12px 28px; border-radius: 8px; }
    .meet-link { font-size: 11px; color: #93C5FD; margin-top: 8px; 
                 word-break: break-all; }
    .tips-box { background: #FFFBEB; border: 1px solid #FDE68A; 
                border-radius: 10px; padding: 16px 20px; 
                margin-bottom: 20px; }
    .tips-title { font-size: 13px; font-weight: 600; color: #92400E; 
                  margin-bottom: 10px; }
    .tip { font-size: 13px; color: #78350F; padding: 3px 0; }
    .cancel-link { text-align: center; margin-bottom: 20px; }
    .cancel-link a { font-size: 13px; color: #94A3B8; }
    .footer { background: #F1F5F9; padding: 20px 32px; text-align: center; }
    .footer-text { font-size: 12px; color: #94A3B8; line-height: 1.6; }
    .footer-disclaimer { font-size: 11px; color: #CBD5E1; 
                         margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Header -->
    <div class="header">
      <div class="header-logo">⚖️ LexNova</div>
      <div class="header-tag">LEGAL OS · AI-POWERED</div>
      <div class="badge">✓ Booking Confirmed</div>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Hello, ${data.userName}!</div>
      <div class="subtext">
        Your consultation has been confirmed. Please save the 
        details below and keep this email for your records.
      </div>

      <!-- Confirmation Code -->
      <div class="conf-box">
        <div class="conf-label">Confirmation Code</div>
        <div class="conf-code">${data.confirmationCode}</div>
      </div>

      <!-- Appointment Details -->
      <div class="detail-card">
        <div class="detail-title">📅 Appointment Details</div>
        <div class="detail-row">
          <span class="detail-key">Date</span>
          <span class="detail-val">${formatDate(data.date)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Time</span>
          <span class="detail-val">${data.time} IST</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Duration</span>
          <span class="detail-val">${data.duration} minutes</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Format</span>
          <span class="detail-val">Video Consultation</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Consultation Fee</span>
          <span class="detail-val">₹${data.consultationFee}</span>
        </div>
      </div>

      <!-- Lawyer Details -->
      <div class="detail-card">
        <div class="detail-title">👨‍⚖️ Your Advocate</div>
        <div class="detail-row">
          <span class="detail-key">Name</span>
          <span class="detail-val">${data.lawyerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Specialization</span>
          <span class="detail-val">${data.lawyerSpecialization}</span>
        </div>
        ${data.caseType ? `
        <div class="detail-row">
          <span class="detail-key">Your Case Type</span>
          <span class="detail-val">${data.caseType}</span>
        </div>` : ''}
      </div>

      <!-- Video Call Box -->
      <div class="meet-box">
        <div class="meet-title">🎥 Join Your Video Consultation</div>
        <div class="meet-sub">
          Click the button below at your appointment time
        </div>
        <a href="${data.meetLink}" class="meet-btn">
          Join Video Call →
        </a>
        <div class="meet-link">${data.meetLink}</div>
      </div>

      <!-- Preparation Tips -->
      <div class="tips-box">
        <div class="tips-title">📋 How to Prepare</div>
        <div class="tip">✓ Gather all relevant documents (agreements, receipts, notices)</div>
        <div class="tip">✓ Write down a brief timeline of events</div>
        <div class="tip">✓ List your specific questions for the lawyer</div>
        <div class="tip">✓ Join 5 minutes early to test your camera/mic</div>
        <div class="tip">✓ Find a quiet, private space for the call</div>
      </div>

      ${data.userNotes ? `
      <div class="detail-card">
        <div class="detail-title">📝 Your Case Brief</div>
        <div style="font-size:14px;color:#475569;line-height:1.6">
          ${data.userNotes}
        </div>
      </div>` : ''}

      <!-- Cancel link -->
      <div class="cancel-link">
        <a href="${APP_URL}/dashboard/bookings">
          Manage or cancel this booking →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        LexNova Legal OS · India's AI-Powered Legal Platform<br>
        Questions? Reply to this email or visit 
        <a href="${APP_URL}" style="color:#64748B">lexnova.in</a>
      </div>
      <div class="footer-disclaimer">
        This email is legal information only — not legal advice. 
        LexNova facilitates connections between users and advocates.
        Advocates are independent professionals.
      </div>
    </div>

  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: data.userEmail,
      subject: `✅ Booking Confirmed: ${data.lawyerName} on ${formatDate(data.date)} — ${data.confirmationCode}`,
      html,
    });
    if (error) {
      console.error('Resend user email error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

// ── LAWYER NOTIFICATION EMAIL ──────────────────────
export async function sendLawyerBookingNotification(
  data: BookingEmailData
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
           sans-serif; background: #F8FAFC; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; 
                 border-radius: 12px; overflow: hidden; 
                 box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #064E3B 0%, #059669 100%); 
              padding: 32px; text-align: center; }
    .header-title { font-size: 20px; font-weight: 700; color: white; }
    .header-sub { font-size: 13px; color: #A7F3D0; margin-top: 4px; }
    .body { padding: 28px 32px; }
    .greeting { font-size: 20px; font-weight: 600; color: #1E293B; 
                margin-bottom: 6px; }
    .sub { font-size: 14px; color: #64748B; margin-bottom: 24px; }
    .card { background: #F0FDF4; border: 1px solid #BBF7D0; 
            border-radius: 10px; padding: 18px 20px; margin-bottom: 18px; }
    .card-title { font-size: 12px; font-weight: 600; color: #065F46; 
                  text-transform: uppercase; letter-spacing: 0.5px; 
                  margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; 
           padding: 7px 0; border-bottom: 1px solid #D1FAE5; }
    .row:last-child { border-bottom: none; }
    .key { font-size: 14px; color: #6B7280; }
    .val { font-size: 14px; font-weight: 500; color: #1E293B; }
    .meet-btn { display: block; background: #059669; color: white; 
                text-decoration: none; text-align: center; font-size: 15px; 
                font-weight: 600; padding: 14px; border-radius: 8px; 
                margin: 20px 0; }
    .brief { background: #F8FAFC; border: 1px solid #E2E8F0; 
             border-radius: 8px; padding: 14px; font-size: 14px; 
             color: #475569; line-height: 1.6; margin-bottom: 18px; }
    .action-box { background: #FFFBEB; border: 1px solid #FDE68A; 
                  border-radius: 8px; padding: 14px; margin-bottom: 18px; }
    .action-title { font-size: 13px; font-weight: 600; color: #92400E; 
                    margin-bottom: 8px; }
    .action { font-size: 13px; color: #78350F; padding: 2px 0; }
    .footer { background: #F1F5F9; padding: 18px 32px; text-align: center; }
    .footer-text { font-size: 12px; color: #94A3B8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-title">⚖️ New Consultation Booked</div>
      <div class="header-sub">LexNova Advocate Dashboard</div>
    </div>
    <div class="body">
      <div class="greeting">Hello, ${data.lawyerName}</div>
      <div class="sub">
        A client has booked a consultation with you. 
        Please review the details below.
      </div>

      <div class="card">
        <div class="card-title">📅 Appointment Details</div>
        <div class="row">
          <span class="key">Date</span>
          <span class="val">${formatDate(data.date)}</span>
        </div>
        <div class="row">
          <span class="key">Time</span>
          <span class="val">${data.time} IST</span>
        </div>
        <div class="row">
          <span class="key">Duration</span>
          <span class="val">${data.duration} minutes</span>
        </div>
        <div class="row">
          <span class="key">Confirmation</span>
          <span class="val">${data.confirmationCode}</span>
        </div>
        <div class="row">
          <span class="key">Fee</span>
          <span class="val">₹${data.consultationFee}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">👤 Client Details</div>
        <div class="row">
          <span class="key">Name</span>
          <span class="val">${data.userName}</span>
        </div>
        <div class="row">
          <span class="key">Email</span>
          <span class="val">${data.userEmail}</span>
        </div>
        ${data.caseType ? `
        <div class="row">
          <span class="key">Case Type</span>
          <span class="val">${data.caseType}</span>
        </div>` : ''}
      </div>

      ${data.userNotes ? `
      <div class="brief">
        <strong>Client's Brief:</strong><br>${data.userNotes}
      </div>` : ''}

      <a href="${data.meetLink}" class="meet-btn">
        🎥 Join Video Call at ${data.time}
      </a>

      <div class="action-box">
        <div class="action-title">📋 Before the Call</div>
        <div class="action">✓ Review the client's case brief above</div>
        <div class="action">✓ Check the LexNova dashboard for uploaded documents</div>
        <div class="action">✓ Test your camera and microphone</div>
        <div class="action">✓ Join 2–3 minutes early</div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-text">
        LexNova Advocate Network · 
        <a href="${APP_URL}/lawyer/dashboard" 
           style="color:#64748B">Open Dashboard</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: data.lawyerEmail,
      subject: `📅 New Booking: ${data.userName} on ${formatDate(data.date)} at ${data.time}`,
      html,
    });
    if (error) {
      // Free tier sandbox only permits sending to verified account email
      if ((error as any).statusCode === 403) {
        console.log(`ℹ️ [Resend Free Tier]: Lawyer notification to ${data.lawyerEmail} skipped (verify domain at resend.com to enable multi-recipient delivery).`);
      } else {
        console.error('Resend lawyer email error:', error);
      }
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

// ── REMINDER EMAIL (24 hrs before) ────────────────
export async function sendBookingReminder(
  data: BookingEmailData,
  recipientEmail: string,
  recipientName: string
): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: recipientEmail,
      subject: `⏰ Reminder: Consultation Tomorrow at ${data.time} — ${data.confirmationCode}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:40px auto;
                    background:#fff;border-radius:12px;overflow:hidden;
                    border:1px solid #E2E8F0">
          <div style="background:#1E3A5F;padding:24px;text-align:center">
            <div style="font-size:18px;font-weight:700;color:white">
              ⏰ Consultation Reminder
            </div>
          </div>
          <div style="padding:24px">
            <p style="font-size:16px;color:#1E293B">
              Hello <strong>${recipientName}</strong>,
            </p>
            <p style="font-size:14px;color:#64748B">
              This is a reminder that your consultation is scheduled 
              for <strong>tomorrow</strong>.
            </p>
            <div style="background:#EFF6FF;border-radius:8px;
                        padding:16px;margin:16px 0">
              <div style="font-size:14px;color:#1E293B">
                📅 <strong>${formatDate(data.date)}</strong> 
                at <strong>${data.time} IST</strong>
              </div>
              <div style="font-size:13px;color:#3B82F6;margin-top:4px">
                With ${data.lawyerName} · ${data.lawyerSpecialization}
              </div>
            </div>
            <a href="${data.meetLink}" 
               style="display:block;background:#2563EB;color:white;
                      text-align:center;text-decoration:none;
                      font-weight:600;padding:12px;border-radius:8px;
                      margin:16px 0">
              🎥 Join Video Call →
            </a>
            <p style="font-size:12px;color:#94A3B8;text-align:center">
              Confirmation: ${data.confirmationCode}
            </p>
          </div>
        </div>
      `,
    });
    return !error;
  } catch {
    return false;
  }
}

// ── CANCELLATION EMAIL ─────────────────────────────
export async function sendCancellationEmail(
  data: BookingEmailData,
  cancelledBy: string,
  reason?: string
): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: data.userEmail,
      subject: `❌ Booking Cancelled — ${data.confirmationCode}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:40px auto;
                    background:#fff;border-radius:12px;overflow:hidden;
                    border:1px solid #E2E8F0">
          <div style="background:#DC2626;padding:24px;text-align:center">
            <div style="font-size:18px;font-weight:700;color:white">
              Booking Cancelled
            </div>
          </div>
          <div style="padding:24px">
            <p style="font-size:15px;color:#1E293B">
              Hello <strong>${data.userName}</strong>,
            </p>
            <p style="font-size:14px;color:#64748B">
              Your consultation with <strong>${data.lawyerName}</strong> 
              on ${formatDate(data.date)} at ${data.time} has been cancelled
              ${cancelledBy === 'lawyer' ? 'by the advocate' : ''}.
            </p>
            ${reason ? `
            <div style="background:#FEF2F2;border-radius:8px;padding:14px;
                        font-size:13px;color:#991B1B;margin:16px 0">
              Reason: ${reason}
            </div>` : ''}
            <a href="${APP_URL}/dashboard/advocates" 
               style="display:block;background:#2563EB;color:white;
                      text-align:center;text-decoration:none;
                      font-weight:600;padding:12px;border-radius:8px;
                      margin:20px 0">
              Book Another Consultation →
            </a>
            <p style="font-size:12px;color:#94A3B8;text-align:center">
              Booking ref: ${data.confirmationCode}
            </p>
          </div>
        </div>
      `,
    });
    return !error;
  } catch {
    return false;
  }
}
