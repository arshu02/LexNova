'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  FileText, Download, Copy, Check, Zap, ChevronRight,
  AlertCircle, Scale, ArrowRight, Sparkles, Edit3, Printer,
  UserCheck, ShieldCheck, CheckCircle2, RefreshCw, Layers,
  Clock, Landmark, AlertTriangle, Shield, CheckCheck, Eye
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentTemplate {
  id: string;
  category: string;
  statute: string;
  badgeColor: string;
  title: string;
  desc: string;
  icon: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    defaultValue: string;
    section: "parties" | "facts" | "demands";
  }[];
}

const DOCUMENT_TYPES: DocumentTemplate[] = [
  {
    id: "legal-notice-tenant",
    category: "Property & Tenancy",
    statute: "Transfer of Property Act §108",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    title: "Legal Notice — Security Deposit Refund",
    desc: "Demand immediate refund of residential or commercial security deposit with 18% statutory interest.",
    icon: "🏠",
    fields: [
      { id: "tenantName", label: "Your Full Legal Name", placeholder: "Arjun Mehta", defaultValue: "Arjun Mehta", section: "parties" },
      { id: "landlordName", label: "Landlord / Lessor Name", placeholder: "Suresh Sharma", defaultValue: "Suresh Sharma", section: "parties" },
      { id: "propertyAddress", label: "Rented Premises Address", placeholder: "Flat 3B, Green Park, Indiranagar, Bengaluru", defaultValue: "Flat 3B, Green Park, Indiranagar, Bengaluru", section: "facts" },
      { id: "depositAmount", label: "Security Deposit Paid (₹)", placeholder: "75000", defaultValue: "75000", section: "facts" },
      { id: "vacatingDate", label: "Vacant Possession Date", placeholder: "15 June 2025", defaultValue: "15 June 2025", section: "facts" },
      { id: "noticePeriodDays", label: "Statutory Notice Period (Days)", placeholder: "15", defaultValue: "15", section: "demands" },
    ],
  },
  {
    id: "legal-notice-salary",
    category: "Labour & Employment",
    statute: "Payment of Wages Act §15",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    title: "Legal Notice — Unpaid Salary & Severance",
    desc: "Recover withheld wages, accrued leave encashment, and statutory relieving letter from employer.",
    icon: "💼",
    fields: [
      { id: "employeeName", label: "Employee Full Name", placeholder: "Priya Sharma", defaultValue: "Priya Sharma", section: "parties" },
      { id: "employerName", label: "Company / Corporate Entity", placeholder: "TechCorp Solutions Pvt. Ltd.", defaultValue: "TechCorp Solutions Pvt. Ltd.", section: "parties" },
      { id: "position", label: "Designation / Role", placeholder: "Senior Software Engineer", defaultValue: "Senior Software Engineer", section: "facts" },
      { id: "amount", label: "Total Unpaid Dues (₹)", placeholder: "120000", defaultValue: "120000", section: "facts" },
      { id: "period", label: "Withheld Period (Months)", placeholder: "April & May 2025", defaultValue: "April & May 2025", section: "facts" },
      { id: "noticePeriodDays", label: "Response Window (Days)", placeholder: "15", defaultValue: "15", section: "demands" },
    ],
  },
  {
    id: "cheque-bounce-138",
    category: "Commercial & NI Act",
    statute: "Negotiable Instruments Act §138",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
    title: "Statutory Demand — Section 138 Cheque Dishonour",
    desc: "Enforce strict 30-day statutory demand timeline prior to filing criminal complaint before Magistrate.",
    icon: "⚖️",
    fields: [
      { id: "payeeName", label: "Holder in Due Course (You)", placeholder: "Vikas Enterprises", defaultValue: "Vikas Trading & Logistics", section: "parties" },
      { id: "drawerName", label: "Drawer Name / Firm", placeholder: "Apex Infrastructures Ltd.", defaultValue: "Apex Infrastructures Ltd.", section: "parties" },
      { id: "chequeNumber", label: "Cheque Number", placeholder: "648291", defaultValue: "648291", section: "facts" },
      { id: "chequeDate", label: "Date of Cheque", placeholder: "12 July 2025", defaultValue: "12 July 2025", section: "facts" },
      { id: "chequeAmount", label: "Dishonoured Amount (₹)", placeholder: "250000", defaultValue: "250000", section: "facts" },
      { id: "bankReturnMemoDate", label: "Bank Return Memo Date", placeholder: "18 July 2025", defaultValue: "18 July 2025", section: "demands" },
    ],
  },
  {
    id: "consumer-complaint",
    category: "Consumer Protection",
    statute: "Consumer Protection Act 2019 §35",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    title: "Consumer Forum Petition — Product / Service Defect",
    desc: "Draft formal consumer forum complaint for defective goods, deficiency of service, or unfair trade.",
    icon: "🛒",
    fields: [
      { id: "complainantName", label: "Complainant Full Name", placeholder: "Rahul Kumar", defaultValue: "Rahul Kumar", section: "parties" },
      { id: "sellerName", label: "Opposite Party / Manufacturer", placeholder: "Apex Electronics Retail", defaultValue: "Apex Electronics Retail", section: "parties" },
      { id: "productName", label: "Defective Product / Service", placeholder: "Ultra HD Smart 55\" Display", defaultValue: "Ultra HD Smart 55\" Display", section: "facts" },
      { id: "purchaseDate", label: "Date of Purchase", placeholder: "10 January 2025", defaultValue: "10 January 2025", section: "facts" },
      { id: "amount", label: "Claim & Damage Amount (₹)", placeholder: "65000", defaultValue: "65000", section: "facts" },
      { id: "defect", label: "Defect Description", placeholder: "Display hardware failure; warranty service denied arbitrarily", defaultValue: "Display hardware failure; warranty service denied arbitrarily", section: "demands" },
    ],
  },
  {
    id: "cyber-complaint",
    category: "Cyber Crime",
    statute: "IT Act 2000 §66D & BNS §318",
    badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
    title: "Cyber Cell Complaint — Financial Phishing / UPI Fraud",
    desc: "Official complaint to National Cyber Crime Portal (1930) and Police Cyber Cell for lien freeze.",
    icon: "🔐",
    fields: [
      { id: "victimName", label: "Complainant / Account Holder", placeholder: "Sneha Patel", defaultValue: "Sneha Patel", section: "parties" },
      { id: "bankName", label: "Victim Bank & Branch", placeholder: "HDFC Bank, M.G. Road", defaultValue: "HDFC Bank, M.G. Road", section: "parties" },
      { id: "incidentDate", label: "Date & Time of Fraud", placeholder: "22 July 2025 at 14:30 IST", defaultValue: "22 July 2025 at 14:30 IST", section: "facts" },
      { id: "amountLost", label: "Amount Siphoned Off (₹)", placeholder: "45000", defaultValue: "45000", section: "facts" },
      { id: "utrNumber", label: "Bank UTR / Transaction ID", placeholder: "UTR983241029384", defaultValue: "UTR983241029384", section: "facts" },
      { id: "description", label: "Fraud Modus Operandi", placeholder: "Unauthorized debit via fraudulent APK / phishing link impersonating bank", defaultValue: "Unauthorized debit via fraudulent APK / phishing link impersonating bank", section: "demands" },
    ],
  },
  {
    id: "nda-corporate",
    category: "Corporate & Contracts",
    statute: "Indian Contract Act 1872 §27",
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    title: "Non-Disclosure Agreement (NDA) — Bilateral",
    desc: "Enforceable bilateral non-disclosure agreement for IP, trade secrets, software, and investor talks.",
    icon: "📜",
    fields: [
      { id: "party1Name", label: "Disclosing Party (Your Entity)", placeholder: "NovaTech Solutions LLP", defaultValue: "NovaTech Solutions LLP", section: "parties" },
      { id: "party2Name", label: "Receiving Party (Counterparty)", placeholder: "Global Ventures Inc.", defaultValue: "Global Ventures Inc.", section: "parties" },
      { id: "purpose", label: "Business Evaluation Purpose", placeholder: "Strategic partnership & proprietary source code evaluation", defaultValue: "Strategic partnership & proprietary source code evaluation", section: "facts" },
      { id: "duration", label: "Confidentiality Duration", placeholder: "3 Years from Execution", defaultValue: "3 Years from Execution", section: "demands" },
      { id: "governingState", label: "Jurisdiction High Court", placeholder: "Bengaluru, Karnataka", defaultValue: "Bengaluru, Karnataka", section: "demands" },
    ],
  },
];

const TEMPLATES: Record<string, (f: Record<string, string>) => string> = {
  "legal-notice-tenant": (f) => `REGISTERED A.D. / SPEED POST WITH ACKNOWLEDGEMENT DUE
LEGAL NOTICE

Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
Ref: LN/NOT/TPA/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}

TO:
${f.landlordName || "Landlord Name"}
[Address of the Landlord]
Bengaluru, Karnataka, India

SUBJECT: FORMAL STATUTORY LEGAL NOTICE UNDER SECTION 108 OF THE TRANSFER OF PROPERTY ACT, 1882 AND SECTION 73 OF THE INDIAN CONTRACT ACT, 1872 DEMANDING IMMEDIATE REFUND OF SECURITY DEPOSIT OF ₹${f.depositAmount || "75,000"} WITH ACCRUED INTEREST.

Sir / Madam,

Under instructions and on behalf of my client, ${f.tenantName || "Tenant Name"}, residing at ${f.propertyAddress || "Tenancy Premises"} (hereinafter referred to as "My Client"), I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF BONA FIDE TENANCY:
   That My Client was the lawful, bona fide tenant in respect of residential premises situated at ${f.propertyAddress || "Tenancy Premises"} under the Rental Agreement executed between the parties.

2. SECURITY DEPOSIT PAYMENT:
   That at the inception of the tenancy, My Client deposited with you a refundable, interest-free security deposit of ₹${f.depositAmount || "75,000"} (Rupees ${f.depositAmount || "Seventy Five Thousand"} Only), expressly agreed to be refunded in full upon handover of peaceful vacant possession.

3. LAWFUL HANDOVER & CLEARED DUES:
   That on ${f.vacatingDate || "Vacating Date"}, My Client lawfully vacated the tenanted premises and handed over peaceful, undisturbed, and vacant possession of the premises after settling all utility bills, maintenance, and electricity charges.

4. WRONGFUL RETENTION & CIVIL BREACH:
   That despite peaceful handover and repeated written demands, you have unlawfully, arbitrarily, and with mala fide intent withheld My Client's security deposit. Unilateral deductions without verified invoice receipts are illegal under the law of tenancy.

5. STATUTORY RECOURSE & DEMAND:
   I hereby call upon you to refund the full security deposit of ₹${f.depositAmount || "75,000"} along with interest @ 18% per annum from ${f.vacatingDate || "Vacating Date"} within ${f.noticePeriodDays || "15"} (FIFTEEN) DAYS of the receipt of this notice.

Failure to comply shall constrain My Client to initiate civil recovery proceedings under Order 37 of the Code of Civil Procedure, 1908 (Summary Suit), criminal proceedings under Bharatiya Nyaya Sanhita (BNS) §316 (Criminal Breach of Trust), entirely at your cost and consequence.

Copy retained in Chambers for legal records and court filing.

Advocate for the Claimant
Chambers of Senior Advocate
Bar Council of India Enrolled`,

  "legal-notice-salary": (f) => `REGISTERED A.D. / SPEED POST
FORMAL STATUTORY DEMAND NOTICE

Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
Ref: LN/LABOUR/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}

TO:
The Board of Directors & Managing Director
${f.employerName || "TechCorp Solutions Pvt. Ltd."}
[Registered Corporate Office Address]

SUBJECT: DEMAND NOTICE FOR UNLAWFUL WITHHOLDING OF EARNED SALARY OF ₹${f.amount || "1,20,000"} UNDER SECTION 15 OF THE PAYMENT OF WAGES ACT, 1936 AND SECTION 33C OF THE INDUSTRIAL DISPUTES ACT, 1947.

Sir / Madam,

Under instructions from My Client, ${f.employeeName || "Employee Name"}, formerly engaged as ${f.position || "Designation"} at your company, I hereby issue this statutory notice:

1. EMPLOYMENT STANDING:
   My Client served your organization as ${f.position || "Designation"} with exemplary professional conduct and unbroken fidelity.

2. CONTRACTUAL NOTICE COMPLIANCE:
   My Client tendered formal resignation and successfully completed the contractual transition and handover obligations in full compliance with company policy.

3. ARBITRARY RETENTION OF WAGES:
   Notwithstanding full clearance, your company has arbitrarily withheld salary dues for the period of ${f.period || "April & May 2025"}, aggregating to ₹${f.amount || "1,20,000"}, alongside statutory relieving and experience certificates.

4. STATUTORY PENALTY UNDER WAGES ACT:
   Withholding earned wages is an actionable statutory offence under Section 20 of the Payment of Wages Act, 1936, exposing the employer to ten-fold penalty compensations under Section 15(3).

YOU ARE HEREBY CALLED UPON to release the full payment of ₹${f.amount || "1,20,000"} along with statutory interest @ 18% per annum and issue the Relieving Letter within ${f.noticePeriodDays || "15"} DAYS of receipt of this notice, failing which litigation before the Labour Commissioner, Industrial Tribunal, and NCLT shall be initiated.

Advocate for the Employee
High Court Bar Association`,

  "cheque-bounce-138": (f) => `REGISTERED A.D. / SPEED POST
STATUTORY NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
Ref: LN/NI138/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}

TO:
${f.drawerName || "Drawer Name"}
[Drawer Business / Residential Address]

SUBJECT: NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 REGARDING DISHONOUR OF CHEQUE NO. ${f.chequeNumber || "648291"} FOR ₹${f.chequeAmount || "2,50,000"}.

Sir / Madam,

Under instructions from My Client, ${f.payeeName || "Payee Name"}, I hereby serve upon you this mandatory 30-day statutory notice:

1. LEGALLY ENFORCEABLE DEBT:
   In discharge of your legally enforceable commercial debt and liability, you drew Cheque No. ${f.chequeNumber || "648291"} dated ${f.chequeDate || "12 July 2025"} for the sum of ₹${f.chequeAmount || "2,50,000"} drawn on your bank account in favour of My Client.

2. DISHONOUR OF INSTRUMENT:
   My Client presented the said cheque for clearance through their banker. However, the said cheque was returned dishonoured and unpaid with the Bank Return Memo endorsed: "FUNDS INSUFFICIENT" dated ${f.bankReturnMemoDate || "18 July 2025"}.

3. PRESUMPTION UNDER SECTION 139:
   Under Section 139 of the Negotiable Instruments Act, there exists a statutory presumption of law in favour of My Client that the cheque was issued for discharge of debt.

4. STATUTORY 15-DAY RECOURSE:
   You are hereby called upon to pay the said sum of ₹${f.chequeAmount || "2,50,000"} within 15 (FIFTEEN) DAYS of receipt of this notice, failing which My Client shall file a Criminal Complaint against you before the Metropolitan Magistrate under Section 138 of the NI Act, where you shall be liable to imprisonment up to 2 years and fine up to twice the cheque amount (₹${Number(f.chequeAmount || 250000) * 2}).

Advocate for the Complainant
Bar Council Enrolled`,

  "consumer-complaint": (f) => `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
AT BENGALURU, KARNATAKA

CONSUMER COMPLAINT NO. ______ OF ${new Date().getFullYear()}

IN THE MATTER OF:
${f.complainantName || "Complainant Name"}
... COMPLAINANT

VERSUS

${f.sellerName || "Opposite Party Retailer / Manufacturer"}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR GROSS DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE.

MOST RESPECTFULLY SHOWETH:

1. JURISDICTION & CONSUMER STATUS:
   The Complainant is a "Consumer" under Section 2(7) of the Consumer Protection Act, 2019, having purchased a ${f.productName || "Product Name"} on ${f.purchaseDate || "10 January 2025"} for valuable consideration of ₹${f.amount || "65,000"}.

2. INHERENT DEFECT & DEFICIENCY:
   Shortly following receipt, the subject product exhibited severe functional defects: "${f.defect || "Defect details"}".

3. UNLAWFUL REFUSAL OF WARRANTY:
   Despite valid warranty coverage and repeated service requests, the Opposite Party refused rectification or replacement, committing actionable deficiency in service under Section 2(11).

PRAYER:
Wherefore, it is prayed that this Hon'ble Commission may be pleased to:
a) Direct Opposite Party to refund the purchase amount of ₹${f.amount || "65,000"} along with 12% interest.
b) Award ₹25,000 towards mental agony and harassment.
c) Award ₹10,000 towards litigation costs.

COMPLAINANT / COUNSEL FOR COMPLAINANT`,

  "cyber-complaint": (f) => `FORMAL COMPLAINT UNDER IT ACT §66D AND BHARATIYA NYAYA SANHITA §318

Date: ${new Date().toLocaleDateString("en-IN")}
To: The Station House Officer / Inspector of Police, Cyber Crime Cell

COMPLAINANT DETAILS:
Name: ${f.victimName || "Victim Name"}
Bank: ${f.bankName || "HDFC Bank"}

SUBJECT: COMPLAINT REGARDING UNAUTHORIZED FINANCIAL FRAUD OF ₹${f.amountLost || "45,000"} AND URGENT ACCOUNT LIEN REQUEST.

Sir / Madam,

I wish to report an incident of unauthorized cyber banking fraud:

1. INCIDENT TIMELINE:
   On ${f.incidentDate || "Incident Date"}, an unauthorized fraudulent debit of ₹${f.amountLost || "45,000"} took place without my authorization.
   Transaction UTR: ${f.utrNumber || "UTR983241029384"}.

2. MODUS OPERANDI:
   ${f.description || "Phishing APK and unauthorized gateway debit"}.

3. RBI ZERO LIABILITY MANDATE:
   As per RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, the customer holds zero liability when notified within 3 days.

PRAYER:
Kindly register this complaint under Section 66D of the IT Act and issue immediate directions to the beneficiary bank nodal officer to freeze the fraudulent beneficiary wallet/account.

Complainant Signature: _______________________
Date: ${new Date().toLocaleDateString("en-IN")}`,

  "nda-corporate": (f) => `MUTUAL NON-DISCLOSURE & CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure Agreement is executed on ${new Date().toLocaleDateString("en-IN")} by and between:

PARTY 1:
${f.party1Name || "NovaTech Solutions LLP"}, having its principal place of business at Bengaluru, Karnataka.

AND

PARTY 2:
${f.party2Name || "Global Ventures Inc."}, having its principal place of business as indicated herein.

WHEREAS both parties wish to explore: "${f.purpose || "Strategic evaluation and partnership"}".

NOW IT IS HEREBY AGREED:
1. DEFINITION: "Confidential Information" encompasses all proprietary source code, algorithmic architectures, client rosters, and financial projections disclosed by either party.
2. NON-DISCLOSURE OBLIGATION: The Receiving Party shall hold all Confidential Information in strictest confidence and shall not disclose it to third parties without prior written consent.
3. DURATION: The confidentiality obligations shall subsist for a period of ${f.duration || "3 Years"} from execution.
4. GOVERNING JURISDICTION: This Agreement shall be governed by the laws of India and subject to the exclusive jurisdiction of the Courts at ${f.governingState || "Bengaluru, Karnataka"}.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement.

For Disclosing Party: ___________________        For Receiving Party: ___________________`
};

export default function DocumentStudioPage() {
  const { data: session } = useSession();
  const [selectedId, setSelectedId] = useState<string>("legal-notice-tenant");
  const [fields, setFields] = useState<Record<string, string>>({
    tenantName: "Arjun Mehta",
    landlordName: "Suresh Sharma",
    propertyAddress: "Flat 3B, Green Park, Indiranagar, Bengaluru",
    depositAmount: "75000",
    vacatingDate: "15 June 2025",
    noticePeriodDays: "15",
  });
  
  const [previewMode, setPreviewMode] = useState<"letterhead" | "clean">("letterhead");
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lawyerModalOpen, setLawyerModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "property" | "employment" | "commercial">("all");

  const selectedDoc = DOCUMENT_TYPES.find((d) => d.id === selectedId) || DOCUMENT_TYPES[0];
  const templateFn = TEMPLATES[selectedId] || TEMPLATES["legal-notice-tenant"];
  const standardDoc = templateFn(fields).trim();
  const currentDisplayDoc = aiDraft || standardDoc;

  const handleSelectTemplate = (doc: DocumentTemplate) => {
    setSelectedId(doc.id);
    setAiDraft(null);
    const initialFields: Record<string, string> = {};
    doc.fields.forEach((f) => {
      initialFields[f.id] = f.defaultValue;
    });
    setFields(initialFields);
  };

  const handleFieldChange = (id: string, value: string) => {
    setFields((prev) => ({ ...prev, [id]: value }));
    setAiDraft(null); // Reset AI draft if fields are manually modified
  };

  const handleAiEnhance = async () => {
    try {
      setIsEnhancing(true);
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Legal Notice",
          fields: {
            ...fields,
            documentType: selectedDoc.title,
            statute: selectedDoc.statute,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setAiDraft(data.content);
        }
      }
    } catch (err) {
      console.error("AI enhancement error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    if (!currentDisplayDoc) return;
    navigator.clipboard.writeText(currentDisplayDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentDisplayDoc], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedDoc.id}-draft-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    if (!currentDisplayDoc) return;
    const printWindow = window.open("", "", "width=850,height=950");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${selectedDoc.title} · LexNova</title>
            <style>
              @page { margin: 25mm 20mm 25mm 20mm; size: A4; }
              body { 
                font-family: 'Times New Roman', Times, serif; 
                padding: 40px; 
                font-size: 14px; 
                line-height: 1.65; 
                color: #000;
              }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; }
              .header h1 { font-size: 18px; margin: 0; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; }
              .header p { font-size: 12px; margin: 4px 0 0 0; color: #444; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', Times, serif; font-size: 13.5px; line-height: 1.7; }
              .footer-stamp { margin-top: 40px; border-top: 1px dashed #666; padding-top: 15px; font-size: 11px; color: #555; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Chambers of Supreme Court & High Court Advocates</h1>
              <p>Bar Council of India Enrolled • Certified Statutory Legal Notice Format</p>
            </div>
            <pre>${currentDisplayDoc}</pre>
            <div class="footer-stamp">
              Verified Legal Instrument generated via LexNova Autonomous Legal Operating System.
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="max-w-[1380px] mx-auto flex flex-col gap-6 pb-12">
      
      {/* ── Studio Header ────────────────────────────────────────── */}
      <div className="flex items-end justify-between border-b border-slate-200/90 pb-6 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase mb-2.5">
            <Sparkles size={13} className="text-blue-600" />
            <span>Autonomous Indian Statutory Drafter</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Legal Document Studio</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
              Court-Ready
            </span>
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-2xl">
            Generate enforceable legal notices, section 138 demand instruments, and consumer complaints with precise statutory citations and Bar Council formatting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLawyerModalOpen(true)}
            className="btn-ghost text-sm font-semibold flex items-center gap-2 h-11 px-4 shadow-xs"
          >
            <UserCheck size={16} className="text-blue-600" />
            <span>Consult Advocate on Draft</span>
          </button>

          <button
            onClick={handleAiEnhance}
            disabled={isEnhancing}
            className="btn-primary text-sm font-semibold flex items-center gap-2 h-11 px-5 shadow-sm shadow-blue-500/20"
          >
            {isEnhancing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>AI Refining Draft...</span>
              </>
            ) : (
              <>
                <Zap size={15} className="text-amber-300 fill-amber-300" />
                <span>AI Polish with Precedents</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Studio Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column (5 Cols): Template Selector & Fields Editor */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Section 1: Template Selection Hub */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                <span>1. Select Legal Instrument</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">6 Templates</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {DOCUMENT_TYPES.map((doc) => {
                const isSelected = selectedId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectTemplate(doc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-500/80 shadow-xs ring-2 ring-blue-500/10"
                        : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1 rounded-lg bg-slate-100/80 border border-slate-200">
                      {doc.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[13.5px] font-bold text-slate-900 truncate">
                          {doc.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border ${doc.badgeColor}`}>
                          {doc.statute}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interactive Fact Inputs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Edit3 size={14} className="text-blue-600" />
                <span>2. Customize Notice Facts</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Rendering
              </span>
            </div>

            <div className="space-y-4">
              {selectedDoc.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>{field.label}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Input</span>
                  </label>
                  <input
                    type="text"
                    value={fields[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-3 focus:ring-blue-500/15"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-blue-600" />
                <span>Section references update in real time</span>
              </span>
              <button
                onClick={handleAiEnhance}
                className="font-bold text-blue-600 hover:underline"
              >
                AI Expand →
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): Realistic Advocate Parchment Letterhead Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Document Preview Controls & Action Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 px-4 shadow-xs flex-wrap gap-2">
            
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => setPreviewMode("letterhead")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewMode === "letterhead"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Landmark size={13} className={previewMode === "letterhead" ? "text-blue-600" : ""} />
                <span>Advocate Letterhead</span>
              </button>
              <button
                onClick={() => setPreviewMode("clean")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewMode === "clean"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye size={13} />
                <span>Raw Text</span>
              </button>
            </div>

            {/* Document Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="btn-ghost text-xs h-9 px-3.5 flex items-center gap-1.5 rounded-xl font-semibold"
                title="Copy formatted legal draft to clipboard"
              >
                {copied ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-ghost text-xs h-9 px-3.5 flex items-center gap-1.5 rounded-xl font-semibold"
                title="Download draft as .txt"
              >
                <Download size={14} />
                <span>Download</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn-primary text-xs h-9 px-4 flex items-center gap-1.5 rounded-xl font-semibold shadow-xs"
                title="Print court-ready notice or save as PDF"
              >
                <Printer size={14} />
                <span>Print / PDF</span>
              </button>
            </div>

          </div>

          {/* Realistic Legal Notice Parchment */}
          <div className="legal-parchment-sheet rounded-2xl p-8 sm:p-12 min-h-[720px] relative overflow-hidden transition-all flex flex-col justify-between">
            
            <div>
              {/* Official Advocate Header Block (Letterhead Mode) */}
              {previewMode === "letterhead" && (
                <div className="border-b-2 border-slate-900 pb-5 mb-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-black text-slate-900 tracking-wider uppercase font-serif">
                        CHAMBERS OF SENIOR ADVOCATE
                      </div>
                      <div className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">
                        High Court of Judicature • Bar Council of India Enrolled
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        Enrollment No: BCI/KAR/2016/5421 • Chamber 402, High Court Complex
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="w-11 h-11 rounded-full border-2 border-slate-900 flex items-center justify-center mx-auto text-slate-900">
                        <Scale size={22} />
                      </div>
                      <span className="text-[9.5px] font-bold tracking-wider text-slate-600 uppercase mt-1 block">
                        Fiat Justitia
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 mt-4 pt-3 border-t border-slate-300 font-mono">
                    <span>SPEED POST WITH A.D.</span>
                    <span className="text-blue-800 font-bold tracking-wider">REF: {selectedDoc.statute}</span>
                    <span>ORIGINAL DISPATCH</span>
                  </div>
                </div>
              )}

              {/* Notice Body */}
              <div className="relative z-10 font-serif text-[14.5px] leading-relaxed text-slate-900">
                <pre className="whitespace-pre-wrap font-serif text-[14.5px] leading-[1.8] text-slate-900 selection:bg-blue-100">
                  {currentDisplayDoc}
                </pre>
              </div>
            </div>

            {/* Bottom Letterhead Seal & Signature Block */}
            {previewMode === "letterhead" && (
              <div className="mt-12 pt-6 border-t border-slate-300 flex items-end justify-between relative z-10">
                <div>
                  <div className="legal-seal-stamp">
                    <span>BAR COUNCIL</span>
                    <span className="text-[11px] font-black my-0.5">VERIFIED</span>
                    <span>CHAMBERS</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-slate-800 font-semibold mb-1">
                    Priya Mehta & Associates
                  </div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Advocate for the Complainant
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Karnataka High Court Bar Reg: 2491
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Admissibility & Guarantee Bar */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">Enforceable under Indian Evidence Act §65B & BSA 2023</span>
                <span className="text-emerald-700">Validated for registered RPAD dispatch and court evidence filing.</span>
              </div>
            </div>

            <button
              onClick={() => setLawyerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Have Counsel Review</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

      </div>

      {/* Booking Modal with Pre-Configured Counsel */}
      {lawyerModalOpen && (
        <BookingModal
          advocate={{
            id: "adv_1",
            name: "Advocate Priya Mehta",
            specialization: "Property & Statutory Civil Drafting Specialist",
            rating: 4.8,
            consultationFee: 999,
          }}
          isOpen={lawyerModalOpen}
          onClose={() => setLawyerModalOpen(false)}
        />
      )}

    </div>
  );
}
