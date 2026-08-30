import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

function getFallbackDocument(type: string, f: any): string {
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  
  if (type === "Legal Notice") {
    return `BY REGISTERED AD POST WITH ACKNOWLEDGEMENT DUE

LEGAL NOTICE

Date: ${date}

To,
${f.recipientName || "Recipient Name"}
${f.recipientAddress || "Recipient Address"}

Ref: Notice under Section 80 of Code of Civil Procedure, 1808 / Section 138 of Negotiable Instruments Act / Indian Contract Act, 1872

Sir / Madam,

Under instructions from and on behalf of my client, ${f.senderName || "Sender Name"}, residing at ${f.senderAddress || "Sender Address"} (hereinafter referred to as "My Client"), I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
   My client states that regarding ${f.issueType || "the matter in dispute"}: ${f.issueDetails || "The facts giving rise to this dispute occurred as agreed between the parties."}

2. FINANCIAL CLAIM & DISPUTE:
   That an amount of ₹${f.amountClaimed || "0"} is due and payable by you to my client in connection with the aforementioned matter, which you have failed and neglected to pay despite repeated reminders and requests.

3. LEGAL RECOURSE & DEMAND:
   You are hereby called upon to pay the sum of ₹${f.amountClaimed || "0"} along with interest @ 18% per annum / comply with the demands stated herein within ${f.responseDeadline || "15 days"} from the receipt of this notice, failing which my client has given me strict instructions to initiate appropriate civil and/or criminal proceedings against you in the court of competent jurisdiction at ${f.city || "Court Jurisdiction"}, entirely at your cost and risk.

A copy of this notice is retained in my office for future legal reference.

Advocate
${f.city || "Bengaluru"}, India`;
  }

  if (type === "Rent Agreement") {
    return `RESIDENTIAL RENT AGREEMENT

This Rental Agreement is made and executed at ${f.city || "City"} on this ${f.startDate || date}, by and between:

LANDLORD / LESSOR:
${f.landlordName || "Landlord Name"}, residing at ${f.city || "City"}, India.

AND

TENANT / LESSEE:
${f.tenantName || "Tenant Name"}, currently residing at ${f.city || "City"}, India.

WHEREAS the Landlord is the absolute owner of property situated at: ${f.propertyAddress || "Property Address"} (hereinafter referred to as "Demised Premises").

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. DURATION: The tenancy shall be for a fixed term of ${f.duration || "11 months"} commencing from ${f.startDate || date}.
2. RENT: The Lessee shall pay a monthly rent of ₹${f.monthlyRent || "15,000"} payable on or before the 5th of each calendar month.
3. SECURITY DEPOSIT: The Lessee has deposited a sum of ₹${f.securityDeposit || "45,000"} as interest-free refundable security deposit with the Lessor.
4. MAINTENANCE: Utility bills (electricity, water) shall be borne by the Lessee. Basic structural maintenance shall be the Lessor's responsibility.
5. TERMINATION & NOTICE: Either party may terminate this agreement by giving 1 (one) month written notice to the other.

IN WITNESS WHEREOF the parties have signed this Agreement on the day and year first above written.

________________________                     ________________________
LANDLORD (${f.landlordName || "Landlord"})          TENANT (${f.tenantName || "Tenant"})`;
  }

  if (type === "NDA") {
    return `MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on this ${date} by and between:

DISCLOSING PARTY: ${f.party1Name || "Party 1"}
RECEIVING PARTY: ${f.party2Name || "Party 2"}

1. PURPOSE:
   The Disclosing Party agrees to share confidential details regarding: ${f.purpose || "Business Evaluation"} for mutual consideration.

2. SCOPE OF CONFIDENTIAL INFORMATION:
   Confidential Information includes: ${f.confidentialScope || "All proprietary data, source code, designs, business strategy, and client information."}

3. OBLIGATIONS:
   The Receiving Party agrees to hold in confidence all Confidential Information and shall not disclose it to third parties without prior written consent.

4. TERM & DURATION:
   This confidentiality obligation shall remain binding for a period of ${f.duration || "2 years"} from execution.

5. GOVERNING LAW:
   This Agreement shall be governed by and construed in accordance with the laws of the State of ${f.governingState || "Karnataka"}, India.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement.

________________________                     ________________________
${f.party1Name || "Disclosing Party"}          ${f.party2Name || "Receiving Party"}`;
  }

  if (type === "Employment Contract") {
    return `EMPLOYMENT AGREEMENT

Date: ${f.startDate || date}

To,
${f.employeeName || "Employee Name"}

Subject: Letter of Appointment - ${f.designation || "Role"}

Dear ${f.employeeName || "Employee"},

On behalf of ${f.employerName || "Employer Company"}, we are pleased to offer you employment for the position of ${f.designation || "Designation"} at our ${f.workLocation || "Workplace"} location.

TERMS & CONDITIONS OF EMPLOYMENT:

1. REMUNERATION: Your Annual Cost to Company (CTC) will be ₹${f.ctcAnnual || "0"}, subject to statutory deductions under Indian tax and employment laws.
2. PROBATION: You will be on probation for a period of ${f.probation || "3 months"} from your start date (${f.startDate || date}).
3. NOTICE PERIOD: Either party may terminate employment by giving ${f.noticePeriod || "1 month"} prior written notice or equivalent salary in lieu thereof.
4. CONFIDENTIALITY & IP: All work created during employment belongs exclusively to the Company under the Indian Copyright Act, 1957.

We welcome you to ${f.employerName || "the Company"} and look forward to a fruitful association.

For ${f.employerName || "Employer Company"}

Authorized Signatory
________________________

I ACCEPT THE TERMS AND CONDITIONS:

________________________
${f.employeeName || "Employee Signature"}`;
  }

  if (type === "Consumer Complaint") {
    return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION

COMPLAINT NO. _____ OF 2026

IN THE MATTER OF:
${f.complainantName || "Complainant Name"}
${f.complainantAddress || "Address"}
... COMPLAINANT

VERSUS

${f.companyName || "Opposite Party Name"}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SHOWETH:

1. That the Complainant purchased ${f.productService || "Product/Service"} from the Opposite Party on ${f.purchaseDate || "Date"} for a consideration of ₹${f.amountPaid || "0"}.
2. Defect / Deficiency in Service: ${f.issueDetails || "The opposite party failed to render satisfactory service / provided a defective product."}
3. Relief Sought: The Complainant prays for ${f.reliefSought || "Full Refund and Compensation"} along with litigation costs.

VERIFICATION:
I, ${f.complainantName || "Complainant"}, do hereby verify that the contents of paras 1 to 3 are true to my personal knowledge.

Date: ${date}
Place: India

________________________
COMPLAINANT`;
  }

  return `AFFIDAVIT

I, ${f.deponentName || "Deponent Name"}, aged about ${f.deponentAge || "30"} years, occupation ${f.deponentOccupation || "Service"}, ${f.fatherHusbandName || "Residing in India"}, do hereby solemnly affirm and state on oath as under:

1. That I am a permanent resident of ${f.address || "Residential Address"}, ${f.city || "City"}.
2. Purpose of Affidavit: ${f.purpose || "Official Submission"}.
3. Statement of Facts: ${f.statementFacts || "I state that the facts mentioned herein are true and correct to the best of my knowledge."}

VERIFICATION:
Verified at ${f.city || "City"} on this ${date} that the contents of my above affidavit are true and correct.

________________________
DEPONENT`;
}

const TEMPLATES: Record<string, (fields: any) => string> = {
  "Legal Notice": (f) => `You are a senior Indian advocate. Draft a formal Legal Notice with these details:
Sender: ${f.senderName}, ${f.senderAddress}
Recipient: ${f.recipientName}, ${f.recipientAddress}
Issue Type: ${f.issueType}
Facts: ${f.issueDetails}
Amount in dispute: ₹${f.amountClaimed || "N/A"}
Response deadline: ${f.responseDeadline || "15 days"}
City: ${f.city}

Generate a complete, professionally formatted Legal Notice under Indian law. Include proper header, subject line, facts, legal sections, demand, and closing. Do not use placeholder brackets.`,

  "Rent Agreement": (f) => `Draft a complete Rent Agreement under Indian law with:
Landlord: ${f.landlordName}
Tenant: ${f.tenantName}
Property: ${f.propertyAddress}
Monthly Rent: ₹${f.monthlyRent}
Security Deposit: ₹${f.securityDeposit}
Start Date: ${f.startDate}
Duration: ${f.duration}
City: ${f.city}`,

  "NDA": (f) => `Draft a Non-Disclosure Agreement under Indian law:
Disclosing Party: ${f.party1Name}
Receiving Party: ${f.party2Name}
Purpose: ${f.purpose}
Confidential Information scope: ${f.confidentialScope}
Duration: ${f.duration}
Governing State: ${f.governingState}`,

  "Employment Contract": (f) => `Draft an Employment Agreement under Indian law:
Employer: ${f.employerName}
Employee: ${f.employeeName}
Designation: ${f.designation}
Annual CTC: ₹${f.ctcAnnual}
Start Date: ${f.startDate}
Probation: ${f.probation}
Notice Period: ${f.noticePeriod}
Work Location: ${f.workLocation}`,

  "Consumer Complaint": (f) => `Draft a Consumer Complaint under Consumer Protection Act 2019:
Complainant: ${f.complainantName}, ${f.complainantAddress}
Opposite Party: ${f.companyName}
Product/Service: ${f.productService}
Amount Paid: ₹${f.amountPaid}
Purchase Date: ${f.purchaseDate}
Issue: ${f.issueDetails}
Relief Sought: ${f.reliefSought}`,

  "Affidavit": (f) => `Draft a legal Affidavit under Indian law:
Deponent: ${f.deponentName}, Age: ${f.deponentAge}, Occupation: ${f.deponentOccupation}
${f.fatherHusbandName}
Address: ${f.address}
Purpose: ${f.purpose}
Facts: ${f.statementFacts}
City: ${f.city}`
};

export async function POST(req: Request) {
  let type = "";
  let fields: any = {};
  try {
    const body = await req.json();
    type = body.type;
    fields = body.fields || {};

    if (!type || !fields) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Reject empty fields object
    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "Document fields cannot be empty" }, { status: 400 });
    }

    const promptFn = TEMPLATES[type];
    if (!promptFn) return NextResponse.json({ error: "Unknown document type" }, { status: 400 });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ content: getFallbackDocument(type, fields) });
    }

    const prompt = promptFn(fields);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: "You are a senior Indian advocate with 20 years of experience. Generate complete, professional legal documents. Use proper legal formatting. Never use placeholder text like [NAME] or [DATE] - use the actual details provided. Output only the document text, no commentary.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find(c => c.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ content: getFallbackDocument(type, fields) });
    }

    return NextResponse.json({ content: text.text.trim() });
  } catch (err) {
    console.error("Document generation error:", err);
    if (type && fields) {
      return NextResponse.json({ content: getFallbackDocument(type, fields) });
    }
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
