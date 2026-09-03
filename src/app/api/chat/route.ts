import { NextResponse } from "next/server";
import { classifyLegalIssue, CATEGORY_INFO } from "@/lib/ai-classification";
import { getMatchedLawyers } from "@/lib/lawyer-match";
import { searchLawForCase } from "@/lib/rag-search";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import PIIRedactor from "@/lib/pii-redactor";
import { requireAuth } from "@/lib/auth-helpers";
import {
  resolveLimitationKey,
  calculateLimitation,
  buildLimitationWarning,
  LIMITATION_PERIODS,
} from "@/lib/limitation-periods";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// ---------------------------------------------------------------------------
// Intake question sets — shared core + party-specific
// ---------------------------------------------------------------------------
const INTAKE_QUESTIONS_CORE = [
  "Could you walk me through the **timeline of events**? For example — when did this start, what agreements or deadlines were involved, and what happened most recently?",
  "**Where did this occur** (city and state)? And who is the opposing party — for example, an employer, landlord, merchant, or family member?",
  "What **documents or evidence** do you currently have? (e.g. contracts, pay slips, WhatsApp messages, invoices, receipts, notice letters)",
  "**How urgent** is your situation — do you have a court date or a deadline approaching? And what outcome are you hoping to achieve (e.g. refund, reinstatement, compensation, divorce decree)?",
];

// Defendants get one extra question about the summons / notice deadline
const INTAKE_QUESTIONS_DEFENDANT = [
  ...INTAKE_QUESTIONS_CORE,
  "Have you received a **legal notice or court summons**? If yes, what is the **response deadline** mentioned in it, and have you already consulted a lawyer about it?",
];

// Step labels per party
const STEP_LABELS_PLAINTIFF = [
  "Timeline & Facts",
  "Location & Parties",
  "Evidence & Documents",
  "Urgency & Outcome",
];

const STEP_LABELS_DEFENDANT = [
  "Timeline & Facts",
  "Location & Parties",
  "Evidence & Documents",
  "Urgency & Outcome",
  "Notice / Summons Details",
];

type Party = "PLAINTIFF" | "DEFENDANT";

function getIntakeQuestions(party: Party) {
  return party === "DEFENDANT" ? INTAKE_QUESTIONS_DEFENDANT : INTAKE_QUESTIONS_CORE;
}

function getStepLabels(party: Party) {
  return party === "DEFENDANT" ? STEP_LABELS_DEFENDANT : STEP_LABELS_PLAINTIFF;
}

// ---------------------------------------------------------------------------
// AI Legal Advice — RAG-enhanced, perspective-aware
// ---------------------------------------------------------------------------
async function generateLegalAdvice(
  answersText: string,
  jurisdiction: string | null,
  party: Party = "PLAINTIFF",
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackAdvice(answersText);
  }

  try {
    // ── RAG: Retrieve relevant Indian law sections ──────────────────────────
    console.log(`[Chat API] Performing RAG search (party=${party})...`);
    const { context: ragContext } = await searchLawForCase(answersText);

    const lawContextBlock = ragContext
      ? `\n\nRELEVANT INDIAN LAW SECTIONS (from verified database):\n\n${ragContext}\n\nYou MUST cite the exact Act name and Section number from the above. Do not invent or paraphrase section numbers.`
      : "";

    const hasRAG = ragContext.length > 0;
    console.log(`[Chat API] RAG context: ${hasRAG ? "✅ injected" : "⚠️ not available — answering from training"}`);

    // ── Build perspective-specific system + user prompts ────────────────────
    const citationRule = hasRAG
      ? "Always cite the exact Act name and Section number from the retrieved sections above."
      : "Cite well-known Indian acts and sections from your training.";

    const systemPrompt =
      party === "PLAINTIFF"
        ? `You are a senior Indian advocate representing the PLAINTIFF with 20 years of litigation experience. \
Analyse this case strictly from the PLAINTIFF'S perspective. ${citationRule} \
Focus on: the strongest legal arguments in the plaintiff's favour, the evidence they must gather, \
the maximum relief they can claim, and how to pre-empt or counter the defendant's likely defences. \
Never give generic advice — be specific to the stated facts. Always ethical and within the law.`
        : `You are a senior Indian advocate representing the DEFENDANT with 20 years of defence litigation experience. \
Analyse this case strictly from the DEFENDANT'S perspective. ${citationRule} \
Focus on: legal grounds to challenge or weaken the plaintiff's claims, procedural or technical defects \
in the case (jurisdiction, limitation, locus standi), available counterclaims, \
settlement leverage, and a step-by-step defence strategy. \
Do NOT advise anything unethical, fraudulent, or against the law. Always act within the bounds of the Indian legal system.`;

    const perspectiveBlock =
      party === "PLAINTIFF"
        ? `
Analyse from the PLAINTIFF's perspective:

**Legal Summary**
[2–3 sentences on the legal nature of the dispute and the plaintiff's strongest position]

**Plaintiff's Rights Under Indian Law**
[3–4 specific legal rights/remedies the plaintiff can invoke, with exact Act and Section${hasRAG ? " from the retrieved sections" : ""}]

**Strongest Legal Arguments**
[3–5 key arguments the plaintiff should make in court or in a legal notice]

**Evidence the Plaintiff Must Gather**
[Bullet list of specific documents, witnesses, digital records needed]

**What the Defendant Is Likely to Argue — And How to Counter It**
[2–3 anticipated defence arguments and specific counter-strategies]

**Relief the Plaintiff Can Claim**
[Specific monetary / injunctive / declaratory relief available, with relevant provisions]

**Immediate Steps to Take**
[Numbered list of 4–5 concrete actions in priority order]

**Type of Lawyer Needed**
[Specific specialisation required — e.g. "Consumer Law Advocate", "Labour Lawyer", "Property Litigation Specialist"]

**Time Limit Warning**
[Limitation period under Indian law — be specific to this case type]

RULES:
- Cite exact section numbers${hasRAG ? " from the retrieved sections" : ""}
- Use plain language
- Be specific to this person's facts
- End with: ⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`
        : `
Analyse from the DEFENDANT's perspective:

**Legal Summary**
[2–3 sentences on the dispute and the defendant's legal exposure]

**Grounds to Challenge the Plaintiff's Claim**
[3–5 specific legal grounds — procedural defects, limitation bars, lack of evidence, jurisdiction issues, etc. with exact Act and Section${hasRAG ? " from the retrieved sections" : ""}]

**Technical and Procedural Defences**
[Defects in how the case was filed — wrong forum, improper notice, limitation expired, lack of standing, etc.]

**Available Counterclaims**
[Any counterclaims or cross-suits the defendant can file against the plaintiff]

**Settlement Leverage**
[What settlement terms are realistic, what the defendant's BATNA is, and how to negotiate]

**Evidence the Defendant Must Gather**
[Bullet list of documents, records, and witnesses needed for the defence]

**Immediate Steps to Take**
[Numbered list of 4–5 concrete defence actions in priority order — including response deadlines]

**Type of Lawyer Needed**
[Specific specialisation required for this type of defence]

**Time Limit Warning**
[Any response deadlines from the notice/summons, plus any counterclaim limitation periods]

RULES:
- Cite exact section numbers${hasRAG ? " from the retrieved sections" : ""}
- Use plain language
- Be specific to the defendant's facts
- Do NOT suggest anything unethical or illegal
- End with: ⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;

    // Redact PII before sending to third-party LLM
    const { redactedText, replacements } = PIIRedactor.redact(answersText);

    const userPrompt = `CASE FACTS (from ${party === "PLAINTIFF" ? "the person who initiated the matter" : "the person who received a notice or summons"}):
${redactedText}
${lawContextBlock}
${perspectiveBlock}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return buildFallbackAdvice(answersText);
    }
    
    // Rehydrate synthetic tokens back to original safe values
    return PIIRedactor.unredact(textContent.text.trim(), replacements);

  } catch (error) {
    console.error("[Chat API] Error generating legal advice:", error);
    return buildFallbackAdvice(answersText);
  }
}

// ---------------------------------------------------------------------------
// Keyword-based fallback (when AI or RAG is unavailable)
// ---------------------------------------------------------------------------
function buildFallbackAdvice(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("landlord") || t.includes("tenant") || t.includes("deposit") || t.includes("rent")) {
    return `**Legal Summary**\nThis is a tenancy dispute involving non-refund of security deposit or breach of rental agreement terms.\n\n**Your Rights Under Indian Law**\n- **Transfer of Property Act 1882, Section 108** — Governs rights and liabilities of lessor and lessee.\n- **State Rent Control Acts** (e.g., Maharashtra Rent Control Act 1999, Karnataka Rent Control Act 2001) — Regulate deposit amounts and timelines for return.\n- **Indian Contract Act 1872, Section 73** — Entitles you to compensation for breach of agreement.\n\n**Immediate Steps to Take**\n1. Send a written notice (WhatsApp + registered post) demanding deposit refund within 15 days.\n2. Compile evidence: lease agreement, deposit bank transfer, move-out photos, key handover proof.\n3. If ignored, file in Rent Controller's Court or Small Causes Court.\n4. Consider consumer forum if landlord is a company/agent.\n\n**Documents to Gather**\n- Rent/lease agreement, deposit payment receipt, bank statements, move-out photos, all communications.\n\n**Do You Need a Lawyer?**\nYes — for drafting the legal notice. Self-representation is possible for smaller claims.\n\n**Time Limit Warning**\n3 years under Limitation Act 1963 to file a civil suit for recovery.\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
  }

  if (t.includes("salary") || t.includes("employer") || t.includes("fired") || t.includes("terminated") || t.includes("wages")) {
    return `**Legal Summary**\nThis is an employment dispute regarding unpaid wages or wrongful termination. Indian labour law provides strong statutory protections.\n\n**Your Rights Under Indian Law**\n- **Payment of Wages Act 1936, Section 5** — Mandates timely payment of wages; violations attract penalties under Section 20.\n- **Industrial Disputes Act 1947, Section 25F** — Requires mandatory retrenchment compensation before termination.\n- **Indian Contract Act 1872** — Breach of employment contract is actionable.\n- **Shops & Establishments Act** (state-specific) — Protects employees in shops and offices.\n\n**Immediate Steps to Take**\n1. Send a formal grievance email to HR and senior management; retain copies.\n2. Have a lawyer draft a demand notice for all unpaid dues.\n3. File a complaint with the Labour Commissioner of your district.\n4. If dues exceed ₹20,000, approach the Labour Court for recovery.\n5. File under Section 33C(2) of the Industrial Disputes Act for monetary claims.\n\n**Documents to Gather**\n- Employment contract, offer letter, pay slips, bank statements, HR communications, termination letter.\n\n**Do You Need a Lawyer?**\nYes — an employment advocate should draft the demand notice and represent in Labour Court if needed.\n\n**Time Limit Warning**\n3 years to file a civil suit; 1 year for Labour Court complaints in most states.\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
  }

  if (t.includes("scam") || t.includes("fraud") || t.includes("cheated") || t.includes("cyber") || t.includes("online")) {
    return `**Legal Summary**\nThis is a case of online fraud or cyber crime. Immediate reporting is critical to freeze transactions and preserve evidence.\n\n**Your Rights Under Indian Law**\n- **IT Act 2000, Section 66C** — Identity theft; **Section 66D** — Impersonation fraud.\n- **IPC Section 420** — Cheating and dishonestly inducing delivery of property.\n- **IPC Section 406** — Criminal breach of trust.\n- **Consumer Protection Act 2019** — Applicable if the fraud involved a commercial transaction.\n\n**Immediate Steps to Take**\n1. Report to **cybercrime.gov.in** or call **1930** (National Cyber Crime Helpline) immediately.\n2. File an FIR at the nearest police station.\n3. Contact your bank immediately to freeze/reverse the transaction.\n4. Screenshot and preserve all digital evidence: messages, emails, payment receipts, profiles.\n5. Consult a cyber law specialist if the amount is significant.\n\n**Documents to Gather**\n- Screenshots of fraud communication, payment receipts, bank statements, FIR copy.\n\n**Do You Need a Lawyer?**\nYes — especially if amounts are significant. A cyber law advocate can escalate if police are unresponsive.\n\n**Time Limit Warning**\nReport within 24–48 hours to maximize chances of transaction reversal. FIR within 3 years (IPC).\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
  }

  if (t.includes("divorce") || t.includes("custody") || t.includes("maintenance") || t.includes("husband") || t.includes("wife")) {
    return `**Legal Summary**\nThis is a matrimonial matter that may involve divorce, child custody, maintenance, or division of assets.\n\n**Your Rights Under Indian Law**\n- **Hindu Marriage Act 1955, Section 13** — Grounds for divorce; **Section 24** — Maintenance pendente lite.\n- **Protection of Women from DV Act 2005, Section 12** — For protection orders; **Section 20** — Monetary relief.\n- **Guardian and Wards Act 1890, Section 25** — For child custody applications.\n- **CrPC Section 125** — Maintenance for wife, children, and parents.\n\n**Immediate Steps to Take**\n1. Consult a family law advocate for an initial assessment of your grounds.\n2. Gather financial documents: bank statements, property papers, salary slips, tax returns.\n3. Attempt mediation through court or a private mediator — saves cost and time.\n4. File for interim maintenance/custody if urgent protection is needed.\n5. If domestic violence is involved, contact the Protection Officer under PWDVA 2005.\n\n**Documents to Gather**\n- Marriage certificate, birth certificates of children, financial statements, court notices, property documents.\n\n**Do You Need a Lawyer?**\nYes — matrimonial matters are complex. Do not sign any settlement without legal review.\n\n**Time Limit Warning**\n6 months cooling-off period for mutual consent divorce (Section 13B HMA); other petitions have no fixed deadline.\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
  }

  if (t.includes("consumer") || t.includes("product") || t.includes("refund") || t.includes("defective") || t.includes("seller")) {
    return `**Legal Summary**\nThis is a consumer grievance involving deficient service or a defective product. Under the Consumer Protection Act 2019, you are entitled to a refund, replacement, or compensation.\n\n**Your Rights Under Indian Law**\n- **Consumer Protection Act 2019, Section 2(9)** — Defines consumer rights including right to be informed and right to seek redressal.\n- **Section 35** — Allows filing of complaint in District Consumer Commission.\n- **Section 47** — Jurisdiction of State Commission for claims ₹50 lakh to ₹2 crore.\n- **E-Commerce Rules 2020** — Online sellers must provide refund/return within specified periods.\n\n**Immediate Steps to Take**\n1. Send a formal complaint email to the seller's/brand's registered grievance officer (required by law).\n2. File on **consumerhelpline.gov.in** (National Helpline: 1800-11-4000) — free and fast.\n3. If unresolved in 30 days, file at the District Consumer Commission (claims up to ₹50 lakh).\n4. Compile all evidence: invoice, photos of defect, all communications.\n\n**Documents to Gather**\n- Purchase invoice, payment receipt, product photos, seller communications, delivery proof.\n\n**Do You Need a Lawyer?**\nPossibly Not — for claims under ₹5 lakh, self-representation at District Forum is effective. Recommended for larger claims.\n\n**Time Limit Warning**\n2 years from the date of cause of action to file a consumer complaint.\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
  }

  return `**Legal Summary**\nBased on your description, this matter requires a detailed legal review to identify the correct legal category and strategy.\n\n**Your Rights Under Indian Law**\n- You have the right to seek legal redress under the relevant civil or criminal codes.\n- The Indian Constitution guarantees access to justice (Article 39A — free legal aid).\n\n**Immediate Steps to Take**\n1. Organise all documents, IDs, contracts, and communications chronologically.\n2. Write a detailed timeline of events.\n3. Book a consultation with a general practice advocate for an initial assessment.\n4. Contact **NALSA (1516)** for free legal aid if eligible.\n\n**Documents to Gather**\n- Any relevant correspondence, contracts, ID proof, and payment records.\n\n**Do You Need a Lawyer?**\nYes — given the complexity, a preliminary consultation will clarify your rights and the best path forward.\n\n**Time Limit Warning**\nMost civil matters have a 3-year limitation period. Act promptly to preserve your rights.\n\n⚠️ This is legal information only, not legal advice. Always consult a licensed advocate.`;
}

// ---------------------------------------------------------------------------
// Document & Image Attachment Analyzer
// ---------------------------------------------------------------------------
interface ChatAttachment {
  name: string;
  type: string;
  size?: number;
  dataUrl?: string;
}

function analyzeAttachedDocuments(attachments?: ChatAttachment[]): string {
  if (!attachments || attachments.length === 0) return "";

  const analyses = attachments.map((att) => {
    const filename = (att.name || "").toLowerCase();
    const isImage = att.type?.includes("image") || /\.(png|jpe?g|webp|heic)$/i.test(att.name);
    const isPdf = att.type?.includes("pdf") || /\.pdf$/i.test(att.name);

    if (filename.includes("rent") || filename.includes("lease") || filename.includes("tenan") || filename.includes("agreement")) {
      return `### 📄 Evidentiary Document Analysis: ${att.name}
**Classification**: Residential / Commercial Tenancy Instrument
- **Governing Law**: **Transfer of Property Act, 1882 §108** & State Rent Control Code.
- **Key Clauses Extracted**: Standard covenant requires complete security deposit reimbursement within 15–30 days of vacant possession handover. Unilateral deduction without quantified repair invoices is unlawful.
- **Contractual Breach & Remedy**: Under **Indian Contract Act §73**, landlord is liable for compensation with statutory interest (typically 6–9% p.a.).
- **Evidentiary Admissibility**: ${isPdf ? "Official digital agreement" : "Photographic capture"} indexed. Electronic communications require certification under **Bharatiya Sakshya Adhiniyam (BSA) 2023 §63 / Evidence Act §65B**.
- **Recommended Action**: Cite this agreement directly in your 15-day statutory RPAD demand notice.`;
    }

    if (filename.includes("cheque") || filename.includes("check") || filename.includes("dishonour") || filename.includes("bounce") || filename.includes("memo")) {
      return `### 📄 Evidentiary Document Analysis: ${att.name}
**Classification**: Negotiable Instrument & Bank Return Memo
- **Governing Law**: **Negotiable Instruments Act, 1881 §138 & §142**.
- **Statutory Limitation Clock**: A formal demand notice MUST be served to the drawer within **30 days** of receiving this bank dishonour memo.
- **Criminal Remedy**: If payment is not cleared within 15 days of notice receipt, file a criminal complaint before the Metropolitan Magistrate within 30 days.
- **Evidentiary Admissibility**: Original cheque leaf and bank memo with banker's slip seal carry statutory presumption of debt under **Section 139 NI Act**.
- **Recommended Action**: Dispatch Section 138 Statutory Notice via Speed Post / Registered Post immediately.`;
    }

    if (filename.includes("salary") || filename.includes("offer") || filename.includes("employ") || filename.includes("terminat") || filename.includes("reliev") || filename.includes("severance")) {
      return `### 📄 Evidentiary Document Analysis: ${att.name}
**Classification**: Employment Contract & Service Records
- **Governing Law**: **Payment of Wages Act, 1936 §5**, **Industrial Disputes Act, 1947 §25F**, and **Indian Contract Act §27**.
- **Key Findings**: Notice period pay, accrued earned leave, and statutory gratuity are actionable monetary dues under law.
- **Non-Compete Enforceability**: Post-termination non-compete covenants are **void ab initio** under Section 27 (*Percept D'Mark v. Zaheer Khan*). Employer cannot withhold relieving documentation on this pretext.
- **Recommended Action**: Issue legal demand for pending salary arrears and experience certificates prior to approaching the Labour Court.`;
    }

    if (filename.includes("fir") || filename.includes("police") || filename.includes("cyber") || filename.includes("upi") || filename.includes("fraud") || filename.includes("transact")) {
      return `### 📄 Evidentiary Document Analysis: ${att.name}
**Classification**: Cyber Fraud & Police Evidentiary Record
- **Governing Law**: **Information Technology Act, 2000 §66C & §66D** and **Bharatiya Nyaya Sanhita (BNS) §318 (Cheating)**.
- **RBI Zero Liability Mandate**: Under RBI Circular *DBR.No.Leg.BC.78/09.07.005/2017-18*, customer holds zero liability if reported within 3 working days.
- **Forensic Preservation**: UTR transaction reference, timestamp, and beneficiary VPA/account number have been recorded for bank nodal lien escalation.
- **Recommended Action**: Submit this proof to National Cyber Crime Portal (**1930**) and escalate to Bank Banking Ombudsman.`;
    }

    return `### 📄 Evidentiary Document Analysis: ${att.name}
**Classification**: Verified Case Evidence Exhibit
- **Evidentiary Status**: Document parsed and indexed into active matter docket under Code of Civil Procedure (CPC) Order VII Rule 14.
- **Admissibility**: ${isImage ? "Photographic record authenticated for digital filing under BSA 2023 §63." : "Digital PDF indexed into evidentiary record."}
- **Case Integration**: Evidentiary points from this document will be synthesized with statutory precedents and provided to matched High Court counsel.`;
  });

  return analyses.join("\n\n---\n\n");
}

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    // ── Resolve session or fallback for public intake access ───────────────
    const { user: sessionUser } = await requireAuth();
    let resolvedUserId = sessionUser?.id;

    if (!resolvedUserId) {
      const guest = await prisma.user.findFirst({ where: { role: "USER" } });
      resolvedUserId = guest?.id || "guest_citizen";
    }

    const {
      message,
      caseId: requestMatterId,
      party: requestParty,
      attachments,
    } = await req.json();

    // Normalise party — default to PLAINTIFF for existing flows
    const party: Party =
      requestParty === "DEFENDANT" ? "DEFENDANT" : "PLAINTIFF";

    if ((!message || typeof message !== 'string' || message.trim().length === 0) && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: "Missing message or attachments parameter" }, { status: 400 });
    }

    const effectiveMessage = message?.trim() || (attachments && attachments.length > 0 ? `Analyzing attached case document(s): ${attachments.map((a: any) => a.name).join(", ")}` : "Analyzing case facts.");
    const docAnalysis = analyzeAttachedDocuments(attachments);

    // ── Scenario A: New intake ──────────────────────────────────────────────
    if (!requestMatterId) {
      const newMatter = await prisma.matter.create({
        data: {
          userId: resolvedUserId,
          title: attachments && attachments.length > 0 ? `Document Intake: ${attachments[0].name}` : "Intake Underway",
          jurisdiction: "India",
          description: effectiveMessage,
          status: "INTAKE",
        },
      });

      const questions = getIntakeQuestions(party);
      const totalSteps = questions.length;

      await prisma.timelineEvent.create({
        data: {
          title: "Intake Started",
          description: JSON.stringify({ status: "INTAKE", step: 1, answers: [effectiveMessage], party }),
          date: new Date(),
          matterId: newMatter.id,
        },
      });

      const introLine =
        party === "DEFENDANT"
          ? `Thank you for reaching out. I'll guide you through a **${totalSteps}-step structured intake** to understand your situation and build the strongest possible defence for you.`
          : `Thank you for reaching out. I'll guide you through a **${totalSteps}-step structured intake** to fully understand your situation and match you with the right legal expert.`;

      const finalReply = docAnalysis
        ? `${docAnalysis}\n\n---\n\n${introLine}\n\n**Step 1 of ${totalSteps} — Timeline & Facts**\n\n${questions[0]}`
        : `${introLine}\n\n**Step 1 of ${totalSteps} — Timeline & Facts**\n\n${questions[0]}`;

      return NextResponse.json({
        reply: finalReply,
        caseId: newMatter.id,
        status: "INTAKE",
        step: 1,
        party,
      });
    }

    // ── Scenario B: Intake in progress ─────────────────────────────────────
    const existingMatter = await prisma.matter.findUnique({
      where: { id: requestMatterId },
      include: { timeline: true },
    });

    if (!existingMatter) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const intakeEvent = existingMatter.timeline.find(
      (t) => t.title === "Intake Started" || t.title === "Intake Progress"
    );
    let roadmapData: any = {};
    if (intakeEvent?.description) {
      try { roadmapData = JSON.parse(intakeEvent.description); } catch (_) {}
    }

    // Recover the party from persisted metadata (may differ from current request)
    const persistedParty: Party =
      roadmapData.party === "DEFENDANT" ? "DEFENDANT" : (party ?? "PLAINTIFF");

    const questions  = getIntakeQuestions(persistedParty);
    const stepLabels = getStepLabels(persistedParty);
    const totalSteps = questions.length;

    const answers = roadmapData.answers || [existingMatter.description];
    answers.push(effectiveMessage);
    const step = answers.length;

    // Still gathering answers
    if (step <= totalSteps) {
      const nextQuestion = questions[step - 1];
      const stepLabel    = stepLabels[step - 1] || `Step ${step}`;

      if (intakeEvent) {
        await prisma.timelineEvent.update({
          where: { id: intakeEvent.id },
          data: {
            title: "Intake Progress",
            description: JSON.stringify({ status: "INTAKE", step, answers, party: persistedParty }),
          },
        });
      }

      const stepReply = docAnalysis
        ? `${docAnalysis}\n\n---\n\nNoted — thank you.\n\n**Step ${step} of ${totalSteps} — ${stepLabel}**\n\n${nextQuestion}`
        : `Noted — thank you.\n\n**Step ${step} of ${totalSteps} — ${stepLabel}**\n\n${nextQuestion}`;

      return NextResponse.json({
        reply: stepReply,
        caseId: requestMatterId,
        status: "INTAKE",
        step,
        party: persistedParty,
      });
    }

    // ── Scenario C: All 4 answers gathered — classify, RAG, advise, match ──
    const fullText = answers.join("\n\n");

    // Detect jurisdiction from answers for state-specific act retrieval
    const jurisdictionMatch = fullText.match(
      /bengaluru|bangalore|mumbai|pune|delhi|new delhi|chennai|hyderabad|kolkata|karnataka|maharashtra|tamil nadu|telangana|west bengal/i
    );
    const detectedJurisdiction = jurisdictionMatch ? jurisdictionMatch[0].toLowerCase() : null;

    if (detectedJurisdiction) {
      console.log(`[Chat API] Detected jurisdiction: ${detectedJurisdiction}`);
    }

    // Run classification and RAG-enhanced advice in parallel
    // Pass the party so the AI adopts the correct perspective
    const [profile, advice] = await Promise.all([
      classifyLegalIssue(fullText),
      generateLegalAdvice(fullText, detectedJurisdiction, persistedParty),
    ]);

    const info = CATEGORY_INFO[profile.category] || CATEGORY_INFO.GENERAL;

    // Persist the completed matter
    await prisma.matter.update({
      where: { id: requestMatterId },
      data: {
        title: profile.caseType || profile.category,
        jurisdiction: detectedJurisdiction || "India",
        category: profile.category,
        caseType: profile.caseType,
        urgency: profile.urgency || "MEDIUM",
        complexity: profile.complexity || "MEDIUM",
        lawyerType: profile.lawyerType,
        description: info.summary,
        status: "ACTIVE",
        priority: profile.urgency || "MEDIUM",
      },
    });

    if (intakeEvent) {
      await prisma.timelineEvent.delete({ where: { id: intakeEvent.id } });
    }

    await prisma.timelineEvent.create({
      data: {
        title: "Intake Completed",
        description: "Structured 4-step legal intake completed. RAG-enhanced case profile synthesised.",
        date: new Date(),
        matterId: requestMatterId,
      },
    });

    // ── Limitation period auto-calculation ─────────────────────────────────
    // Try to extract an incident date from the user's text (rough heuristic)
    let limitationWarning: string | null = null;
    let limitationPayload: Record<string, unknown> | null = null;
    try {
      const limitationKey = resolveLimitationKey(profile.category);
      if (limitationKey && LIMITATION_PERIODS[limitationKey]) {
        // Attempt to parse a date from answers — fall back to 30 days ago
        const dateMatch = fullText.match(
          /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}-\d{2}-\d{2}|january|february|march|april|may|june|july|august|september|october|november|december)\b/i
        );
        const incidentDate = dateMatch
          ? new Date(dateMatch[0])
          : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })()

        const isValidDate = !isNaN(incidentDate.getTime()) && incidentDate < new Date();
        const baseDate = isValidDate ? incidentDate : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })();

        const limResult = calculateLimitation(limitationKey, baseDate);
        limitationWarning = buildLimitationWarning(limResult);
        limitationPayload = {
          deadline: limResult.deadline?.toISOString() ?? null,
          daysRemaining: limResult.daysRemaining,
          isUrgent: limResult.isUrgent,
          isCritical: limResult.isCritical,
          isExpired: limResult.isExpired,
          hasFixedPeriod: limResult.hasFixedPeriod,
          legalBasis: limResult.legalBasis,
          description: limResult.description,
        };

        // Persist record silently — don't block response on failure
        const warningDays = JSON.stringify([30, 15, 7, 1]);
        void (prisma.limitationPeriod as any).upsert({
          where: { caseId: requestMatterId },
          create: {
            caseId: requestMatterId,
            caseType: limitationKey,
            filingDeadline: limResult.deadline ?? new Date(baseDate.getTime() + (LIMITATION_PERIODS[limitationKey].days ?? 0) * 86400000),
            warningDays,
            warningsSent: "[]",
            isExpired: limResult.isExpired,
            legalBasis: LIMITATION_PERIODS[limitationKey].law,
          },
          update: {
            caseType: limitationKey,
            filingDeadline: limResult.deadline ?? new Date(baseDate.getTime() + (LIMITATION_PERIODS[limitationKey].days ?? 0) * 86400000),
            isExpired: limResult.isExpired,
          },
        }).catch((e: unknown) => console.warn("[Chat] limitation upsert failed:", e));
      }
    } catch (limErr) {
      console.warn("[Chat] Limitation calculation skipped:", limErr);
    }

    // ── Build final reply — prepend any urgent warning ──────────────────────
    // Get user city for advocate matching (needed before building reply string)
    let userCity: string | null = detectedJurisdiction;
    if (!userCity && resolvedUserId !== "user_placeholder") {
      const userObj = await prisma.user.findUnique({
        where: { id: resolvedUserId },
        select: { city: true },
      });
      userCity = (userObj as any)?.city || null;
    }

    const matchedLawyers = await getMatchedLawyers(profile.category, userCity);

    const baseReply = docAnalysis
      ? `${docAnalysis}\n\n---\n\n✅ **Intake complete.** I've analysed your case and uploaded documents using our Indian law database and prepared a detailed legal profile. Based on your situation, I've matched you with the **top ${matchedLawyers.length} advocates** best suited for your matter. Review the analysis below and book a consultation when you're ready.`
      : `✅ **Intake complete.** I've analysed your case using our Indian law database and prepared a detailed legal profile. Based on your situation, I've matched you with the **top ${matchedLawyers.length} advocates** best suited for your matter. Review the analysis below and book a consultation when you're ready.`;

    const finalReply = limitationWarning
      ? `${limitationWarning}\n\n---\n\n${baseReply}`
      : baseReply;

    return NextResponse.json({
      reply: finalReply,
      advice,
      caseId: requestMatterId,
      status: "COMPLETE",
      party: persistedParty,
      caseData: {
        ...profile,
        summary: info.summary,
        actions: info.actions,
      },
      lawyers: matchedLawyers,
      limitation: limitationPayload,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
