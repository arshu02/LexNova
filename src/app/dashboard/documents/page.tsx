'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  FileText, Download, Copy, Check, Zap, ChevronRight,
  AlertCircle, Scale, ArrowRight, Sparkles, Edit3, Printer,
  UserCheck, ShieldCheck, CheckCircle2
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import { motion } from 'framer-motion';

const DOCUMENT_TYPES = [
  {
    id: "legal-notice-tenant",
    category: "Property & Tenancy",
    title: "Legal Notice — Security Deposit",
    desc: "Formal notice demanding refund of rental security deposit under Transfer of Property Act.",
    icon: "🏠",
    fields: [
      { id: "tenantName", label: "Your Full Name", placeholder: "Arjun Mehta", defaultValue: "Arjun Mehta" },
      { id: "landlordName", label: "Landlord's Full Name", placeholder: "Suresh Sharma", defaultValue: "Suresh Sharma" },
      { id: "propertyAddress", label: "Rented Property Address", placeholder: "Flat 3B, Green Park, Indiranagar, Bengaluru", defaultValue: "Flat 3B, Green Park, Indiranagar, Bengaluru" },
      { id: "depositAmount", label: "Security Deposit Amount (₹)", placeholder: "60000", defaultValue: "75000" },
      { id: "vacatingDate", label: "Date Vacated", placeholder: "15 June 2025", defaultValue: "15 June 2025" },
    ],
  },
  {
    id: "legal-notice-salary",
    category: "Labour & Employment",
    title: "Legal Notice — Unpaid Salary",
    desc: "Demand outstanding salary, severance, or dues under Section 15 of Payment of Wages Act.",
    icon: "💼",
    fields: [
      { id: "employeeName", label: "Your Full Name", placeholder: "Priya Sharma", defaultValue: "Priya Sharma" },
      { id: "employerName", label: "Company / Employer Name", placeholder: "TechCorp Solutions Pvt. Ltd.", defaultValue: "TechCorp Solutions Pvt. Ltd." },
      { id: "position", label: "Your Job Designation", placeholder: "Senior Software Engineer", defaultValue: "Senior Software Engineer" },
      { id: "amount", label: "Total Outstanding Amount (₹)", placeholder: "95000", defaultValue: "95000" },
      { id: "period", label: "Months of Non-Payment", placeholder: "May & June 2025", defaultValue: "May & June 2025" },
    ],
  },
  {
    id: "consumer-complaint",
    category: "Consumer Protection",
    title: "Consumer Complaint — NCDRC / Forum",
    desc: "Notice for defective products, unfair trade practices, or service deficiency under CPA 2019.",
    icon: "🛒",
    fields: [
      { id: "complainantName", label: "Your Full Name", placeholder: "Rahul Kumar", defaultValue: "Rahul Kumar" },
      { id: "sellerName", label: "Seller / Brand / Company", placeholder: "Apex Electronics India", defaultValue: "Apex Electronics India" },
      { id: "productName", label: "Product / Service Purchased", placeholder: "Smart OLED Television 55-inch", defaultValue: "Smart OLED Television 55-inch" },
      { id: "purchaseDate", label: "Date of Purchase", placeholder: "10 January 2025", defaultValue: "10 January 2025" },
      { id: "amount", label: "Claim Amount with Damages (₹)", placeholder: "65000", defaultValue: "65000" },
      { id: "defect", label: "Defect Description", placeholder: "Display panel failure within 14 days, warranty replacement rejected", defaultValue: "Display panel failure within 14 days, warranty replacement rejected" },
    ],
  },
  {
    id: "cyber-complaint",
    category: "Cyber Crime",
    title: "Cyber Crime Police Complaint",
    desc: "Formal complaint for online banking fraud, UPI scams, or identity theft to Cyber Cell.",
    icon: "🔐",
    fields: [
      { id: "victimName", label: "Your Full Name", placeholder: "Sneha Patel", defaultValue: "Sneha Patel" },
      { id: "incidentDate", label: "Date of Incident", placeholder: "22 July 2025", defaultValue: "22 July 2025" },
      { id: "description", label: "Incident Details", placeholder: "Unauthorized UPI debits through fraudulent phishing APK link", defaultValue: "Unauthorized UPI debits through fraudulent phishing APK link" },
      { id: "amountLost", label: "Amount Defrauded (₹)", placeholder: "45000", defaultValue: "45000" },
      { id: "evidence", label: "Available Evidence", placeholder: "Bank UTR number, call records, SMS logs", defaultValue: "Bank UTR number, call records, SMS logs" },
    ],
  },
];

const TEMPLATES: Record<string, (fields: Record<string, string>) => string> = {
  "legal-notice-tenant": (f) => `
REGISTERED A.D. / SPEED POST
LEGAL NOTICE

Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}

TO:
${f.landlordName || "Landlord Name"}
[Address of the Landlord]
Bengaluru, Karnataka

SUBJECT: FORMAL LEGAL NOTICE DEMANDING REFUND OF SECURITY DEPOSIT OF ₹${f.depositAmount || "75,000"} UNDER THE TRANSFER OF PROPERTY ACT, 1882.

Sir/Madam,

Under instructions and on behalf of my client, ${f.tenantName || "Tenant Name"}, residing at ${f.propertyAddress || "Tenancy Property"}, I hereby serve upon you this formal Legal Notice:

1. That my client was the bona fide lawful tenant of your residential premises situated at ${f.propertyAddress || "Tenancy Property"} under the Lease Agreement executed between both parties.

2. That at the inception of the tenancy, my client deposited an interest-free refundable security deposit of ₹${f.depositAmount || "75,000"} (Rupees Seventy Five Thousand Only).

3. That on ${f.vacatingDate || "Vacating Date"}, my client lawfully vacated the premises after clearing all utility dues and handed over peaceful, vacant possession of the premises in pristine condition.

4. That despite repeated written demands, email reminders, and personal follow-ups, you have illegally, wrongfully, and arbitrarily withheld the security deposit without any lawful justification.

5. That your wrongful retention of my client's security deposit constitutes a breach of contract, unjust enrichment, and a civil wrong actionable under the Transfer of Property Act, 1882 and Section 73 of the Indian Contract Act, 1872.

NOW THEREFORE, I hereby call upon you to refund the full security deposit of ₹${f.depositAmount || "75,000"} along with interest @ 18% per annum from ${f.vacatingDate || "Vacating Date"} within 15 (FIFTEEN) DAYS of the receipt of this notice, failing which my client shall be constrained to initiate appropriate civil and summary proceedings for recovery against you at your sole risk, cost, and consequence.

Copy retained for legal records and court filing.

Advocate for the Claimant
Bar Council Enrolled
`,

  "legal-notice-salary": (f) => `
REGISTERED A.D. / SPEED POST
LEGAL NOTICE

Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}

TO:
The Board of Directors / Managing Director
${f.employerName || "TechCorp Solutions Pvt. Ltd."}
[Registered Corporate Office Address]

SUBJECT: DEMAND NOTICE FOR PAYMENT OF OUTSTANDING SALARY DUES OF ₹${f.amount || "95,000"} UNDER SECTION 15 OF THE PAYMENT OF WAGES ACT, 1936 AND SECTION 33C OF THE INDUSTRIAL DISPUTES ACT, 1947.

Sir/Madam,

Under instructions from my client, ${f.employeeName || "Employee Name"}, formerly employed as ${f.position || "Designation"} at your company, I state as follows:

1. That my client was employed with your esteemed organization as ${f.position || "Designation"} with full sincerity and exemplary performance record.

2. That my client tendered formal resignation following complete compliance with the contractual notice period terms.

3. That despite fulfilling all handover responsibilities, you have unlawfully withheld the salary for the period of ${f.period || "May & June 2025"}, amounting to ₹${f.amount || "95,000"} along with the statutory Experience Certificate and Relieving Letter.

4. That non-payment of earned wages constitutes an offence punishable under Section 20 of the Payment of Wages Act, 1936, and renders you liable to pay statutory compensation up to ten times the withheld amount under Section 15(3).

YOU ARE HEREBY CALLED UPON to disburse the entire outstanding salary dues of ₹${f.amount || "95,000"} along with interest @ 18% p.a. and issue the Relieving Letter within 15 (FIFTEEN) DAYS of receipt of this notice, failing which legal proceedings before the Labour Commissioner, Industrial Tribunal, and National Company Law Tribunal shall be initiated at your expense.

Advocate for the Claimant
Bar Council Enrolled
`,

  "consumer-complaint": (f) => `
BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
AT BENGALURU, KARNATAKA

CONSUMER COMPLAINT NO. ______ OF 2026

IN THE MATTER OF:
${f.complainantName || "Complainant Name"}
... COMPLAINANT

VERSUS

${f.sellerName || "Opposite Party Seller / Manufacturer"}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE.

MOST RESPECTFULLY SHOWETH:

1. That the Complainant purchased a ${f.productName || "Product Name"} on ${f.purchaseDate || "Date"} for a valuable consideration of ₹${f.amount || "Amount"}.

2. That shortly after purchase, the product manifested severe defect: "${f.defect || "Defect details"}".

3. That despite lodging formal complaints under warranty, the Opposite Party refused to repair or replace the defective unit, thereby committing gross deficiency in service under Section 2(11) of the CPA, 2019.

PRAYER:
It is therefore prayed that this Hon'ble Commission may be pleased to direct the Opposite Party to:
a) Refund the purchase amount of ₹${f.amount || "65,000"} with 12% interest.
b) Pay ₹25,000 towards mental agony and harassment.
c) Pay ₹10,000 towards litigation costs.

COMPLAINANT / ADVOCATE
`,

  "cyber-complaint": (f) => `
TO:
The Station House Officer / Inspector of Police
Cyber Crime Police Station
[Jurisdiction Cyber Cell]

SUBJECT: COMPLAINT REGARDING UNAUTHORIZED FINANCIAL FRAUD / CYBER CRIME OF ₹${f.amountLost || "45,000"} UNDER SECTION 66D OF THE IT ACT, 2000 AND SECTION 420 IPC.

Sir/Madam,

I, ${f.victimName || "Victim Name"}, wish to report an incident of cyber fraud that occurred on ${f.incidentDate || "Incident Date"}:

1. Factual Summary: ${f.description || "Description of unauthorized transaction and fraudulent phishing APK/link"}.

2. Financial Loss: A total sum of ₹${f.amountLost || "Amount"} was unlawfully siphoned off from my bank account.

3. Available Evidence: ${f.evidence || "UTR references, bank transaction statements, SMS logs"}.

I request you to kindly register an FIR under Section 66D of the Information Technology Act, 2000 and Section 420 of the Indian Penal Code, and issue urgent directions to the beneficiary bank to freeze the recipient account.

Complainant Signature: _______________________
Date: ${new Date().toLocaleDateString("en-IN")}
`
};

export default function DocumentStudioPage() {
  const { data: session } = useSession();
  const [selectedId, setSelectedId] = useState<string>("legal-notice-tenant");
  const [fields, setFields] = useState<Record<string, string>>({
    tenantName: "Ragnar Lothbrok",
    landlordName: "Suresh Sharma",
    propertyAddress: "Flat 3B, Green Park, Indiranagar, Bengaluru",
    depositAmount: "75000",
    vacatingDate: "15 June 2025",
  });
  const [copied, setCopied] = useState(false);
  const [lawyerModalOpen, setLawyerModalOpen] = useState(false);

  const selectedDoc = DOCUMENT_TYPES.find((d) => d.id === selectedId) || DOCUMENT_TYPES[0];
  const templateFn = TEMPLATES[selectedId] || TEMPLATES["legal-notice-tenant"];
  const generatedDoc = templateFn(fields).trim();

  const handleSelectTemplate = (doc: typeof DOCUMENT_TYPES[0]) => {
    setSelectedId(doc.id);
    const initialFields: Record<string, string> = {};
    doc.fields.forEach((f) => {
      initialFields[f.id] = f.defaultValue;
    });
    setFields(initialFields);
  };

  const handleFieldChange = (id: string, value: string) => {
    setFields((prev) => ({ ...prev, [id]: value }));
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (!generatedDoc) return;
    const printWindow = window.open('', '', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedDoc.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; font-size: 14px; line-height: 1.6; color: #000; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 14px; }
            </style>
          </head>
          <body>
            <pre>${generatedDoc}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderBottom: "1px solid #E2E8F0",
        paddingBottom: "20px",
        flexWrap: "wrap",
        gap: "14px",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#2563EB",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            <Sparkles size={14} /> Automated Indian Law Drafting
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Document Studio
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginTop: "4px" }}>
            Generate court-ready legal notices, consumer complaints, and demand letters with statutory section citations.
          </p>
        </div>

        <button
          onClick={() => setLawyerModalOpen(true)}
          className="btn-ghost"
          style={{ fontSize: "13.5px", display: "flex", alignItems: "center", gap: "6px", height: "42px" }}
        >
          <UserCheck size={15} color="#2563EB" /> Have an Advocate Review This Draft
        </button>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Side: Template Selector & Dynamic Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            1. Select Document Template
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {DOCUMENT_TYPES.map((doc) => {
              const isSelected = selectedId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleSelectTemplate(doc)}
                  style={{
                    background: isSelected ? "#EFF6FF" : "#FFFFFF",
                    border: isSelected ? "1px solid #3B82F6" : "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>{doc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "3px", lineHeight: "1.4" }}>
                      {doc.desc}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          {/* Form Fields */}
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Edit3 size={15} color="#2563EB" /> 2. Customize Notice Facts
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedDoc.fields.map((field) => (
                <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#334155" }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={fields[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "13.5px",
                      color: "#0F172A",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Monospace Legal Paper Preview */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}>
          
          {/* Paper Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            flexWrap: "wrap",
            gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} color="#2563EB" />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>
                {selectedDoc.title} · Live Draft
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={handleCopy}
                className="btn-ghost"
                style={{ fontSize: "12.5px", padding: "6px 12px", height: "34px", display: "flex", alignItems: "center", gap: "5px" }}
              >
                {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                {copied ? "Copied Text" : "Copy Text"}
              </button>

              <button
                onClick={handlePrint}
                className="btn-primary"
                style={{ fontSize: "12.5px", padding: "6px 14px", height: "34px", display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Printer size={13} /> Print / Export PDF
              </button>
            </div>
          </div>

          {/* Legal Notice Paper */}
          <div style={{
            padding: "28px",
            background: "#FFFFFF",
            minHeight: "560px",
            overflowX: "auto",
          }}>
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13.5px",
              lineHeight: "1.75",
              color: "#1E293B",
              whiteSpace: "pre-wrap",
            }}>
              {generatedDoc}
            </pre>
          </div>

          {/* Bottom Bar: Court Admissibility */}
          <div style={{
            padding: "14px 20px",
            background: "#F8FAFC",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12.5px",
            color: "#64748B",
            flexWrap: "wrap",
            gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={15} color="#059669" />
              <span>Complies with Section 106 Transfer of Property Act / Section 15 Payment of Wages Act</span>
            </div>

            <button
              onClick={() => setLawyerModalOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
              }}
            >
              Sign with Bar Council Seal →
            </button>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {lawyerModalOpen && (
        <BookingModal
          advocate={{
            id: "adv_2",
            name: "Advocate Rajesh Sharma",
            specialization: "Employment & Civil Drafting Counsel",
            rating: 4.9,
            consultationFee: 1499,
          }}
          isOpen={lawyerModalOpen}
          onClose={() => setLawyerModalOpen(false)}
        />
      )}

    </div>
  );
}
