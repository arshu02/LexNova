import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// ── Email transporter ────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_FROM,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
    },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { caseId, opposingPartyEmail } = body as {
      caseId?: string;
      opposingPartyEmail?: string;
    };

    if (!caseId || !opposingPartyEmail) {
      return NextResponse.json(
        { error: "caseId and opposingPartyEmail are required" },
        { status: 400 }
      );
    }

    // ── Verify the caller owns the matter ─────────────────────────────────
    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const matter = await prisma.matter.findFirst({
      where: { id: caseId, userId: caller?.id },
      include: { user: true },
    });

    if (!matter) {
      return NextResponse.json(
        { error: "Matter not found or access denied" },
        { status: 404 }
      );
    }

    // ── Generate & persist invite token ───────────────────────────────────
    const inviteToken = crypto.randomUUID();

    await prisma.matter.update({
      where: { id: caseId },
      data: {
        caseInviteToken: inviteToken,
        opposingPartyEmail: opposingPartyEmail,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/join-case/${inviteToken}`;

    // ── Send invite email ─────────────────────────────────────────────────
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: `"LexNova Legal Platform" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to: opposingPartyEmail,
        subject: `You have been named as a Respondent — ${matter.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
              .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #7C3AED, #F59E0B); padding: 32px 40px; text-align: center; }
              .header h1 { color: white; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
              .header p { color: rgba(255,255,255,0.8); font-size: 13px; margin: 8px 0 0 0; }
              .body { padding: 36px 40px; }
              .notice-box { background: #fef3cd; border-left: 4px solid #F59E0B; border-radius: 6px; padding: 14px 18px; margin-bottom: 28px; }
              .notice-box p { margin: 0; font-size: 14px; color: #92400e; font-weight: 600; }
              h2 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 0 0 12px 0; }
              p { font-size: 14px; color: #4a4a6a; line-height: 1.7; margin: 0 0 16px 0; }
              .cta { text-align: center; margin: 32px 0; }
              .btn { display: inline-block; background: linear-gradient(135deg, #7C3AED, #8B5CF6); color: white !important; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 8px; letter-spacing: 0.3px; }
              .link-box { background: #f8f8fc; border: 1px solid #e2e2f0; border-radius: 6px; padding: 12px 16px; margin: 20px 0; }
              .link-box code { font-size: 12px; color: #7C3AED; word-break: break-all; }
              .footer { background: #f8f8fc; padding: 20px 40px; text-align: center; }
              .footer p { font-size: 11px; color: #9a9aaa; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚖️ LexNova</h1>
                <p>India's AI-Powered Legal Platform</p>
              </div>
              <div class="body">
                <div class="notice-box">
                  <p>⚠️ You have been named as a Respondent in a legal matter filed on LexNova.</p>
                </div>
                <h2>Legal Notice of Case Filing</h2>
                <p>
                  You are receiving this email because you have been identified as the opposing party in 
                  a legal matter titled <strong>"${matter.title}"</strong> filed through the LexNova legal platform.
                </p>
                <p>
                  You have the right to respond to this matter. Click the button below to view the case 
                  details and choose how you wish to proceed — either by creating a free account to respond 
                  directly or by having your lawyer join on your behalf.
                </p>
                <div class="cta">
                  <a href="${inviteLink}" class="btn">View Case & Respond</a>
                </div>
                <p style="font-size:12px; color:#888;">Or copy and paste this link into your browser:</p>
                <div class="link-box">
                  <code>${inviteLink}</code>
                </div>
                <p style="font-size:12px; color:#aaa; margin-top:24px;">
                  This invitation link is unique to you. Do not share it with others. 
                  If you believe this was sent in error, you may safely ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>LexNova Legal Platform · India · <a href="https://lexnova.in" style="color:#7C3AED;">lexnova.in</a></p>
                <p style="margin-top:4px;">This is an automated legal notification. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
You have been named as a Respondent in the legal matter: "${matter.title}".

Click the link below to view case details and respond:
${inviteLink}

If you believe this was sent in error, you may ignore this email.

— LexNova Legal Platform
        `.trim(),
      });
    } catch (emailErr) {
      // Log but do not fail the request — token is already saved
      console.error("Failed to send invite email:", emailErr);
    }

    return NextResponse.json(
      { success: true, inviteLink },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending case invite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
