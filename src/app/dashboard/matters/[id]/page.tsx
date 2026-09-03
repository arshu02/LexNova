'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, ArrowLeft, Clock, MapPin, Shield, FileText,
  MessageSquare, AlertCircle, CheckCircle2, Scale, Users,
  Calendar, Download, Copy, Check, Sparkles, Plus, Video,
  BookOpen, FolderLock, CheckSquare, Edit3, ChevronRight,
  ExternalLink, Printer, UserCheck, AlertTriangle, ShieldCheck,
  TrendingUp, Send, Share2, Layers, Award, Info, FileCheck,
  HelpCircle, ChevronDown, CheckCheck, Landmark, Search,
  PhoneCall, Mail, FileCode, CheckCircle
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

const SAMPLE_MATTER_DATA: Record<string, any> = {
  "MAT-1042": {
    id: "MAT-1042",
    title: "Salary Recovery & Unlawful Termination",
    category: "Labour & Employment",
    status: "ACTIVE",
    priority: "HIGH",
    urgency: "HIGH",
    complexity: "MEDIUM",
    jurisdiction: "Delhi Labour Commissioner & Industrial Tribunal",
    client: "Ragnar Lothbrok",
    opposingParty: "TechCorp Solutions Pvt. Ltd.",
    createdAt: "2026-08-10",
    aiConfidence: 94,
    limitationDeadline: "12 Sept 2026",
    daysRemaining: 18,
    totalLimitationDays: 1095, // 3 years
    claimPrincipal: 95000,
    claimLeaveEncashment: 22000,
    claimTotal: 117000,
    statutoryInterest: "18% p.a. under Sec 15(3)",
    assignedLawyer: {
      id: "adv_2",
      name: "Advocate Rajesh Sharma",
      specialization: "Employment & Labour Counsel",
      rating: 4.9,
      experience: 18,
      barNumber: "MAH/8832/2012",
      consultationFee: 1499,
      email: "rajesh.sharma@lexnova.in",
      phone: "+91 98201 44521",
      photo: "/advocate-rajesh.jpg",
      courts: ["Delhi High Court", "Central Industrial Tribunal", "Supreme Court of India"],
    },
    overview: "Dispute concerning non-payment of earned wages totaling ₹95,000 for the months of May and June 2025 following formal resignation. Company unlawfully withheld experience certificate and statutory full & final settlement in violation of the Payment of Wages Act, 1936.",
    analysis: {
      whatHappened: "The employee tendered formal 30-day resignation on April 30, 2025. Diligently served the full notice period until May 31, 2025. Company withheld salary for May and June without stating reasons, citing arbitrary performance deductions not mentioned in contract.",
      caseClassification: "Civil & Industrial Dispute under Section 15 of Payment of Wages Act & Section 33C(2) of Industrial Disputes Act.",
      strengthRating: "Very Strong",
      caseStrengthPercent: 92,
      keyFacts: [
        { label: "Employment Contract", desc: "Formal employment contract executed on Jan 15, 2023 with strict 30-day notice period clause.", verified: true },
        { label: "Resignation Acceptance", desc: "Resignation accepted in writing by HR Operations on May 02, 2025 via official email.", verified: true },
        { label: "Dues Quantification", desc: "Gross unpaid salary of ₹95,000 + ₹22,000 accrued leave encashment = ₹1,17,000 total claim.", verified: true },
        { label: "Prior Demand Escalation", desc: "Three formal email reminders sent to payroll department without resolution or written denial.", verified: true },
      ],
      missingInfo: [
        "Certified bank statement showing salary credits for Jan–April 2025 to prove average wage rate.",
        "Copy of company exit interview clearance form sign-off (if issued).",
      ],
      potentialGrounds: "Violation of Section 15 of Payment of Wages Act, 1936 (illegal wage deductions), Breach of Contract under Section 73 Indian Contract Act, 1872, and withholding statutory service certificates.",
      caveat: "This AI-generated analysis is for legal intake and preparation. Formal statutory claim petitions must be signed by an advocate on record.",
    },
    research: [
      {
        statute: "Payment of Wages Act, 1936 · Section 15",
        subtitle: "Claims arising out of deductions from wages or delay in payment of wages",
        description: "Authorizes employee to file claim before the Authority for delayed wages with statutory compensation up to 10x the withheld amount.",
        citation: "1936 ACT IV § 15",
        authority: "Supreme Court of India · State of Punjab v. Labour Court (1980)",
        relevance: "Direct Cause of Action",
        impact: "HIGH",
      },
      {
        statute: "Industrial Disputes Act, 1947 · Section 33C(2)",
        subtitle: "Recovery of money due from an employer",
        description: "Enables workman to receive from employer any benefit or money compute in terms of money, enforceable via Labour Court execution.",
        citation: "1947 ACT XIV § 33C(2)",
        authority: "Supreme Court of India · Central Bank of India v. P.S. Rajagopalan (1964)",
        relevance: "Recovery Mechanism",
        impact: "HIGH",
      },
      {
        statute: "Limitation Act, 1963 · Article 7",
        subtitle: "Period of limitation for wages",
        description: "Limitation period for recovery of wages is 3 years from the date wages accrue and become due.",
        citation: "1963 ACT XXXVI Art. 7",
        authority: "Delhi High Court · Ram Kishan v. Union of India (2019)",
        relevance: "Limitation Defense",
        impact: "CRITICAL",
      }
    ],
    documents: [
      { id: "doc_1", title: "Legal Notice — Demand for Unpaid Wages (RPAD)", type: "LEGAL_NOTICE", status: "READY", date: "2026-08-12", pages: 3, format: "PDF / DOCX", snippet: "DEMAND FOR PAYMENT OF OUTSTANDING WAGES OF ₹1,17,000 UNDER PAYMENT OF WAGES ACT, 1936..." },
      { id: "doc_2", title: "Section 15 Claim Application Draft before Authority", type: "TRIBUNAL_PETITION", status: "IN_REVIEW", date: "2026-08-15", pages: 6, format: "PDF", snippet: "IN THE COURT OF THE AUTHORITY UNDER THE PAYMENT OF WAGES ACT, DELHI... IN THE MATTER OF..." },
      { id: "doc_3", title: "Employment Agreement & Offer Letter (15 Jan 2023)", type: "CONTRACT", status: "UPLOADED", date: "2026-08-10", pages: 8, format: "PDF", snippet: "Employment agreement stipulating monthly gross remuneration of ₹47,500 and 30-day notice clause." }
    ],
    evidence: [
      { id: "ev_1", title: "Resignation Acceptance Email from HR", exhibit: "P-1", date: "02 May 2025", type: "EMAIL_RECORD", status: "VERIFIED", hash: "sha256:8f4c...91b2", size: "245 KB" },
      { id: "ev_2", title: "Salary Slips (Jan, Feb, Mar, Apr 2025)", exhibit: "P-2", date: "30 Apr 2025", type: "FINANCIAL_PDF", status: "VERIFIED", hash: "sha256:3a1e...47c8", size: "1.2 MB" },
      { id: "ev_3", title: "WhatsApp Communication with Operations Lead", exhibit: "P-3", date: "15 June 2025", type: "CHAT_EXPORT", status: "ADMITTED", hash: "sha256:7b9d...22f0", size: "840 KB" },
      { id: "ev_4", title: "Notice Period Handover Sign-off Confirmation", exhibit: "P-4", date: "31 May 2025", type: "INTERNAL_DOC", status: "VERIFIED", hash: "sha256:1e0f...65d9", size: "410 KB" },
    ],
    actionPlan: [
      { id: "ap_1", text: "Compile bank statement verifying non-credit of May & June wages", done: true, priority: "URGENT", responsible: "Client" },
      { id: "ap_2", text: "Serve 15-day statutory RPAD Legal Notice to Company Directors", done: true, priority: "HIGH", responsible: "Advocate" },
      { id: "ap_3", text: "Schedule 30-min strategy consultation with Advocate Rajesh Sharma", done: true, priority: "MEDIUM", responsible: "Both" },
      { id: "ap_4", text: "File Section 15 Application before Labour Commissioner if unpaid by Sept 12", done: false, priority: "CRITICAL", responsible: "Advocate" },
      { id: "ap_5", text: "Lodge formal grievance on Ministry of Labour SAMADHAN Portal", done: false, priority: "MEDIUM", responsible: "Client" }
    ],
    timeline: [
      { id: "t1", title: "Case Intake Registered", desc: "AI Case Understanding Engine extracted factual pleading summary and dispute taxonomy.", date: "10 Aug 2026", status: "COMPLETED" },
      { id: "t2", title: "Statutory Limitation Clock Activated", desc: "Calculated statutory deadline under Limitation Act Article 7 (18 days remaining to serve notice).", date: "10 Aug 2026", status: "COMPLETED" },
      { id: "t3", title: "Assigned Advocate Rajesh Sharma", desc: "Employment law counsel matched with 96% compatibility and Bar Council MAH/8832/2012.", date: "11 Aug 2026", status: "COMPLETED" },
      { id: "t4", title: "RPAD Legal Notice Draft Generated", desc: "Demand notice citing Section 15 & Section 33C(2) generated in Document Studio.", date: "12 Aug 2026", status: "COMPLETED" },
      { id: "t5", title: "Strategy Video Consultation Completed", desc: "Advocate reviewed contractual notice period clause and approved RPAD dispatch.", date: "14 Aug 2026", status: "COMPLETED" },
      { id: "t6", title: "Limitation Window Deadline", desc: "Final date to file Section 15 recovery petition if no settlement reached.", date: "12 Sept 2026", status: "PENDING" }
    ],
    consultation: {
      code: "LN-2026-8471",
      date: "24 Aug 2026",
      time: "04:30 PM IST",
      meetLink: "https://meet.jit.si/LexNova-MAT-1042-Consult",
      status: "CONFIRMED",
      notes: "Advocate Rajesh Sharma advised proceeding with Section 15 petition before Authority if no written response or settlement received within 15 days of notice receipt.",
      agenda: [
        "Review of Resignation Acceptance Email (Exhibit P-1)",
        "Calculation of 18% statutory interest on ₹1,17,000 claim",
        "Final approval of Section 15 Petition draft before Labour Court",
      ]
    }
  }
};

const TABS = [
  { id: "overview", label: "Overview", icon: Briefcase, count: null },
  { id: "analysis", label: "AI Case Analysis", icon: Sparkles, count: "94%" },
  { id: "research", label: "Legal Research", icon: BookOpen, count: "3 Acts" },
  { id: "documents", label: "Documents", icon: FileText, count: "3 Drafts" },
  { id: "evidence", label: "Evidence Locker", icon: FolderLock, count: "4 Exhibits" },
  { id: "action_plan", label: "Action Roadmap", icon: CheckSquare, count: "3/5" },
  { id: "timeline", label: "Case Timeline", icon: Clock, count: "6 Events" },
  { id: "consultation", label: "Consultation Room", icon: Video, count: "Live" },
];

export default function MatterWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "MAT-1042";
  const [activeTab, setActiveTab] = useState("overview");
  const [matter, setMatter] = useState<any>(SAMPLE_MATTER_DATA[rawId] || SAMPLE_MATTER_DATA["MAT-1042"]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [actionItems, setActionItems] = useState(matter.actionPlan || []);
  const [copiedLink, setCopiedLink] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChatLog, setAiChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello Ragnar! I've fully indexed matter **${matter.id}** (${matter.title}). I can analyze clauses, calculate statutory damages, or draft follow-up notices. How can I assist?`
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const toggleActionItem = (id: string) => {
    setActionItems((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const copyMeetLink = () => {
    if (matter.consultation?.meetLink) {
      navigator.clipboard.writeText(matter.consultation.meetLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendAiQuestion = (customText?: string) => {
    const q = customText || aiQuestion;
    if (!q.trim()) return;

    setAiChatLog(prev => [...prev, { role: 'user', text: q }]);
    setAiQuestion("");
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("interest") || q.toLowerCase().includes("calculate")) {
        reply = `Under **Section 15(3) of the Payment of Wages Act, 1936**, delayed wage compensation can be awarded up to 10 times the amount deducted. For your principal claim of **₹95,000 + ₹22,000**, statutory commercial interest typically runs at **18% per annum**, accruing approximately **₹1,755/month** in delayed damages.`;
      } else if (q.toLowerCase().includes("risk") || q.toLowerCase().includes("exit")) {
        reply = `**Low Risk:** The written Resignation Acceptance email from HR (Exhibit P-1) already proves the employer acknowledged your full 30-day notice. Even without a formal exit interview sign-off, withholding salary violates **Section 15**, as exit clearances cannot override earned wages under Indian labor jurisprudence.`;
      } else {
        reply = `Based on the facts of **Matter ${matter.id}**, Advocate Rajesh Sharma should issue the formal 15-day statutory RPAD notice immediately. If TechCorp does not disburse the ₹1,17,000 within 15 days, you have direct standing to file a petition before the Delhi Labour Authority under Section 15.`;
      }
      setAiChatLog(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsAiThinking(false);
    }, 900);
  };

  const completedActionsCount = actionItems.filter((a: any) => a.done).length;
  const progressPercent = Math.round((completedActionsCount / actionItems.length) * 100);

  return (
    <div className="animate-fade-up max-w-[1300px] mx-auto flex flex-col gap-6 font-sans pb-16">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BREADCRUMBS & BILLION-DOLLAR QUICK CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1E2638]">
        
        {/* Left Breadcrumb Trail */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push("/dashboard/matters")}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#8C9BB4] hover:text-white bg-[#0F1420] border border-[#1F293D] hover:border-[#3B82F6]/50 px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Matters Hub
          </button>
          
          <span className="text-[#3D4C66]">/</span>
          
          <div className="flex items-center gap-2 bg-[#0B0F19] border border-[#1F293D] px-3 py-1 rounded-lg">
            <Briefcase size={14} className="text-blue-400" />
            <span className="font-mono text-[13px] font-bold text-white tracking-wide">
              {matter.id}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {matter.status} MATTER
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400">
            ⚡ {matter.priority} PRIORITY
          </span>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="flex items-center gap-2 text-[13px] font-semibold text-blue-300 hover:text-white bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/60 px-4 py-2 rounded-xl transition-all shadow-sm shadow-blue-500/10"
          >
            <Sparkles size={15} className="text-blue-400 animate-pulse" />
            <span>Ask Matter AI</span>
          </button>

          <Link
            href="/dashboard/documents"
            className="flex items-center gap-2 text-[13px] font-semibold text-[#CBD5E1] hover:text-white bg-[#0F1420] hover:bg-[#151C2C] border border-[#1F293D] px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Printer size={14} className="text-slate-400" />
            <span className="hidden sm:inline">Export Dossier</span>
          </Link>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="btn-primary text-[13px] font-semibold px-4 py-2 h-[38px] rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25"
          >
            <Video size={14} />
            <span>Consultation Room</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. BILLION-DOLLAR MATTER INTELLIGENCE HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0F1422] via-[#0B0F19] to-[#080B12] border border-[#222C42] shadow-2xl p-6 sm:p-8">
        
        {/* Ambient radial glow highlights */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-600/[0.07] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-emerald-600/[0.04] rounded-full blur-[90px] pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[12px] font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md">
                {matter.category}
              </span>
              <span className="text-[13px] text-[#7A8A9E] flex items-center gap-1.5">
                <Landmark size={13} className="text-[#4E5D78]" />
                Jurisdiction: <span className="text-[#C5D0E0] font-medium">{matter.jurisdiction}</span>
              </span>
            </div>

            <h1 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.15]">
              {matter.title}
            </h1>
            
            <p className="text-[14.5px] text-[#9AA8BC] leading-relaxed max-w-2xl">
              {matter.overview}
            </p>
          </div>

          {/* Limitation Countdown Box */}
          <div className="bg-[#121828]/90 border border-amber-500/30 rounded-2xl p-5 w-full lg:w-[320px] shrink-0 shadow-lg shadow-amber-500/5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> Statutory Limitation
              </span>
              <span className="font-mono text-white bg-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                Art. 7
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-[32px] font-bold font-display text-white tracking-tight">
                {matter.daysRemaining}
              </span>
              <span className="text-[15px] font-semibold text-amber-400">
                Days Remaining
              </span>
            </div>

            {/* Progress Segment */}
            <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden mt-1 mb-2.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(matter.daysRemaining / 90) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11.5px] text-[#7A8A9E]">
              <span>Deadline: <strong className="text-[#E2E8F0]">{matter.limitationDeadline}</strong></span>
              <span className="text-emerald-400 font-medium">Notice Ready</span>
            </div>
          </div>
        </div>

        {/* 4 Core Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1C2538] relative z-10">
          
          {/* Card 1: Client & Counterparty */}
          <div className="bg-[#0C101A] border border-[#1E273B] hover:border-[#2F3E5E] rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6B7B94] mb-2 flex items-center gap-1.5">
              <Users size={13} className="text-blue-400" /> Litigant Parties
            </div>
            <div className="space-y-1">
              <div className="text-[13.5px] text-[#9AA8BC] flex items-center justify-between">
                <span>Client:</span>
                <strong className="text-white font-semibold">{matter.client}</strong>
              </div>
              <div className="text-[13.5px] text-[#9AA8BC] flex items-center justify-between">
                <span>Opposing:</span>
                <strong className="text-white font-semibold truncate max-w-[140px]" title={matter.opposingParty}>{matter.opposingParty}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Claim Value */}
          <div className="bg-[#0C101A] border border-[#1E273B] hover:border-[#2F3E5E] rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6B7B94] mb-2 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-emerald-400" /> Total Claim Value
            </div>
            <div className="text-[20px] font-bold text-emerald-400 tracking-tight font-display">
              ₹{matter.claimTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#7A8A9E] mt-0.5">
              ₹95K Principal + ₹22K Leave Encashment
            </div>
          </div>

          {/* Card 3: AI Legal Engine Confidence */}
          <div className="bg-[#0C101A] border border-[#1E273B] hover:border-[#2F3E5E] rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#6B7B94] mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-400" /> AI Case Strength
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] font-bold text-white font-display">
                {matter.aiConfidence}%
              </span>
              <span className="text-[11.5px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full">
                Very Strong Merit
              </span>
            </div>
            <div className="text-[11px] text-[#7A8A9E] mt-0.5">
              Mapped to 50K+ SC Precedents
            </div>
          </div>

          {/* Card 4: Assigned Verified Advocate */}
          <div className="bg-[#0C101A] border border-[#1E273B] hover:border-[#2F3E5E] rounded-xl p-4 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <Image src={matter.assignedLawyer.photo} alt={matter.assignedLawyer.name} fill sizes="40px" className="object-cover" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0C101A]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold text-white truncate">
                  {matter.assignedLawyer.name}
                </div>
                <div className="text-[11px] text-[#7A8A9E] truncate">
                  ★ 4.9 · {matter.assignedLawyer.experience} yrs exp
                </div>
              </div>
            </div>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="text-[11.5px] font-bold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600/30 border border-blue-500/20 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
            >
              Consult
            </button>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SLEEK SEGMENTED TAB NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1A2234] no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all whitespace-nowrap relative ${
                isActive
                  ? "bg-[#161F32] text-white border border-[#2D3F63] shadow-md shadow-blue-500/5"
                  : "text-[#8292AA] hover:text-white hover:bg-[#0E1320] border border-transparent"
              }`}
            >
              <Icon size={15} className={isActive ? "text-blue-400" : "text-[#55657E]"} />
              <span>{tab.label}</span>
              {tab.count && (
                <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-[#141B2B] text-[#74849E]"
                }`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[5px] left-3 right-3 h-[2px] bg-blue-500 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT WORKSPACES
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0B0F19] border border-[#1C2538] rounded-2xl p-6 sm:p-8 min-h-[500px] shadow-xl">
        
        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Action Prompt Banner */}
            <div className="bg-gradient-to-r from-[#141C2E] to-[#0E1524] border border-blue-500/25 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-blue-950/20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold uppercase tracking-wider text-amber-400">Immediate Action Required</div>
                  <h4 className="text-[16px] font-bold text-white">Serve 15-Day Registered AD Legal Notice</h4>
                  <p className="text-[13px] text-[#9AA8BC]">Statutory prerequisite before lodging claim petition with the Delhi Labour Commissioner.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/dashboard/documents"
                  className="btn-primary text-[13px] font-semibold px-4 py-2 h-[38px] rounded-xl flex items-center gap-2"
                >
                  <FileText size={14} /> Review Notice Draft →
                </Link>
              </div>
            </div>

            {/* 2-Column Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Fact Matrix & Statutory Grounds (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A2234] pb-3">
                    <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-400" /> Executive Fact Matrix
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      AI Verified
                    </span>
                  </div>

                  <p className="text-[14px] text-[#CBD5E1] leading-relaxed">
                    {matter.analysis.whatHappened}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {matter.analysis.keyFacts.map((f: any, idx: number) => (
                      <div key={idx} className="bg-[#090D15] border border-[#1A2234] rounded-xl p-3.5 flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[13.5px] font-semibold text-white block">{f.label}</strong>
                          <span className="text-[13px] text-[#8D9CB0] leading-normal">{f.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidentiary Gaps Checklist */}
                <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-3">
                  <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-400" /> Evidentiary Gaps to Close
                  </h3>
                  <p className="text-[13px] text-[#8D9CB0]">Upload these documents to strengthen court petition filing admissibility:</p>
                  
                  <div className="space-y-2 pt-1">
                    {matter.analysis.missingInfo.map((item: string, idx: number) => (
                      <div key={idx} className="bg-[#141824] border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                        <span className="text-[13px] text-[#D1D9E6]">{item}</span>
                        <Link href="/dashboard/documents" className="text-[11.5px] font-bold text-blue-400 hover:text-white bg-blue-500/10 px-2.5 py-1 rounded-lg shrink-0">
                          + Upload
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Claim Breakdown & Assigned Advocate (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Financial Damages Valuation Box */}
                <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-4">
                  <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                    <Scale size={16} className="text-emerald-400" /> Damage Valuation Matrix
                  </h3>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
                      <span className="text-[13.5px] text-[#9AA8BC]">May & June Gross Salary</span>
                      <strong className="text-[15px] font-bold text-white">₹{matter.claimPrincipal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
                      <span className="text-[13.5px] text-[#9AA8BC]">Accrued Leave Encashment</span>
                      <strong className="text-[15px] font-bold text-white">₹{matter.claimLeaveEncashment.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A2234]">
                      <span className="text-[13.5px] text-[#9AA8BC]">Statutory Interest</span>
                      <span className="text-[12.5px] font-semibold text-emerald-400">{matter.statutoryInterest}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[14px] font-bold text-white uppercase tracking-wider">Total Claim Demand</span>
                      <strong className="text-[22px] font-bold text-emerald-400 font-display">₹{matter.claimTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Advocate Dossier Card */}
                <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#6B7B94]">Counsel on Record</span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                      ✓ Bar Council Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={matter.assignedLawyer.photo} alt={matter.assignedLawyer.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-white">{matter.assignedLawyer.name}</h4>
                      <p className="text-[12.5px] text-blue-400 font-medium">{matter.assignedLawyer.specialization}</p>
                      <p className="text-[11.5px] text-[#7A8A9E]">Bar Enrollment: {matter.assignedLawyer.barNumber}</p>
                    </div>
                  </div>

                  <div className="text-[12.5px] text-[#8D9CB0] space-y-1 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-[#4E5D78]" /> {matter.assignedLawyer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall size={13} className="text-[#4E5D78]" /> {matter.assignedLawyer.phone}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="btn-primary w-full text-[13px] font-semibold py-2.5 rounded-xl justify-center"
                    >
                      Schedule Video Meeting (₹{matter.assignedLawyer.consultationFee})
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ── TAB 2: AI CASE ANALYSIS ──────────────────────────────── */}
        {activeTab === "analysis" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Caution Banner */}
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-3.5">
              <ShieldCheck size={20} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14.5px] font-bold text-white">AI Case Understanding Dossier</h4>
                <p className="text-[13px] text-[#CBD5E1] mt-0.5">{matter.analysis.caveat}</p>
              </div>
            </div>

            {/* Classification & Grounds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-3">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-purple-400 block">Case Classification</span>
                <p className="text-[14.5px] text-white leading-relaxed font-medium">
                  {matter.analysis.caseClassification}
                </p>
              </div>

              <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-3">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-400 block">Statutory Grounds of Action</span>
                <p className="text-[14px] text-[#CBD5E1] leading-relaxed">
                  {matter.analysis.potentialGrounds}
                </p>
              </div>
            </div>

            {/* Facts Matrix Full */}
            <div className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-6 space-y-4">
              <h3 className="text-[16px] font-bold text-white">Substantiated Pleadings & Evidence Alignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matter.analysis.keyFacts.map((fact: any, idx: number) => (
                  <div key={idx} className="bg-[#080B12] border border-[#1A2234] rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-[14px] text-blue-400">{fact.label}</strong>
                      <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Admissible</span>
                    </div>
                    <p className="text-[13px] text-[#8D9CB0] leading-relaxed">{fact.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: LEGAL RESEARCH & PRECEDENTS ───────────────────── */}
        {activeTab === "research" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A2234] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-white">Binding Statutory Provisions & Case Law Precedents</h3>
                <p className="text-[13px] text-[#7A8A9E] mt-0.5">Indexed against 50,000+ Indian High Court and Supreme Court judgments.</p>
              </div>
              <span className="text-[12px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                3 Governing Statutes Mapped
              </span>
            </div>

            <div className="space-y-4">
              {matter.research.map((res: any, idx: number) => (
                <div key={idx} className="bg-[#0E1320] border border-[#1F293D] hover:border-[#2F3E5E] rounded-2xl p-6 space-y-3 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-[16.5px] font-bold text-blue-400">{res.statute}</h4>
                      <p className="text-[13px] text-[#9AA8BC]">{res.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] text-[#8292AA] bg-[#090D15] px-2.5 py-1 rounded border border-[#1A2234]">
                        {res.citation}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/25">
                        {res.impact}
                      </span>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#CBD5E1] leading-relaxed">
                    {res.description}
                  </p>

                  <div className="pt-3 border-t border-[#1A2234] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12.5px]">
                    <div className="text-[#8D9CB0]">
                      Binding Judicial Authority: <strong className="text-white font-semibold">{res.authority}</strong>
                    </div>
                    <span className="text-blue-400 font-medium">{res.relevance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: DOCUMENTS STUDIO IN-MATTER ────────────────────── */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A2234] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-white">Matter Pleadings & Legal Drafts</h3>
                <p className="text-[13px] text-[#7A8A9E] mt-0.5">Court-formatted statutory documents generated for this case.</p>
              </div>
              <Link href="/dashboard/documents" className="btn-primary text-[13px] font-semibold px-4 py-2 rounded-xl">
                Open in Document Studio →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matter.documents.map((doc: any) => (
                <div key={doc.id} className="bg-[#0E1320] border border-[#1F293D] hover:border-[#2F3E5E] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <FileText size={17} className="text-blue-400 shrink-0" />
                      <h4 className="text-[15.5px] font-bold text-white truncate">{doc.title}</h4>
                      <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        doc.status === 'READY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        doc.status === 'IN_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#8D9CB0] line-clamp-1 italic">{doc.snippet}</p>
                    <div className="text-[11.5px] text-[#5D6D84] flex items-center gap-3">
                      <span>Format: {doc.format}</span>
                      <span>•</span>
                      <span>Pages: {doc.pages}</span>
                      <span>•</span>
                      <span>Generated: {doc.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/dashboard/documents"
                      className="text-[13px] font-semibold text-[#CBD5E1] hover:text-white bg-[#141B2B] hover:bg-[#1A2338] border border-[#222E46] px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Edit Draft
                    </Link>
                    <Link
                      href="/dashboard/documents"
                      className="btn-primary text-[13px] font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Download size={13} /> PDF
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: EVIDENCE LOCKER ───────────────────────────────── */}
        {activeTab === "evidence" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A2234] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-white">Admitted Exhibits & Chain-of-Custody Vault</h3>
                <p className="text-[13px] text-[#7A8A9E] mt-0.5">Encrypted evidentiary documents with SHA-256 integrity hashes.</p>
              </div>
              <Link href="/dashboard/documents" className="btn-ghost text-[13px] font-semibold px-4 py-2 rounded-xl">
                + Add Exhibit
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matter.evidence.map((ev: any) => (
                <div key={ev.id} className="bg-[#0E1320] border border-[#1F293D] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-md">
                      Exhibit {ev.exhibit}
                    </span>
                    <span className="text-[11.5px] font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={13} /> {ev.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[15px] font-bold text-white">{ev.title}</h4>
                    <p className="text-[12px] text-[#7A8A9E] mt-0.5">{ev.type} · Tagged {ev.date} · {ev.size}</p>
                  </div>

                  <div className="pt-2 border-t border-[#1A2234] flex items-center justify-between text-[11px] text-[#55667E] font-mono">
                    <span>{ev.hash}</span>
                    <span className="text-blue-400 hover:underline cursor-pointer">Preview</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: PROCEDURAL ROADMAP ────────────────────────────── */}
        {activeTab === "action_plan" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2234] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-white">Procedural Action Roadmap</h3>
                <p className="text-[13px] text-[#7A8A9E] mt-0.5">Sequential milestones to ensure optimal legal outcome before statutory expiration.</p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-3 bg-[#0E1320] border border-[#1F293D] px-4 py-2 rounded-xl">
                <span className="text-[13px] font-semibold text-white">{progressPercent}% Completed</span>
                <div className="w-24 bg-[#1C2538] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {actionItems.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => toggleActionItem(item.id)}
                  className={`border rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    item.done
                      ? "bg-emerald-500/[0.04] border-emerald-500/25 hover:border-emerald-500/40"
                      : "bg-[#0E1320] border-[#1F293D] hover:border-[#2E3C57]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      item.done
                        ? "bg-emerald-500 border-emerald-400 text-black"
                        : "bg-[#141B2B] border-[#2C3B56] text-transparent"
                    }`}>
                      <Check size={14} className="font-bold stroke-[3]" />
                    </div>
                    <div>
                      <span className={`text-[14.5px] font-medium block leading-normal ${
                        item.done ? "text-[#8D9CB0] line-through" : "text-white"
                      }`}>
                        {item.text}
                      </span>
                      <span className="text-[11.5px] text-[#55667E]">
                        Responsible: <strong className="text-[#9AA8BC]">{item.responsible}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${
                    item.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                    item.priority === 'URGENT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                    item.priority === 'HIGH' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/25'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 7: CASE TIMELINE ─────────────────────────────────── */}
        {activeTab === "timeline" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#1A2234] pb-4">
              <h3 className="text-[18px] font-bold text-white">Chronological Case Docket History</h3>
              <p className="text-[13px] text-[#7A8A9E] mt-0.5">Immutable event record of legal actions, drafts, and consultations.</p>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1A2438]">
              {matter.timeline.map((event: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                    event.status === 'COMPLETED'
                      ? 'bg-blue-500 border-black shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : 'bg-[#1C2538] border-black'
                  }`} />
                  
                  <div className="bg-[#0E1320] border border-[#1F293D] rounded-xl p-4.5 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-[15px] font-bold text-white">{event.title}</h4>
                      <span className="font-mono text-[11.5px] text-[#8292AA] bg-[#080B12] px-2 py-0.5 rounded border border-[#1A2234]">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-[13.5px] text-[#9AA8BC] leading-relaxed">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 8: LIVE CONSULTATION ROOM ────────────────────────── */}
        {activeTab === "consultation" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-[#121A2D] via-[#0D1322] to-[#090D18] border border-blue-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E2940] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Video size={24} />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider">● Secure HD Meeting Room Ready</div>
                    <h3 className="text-[20px] font-bold text-white">Consultation with {matter.assignedLawyer.name}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[15px] font-bold text-white">{matter.consultation.date}</div>
                  <div className="text-[13px] text-blue-400">{matter.consultation.time}</div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#7A8A9E]">Session Brief & Strategy Notes</h4>
                  <p className="text-[14px] text-[#CBD5E1] leading-relaxed bg-[#080C14] border border-[#1A2336] p-4 rounded-xl">
                    {matter.consultation.notes}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#7A8A9E]">Meeting Agenda</h4>
                  <ul className="space-y-2 bg-[#080C14] border border-[#1A2336] p-4 rounded-xl">
                    {matter.consultation.agenda.map((ag: string, idx: number) => (
                      <li key={idx} className="text-[13px] text-[#CBD5E1] flex items-start gap-2">
                        <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Trigger Row */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href={matter.consultation.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-[14.5px] font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Video size={16} /> Enter HD Video Meeting →
                </a>

                <button
                  onClick={copyMeetLink}
                  className="flex items-center gap-2 text-[13.5px] font-semibold text-[#CBD5E1] hover:text-white bg-[#141B2B] hover:bg-[#1C253B] border border-[#232F48] px-4 py-3 rounded-xl transition-all"
                >
                  {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  <span>{copiedLink ? "Meeting URL Copied!" : "Copy Room Link"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. AI MATTER ASSISTANT DRAWER / MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {aiDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-[#0B0F19] border-l border-[#222E46] z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#1C2538] flex items-center justify-between bg-[#080B12]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white">Matter AI Intelligence</h3>
                    <p className="text-[11px] text-[#7A8A9E]">Live Context: {matter.id} · {matter.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="text-[#8D9CB0] hover:text-white p-1 rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {aiChatLog.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-4 rounded-2xl max-w-[90%] text-[13.5px] leading-relaxed ${
                      chat.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-[#121828] border border-[#202C44] text-[#CBD5E1] rounded-bl-sm space-y-2'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: chat.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-[12.5px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl w-fit">
                    <Sparkles size={13} className="animate-spin" /> Cross-referencing case facts with Indian law...
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-5 py-2.5 border-t border-[#172032] bg-[#080C14] flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  "Calculate statutory interest under §15",
                  "What are risks of no exit clearance?",
                  "Generate WhatsApp reminder to HR"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAiQuestion(prompt)}
                    className="text-[11.5px] font-medium text-[#8D9CB0] hover:text-white bg-[#101624] hover:bg-[#182236] border border-[#1E2A40] px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-4 border-t border-[#1C2538] bg-[#090D16]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiQuestion();
                  }}
                  className="flex items-center gap-2 bg-[#121828] border border-[#222E46] rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors"
                >
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask about this matter's statutes, risks, or drafts..."
                    className="bg-transparent text-[13px] text-white placeholder-[#55667E] outline-none flex-1"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shrink-0"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          6. BOOKING CONSULTATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {bookingModalOpen && (
        <BookingModal
          advocate={matter.assignedLawyer}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}

    </div>
  );
}
