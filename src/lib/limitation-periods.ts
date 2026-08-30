// ── Limitation period data for Indian law ────────────────────────────────────
// Days = null means no fixed period (but other rules apply)

export const LIMITATION_PERIODS: Record<
  string,
  {
    days: number | null;
    law: string;
    description: string;
  }
> = {
  CONSUMER_GRIEVANCE: {
    days: 730, // 2 years
    law: "Consumer Protection Act 2019, Section 69",
    description:
      "Consumer complaint must be filed within 2 years of cause of action",
  },
  LABOUR_DISPUTE: {
    days: 1095, // 3 years
    law: "Industrial Disputes Act 1947, Section 10",
    description: "Labour dispute reference within 3 years",
  },
  PROPERTY_DISPUTE: {
    days: 3650, // 10 years for possession
    law: "Limitation Act 1963, Article 65",
    description: "Suit for possession of immovable property — 12 years",
  },
  CHEQUE_BOUNCE: {
    days: 30, // 30 days from receiving bank memo
    law: "Negotiable Instruments Act 1881, Section 138",
    description:
      "CRITICAL: Legal notice must be sent within 30 days of cheque bounce",
  },
  CRIMINAL_CYBER: {
    days: 180,
    law: "Code of Criminal Procedure 1973, Section 468",
    description:
      "Cognizable offences — FIR should be filed promptly, no delay",
  },
  FAMILY_DIVORCE: {
    days: null, // No fixed period but cooling off applies
    law: "Hindu Marriage Act 1955, Section 13B",
    description:
      "6 month cooling off period after filing mutual divorce",
  },
  CORPORATE_CONTRACT: {
    days: 1095, // 3 years for contract breach
    law: "Limitation Act 1963, Article 55",
    description: "Suit for breach of contract — 3 years from breach date",
  },
};

// ── Helper: resolve category string to a LIMITATION_PERIODS key ──────────────
// Maps the AI classifier's category names onto our limitation keys.
const CATEGORY_MAP: Record<string, string> = {
  CONSUMER:    "CONSUMER_GRIEVANCE",
  LABOUR:      "LABOUR_DISPUTE",
  EMPLOYMENT:  "LABOUR_DISPUTE",
  PROPERTY:    "PROPERTY_DISPUTE",
  CHEQUE:      "CHEQUE_BOUNCE",
  NI_ACT:      "CHEQUE_BOUNCE",
  CYBER:       "CRIMINAL_CYBER",
  CRIMINAL:    "CRIMINAL_CYBER",
  FAMILY:      "FAMILY_DIVORCE",
  MATRIMONIAL: "FAMILY_DIVORCE",
  DIVORCE:     "FAMILY_DIVORCE",
  CONTRACT:    "CORPORATE_CONTRACT",
  CORPORATE:   "CORPORATE_CONTRACT",
};

export function resolveLimitationKey(category: string): string | null {
  const upper = category.toUpperCase();
  // Direct match
  if (LIMITATION_PERIODS[upper]) return upper;
  // Mapped match
  return CATEGORY_MAP[upper] ?? null;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LimitationResult {
  caseType: string;
  legalBasis: string;
  description: string;
  deadline: Date | null;
  daysRemaining: number | null;
  isUrgent: boolean;    // < 30 days
  isCritical: boolean;  // < 7 days
  isExpired: boolean;
  hasFixedPeriod: boolean;
}

// ── Core calculation ──────────────────────────────────────────────────────────
export function calculateLimitation(
  caseType: string,
  incidentDate: Date
): LimitationResult {
  const period = LIMITATION_PERIODS[caseType];

  if (!period) {
    throw new Error(`Unknown limitation case type: ${caseType}`);
  }

  const hasFixedPeriod = period.days !== null;

  if (!hasFixedPeriod) {
    return {
      caseType,
      legalBasis: period.law,
      description: period.description,
      deadline: null,
      daysRemaining: null,
      isUrgent: false,
      isCritical: false,
      isExpired: false,
      hasFixedPeriod: false,
    };
  }

  const deadline = new Date(incidentDate);
  deadline.setDate(deadline.getDate() + period.days!);

  const now = new Date();
  const msRemaining = deadline.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  return {
    caseType,
    legalBasis: period.law,
    description: period.description,
    deadline,
    daysRemaining,
    isUrgent: daysRemaining > 0 && daysRemaining < 30,
    isCritical: daysRemaining > 0 && daysRemaining < 7,
    isExpired: daysRemaining <= 0,
    hasFixedPeriod: true,
  };
}

// ── Build inline warning text for AI responses ─────────────────────────────
export function buildLimitationWarning(result: LimitationResult): string | null {
  if (!result.hasFixedPeriod) return null;
  if (result.isExpired) {
    return `🚨 **DEADLINE EXPIRED**: The statutory limitation period under ${result.legalBasis} has passed. You may have lost the right to file. Consult a lawyer immediately — courts can sometimes condone delays with valid reasons.`;
  }
  if (result.isCritical) {
    return `🚨 **CRITICAL**: Your filing deadline is in **${result.daysRemaining} day${result.daysRemaining === 1 ? "" : "s"}** under ${result.legalBasis}. **File TODAY** or you may lose your legal right permanently.`;
  }
  if (result.isUrgent) {
    return `⚠️ **URGENT DEADLINE**: Based on ${result.legalBasis}, you have only **${result.daysRemaining} days** left to file. Contact a lawyer immediately.`;
  }
  return null; // > 30 days — no inline warning needed
}
