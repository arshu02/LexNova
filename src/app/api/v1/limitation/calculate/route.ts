import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/api-auth';
import { differenceInDays, addDays, addMonths, addYears } from 'date-fns';

const LIMITATION_RULES: Record<
  string,
  { years?: number; months?: number; days?: number; statute: string; article: string }
> = {
  CHEQUE_BOUNCE: {
    days: 30,
    statute: 'Negotiable Instruments Act 1881',
    article: 'Section 138 / Section 142(b) (from receipt of demand notice)',
  },
  SECURITY_DEPOSIT: {
    years: 3,
    statute: 'Limitation Act 1963',
    article: 'Article 62 / Transfer of Property Act §108(B)(q)',
  },
  CONSUMER_COMPLAINT: {
    years: 2,
    statute: 'Consumer Protection Act 2019',
    article: 'Section 69 (from date of cause of action)',
  },
  COMMERCIAL_CONTRACT: {
    years: 3,
    statute: 'Limitation Act 1963',
    article: 'Article 55 (Breach of contract)',
  },
  LABOUR_WRONGFUL_TERMINATION: {
    years: 3,
    statute: 'Industrial Disputes Act 1947',
    article: 'Section 2A (from date of termination)',
  },
  DEFAMATION_CIVIL: {
    years: 1,
    statute: 'Limitation Act 1963',
    article: 'Article 75 (Libel/Slander from publication)',
  },
  PROPERTY_POSSESSION: {
    years: 12,
    statute: 'Limitation Act 1963',
    article: 'Article 65 (Adverse possession)',
  },
};

export async function POST(req: NextRequest) {
  const { org, errorResponse } = await authenticateApiKey(req);
  if (errorResponse || !org) return errorResponse;

  try {
    const body = await req.json();
    const { caseType, incidentDate } = body;

    if (!caseType || !incidentDate) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Both "caseType" and "incidentDate" (YYYY-MM-DD) are required.',
          supportedCaseTypes: Object.keys(LIMITATION_RULES),
        },
        { status: 400 }
      );
    }

    const start = new Date(incidentDate);
    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid "incidentDate" format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    const rule = LIMITATION_RULES[caseType.toUpperCase()] || {
      years: 3,
      statute: 'Limitation Act 1963',
      article: 'Article 113 (Residual suits)',
    };

    let deadline = start;
    if (rule.years) deadline = addYears(deadline, rule.years);
    if (rule.months) deadline = addMonths(deadline, rule.months);
    if (rule.days) deadline = addDays(deadline, rule.days);

    const now = new Date();
    const daysRemaining = differenceInDays(deadline, now);
    const isExpired = daysRemaining < 0;

    return NextResponse.json({
      caseType,
      incidentDate,
      filingDeadline: deadline.toISOString().split('T')[0],
      daysRemaining: Math.max(0, daysRemaining),
      isExpired,
      statute: rule.statute,
      legalBasis: rule.article,
      riskLevel: isExpired ? 'EXPIRED' : daysRemaining < 30 ? 'CRITICAL' : daysRemaining < 90 ? 'HIGH' : 'NORMAL',
      recommendation: isExpired
        ? 'Statutory limitation has elapsed. File Section 5 Condonation of Delay application with sufficient cause.'
        : daysRemaining < 30
        ? 'IMMEDIATE ACTION REQUIRED: Draft demand notice / petition within 7 days to preserve limitation.'
        : 'Action recommended within upcoming quarter.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'Calculation failed.' },
      { status: 500 }
    );
  }
}
