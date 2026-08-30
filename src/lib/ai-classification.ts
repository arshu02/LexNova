import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export type CaseCategory =
  | "PROPERTY_DISPUTE"
  | "LABOUR_DISPUTE"
  | "CONSUMER_GRIEVANCE"
  | "CRIMINAL_CYBER"
  | "FAMILY_DIVORCE"
  | "CORPORATE_CONTRACT"
  | "GENERAL";

export type Complexity = "LOW" | "MEDIUM" | "HIGH";
export type Urgency = "LOW" | "MEDIUM" | "HIGH";

export interface ClassificationResult {
  category: CaseCategory;
  caseType: string;
  urgency: Urgency;
  complexity: Complexity;
  lawyerType: string;
  required_documents: string[];
}

export const CATEGORY_INFO: Record<CaseCategory, { summary: string; actions: string[] }> = {
  PROPERTY_DISPUTE: {
    summary: "A conflict over property possession, title, or tenancy agreements. This typically requires verification of land records and potential civil litigation for recovery or injunction.",
    actions: ["Verify land/rent records at the local registry", "Issue a formal legal notice to the opposing party", "Arrange a consultation with a property expert"],
  },
  LABOUR_DISPUTE: {
    summary: "A dispute regarding employment rights, unpaid salary, or wrongful termination.",
    actions: ["Compile employment contracts and pay slips", "Send a formal grievance to HR", "Draft a legal notice for unpaid dues"],
  },
  CONSUMER_GRIEVANCE: {
    summary: "A claim against deficient service or defective products requiring consumer forum intervention.",
    actions: ["Gather purchase invoices and communications", "Send a legal notice to the service provider", "File a complaint on the National Consumer Helpline"],
  },
  CRIMINAL_CYBER: {
    summary: "A criminal offense or digital fraud requiring immediate police attention and evidence preservation.",
    actions: ["File an FIR at the nearest police station", "Preserve all digital/physical evidence", "Consult a criminal defense expert immediately"],
  },
  FAMILY_DIVORCE: {
    summary: "A matter involving marital status, custody, domestic violence, or maintenance.",
    actions: ["Schedule family counseling or mediation", "Gather financial and residency proofs", "Consult a family law expert for interim applications"],
  },
  CORPORATE_CONTRACT: {
    summary: "A commercial dispute involving contracts, partnerships, or corporate compliance matters.",
    actions: ["Audit current contract compliance", "Send a formal demand letter", "Prepare for out-of-court settlement talks"],
  },
  GENERAL: {
    summary: "A general legal inquiry requiring further context.",
    actions: ["Provide more details for a deep analysis", "Consult a general practice advocate"],
  },
};

export async function classifyLegalIssue(description: string): Promise<ClassificationResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Fallback logic if no API key is provided
    console.warn("No ANTHROPIC_API_KEY found. Falling back to keyword classification.");
    return fallbackClassification(description);
  }

  try {
    const prompt = `You are an expert Indian Legal AI Assistant classifying a new legal intake.

Analyze the following user's legal description:
"${description}"

Classify it and output ONLY a raw JSON object with NO markdown formatting, NO \`\`\`json blocks, and NO surrounding text. It must conform to this exact structure:

{
  "category": "One of: PROPERTY_DISPUTE, LABOUR_DISPUTE, CONSUMER_GRIEVANCE, CRIMINAL_CYBER, FAMILY_DIVORCE, CORPORATE_CONTRACT, GENERAL",
  "caseType": "A short 2-4 word human-readable string (e.g. 'Unpaid Salary', 'Cyber Fraud', 'Divorce Proceedings')",
  "urgency": "One of: LOW, MEDIUM, HIGH",
  "complexity": "One of: LOW, MEDIUM, HIGH",
  "lawyerType": "The type of lawyer needed (e.g. 'Labour Lawyer', 'Property Lawyer', 'Criminal Lawyer', 'Corporate Lawyer')",
  "required_documents": ["List of 2-4 specific documents the user should gather"]
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: "You are a legal categorization AI. You output strict JSON only.",
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== 'text') throw new Error("No text content returned");

    const jsonStr = textContent.text.trim();
    return JSON.parse(jsonStr) as ClassificationResult;
  } catch (error) {
    console.error("AI Classification Error:", error);
    return fallbackClassification(description);
  }
}

function fallbackClassification(text: string): ClassificationResult {
  const t = text.toLowerCase();

  // LABOUR / EMPLOYMENT
  if (t.includes("salary") || t.includes("job") || t.includes("employer") ||
      t.includes("fired") || t.includes("terminated") || t.includes("employment") ||
      t.includes("workplace") || t.includes("wages") || t.includes("severance") ||
      t.includes("notice period") || t.includes("provident") || t.includes("gratuity")) {
    return {
      category: "LABOUR_DISPUTE",
      caseType: "Employment Dispute",
      urgency: "MEDIUM",
      complexity: "LOW",
      lawyerType: "Employment Lawyer",
      required_documents: ["Employment Contract", "Bank Statements", "HR Communications", "Termination Letter"],
    };
  }

  // PROPERTY / TENANCY
  if (t.includes("property") || t.includes("tenant") || t.includes("landlord") ||
      t.includes("deposit") || t.includes("rent") || t.includes("vacated") ||
      t.includes("eviction") || t.includes("lease") || t.includes("flat") ||
      t.includes("house") || t.includes("plot") || t.includes("land")) {
    return {
      category: "PROPERTY_DISPUTE",
      caseType: "Property / Tenancy Dispute",
      urgency: "MEDIUM",
      complexity: "MEDIUM",
      lawyerType: "Property Lawyer",
      required_documents: ["Rent/Sale Agreement", "Deposit Payment Proof", "Vacating Notice", "Correspondence with Landlord"],
    };
  }

  // CONSUMER GRIEVANCE
  if (t.includes("consumer") || t.includes("refund") || t.includes("defective") ||
      t.includes("fake") || t.includes("fraud") || t.includes("online") ||
      t.includes("flipkart") || t.includes("amazon") || t.includes("product") ||
      t.includes("seller") || t.includes("purchase") || t.includes("ncdrc") ||
      t.includes("cheated") || t.includes("scam")) {
    return {
      category: "CONSUMER_GRIEVANCE",
      caseType: "Consumer Fraud / Deficiency",
      urgency: "MEDIUM",
      complexity: "LOW",
      lawyerType: "Consumer Lawyer",
      required_documents: ["Purchase Invoice", "Payment Receipt", "Product Photos", "Seller Communications"],
    };
  }

  // FAMILY / DIVORCE
  if (t.includes("divorce") || t.includes("custody") || t.includes("maintenance") ||
      t.includes("alimony") || t.includes("matrimonial") || t.includes("domestic violence") ||
      t.includes("husband") || t.includes("wife") || t.includes("marriage") ||
      t.includes("children") || t.includes("child support") || t.includes("family court")) {
    return {
      category: "FAMILY_DIVORCE",
      caseType: "Family / Matrimonial Dispute",
      urgency: "HIGH",
      complexity: "HIGH",
      lawyerType: "Family Lawyer",
      required_documents: ["Marriage Certificate", "Birth Certificates", "Financial Statements", "Court Notices"],
    };
  }

  // CRIMINAL / CYBER
  if (t.includes("fir") || t.includes("criminal") || t.includes("cyber") ||
      t.includes("hack") || t.includes("theft") || t.includes("cheque bounce") ||
      t.includes("ipc") || t.includes("police") || t.includes("arrest") ||
      t.includes("assault") || t.includes("threatened") || t.includes("harassed")) {
    return {
      category: "CRIMINAL_CYBER",
      caseType: "Criminal / Cyber Offence",
      urgency: "HIGH",
      complexity: "HIGH",
      lawyerType: "Criminal Lawyer",
      required_documents: ["FIR Copy", "Digital Evidence Screenshots", "Witness Statements", "Medical Reports if applicable"],
    };
  }

  // CORPORATE / CONTRACT
  if (t.includes("contract") || t.includes("company") || t.includes("corporate") ||
      t.includes("partnership") || t.includes("agreement") || t.includes("business") ||
      t.includes("startup") || t.includes("invoice") || t.includes("payment due")) {
    return {
      category: "CORPORATE_CONTRACT",
      caseType: "Corporate / Contract Dispute",
      urgency: "MEDIUM",
      complexity: "HIGH",
      lawyerType: "Corporate Lawyer",
      required_documents: ["Business Agreement", "Invoices", "Email Correspondence", "Company Registration"],
    };
  }

  return {
    category: "GENERAL",
    caseType: "General Legal Matter",
    urgency: "LOW",
    complexity: "MEDIUM",
    lawyerType: "General Practice Lawyer",
    required_documents: ["Any relevant correspondence", "ID Proof"],
  };
}
