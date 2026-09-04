'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, ArrowRight, Shield, Zap, CheckCircle2, ChevronRight,
  FileText, MessageSquare, Users, Lock, Sparkles, Star, Clock,
  Briefcase, ShieldCheck, Building, Award, ArrowUpRight,
  Search, Video, Check, Globe, CornerDownLeft, Terminal,
  Cpu, Building2, Gavel, FileCheck, Layers, AlertCircle,
  Code2, Copy, Play, RefreshCw, Sliders, Activity, Database,
  Calendar, AlertTriangle, TrendingUp, Send, FileSignature,
  BookmarkCheck, Eye, HelpCircle, Radio, Compass, ExternalLink,
  ChevronDown, DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const LegalScales3D = dynamic(() => import('@/components/LegalScales3D'), { ssr: false });


// ── Global Cross-Border Dispute Scenarios ─────────────────────
interface GlobalScenario {
  id: string;
  badge: string;
  flag: string;
  country: string;
  title: string;
  jurisdiction: string;
  claimAmountDisplay: string;
  currency: string;
  statute: string;
  precedent: string;
  limitationDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  forum: string;
  noticeFormat: string;
  noticeExcerpt: string;
}

const GLOBAL_SCENARIOS: GlobalScenario[] = [
  {
    id: 'us-saas',
    badge: 'COMMERCIAL CONTRACT & SAAS',
    flag: '🇺🇸',
    country: 'United States',
    title: 'Enterprise Client Defaulted on $140,000 Annual SaaS Agreement',
    jurisdiction: 'Delaware Court of Chancery / US Federal District Court',
    claimAmountDisplay: '$140,000',
    currency: 'USD',
    statute: 'Uniform Commercial Code (UCC) §2-708 & Delaware General Corp Law',
    precedent: 'Kahn v. M&F Worldwide Corp., 88 A.3d 635 (Del. 2014)',
    limitationDays: 1040,
    riskLevel: 'LOW',
    forum: 'Delaware Commercial Division & AAA Arbitration',
    noticeFormat: 'FORMAL NOTICE OF MATERIAL BREACH & DEMAND FOR PAYMENT',
    noticeExcerpt:
      'RE: FORMAL NOTICE OF MATERIAL DEFAULT AND DEMAND FOR CURE. TAKE NOTICE that pursuant to Section 8.2 of the Master Services Agreement, Defaulting Corp is in material breach for non-remittance of $140,000.00. You are granted 30 calendar days to cure said default. Failure to remit full payment plus contractual late charges @1.5% per month will result in immediate commencement of expedited commercial arbitration under AAA Commercial Rules in Wilmington, Delaware, with full recovery of attorney fees.',
  },
  {
    id: 'uk-contractor',
    badge: 'REMOTE EMPLOYMENT & LABOUR',
    flag: '🇬🇧',
    country: 'United Kingdom',
    title: 'Tech Founder Wrongfully Withheld £65,000 Contractor Invoices',
    jurisdiction: 'High Court of Justice (Commercial Court, King’s Bench), London',
    claimAmountDisplay: '£65,000',
    currency: 'GBP',
    statute: 'Employment Rights Act 1996 & UK Late Payment of Commercial Debts Act 1998',
    precedent: 'Malik and Mahmud v. Bank of Credit and Commerce International [1997] UKHL 23',
    limitationDays: 1820,
    riskLevel: 'LOW',
    forum: 'Rolls Building, London (Commercial Court) & CPR Practice Direction',
    noticeFormat: 'LETTER OF CLAIM (CPR PRE-ACTION PROTOCOL FOR DEBT CLAIMS)',
    noticeExcerpt:
      'WITHOUT PREJUDICE SAVE AS TO COSTS. This letter constitutes a formal Letter of Claim pursuant to the Pre-Action Protocol for Debt Claims under the Civil Procedure Rules (CPR). Our client claims the principal debt of £65,000.00 in respect of unpaid milestone deliverables, together with statutory interest @8% above Bank of England base rate under the Late Payment of Commercial Debts (Interest) Act 1998. Unless payment is received within 30 days, proceedings will be issued in the County Court Business Centre without further notice.',
  },
  {
    id: 'eu-gdpr',
    badge: 'DATA PROTECTION & B2B TECH',
    flag: '🇪🇺',
    country: 'European Union',
    title: 'Cross-Border B2B Supply Default & Unauthorized API Scraping',
    jurisdiction: 'Frankfurt Regional Court (Landgericht Frankfurt) & Brussels I Recast',
    claimAmountDisplay: '€95,000',
    currency: 'EUR',
    statute: 'EU General Data Protection Regulation (GDPR) Art. 82 & BGB §286 Verzug',
    precedent: 'CJEU Case C-300/21 Österreichische Post (Right to Compensation under GDPR)',
    limitationDays: 780,
    riskLevel: 'MEDIUM',
    forum: 'Frankfurt Commercial Chamber & European Order for Payment',
    noticeFormat: 'FORMAL MAHNSCHREIBEN & REQUISITION FOR INJUNCTIVE RELIEF',
    noticeExcerpt:
      'MAHNUNG UND SCHADENSERSATZFORDERUNG. We hereby formally demand immediate remittance of €95,000.00 for services rendered under EU Late Payment Directive 2011/7/EU, along with immediate cessation of unauthorized biometric data extraction under GDPR Article 82. In accordance with Regulation (EC) No 1896/2006, failure to remit settlement within 14 business days shall prompt filing of a European Order for Payment enforceable throughout all EU Member States.',
  },
  {
    id: 'sg-arbitration',
    badge: 'CROSS-BORDER ARBITRATION',
    flag: '🇸🇬',
    country: 'Singapore & APAC',
    title: 'International Supply Chain Breach & Goods Withheld at Port',
    jurisdiction: 'Singapore International Arbitration Centre (SIAC) / UNCITRAL',
    claimAmountDisplay: '$350,000',
    currency: 'USD',
    statute: 'International Arbitration Act (Cap. 143A) & 1958 New York Convention',
    precedent: 'PT First Media TBK v. Astro Nusantara International BV [2013] SGCA 57',
    limitationDays: 1450,
    riskLevel: 'LOW',
    forum: 'Maxwell Chambers, Singapore (SIAC Expedited Procedure)',
    noticeFormat: 'NOTICE OF ARBITRATION & ASSET FREEZE RESERVATION',
    noticeExcerpt:
      'NOTICE OF DISPUTE AND REQUISITION FOR AMICABLE SETTLEMENT UNDER SIAC RULES 2024. Claimant hereby requisitions payment of $350,000.00 representing undelivered micro-semiconductor consignments. Notice is hereby given that if bilateral settlement is not executed within 21 days, Claimant will file a Notice of Arbitration with the Registrar of the Singapore International Arbitration Centre seeking an emergency interim award and worldwide enforcement pursuant to the 1958 New York Convention across 172 contracting states.',
  },
  {
    id: 'in-commercial',
    badge: 'COMMERCIAL RECOVERY & BNS',
    flag: '🇮🇳',
    country: 'India',
    title: 'Defaulted ₹85,00,000 Commercial Vendor Payment Post Delivery',
    jurisdiction: 'Commercial Division, High Court of Bombay & Section 138 NI Act',
    claimAmountDisplay: '₹85,00,000',
    currency: 'INR',
    statute: 'Commercial Courts Act 2015, Sec 138 NI Act & Bharatiya Nyaya Sanhita (BNS) §318',
    precedent: 'Patil Automation Pvt. Ltd. v. Rakheja Engineers (SC 2022) 10 SCC 1',
    limitationDays: 28,
    riskLevel: 'CRITICAL',
    forum: 'Commercial Courts & High Court of Bombay',
    noticeFormat: 'LEGAL NOTICE UNDER REGISTERED POST A.D. & ORDER XXXVII CPC',
    noticeExcerpt:
      'DEMAND NOTICE UNDER REGISTERED POST WITH ACKNOWLEDGMENT DUE (RPAD): Cheque No. 902188 for ₹85,00,000/- issued towards cleared steel consignments was returned unpaid with remark "Payment Stopped by Drawer". You are hereby demanded to remit the said sum with 18% statutory interest within 15 days of receipt of this notice, failing which criminal proceedings under Section 138 Negotiable Instruments Act and Section 318 BNS (Cheating) shall be instituted in Mumbai.',
  },
];

const GLOBAL_LIMITATION_DATA = [
  {
    jurisdiction: 'United States (Delaware / NY)',
    flag: '🇺🇸',
    cause: 'Breach of Commercial Contract (UCC)',
    maxDays: 1460, // 4 years
    statute: 'UCC §2-725 / NY CPLR 213',
    riskWindow: '4-Year Federal / State UCC Period',
  },
  {
    jurisdiction: 'United Kingdom (England & Wales)',
    flag: '🇬🇧',
    cause: 'Simple Contract & Commercial Debt',
    maxDays: 2190, // 6 years
    statute: 'Limitation Act 1980 Section 5',
    riskWindow: '6-Year High Court Statutory Clock',
  },
  {
    jurisdiction: 'European Union (Germany / France)',
    flag: '🇪🇺',
    cause: 'Commercial Claims & B2B Obligations',
    maxDays: 1095, // 3 years standard BGB
    statute: 'Bürgerliches Gesetzbuch (BGB) §195',
    riskWindow: '3-Year End-of-Year Prescription',
  },
  {
    jurisdiction: 'Singapore (SIAC & Common Law)',
    flag: '🇸🇬',
    cause: 'Cross-Border Contract & Tort',
    maxDays: 2190, // 6 years
    statute: 'Limitation Act (Cap. 163) Section 6',
    riskWindow: '6-Year Commonwealth Limit',
  },
  {
    jurisdiction: 'India & South Asia',
    flag: '🇮🇳',
    cause: 'Recovery of Money & Breach of Contract',
    maxDays: 1095, // 3 years
    statute: 'Limitation Act 1963 Article 55/113',
    riskWindow: '3-Year Strict Extinction Clock',
  },
];

const GLOBAL_ADVOCATES = [
  {
    name: 'Sarah Jenkins, Esq.',
    title: 'Partner, Commercial & Tech Litigation',
    jurisdiction: 'New York & Delaware Bar (US)',
    credentials: 'NY Bar #4891024 · Admitted S.D.N.Y.',
    focus: 'Cross-Border SaaS, UCC Contracts, Delaware Chancery',
    rating: '5.0',
    fee: '$350/hr',
    flag: '🇺🇸',
    verifiedCases: '280+ Cross-Border Resolves',
  },
  {
    name: 'David Alistair-Smith, KC',
    title: 'Solicitor Advocate, Commercial Court',
    jurisdiction: 'England & Wales (High Court of Justice)',
    credentials: 'SRA ID #598210 · Rolls Building Admitted',
    focus: 'UK CPR Pre-Action Claims, High Court Debt Recovery',
    rating: '4.9',
    fee: '£295/hr',
    flag: '🇬🇧',
    verifiedCases: '340+ Commercial Disputes',
  },
  {
    name: 'Dr. Hélène Moreau',
    title: 'Avocat au Barreau & European Regulatory Counsel',
    jurisdiction: 'Paris & Frankfurt Bar (EU)',
    credentials: 'Barreau de Paris #B1948 · DAV Member',
    focus: 'EU Late Payment Directive, GDPR Art. 82, Cross-Border EOP',
    rating: '4.9',
    fee: '€275/hr',
    flag: '🇪🇺',
    verifiedCases: '190+ EU Enforcement Matters',
  },
  {
    name: 'Kenneth Tan, FCIArb',
    title: 'Fellow, Chartered Institute of Arbitrators',
    jurisdiction: 'Singapore (SIAC) & Hong Kong (HKIAC)',
    credentials: 'Law Society of Singapore #2012/S89',
    focus: 'International Arbitration, New York Convention Enforcement',
    rating: '4.9',
    fee: 'S$380/hr',
    flag: '🇸🇬',
    verifiedCases: '220+ Cross-Border Awards',
  },
];

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.lexnova.ai/v1/cases/intake \\
  -H "Authorization: Bearer ln_global_live_8f91a2e7c4" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdiction": "US_DELAWARE",
    "claim_currency": "USD",
    "claim_amount": 140000,
    "dispute_type": "CROSS_BORDER_CONTRACT_BREACH",
    "description": "Counterparty in Munich failed to deliver enterprise software license under Delaware choice-of-law clause.",
    "auto_generate_pre_action_notice": true
  }'`,
  typescript: `import { LexNovaGlobalClient } from '@lexnova/sdk';

const lexnova = new LexNovaGlobalClient({
  apiKey: process.env.LEXNOVA_API_KEY,
  defaultJurisdiction: 'US_DELAWARE' // 'UK_ENGLAND_WALES' | 'EU_GERMANY' | 'SG_SIAC' | 'INDIA'
});

// Autonomous Multi-Jurisdiction Cross-Referencing
const intake = await lexnova.cases.analyze({
  title: "Cross-Border SaaS Contract Default",
  principalClaim: { amount: 140000, currency: "USD" },
  parties: {
    claimantJurisdiction: "US_DELAWARE",
    respondentJurisdiction: "EU_GERMANY"
  },
  choiceOfLaw: "DELAWARE_GENERAL_CORP_LAW"
});

console.log(intake.statuteCitations); 
// ["UCC §2-708", "Delaware Chancery Court Rules Rule 12"]
console.log(intake.statuteOfLimitationsDeadline); 
// "2028-09-15 (1,040 days remaining)"
console.log(intake.enforceablePreActionNoticePdfUrl);`,
  python: `from lexnova import LexNovaGlobal

client = LexNovaGlobal(api_key="ln_global_live_8f91a2e7c4")

# Cross-Border Pre-Action Notice & Statutory Interest Computation
analysis = client.disputes.intake(
    jurisdiction="UK_ENGLAND_WALES",
    claim_amount=65000,
    currency="GBP",
    dispute_classification="COMMERCIAL_DEBT",
    apply_statutory_interest=True # Computes Bank of England + 8% under 1998 Act
)

print(f"Limitation Clock: {analysis.limitation_clock.days_remaining} days")
print(f"Pre-Action Protocol Notice: {analysis.court_admissible_notice_url}")`,
};

const GLOBAL_FAQS = [
  {
    q: "How does LexNova handle cross-border disputes and conflicting choices of law?",
    a: "LexNova's neural conflict-of-laws engine parses choice-of-law and forum-selection clauses (e.g. Delaware, English High Court, SIAC, Frankfurt) in commercial contracts. It automatically determines whether UNCITRAL, the 1958 New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards, or domestic civil procedure codes govern pre-action protocol demands.",
  },
  {
    q: "Are the generated notices admissible in US, UK, EU, and Asian courts?",
    a: "Yes. In the United States, notices adhere to formal 30-day Cure and Demand standards required by UCC and state contract jurisprudence. In the UK, drafts follow the strict Pre-Action Protocol for Debt Claims under the Civil Procedure Rules (CPR). In the EU, notices comply with the EU Late Payment Directive 2011/7/EU and German Mahnschreiben standards. In India, notices are court-admissible under RPAD evidentiary rules.",
  },
  {
    q: "How does the Global Statute of Limitations Tracker work across countries?",
    a: "Limitation periods vary drastically by country: 4 years under the US Uniform Commercial Code, 6 years under the UK Limitation Act 1980, 3 years under the German Civil Code (BGB §195), and 3 years in India. LexNova automatically clocks elapsed time against statutory bars so your claim rights are never extinguished.",
  },
  {
    q: "Can I retain verified international attorneys and solicitors?",
    a: "Yes. LexNova operates an international roster of licensed practitioners across the US (New York, California, Delaware Bars), the United Kingdom (Solicitors Regulation Authority & King's Counsel), the European Union (Paris, Frankfurt, Amsterdam Bars), and Asia (Singapore Law Society, Bar Council of India). You can book encrypted cross-border strategy sessions with 1 click.",
  },
  {
    q: "How is global attorney-client privilege and data privacy maintained?",
    a: "All interactions, case briefs, and evidence are protected by zero-knowledge AES-256 GCM encryption. Transmission complies with US Federal Rule of Evidence 502 (Attorney-Client Privilege), English Common Law Legal Professional Privilege, EU GDPR (Art. 32 Technical Safeguards), and international privilege doctrines.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [heroInput, setHeroInput] = useState('');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('us-saas');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR' | 'SGD'>('USD');
  const [simClaimAmount, setSimClaimAmount] = useState(100000);
  const [selectedLimitation, setSelectedLimitation] = useState(GLOBAL_LIMITATION_DATA[0]);
  const [limitationDaysElapsed, setLimitationDaysElapsed] = useState(180);
  const [apiSimulating, setApiSimulating] = useState(false);
  const [apiResponseText, setApiResponseText] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeScenario = GLOBAL_SCENARIOS.find((s) => s.id === activeScenarioId) || GLOBAL_SCENARIOS[0];

  // Auto-cycle through pipeline stages every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePipelineStage((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroInput.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(heroInput.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const runApiSimulation = () => {
    setApiSimulating(true);
    setApiResponseText(null);
    setTimeout(() => {
      setApiResponseText(
        JSON.stringify(
          {
            status: 201,
            success: true,
            docketId: `GLN-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            jurisdictionMapped: activeScenario.jurisdiction,
            country: activeScenario.country,
            applicableStatutes: [
              activeScenario.statute,
              'UNCITRAL Model Law on International Commercial Arbitration (1985/2006)',
            ],
            bindingPrecedents: [
              activeScenario.precedent,
              'New York Convention on Foreign Arbitral Awards (1958 Article III)',
            ],
            claimQuantification: {
              principal: activeScenario.claimAmountDisplay,
              currency: activeScenario.currency,
              statutoryInterestAccrued: 'CALCULATED_PER_LOCAL_LAW',
              totalClaimPayable: activeScenario.claimAmountDisplay,
            },
            statuteOfLimitations: {
              daysRemaining: activeScenario.limitationDays,
              status: activeScenario.riskLevel,
              statuteCited: activeScenario.statute,
            },
            preActionNoticeResult: {
              format: activeScenario.noticeFormat,
              status: 'COURT_ADMISSIBLE_READY_FOR_SERVICE',
              serviceMethods: ['Registered Post', 'Bailiff Service', 'Electronic Proof-of-Service'],
            },
            verifiedCounselHandoff: {
              status: 'MATCHED',
              regionsAvailable: ['US Bar', 'UK SRA', 'EU Bar Association', 'SIAC Arbitrators'],
            },
          },
          null,
          2
        )
      );
      setApiSimulating(false);
    }, 600);
  };

  // Currency interest rules
  const currencySymbol =
    selectedCurrency === 'USD' ? '$' :
    selectedCurrency === 'EUR' ? '€' :
    selectedCurrency === 'GBP' ? '£' :
    selectedCurrency === 'INR' ? '₹' : 'S$';

  const interestRate =
    selectedCurrency === 'USD' ? 0.085 : // US Pre-judgment interest ~8.5%
    selectedCurrency === 'EUR' ? 0.115 : // EU Late Payment Directive (ECB + 8%) ~11.5%
    selectedCurrency === 'GBP' ? 0.1325 : // UK Late Payment Act (BOE + 8%) ~13.25%
    selectedCurrency === 'INR' ? 0.18 : // India CPC §34 / Commercial Courts 18%
    0.0533; // Singapore Rules of Court ~5.33%

  const interestAmount = Math.round(simClaimAmount * interestRate);
  const courtFeeEst = Math.max(250, Math.round(simClaimAmount * 0.02));
  const totalRecovery = simClaimAmount + interestAmount;

  // Deterministic number formatter (avoids server/client locale mismatch)
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Limitation calculation
  const remainingDays = Math.max(0, selectedLimitation.maxDays - limitationDaysElapsed);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col relative selection:bg-blue-600 selection:text-white hud-grid overflow-x-hidden">
      <Navbar />

      {/* Futuristic Deep Space / Cyber Backdrop */}
      <div className="fixed inset-0 hud-mesh pointer-events-none z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── 1. REAL-TIME GLOBAL LEGAL TELEMETRY TICKER ─────────────── */}
      <div className="relative z-20 pt-[74px] border-b border-white/[0.06] bg-[#03060E]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#8D9CB0] overflow-x-auto gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              JURISDICTION NETWORK: 52 FORUMS ONLINE
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Scale size={12} className="text-blue-400" />
              <span>US (DEL/NY/CA) · UK HIGH COURT · EU DIRECTIVES · APAC ARBITRATION</span>
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-right">
            <span className="hidden md:inline text-slate-400">
              AVERAGE INTAKE: <strong className="text-white">32s</strong>
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>PRIVILEGE: AES-256 GCM</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HERO SECTION WITH 3D HOLOGRAPHIC LEGAL SCALES ──────────── */}
      <section className="pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10 space-y-8 overflow-visible">
        
        {/* Interactive 3D WebGL Holographic Legal Scales Backdrop */}
        <div className="absolute inset-0 -top-8 w-full h-[620px] pointer-events-none z-0 opacity-70">
          <LegalScales3D />
        </div>

        {/* Global Jurisdiction Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-cyan-950/70 backdrop-blur-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] font-mono text-[11.5px] text-blue-300 tracking-wider uppercase relative z-10"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>AUTONOMOUS LEGAL OS · ENTERPRISE CONTRACT & DISPUTE INTELLIGENCE</span>
        </motion.div>

        {/* Grounded, Powerful & Meaningful Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-[-0.04em] max-w-6xl mx-auto leading-[1.02] relative z-10"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_2px_14px_rgba(255,255,255,0.2)]">
            THE AUTONOMOUS LEGAL OS.
          </span>
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="text-gradient-flashy drop-shadow-[0_0_50px_rgba(96,165,250,0.65)]">
              PRECISION FOR GLOBAL COMMERCE.
            </span>
            {/* Ambient laser glow refraction aura */}
            <span className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-blue-600/35 via-purple-600/30 to-cyan-500/35 blur-3xl -z-10 rounded-full pointer-events-none opacity-85 animate-pulse-glow" />
          </span>
        </motion.h1>

        {/* Clean, Grounded & Meaningful Caption */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-base sm:text-xl text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight relative z-10"
        >
          Analyze contract breaches, calculate statutory pre-judgment interest, and generate court-admissible demand notices across 50+ jurisdictions in seconds.
        </motion.p>

        {/* Interactive Neural Intake HUD Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="max-w-3xl mx-auto pt-2 relative z-10"
        >
          <form
            onSubmit={handleHeroSubmit}
            className="p-3 bg-[#05070C]/90 backdrop-blur-2xl border border-white/[0.14] focus-within:border-blue-500/80 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all space-y-3"
          >
            <div className="flex items-center px-3 pt-1">
              <Sparkles size={18} className="text-blue-400 shrink-0 mr-3" />
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Describe your dispute (e.g. US client defaulted on $140k contract, UK remote contractor non-payment, EU GDPR breach)..."
                className="w-full bg-transparent border-none text-white text-[15px] placeholder-[#55667E] focus:outline-none py-2"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/[0.08] px-2 gap-3">
              <div className="flex items-center gap-2 text-[12px] text-[#7A8A9E] font-mono">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>GLOBAL PRIVILEGE (US FRE 502 · UK PRIVILEGE · EU GDPR)</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="btn-glow-blue w-full sm:w-auto h-11 px-6 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>Execute Analysis</span>
                  <CornerDownLeft size={14} />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Scenario Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-[12.5px] text-[#7A8A9E]">
            <span className="text-[#55667E] font-mono text-[11px] uppercase tracking-wider">Worldwide Scenarios:</span>
            {[
              { label: "🇺🇸 $140k US SaaS Default", text: "US enterprise counterparty defaulted on $140k contract governed by Delaware law" },
              { label: "🇬🇧 £65k UK Contractor Breach", text: "London client withheld £65,000 contractor milestone invoices under English law" },
              { label: "🇪🇺 €95k EU Commercial Dispute", text: "German supplier delivered defective components with refused refund under BGB §286" },
              { label: "🇸🇬 $350k SIAC Arbitration", text: "International maritime supply chain breach with SIAC arbitration clause" },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroInput(chip.text)}
                className="px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[#CBD5E1] text-[12px] transition-all hover:border-blue-500/40"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Global Telemetry Metrics Matrix */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-white/[0.08] relative z-10"
        >
          <div className="space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono">$840M+</div>
            <div className="text-[11.5px] text-[#8D9CB0] uppercase tracking-wider font-mono">Disputes Quantified</div>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-400 font-mono">50+</div>
            <div className="text-[11.5px] text-[#8D9CB0] uppercase tracking-wider font-mono">Countries & States</div>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 font-mono">4,200+</div>
            <div className="text-[11.5px] text-[#8D9CB0] uppercase tracking-wider font-mono">Attorneys & Counsel</div>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-400 font-mono">&lt; 60 sec</div>
            <div className="text-[11.5px] text-[#8D9CB0] uppercase tracking-wider font-mono">Pre-Action Generation</div>
          </div>
        </motion.div>
      </section>

      {/* ── 2B. ENTERPRISE LEGAL PRODUCT & WORKSPACE SHOWCASE ────────── */}
      <section className="pt-4 pb-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono">
            ENTERPRISE ARCHITECTURE · FULL AUTONOMY
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Engineered for High-Stakes Commercial Law
          </h3>
          <p className="text-[14.5px] text-[#8D9CB0] max-w-xl mx-auto">
            Autonomous legal operations trusted by cross-border founders, corporate counsels, and enterprise litigation teams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Enterprise Contract & Dispute Workspace */}
          <div className="group relative rounded-3xl overflow-hidden border border-white/[0.12] bg-[#05070C] shadow-2xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <Image
                src="/images/lexnova_product_dashboard.jpg"
                alt="LexNova enterprise contract dispute analysis interface"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-[#05070C]/30 to-transparent" />
              
              {/* Product HUD Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] text-cyan-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>LIVE WORKSPACE · CONTRACT CLAUSE MAPPING</span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                STATUTORY ENGINE: ACTIVE
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3 relative z-10 -mt-6">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                <FileText size={14} />
                <span>Automated Clause Dissection</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Enterprise Contract & Dispute Workspace
              </h4>
              <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                Autonomous clause extraction, breach detection, and statutory damages quantification displayed in a unified executive docket with real-time statutory calculation.
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Clause Parsing: &lt; 30s</span>
                <span className="text-emerald-400 font-bold">Admissible Breaches Identified</span>
              </div>
            </div>
          </div>

          {/* Card 2: Global Commercial Operations & Dispatch */}
          <div className="group relative rounded-3xl overflow-hidden border border-white/[0.12] bg-[#05070C] shadow-2xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <Image
                src="/images/legal_operations_hub.jpg"
                alt="Modern corporate legal operations center"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-[#05070C]/30 to-transparent" />
              
              {/* Product HUD Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] text-purple-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>COMMERCIAL DISPATCH: 52 FORUMS</span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                ICC & SIAC SYNCHRONIZED
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3 relative z-10 -mt-6">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                <Gavel size={14} />
                <span>Pre-Action Enforcement & Filings</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Global Commercial Operations & Dispatch
              </h4>
              <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                Coordinates court-ready demand notices, certified postal and digital service, and direct handover to verified commercial litigators across international forums.
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Enforcement Speed: Instant</span>
                <span className="text-cyan-400 font-bold">Verified Counsel Handoff</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── 3. CORE INNOVATION: LIVE CROSS-BORDER LEGAL ENGINE VISUALIZER ── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono">
            GLOBAL ENGINE · MULTI-JURISDICTION SIMULATOR
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Autonomous Legal Intelligence Across Borders
          </h2>
          <p className="text-[15px] text-[#8D9CB0]">
            Select an international dispute scenario below to observe real-time fact extraction, conflict-of-laws determination, statute of limitations calculation, and court-admissible pre-action notice drafting.
          </p>
        </div>

        {/* Global Scenario Switcher Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {GLOBAL_SCENARIOS.map((scen) => {
            const active = scen.id === activeScenarioId;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  setActiveScenarioId(scen.id);
                  setActivePipelineStage(0);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  active
                    ? 'bg-blue-600/15 border-blue-500/60 shadow-[0_0_25px_rgba(37,99,235,0.25)]'
                    : 'bg-[#05070C]/80 border-white/[0.08] hover:border-white/20 text-[#8D9CB0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{scen.flag}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-400 animate-ping' : 'bg-slate-600'}`} />
                </div>
                <div className={`text-[12px] font-bold truncate ${active ? 'text-white' : 'text-[#CBD5E1]'}`}>
                  {scen.country}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {scen.badge}
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400 mt-1">
                  {scen.claimAmountDisplay}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizer Frame */}
        <div className="glass-panel-luxury rounded-3xl overflow-hidden border border-white/[0.12] max-w-5xl mx-auto">
          
          {/* Top Engine Control Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-[#05070C] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-lg">
                {activeScenario.flag}
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-white flex items-center gap-2">
                  <span>DOCKET: GLN-2026-X884</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    JURISDICTION: {activeScenario.country.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#8D9CB0] font-mono truncate max-w-md">
                  Forum: {activeScenario.forum}
                </p>
              </div>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['1. Extraction', '2. Governing Law', '3. Limitation Clock', '4. Pre-Action Notice'].map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePipelineStage(idx)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 ${
                    activePipelineStage === idx
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'bg-white/[0.04] text-[#8D9CB0] hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Content Stage Display */}
          <div className="p-6 sm:p-8 bg-[#020408] space-y-6">
            <AnimatePresence mode="wait">
              {activePipelineStage === 0 && (
                <motion.div
                  key="stage-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                    <span>STAGE 1: NEURAL CROSS-BORDER FACT PARSING & FORUM SELECTION</span>
                    <span className="text-emerald-400">COMPLETED (14ms)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">Cross-Border Claim</span>
                      <p className="text-[13.5px] font-bold text-white leading-snug">{activeScenario.title}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">Principal Claimed</span>
                      <p className="text-2xl font-black font-mono text-emerald-400">
                        {activeScenario.claimAmountDisplay}
                      </p>
                      <span className="text-[10px] text-slate-400 block">+Statutory Pre-Judgment Interest</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">Competent Judicial Forum</span>
                      <p className="text-[12.5px] font-semibold text-cyan-300 leading-snug">{activeScenario.jurisdiction}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePipelineStage === 1 && (
                <motion.div
                  key="stage-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                    <span>STAGE 2: GOVERNING STATUTE & INTERNATIONAL CONVENTION MATCH</span>
                    <span className="text-emerald-400">99.7% ADMISSIBILITY RATING</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold">
                        <Scale size={14} />
                        <span>APPLICABLE DOMESTIC OR UNIFORM STATUTE</span>
                      </div>
                      <p className="text-[14.5px] font-bold text-white leading-snug">
                        {activeScenario.statute}
                      </p>
                      <p className="text-[12px] text-[#8D9CB0]">
                        Verified against governing commercial laws, civil procedure rules, and cross-border conflict doctrines.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold">
                        <BookmarkCheck size={14} />
                        <span>BINDING COMMERCIAL APEX PRECEDENT</span>
                      </div>
                      <p className="text-[14.5px] font-bold text-indigo-200 leading-snug">
                        {activeScenario.precedent}
                      </p>
                      <p className="text-[12px] text-[#8D9CB0]">
                        Binding ratio decidendi confirms right to summary relief, emergency injunctions, and legal cost awards.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePipelineStage === 2 && (
                <motion.div
                  key="stage-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                    <span>STAGE 3: STATUTE OF LIMITATIONS & PRESCRIPTION CLOCK</span>
                    <span className={activeScenario.riskLevel === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {activeScenario.riskLevel} EXTINCTION RISK
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#090D17] border border-white/[0.08] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-slate-400 uppercase">Worldwide Filing Window Remaining</span>
                        <div className="text-3xl sm:text-4xl font-black font-mono text-white flex items-center gap-3">
                          <span>{activeScenario.limitationDays} Days</span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-sans font-semibold">
                            Full Claim Rights Active
                          </span>
                        </div>
                      </div>
                      <div className="text-right sm:text-right">
                        <span className="text-xs font-mono text-slate-400 uppercase">Applicable Framework</span>
                        <p className="text-[13px] font-bold text-emerald-400">
                          {activeScenario.country} Limitation Regime
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-white/[0.05] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeScenario.riskLevel === 'CRITICAL' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(15, (activeScenario.limitationDays / 2190) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[12px] text-slate-400 font-mono">
                      *Prescription or statute of limitations failure bars enforcement under both local courts and the 1958 New York Convention.
                    </p>
                  </div>
                </motion.div>
              )}

              {activePipelineStage === 3 && (
                <motion.div
                  key="stage-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                    <span>STAGE 4: COURT-READY PRE-ACTION DEMAND & NOTICE</span>
                    <button
                      onClick={() => copyNotice(activeScenario.noticeExcerpt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#CBD5E1] text-[11px] font-mono transition-all"
                    >
                      {copiedNotice ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedNotice ? 'Copied' : 'Copy Notice Text'}</span>
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-[#04060B] border border-blue-500/30 space-y-3 font-serif text-[13.5px] leading-relaxed text-[#CBD5E1] shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] font-mono text-[11px] text-slate-400 not-italic">
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-blue-400" />
                        <span>{activeScenario.noticeFormat}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">READY FOR SERVICE</span>
                    </div>

                    <p className="text-white font-sans text-[13px] font-medium leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                      {activeScenario.noticeExcerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-xs font-sans text-slate-400 gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Admissible for expedited commercial filing & counsel handover</span>
                      </div>
                      <Link
                        href={`/dashboard/chat?init=${encodeURIComponent(activeScenario.title)}`}
                        className="btn-glow-blue h-9 px-4 rounded-lg text-xs font-semibold"
                      >
                        Draft in Console →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Stepper CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-[13px]">
              <div className="flex items-center gap-2 text-[#8D9CB0]">
                <span>Have a cross-border dispute in another country?</span>
              </div>
              <Link
                href={`/dashboard/chat?init=${encodeURIComponent(activeScenario.title)}`}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Launch Global Legal Analysis</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. GLOBAL STATUTE OF LIMITATIONS & PRESCRIPTION RADAR ───── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full font-mono">
            GLOBAL STATUTE OF LIMITATIONS TRACKER
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Statutory Deadlines Vary by Country. <br />Never Miss One.
          </h2>
          <p className="text-[15px] text-[#8D9CB0]">
            Whether under the US Uniform Commercial Code, the UK Limitation Act 1980, German BGB §195, or international arbitration rules, missing the statutory deadline completely extinguishes your right to recover.
          </p>
        </div>

        <div className="glass-panel-luxury p-6 sm:p-10 rounded-3xl border border-white/[0.12] max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Preset Selector */}
          <div className="lg:col-span-5 space-y-4">
            <label className="text-xs font-mono font-bold uppercase text-slate-400 block tracking-wider">
              Select Jurisdiction & Cause:
            </label>

            <div className="space-y-2">
              {GLOBAL_LIMITATION_DATA.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedLimitation(preset);
                    setLimitationDaysElapsed(Math.round(preset.maxDays * 0.25));
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    selectedLimitation.jurisdiction === preset.jurisdiction
                      ? 'bg-amber-500/15 border-amber-500/40 text-white font-semibold shadow-md'
                      : 'bg-white/[0.02] border-white/[0.06] text-[#8D9CB0] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span>{preset.flag}</span>
                      <span>{preset.jurisdiction}</span>
                    </span>
                    <span className="font-mono text-xs text-amber-400 font-bold">{preset.maxDays}d</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {preset.cause} · {preset.statute}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Radar Dial & Sliders */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#04060B] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-slate-500 uppercase">Applicable Statute</span>
                <p className="text-[14px] font-bold text-white">{selectedLimitation.statute}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                {selectedLimitation.riskWindow}
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Days Elapsed Since Cause of Action:</span>
                <span className="text-white font-bold text-sm">{limitationDaysElapsed} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedLimitation.maxDays}
                value={limitationDaysElapsed}
                onChange={(e) => setLimitationDaysElapsed(Number(e.target.value))}
                className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>0 Days (Accrual Date)</span>
                <span>{selectedLimitation.maxDays} Days (Absolute Extinction)</span>
              </div>
            </div>

            {/* Results Display */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Statutory Window Remaining</span>
                <div className="text-3xl font-black font-mono text-white">
                  {remainingDays} <span className="text-sm font-normal text-slate-400">days left</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Risk Evaluation</span>
                <div className={`text-xl font-black font-mono ${remainingDays < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {remainingDays < 60 ? 'CRITICAL - ACT NOW' : 'ACTIVE CLAIM WINDOW'}
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/chat?init=${encodeURIComponent(`Check limitation period for: ${selectedLimitation.jurisdiction} - ${selectedLimitation.cause}`)}`}
              className="btn-glow-blue w-full h-11 text-center justify-center text-[13.5px] font-semibold"
            >
              Generate Pre-Suit Notice Before Expiry →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. MULTI-CURRENCY GLOBAL CLAIM & INTEREST CALCULATOR ─────── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full font-mono">
            MULTI-CURRENCY STATUTORY QUANTIFICATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Calculate Statutory Pre-Judgment Interest
          </h2>
          <p className="text-[14.5px] text-[#8D9CB0]">
            Adjust your claim and select currency to calculate legally enforceable pre-judgment interest under US UCC, UK Late Payment Act, or EU directives.
          </p>
        </div>

        <div className="glass-panel-luxury p-8 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-white/[0.12] max-w-5xl mx-auto">
          
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency Selector */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#8D9CB0] uppercase tracking-wider font-mono">
                Currency & Jurisdiction Benchmark
              </label>
              <div className="grid grid-cols-5 gap-2 text-[12px] font-semibold">
                {[
                  { code: 'USD', label: '$ USD (US)' },
                  { code: 'EUR', label: '€ EUR (EU)' },
                  { code: 'GBP', label: '£ GBP (UK)' },
                  { code: 'SGD', label: 'S$ SGD (SG)' },
                  { code: 'INR', label: '₹ INR (IN)' },
                ].map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code as any)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                      selectedCurrency === curr.code
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-bold'
                        : 'bg-white/[0.03] border-white/[0.06] text-[#8D9CB0] hover:text-white'
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-bold text-[#8D9CB0] uppercase tracking-wider font-mono">
                  Principal Claim Amount
                </label>
                <span suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {currencySymbol}{formatAmount(simClaimAmount)}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={simClaimAmount}
                onChange={(e) => setSimClaimAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-[#55667E] font-mono mt-1">
                <span>{currencySymbol}5,000</span>
                <span>{currencySymbol}500,000</span>
                <span>{currencySymbol}1,000,000</span>
              </div>
            </div>
          </div>

          {/* Computed Metrics HUD Card */}
          <div className="p-6 rounded-2xl bg-[#04060B] border border-white/[0.08] space-y-4 font-mono text-[13px]">
            <div className="text-[11px] text-blue-400 font-bold uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              Statutory Claim Matrix ({selectedCurrency})
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Principal Claim:</span>
                <span suppressHydrationWarning className="text-white font-bold">{currencySymbol}{formatAmount(simClaimAmount)}</span>
              </div>
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Statutory Interest ({(interestRate * 100).toFixed(1)}% p.a.):</span>
                <span suppressHydrationWarning className="text-emerald-400 font-bold">+{currencySymbol}{formatAmount(interestAmount)}</span>
              </div>
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Est. Court Filing Fee:</span>
                <span suppressHydrationWarning className="text-amber-400 font-bold">{currencySymbol}{formatAmount(courtFeeEst)}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between text-[14px]">
                <span className="text-white font-bold">Total Recovery Demand:</span>
                <span suppressHydrationWarning className="text-cyan-400 font-bold">{currencySymbol}{formatAmount(totalRecovery)}</span>
              </div>
            </div>

            <Link
              href={`/dashboard/chat?init=${encodeURIComponent(`I want to recover ${currencySymbol}${simClaimAmount} in ${selectedCurrency} with applicable statutory interest.`)}`}
              className="btn-glow-blue w-full text-center justify-center text-[13px] font-semibold h-10 mt-2"
            >
              Draft Formal Notice →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. STRIPE-STYLE INTERACTIVE DEVELOPER API PLAYGROUND ──── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono">
              GLOBAL DEVELOPER PLATFORM · PUBLIC API v1
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-3">
              Integrate Global Legal Intelligence via API
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0] mt-1">
              Trigger autonomous statutory mapping, limitation countdowns, and court notices directly into your billing, CRM, or enterprise ERP.
            </p>
          </div>

          <Link href="/dashboard/team" className="btn-ghost text-[13.5px] font-semibold h-10 px-4 rounded-xl inline-flex items-center gap-1.5 shrink-0">
            <Terminal size={14} className="text-blue-400" />
            <span>Generate Global API Key</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Code Playground Box */}
        <div className="glass-panel-luxury overflow-hidden border border-white/[0.12] rounded-3xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#05070C]">
            <div className="flex items-center gap-2">
              {(['curl', 'typescript', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveCodeTab(tab);
                    setApiResponseText(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-mono font-semibold transition-all ${
                    activeCodeTab === tab
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-[#8D9CB0] hover:text-white'
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'typescript' ? 'Node.js (TypeScript)' : 'Python'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runApiSimulation}
                disabled={apiSimulating}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[12px] font-semibold font-mono flex items-center gap-1.5 transition-all"
              >
                {apiSimulating ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                <span>Test Global Endpoint</span>
              </button>

              <button
                onClick={copyCode}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8D9CB0] hover:text-white transition-all"
                title="Copy snippet"
              >
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] bg-[#020408]">
            {/* Left: Code Snippet */}
            <div className="p-5 font-mono text-[13px] text-[#CBD5E1] overflow-x-auto leading-relaxed">
              <pre>{CODE_EXAMPLES[activeCodeTab]}</pre>
            </div>

            {/* Right: Live Simulated Response */}
            <div className="p-5 font-mono text-[12px] overflow-x-auto bg-[#04060B]">
              <div className="text-[11px] text-[#55667E] uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>Response Stream (JSON)</span>
                <span className="text-emerald-400">HTTP 201 OK</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed font-mono">
                {apiResponseText || `// Click "Test Global Endpoint" above to simulate live multi-jurisdiction analysis response...`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. VERIFIED GLOBAL COUNSEL & ARBITRATORS ───────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full font-mono">
              WORLDWIDE BAR & SOLICITOR NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-3">
              Matched Global Counsel & Arbitrators
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0] mt-1">
              Seamlessly transition from AI intake to encrypted video consultations with verified counsel across US, UK, EU, and Asian jurisdictions.
            </p>
          </div>

          <Link href="/advocates" className="btn-ghost text-[13.5px] font-semibold h-10 px-4 rounded-xl inline-flex items-center gap-1.5">
            <span>Browse All 4,200+ Global Counsel</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GLOBAL_ADVOCATES.map((adv, idx) => (
            <div key={idx} className="glass-panel-luxury p-6 rounded-2xl flex flex-col justify-between gap-6 border border-white/[0.08]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-[18px] shadow-md">
                    {adv.flag}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                    <Star size={11} fill="currentColor" /> {adv.rating}
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] font-bold text-white">{adv.name}</h4>
                  <p className="text-[12px] text-blue-400 font-semibold">{adv.title}</p>
                  <p className="text-[11px] text-[#8D9CB0] font-mono">{adv.credentials}</p>
                </div>

                <div className="text-[12.5px] text-[#CBD5E1] space-y-1 pt-1 border-t border-white/[0.05]">
                  <div className="truncate">🏛️ {adv.jurisdiction}</div>
                  <div className="truncate">⚖️ {adv.focus}</div>
                  <div className="text-emerald-400 font-mono text-[11px]">✓ {adv.verifiedCases}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7B94] font-mono block uppercase">Strategy Session</span>
                  <span className="text-[15px] font-bold text-white font-mono">{adv.fee}</span>
                </div>
                <Link
                  href={`/dashboard/chat?init=${encodeURIComponent(`Consultation with ${adv.name} (${adv.jurisdiction})`)}`}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[12px] transition-all shadow-md shadow-blue-600/20"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. GLOBAL LEGAL CLARITY & COMPLIANCE FAQ ────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono">
            CROSS-BORDER LEGAL COMPLIANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-[14.5px] text-[#8D9CB0]">
            Everything you need to know about multi-jurisdiction intelligence, cross-border dispute enforcement, and privilege.
          </p>
        </div>

        <div className="space-y-3">
          {GLOBAL_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#05070C]/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[15px] text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-[14px] text-[#8D9CB0] leading-relaxed border-t border-white/[0.04] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 9. EXECUTIVE GLOBAL CTA BANNER ─────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative z-10">
        <div className="relative rounded-3xl p-10 sm:p-16 border border-white/[0.14] bg-gradient-to-b from-[#080D1A] to-[#000000] overflow-hidden shadow-2xl space-y-6">
          <div className="absolute inset-0 hud-mesh pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono relative z-10 inline-block">
            WORLDWIDE ENFORCEMENT & ADMISSIBILITY
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10 max-w-3xl mx-auto leading-tight">
            Enforce your legal rights across borders with autonomous precision.
          </h2>
          <p className="text-[15.5px] text-[#8D9CB0] max-w-xl mx-auto relative z-10 font-normal">
            Join cross-border enterprises, remote teams, and global legal counsels using LexNova to resolve disputes in the US, UK, EU, Asia, and worldwide.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap relative z-10">
            <Link
              href="/dashboard/chat"
              className="btn-primary h-12 px-8 rounded-xl text-[14.5px] font-bold shadow-xl"
            >
              Start Free Global Case Assessment →
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost h-12 px-8 rounded-xl text-[14.5px] font-semibold"
            >
              View Global Enterprise Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
