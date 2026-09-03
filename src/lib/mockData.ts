export type CaseCategory =
    | "Property Dispute"
    | "Police Complaint"
    | "Family / Divorce"
    | "Cyber Crime"
    | "Business Legal Help"
    | "General";

export interface LegalRoadmap {
    category: CaseCategory;
    city: string | null;
    summary: string;
    legalPathways: string[];
    requiredDocuments: string[];
    nextActions: string[];
    riskLevel: "Low" | "Medium" | "High";
    statutesCited?: string[];
    limitationPeriod?: string;
    limitationDaysRemaining?: number;
    claimQuantification?: {
        principal: number;
        interest: number;
        courtFee: number;
        total: number;
    };
    draftNotice?: string;
}

export interface Advocate {
    id: string;
    name: string;
    experience: number;
    specializations: string[];
    city: string;
    fee: number;
    responseTime: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    initials: string;
    color: string;
    tags: string[];
    photo?: string;
    barNumber?: string;
    courts?: string;
}

export const advocates: Advocate[] = [
    {
        id: "cmtlltiks00027kl4lc6cshzd",
        name: "Adv. Priya Mehta",
        experience: 12,
        specializations: ["Property Dispute", "Tenant Rights", "Civil Cases"],
        city: "Bengaluru",
        fee: 999,
        responseTime: "5 min",
        rating: 4.9,
        reviewCount: 184,
        verified: true,
        initials: "PM",
        color: "#2563EB",
        tags: ["Tenancy Specialist", "RERA Expert"],
        photo: "/advocate-priya.jpg",
        barNumber: "KAR/2491/2014",
        courts: "Karnataka High Court & City Civil Court",
    },
    {
        id: "cmtlltj1200057kl4pn4p8bn6",
        name: "Adv. Rajesh Sharma",
        experience: 16,
        specializations: ["Employment & Labour", "Business Legal Help", "Civil Cases"],
        city: "Mumbai",
        fee: 1499,
        responseTime: "10 min",
        rating: 4.9,
        reviewCount: 230,
        verified: true,
        initials: "RS",
        color: "#4F46E5",
        tags: ["Labour Specialist", "Industrial Disputes"],
        photo: "/advocate-rajesh.jpg",
        barNumber: "MAH/1842/2010",
        courts: "Bombay High Court & Labour Tribunal",
    },
    {
        id: "cmtlltjhs00087kl4ftmbsgxh",
        name: "Adv. Ananya Iyer",
        experience: 8,
        specializations: ["Consumer Grievance", "Civil Cases", "Business Legal Help"],
        city: "Chennai",
        fee: 799,
        responseTime: "15 min",
        rating: 4.8,
        reviewCount: 96,
        verified: true,
        initials: "AI",
        color: "#06B6D4",
        tags: ["Consumer Protection", "NCDRC Specialist"],
        photo: "/advocate-ananya.jpg",
        barNumber: "TN/3012/2017",
        courts: "Madras High Court & State Commission",
    },
    {
        id: "cmtlltjxz000b7kl4ne8tm18i",
        name: "Adv. Sanjay Gupta",
        experience: 19,
        specializations: ["Police Complaint", "Cyber Crime", "Criminal Law"],
        city: "Delhi",
        fee: 1999,
        responseTime: "8 min",
        rating: 4.9,
        reviewCount: 312,
        verified: true,
        initials: "SG",
        color: "#7C3AED",
        tags: ["Sessions Court", "FIR & Bail Defense"],
        photo: "/advocate-rajesh.jpg",
        barNumber: "D/1094/2007",
        courts: "Delhi High Court & Tis Hazari Courts",
    },
    {
        id: "cmtlltkel000e7kl4qjzj1dbm",
        name: "Adv. Meera Krishnan",
        experience: 10,
        specializations: ["Family / Divorce", "Civil Cases"],
        city: "Bengaluru",
        fee: 1299,
        responseTime: "12 min",
        rating: 4.8,
        reviewCount: 145,
        verified: true,
        initials: "MK",
        color: "#EC4899",
        tags: ["Family Court", "Mediation Specialist"],
        photo: "/advocate-priya.jpg",
        barNumber: "KAR/4120/2016",
        courts: "Karnataka High Court & Family Court",
    },
    {
        id: "cmtlltkvc000h7kl4pyg5tmug",
        name: "Adv. Vikram Singh",
        experience: 14,
        specializations: ["Business Legal Help", "Commercial Recovery", "Property Dispute"],
        city: "Mumbai",
        fee: 2499,
        responseTime: "15 min",
        rating: 4.8,
        reviewCount: 178,
        verified: true,
        initials: "VS",
        color: "#F59E0B",
        tags: ["Commercial Suits", "NCLT & Arbitration"],
        photo: "/advocate-rajesh.jpg",
        barNumber: "MAH/5521/2012",
        courts: "Bombay High Court & NCLT Mumbai",
    },
];

export function filterAdvocates(category: CaseCategory | null, city: string | null): Advocate[] {
    // If specific category or city, try strict filter first
    if (category && category !== "General") {
        const strict = advocates.filter((a) => {
            const matchCat = a.specializations.some((s) => s.toLowerCase().includes(category.toLowerCase()));
            const matchCity = city ? a.city.toLowerCase() === city.toLowerCase() : true;
            return matchCat && matchCity;
        });
        if (strict.length > 0) return strict;

        // Fallback: match by category regardless of city
        const catOnly = advocates.filter((a) =>
            a.specializations.some((s) => s.toLowerCase().includes(category.toLowerCase()))
        );
        if (catOnly.length > 0) return catOnly;
    }

    // If city only
    if (city) {
        const cityOnly = advocates.filter((a) => a.city.toLowerCase() === city.toLowerCase());
        if (cityOnly.length > 0) return cityOnly;
    }

    // Default: return top verified advocates
    return advocates;
}

export function detectCaseCategory(text: string): CaseCategory {
    const t = text.toLowerCase();
    if (
        t.includes("property") || t.includes("land") || t.includes("plot") ||
        t.includes("house") || t.includes("boundary") || t.includes("deposit") ||
        t.includes("rent") || t.includes("tenant") || t.includes("landlord") ||
        t.includes("eviction") || t.includes("lease") || t.includes("flat")
    )
        return "Property Dispute";
    if (
        t.includes("salary") || t.includes("wage") || t.includes("employer") ||
        t.includes("employee") || t.includes("termination") || t.includes("severance") ||
        t.includes("unpaid") || t.includes("bonus") || t.includes("resignation")
    )
        return "Business Legal Help";
    if (
        t.includes("police") || t.includes("complaint") || t.includes("fir") ||
        t.includes("criminal") || t.includes("arrest") || t.includes("assault") ||
        t.includes("threat") || t.includes("bail")
    )
        return "Police Complaint";
    if (
        t.includes("family") || t.includes("divorce") || t.includes("marriage") ||
        t.includes("custody") || t.includes("maintenance") || t.includes("alimony")
    )
        return "Family / Divorce";
    if (
        t.includes("cyber") || t.includes("fraud") || t.includes("online") ||
        t.includes("hack") || t.includes("scam") || t.includes("upi") ||
        t.includes("phishing") || t.includes("bank")
    )
        return "Cyber Crime";
    if (
        t.includes("business") || t.includes("contract") || t.includes("partnership") ||
        t.includes("agreement") || t.includes("company") || t.includes("vendor") ||
        t.includes("cheque") || t.includes("bounce") || t.includes("138")
    )
        return "Business Legal Help";
    return "Property Dispute"; // Default to most common dispute instead of empty General
}

export function detectCity(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes("patna")) return "Patna";
    if (t.includes("delhi") || t.includes("noida") || t.includes("gurgaon")) return "Delhi";
    if (t.includes("mumbai") || t.includes("navi mumbai") || t.includes("thane")) return "Mumbai";
    if (t.includes("bangalore") || t.includes("bengaluru")) return "Bengaluru";
    if (t.includes("chennai")) return "Chennai";
    if (t.includes("pune")) return "Pune";
    if (t.includes("hyderabad")) return "Hyderabad";
    if (t.includes("lucknow")) return "Lucknow";
    if (t.includes("kolkata")) return "Kolkata";
    return null;
}

export function generateLegalRoadmap(
    category: CaseCategory,
    city: string | null,
    issue: string
): LegalRoadmap {
    // Extract claim amount if mentioned in input text
    const amountMatch = issue.match(/₹?\s*([\d,]+)/);
    let principal = 75000;
    if (amountMatch && amountMatch[1]) {
        const parsed = parseInt(amountMatch[1].replace(/,/g, ""), 10);
        if (!isNaN(parsed) && parsed > 500) principal = parsed;
    } else if (category === "Business Legal Help") {
        principal = 140000;
    } else if (category === "Cyber Crime") {
        principal = 45000;
    }

    const interest = Math.round(principal * 0.18);
    const courtFee = Math.max(500, Math.round(principal * 0.025));
    const total = principal + interest;

    const roadmaps: Record<CaseCategory, Partial<LegalRoadmap>> = {
        "Property Dispute": {
            summary: "Dispute involving tenancy security deposit recovery or tenancy title. Governed under Transfer of Property Act 1882 §108(B) and State Rent Control Act. The statutory demand period for withholding without lawful justification is 15 calendar days post-vacation.",
            statutesCited: [
                "Transfer of Property Act 1882 §108(B)",
                "Limitation Act 1963 Article 7 (3-Year Recovery Period)",
                "Rent Control Act & Specific Relief Act §6",
                "Indian Evidence Act 1872 §65B (Electronic Move-Out Proof)",
            ],
            limitationPeriod: "Limitation Act 1963, Article 7 — 3 Years from date of cause of action",
            limitationDaysRemaining: 742,
            legalPathways: [
                "Issue 15-Day Formal RPAD Legal Demand Notice with 18% p.a. interest",
                "Filing Summary Civil Suit (Order 37 CPC) before Senior City Civil Judge",
                "Jurisdictional Consumer Disputes Redressal Commission Filing",
            ],
            requiredDocuments: [
                "Registered Lease / Rent Agreement",
                "Bank Statement / UPI Remittance Proof of Deposit",
                "30-Day Move-Out Written Notice & Landlord Acceptance",
                "Key Handover Acknowledgement & Flat Condition Inspection Photos",
            ],
            nextActions: [
                "Verify landlord registered residential address for RPAD postal dispatch",
                "Deploy verified High Court counsel on record for statutory notice execution",
                "Preserve all digital WhatsApp / email inspection logs under Section 65B",
            ],
            riskLevel: "Medium",
            draftNotice: `LEGAL DEMAND NOTICE UNDER REGISTERED POST WITH ACKNOWLEDGEMENT DUE (RPAD)

To: [LANDLORD / OPPOSING PARTY NAME]
Address: [PROPERTY PREMISES ADDRESS, ${city || "BENGALURU"}]

Sub: URGENT STATUTORY DEMAND FOR IMMEDIATE REFUND OF SECURITY DEPOSIT OF ₹${principal.toLocaleString('en-IN')} ALONG WITH ACCRUED INTEREST @ 18% P.A. UNDER SECTION 108 OF THE TRANSFER OF PROPERTY ACT, 1882.

Sir / Madam,

Under instructions from and on behalf of my client [TENANT NAME], I hereby issue this statutory legal notice upon you as follows:

1. That my client was the lawful tenant in respect of the residential premises situated at [ADDRESS] pursuant to the Lease Agreement.
2. That in compliance with the lease covenants, my client duly remitted an interest-free security deposit of ₹${principal.toLocaleString('en-IN')}.
3. That my client lawfully vacated the subject premises on [DATE] after tendering the requisite 30 days written notice and handed over peaceful, vacant possession in immaculate condition.
4. That despite lapse of the statutory period, you have willfully and unlawfully withheld the security deposit of ₹${principal.toLocaleString('en-IN')} without any lawful deduction or justifiable basis, constituting criminal breach of trust under Section 405 IPC and unlawful enrichment.

NOW THEREFORE, YOU ARE HEREBY CALLED UPON TO:
Pay to my client the outstanding sum of ₹${principal.toLocaleString('en-IN')} together with interest accrued at 18% p.a. amounting to ₹${interest.toLocaleString('en-IN')} (Total: ₹${total.toLocaleString('en-IN')}) within FIFTEEN (15) DAYS from receipt of this notice, failing which my client shall initiate Summary Suit proceedings under Order 37 of CPC and consumer petition at your sole cost and consequence.

ADVOCATE ON RECORD
Karnataka High Court & City Civil Courts`,
        },
        "Business Legal Help": {
            summary: "Dispute involving employment wages, commercial contract breach, or dishonored financial instrument. Governed under Payment of Wages Act 1936 §15 and Section 138 of the Negotiable Instruments Act 1881.",
            statutesCited: [
                "Payment of Wages Act 1936 §15 & Industrial Disputes Act",
                "Section 138 Negotiable Instruments Act 1881",
                "Indian Contract Act 1872 §73 (Breach & Liquidated Damages)",
                "Commercial Courts Act 2015 (Pre-Institution Mediation)",
            ],
            limitationPeriod: "Payment of Wages Act — 12 Months / Limitation Act Article 7",
            limitationDaysRemaining: 318,
            legalPathways: [
                "Statutory RPAD Demand Notice for Unpaid Wages & Relieving Certificate",
                "Pre-Institution Mediation through Legal Services Authority (DLSA)",
                "Summary Commercial Suit for Contractual Debt Liquidation",
            ],
            requiredDocuments: [
                "Employment Contract / Offer Letter & Appraisal Letters",
                "Bank Statements Demonstrating Salary Default",
                "Formal Resignation Email & Handover Completion Sign-Off",
                "Invoices & Written Communication Threads",
            ],
            nextActions: [
                "Quantify unpaid salary, accrued leave encashment, and interest",
                "Dispatch formal lawyer-signed RPAD legal notice to Corporate Registered Office",
                "Lodge online grievance with the Labour Commissioner's Portal",
            ],
            riskLevel: "High",
            draftNotice: `STATUTORY DEMAND NOTICE UNDER PAYMENT OF WAGES ACT & SECTION 73 CONTRACT ACT

To: The Board of Directors / Management, [COMPANY NAME]
Registered Office: [CORPORATE ADDRESS, ${city || "MUMBAI"}]

Sub: FORMAL DEMAND FOR IMMEDIATE DISBURSEMENT OF WITHHELD EARNED SALARY OF ₹${principal.toLocaleString('en-IN')} AND ISSUANCE OF STATUTORY RELIEVING DOCUMENTS.

1. That my client was employed as [DESIGNATION] and tendered resignation in full compliance with company policy.
2. That despite completion of formal knowledge transfer and handover, you have illegally withheld earned dues amounting to ₹${principal.toLocaleString('en-IN')}.
3. Take notice that you are mandated to release ₹${principal.toLocaleString('en-IN')} plus statutory interest of 18% p.a. within 15 days of this notice.`,
        },
        "Police Complaint": {
            summary: "Criminal grievance involving cognizable offense, extortion, physical assault, or financial fraud. Governed under Bharatiya Nyaya Sanhita 2023 / CrPC §154 for mandatory FIR registration.",
            statutesCited: [
                "Section 154 CrPC / Bharatiya Nagarik Suraksha Sanhita (Mandatory FIR)",
                "Section 420 / 406 IPC (Cheating & Criminal Breach of Trust)",
                "Lalita Kumari v. Govt of UP (SC Constitution Bench Ruling)",
            ],
            limitationPeriod: "Cognizable Offense — Prompt Reporting within Statutory Limitation",
            limitationDaysRemaining: 180,
            legalPathways: [
                "Written Complaint Submission to Station House Officer (SHO)",
                "Escalation to Superintendent of Police / DCP under Sec 154(3)",
                "Section 156(3) Magistrate Direction for Court-Monitored FIR",
            ],
            requiredDocuments: [
                "Detailed Chronological Timeline of Incident",
                "Call Recordings, WhatsApp Chats, and Email Threads",
                "Medical Legal Examination (MLC) Report if Physical Injury",
                "Witness Contact Details & Affidavit",
            ],
            nextActions: [
                "Obtain General Diary (GD) Entry or Aknowledgement Receipt from Police Station",
                "Retain Senior Criminal Defense Counsel for Section 156(3) filing",
                "Preserve hash values of digital evidence under Section 65B",
            ],
            riskLevel: "High",
        },
        "Family / Divorce": {
            summary: "Matrimonial grievance regarding restitution, mutual consent divorce under Section 13B, or interim maintenance under Section 125 CrPC.",
            statutesCited: [
                "Hindu Marriage Act 1955 §13B (Mutual Consent Dissolution)",
                "Section 125 CrPC (Interim Maintenance & Alimony)",
                "Protection of Women from Domestic Violence Act 2005",
            ],
            limitationPeriod: "Personal Law Proceedings — Continuous Cause of Action",
            limitationDaysRemaining: 365,
            legalPathways: [
                "Confidential Pre-Litigation Mediation & Settlement Agreement",
                "Joint First Motion Petition under Section 13B HMA",
                "Application for Interim Custody and Maintenance",
            ],
            requiredDocuments: [
                "Original Marriage Certificate & Wedding Photograph",
                "Proof of Separate Residence for 1+ Year",
                "Income Tax Returns & Asset Disclosures of Both Parties",
            ],
            nextActions: [
                "Draft comprehensive Memorandum of Understanding (MOU) on assets",
                "Schedule private video consultation with High Court Family Counsel",
            ],
            riskLevel: "Low",
        },
        "Cyber Crime": {
            summary: "Digital financial fraud, unauthorized banking debit, or phishing fraud. Immediate action required under IT Act 2000 §66D and RBI Circular on Customer Liability.",
            statutesCited: [
                "Information Technology Act 2000 §66C, §66D & §43",
                "RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 (Zero Liability)",
                "Section 420 IPC (Cheating by Impersonation)",
            ],
            limitationPeriod: "Zero Customer Liability window — Mandatory 72-Hour Bank Reporting",
            limitationDaysRemaining: 2,
            legalPathways: [
                "Immediate Lodgment on National Cyber Crime Portal (cybercrime.gov.in / 1930)",
                "Formal Written Dispute Notice to Bank Nodal Officer citing RBI Zero Liability",
                "Banking Ombudsman Escalation under RBI Integrated Ombudsman Scheme",
            ],
            requiredDocuments: [
                "Bank Account Statement Showing Fraudulent Debits",
                "Transaction Reference IDs (UTR / RRN Numbers)",
                "Screenshots of Fraudulent SMS / WhatsApp / URL Links",
            ],
            nextActions: [
                "Call 1930 immediately to freeze the beneficiary bank account",
                "Submit formal dispute form at home branch within 72 hours",
            ],
            riskLevel: "High",
        },
        "General": {
            summary: "Civil or statutory grievance requiring structured legal analysis and jurisdiction assessment.",
            statutesCited: ["Code of Civil Procedure 1908", "Specific Relief Act 1963"],
            limitationPeriod: "Limitation Act 1963 — 3 Years",
            limitationDaysRemaining: 365,
            legalPathways: ["Statutory Legal Demand Notice", "Civil Suit for Recovery / Injunction"],
            requiredDocuments: ["Identity Proof", "Written Agreements / Correspondence"],
            nextActions: ["Provide specific dates and financial values", "Consult Verified Advocate"],
            riskLevel: "Medium",
        },
    };

    const base = roadmaps[category] || roadmaps["Property Dispute"];

    return {
        category,
        city: city || "Bengaluru",
        summary: base.summary!,
        statutesCited: base.statutesCited || [
            "Transfer of Property Act 1882 §108",
            "Limitation Act 1963 Article 7",
        ],
        limitationPeriod: base.limitationPeriod || "Limitation Act 1963 — 3 Years",
        limitationDaysRemaining: base.limitationDaysRemaining || 742,
        claimQuantification: {
            principal,
            interest,
            courtFee,
            total,
        },
        legalPathways: base.legalPathways || [
            "Issue 15-Day Formal RPAD Legal Demand Notice",
            "Summary Civil Suit under Order 37 CPC",
        ],
        requiredDocuments: base.requiredDocuments || [
            "Lease Agreement / Contract",
            "Bank Proof of Payment",
            "Notice Letters",
        ],
        nextActions: base.nextActions || [
            "Dispatch formal demand notice",
            "Deploy strategy session with verified counsel",
        ],
        riskLevel: base.riskLevel || "Medium",
        draftNotice: base.draftNotice,
    };
}
