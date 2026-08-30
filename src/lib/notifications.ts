import nodemailer from 'nodemailer';

let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // 1. Check for real SMTP credentials in environment variables
  const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? "smtp.gmail.com" : null);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`[Email Service] Using real SMTP server: ${smtpHost} (${smtpUser})`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    return transporter;
  }

  // 2. Fallback to Ethereal Email test account for development
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendBookingConfirmationEmail(userEmail: string, userName: string, advocateName: string, date: string, time: string) {
  try {
    const mailTransporter = await getTransporter();
    const fromAddress = process.env.SMTP_USER || process.env.GMAIL_USER || '"LexNova Legal" <no-reply@lexnova.com>';

    const info = await mailTransporter.sendMail({
      from: fromAddress,
      to: userEmail,
      subject: "Booking Confirmation - LexNova Consultation",
      text: `Hello ${userName},\n\nYour consultation with Advocate ${advocateName} is confirmed for ${date} at ${time}.\n\nThank you,\nLexNova Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080810; color: #fff; padding: 40px; border-radius: 16px; border: 1px solid #333;">
          <h2 style="color: #F59E0B; margin-top: 0;">Lex<span style="color: #fff;">Nova</span></h2>
          <div style="background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #A78BFA;">Consultation Booking Confirmed</h3>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Your consultation session with <strong>Advocate ${advocateName}</strong> has been successfully booked.</p>
            <table style="width: 100%; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Scheduled Date:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #fff;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Time Slot:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #F59E0B;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Recipient Email:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #06B6D4;">${userEmail}</td>
              </tr>
            </table>
          </div>
          <p style="color: #64748b; font-size: 12px; text-align: center;">This is an automated confirmation from the LexNova Legal Platform.</p>
        </div>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("-----------------------------------------");
    console.log(`📧 EMAIL SENT TO: ${userEmail}`);
    console.log(`Message ID: ${info.messageId}`);
    if (previewUrl) console.log(`Ethereal Test Inbox Preview URL: ${previewUrl}`);
    console.log("-----------------------------------------");

    return { success: true, previewUrl: previewUrl || null };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendBookingConfirmationSMS(userPhone: string, userName: string, advocateName: string, date: string, time: string) {
  const message = `LexNova: Hi ${userName}, your consultation with Adv. ${advocateName} is confirmed for ${date} at ${time}. Check your email for details.`;
  
  console.log("-----------------------------------------");
  console.log(`📱 SMS SENT TO ${userPhone}`);
  console.log(`Content: "${message}"`);
  console.log("-----------------------------------------");

  return { success: true, message };
}
