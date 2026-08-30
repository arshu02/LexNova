import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { searchLawForCase } from "@/lib/rag-search";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// ── Evidence strength labels ────────────────────────────────────────────────
const EVIDENCE_LABELS: Record<string, string> = {
  STRONG:   "Strong (documentary evidence, receipts, written contracts, recordings)",
  MODERATE: "Moderate (some documents, partial evidence, witness accounts)",
  WEAK:     "Weak (mainly verbal claims, limited documentation)",
};

// ── Static precedent context per case type ─────────────────────────────────
const PRECEDENT_CONTEXT: Record<string, string> = {
  CONSUMER_GRIEVANCE: `Indian consumer forum precedents:
- District Consumer Forums routinely award 85–100% of claimed amount for clear deficiency of service.
- Compensation for mental agony: ₹5,000–₹50,000 (District), ₹50,000–₹2L (State).
- NCDRC settlements average 70–80% of claim when both parties negotiate early.
- Litigation costs recovered: ₹3,000–₹15,000 typically.`,

  CHEQUE_BOUNCE: `NI Act Section 138 settlement precedents:
- Courts strongly encourage compounding. Typical settlement: 100% cheque amount + 12–18% interest.
- Compounding before first hearing: usually accepted with full amount + ₹5,000–₹25,000 compensation.
- Compounding post-conviction: 100% + significant compensation to avoid imprisonment.
- Settlement is highly time-sensitive — 15-day statutory notice period.`,

  LABOUR_DISPUTE: `Indian labour dispute settlement precedents:
- Labour courts encourage conciliation first (Industrial Disputes Act, Section 12).
- Wrongful termination settlements average: 3–12 months gross salary + statutory dues (PF, gratuity).
- Payment of wages disputes: 100% of dues + 10x penalty under Section 20 (if pursued).
- Early settlement (within 90 days): typically 60–75% of full claim amount.`,

  PROPERTY_DISPUTE: `Property dispute settlement precedents:
- Mediation centres report 40–60% of property cases settle before trial.
- Typical settlement: disputed property transfer or 70–85% of market value.
- Partition suit settlements: equal share or compensatory payment to one party.
- Court fees refunded on settlement (per CPC Section 89 and related rules).`,

  FAMILY_DIVORCE: `Family/matrimonial settlement precedents:
- Maintenance (alimony) awards: 1/3 to 1/4 of husband's net monthly income (Supreme Court guideline).
- One-time permanent alimony: typically 5–7 years of annual maintenance.
- Dowry articles: full return + interest; HMA Section 27 governs.
- Mutual consent divorce: negotiated settlement finalized in 6-month period.`,

  CORPORATE_CONTRACT: `Contract breach settlement precedents:
- Indian courts apply "restitutio in integrum" — restore injured party to pre-breach position.
- Typical settlement: 60–80% of actual loss + interest at 12–18% p.a.
- Liquidated damages enforced as per contract if not unconscionable (Indian Contract Act, Section 74).
- Parties increasingly prefer arbitration awards (average 70–85% of claim value).`,

  CRIMINAL_CYBER: `Cyber crime / fraud settlement precedents:
- Civil recovery alongside criminal complaint: 90–100% of defrauded amount.
- IT Act Section 43A compensation: actual damages + reasonable costs.
- Bank recovery through Lok Adalat: average 80–90% of amount for clear fraud.
- Criminal compounding: generally not allowed for IPC 420 without court permission.`,
};

// ── POST /api/ai/settlement-suggest ────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      caseType,
      claimAmount,
      jurisdiction,
      evidenceStrength = "MODERATE",
      caseSummary = "",
    } = body as {
      caseType: string;
      claimAmount: number;
      jurisdiction: string;
      evidenceStrength?: "STRONG" | "MODERATE" | "WEAK";
      caseSummary?: string;
    };

    if (!caseType || !claimAmount || !jurisdiction) {
      return NextResponse.json(
        { error: "caseType, claimAmount and jurisdiction are required" },
        { status: 400 }
      );
    }

    const claimFmt = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(claimAmount);

    // ── Fallback if no Claude key ──────────────────────────────────────────
    if (!process.env.ANTHROPIC_API_KEY) {
      return buildStaticSuggestion(caseType, claimAmount, evidenceStrength);
    }

    // ── RAG search for settlement precedents ──────────────────────────────
    const ragQuery = `settlement amount ${caseType} ${jurisdiction} Indian court`;
    const { context: ragContext } = await searchLawForCase(ragQuery).catch(() => ({
      context: "",
    }));

    const staticPrecedents = PRECEDENT_CONTEXT[caseType] || "";
    const precedentBlock =
      [staticPrecedents, ragContext].filter(Boolean).join("\n\n").trim();

    // ── Claude prompt ──────────────────────────────────────────────────────
    const prompt = `You are an expert Indian legal mediator and settlement advisor with 25 years of experience in ADR (Alternative Dispute Resolution).

CASE DETAILS:
- Case Type: ${caseType.replace(/_/g, " ")}
- Jurisdiction: ${jurisdiction}
- Claim Amount: ${claimFmt}
- Evidence Strength: ${EVIDENCE_LABELS[evidenceStrength] || evidenceStrength}
${caseSummary ? `- Case Summary: ${caseSummary}` : ""}

SETTLEMENT PRECEDENTS:
${precedentBlock || "Use your knowledge of Indian court and consumer forum settlement patterns."}

Based on this information, provide a structured settlement recommendation.

Respond in this EXACT format:

**Recommended Settlement Range**
Minimum: ₹[amount]
Maximum: ₹[amount]
Optimal: ₹[amount]

**Reasoning**
[3–4 sentences explaining how you arrived at this range, citing precedents and evidence strength]

**Similar Case Outcomes**
- [Case type / forum]: [outcome description with approximate amount or percentage]
- [Case type / forum]: [outcome description with approximate amount or percentage]
- [Case type / forum]: [outcome description with approximate amount or percentage]

**Settlement Strategy**
[2–3 sentences on how the initiating party should frame the offer and what terms to insist on]

**Non-Monetary Terms to Consider**
- [Term 1]
- [Term 2]
- [Term 3]

**Risk of Going to Court**
[1–2 sentences on litigation risk vs. settlement benefit for this evidence strength]

RULES:
- All amounts must be in Indian Rupees (₹)
- Be specific, not vague — give exact numbers, not just percentages
- Consider the jurisdiction's specific court/forum
- Factor in litigation costs (lawyer fees, court fees, time) when recommending settlement`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1200,
      system: `You are a precise Indian legal settlement advisor. Always give specific rupee amounts. 
Never be vague. Factor in Indian court realities: long delays, high litigation cost, 
and the strong judicial preference for out-of-court settlement under CPC Section 89.`,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return buildStaticSuggestion(caseType, claimAmount, evidenceStrength);
    }

    // ── Parse the structured response to extract key numbers ──────────────
    const text = textContent.text.trim();
    const optimalMatch  = text.match(/Optimal[:\s]+₹?([\d,]+)/i);
    const minMatch      = text.match(/Minimum[:\s]+₹?([\d,]+)/i);
    const maxMatch      = text.match(/Maximum[:\s]+₹?([\d,]+)/i);

    const parseAmount = (m: RegExpMatchArray | null) =>
      m ? parseInt(m[1].replace(/,/g, ""), 10) : null;

    return NextResponse.json({
      success: true,
      suggestion: text,
      parsedAmounts: {
        min:     parseAmount(minMatch),
        max:     parseAmount(maxMatch),
        optimal: parseAmount(optimalMatch),
      },
      meta: {
        caseType,
        claimAmount,
        evidenceStrength,
        jurisdiction,
      },
    });
  } catch (error) {
    console.error("[settlement-suggest] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── Static fallback (no Claude key) ────────────────────────────────────────
function buildStaticSuggestion(
  caseType: string,
  claimAmount: number,
  evidenceStrength: string
) {
  const multipliers: Record<string, Record<string, [number, number, number]>> = {
    STRONG:   {
      CONSUMER_GRIEVANCE: [0.85, 1.00, 0.92],
      CHEQUE_BOUNCE:      [1.00, 1.18, 1.12],
      LABOUR_DISPUTE:     [0.75, 1.00, 0.85],
      PROPERTY_DISPUTE:   [0.75, 0.90, 0.82],
      FAMILY_DIVORCE:     [0.80, 1.00, 0.90],
      CORPORATE_CONTRACT: [0.70, 0.90, 0.80],
      CRIMINAL_CYBER:     [0.90, 1.00, 0.95],
    },
    MODERATE: {
      CONSUMER_GRIEVANCE: [0.60, 0.85, 0.72],
      CHEQUE_BOUNCE:      [0.90, 1.05, 0.95],
      LABOUR_DISPUTE:     [0.55, 0.80, 0.67],
      PROPERTY_DISPUTE:   [0.55, 0.75, 0.65],
      FAMILY_DIVORCE:     [0.60, 0.80, 0.70],
      CORPORATE_CONTRACT: [0.50, 0.75, 0.62],
      CRIMINAL_CYBER:     [0.75, 0.95, 0.85],
    },
    WEAK: {
      CONSUMER_GRIEVANCE: [0.30, 0.60, 0.45],
      CHEQUE_BOUNCE:      [0.70, 0.90, 0.80],
      LABOUR_DISPUTE:     [0.25, 0.55, 0.40],
      PROPERTY_DISPUTE:   [0.30, 0.55, 0.42],
      FAMILY_DIVORCE:     [0.40, 0.60, 0.50],
      CORPORATE_CONTRACT: [0.20, 0.50, 0.35],
      CRIMINAL_CYBER:     [0.50, 0.75, 0.62],
    },
  };

  const row = multipliers[evidenceStrength]?.[caseType] ?? [0.5, 0.8, 0.65];
  const fmt = (n: number) =>
    "₹" +
    Math.round(claimAmount * n).toLocaleString("en-IN");

  const suggestion = `**Recommended Settlement Range**
Minimum: ${fmt(row[0])}
Maximum: ${fmt(row[1])}
Optimal: ${fmt(row[2])}

**Reasoning**
Based on ${caseType.replace(/_/g, " ")} precedents with ${evidenceStrength.toLowerCase()} evidence, 
Indian courts and forums typically settle at ${Math.round(row[2] * 100)}% of the claimed amount. 
Early settlement avoids 2–5 years of litigation, lawyer fees of ₹50,000–₹3,00,000, and significant 
uncertainty. A ${Math.round(row[2] * 100)}% recovery now is better than 100% uncertainty later.

**Similar Case Outcomes**
- District Consumer Forum: Settled at 75–90% of claim in consumer deficiency cases.
- Labour Court conciliation: 60–80% of full claim as early settlement.
- Civil court decree: Often takes 3–7 years and 30–50% of award goes to litigation costs.

**Risk of Going to Court**
With ${evidenceStrength.toLowerCase()} evidence, litigation success probability is 
${evidenceStrength === "STRONG" ? "high (70–80%)" : evidenceStrength === "MODERATE" ? "moderate (45–60%)" : "lower (25–40%)"}. 
Settlement at the recommended range is advisable to avoid delays and costs.`;

  return NextResponse.json({
    success: true,
    suggestion,
    parsedAmounts: {
      min:     Math.round(claimAmount * row[0]),
      max:     Math.round(claimAmount * row[1]),
      optimal: Math.round(claimAmount * row[2]),
    },
    meta: { caseType, claimAmount, evidenceStrength },
  });
}
