'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronDown, DollarSign, UserCheck, X, PhoneCall
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
    maxDays: 1460,
    statute: 'UCC §2-725 / NY CPLR 213',
    riskWindow: '4-Year Federal / State UCC Period',
  },
  {
    jurisdiction: 'United Kingdom (England & Wales)',
    flag: '🇬🇧',
    cause: 'Simple Contract & Commercial Debt',
    maxDays: 2190,
    statute: 'Limitation Act 1980 Section 5',
    riskWindow: '6-Year High Court Statutory Clock',
  },
  {
    jurisdiction: 'European Union (Germany / France)',
    flag: '🇪🇺',
    cause: 'Commercial Claims & B2B Obligations',
    maxDays: 1095,
    statute: 'Bürgerliches Gesetzbuch (BGB) §195',
    riskWindow: '3-Year End-of-Year Prescription',
  },
  {
    jurisdiction: 'Singapore (SIAC & Common Law)',
    flag: '🇸🇬',
    cause: 'Cross-Border Contract & Tort',
    maxDays: 2190,
    statute: 'Limitation Act (Cap. 163) Section 6',
    riskWindow: '6-Year Commonwealth Limit',
  },
  {
    jurisdiction: 'India & South Asia',
    flag: '🇮🇳',
    cause: 'Recovery of Money & Breach of Contract',
    maxDays: 1095,
    statute: 'Limitation Act 1963 Article 55/113',
    riskWindow: '3-Year Strict Extinction Clock',
  },
];

export interface GlobalAdvocateItem {
  id: string;
  name: string;
  title: string;
  countryCode: 'US' | 'GB' | 'EU' | 'SG' | 'IN';
  countryName: string;
  jurisdiction: string;
  credentials: string;
  focus: string;
  tags: string[];
  rating: string;
  reviewsCount: number;
  fee: string;
  feeNumeric: number;
  currency: string;
  flag: string;
  verifiedCases: string;
  photo: string;
  availability: string;
  responseTime: string;
  nextSlot: string;
  barLicenseId: string;
  languages: string[];
}

const GLOBAL_ADVOCATES: GlobalAdvocateItem[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins, Esq.',
    title: 'Partner, Commercial & Tech Litigation',
    countryCode: 'US',
    countryName: 'United States',
    jurisdiction: 'New York & Delaware Bar (US)',
    credentials: 'NY Bar #4891024 · S.D.N.Y. & DE Chancery',
    focus: 'Cross-Border SaaS, UCC §2-708 Contracts, Delaware Chancery',
    tags: ['Delaware Chancery', 'UCC §2-708', 'Enterprise SaaS', 'Series B-D Disputes'],
    rating: '5.0',
    reviewsCount: 164,
    fee: '$350/hr',
    feeNumeric: 350,
    currency: 'USD',
    flag: '🇺🇸',
    verifiedCases: '280+ Cross-Border Resolves',
    photo: '/images/advocate-sarah.jpg',
    availability: 'Available Today',
    responseTime: '< 15 mins',
    nextSlot: 'Today, 4:30 PM EST',
    barLicenseId: 'NY-4891024-SDNY',
    languages: ['English'],
  },
  {
    id: 'david-alistair',
    name: 'David Alistair-Smith, KC',
    title: 'King’s Counsel & Solicitor Advocate',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    jurisdiction: 'England & Wales (High Court of Justice)',
    credentials: 'SRA ID #598210 · Rolls Building Admitted',
    focus: 'UK CPR Pre-Action Claims, High Court Commercial Debt Recovery',
    tags: ['CPR Debt Claims', 'Rolls Building', 'High Court Enforcement', 'Statutory Interest'],
    rating: '4.9',
    reviewsCount: 198,
    fee: '£295/hr',
    feeNumeric: 295,
    currency: 'GBP',
    flag: '🇬🇧',
    verifiedCases: '340+ Commercial Disputes',
    photo: '/images/advocate-david.jpg',
    availability: 'Available Today',
    responseTime: '< 20 mins',
    nextSlot: 'Today, 5:00 PM GMT',
    barLicenseId: 'SRA-598210-KC',
    languages: ['English', 'French'],
  },
  {
    id: 'helene-moreau',
    name: 'Dr. Hélène Moreau',
    title: 'Avocat au Barreau & European Regulatory Counsel',
    countryCode: 'EU',
    countryName: 'European Union',
    jurisdiction: 'Paris & Frankfurt Bar (EU)',
    credentials: 'Barreau de Paris #B1948 · DAV Frankfurt Member',
    focus: 'EU Late Payment Directive 2011/7/EU, GDPR Art. 82, Cross-Border EOP',
    tags: ['EU Directive 2011/7', 'GDPR Art. 82', 'European Payment Orders', 'BGB §286'],
    rating: '4.9',
    reviewsCount: 142,
    fee: '€275/hr',
    feeNumeric: 275,
    currency: 'EUR',
    flag: '🇪🇺',
    verifiedCases: '190+ EU Enforcement Matters',
    photo: '/images/advocate-helene.jpg',
    availability: 'Available Today',
    responseTime: '< 30 mins',
    nextSlot: 'Today, 6:15 PM CET',
    barLicenseId: 'PARIS-B1948-EU',
    languages: ['French', 'German', 'English'],
  },
  {
    id: 'kenneth-tan',
    name: 'Kenneth Tan, FCIArb',
    title: 'Fellow, Chartered Institute of Arbitrators',
    countryCode: 'SG',
    countryName: 'Singapore & APAC',
    jurisdiction: 'Singapore (SIAC) & Hong Kong (HKIAC)',
    credentials: 'Law Society of Singapore #2012/S89 · SIAC Panel',
    focus: 'International Arbitration, New York Convention 1958 Enforcement',
    tags: ['SIAC Expedited Rules', 'NY Convention 1958', 'Maxwell Chambers', 'Cross-Border Port'],
    rating: '4.9',
    reviewsCount: 176,
    fee: 'S$380/hr',
    feeNumeric: 380,
    currency: 'SGD',
    flag: '🇸🇬',
    verifiedCases: '220+ Cross-Border Awards',
    photo: '/images/advocate-kenneth.jpg',
    availability: 'Available Today',
    responseTime: '< 25 mins',
    nextSlot: 'Tomorrow, 9:30 AM SGT',
    barLicenseId: 'SG-2012/S89-FCIARB',
    languages: ['English', 'Mandarin'],
  },
  {
    id: 'priya-mehta',
    name: 'Advocate Priya Mehta',
    title: 'Senior Commercial Litigator & Dispute Counsel',
    countryCode: 'IN',
    countryName: 'India',
    jurisdiction: 'High Court of Delhi & Supreme Court of India',
    credentials: 'Bar Council of Delhi #D/1942/2012 · NLSIU Alumni',
    focus: 'Commercial Courts Act 2015, Contractual Breach, Section 9 Injunctions',
    tags: ['Commercial Courts Act', 'Section 9 Arbitration', 'High Court of Delhi', 'Vendor Recovery'],
    rating: '5.0',
    reviewsCount: 210,
    fee: '₹14,500/hr',
    feeNumeric: 175,
    currency: 'INR',
    flag: '🇮🇳',
    verifiedCases: '310+ Resolved Claims',
    photo: '/advocate-priya.jpg',
    availability: 'Available Today',
    responseTime: '< 10 mins',
    nextSlot: 'Today, 7:00 PM IST',
    barLicenseId: 'BCD-1942-2012',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'rajesh-sharma',
    name: 'Advocate Rajesh Sharma',
    title: 'Corporate Dispute Counsel & Sec 138 Specialist',
    countryCode: 'IN',
    countryName: 'India',
    jurisdiction: 'High Court of Bombay & Commercial Courts',
    credentials: 'Bar Council of Maharashtra & Goa #MAH/3081/2010',
    focus: 'Cheque Bouncing (Sec 138 NI Act), Summary Suits (Order 37 CPC), BNS §318',
    tags: ['Sec 138 NI Act', 'Order 37 CPC', 'Bombay High Court', 'Criminal Cheating BNS'],
    rating: '4.9',
    reviewsCount: 254,
    fee: '₹12,000/hr',
    feeNumeric: 145,
    currency: 'INR',
    flag: '🇮🇳',
    verifiedCases: '480+ Recovery Matters',
    photo: '/advocate-rajesh.jpg',
    availability: 'Available Today',
    responseTime: '< 15 mins',
    nextSlot: 'Today, 8:30 PM IST',
    barLicenseId: 'BCM-3081-2010',
    languages: ['English', 'Hindi', 'Marathi'],
  },
];

interface ApiPreset {
  id: 'us' | 'uk' | 'eu' | 'sg';
  label: string;
  flag: string;
  badge: string;
  jurisdiction: string;
  claimAmount: string;
  endpoint: string;
  reqPayload: Record<string, any>;
  resPayload: Record<string, any>;
  codeSnippets: {
    curl: string;
    typescript: string;
    python: string;
  };
}

const API_PRESETS: Record<'us' | 'uk' | 'eu' | 'sg', ApiPreset> = {
  us: {
    id: 'us',
    label: 'US Delaware SaaS Default ($140k)',
    flag: '🇺🇸',
    badge: 'UCC & DELAWARE CHANCERY',
    jurisdiction: 'US_DELAWARE',
    claimAmount: '$140,000 USD',
    endpoint: 'POST /v1/cases/intake',
    reqPayload: {
      jurisdiction: 'US_DELAWARE',
      claim_currency: 'USD',
      claim_amount: 140000,
      dispute_type: 'CROSS_BORDER_CONTRACT_BREACH',
      description: 'Counterparty in Munich defaulted on Master Services Agreement §8.2 under Delaware choice-of-law clause.',
      auto_generate_pre_action_notice: true
    },
    resPayload: {
      status: 'success',
      code: 201,
      case_id: 'cas_us_del_88192a',
      timestamp: '2026-09-07T11:34:21Z',
      governing_statutes: [
        'Uniform Commercial Code (UCC) § 2-708',
        'Delaware General Corporation Law § 382',
        'Delaware Court of Chancery Rule 12'
      ],
      limitation_analysis: {
        total_statutory_days: 1460,
        days_elapsed: 420,
        days_remaining: 1040,
        risk_level: 'LOW',
        statute_of_limitations_deadline: '2028-09-15'
      },
      recommended_forum: 'Delaware Commercial Court / AAA Expedited Rules',
      pre_action_protocol: {
        cure_period_days: 30,
        statutory_interest_rate: '18.0% p.a.',
        notice_generated: true,
        court_admissible_pdf: 'https://vault.lexnova.ai/notices/delaware_breach_demand_88192a.pdf'
      },
      escrow_guarantee: 'Active (Zero-Knowledge Audit #LN-SEC-491)'
    },
    codeSnippets: {
      curl: `curl -X POST https://api.lexnova.ai/v1/cases/intake \\
  -H "Authorization: Bearer ln_live_99a8b1c4e7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdiction": "US_DELAWARE",
    "claim_currency": "USD",
    "claim_amount": 140000,
    "dispute_type": "CROSS_BORDER_CONTRACT_BREACH",
    "description": "Counterparty in Munich defaulted on MSA §8.2 under Delaware choice-of-law clause.",
    "auto_generate_pre_action_notice": true
  }'`,
      typescript: `import { LexNova } from '@lexnova/sdk';

const lexnova = new LexNova({ apiKey: process.env.LEXNOVA_API_KEY });

const result = await lexnova.cases.intake({
  jurisdiction: 'US_DELAWARE',
  claim: { amount: 140000, currency: 'USD' },
  disputeType: 'CROSS_BORDER_CONTRACT_BREACH',
  choiceOfLaw: 'DELAWARE_UCC',
  generateCourtNotice: true
});

console.log(result.limitationAnalysis.daysRemaining); // 1,040 days
console.log(result.preActionProtocol.courtAdmissiblePdf);`,
      python: `from lexnova import LexNovaClient

client = LexNovaClient(api_key="ln_live_99a8b1c4e7")

case = client.cases.intake(
    jurisdiction="US_DELAWARE",
    claim_amount=140000,
    claim_currency="USD",
    dispute_type="CROSS_BORDER_CONTRACT_BREACH",
    auto_generate_pre_action_notice=True
)

print(f"Limitation Days Left: {case.limitation_analysis.days_remaining}")
print(f"Notice Document URL: {case.pre_action_protocol.court_admissible_pdf}")`
    }
  },
  uk: {
    id: 'uk',
    label: 'UK Commercial Debt (£65k)',
    flag: '🇬🇧',
    badge: 'UK CPR PRE-ACTION PROTOCOL',
    jurisdiction: 'UK_ENGLAND_WALES',
    claimAmount: '£65,000 GBP',
    endpoint: 'POST /v1/cases/intake',
    reqPayload: {
      jurisdiction: 'UK_ENGLAND_WALES',
      claim_currency: 'GBP',
      claim_amount: 65000,
      dispute_type: 'COMMERCIAL_DEBT_RECOVERY',
      description: 'Unpaid milestone invoices under UK Late Payment of Commercial Debts Act 1998.',
      auto_generate_pre_action_notice: true
    },
    resPayload: {
      status: 'success',
      code: 201,
      case_id: 'cas_uk_cpr_55021f',
      timestamp: '2026-09-07T11:34:21Z',
      governing_statutes: [
        'Late Payment of Commercial Debts (Interest) Act 1998',
        'Limitation Act 1980 Section 5',
        'CPR Practice Direction - Pre-Action Protocol for Debt Claims'
      ],
      limitation_analysis: {
        total_statutory_days: 2190,
        days_elapsed: 370,
        days_remaining: 1820,
        risk_level: 'LOW',
        statute_of_limitations_deadline: '2030-08-20'
      },
      recommended_forum: 'Rolls Building (Commercial Court, King’s Bench Division)',
      pre_action_protocol: {
        cure_period_days: 30,
        statutory_interest_rate: '8.0% + Bank of England Base Rate',
        notice_generated: true,
        court_admissible_pdf: 'https://vault.lexnova.ai/notices/uk_cpr_letter_of_claim_55021f.pdf'
      },
      escrow_guarantee: 'Active (SRA Regulatory Safeguards Assured)'
    },
    codeSnippets: {
      curl: `curl -X POST https://api.lexnova.ai/v1/cases/intake \\
  -H "Authorization: Bearer ln_live_99a8b1c4e7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdiction": "UK_ENGLAND_WALES",
    "claim_currency": "GBP",
    "claim_amount": 65000,
    "dispute_type": "COMMERCIAL_DEBT_RECOVERY",
    "description": "Unpaid milestone invoices under UK Late Payment of Commercial Debts Act 1998.",
    "auto_generate_pre_action_notice": true
  }'`,
      typescript: `import { LexNova } from '@lexnova/sdk';

const lexnova = new LexNova({ apiKey: process.env.LEXNOVA_API_KEY });

const result = await lexnova.cases.intake({
  jurisdiction: 'UK_ENGLAND_WALES',
  claim: { amount: 65000, currency: 'GBP' },
  disputeType: 'COMMERCIAL_DEBT_RECOVERY',
  applyStatutoryInterest: true
});

console.log(result.preActionProtocol.courtAdmissiblePdf);`,
      python: `from lexnova import LexNovaClient

client = LexNovaClient(api_key="ln_live_99a8b1c4e7")

case = client.cases.intake(
    jurisdiction="UK_ENGLAND_WALES",
    claim_amount=65000,
    claim_currency="GBP",
    apply_statutory_interest=True
)

print(f"Limitation Days Left: {case.limitation_analysis.days_remaining}")`
    }
  },
  eu: {
    id: 'eu',
    label: 'EU GDPR / Mahnung (€95k)',
    flag: '🇪🇺',
    badge: 'EU DIRECTIVE & GDPR ART. 82',
    jurisdiction: 'EU_GERMANY_FRANCE',
    claimAmount: '€95,000 EUR',
    endpoint: 'POST /v1/cases/intake',
    reqPayload: {
      jurisdiction: 'EU_GERMANY_FRANCE',
      claim_currency: 'EUR',
      claim_amount: 95000,
      dispute_type: 'EU_PAYMENT_DIRECTIVE_AND_DATA_BREACH',
      description: 'Counterparty defaulted under EU Late Payment Directive 2011/7/EU and unauthorized scraping.',
      auto_generate_pre_action_notice: true
    },
    resPayload: {
      status: 'success',
      code: 201,
      case_id: 'cas_eu_mhn_33812d',
      timestamp: '2026-09-07T11:34:21Z',
      governing_statutes: [
        'EU Directive 2011/7/EU on Combating Late Payment in Commercial Transactions',
        'GDPR Article 82 (Right to Compensation)',
        'Bürgerliches Gesetzbuch (BGB) § 286 Verzug'
      ],
      limitation_analysis: {
        total_statutory_days: 1095,
        days_elapsed: 315,
        days_remaining: 780,
        risk_level: 'MEDIUM',
        statute_of_limitations_deadline: '2027-12-31'
      },
      recommended_forum: 'Frankfurt Regional Court (Landgericht) / European Order for Payment (EOP)',
      pre_action_protocol: {
        cure_period_days: 14,
        statutory_interest_rate: '9.0% above ECB Base Rate',
        notice_generated: true,
        court_admissible_pdf: 'https://vault.lexnova.ai/notices/eu_mahnschreiben_33812d.pdf'
      },
      escrow_guarantee: 'Active (GDPR Article 32 Compliant)'
    },
    codeSnippets: {
      curl: `curl -X POST https://api.lexnova.ai/v1/cases/intake \\
  -H "Authorization: Bearer ln_live_99a8b1c4e7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdiction": "EU_GERMANY_FRANCE",
    "claim_currency": "EUR",
    "claim_amount": 95000,
    "dispute_type": "EU_PAYMENT_DIRECTIVE_AND_DATA_BREACH",
    "auto_generate_pre_action_notice": true
  }'`,
      typescript: `import { LexNova } from '@lexnova/sdk';

const lexnova = new LexNova({ apiKey: process.env.LEXNOVA_API_KEY });

const result = await lexnova.cases.intake({
  jurisdiction: 'EU_GERMANY_FRANCE',
  claim: { amount: 95000, currency: 'EUR' },
  disputeType: 'EU_PAYMENT_DIRECTIVE_AND_DATA_BREACH'
});`,
      python: `from lexnova import LexNovaClient

client = LexNovaClient(api_key="ln_live_99a8b1c4e7")

case = client.cases.intake(
    jurisdiction="EU_GERMANY_FRANCE",
    claim_amount=95000,
    claim_currency="EUR"
)`
    }
  },
  sg: {
    id: 'sg',
    label: 'Singapore SIAC Arbitration ($350k)',
    flag: '🇸🇬',
    badge: '1958 NEW YORK CONVENTION & SIAC',
    jurisdiction: 'SG_SIAC_APAC',
    claimAmount: '$350,000 USD',
    endpoint: 'POST /v1/cases/intake',
    reqPayload: {
      jurisdiction: 'SG_SIAC_APAC',
      claim_currency: 'USD',
      claim_amount: 350000,
      dispute_type: 'INTERNATIONAL_COMMERCIAL_ARBITRATION',
      description: 'Breach of APAC semiconductor consignment contract governed by SIAC arbitration rules.',
      auto_generate_pre_action_notice: true
    },
    resPayload: {
      status: 'success',
      code: 201,
      case_id: 'cas_sg_siac_10928k',
      timestamp: '2026-09-07T11:34:21Z',
      governing_statutes: [
        'Singapore International Arbitration Act (Cap. 143A)',
        '1958 New York Convention on Recognition of Arbitral Awards (172 contracting states)',
        'SIAC Rules 2024 Expedited Procedure'
      ],
      limitation_analysis: {
        total_statutory_days: 2190,
        days_elapsed: 740,
        days_remaining: 1450,
        risk_level: 'LOW',
        statute_of_limitations_deadline: '2029-07-14'
      },
      recommended_forum: 'Maxwell Chambers, Singapore / SIAC Emergency Arbitrator',
      pre_action_protocol: {
        cure_period_days: 21,
        statutory_interest_rate: '5.33% p.a. Commercial Rate',
        notice_generated: true,
        court_admissible_pdf: 'https://vault.lexnova.ai/notices/siac_arbitration_demand_10928k.pdf'
      },
      escrow_guarantee: 'Active (Maxwell Chambers SIAC Protocol)'
    },
    codeSnippets: {
      curl: `curl -X POST https://api.lexnova.ai/v1/cases/intake \\
  -H "Authorization: Bearer ln_live_99a8b1c4e7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jurisdiction": "SG_SIAC_APAC",
    "claim_currency": "USD",
    "claim_amount": 350000,
    "dispute_type": "INTERNATIONAL_COMMERCIAL_ARBITRATION",
    "auto_generate_pre_action_notice": true
  }'`,
      typescript: `import { LexNova } from '@lexnova/sdk';

const lexnova = new LexNova({ apiKey: process.env.LEXNOVA_API_KEY });

const result = await lexnova.cases.intake({
  jurisdiction: 'SG_SIAC_APAC',
  claim: { amount: 350000, currency: 'USD' },
  disputeType: 'INTERNATIONAL_COMMERCIAL_ARBITRATION'
});`,
      python: `from lexnova import LexNovaClient

client = LexNovaClient(api_key="ln_live_99a8b1c4e7")

case = client.cases.intake(
    jurisdiction="SG_SIAC_APAC",
    claim_amount=350000,
    claim_currency="USD"
)`
    }
  }
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
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // ── Advocates Directory & Booking State ──
  const [selectedAdvocateCountry, setSelectedAdvocateCountry] = useState<'ALL' | 'US' | 'GB' | 'EU' | 'SG' | 'IN'>('ALL');
  const [bookingAdvocate, setBookingAdvocate] = useState<GlobalAdvocateItem | null>(null);
  const [bookingTier, setBookingTier] = useState<'triage' | 'consultation' | 'drafting'>('consultation');
  const [bookingSlot, setBookingSlot] = useState<string>('Today, 4:30 PM');
  const [bookingCaseDesc, setBookingCaseDesc] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // ── Developer API Interactive State ──
  const [apiPresetId, setApiPresetId] = useState<'us' | 'uk' | 'eu' | 'sg'>('us');
  const [activeApiView, setActiveApiView] = useState<'json' | 'analysis' | 'notice'>('json');
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);
  const [apiExecutionTime, setApiExecutionTime] = useState<number>(38);
  const [copiedApiResponse, setCopiedApiResponse] = useState<boolean>(false);

  // ── Unique Enterprise Showcase State (from user reference designs) ──
  const [isScanningClause, setIsScanningClause] = useState<boolean>(false);
  const [clauseScanCompleted, setClauseScanCompleted] = useState<boolean>(false);
  const [activeDispatchForum, setActiveDispatchForum] = useState<'delaware' | 'london' | 'siac' | 'mumbai'>('delaware');

  const handleScanClause = () => {
    setIsScanningClause(true);
    setClauseScanCompleted(false);
    setTimeout(() => {
      setIsScanningClause(false);
      setClauseScanCompleted(true);
    }, 1200);
  };

  const currentApiPreset = API_PRESETS[apiPresetId];

  const handleRunApi = () => {
    setIsExecutingApi(true);
    const simulatedLatency = Math.floor(Math.random() * 20) + 26; // 26-46ms
    setTimeout(() => {
      setApiExecutionTime(simulatedLatency);
      setIsExecutingApi(false);
    }, 450);
  };

  const copyApiResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(currentApiPreset.resPayload, null, 2));
    setCopiedApiResponse(true);
    setTimeout(() => setCopiedApiResponse(false), 2000);
  };

  const filteredAdvocates = selectedAdvocateCountry === 'ALL'
    ? GLOBAL_ADVOCATES
    : GLOBAL_ADVOCATES.filter((a) => a.countryCode === selectedAdvocateCountry);

  const activeScenario = GLOBAL_SCENARIOS.find((s) => s.id === activeScenarioId) || GLOBAL_SCENARIOS[0];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroInput.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(heroInput.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentApiPreset.codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col overflow-x-hidden selection:bg-indigo-500/20 bg-[#F8FAFC]">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="pt-28 sm:pt-36 pb-14 px-6 sm:px-10 lg:px-14 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full" style={{background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.12) 0%, transparent 70%)', filter: 'blur(40px)'}} />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full" style={{background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.08) 0%, transparent 70%)', filter: 'blur(40px)'}} />
          <div className="absolute inset-0 hud-grid opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          {/* Top 2-Column Split Copy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Hero Headline */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-mono font-medium" style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8'}}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.6)'}} />
                LexNova 2.5 · Autonomous Legal Operating System
              </div>
              <h1 className="text-[44px] sm:text-[60px] md:text-[70px] lg:text-[76px] font-bold tracking-tight leading-[1.06] text-slate-900">
                Autonomous legal intelligence for{' '}
                <span className="text-gradient">disputes</span>,{' '}
                <span className="text-gradient">contracts</span> &{' '}
                <span className="text-gradient">counsel</span>.
              </h1>
            </div>

            {/* Right Column: Description & CTAs */}
            <div className="lg:col-span-5 pt-3 sm:pt-6 space-y-6">
              <p className="font-serif text-2xl sm:text-3xl lg:text-[28px] font-normal leading-[1.45]" style={{color: '#475569'}}>
                LexNova deciphers statutory frameworks across 50+ jurisdictions, computes exact limitation clocks, drafts court-admissible notices, and connects you directly to verified Bar advocates worldwide.
              </p>
              
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href="/dashboard/chat"
                  className="px-6 py-3 rounded-full text-white text-[14px] font-semibold shadow-lg transition-all flex items-center gap-2"
                  style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)'}}
                >
                  <span>Launch Free Intake</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-5 py-3 rounded-full text-[14px] font-medium transition-colors"
                  style={{border: '1px solid rgba(99,102,241,0.2)', color: '#475569', background: 'rgba(99,102,241,0.05)'}}
                >
                  <span>Platform Architecture</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Hero Visual Banner */}
          <div className="mt-12 rounded-[28px] sm:rounded-[36px] overflow-hidden relative shadow-2xl h-[240px] sm:h-[340px] lg:h-[390px] group" style={{border: '1px solid rgba(99,102,241,0.2)'}}>
            <Image
              src="/images/anthropic_horizon.jpg"
              alt="Autonomous Global Legal Horizon"
              fill
              priority
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8" style={{background: 'linear-gradient(to top, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0.3) 50%, transparent 100%)'}}>
              <div className="flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2.5 font-mono text-[12px] sm:text-[13px] px-4 py-2 rounded-full" style={{background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 20px rgba(99,102,241,0.1)'}}>
                  <span className="status-live" />
                  <span className="font-semibold text-white">52 Jurisdictions Synchronized</span>
                  <span className="hidden sm:inline" style={{color: 'rgba(168,174,207,0.7)'}}>· US · UK · EU · SG · IN</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11.5px] px-4 py-2 rounded-full" style={{background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.2)', color: 'rgba(168,174,207,0.9)'}}>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} style={{color: '#10B981'}} />
                    <span>Zero-Knowledge AES-256</span>
                  </span>
                  <span>·</span>
                  <span>38ms Mean Intake Latency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Statutory Console */}
          <div className="mt-8 rounded-[28px] sm:rounded-[36px] overflow-hidden relative" style={{background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
            
            {/* Console Control Bar */}
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-[12px] font-mono" style={{borderBottom: '1px solid #E2E8F0', background: 'rgba(99,102,241,0.04)'}}>
              <div className="flex items-center gap-2 font-semibold" style={{color: '#818CF8'}}>
                <span className="status-live" />
                <span>LEXNOVA LIVE STATUTORY CONSOLE</span>
              </div>
              <div className="flex items-center gap-4" style={{color: '#94A3B8'}}>
                <span>52 JURISDICTIONS SYNCHRONIZED</span>
                <span>·</span>
                <span>ZERO-KNOWLEDGE PRIVILEGE</span>
              </div>
            </div>

            {/* Interactive Showcase Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Intake Form */}
              <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl p-2.5 sm:p-3" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                <div className="flex items-center gap-3 w-full px-2">
                  <Sparkles size={18} style={{color: '#818CF8'}} className="shrink-0" />
                  <input
                    type="text"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    placeholder="Describe your dispute (e.g. Counterparty defaulted on $140k SaaS contract in Delaware)..."
                    className="w-full bg-transparent border-none text-[14.5px] focus:outline-none"
                    style={{color: '#0F172A', '::placeholder': {color: '#94A3B8'}} as any}
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 transition-all shrink-0 w-full sm:w-auto"
                  style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 12px rgba(99,102,241,0.35)'}}
                >
                  <span>Analyze Case</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Quick Scenario Triggers */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{color: '#94A3B8'}}>
                  Test Live Multi-Jurisdiction Engine:
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {GLOBAL_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setActiveScenarioId(sc.id);
                        setHeroInput(sc.title);
                      }}
                      className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeScenarioId === sc.id
                          ? 'text-white'
                          : 'hover:border-indigo-500/40'
                      }`}
                      style={activeScenarioId === sc.id ? {
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                        border: '1px solid rgba(99,102,241,0.4)'
                      } : {
                        background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#334155'
                      }}
                    >
                      <span>{sc.flag}</span>
                      <span>{sc.country}</span>
                      <span className="text-[11px] opacity-70 font-mono">({sc.claimAmountDisplay})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Docket Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Left: Metrics & Breach */}
                <div className="lg:col-span-6 rounded-2xl p-5 space-y-4" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                  <div className="flex items-center justify-between pb-3" style={{borderBottom: '1px solid #E2E8F0'}}>
                    <span className="text-[11px] font-mono font-bold uppercase" style={{color: '#94A3B8'}}>{activeScenario.badge}</span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md" style={{color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)'}}>
                      96% ENFORCEABLE
                    </span>
                  </div>

                  <div className="grid grid-cols-3 text-center py-1" style={{gap: '1px'}}>
                    <div>
                      <div className="text-[10px] font-mono uppercase" style={{color: '#94A3B8'}}>Claim</div>
                      <div className="text-[18px] font-bold font-mono text-slate-900">{activeScenario.claimAmountDisplay}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase" style={{color: '#94A3B8'}}>Limitation</div>
                      <div className="text-[18px] font-bold font-mono" style={{color: '#F59E0B'}}>{activeScenario.limitationDays} Days</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase" style={{color: '#94A3B8'}}>Jurisdiction</div>
                      <div className="text-[13px] font-bold text-slate-900 mt-1">{activeScenario.country}</div>
                    </div>
                  </div>

                  <div className="text-[12.5px] font-mono pt-1" style={{color: '#475569'}}>
                    <strong style={{color: '#0F172A'}}>Statute:</strong> {activeScenario.statute}
                  </div>
                </div>

                {/* Right: Formal Notice Excerpt */}
                <div className="lg:col-span-6 rounded-2xl p-5 space-y-3 flex flex-col justify-between" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                  <div>
                    <div className="flex items-center justify-between pb-2" style={{borderBottom: '1px solid #E2E8F0'}}>
                      <span className="text-[11px] font-mono font-bold uppercase" style={{color: '#94A3B8'}}>Court-Admissible Notice Format</span>
                      <span className="text-[11px] font-mono" style={{color: '#818CF8'}}>{activeScenario.noticeFormat.split(' ')[0]} Format</span>
                    </div>
                    <p className="font-mono text-[12px] leading-relaxed italic pt-2 line-clamp-3" style={{color: '#64748B'}}>
                      &ldquo;{activeScenario.noticeExcerpt}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[12px]" style={{borderTop: '1px solid #E2E8F0'}}>
                    <span className="font-mono" style={{color: '#64748B'}}>Verified Advocate Handoff Ready</span>
                    <Link
                      href={`/dashboard/chat?init=${encodeURIComponent(activeScenario.title)}`}
                      className="font-medium underline hover:no-underline flex items-center gap-1"
                      style={{color: '#818CF8'}}
                    >
                      Draft Full Docket &rarr;
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── KEY METRICS BAR ── */}
      <div style={{borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { val: '$840M+', label: 'Disputes Processed Worldwide' },
              { val: '4,200+', label: 'Verified Global Advocates' },
              { val: '50+', label: 'Autonomous Jurisdictions' },
              { val: '< 60s', label: 'Average Time to Enforceable Notice' },
            ].map((m, i) => (
              <div key={i} className="py-8 px-6 text-center" style={{borderRight: i < 3 ? '1px solid rgba(99,102,241,0.08)' : 'none'}}>
                <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-gradient">
                  {m.val}
                </div>
                <div className="text-[12px] font-medium mt-1 uppercase tracking-wide" style={{color: '#64748B'}}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE GLOBAL CASE INTELLIGENCE ENGINE ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
                Interactive Case Engine
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Autonomous cross-border statutory intelligence.
              </h2>
            </div>
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium hover:underline"
              style={{color: '#818CF8'}}
            >
              <span>Launch Live Intake Console</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{borderBottom: '1px solid #E2E8F0'}}>
            {GLOBAL_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                className={`px-4 py-2.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 whitespace-nowrap`}
                style={activeScenarioId === sc.id ? {
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: 'white',
                  border: '1px solid rgba(99,102,241,0.4)',
                  boxShadow: '0 2px 12px rgba(99,102,241,0.3)'
                } : {
                  background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#334155'
                }}
              >
                <span>{sc.flag}</span>
                <span>{sc.country}</span>
                <span className="text-[11px] opacity-70 font-mono">({sc.claimAmountDisplay})</span>
              </button>
            ))}
          </div>

          {/* Active Scenario Card */}
          <div className="rounded-3xl p-6 sm:p-8 space-y-6" style={{background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6" style={{borderBottom: '1px solid #E2E8F0'}}>
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider mb-2" style={{background: 'rgba(99,102,241,0.08)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)'}}>
                  {activeScenario.badge}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {activeScenario.title}
                </h3>
                <p className="text-[14px] mt-1 font-mono" style={{color: '#64748B'}}>
                  Forum: {activeScenario.forum}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Claim Principal</div>
                  <div className="text-2xl font-black font-mono text-slate-900">{activeScenario.claimAmountDisplay}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Limitation Clock</div>
                  <div className="text-2xl font-black font-mono text-amber-600">{activeScenario.limitationDays} Days</div>
                </div>
              </div>
            </div>

            {/* Excerpt Notice */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-mono font-bold uppercase text-slate-500">
                  Auto-Generated Court Notice Excerpt · {activeScenario.noticeFormat}
                </span>
                <button
                  onClick={() => copyNotice(activeScenario.noticeExcerpt)}
                  className="inline-flex items-center gap-1 hover:underline font-mono font-bold text-indigo-600"
                >
                  <Copy size={13} />
                  <span>{copiedNotice ? 'Copied' : 'Copy Notice'}</span>
                </button>
              </div>
              <div className="rounded-2xl p-5 text-[13.5px] font-mono leading-relaxed italic bg-slate-50 border border-slate-200 text-slate-700">
                &ldquo;{activeScenario.noticeExcerpt}&rdquo;
              </div>
            </div>

            {/* Citations & Precedents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-[11px] font-mono font-bold uppercase mb-1 text-indigo-800">Governing Statute</div>
                <div className="text-[13.5px] font-bold text-slate-900">{activeScenario.statute}</div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-[11px] font-mono font-bold uppercase mb-1 text-indigo-800">Binding Precedent</div>
                <div className="text-[13.5px] font-bold text-slate-900">{activeScenario.precedent}</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[12.5px]" style={{color: '#64748B'}}>
                <CheckCircle2 size={16} style={{color: '#10B981'}} />
                <span>Court-admissible in {activeScenario.country} jurisdictions</span>
              </div>
              <Link
                href={`/dashboard/chat?init=${encodeURIComponent(activeScenario.title)}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[13px] font-semibold shadow-lg transition-all"
                style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)'}}
              >
                <span>Draft Full Notice for this Case</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS: 3 STEPS ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14" style={{borderTop: '1px solid #E2E8F0', background: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <div className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
              Methodology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              From commercial dispute to resolution in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Case & Contract Ingestion',
                desc: 'Upload agreements or type the dispute in plain English. LexNova extracts governing clauses, choice of forum, and defaults in seconds.',
                badge: '< 30s Analysis',
                accent: '#6366F1',
              },
              {
                step: '02',
                title: 'Statutory Notice & Docketing',
                desc: 'Autonomous generation of jurisdiction-specific pre-action notices (RPAD, CPR, UCC, BGB) with strict statutory limitation clocks.',
                badge: 'Court-Admissible',
                accent: '#A855F7',
              },
              {
                step: '03',
                title: 'Verified Global Counsel Retainer',
                desc: 'Handoff to Bar-verified attorneys and solicitors across the US, UK, EU, and Asia. Escrow-protected retainers with fixed pricing.',
                badge: '1-Click Retainer',
                accent: '#10B981',
              },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 space-y-4 transition-all group cursor-default"
                style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[14px] font-bold" style={{color: '#94A3B8'}}>
                    STEP {s.step}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold" style={{background: `rgba(99,102,241,0.08)`, color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)'}}>
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{color: '#64748B'}}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── DUAL PLATFORM: CLIENTS & ADVOCATES ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14" style={{borderTop: '1px solid #E2E8F0'}}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
              Unified Ecosystem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Engineered for both claimants and counsel.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Showcase Card: Enterprise Contract & Dispute Workspace */}
            <div className="rounded-3xl overflow-hidden text-slate-900 flex flex-col justify-between transition-all relative group" style={{background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
              
              {/* Image & Header Overlay */}
              <div className="relative h-[220px] sm:h-[250px] w-full overflow-hidden" style={{background: '#FFFFFF'}}>
                <Image
                  src="/images/legal_operations_hub.jpg"
                  alt="Enterprise Contract & Dispute Workspace"
                  fill
                  className="object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(10,11,18,0.9) 0%, transparent 60%)'}} />
                
                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
                  <span className="px-3 py-1 rounded-full border text-white flex items-center gap-1.5 shadow-sm" style={{background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.3)'}}>
                    <span className="status-live" />
                    ITVF WORKSPACE · CLAUSE ENGINE
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-semibold shadow-sm" style={{background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)'}}>
                    STATUTORY ACTIVE
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block" style={{background: 'rgba(34,211,238,0.08)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)'}}>
                    AUTOMATED CLAUSE DISSECTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Enterprise Contract &amp; Dispute Workspace
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{color: '#475569'}}>
                    Autonomous clause extraction, breach detection, and statutory damages quantification displayed in a unified executive docket with real-time statutory calculation.
                  </p>

                  {/* High-Tech Terminal Scanner Viewport Inset */}
                  <div className="pt-2">
                    <div className="bg-[#12161F] border border-[#2B3242] rounded-2xl p-4 relative overflow-hidden text-[#C9D1D9]">
                      
                      {/* Laser beam animation while scanning */}
                      {isScanningClause && (
                        <div
                          className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20 transition-all duration-1000 ease-linear animate-pulse"
                          style={{
                            top: '45%',
                          }}
                        />
                      )}

                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] font-mono">
                        <span className="text-white/60">Sample Clause: Master Services Agreement §8.2</span>
                        <span className="text-cyan-400 font-semibold">Delaware UCC</span>
                      </div>

                      <p className="text-[12px] font-mono text-[#C9D1D9] leading-relaxed italic">
                        "8.2 Termination for Cause: In the event of non-remittance exceeding $140,000.00 within thirty (30) days, Defaulting Party shall be in material default under Delaware UCC §2-708 subject to immediate AAA expedited arbitration."
                      </p>

                      {/* Post-Scan Revealed Badges */}
                      {clauseScanCompleted && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[11px] font-mono animate-fadeIn">
                          <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            Breach Confirmed (§2-708)
                          </span>
                          <span className="bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-cyan-400" />
                            +18.0% Statutory Late Interest
                          </span>
                          <span className="bg-white/10 text-white/90 border border-white/20 px-2.5 py-1 rounded-md">
                            Delaware Chancery Court
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                  {/* Bottom Trigger & Metrics */}
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleScanClause}
                        disabled={isScanningClause}
                        className="px-4 py-2.5 rounded-xl text-white font-mono text-[12px] font-semibold transition-all flex items-center gap-2"
                        style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 10px rgba(99,102,241,0.3)'}}
                      >
                        {isScanningClause ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" style={{color: '#22D3EE'}} />
                            <span>Scanning Clause...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={12} className="fill-current" style={{color: '#22D3EE'}} />
                            <span>{clauseScanCompleted ? 'Re-Scan Clause ⚡' : 'Scan Clause for Breach ⚡'}</span>
                          </>
                        )}
                      </button>
                      <Link
                        href="/dashboard/chat"
                        className="text-[13px] font-medium hover:underline flex items-center gap-1"
                        style={{color: '#818CF8'}}
                      >
                        <span>Open Full Workspace</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[11.5px] font-mono" style={{borderTop: '1px solid #E2E8F0', color: '#64748B'}}>
                      <span>Clause Parsing: <strong style={{color: '#0F172A'}}>&lt; 30s</strong></span>
                      <span className="font-semibold flex items-center gap-1" style={{color: '#10B981'}}>
                        <span className="status-live" />
                        Admissible Breaches Identified
                      </span>
                    </div>
                  </div>

              </div>
            </div>

            {/* Right Showcase Card: Global Commercial Operations & Dispatch */}
            <div className="rounded-3xl overflow-hidden text-slate-900 flex flex-col justify-between transition-all relative group" style={{background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
              
              {/* Image & Header Overlay */}
              <div className="relative h-[220px] sm:h-[250px] w-full overflow-hidden" style={{background: '#FFFFFF'}}>
                <Image
                  src="/images/tesla_mission_control.jpg"
                  alt="Global Commercial Operations & Dispatch"
                  fill
                  className="object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(10,11,18,0.9) 0%, transparent 60%)'}} />
                
                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
                  <span className="px-3 py-1 rounded-full text-white flex items-center gap-1.5 shadow-sm" style={{background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(99,102,241,0.3)'}}>
                    <span className="status-live" />
                    COMMERCIAL DISPATCH: 52 FORUMS
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-semibold shadow-sm" style={{background: 'rgba(168,85,247,0.15)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.3)'}}>
                    TCC &amp; SIAC SYNCHRONIZED
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block" style={{background: 'rgba(168,85,247,0.08)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.2)'}}>
                    PRE-ACTION ENFORCEMENT &amp; FILINGS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Global Commercial Operations &amp; Dispatch
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{color: '#475569'}}>
                    Coordinates court-ready demand notices, certified postal and digital service, and direct handover to verified commercial litigators across international forums.
                  </p>

                  {/* Interactive Forum Dispatch Selector */}
                  <div className="pt-2 space-y-2">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {[
                        { id: 'delaware', label: '🇺🇸 Delaware ($140k)', court: 'Delaware Court of Chancery', counsel: 'Sarah Jenkins, Esq.' },
                        { id: 'london', label: '🇬🇧 London (£65k)', court: 'Rolls Building Commercial Court', counsel: 'David Alistair-Smith, KC' },
                        { id: 'siac', label: '🇸🇬 SIAC ($350k)', court: 'Maxwell Chambers Singapore', counsel: 'Kenneth Tan, FCIArb' },
                        { id: 'mumbai', label: '🇮🇳 Bombay (₹85L)', court: 'High Court of Bombay Commercial Div', counsel: 'Adv. Rajesh Sharma' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveDispatchForum(item.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all whitespace-nowrap`}
                          style={activeDispatchForum === item.id ? {
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            color: 'white',
                            border: '1px solid rgba(99,102,241,0.4)'
                          } : {
                            background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#334155'
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Active Dispatch Detail Box Inset Terminal */}
                    <div className="bg-[#12161F] border border-[#2B3242] rounded-2xl p-4 text-[12px] font-mono space-y-2 text-[#C9D1D9]">
                      <div className="flex justify-between items-center text-[11px] border-b border-white/10 pb-2">
                        <span className="text-white/60">Service Method:</span>
                        <span className="text-emerald-400 font-semibold">RPAD + Secure Digital Timestamp</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-white/60">Enforcement Forum:</span>
                        <span className="text-white font-medium">
                          {activeDispatchForum === 'delaware' && 'Delaware Court of Chancery (AAA Rules)'}
                          {activeDispatchForum === 'london' && 'Rolls Building, King’s Bench Commercial Court'}
                          {activeDispatchForum === 'siac' && 'Maxwell Chambers, SIAC Expedited Procedure'}
                          {activeDispatchForum === 'mumbai' && 'Commercial Division, High Court of Bombay'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-white/60">Assigned Counsel:</span>
                        <span className="text-purple-300 font-medium">
                          {activeDispatchForum === 'delaware' && 'Sarah Jenkins, Esq. (NY/DE Bar #4891024)'}
                          {activeDispatchForum === 'london' && 'David Alistair-Smith, KC (SRA #598210)'}
                          {activeDispatchForum === 'siac' && 'Kenneth Tan, FCIArb (SIAC Panel)'}
                          {activeDispatchForum === 'mumbai' && 'Adv. Rajesh Sharma (BCM/3081/2010)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger & Metrics */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/advocates"
                      className="px-4 py-2.5 rounded-xl bg-[#141413] hover:bg-black text-white font-mono text-[12px] font-medium transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Review 140+ Admitted Litigators</span>
                    </Link>
                    <Link
                      href="/dashboard/chat"
                      className="text-[13px] font-medium text-[#141413] hover:underline flex items-center gap-1"
                    >
                      <span>Dispatch Notice</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-[#E8E5DE] flex items-center justify-between text-[11.5px] font-mono text-[#87837B]">
                    <span>Enforcement Speed: <strong className="text-[#141413]">Instant</strong></span>
                    <span className="text-purple-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      Verified Counsel Handoff
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── JURISDICTIONS NETWORK ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14" style={{borderTop: '1px solid #E2E8F0', background: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
                Global Coverage
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Fifty active statutory jurisdictions.
              </h2>
            </div>
            <Link href="/dashboard/chat" className="text-[13px] font-medium hover:underline flex items-center gap-1" style={{color: '#818CF8'}}>
              <span>View All Frameworks</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { flag: '🇺🇸', name: 'United States', courts: 'Delaware Chancery · UCC §2-708' },
              { flag: '🇬🇧', name: 'United Kingdom', courts: 'High Court CPR · 1998 Late Payment' },
              { flag: '🇪🇺', name: 'European Union', courts: 'BGB §195 · GDPR Art. 82 EOP' },
              { flag: '🇸🇬', name: 'Singapore', courts: 'SIAC Arbitration · Maxwell Chambers' },
              { flag: '🇮🇳', name: 'India', courts: 'Sec 138 NI Act · BNS §318 Commercial' },
              { flag: '🇦🇺', name: 'Australia', courts: 'Federal Court of Australia · ACICA' },
              { flag: '🇨🇦', name: 'Canada', courts: 'Ontario Superior Court · BCSC' },
              { flag: '🇩🇪', name: 'Germany', courts: 'Landgericht Frankfurt · Mahnbescheid' },
              { flag: '🇫🇷', name: 'France', courts: 'Tribunal de Commerce de Paris' },
              { flag: '🌍', name: '+41 More', courts: 'UNCITRAL · New York Conv. 1958' },
            ].map((j, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl transition-all group cursor-default bg-[#F8FAFC] border border-slate-200/90 hover:border-indigo-300 hover:shadow-md hover:bg-white"
              >
                <div className="text-3xl mb-3">{j.flag}</div>
                <div className="text-[14.5px] font-extrabold text-slate-900">{j.name}</div>
                <div className="text-[11px] font-mono mt-1 leading-snug text-slate-500">{j.courts}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── VERIFIED ADVOCATES ROSTER ── */}
      <section className="py-24 px-6 sm:px-10 lg:px-14 relative bg-slate-50/80 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-mono font-bold uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Global Counsel</span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700">140+ Admitted Advocates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Licensed international counsel on standby.
              </h2>
              <p className="text-[14.5px] max-w-2xl leading-relaxed text-slate-600 font-medium">
                Retain accredited trial lawyers, King’s Counsel, and SIAC arbitration specialists. Review verified Bar registrations, real-time availability, and book immediate consultations protected by LexNova Escrow.
              </p>
            </div>
            <Link
              href="/advocates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-indigo-700 bg-white border border-slate-200/90 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-2xs shrink-0 hover:-translate-y-0.5"
            >
              <span>Explore All 140+ Advocates</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Jurisdiction Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-slate-200/80">
            {[
              { id: 'ALL', label: 'All Jurisdictions', count: GLOBAL_ADVOCATES.length },
              { id: 'US', label: '🇺🇸 United States', count: GLOBAL_ADVOCATES.filter(a => a.countryCode === 'US').length },
              { id: 'GB', label: '🇬🇧 United Kingdom', count: GLOBAL_ADVOCATES.filter(a => a.countryCode === 'GB').length },
              { id: 'EU', label: '🇪🇺 European Union', count: GLOBAL_ADVOCATES.filter(a => a.countryCode === 'EU').length },
              { id: 'SG', label: '🇸🇬 Singapore & APAC', count: GLOBAL_ADVOCATES.filter(a => a.countryCode === 'SG').length },
              { id: 'IN', label: '🇮🇳 India', count: GLOBAL_ADVOCATES.filter(a => a.countryCode === 'IN').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedAdvocateCountry(tab.id as any)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-bold transition-all flex items-center gap-2 ${
                  selectedAdvocateCountry === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    selectedAdvocateCountry === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Advocates Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvocates.map((adv) => (
              <div
                key={adv.id}
                className="bg-white rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 group"
              >
                <div className="space-y-4">
                  {/* Top: Avatar + Identity */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative border-2 border-indigo-100 bg-slate-50 shadow-inner">
                        <Image
                          src={adv.photo}
                          alt={adv.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[17px] font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {adv.name}
                        </h4>
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[12.5px] font-semibold text-slate-600 leading-tight line-clamp-1 mt-0.5">
                        {adv.title}
                      </p>
                      <p className="text-[11.5px] font-mono font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <span>{adv.flag}</span>
                        <span className="truncate">{adv.jurisdiction}</span>
                      </p>
                    </div>
                  </div>

                  {/* Credentials Pill */}
                  <div className="rounded-xl px-3 py-2 text-[11.5px] font-mono flex items-center justify-between bg-slate-50 border border-slate-200/80 text-slate-700">
                    <span className="truncate font-semibold">{adv.credentials}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 shrink-0 ml-2">VERIFIED</span>
                  </div>

                  {/* Summary Focus */}
                  <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-2">
                    {adv.focus}
                  </p>

                  {/* Practice Area Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {adv.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Timing & Rating Row */}
                  <div className="pt-3 flex items-center justify-between text-[11.5px] font-mono border-t border-slate-100">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      <span>{adv.rating}</span>
                      <span className="text-slate-400 font-normal">({adv.reviewsCount})</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      <Clock size={12} />
                      <span>{adv.nextSlot}</span>
                    </span>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-5 mt-5 flex items-center justify-between gap-3 border-t border-slate-100">
                  <div>
                    <div className="text-[18px] font-black font-mono text-slate-900">{adv.fee}</div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      LexNova Escrow
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/chat?advocate=${encodeURIComponent(adv.name)}`}
                      className="px-3.5 py-2 rounded-xl text-[12px] font-bold border border-slate-200 bg-slate-50 text-indigo-700 hover:bg-slate-100 transition-colors"
                    >
                      Chat
                    </Link>
                    <button
                      onClick={() => {
                        setBookingAdvocate(adv);
                        setBookingConfirmed(false);
                        setBookingSlot(adv.nextSlot);
                      }}
                      className="px-4 py-2 rounded-xl text-white text-[12px] font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all"
                    >
                      Book Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CONSULTATION BOOKING MODAL ── */}
      {bookingAdvocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)'}}>
          <div className="rounded-3xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] shadow-2xl" style={{background: '#FFFFFF', border: '1px solid rgba(99,102,241,0.2)'}}>
            
            {/* Modal Header */}
            <div className="p-6 flex items-center justify-between" style={{borderBottom: '1px solid #E2E8F0'}}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden relative shrink-0" style={{border: '1px solid rgba(99,102,241,0.2)'}}>
                  <Image src={bookingAdvocate.photo} alt={bookingAdvocate.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-bold text-slate-900">{bookingAdvocate.name}</h3>
                    <ShieldCheck size={16} style={{color: '#10B981'}} />
                  </div>
                  <p className="text-[12px] font-mono" style={{color: '#64748B'}}>
                    {bookingAdvocate.flag} {bookingAdvocate.credentials}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingAdvocate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{border: '1px solid rgba(99,102,241,0.2)', color: '#64748B', background: 'rgba(99,102,241,0.05)'}}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {!bookingConfirmed ? (
                <>
                  {/* Step 1: Select Scope */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-mono font-semibold uppercase tracking-wider block" style={{color: '#64748B'}}>
                      1. Select Consultation Scope
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: 'triage',
                          title: '15-Min Quick Strategy Triage',
                          desc: 'Rapid jurisdictional & limitation check before drafting formal notices.',
                          fee: '$95'
                        },
                        {
                          id: 'consultation',
                          title: '45-Min Comprehensive Dispute Review',
                          desc: 'In-depth contract scrutiny, choice of law analysis, and counterparty litigation roadmap.',
                          fee: bookingAdvocate.fee
                        },
                        {
                          id: 'drafting',
                          title: 'Full Pre-Action Notice & Filing Sign-off',
                          desc: 'Advocate reviews and formally validates court-admissible pre-action protocol documents.',
                          fee: '$450'
                        }
                      ].map((tier) => (
                        <div
                          key={tier.id}
                          onClick={() => setBookingTier(tier.id as any)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all`}
                          style={bookingTier === tier.id ? {
                            border: '1px solid rgba(99,102,241,0.5)',
                            background: 'rgba(99,102,241,0.08)',
                            boxShadow: '0 0 20px rgba(99,102,241,0.1)'
                          } : {
                            border: '1px solid #E2E8F0',
                            background: '#F8FAFC'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-slate-900">{tier.title}</span>
                            <span className="text-[14px] font-mono font-bold" style={{color: '#818CF8'}}>{tier.fee}</span>
                          </div>
                          <p className="text-[12px] mt-1 leading-snug" style={{color: '#64748B'}}>{tier.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Time Slot */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-mono font-semibold uppercase tracking-wider block" style={{color: '#64748B'}}>
                      2. Choose Open Strategy Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        bookingAdvocate.nextSlot,
                        'Today, 6:00 PM',
                        'Tomorrow, 10:00 AM',
                        'Tomorrow, 2:30 PM'
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-[12px] font-mono transition-all`}
                          style={bookingSlot === slot ? {
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            color: 'white',
                            border: '1px solid rgba(99,102,241,0.4)'
                          } : {
                            background: '#F8FAFC',
                            color: '#475569',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Matter Summary */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-mono font-semibold uppercase tracking-wider block" style={{color: '#64748B'}}>
                      3. Brief Matter Overview (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={bookingCaseDesc}
                      onChange={(e) => setBookingCaseDesc(e.target.value)}
                      placeholder="e.g. Counterparty defaulted on $140k invoice under Delaware law..."
                      className="w-full rounded-2xl p-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
                      style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}
                    />
                  </div>

                  {/* Escrow Banner */}
                  <div className="rounded-2xl p-3.5 flex items-start gap-3" style={{background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)'}}>
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" style={{color: '#10B981'}} />
                    <div className="text-[12px] leading-snug" style={{color: '#475569'}}>
                      <strong className="font-semibold" style={{color: '#10B981'}}>LexNova Escrow Assurance:</strong> Funds remain securely locked until consultation completion. If counsel cannot attend, 100% immediate refund is issued.
                    </div>
                  </div>
                </>
              ) : (
                /* Confirmed Screen */
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981'}}>
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Consultation Confirmed</h4>
                    <p className="text-[13px] mt-1 max-w-sm mx-auto" style={{color: '#64748B'}}>
                      Your strategy conference with <strong style={{color: '#0F172A'}}>{bookingAdvocate.name}</strong> is scheduled for <strong style={{color: '#0F172A'}}>{bookingSlot}</strong>.
                    </p>
                  </div>
                  <div className="rounded-2xl p-4 font-mono text-[12px] space-y-1 text-left max-w-sm mx-auto" style={{background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569'}}>
                    <div className="flex justify-between">
                      <span style={{color: '#64748B'}}>Session Pass:</span>
                      <span className="font-bold text-slate-900">LNX-CONF-88492</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{color: '#64748B'}}>Escrow Status:</span>
                      <span className="font-semibold" style={{color: '#10B981'}}>Bonded &amp; Protected</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{color: '#64748B'}}>Meeting Link:</span>
                      <span className="underline cursor-pointer" style={{color: '#818CF8'}}>lexnova.ai/room/sarah</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 flex items-center justify-end gap-3" style={{borderTop: '1px solid #E2E8F0'}}>
              {!bookingConfirmed ? (
                <>
                  <button
                    onClick={() => setBookingAdvocate(null)}
                    className="px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors"
                    style={{border: '1px solid #E2E8F0', color: '#64748B', background: 'rgba(99,102,241,0.03)'}}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBookingConfirmed(true)}
                    className="px-6 py-2.5 rounded-full text-white text-[13px] font-semibold transition-colors flex items-center gap-2"
                    style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 12px rgba(99,102,241,0.35)'}}
                  >
                    <span>Confirm &amp; Reserve Slot</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full justify-between">
                  <button
                    onClick={() => setBookingAdvocate(null)}
                    className="px-4 py-2.5 rounded-full text-[13px] font-medium"
                    style={{border: '1px solid #E2E8F0', color: '#64748B', background: 'rgba(99,102,241,0.03)'}}
                  >
                    Close
                  </button>
                  <Link
                    href={`/dashboard/chat?advocate=${encodeURIComponent(bookingAdvocate.name)}`}
                    className="px-6 py-2.5 rounded-full text-white text-[13px] font-semibold flex items-center gap-2"
                    style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 12px rgba(99,102,241,0.35)'}}
                  >
                    <span>Enter Secure Room Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── DEVELOPER SDK & API PLAYGROUND ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14" style={{borderTop: '1px solid #E2E8F0', background: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
                  Developer REST API &amp; SDK
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full" style={{color: '#818CF8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)'}}>
                  v1.4 Production
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Programmatic legal intelligence for modern platforms.
              </h2>
              <p className="text-[14px] max-w-2xl leading-relaxed" style={{color: '#64748B'}}>
                Autonomous multi-jurisdiction dispute intake, statutory limitation countdowns, and court-admissible pre-action notice generation executable in 38ms.
              </p>
            </div>
            
            {/* Language Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-full" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
              {(['curl', 'typescript', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-mono font-medium transition-colors`}
                  style={activeCodeTab === tab ? {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.3)'
                  } : {
                    color: '#64748B'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Preset Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-mono uppercase tracking-wider mr-2" style={{color: '#64748B'}}>
              Test Presets:
            </span>
            {(['us', 'uk', 'eu', 'sg'] as const).map((pId) => {
              const p = API_PRESETS[pId];
              return (
                <button
                  key={pId}
                  onClick={() => setApiPresetId(pId)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-mono transition-all flex items-center gap-1.5`}
                  style={apiPresetId === pId ? {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    border: '1px solid rgba(99,102,241,0.4)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.25)'
                  } : {
                    background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#334155'
                  }}
                >
                  <span>{p.flag}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Split Interactive Console: Code & Live Execution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Console: Request & Code */}
            <div className="lg:col-span-6 rounded-3xl p-6 text-slate-900 flex flex-col justify-between" style={{background: '#FFFFFF', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3" style={{borderBottom: '1px solid #E2E8F0'}}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold" style={{background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)'}}>
                      POST
                    </span>
                    <span className="text-[12px] font-mono" style={{color: 'rgba(168,174,207,0.7)'}}>
                      https://api.lexnova.ai/v1/cases/intake
                    </span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="text-[12px] font-mono flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    style={{color: '#64748B'}}
                  >
                    <Copy size={13} />
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="overflow-x-auto text-[12.5px] font-mono leading-relaxed max-h-[360px] py-1" style={{color: '#475569'}}>
                  <code>{currentApiPreset.codeSnippets[activeCodeTab]}</code>
                </pre>
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between" style={{borderTop: '1px solid #E2E8F0'}}>
                <span className="text-[11px] font-mono" style={{color: 'rgba(99,102,241,0.4)'}}>
                  Target: {currentApiPreset.jurisdiction} · {currentApiPreset.claimAmount}
                </span>
                <button
                  onClick={handleRunApi}
                  disabled={isExecutingApi}
                  className="px-4 py-2 rounded-full text-[12.5px] font-mono font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', boxShadow: '0 2px 10px rgba(99,102,241,0.3)'}}
                >
                  {isExecutingApi ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="fill-current" />
                      <span>Run API Request ⚡</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Console: Live Response Inspector */}
            <div className="lg:col-span-6 rounded-3xl p-6 flex flex-col justify-between" style={{background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(15,23,42,0.05)'}}>
              <div className="space-y-4">
                
                {/* Top Status Bar */}
                <div className="flex items-center justify-between pb-3" style={{borderBottom: '1px solid #E2E8F0'}}>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold" style={{background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)'}}>
                      ● 201 Created
                    </span>
                    <span className="text-[11.5px] font-mono" style={{color: '#64748B'}}>
                      Latency: <strong style={{color: '#0F172A'}}>{apiExecutionTime}ms</strong>
                    </span>
                    <span className="hidden sm:inline text-[11px] font-mono" style={{color: '#94A3B8'}}>
                      TLS 1.3 · us-east-1
                    </span>
                  </div>

                  {/* View Switcher */}
                  <div className="flex gap-1">
                    {[
                      { id: 'json', label: 'JSON' },
                      { id: 'analysis', label: 'Analysis' },
                      { id: 'notice', label: 'Notice' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setActiveApiView(v.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors`}
                        style={activeApiView === v.id ? {
                          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                          color: 'white'
                        } : {
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid #E2E8F0',
                          color: '#64748B'
                        }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View 1: JSON Payload */}
                {activeApiView === 'json' && (
                  <div className="relative">
                    <button
                      onClick={copyApiResponse}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 z-10 transition-colors bg-white/10 hover:bg-white/20 text-indigo-300"
                    >
                      <Copy size={11} />
                      <span>{copiedApiResponse ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                    <pre className="overflow-x-auto text-[12px] font-mono leading-relaxed p-4 rounded-2xl max-h-[350px] bg-[#0A0D14] text-emerald-400 border border-slate-800 shadow-inner">
                      <code>{JSON.stringify(currentApiPreset.resPayload, null, 2)}</code>
                    </pre>
                  </div>
                )}

                {/* View 2: Analysis Cards */}
                {activeApiView === 'analysis' && (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    <div className="p-4 rounded-2xl space-y-2" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                      <div className="text-[11px] font-mono font-semibold uppercase" style={{color: '#64748B'}}>
                        Statutory Governing Citations
                      </div>
                      <div className="space-y-1.5">
                        {currentApiPreset.resPayload.governing_statutes.map((s: string, idx: number) => (
                          <div key={idx} className="text-[12.5px] font-mono flex items-center gap-2" style={{color: '#475569'}}>
                            <CheckCircle2 size={13} style={{color: '#10B981'}} className="shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                        <div className="text-[11px] font-mono" style={{color: '#64748B'}}>Limitation Remaining</div>
                        <div className="text-[20px] font-bold font-mono mt-1" style={{color: '#10B981'}}>
                          {currentApiPreset.resPayload.limitation_analysis.days_remaining} Days
                        </div>
                        <div className="text-[11px] font-mono mt-0.5" style={{color: '#64748B'}}>
                          Extinction: {currentApiPreset.resPayload.limitation_analysis.statute_of_limitations_deadline}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                        <div className="text-[11px] font-mono" style={{color: '#64748B'}}>Pre-Action Cure Period</div>
                        <div className="text-[20px] font-bold font-mono mt-1 text-slate-900">
                          {currentApiPreset.resPayload.pre_action_protocol.cure_period_days} Days
                        </div>
                        <div className="text-[11px] font-mono mt-0.5" style={{color: '#64748B'}}>
                          Statutory Rate: {currentApiPreset.resPayload.pre_action_protocol.statutory_interest_rate}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl flex items-center justify-between" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                      <div>
                        <div className="text-[11px] font-mono" style={{color: '#64748B'}}>Escrow Integrity</div>
                        <div className="text-[12.5px] font-bold text-slate-900 mt-0.5">
                          {currentApiPreset.resPayload.escrow_guarantee}
                        </div>
                      </div>
                      <ShieldCheck size={20} style={{color: '#10B981'}} />
                    </div>
                  </div>
                )}

                {/* View 3: Court Notice Document Preview */}
                {activeApiView === 'notice' && (
                  <div className="p-5 rounded-2xl space-y-3 font-serif max-h-[350px] overflow-y-auto" style={{background: '#F8FAFC', border: '1px solid #E2E8F0'}}>
                    <div className="pb-3 flex items-center justify-between" style={{borderBottom: '1px solid #E2E8F0'}}>
                      <div>
                        <div className="text-[13px] font-bold uppercase tracking-wider font-mono text-slate-900">
                          Formal Demand &amp; Cure Requisition
                        </div>
                        <div className="text-[11px] font-mono" style={{color: '#64748B'}}>
                          Case File: {currentApiPreset.resPayload.case_id}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded" style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8'}}>
                        Court Admissible
                      </span>
                    </div>

                    <div className="text-[12px] space-y-2 leading-relaxed font-sans" style={{color: '#475569'}}>
                      <p>
                        <strong style={{color: '#0F172A'}}>NOTICE IS HEREBY GIVEN</strong> pursuant to {currentApiPreset.resPayload.governing_statutes[0]} that Defaulting Entity has committed material breach regarding principal sum of <strong style={{color: '#0F172A'}}>{currentApiPreset.claimAmount}</strong>.
                      </p>
                      <p>
                        Pursuant to pre-action protocol guidelines in <em style={{color: '#818CF8'}}>{currentApiPreset.resPayload.recommended_forum}</em>, recipient is granted {currentApiPreset.resPayload.pre_action_protocol.cure_period_days} calendar days to remit settlement.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between font-mono text-[11px]" style={{borderTop: '1px solid #E2E8F0'}}>
                      <span className="font-semibold" style={{color: '#10B981'}}>&bull; Digital Seal Affixed</span>
                      <a
                        href={currentApiPreset.resPayload.pre_action_protocol.court_admissible_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                        style={{color: '#818CF8'}}
                      >
                        <span>Download Signed PDF</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom API Summary */}
              <div className="pt-4 mt-4 flex items-center justify-between text-[11.5px] font-mono" style={{borderTop: '1px solid #E2E8F0', color: '#64748B'}}>
                <span>Status: <strong style={{color: '#10B981'}}>Autonomous Pipeline Verified</strong></span>
                <span>Case ID: <strong style={{color: '#0F172A'}}>{currentApiPreset.resPayload.case_id}</strong></span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14" style={{borderTop: '1px solid #E2E8F0', background: '#FFFFFF'}}>
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <div className="text-[12px] font-mono font-semibold uppercase tracking-widest" style={{color: '#64748B'}}>
              Questions &amp; Answers
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-3">
            {GLOBAL_FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{background: '#FFFFFF', border: '1px solid #E2E8F0'}}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 group"
                >
                  <span className="text-[15.5px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 transition-transform duration-200 ${openFaqIndex === i ? 'rotate-180' : ''}`}
                    style={{color: openFaqIndex === i ? '#818CF8' : '#64748B'}}
                  />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-6 text-[14px] leading-relaxed pt-4 font-serif" style={{borderTop: '1px solid #E2E8F0', color: '#475569'}}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 sm:px-10 lg:px-14 relative overflow-hidden" style={{borderTop: '1px solid #E2E8F0'}}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px" style={{background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full" style={{background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)'}} />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-6 relative">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Bring legal certainty to the frontier.
          </h2>
          <p className="font-serif text-xl sm:text-2xl max-w-xl mx-auto" style={{color: '#64748B'}}>
            Experience court-admissible autonomous analysis and verified counsel for disputes worldwide.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/chat"
              className="px-7 py-3.5 rounded-full text-white font-semibold text-[14.5px] transition-all flex items-center gap-2"
              style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)'}}
            >
              <span>Try LexNova Free</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/auth/signup?role=ADVOCATE"
              className="px-6 py-3.5 rounded-full font-medium text-[14.5px] transition-colors"
              style={{border: '1px solid rgba(99,102,241,0.2)', color: '#475569', background: 'rgba(99,102,241,0.05)'}}
            >
              <span>Join as Advocate</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
