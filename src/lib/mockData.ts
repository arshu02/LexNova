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
}

export const advocates: Advocate[] = [
    {
        id: "1",
        name: "Adv. Rajesh Kumar",
        experience: 14,
        specializations: ["Property Dispute", "Land Registry", "Civil Cases"],
        city: "Patna",
        fee: 1500,
        responseTime: "10 min",
        rating: 4.8,
        reviewCount: 127,
        verified: true,
        initials: "RK",
        color: "#1e293b",
        tags: ["High Success Rate", "Property Expert"],
    },
    {
        id: "2",
        name: "Adv. Priya Sharma",
        experience: 9,
        specializations: ["Family Law", "Divorce", "Child Custody"],
        city: "Mumbai",
        fee: 2000,
        responseTime: "15 min",
        rating: 4.9,
        reviewCount: 89,
        verified: true,
        initials: "PS",
        color: "#1e293b",
        tags: ["Empathetic", "Family Expert"],
    },
    {
        id: "3",
        name: "Adv. Anil Verma",
        experience: 18,
        specializations: ["Criminal Law", "Police Complaint", "FIR Filing"],
        city: "Delhi",
        fee: 2500,
        responseTime: "5 min",
        rating: 4.7,
        reviewCount: 213,
        verified: true,
        initials: "AV",
        color: "#1e293b",
        tags: ["Aggressive Defense", "Criminal Expert"],
    },
    {
        id: "4",
        name: "Adv. Sneha Patel",
        experience: 7,
        specializations: ["Cyber Crime", "IT Act", "Online Fraud"],
        city: "Mumbai",
        fee: 1800,
        responseTime: "20 min",
        rating: 4.6,
        reviewCount: 54,
        verified: true,
        initials: "SP",
        color: "#1e293b",
        tags: ["Cyber specialist", "Fast responder"]
    },
    {
        id: "5",
        name: "Adv. Mohammed Ali",
        experience: 22,
        specializations: ["Business Law", "Contract Dispute", "Corporate Law"],
        city: "Delhi",
        fee: 3000,
        responseTime: "30 min",
        rating: 4.9,
        reviewCount: 341,
        verified: true,
        initials: "MA",
        color: "#1e293b",
        tags: ["Senior Counsel", "Corporate Expert"]
    },
    {
        id: "6",
        name: "Adv. Kavita Singh",
        experience: 11,
        specializations: ["Property Dispute", "Tenant Rights", "Rent Act"],
        city: "Mumbai",
        fee: 1200,
        responseTime: "12 min",
        rating: 4.5,
        reviewCount: 98,
        verified: true,
        initials: "KS",
        color: "#1e293b",
        tags: ["Property Expert", "Tenant Advocate"]
    },
    {
        id: "7",
        name: "Adv. Deepak Mishra",
        experience: 6,
        specializations: ["Family Law", "Domestic Violence", "Maintenance"],
        city: "Patna",
        fee: 1000,
        responseTime: "8 min",
        rating: 4.4,
        reviewCount: 42,
        verified: true,
        initials: "DM",
        color: "#1e293b",
        tags: ["Family Court specialist"]
    },
];

export function filterAdvocates(category: CaseCategory | null, city: string | null): Advocate[] {
    if (!category && !city) return [];

    return advocates.filter((advocate) => {
        const matchesCategory = category ? advocate.specializations.includes(category) : true;
        const matchesCity = city ? advocate.city.toLowerCase() === city.toLowerCase() : true;
        return matchesCategory && matchesCity;
    });
}

export function detectCaseCategory(text: string): CaseCategory {
    const t = text.toLowerCase();
    if (t.includes("property") || t.includes("land") || t.includes("plot") || t.includes("house") || t.includes("boundary"))
        return "Property Dispute";
    if (t.includes("police") || t.includes("complaint") || t.includes("fir") || t.includes("criminal") || t.includes("arrest"))
        return "Police Complaint";
    if (t.includes("family") || t.includes("divorce") || t.includes("marriage") || t.includes("custody") || t.includes("maintenance"))
        return "Family / Divorce";
    if (t.includes("cyber") || t.includes("fraud") || t.includes("online") || t.includes("hack") || t.includes("scam"))
        return "Cyber Crime";
    if (t.includes("business") || t.includes("contract") || t.includes("partnership") || t.includes("agreement") || t.includes("company"))
        return "Business Legal Help";
    return "General";
}

export function detectCity(text: string): string | null {
    const t = text.toLowerCase();
    if (t.includes("patna")) return "Patna";
    if (t.includes("delhi")) return "Delhi";
    if (t.includes("mumbai")) return "Mumbai";
    if (t.includes("bangalore") || t.includes("bengaluru")) return "Bangalore";
    if (t.includes("chennai")) return "Chennai";
    if (t.includes("pune")) return "Pune";
    if (t.includes("hyderabad")) return "Hyderabad";
    if (t.includes("lucknow")) return "Lucknow";
    return null;
}

export function generateLegalRoadmap(
    category: CaseCategory,
    city: string | null,
    issue: string
): LegalRoadmap {
    const roadmaps: Record<CaseCategory, Partial<LegalRoadmap>> = {
        "Property Dispute": {
            summary: "Your case involves a direct conflict over property possession or title. This typically requires verification of land records and potential civil litigation for recovery or injunction.",
            legalPathways: ["Civil Suit for Possession", "Mediation with Local Authorities", "Police Intervention for Trespassing"],
            requiredDocuments: ["Sale Deed / Title Deed", "Property Tax Receipts", "Land Registry Papers", "Survey Reports / Map"],
            nextActions: ["Verify land records at the local registry", "Issue a formal legal notice to the opposing party", "Arrange a consultation with a property expert"],
            riskLevel: "Medium",
        },
        "Police Complaint": {
            summary: "You are dealing with a criminal matter requiring immediate police attention. The focus is on FIR registration and potential bail or protection applications.",
            legalPathways: ["Filing of FIR (Sec 154 CrPC)", "Criminal Complaint before Magistrate", "Anticipatory Bail Application"],
            requiredDocuments: ["Incident Timeline", "Witness Contact Info", "Available Medical Evidence", "Police Receipt (GD Entry)"],
            nextActions: ["Report to the nearest Police Station", "Contact a criminal defense expert", "Preserve all digital or physical evidence"],
            riskLevel: "High",
        },
        "Family / Divorce": {
            summary: "A sensitive matter involving marital status, custody, or maintenance. Legal options vary between mutual consent and contested filings under personal laws.",
            legalPathways: ["Mutual Consent Divorce (Fastest)", "Contested Divorce Petition", "Application for Interim Maintenance"],
            requiredDocuments: ["Marriage Certificate", "Proof of Residency", "Income Affidavits", "Custody Preference Notes"],
            nextActions: ["Schedule a private family counseling session", "Draft the interim maintenance application", "Document all assets for division"],
            riskLevel: "Low",
        },
        "Cyber Crime": {
            summary: "Digital fraud or harassment requiring technical evidence preservation and reporting to specialized cyber cells.",
            legalPathways: ["Cyber Cell Complaint", "Bank Transaction Reversal Request", "Civil Damages Suit"],
            requiredDocuments: ["Transaction Screenshots", "URL / Profile Links", "Bank Statements", "Communication Logs (Chat/Email)"],
            nextActions: ["Block all compromised accounts", "Report the case on the National Cyber Crime Portal", "Inform your bank immediately"],
            riskLevel: "Medium",
        },
        "Business Legal Help": {
            summary: "Commercial disputes involving contracts, partnerships, or corporate compliance matters requiring professional arbitration or litigation.",
            legalPathways: ["Arbitration / Mediation Clause Activation", "Commercial Suit for Damages", "NCLT Filing for Company Matters"],
            requiredDocuments: ["Signed Agreements / MOUs", "GST Registration Copies", "Invoices and Payment Records", "Communication Thread"],
            nextActions: ["Audit current contract compliance", "Send a formal demand letter", "Prepare for out-of-court settlement talks"],
            riskLevel: "Medium",
        },
        "General": {
            summary: "Your query requires further classification to identify the exact legal roadmap. We recommend a general consultation.",
            legalPathways: ["General Legal Consultancy", "Legal Notice Issuance"],
            requiredDocuments: ["Personal ID Proof", "Any relevant correspondence"],
            nextActions: ["Provide more details for a deep analysis", "Consult a general practice advocate"],
            riskLevel: "Low",
        },
    };

    const base = roadmaps[category] || roadmaps["General"];

    return {
        category,
        city,
        summary: base.summary!,
        legalPathways: base.legalPathways!,
        requiredDocuments: base.requiredDocuments!,
        nextActions: base.nextActions!,
        riskLevel: base.riskLevel!,
    };
}
