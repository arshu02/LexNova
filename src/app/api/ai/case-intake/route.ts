/**
 * LexNova — Case Intake API Route
 *
 * Two-phase conversational pipeline:
 *   Phase "understand" — AI asks domain-specific clarifying questions
 *   Phase "analyze"   — AI produces a structured JSON case analysis
 */

import { NextRequest, NextResponse } from "next/server";
import {
  detectIntakeCategory,
  getUnderstandingSystemPrompt,
  getAnalysisSystemPrompt,
  STATIC_FALLBACK_QUESTIONS,
  IntakeCaseCategory,
} from "@/lib/intake-prompts";
import { dispatchAIGateway, AIMessage } from "@/lib/ai-gateway";

export const runtime = "nodejs";
export const maxDuration = 45;

// ─── Request / Response Types ─────────────────────────────────────────────────

interface IntakeMessage {
  role: "user" | "assistant";
  content: string;
}

interface IntakeRequest {
  messages: IntakeMessage[];
  phase: "understand" | "analyze";
  category?: IntakeCaseCategory;
}

// ─── POST /api/ai/case-intake ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IntakeRequest;
    const { messages, phase } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Detect case category from the FIRST user message
    const firstUserMessage = messages.find((m) => m.role === "user")?.content || "";
    const category = body.category || detectIntakeCategory(firstUserMessage);

    // ── Phase 1: Case Understanding ──────────────────────────────────────────
    if (phase === "understand") {
      // If no API key, return static fallback questions
      if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
        const fallback = STATIC_FALLBACK_QUESTIONS[category];
        const formatted = `${fallback.acknowledgment}\n\nTo understand your case better, I need a few details:\n\n${fallback.questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")}\n\nYour answers will help me map the exact legal pathway and match you with the right advocate.`;
        return NextResponse.json({
          content: formatted,
          category,
          phase: "understand",
          isFallback: true,
        });
      }

      const systemPrompt = getUnderstandingSystemPrompt(category);
      const aiMessages: AIMessage[] = messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await dispatchAIGateway({
        messages: aiMessages,
        systemPrompt,
        temperature: 0.4,
        maxTokens: 800,
        enableCache: false, // Intake is always fresh
        enablePIIRedaction: true,
        modelTier: "STANDARD",
      });

      return NextResponse.json({
        content: response.content,
        category,
        phase: "understand",
        provider: response.provider,
        // Signal to client whether context gathering is complete
        contextComplete: response.content.includes("[CASE_CONTEXT_COMPLETE]"),
      });
    }

    // ── Phase 2: Case Analysis ───────────────────────────────────────────────
    if (phase === "analyze") {
      // If no API key, use static fallback analysis
      if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
        const fallbackAnalysis = buildFallbackAnalysis(category, firstUserMessage);
        return NextResponse.json({
          content: JSON.stringify(fallbackAnalysis),
          category,
          phase: "analyze",
          isFallback: true,
        });
      }

      const systemPrompt = getAnalysisSystemPrompt(category);
      const aiMessages: AIMessage[] = messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await dispatchAIGateway({
        messages: aiMessages,
        systemPrompt,
        temperature: 0.2, // Low temp for structured JSON output
        maxTokens: 3000,
        enableCache: true,
        enablePIIRedaction: true,
        modelTier: "PREMIUM",
      });

      // Clean the response - strip any accidental markdown code fences
      let cleanedContent = response.content.trim();
      if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "")
          .trim();
      }

      // Validate it's parseable JSON; if not, return fallback
      try {
        JSON.parse(cleanedContent);
      } catch {
        console.warn("[CaseIntake] AI returned non-JSON, using fallback analysis");
        const fallbackAnalysis = buildFallbackAnalysis(category, firstUserMessage);
        return NextResponse.json({
          content: JSON.stringify(fallbackAnalysis),
          category,
          phase: "analyze",
          isFallback: true,
        });
      }

      return NextResponse.json({
        content: cleanedContent,
        category,
        phase: "analyze",
        provider: response.provider,
        latencyMs: response.latencyMs,
      });
    }

    return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
  } catch (error) {
    console.error("[CaseIntake] API error:", error);
    return NextResponse.json(
      { error: "Internal server error during case intake" },
      { status: 500 }
    );
  }
}

// ─── Static Fallback Analysis (no API key scenario) ───────────────────────────

function buildFallbackAnalysis(category: IntakeCaseCategory, _description: string) {
  const FALLBACK_MAP: Record<IntakeCaseCategory, object> = {
    PROPERTY_TENANCY: {
      category: "PROPERTY_TENANCY",
      subCategory: "Property / Tenancy Dispute",
      caseType: "Property Dispute",
      urgency: "MEDIUM",
      complexity: "MEDIUM",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "Property Lawyer",
      summary: "This appears to be a property or tenancy dispute. The legal remedies include a statutory demand notice under the Transfer of Property Act and, if unresolved, civil litigation before the appropriate court.",
      statutesCited: ["Transfer of Property Act 1882 §108", "Specific Relief Act 1963", "Rent Control Act (State-specific)"],
      limitationPeriod: "3 years from the date of cause of action",
      limitationUrgent: false,
      legalPathways: [
        "Send a formal legal demand notice under Transfer of Property Act §108",
        "File a civil suit for recovery in appropriate Civil Court",
        "File a RERA complaint (if builder dispute)",
        "Explore mediation through Lok Adalat",
      ],
      requiredDocuments: [
        "Rent Agreement / Sale Deed",
        "Security Deposit Payment Receipt",
        "Vacating Notice / Possession Letter",
        "Bank Statement showing deposit payment",
        "Correspondence with landlord/builder",
        "Property Tax Records",
        "Identity Proof",
      ],
      nextActions: [
        "Gather all documents related to your agreement and payments",
        "Send a formal demand notice via Speed Post / Registered Post",
        "Keep a record of all communications going forward",
        "Consult a Property Lawyer for a detailed assessment",
        "If no response in 15 days, file a civil suit for recovery",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Landlord/Builder\n[Address]\n\nSub: Legal Notice for Recovery of Security Deposit / Dues\n\nSir/Madam,\n\nI, the undersigned, hereby issue this legal notice on behalf of my client who has suffered loss and damages due to your failure to discharge your legal obligations. My client had entered into a valid tenancy/purchase agreement with you and has duly fulfilled all obligations thereunder. Despite repeated requests, you have failed to refund the security deposit/dues as legally mandated under the Transfer of Property Act 1882.\n\nYou are hereby called upon to refund the full amount along with interest at 18% per annum within 15 (fifteen) days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings before the competent court without further notice, at your entire risk and cost.\n\nIssued without prejudice to all legal rights and remedies.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 500,
        total: 500,
      },
    },
    LABOUR_EMPLOYMENT: {
      category: "LABOUR_EMPLOYMENT",
      subCategory: "Employment Dispute",
      caseType: "Labour Dispute",
      urgency: "MEDIUM",
      complexity: "MEDIUM",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "Labour & Employment Lawyer",
      summary: "This is an employment dispute involving unpaid dues or wrongful termination. Indian labour laws provide strong protections including the right to recover unpaid wages, PF, gratuity, and to challenge illegal termination before the Labour Court.",
      statutesCited: ["Payment of Wages Act 1936 §15", "Industrial Disputes Act 1947 §25F", "EPF Act 1952", "Payment of Gratuity Act 1972", "BNSS 2023"],
      limitationPeriod: "1 year from date of cause of action under Payment of Wages Act; 3 years for others",
      limitationUrgent: false,
      legalPathways: [
        "Send a legal demand notice for all unpaid dues",
        "File a complaint under Payment of Wages Act before Labour Court",
        "Challenge wrongful termination before Industrial Tribunal",
        "File PF/EPFO grievance on EPFO Unified Portal",
        "Approach National Company Law Tribunal (NCLT) if insolvency involved",
      ],
      requiredDocuments: [
        "Employment Contract / Offer Letter",
        "Salary Slips (last 3-6 months)",
        "Bank Statements showing salary credits",
        "Termination Letter / Resignation Acceptance",
        "PF UAN Number and EPFO Statement",
        "HR communications and emails",
        "Experience/Relieving Letter (if withheld)",
      ],
      nextActions: [
        "Document all unpaid amounts with evidence (payslips, bank statements)",
        "Send a formal legal notice to HR and Company Secretary via Registered Post",
        "File a complaint on EPFO portal for PF issues",
        "File a grievance with Ministry of Labour's Shram Suvidha Portal",
        "Consult a Labour Lawyer for court proceedings if no response within 15 days",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Director / HR Manager\n[Company Name & Address]\n\nSub: Legal Notice for Recovery of Unpaid Salary and Statutory Dues\n\nSir/Madam,\n\nThis legal notice is issued on behalf of my client, a former employee of your organization. My client served your organization faithfully and is legally entitled to all salary arrears, PF contributions, gratuity, and other statutory dues as per the terms of employment and applicable Indian labour laws including the Payment of Wages Act 1936 and Industrial Disputes Act 1947.\n\nDespite completion of the notice period/termination, you have failed to release the outstanding dues amounting to the sum owed. You are hereby called upon to release all pending dues along with the relieving letter within 15 (fifteen) days of receipt of this notice.\n\nFailure to comply will compel my client to initiate appropriate proceedings before the Labour Court and relevant statutory authorities, at your risk and cost.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 300,
        total: 300,
      },
    },
    CRIMINAL_CYBER: {
      category: "CRIMINAL_CYBER",
      subCategory: "Criminal / Cyber Offence",
      caseType: "Criminal Complaint",
      urgency: "HIGH",
      complexity: "HIGH",
      city: null,
      estimatedClaimValue: null,
      caseFlags: ["FIR_PENDING"],
      lawyerType: "Criminal Lawyer",
      summary: "This is a criminal or cyber crime matter. Immediate evidence preservation and FIR filing are critical. Delay can result in loss of evidence and weaken the legal position.",
      statutesCited: ["IT Act 2000 §66C, §66D", "IPC 1860 §420, §406", "BNSS 2023", "NI Act 1881 §138 (if cheque bounce)"],
      limitationPeriod: "FIR must ideally be filed immediately; cheque bounce notice within 30 days of dishonor",
      limitationUrgent: true,
      legalPathways: [
        "File an FIR at the nearest police station or Cyber Crime Portal (cybercrime.gov.in)",
        "File a cheque bounce demand notice within 30 days (if NI Act §138 applies)",
        "Approach the State Cyber Cell for digital fraud",
        "File a complaint with RBI Banking Ombudsman (for bank/UPI fraud)",
        "Seek anticipatory bail if criminal countercase is feared",
      ],
      requiredDocuments: [
        "FIR Copy (or complaint ready to file)",
        "Transaction Screenshots / Bank Statements",
        "Chat Messages / Call Records as Evidence",
        "Identity Documents (Aadhaar, PAN)",
        "Cheque Copy + Bank Dishonor Memo (if cheque bounce)",
        "Witness Statements",
        "Medical Reports (if physical assault)",
      ],
      nextActions: [
        "IMMEDIATELY preserve all digital evidence — screenshots, transaction records, call logs",
        "File a complaint at cybercrime.gov.in or visit the nearest Cyber Crime Cell",
        "For UPI/banking fraud, call the National Cyber Crime Helpline: 1930 within 24 hours",
        "If cheque bounce, issue demand notice within 30 days of dishonor memo",
        "Consult a Criminal Lawyer immediately for FIR strategy and bail provisions",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Accused / Respondent\n[Name & Address]\n\nSub: Legal Notice — Criminal Complaint and Demand for Restitution\n\nSir/Madam,\n\nThis notice is issued on behalf of my client who has been a victim of a criminal offense / cyber fraud perpetrated by you. The acts committed by you constitute offenses punishable under the Information Technology Act 2000 and Indian Penal Code / BNSS 2023.\n\nYou are hereby called upon to immediately make restitution of the entire amount misappropriated, failing which my client shall file a formal police complaint, FIR, and criminal complaint before the competent Magistrate Court, without further notice.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 200,
        total: 200,
      },
    },
    FAMILY_MATRIMONIAL: {
      category: "FAMILY_MATRIMONIAL",
      subCategory: "Matrimonial Dispute",
      caseType: "Family Matter",
      urgency: "HIGH",
      complexity: "HIGH",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "Family Law Specialist",
      summary: "This is a family or matrimonial dispute. Indian family law provides comprehensive remedies including divorce, custody, maintenance, and domestic violence protection depending on the specific facts.",
      statutesCited: ["Hindu Marriage Act 1955", "Protection of Women from DV Act 2005", "Hindu Adoption and Maintenance Act 1956", "Guardians and Wards Act 1890", "IPC §498A"],
      limitationPeriod: "1 year for DV Act applications; 3 years for maintenance; 1 year from last act of cruelty for 498A",
      limitationUrgent: false,
      legalPathways: [
        "File for divorce under Hindu Marriage Act (contested or mutual consent)",
        "Apply for interim maintenance under HAMA §18/§125 CrPC",
        "Apply for Protection Order under DV Act (urgent, ex-parte available)",
        "File custody petition under Guardians and Wards Act",
        "Attempt mediation through court-appointed Family Mediation Centre",
      ],
      requiredDocuments: [
        "Marriage Certificate",
        "Birth Certificates (of children, if applicable)",
        "Proof of Income of both parties",
        "Property and Asset Documents",
        "Residence Proof of both parties",
        "Evidence of cruelty or domestic violence (medical reports, photos, messages)",
        "Bank statements showing financial dependency",
      ],
      nextActions: [
        "Document all evidence of the dispute with dates and witnesses",
        "If DV is involved, immediately contact a DV protection officer or police",
        "Consult a Family Law specialist for a detailed assessment of your rights",
        "Explore family mediation as a first step to reduce litigation costs",
        "Apply for interim maintenance if financial support is needed immediately",
      ],
      draftNotice: "Without Prejudice\n\nTo,\n[Respondent's Name & Address]\n\nSub: Legal Notice for Matrimonial Dispute / Maintenance\n\nSir/Madam,\n\nThis legal notice is issued on behalf of my client in the matrimonial dispute between the parties. Despite the legal obligations arising from the matrimonial relationship, you have failed to discharge your duties including payment of maintenance and proper care of the minor children, if any.\n\nYou are called upon to comply with your legal obligations under the applicable matrimonial laws within 15 (fifteen) days, failing which my client shall initiate appropriate proceedings before the Family Court.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 500,
        total: 500,
      },
    },
    CORPORATE_CONTRACT: {
      category: "CORPORATE_CONTRACT",
      subCategory: "Contract / Commercial Dispute",
      caseType: "Corporate Dispute",
      urgency: "MEDIUM",
      complexity: "HIGH",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "Corporate / Commercial Lawyer",
      summary: "This is a corporate or contract dispute. The strength of your claim depends significantly on the documentation available, including signed contracts, invoices, and communications evidencing the breach.",
      statutesCited: ["Indian Contract Act 1872 §73, §74", "Specific Relief Act 1963", "Arbitration & Conciliation Act 1996", "MSME Development Act 2006", "Companies Act 2013"],
      limitationPeriod: "3 years from date of breach for contract claims; 45 days for MSME payment disputes",
      limitationUrgent: false,
      legalPathways: [
        "Send a formal demand letter for performance or damages",
        "Invoke arbitration clause (if present) for faster resolution",
        "File a commercial suit in Commercial Court under Commercial Courts Act",
        "File MSME Samadhaan complaint (if counterparty is MSME)",
        "Seek injunction to prevent asset dissipation under Specific Relief Act",
      ],
      requiredDocuments: [
        "Signed Contract / Service Agreement",
        "All Invoices and Purchase Orders",
        "Payment Records and Bank Statements",
        "Email Correspondence with Counterparty",
        "Company Registration Documents",
        "NDA (if applicable)",
        "Prior demand letters or notices sent",
      ],
      nextActions: [
        "Compile and organize all contract-related documents immediately",
        "Send a formal demand notice to the counterparty via Registered Post",
        "Review the contract for arbitration, jurisdiction, and limitation clauses",
        "If MSME: file on MSME Samadhaan Portal (msmesamadhaan.gov.in)",
        "Consult a Corporate Lawyer for a litigation or arbitration strategy",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Director / Partner\n[Company Name & Address]\n\nSub: Legal Notice for Breach of Contract / Non-Payment of Dues\n\nSir/Madam,\n\nThis legal notice is issued on behalf of my client in connection with the contractual obligations arising from the agreement executed between the parties. In breach of the explicit contractual terms and your obligations under the Indian Contract Act 1872, you have failed to make payment / perform your obligations despite repeated reminders.\n\nYou are hereby called upon to settle the full outstanding amount along with applicable interest within 15 (fifteen) days of receipt of this notice, failing which my client shall invoke arbitration proceedings and/or initiate a commercial suit before the competent Commercial Court, at your entire risk, cost, and consequences.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 1000,
        total: 1000,
      },
    },
    CONSUMER_GRIEVANCE: {
      category: "CONSUMER_GRIEVANCE",
      subCategory: "Consumer Protection Complaint",
      caseType: "Consumer Grievance",
      urgency: "MEDIUM",
      complexity: "LOW",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "Consumer Protection Lawyer",
      summary: "This is a consumer grievance. The Consumer Protection Act 2019 provides strong remedies including refund, replacement, compensation, and punitive damages for unfair trade practices and service deficiency.",
      statutesCited: ["Consumer Protection Act 2019", "CPA §35 (District Commission)", "CPA §47 (State Commission)", "CPA §58 (National Commission)"],
      limitationPeriod: "2 years from date of cause of action",
      limitationUrgent: false,
      legalPathways: [
        "Send a formal consumer complaint notice to the seller/service provider",
        "File a complaint on the National Consumer Helpline (consumerhelpline.gov.in)",
        "File a complaint before the District Consumer Commission (up to ₹50 lakhs)",
        "File before State Consumer Commission (₹50L - ₹2Cr)",
        "File before National Consumer Commission (above ₹2Cr)",
      ],
      requiredDocuments: [
        "Purchase Invoice / Receipt",
        "Payment Proof (bank statement, UPI screenshot)",
        "Product Photos / Evidence of Defect",
        "Seller/Company Communications (emails, chat)",
        "National Consumer Helpline complaint number (if filed)",
        "Warranty Card / Service Agreement",
        "Any prior complaints or escalation records",
      ],
      nextActions: [
        "Gather all purchase receipts, payment records, and evidence of the defect/issue",
        "Send a formal notice to the seller/company demanding resolution within 15 days",
        "File a complaint on the National Consumer Helpline: 1800-11-4000",
        "If no response, file at the appropriate Consumer Commission (check claim amount for jurisdiction)",
        "Consult a Consumer Lawyer for complex or high-value claims",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Manager / Director\n[Company / Seller Name & Address]\n\nSub: Consumer Legal Notice — Deficiency in Service / Defective Product\n\nSir/Madam,\n\nThis legal notice is issued on behalf of my client, a consumer as defined under the Consumer Protection Act 2019. My client purchased [product/service] from your establishment on [date] and paid a sum of ₹[amount]. The [product/service] was found to be defective/deficient in the following manner: [describe defect].\n\nDespite repeated complaints, you have failed to provide a refund, replacement, or adequate remedy. You are hereby called upon to provide a full refund/replacement and pay compensation within 15 (fifteen) days of this notice.\n\nFailure to do so will compel my client to file a complaint before the District Consumer Commission under the Consumer Protection Act 2019, claiming refund, compensation, and litigation costs.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 200,
        total: 200,
      },
    },
    GENERAL: {
      category: "GENERAL",
      subCategory: "General Legal Matter",
      caseType: "General Legal Inquiry",
      urgency: "LOW",
      complexity: "MEDIUM",
      city: null,
      estimatedClaimValue: null,
      caseFlags: [],
      lawyerType: "General Practice Lawyer",
      summary: "This is a general legal matter requiring further assessment by a qualified advocate. The specific legal pathway will depend on the full facts of the case.",
      statutesCited: ["Code of Civil Procedure 1908", "BNSS 2023", "Limitation Act 1963"],
      limitationPeriod: "3 years (general civil claims); varies by specific cause of action",
      limitationUrgent: false,
      legalPathways: [
        "Consult a qualified advocate for a thorough case assessment",
        "Attempt amicable resolution or mediation first",
        "File a civil suit if rights are being violated",
        "Approach the appropriate statutory authority or forum",
      ],
      requiredDocuments: [
        "All relevant correspondence and agreements",
        "Identity Proof (Aadhaar/PAN)",
        "Any receipts or payment records",
        "Witness details if applicable",
      ],
      nextActions: [
        "Gather all documents related to your matter",
        "Write a detailed timeline of events",
        "Consult a General Practice or Specialist Lawyer based on the nature of the dispute",
        "Consider sending a preliminary demand letter before litigation",
        "Explore mediation or Lok Adalat as a cost-effective first step",
      ],
      draftNotice: "Without Prejudice\n\nTo,\nThe Respondent\n[Name & Address]\n\nSub: Legal Notice\n\nSir/Madam,\n\nThis legal notice is issued on behalf of my client regarding the dispute arising out of the matter between the parties. You are called upon to resolve this matter within 15 (fifteen) days of receipt of this notice, failing which appropriate legal action will be initiated.\n\nYours faithfully,\n[Advocate Name]\n[Bar Council Registration No.]",
      claimQuantification: {
        principal: 0,
        interest: 0,
        compensation: 0,
        courtFee: 200,
        total: 200,
      },
    },
  };

  return FALLBACK_MAP[category] || FALLBACK_MAP["GENERAL"];
}
