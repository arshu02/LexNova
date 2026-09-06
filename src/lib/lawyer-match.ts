import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Enriched Match Context for case-aware scoring
// ---------------------------------------------------------------------------

export interface MatchContext {
  category: string;
  subCategory?: string;          // e.g. "Security Deposit Recovery" vs "Eviction"
  urgency?: string;              // HIGH urgency → boost "Available Now" advocates
  complexity?: string;           // HIGH complexity → prefer senior advocates
  estimatedValue?: number | null; // High value → prioritize senior/high-fee advocates
  city?: string | null;
  caseFlags?: string[];          // e.g. ["MINOR_CHILDREN_INVOLVED", "FIR_PENDING", "HIGH_VALUE_CLAIM"]
}

// ---------------------------------------------------------------------------
// Fallback data when DB has no verified advocates
// ---------------------------------------------------------------------------
const FALLBACK_ADVOCATES = [
  {
    id: "adv_1",
    name: "Adv. Rahul Sharma",
    type: "Criminal & Employment Lawyer",
    specialization: "Criminal & Employment",
    experience: 12,
    experienceYears: 12,
    rating: 4.9,
    cases: 1240,
    qualification: "Bar Council Reg: D/1042/2012",
    fee: "₹1,500 / session",
    pricing: "₹1,500 / session",
    language: "English, Hindi",
    languages: "English, Hindi",
    city: "New Delhi",
    verified: true,
    availability: "Available Now",
    matchScore: 95,
    matchReason: "Top-rated criminal & employment specialist in your region",
    score: 10,
  },
  {
    id: "adv_2",
    name: "Adv. Priya Mehta",
    type: "Corporate & Employment Specialist",
    specialization: "Corporate & Employment",
    experience: 8,
    experienceYears: 8,
    rating: 4.8,
    cases: 850,
    qualification: "Bar Council Reg: MAH/850/2016",
    fee: "₹1,200 / session",
    pricing: "₹1,200 / session",
    language: "English, Hindi, Marathi",
    languages: "English, Hindi, Marathi",
    city: "Mumbai",
    verified: true,
    availability: "Next Week",
    matchScore: 88,
    matchReason: "Highly experienced in corporate and employment disputes",
    score: 9,
  },
  {
    id: "adv_3",
    name: "Adv. Sanjay Gupta",
    type: "Property & Tenancy Advocate",
    specialization: "Property & Tenancy",
    experience: 15,
    experienceYears: 15,
    rating: 4.7,
    cases: 2100,
    qualification: "Bar Council Reg: KAR/2100/2009",
    fee: "₹2,000 / session",
    pricing: "₹2,000 / session",
    language: "English, Kannada, Hindi",
    languages: "English, Kannada, Hindi",
    city: "Bengaluru",
    verified: true,
    availability: "In 2 Days",
    matchScore: 81,
    matchReason: "15+ years handling property and tenancy matters",
    score: 8,
  },
  {
    id: "adv_4",
    name: "Adv. Ananya Iyer",
    type: "Consumer & Cyber Law Specialist",
    specialization: "Consumer & Cyber Law",
    experience: 6,
    experienceYears: 6,
    rating: 4.9,
    cases: 420,
    qualification: "Bar Council Reg: TS/420/2018",
    fee: "₹1,000 / session",
    pricing: "₹1,000 / session",
    language: "English, Telugu, Hindi",
    languages: "English, Telugu, Hindi",
    city: "Hyderabad",
    verified: true,
    availability: "Available Now",
    matchScore: 78,
    matchReason: "Specialist in consumer protection and IT/cyber offences",
    score: 7,
  },
];

// ---------------------------------------------------------------------------
// Category ↔ specialization synonym map (expanded)
// ---------------------------------------------------------------------------
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  labour_dispute:     ["labour", "employment", "workplace", "wage", "salary", "termination", "hr"],
  labour_employment:  ["labour", "employment", "workplace", "wage", "salary", "termination", "hr"],
  property_dispute:   ["property", "tenancy", "tenant", "landlord", "real estate", "land", "rent"],
  property_tenancy:   ["property", "tenancy", "tenant", "landlord", "real estate", "land", "rent", "rera"],
  consumer_grievance: ["consumer", "refund", "product", "defective", "ecommerce", "complaint", "ncdrc"],
  criminal_cyber:     ["criminal", "cyber", "fir", "fraud", "cheque", "ipc", "digital", "police"],
  family_divorce:     ["family", "divorce", "matrimonial", "custody", "alimony", "maintenance", "domestic"],
  family_matrimonial: ["family", "divorce", "matrimonial", "custody", "alimony", "maintenance", "domestic", "dv"],
  corporate_contract: ["corporate", "contract", "company", "partnership", "startup", "commercial", "business"],
  general:            [],
};

// ---------------------------------------------------------------------------
// Case Flag → bonus score map
// ---------------------------------------------------------------------------
const FLAG_BONUSES: Record<string, { spec?: string; bonus: number; label: string }> = {
  MINOR_CHILDREN_INVOLVED: { spec: "family",    bonus: 12, label: "handles child custody & guardianship" },
  DV_COMPLAINT:            { spec: "family",    bonus: 15, label: "domestic violence protection specialist" },
  FIR_PENDING:             { spec: "criminal",  bonus: 15, label: "handles FIR filing & criminal defense" },
  HIGH_VALUE_CLAIM:        {                    bonus: 5,  label: "experienced in high-value disputes" },
  FOREIGN_PARTY:           { spec: "corporate", bonus: 8,  label: "handles cross-border commercial disputes" },
  ARBITRATION_CLAUSE:      { spec: "corporate", bonus: 10, label: "arbitration & ADR specialist" },
  LIMITATION_URGENT:       {                    bonus: 10, label: "available for urgent limitation matters" },
};

// ---------------------------------------------------------------------------
// Core Scoring Algorithm
// ---------------------------------------------------------------------------
function computeMatchScore(
  advocateSpec: string,
  advocateCity: string | null | undefined,
  advocateRating: number | null | undefined,
  advocateExp: number | null | undefined,
  advocateCases: number | null | undefined,
  advocateAvailability: string | null | undefined,
  ctx: MatchContext
): { score: number; matchScore: number; matchReason: string } {
  let raw = 0;
  const reasons: string[] = [];

  const spec  = (advocateSpec || "").toLowerCase();
  const cat   = (ctx.category || "").toLowerCase().replace(/-/g, "_");
  const synonyms = CATEGORY_SYNONYMS[cat] || [];

  // ── Specialization match (max 40 pts) ────────────────────────────────────
  const specMatch = synonyms.some((kw) => spec.includes(kw)) || spec.includes(cat.split("_")[0]);
  if (specMatch) {
    raw += 40;
    reasons.push("specialization match");
  }

  // ── Sub-category specificity bonus (max 10 pts) ───────────────────────────
  if (ctx.subCategory) {
    const sub = ctx.subCategory.toLowerCase();
    const subWords = sub.split(/\s+/);
    const subMatch = subWords.some((w) => w.length > 3 && spec.includes(w));
    if (subMatch) {
      raw += 10;
      reasons.push(`specialist in ${ctx.subCategory.toLowerCase()}`);
    }
  }

  // ── City match (max 25 pts) ───────────────────────────────────────────────
  const userCity = ctx.city;
  if (userCity && advocateCity) {
    if (advocateCity.toLowerCase() === userCity.toLowerCase()) {
      raw += 25;
      reasons.push("based in your city");
    } else if (advocateCity.toLowerCase().includes(userCity.toLowerCase().split(" ")[0])) {
      raw += 10;
      reasons.push("nearby location");
    }
  }

  // ── Rating (max 25 pts) ───────────────────────────────────────────────────
  const rating = advocateRating || 0;
  const ratingPts = Math.round(rating * 5);
  raw += ratingPts;
  if (rating >= 4.8) reasons.push(`top-rated (${rating}★)`);

  // ── Experience (max 15 pts) ───────────────────────────────────────────────
  const exp = advocateExp || 0;
  const expPts = Math.min(exp, 15);
  raw += expPts;

  // High complexity → favor very experienced advocates
  if (ctx.complexity === "HIGH" && exp >= 10) {
    raw += 8;
    reasons.push(`${exp}+ years in complex disputes`);
  } else if (exp >= 10) {
    reasons.push(`${exp}+ years experience`);
  }

  // ── High-value claim → prefer senior advocates (max 8 pts) ───────────────
  if (ctx.estimatedValue && ctx.estimatedValue >= 500000 && exp >= 10) {
    raw += 8;
    reasons.push(`handles high-value claims (₹${(ctx.estimatedValue / 100000).toFixed(1)}L+)`);
  }

  // ── Availability bonus ────────────────────────────────────────────────────
  const avail = (advocateAvailability || "").toLowerCase();
  const isAvailableNow = avail.includes("now") || avail.includes("today");
  if (isAvailableNow) {
    raw += 10;
    if (ctx.urgency === "HIGH") {
      raw += 8; // Extra bonus for urgent cases
      reasons.push("available immediately — matches your urgent case");
    } else {
      reasons.push("available now");
    }
  }

  // ── Cases handled (up to 5 pts) ───────────────────────────────────────────
  const casesHandled = advocateCases || 0;
  if (casesHandled > 500) {
    raw += 5;
    reasons.push(`${casesHandled.toLocaleString()} cases handled`);
  }

  // ── Case flags bonus ──────────────────────────────────────────────────────
  if (ctx.caseFlags && ctx.caseFlags.length > 0) {
    for (const flag of ctx.caseFlags) {
      const flagInfo = FLAG_BONUSES[flag];
      if (flagInfo) {
        // Apply bonus if flag matches advocate specialization or is a general bonus
        const flagSpecMatch = !flagInfo.spec || spec.includes(flagInfo.spec);
        if (flagSpecMatch) {
          raw += flagInfo.bonus;
          reasons.push(flagInfo.label);
          break; // Only apply 1 flag bonus per advocate
        }
      }
    }
  }

  // ── Normalize to 0–100 ────────────────────────────────────────────────────
  const MAX_POSSIBLE = 40 + 10 + 25 + 25 + 15 + 8 + 8 + 10 + 8 + 5 + 15; // ~169
  const matchScore = Math.min(100, Math.round((raw / MAX_POSSIBLE) * 100));

  // Build human-readable reason (top 3 reasons)
  const matchReason =
    reasons.length > 0
      ? reasons
          .slice(0, 3)
          .map((r, i) => (i === 0 ? r.charAt(0).toUpperCase() + r.slice(1) : r))
          .join(" · ")
      : "Qualified advocate for your matter";

  return { score: raw, matchScore, matchReason };
}

// ---------------------------------------------------------------------------
// Public API — accepts enriched MatchContext
// ---------------------------------------------------------------------------
export async function getMatchedLawyers(ctx: MatchContext): Promise<typeof FALLBACK_ADVOCATES> {
  const resolvedCtx: MatchContext = ctx;

  try {
    const advocates = await prisma.advocate.findMany({ where: { verified: true } });

    if (!advocates || advocates.length === 0) {
      return enrichFallback(resolvedCtx);
    }

    const scored = advocates
      .map((advocate) => {
        const { score, matchScore, matchReason } = computeMatchScore(
          advocate.specialization || "",
          advocate.city,
          advocate.rating,
          advocate.experienceYears,
          null,
          null,
          resolvedCtx
        );

        return {
          id: advocate.id,
          name: advocate.name,
          type: advocate.specialization,
          specialization: advocate.specialization,
          experience: advocate.experienceYears,
          experienceYears: advocate.experienceYears,
          rating: advocate.rating,
          cases: 0, // not stored in DB schema, use 0 as placeholder
          qualification: advocate.barNumber ? `Bar No: ${advocate.barNumber}` : "Bar Council Verified",
          fee: advocate.pricing,
          pricing: advocate.pricing,
          language: advocate.languages,
          languages: advocate.languages,
          city: advocate.city,
          verified: advocate.verified,
          availability: "Contact to confirm",
          matchScore,
          matchReason,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored.length > 0 ? scored : enrichFallback(resolvedCtx);
  } catch (error) {
    console.error("Match lawyers error:", error);
    return enrichFallback(resolvedCtx);
  }
}

// ---------------------------------------------------------------------------
// Re-score fallback data against the actual enriched context
// ---------------------------------------------------------------------------
function enrichFallback(ctx: MatchContext) {
  return FALLBACK_ADVOCATES.map((adv) => {
    const { score, matchScore, matchReason } = computeMatchScore(
      adv.specialization,
      adv.city,
      adv.rating,
      adv.experience,
      adv.cases,
      adv.availability,
      ctx
    );
    return { ...adv, score, matchScore, matchReason };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
