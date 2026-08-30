'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Scale, ArrowRight, Shield, Zap, CheckCircle2, ChevronRight,
  FileText, MessageSquare, Users, Lock, ChevronDown, Sparkles,
  Star, Clock, Briefcase, ShieldCheck, Building, UserCheck,
  Award, FileCheck, ArrowUpRight, HeartHandshake, PhoneCall,
  Brain, Search, Video, Bell, BarChart3, FolderOpen, Check,
  TrendingUp, Globe, BadgeCheck, CalendarCheck, Gavel, BookOpen,
  ScanLine, Layers, AlertCircle, X, CheckCircle, Send, Play,
  Cpu, Copy, CornerDownLeft, FolderLock
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ─────────────────────────────────────────────
   DATA & SCENARIOS
───────────────────────────────────────────── */

const QUICK_PROMPTS = [
  "Landlord withheld ₹75,000 security deposit for 45 days",
  "Company refused to disburse ₹95,000 unpaid salary",
  "E-commerce seller delivered defective laptop and denied refund",
  "Unauthorized UPI banking fraud of ₹45,000 via phishing",
];

const STATS = [
  { value: '2,400+', label: 'Bar Council Advocates', sub: 'Verified across all High Courts' },
  { value: '50K+', label: 'Legal Precedents', sub: 'Supreme Court & High Court rulings' },
  { value: '98.4%', label: 'Intake Accuracy', sub: 'Neural civil pleadings mapping' },
  { value: '₹14Cr+', label: 'Claims Resolved', sub: 'Direct client recovery value' },
];

const TICKER_ITEMS = [
  '⚖️ AES-256 Bank-Grade Encryption',
  '🏛️ Bar Council of India Verified',
  '📋 50,000+ Court Precedents',
  '🔒 Attorney-Client Confidentiality',
  '⚡ AI Neural Legal Intake in 42ms',
  '🇮🇳 Indian Civil, Criminal & Labor Acts',
  '🎥 Encrypted HD Video Consultations',
  '📄 Court-Admissible RPAD Notice Generator',
  '⏱️ Automated Limitation Act Article 7 Tracking',
];

const INTERACTIVE_TOUR_TABS = [
  {
    id: 'intake',
    label: '1. AI Intake Engine',
    icon: MessageSquare,
    title: 'Transform plain words into structured civil pleadings in seconds',
    desc: 'Describe what happened in plain English or Hindi. Our neural model extracts parties, damages, and dates into an admissible civil fact matrix.',
    badge: 'Natural Language RAG',
    metric: '42ms Synthesis Speed',
    preview: {
      type: 'chat',
      userInput: "I resigned on April 30, served full 30 days notice till May 31. TechCorp withheld my ₹95,000 salary without any written reason.",
      aiAnalysis: {
        classification: "Unlawful Wage Deduction under Payment of Wages Act §15",
        causeOfAction: "31 May 2025 (Notice Period Completion)",
        claimAmount: "₹95,000 + ₹22,000 Leave Encashment = ₹1,17,000",
        limitationWindow: "18 Days Remaining (Article 7, 3-Year Statutory Cap)",
      }
    }
  },
  {
    id: 'statutes',
    label: '2. Statutory Research',
    icon: BookOpen,
    title: 'Instant cross-referencing with 50,000+ Indian judicial precedents',
    desc: 'Never miss a section or deadline. The engine cross-references central acts and cites binding Supreme Court judgments for your jurisdiction.',
    badge: '50,000+ Precedents',
    metric: '100% Citation Precision',
    preview: {
      type: 'statutes',
      items: [
        { act: "Payment of Wages Act 1936 · Section 15", rule: "Empowers claim filing for delayed wages with up to 10x penalty compensation.", citation: "1936 ACT IV § 15" },
        { act: "Industrial Disputes Act 1947 · Section 33C(2)", rule: "Recovery of money due from employer enforceable via Labour Court order.", citation: "1947 ACT XIV § 33C" },
        { act: "Limitation Act 1963 · Article 7", rule: "Prescribes 3-year statutory clock from the date unpaid wages accrued.", citation: "1963 ACT XXXVI" },
      ]
    }
  },
  {
    id: 'documents',
    label: '3. Notice Drafting',
    icon: FileCheck,
    title: 'Court-admissible RPAD demand notices and tribunal complaints',
    desc: 'Generate formal 15-day statutory demand notices citing governing acts, sections, and interest clauses, ready for registered post or PDF export.',
    badge: 'Court-Ready PDF',
    metric: '1-Click RPAD Dispatch',
    preview: {
      type: 'document',
      header: "REGISTERED A.D. LEGAL NOTICE · § 15 PAYMENT OF WAGES",
      body: "UNDER INSTRUCTIONS FROM OUR CLIENT, WE HEREBY CALL UPON YOU TO DISBURSE THE OUTSTANDING EARNED WAGES OF ₹1,17,000 ALONG WITH 18% P.A. STATUTORY INTEREST WITHIN 15 DAYS OF RECEIPT...",
      status: "VERIFIED & ADMISSIBLE"
    }
  },
  {
    id: 'advocates',
    label: '4. Verified Advocates',
    icon: Users,
    title: 'Collaborate with enrolled Bar Council counsel in HD video rooms',
    desc: 'Match with specialist advocates who receive your pre-structured 60-second case dossier. Transparent fixed pricing, zero hidden hourly retainers.',
    badge: '2,400+ Verified',
    metric: 'Instant Video Meeting',
    preview: {
      type: 'advocate',
      name: "Advocate Rajesh Sharma",
      role: "Senior Employment & Labour Counsel",
      bar: "MAH/8832/2012 · 18 Yrs Exp",
      rating: "★ 4.9 (547 Verified Consultations)",
      courts: "Bombay HC · Labour Tribunals · Supreme Court",
      fee: "₹1,499 / 60-min HD Session"
    }
  }
];

const FEATURES_BENTO = [
  {
    icon: Brain,
    title: 'Neural Case Intake Engine',
    description: 'Explain disputes in plain English or Hindi. Converts unstructured speech into court-ready pleadings, parties, and damages.',
    tag: 'RAG Neural Model',
    color: 'blue',
    span: 'lg:col-span-2',
    metric: '42ms',
    metricLabel: 'Processing Latency'
  },
  {
    icon: Clock,
    title: 'Statutory Limitation Radar',
    description: 'Tracks filing deadlines under Limitation Act 1963 with real-time countdown clocks and automated risk alerts.',
    tag: 'Never Miss Filing',
    color: 'amber',
    span: 'lg:col-span-1',
    metric: '18 Days',
    metricLabel: 'Average Window Alert'
  },
  {
    icon: FileCheck,
    title: 'Automated Document Studio',
    description: 'Draft RPAD demand notices, Section 138 cheque bounce letters, and consumer petitions with instant PDF exports.',
    tag: 'Court Admissible',
    color: 'purple',
    span: 'lg:col-span-1',
    metric: '100%',
    metricLabel: 'CPC Formatting'
  },
  {
    icon: Users,
    title: 'Verified Advocate Network',
    description: '2,400+ Bar Council verified advocates across all 25 High Courts. Fixed consultation fees with integrated HD video rooms.',
    tag: '2,400+ Advocates',
    color: 'emerald',
    span: 'lg:col-span-2',
    metric: '4.9 ★',
    metricLabel: 'Client Satisfaction'
  },
  {
    icon: FolderLock,
    title: 'Encrypted Matter Workspace',
    description: 'A centralized war room for every case: fact matrix, exhibits with SHA-256 hashes, timelines, and strategy transcripts.',
    tag: 'AES-256 Vault',
    color: 'cyan',
    span: 'lg:col-span-2',
    metric: 'Zero-Knowledge',
    metricLabel: 'Data Encryption'
  },
  {
    icon: Scale,
    title: 'Precedent Research Matrix',
    description: 'Search 50,000+ Supreme Court & High Court judgments filtered by statute, damage value, and historical success probability.',
    tag: '50K+ Case Laws',
    color: 'rose',
    span: 'lg:col-span-1',
    metric: '98.4%',
    metricLabel: 'Relevance Precision'
  }
];

const ADVOCATES_SHOWCASE = [
  {
    name: 'Adv. Priya Mehta',
    role: 'Property & Tenancy Specialist',
    experience: '11 Years',
    rating: 4.9,
    reviews: 312,
    fee: '₹999',
    available: true,
    badge: 'Top Rated',
    photo: '/advocate-priya.jpg',
    wins: '890+ Matters',
    courts: 'Karnataka High Court, Civil Courts',
    specialty: 'Security Deposit & RERA Claims'
  },
  {
    name: 'Adv. Rajesh Sharma',
    role: 'Employment & Labour Counsel',
    experience: '18 Years',
    rating: 4.9,
    reviews: 547,
    fee: '₹1,499',
    available: true,
    badge: 'Senior Counsel',
    photo: '/advocate-rajesh.jpg',
    wins: '1,420+ Matters',
    courts: 'Bombay HC, Labour Tribunals, Supreme Court',
    specialty: 'Unpaid Wages & Termination'
  },
  {
    name: 'Adv. Ananya Iyer',
    role: 'Consumer & Civil Rights',
    experience: '8 Years',
    rating: 4.8,
    reviews: 203,
    fee: '₹799',
    available: true,
    badge: 'Consumer Specialist',
    photo: '/advocate-ananya.jpg',
    wins: '430+ Matters',
    courts: 'Madras High Court, Consumer Redressal Forum',
    specialty: 'Defective Products & Insurance Fraud'
  }
];

const OUTCOMES = [
  {
    icon: '🏠',
    title: 'Security Deposit Recovered',
    amount: '₹75,000',
    days: '11 Days',
    category: 'Property Law',
    user: 'Anjali R.',
    city: 'Bengaluru',
    quote: 'Landlord refused to return my deposit for 2 months. The AI generated an RPAD notice citing Transfer of Property Act §108(B). He refunded everything in 11 days.',
    color: 'emerald',
  },
  {
    icon: '💼',
    title: 'Unpaid Salary Arrears',
    amount: '₹1,17,000',
    days: '18 Days',
    category: 'Employment Law',
    user: 'Kiran P.',
    city: 'Mumbai',
    quote: 'Company withheld 2 months salary after resignation. Advocate Rajesh Sharma reviewed the AI draft and served notice. Settlement credited in full.',
    color: 'blue',
  },
  {
    icon: '🛒',
    title: 'Consumer Forum Refund & Damages',
    amount: '₹90,000',
    days: '24 Days',
    category: 'Consumer Rights',
    user: 'Meera S.',
    city: 'Chennai',
    quote: 'E-commerce platform delivered damaged OLED TV and rejected replacement. Drafted Section 35 consumer complaint in 10 minutes. Full refund plus compensation.',
    color: 'purple',
  },
  {
    icon: '🔐',
    title: 'Cyber Phishing Recovery',
    amount: '₹45,000',
    days: '7 Days',
    category: 'Cyber Crime',
    user: 'Rohan T.',
    city: 'Delhi',
    quote: 'Lost funds in a fraudulent bank KYC link. LexNova helped me draft an IT Act 66D petition to the nodal cyber cell. Bank reversed the transfer within a week.',
    color: 'rose',
  },
];

const FAQS = [
  {
    q: 'Is LexNova a law firm or a licensed advocate?',
    a: 'LexNova is an AI Legal Operating System and technology platform. We provide automated case classification, statutory legal research, limitation calculation, and notice drafting assistance, while seamlessly connecting users with independent Bar Council of India verified advocates for formal advice and representation.',
  },
  {
    q: 'How does the AI Case Intake Engine analyze disputes?',
    a: 'You describe what happened in plain English or Hindi. Our proprietary neural RAG model maps your statements against 50,000+ Indian court precedents, central acts (CPC, IPC, CPA 2019, Transfer of Property Act), and automatically calculates your statutory limitation deadlines under the Limitation Act 1963.',
  },
  {
    q: 'Are the generated legal notices court-admissible?',
    a: 'Yes. All notices are formatted according to Indian civil procedure standards, citing governing acts, statutory interest clauses, and registered post RPAD headers. You can export directly to court-formatted PDF or have an enrolled advocate review and sign your draft.',
  },
  {
    q: 'How do video consultations with advocates work?',
    a: 'When you book an appointment, a secure HD video consultation room is created. Your matched advocate receives a pre-structured 60-second AI case dossier before the call, ensuring you get direct tactical advice from the very first minute.',
  },
  {
    q: 'How is my private case data protected?',
    a: 'All case facts, uploaded evidence files, and consultation notes are encrypted with bank-grade AES-256 encryption and protected under strict attorney-client confidentiality guidelines. We never share or sell your data.',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    text: 'text-blue-400',    glow: 'shadow-blue-500/20' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  text: 'text-purple-400',  glow: 'shadow-purple-500/20' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   text: 'text-amber-400',   glow: 'shadow-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    text: 'text-rose-400',    glow: 'shadow-rose-500/20' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    glow: 'shadow-cyan-500/20' },
};

/* ─────────────────────────────────────────────
   HOMEPAGE COMPONENT
───────────────────────────────────────────── */

export default function HomePage() {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState("");
  const [activeTourTab, setActiveTourTab] = useState(INTERACTIVE_TOUR_TABS[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tickerPaused, setTickerPaused] = useState(false);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroPrompt.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(heroPrompt.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    router.push(`/dashboard/chat?init=${encodeURIComponent(prompt)}`);
  };

  const currentTour = INTERACTIVE_TOUR_TABS.find(t => t.id === activeTourTab) || INTERACTIVE_TOUR_TABS[0];

  return (
    <div className="min-h-screen bg-[#050508] text-[#F0F2F5] flex flex-col antialiased selection:bg-blue-500/30 selection:text-white font-sans">
      
      <Navbar />

      {/* ══════════════════════════════════════════════
          1. HERO SECTION WITH LIVE PROMPT ENGINE
      ══════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden">

        {/* Ambient Radial Lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/[0.08] via-purple-600/[0.04] to-transparent rounded-full blur-[180px]" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[140px]" />
        </div>

        {/* Subtle grid mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)'
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Top Version Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-8"
          >
            <Link href="/dashboard/chat" className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-blue-500/40 transition-all text-[13.5px] text-[#CBD5E1] font-medium shadow-lg shadow-black/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LexNova OS 2.0 · India&apos;s Legal Operating System</span>
              <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-center max-w-[920px] mx-auto space-y-6"
          >
            <h1 className="text-[52px] sm:text-[72px] lg:text-[84px] font-display font-normal text-white tracking-tight leading-[0.95]">
              Legal Work,<br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Intelligently Solved.
              </span>
            </h1>
            <p className="text-[19px] sm:text-[21px] text-[#9BAABB] max-w-[680px] mx-auto leading-[1.65] font-normal">
              Explain your dispute in plain language. Get instant statutory analysis, automated limitation tracking, court-ready notices, and verified advocate matching.
            </p>
          </motion.div>

          {/* Interactive Live Case Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="max-w-3xl mx-auto mt-10"
          >
            <form
              onSubmit={handleHeroSubmit}
              className="bg-[#0B0F18]/90 border border-white/[0.14] hover:border-blue-500/50 focus-within:border-blue-500 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition-all"
            >
              <div className="flex items-center gap-3 px-3.5 flex-1 w-full">
                <Sparkles size={18} className="text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder="Explain what happened (e.g. landlord refused to return ₹75,000 security deposit)..."
                  className="bg-transparent text-[15px] text-white placeholder-[#5D6F86] outline-none w-full py-2.5 font-normal"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-[14.5px] font-semibold px-6 py-3.5 h-[48px] rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 shadow-lg shadow-blue-600/30"
              >
                <span>Analyze Case</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Prompt Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-[12px] text-[#7A8A9E]">
              <span className="font-semibold text-[#5B6B7C]">Try an example:</span>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="bg-[#0C101A] hover:bg-[#141B2A] border border-white/[0.08] hover:border-white/[0.2] text-[#A0B0C4] hover:text-white px-3 py-1.5 rounded-lg transition-all truncate max-w-[280px]"
                  title={prompt}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust proof bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-10 text-[13px] text-[#7A8899]"
          >
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-emerald-400" /> AES-256 Encrypted
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" /> Bar Council Verified
            </div>
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-purple-400" /> 50,000+ Precedents
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9★ Average Rating
            </div>
          </motion.div>

          {/* Hero Product Screenshot Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 relative max-w-5xl mx-auto"
          >
            {/* Glow behind image */}
            <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-3xl" />

            {/* Floating badge - top left */}
            <div className="absolute -top-4 -left-4 z-20 bg-[#0D1118]/95 border border-emerald-500/40 rounded-xl px-4 py-2.5 shadow-2xl hidden sm:flex items-center gap-2.5 backdrop-blur-md">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] font-semibold text-emerald-400">Pleading Synthesized · 42ms</span>
            </div>

            {/* Floating badge - top right */}
            <div className="absolute -top-4 -right-4 z-20 bg-[#0D1118]/95 border border-blue-500/40 rounded-xl px-4 py-2.5 shadow-2xl hidden sm:flex items-center gap-2 backdrop-blur-md">
              <Brain size={14} className="text-blue-400" />
              <span className="text-[13px] font-semibold text-blue-400">Payment of Wages §15 Mapped</span>
            </div>

            {/* Floating badge - bottom left */}
            <div className="absolute -bottom-4 -left-4 z-20 bg-[#0D1118]/95 border border-amber-500/40 rounded-xl px-4 py-2.5 shadow-2xl hidden sm:flex items-center gap-2 backdrop-blur-md">
              <Clock size={14} className="text-amber-400" />
              <span className="text-[13px] font-semibold text-amber-400">⏳ 18 Days Limitation Left</span>
            </div>

            {/* Floating badge - bottom right */}
            <div className="absolute -bottom-4 -right-4 z-20 bg-[#0D1118]/95 border border-purple-500/40 rounded-xl px-4 py-2.5 shadow-2xl hidden sm:flex items-center gap-2 backdrop-blur-md">
              <Users size={14} className="text-purple-400" />
              <span className="text-[13px] font-semibold text-purple-400">Adv. Rajesh Sharma Matched</span>
            </div>

            {/* Dashboard screenshot preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              <Image
                src="/dashboard-hero.jpg"
                alt="LexNova Legal Operating System Workspace"
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. METRIC STATS BAR
      ══════════════════════════════════════════════ */}
      <section className="py-12 border-y border-white/[0.06] bg-[#07090D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/[0.06]">
            {STATS.map((s, i) => (
              <div key={i} className="text-center px-6">
                <div className="text-[40px] sm:text-[48px] font-bold text-white tracking-tight font-display">
                  {s.value}
                </div>
                <div className="text-[15px] font-semibold text-[#E2E8F0] mt-0.5">{s.label}</div>
                <div className="text-[12.5px] text-[#6B7B94] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. SCROLLING MARQUEE TICKER
      ══════════════════════════════════════════════ */}
      <section className="py-5 border-b border-white/[0.06] bg-[#050508] overflow-hidden">
        <div
          className="flex gap-10 ticker-track"
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
          style={{ animationPlayState: tickerPaused ? 'paused' : 'running' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="whitespace-nowrap text-[13.5px] text-[#6B7B94] font-medium flex items-center gap-2 flex-shrink-0">
              {item}
              <span className="w-1 h-1 rounded-full bg-[#2D3A4A] ml-8" />
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. INTERACTIVE PRODUCT TOUR (4-STAGE WORKFLOW)
      ══════════════════════════════════════════════ */}
      <section className="py-28 border-b border-white/[0.06] bg-[#07090D] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-blue-400 tracking-[0.1em] uppercase">
              <Cpu size={14} /> Interactive Platform Walkthrough
            </div>
            <h2 className="text-[36px] sm:text-[50px] font-display text-white tracking-tight leading-[1.04]">
              See how LexNova resolves your dispute end-to-end.
            </h2>
            <p className="text-[#8D9CB0] text-[18px] leading-relaxed">
              Click through the 4 stages below to explore how raw claims turn into court-ready pleadings and advocate representation.
            </p>
          </div>

          {/* Tab Switchers */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-8">
            {INTERACTIVE_TOUR_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTourTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTourTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[14.5px] font-semibold transition-all whitespace-nowrap ${
                    active
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "bg-[#0C101A] text-[#8C9BB4] border border-white/[0.08] hover:border-white/[0.2] hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Tour Display Card */}
          <div className="bg-[#0A0C12] border border-white/[0.1] rounded-3xl p-8 lg:p-10 grid lg:grid-cols-12 gap-10 items-center shadow-2xl relative overflow-hidden">
            
            {/* Left Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-md">
                  {currentTour.badge}
                </span>
                <span className="text-[13px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> {currentTour.metric}
                </span>
              </div>

              <h3 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
                {currentTour.title}
              </h3>

              <p className="text-[16px] text-[#9AA8BC] leading-relaxed">
                {currentTour.desc}
              </p>

              <div className="pt-2">
                <Link
                  href="/dashboard/chat"
                  className="btn-primary text-[14.5px] font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2"
                >
                  <span>Launch Live Engine</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Interactive Preview Display (6 cols) */}
            <div className="lg:col-span-6 bg-[#06080E] border border-white/[0.1] rounded-2xl p-6 shadow-inner space-y-4 relative">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11.5px] font-mono text-[#6D7D93] uppercase font-bold">
                  {currentTour.label}
                </span>
              </div>

              {/* Tab 1: Chat Preview */}
              {currentTour.preview.type === 'chat' && (
                <div className="space-y-4 text-[13.5px]">
                  <div className="bg-[#121828] border border-blue-500/30 rounded-xl p-4 text-[#E2E8F0] space-y-1">
                    <span className="text-[11px] font-bold uppercase text-blue-400 block">User Plain Language Input:</span>
                    <p className="italic leading-relaxed">&ldquo;{currentTour.preview.userInput}&rdquo;</p>
                  </div>

                  <div className="bg-[#090D16] border border-emerald-500/30 rounded-xl p-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                      <Sparkles size={12} /> Structured Civil Pleading Extracted:
                    </span>
                    <div className="text-[13px] text-[#9AA8BC] space-y-1 font-mono">
                      <div>• Cause: <strong className="text-white">{currentTour.preview.aiAnalysis?.classification}</strong></div>
                      <div>• Claim: <strong className="text-emerald-400">{currentTour.preview.aiAnalysis?.claimAmount}</strong></div>
                      <div>• Clock: <strong className="text-amber-400">{currentTour.preview.aiAnalysis?.limitationWindow}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Statutes Preview */}
              {currentTour.preview.type === 'statutes' && (
                <div className="space-y-3">
                  {currentTour.preview.items?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#0C101A] border border-white/[0.08] rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-[14px] text-blue-400 font-bold">{item.act}</strong>
                        <span className="font-mono text-[11px] text-[#6B7B94]">{item.citation}</span>
                      </div>
                      <p className="text-[12.5px] text-[#8D9CB0] leading-snug">{item.rule}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Document Preview */}
              {currentTour.preview.type === 'document' && (
                <div className="space-y-3 bg-[#080B12] border border-purple-500/30 rounded-xl p-5 font-mono text-[12.5px]">
                  <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold border-b border-white/[0.06] pb-2">
                    <span>{currentTour.preview.header}</span>
                    <span className="bg-purple-500/10 px-2 py-0.5 rounded text-emerald-400">✓ RPAD READY</span>
                  </div>
                  <p className="text-[#A0B0C4] leading-relaxed pt-2">
                    {currentTour.preview.body}
                  </p>
                  <div className="pt-2 text-[11px] text-[#55667E]">
                    Includes: Table of Arrears · 18% p.a. Interest Schedule · Registered Post Headers
                  </div>
                </div>
              )}

              {/* Tab 4: Advocate Preview */}
              {currentTour.preview.type === 'advocate' && (
                <div className="bg-[#0E1320] border border-emerald-500/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <Image src="/advocate-rajesh.jpg" alt="Advocate Rajesh Sharma" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-white">{currentTour.preview.name}</h4>
                      <p className="text-[12.5px] text-blue-400 font-medium">{currentTour.preview.role}</p>
                      <p className="text-[11.5px] text-[#7A8A9E]">{currentTour.preview.bar}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[12.5px]">
                    <span className="text-amber-400 font-semibold">{currentTour.preview.rating}</span>
                    <strong className="text-white font-bold">{currentTour.preview.fee}</strong>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. BENTO PLATFORM FEATURES GRID
      ══════════════════════════════════════════════ */}
      <section className="py-28 border-b border-white/[0.06] bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-purple-400 tracking-[0.1em] uppercase">
              <Layers size={14} /> Full Operational Suite
            </div>
            <h2 className="text-[36px] sm:text-[50px] font-display text-white tracking-tight leading-[1.04]">
              Everything you need to resolve legal disputes.
            </h2>
            <p className="text-[#8D9CB0] text-[18px]">
              Built for individual citizens, corporate claimants, and independent legal advocates.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_BENTO.map((feat, i) => {
              const c = colorMap[feat.color];
              const Icon = feat.icon;

              return (
                <div
                  key={i}
                  className={`bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.18] rounded-3xl p-7 flex flex-col justify-between space-y-6 transition-all group relative overflow-hidden shadow-xl ${feat.span}`}
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center`}>
                        <Icon size={22} className={c.text} />
                      </div>
                      <span className={`text-[11.5px] font-bold uppercase tracking-wider ${c.text} ${c.bg} border ${c.border} px-3 py-1 rounded-full`}>
                        {feat.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[20px] font-bold text-white mb-2">{feat.title}</h3>
                      <p className="text-[14.5px] text-[#8D9CB0] leading-relaxed">{feat.description}</p>
                    </div>
                  </div>

                  {/* Bottom Metric Bar */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-baseline justify-between relative z-10">
                    <span className="text-[12px] text-[#6B7B94] font-medium">{feat.metricLabel}</span>
                    <span className={`text-[18px] font-bold font-display ${c.text}`}>{feat.metric}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. ADVOCATE NETWORK SHOWCASE
      ══════════════════════════════════════════════ */}
      <section className="py-28 border-b border-white/[0.06] bg-[#07090D]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-emerald-400 tracking-[0.1em] uppercase">
                <ShieldCheck size={14} /> Verified Bar Council Network
              </div>
              <h2 className="text-[36px] sm:text-[50px] font-display text-white tracking-tight leading-[1.04]">
                2,400+ advocates. Every legal specialty.
              </h2>
              <p className="text-[#8D9CB0] text-[18px]">
                Transparent fixed consultation rates. Receive direct tactical counsel in secure HD video meeting rooms.
              </p>
            </div>

            <Link
              href="/advocates"
              className="btn-ghost text-[14.5px] font-semibold px-6 py-3 h-[46px] inline-flex items-center gap-2 shrink-0"
            >
              <span>Explore All Advocates</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* 3 Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ADVOCATES_SHOWCASE.map((adv, i) => (
              <div
                key={i}
                className="bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.18] rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all shadow-xl group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={adv.photo} alt={adv.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0C12]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-bold text-white">{adv.name}</h3>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full">
                          {adv.badge}
                        </span>
                      </div>
                      <p className="text-[13px] text-blue-400 font-medium mt-0.5">{adv.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-[12px] text-[#8D9CB0]">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <strong className="text-white font-semibold">{adv.rating}</strong>
                        <span>({adv.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#07090E] border border-white/[0.06] rounded-xl p-3 text-[12.5px] space-y-1">
                    <div className="text-[#8D9CB0]">Specialty: <strong className="text-white">{adv.specialty}</strong></div>
                    <div className="text-[#8D9CB0]">Courts: <span className="text-[#C5D0E0]">{adv.courts}</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#6B7B94] uppercase font-bold block">Consultation</span>
                    <span className="text-[18px] font-bold text-white font-display">{adv.fee}</span>
                  </div>
                  <Link
                    href="/advocates"
                    className="btn-primary text-[13px] font-semibold px-4 py-2 rounded-xl"
                  >
                    Book Video Session
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. REAL CASE OUTCOMES & TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="py-28 border-b border-white/[0.06] bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-[12.5px] font-bold text-cyan-400 tracking-[0.1em] uppercase">
              <TrendingUp size={14} /> Proven Case Resolution
            </div>
            <h2 className="text-[36px] sm:text-[50px] font-display text-white tracking-tight leading-[1.04]">
              Real recoveries. Real citizens.
            </h2>
            <p className="text-[#8D9CB0] text-[18px]">
              See how everyday Indians recovered withheld dues and won legitimate claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OUTCOMES.map((out, i) => {
              const c = colorMap[out.color];
              return (
                <div
                  key={i}
                  className={`bg-[#0A0C12] border ${c.border} rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-opacity-60 transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{out.icon}</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${c.text} ${c.bg} px-2.5 py-1 rounded-full border ${c.border}`}>
                        {out.category}
                      </span>
                    </div>

                    <div>
                      <div className={`text-[30px] font-bold font-display ${c.text}`}>{out.amount}</div>
                      <div className="text-[13.5px] font-semibold text-white mt-0.5">{out.title}</div>
                      <div className="text-[12px] text-[#6B7B94] mt-1 flex items-center gap-1.5">
                        <Clock size={12} /> Resolved in <strong className="text-white">{out.days}</strong>
                      </div>
                    </div>

                    <p className="text-[13.5px] text-[#9AA8BC] leading-relaxed italic">
                      &ldquo;{out.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[12.5px]">
                    <span className="font-semibold text-white">{out.user}</span>
                    <span className="text-[#6B7B94]">{out.city}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS
      ══════════════════════════════════════════════ */}
      <section className="py-28 border-b border-white/[0.06] bg-[#07090D]">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-[36px] sm:text-[48px] font-display text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[#8D9CB0] text-[17px]">
              Clear answers regarding AI legal intake, Bar Council verification, and confidentiality.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className={`bg-[#0A0C12] border rounded-2xl px-6 py-5 cursor-pointer transition-all ${
                    isOpen ? 'border-blue-500/40 bg-[#0E1320]' : 'border-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[16.5px] font-semibold text-white">{faq.q}</h3>
                    <ChevronDown
                      size={18}
                      className={`text-[#6B7B94] transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : ''}`}
                    />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-[14.5px] text-[#9AA8BC] leading-relaxed border-t border-white/[0.06] pt-4 overflow-hidden"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. CONVERSION CTA
      ══════════════════════════════════════════════ */}
      <section className="py-32 bg-[#050508] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-blue-600/[0.08] rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-[13px] text-[#8A9BAC]">
            <Sparkles size={14} className="text-amber-400" /> Start free in 60 seconds · No credit card required
          </div>

          <h2 className="text-[44px] sm:text-[64px] font-display text-white tracking-tight leading-[1.02]">
            Ready to resolve your legal dispute?
          </h2>

          <p className="text-[#9AA8BC] text-[19px] max-w-xl mx-auto leading-relaxed font-normal">
            Join thousands of Indian citizens and businesses who resolved their claims faster, smarter, and with complete statutory precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/dashboard/chat"
              className="btn-primary text-[16px] font-semibold px-9 py-4 h-[52px] inline-flex items-center gap-2 shadow-xl shadow-blue-600/30"
            >
              <span>Start Free AI Case Intake</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost text-[15.5px] px-8 py-4 h-[52px] inline-flex items-center gap-2"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
