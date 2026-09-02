import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PRESET_WORKFLOWS = [
  {
    id: "wf-138-ni",
    name: "Section 138 NI Act — Cheque Dishonour Pipeline",
    description: "Automated cheque return memo intake, statutory 15-day notice generation, RPAD post tracking & magistrate complaint filing.",
    trigger: "CHEQUE_BOUNCE_INTAKE",
    status: "ACTIVE",
    executionCount: 1420,
    successRate: "98.4%",
    stages: [
      { step: 1, name: "Intake & Dishonour Memo OCR Extraction", service: "AI Vision Pipeline" },
      { step: 2, name: "Statutory 30-Day Demand Notice Generation", service: "Claude 3.5 Sonnet Legal Engine" },
      { step: 3, name: "India Post Registered AD Dispatch Tracking", service: "IndiaPost API Node" },
      { step: 4, name: "Section 138 Criminal Complaint Drafting", service: "Advocate Verification Queue" },
    ],
  },
  {
    id: "wf-consumer-dispute",
    name: "Consumer Protection Act 2019 — E-Daakhil Filing",
    description: "Deficiency in service detection, valuation calculation, formal legal demand dispatch & direct district forum plaint packaging.",
    trigger: "CONSUMER_DISPUTE_LOGGED",
    status: "ACTIVE",
    executionCount: 2890,
    successRate: "99.1%",
    stages: [
      { step: 1, name: "Transaction Invoice & Grievance Fact Extraction", service: "AI Fact Engine" },
      { step: 2, name: "Consumer Forum Jurisdiction & Pecuniary Check", service: "Compliance Validator" },
      { step: 3, name: "Opposite Party Demand Notice with 15-Day Cure", service: "Document PDF Engine" },
      { step: 4, name: "E-Daakhil Ready Formal Affidavit & Verification", service: "Certified Counsel Match" },
    ],
  },
  {
    id: "wf-employment-wage",
    name: "Payment of Wages & Wrongful Termination Arbitration",
    description: "Severance audit, labour commissioner conciliation demand & employment contract breach notice.",
    trigger: "LABOUR_DISPUTE_SUBMITTED",
    status: "ACTIVE",
    executionCount: 940,
    successRate: "96.8%",
    stages: [
      { step: 1, name: "Employment Agreement & Pay Slip Redline Audit", service: "Contract Clause Analyzer" },
      { step: 2, name: "Statutory Gratuity & Wage Due Reconciliation", service: "Labour Act Engine" },
      { step: 3, name: "Demand Notice to Employer Legal & HR Counsel", service: "Automated Relay" },
      { step: 4, name: "Conciliation Officer Plaint Assembly", service: "Advocate Node" },
    ],
  },
  {
    id: "wf-cyber-fraud",
    name: "IT Act 2000 — Cyber Financial Fraud Freeze",
    description: "1930 Cyber Helpline filing, transaction hash extraction & bank nodal officer immediate lien notice.",
    trigger: "CYBER_FRAUD_REPORTED",
    status: "ACTIVE",
    executionCount: 3120,
    successRate: "97.5%",
    stages: [
      { step: 1, name: "UPI / IMPS Reference & Bank Transaction Parse", service: "Fintech Tokenizer" },
      { step: 2, name: "Immediate 24-Hour Bank Nodal Freeze Notice", service: "SLA Urgent Dispatcher" },
      { step: 3, name: "National Cyber Crime Reporting Portal Dossier", service: "IT Act RAG Node" },
    ],
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    return NextResponse.json(PRESET_WORKFLOWS);
  } catch (error: any) {
    console.error("[Admin Workflows API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 });
  }
}
