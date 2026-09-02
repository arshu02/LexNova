import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/redis';
import { generateLegalNoticeHTML } from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id || session.user.email || 'user';
    const rl = await rateLimit(`pdfexport:${userId}`, 15, 60);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      noticeRef = `LN-NOT-${Date.now().toString().slice(-6)}`,
      date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      senderName = 'Complainant',
      senderAddress = 'India',
      advocateName = 'Advocate on Record',
      advocateBarNumber = 'BCI/IND/2026',
      recipientName = 'Respondent / Opposite Party',
      recipientAddress = 'India',
      subject = 'Legal Demand Notice for Unlawful Withholding & Breach of Obligations',
      bodyParagraphs = [],
      demandAmount,
      complianceDays = 15,
    } = body;

    const html = generateLegalNoticeHTML({
      noticeRef,
      date,
      senderName,
      senderAddress,
      advocateName,
      advocateBarNumber,
      recipientName,
      recipientAddress,
      subject,
      bodyParagraphs: bodyParagraphs.length > 0 ? bodyParagraphs : [
        'That my client is a law-abiding citizen residing at the address provided hereinabove.',
        'That a formal transaction was entered into between my client and you, the recipient, whereby certain statutory and contractual obligations were created.',
        'That despite repeated requests and written reminders, you have willfully failed and neglected to discharge your lawful obligations towards my client.',
        'That your deliberate inaction has caused severe financial injury, distress, and mental harassment to my client.',
      ],
      demandAmount,
      complianceDays,
    });

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="legal-notice-${noticeRef}.html"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
