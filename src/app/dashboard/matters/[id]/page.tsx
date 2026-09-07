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
      {
        id: "doc_101",
        title: "Statutory Demand Notice under Payment of Wages Act §15",
        type: "LEGAL_NOTICE",
        format: "PDF & DOCX",
        status: "READY",
        pages: 3,
        date: "Today, 02:40 PM",
        snippet: "To: The Board of Directors, TechCorp Solutions Pvt. Ltd... Demand for disbursement of ₹1,17,000 along with 18% statutory interest within 15 calendar days...",
      },
      {
        id: "doc_102",
        title: "Section 33C(2) Claim Petition Format",
        type: "COURT_PETITION",
        format: "Court Ready",
        status: "IN_REVIEW",
        pages: 7,
        date: "Yesterday",
        snippet: "BEFORE THE PRESIDING OFFICER, LABOUR COURT, DELHI... In the matter of Ragnar Lothbrok vs. TechCorp Solutions... Claim for computation of unpaid money dues...",
      }
    ],
    evidence: [
      { id: "ev_1", exhibit: "P-1", title: "Resignation Acceptance Email", type: "PDF Email Record", date: "02 May 2025", size: "412 KB", status: "ADMISSIBLE", hash: "sha256-e8b9104c" },
      { id: "ev_2", exhibit: "P-2", title: "Employment Offer & Appointment Letter", type: "Original Contract", date: "15 Jan 2023", size: "1.8 MB", status: "AUTHENTICATED", hash: "sha256-49a023b1" },
      { id: "ev_3", exhibit: "P-3", title: "HDFC Bank Statement (Jan–Apr 2025)", type: "Certified Bank Statement", date: "12 Aug 2026", size: "890 KB", status: "ATTACHED", hash: "sha256-91e840d2" },
    ],
    actionPlan: [
      { id: "act_1", text: "Dispatch 15-day statutory RPAD notice to TechCorp Registered Office", done: true, priority: "CRITICAL", responsible: "Advocate Rajesh Sharma" },
      { id: "act_2", text: "Obtain India Post tracking acknowledgement receipt with seal", done: false, priority: "HIGH", responsible: "Client (Ragnar)" },
      { id: "act_3", text: "Review 15-day rejoinder or non-compliance from employer", done: false, priority: "HIGH", responsible: "LexNova AI & Advocate" },
      { id: "act_4", text: "Lodge Form 'A' Petition before Delhi Labour Authority", done: false, priority: "MEDIUM", responsible: "Advocate Rajesh Sharma" },
    ],
    timeline: [
      { date: "10 Aug 2026", title: "Matter Initialized & AI Intake Verified", desc: "Client submitted fact summary, appointment letter, and unpaid wage claim details.", status: "COMPLETED" },
      { date: "12 Aug 2026", title: "Statute Mapping & Precedent Analysis", desc: "AI engine cross-referenced Section 15 of Payment of Wages Act and 3 relevant Supreme Court citations.", status: "COMPLETED" },
      { date: "14 Aug 2026", title: "Advocate Rajesh Sharma Assigned", desc: "Senior employment counsel accepted docket on verified roster.", status: "COMPLETED" },
      { date: "Today", title: "Statutory RPAD Legal Notice Generated", desc: "Formal notice drafted with 15-day compliance deadline and 18% statutory interest demand.", status: "CURRENT" },
      { date: "24 Aug 2026", title: "Upcoming Video Strategy Session", desc: "60-minute video conference scheduled with Advocate Rajesh Sharma.", status: "UPCOMING" },
    ],
    consultation: {
      date: "Today, 04:30 PM",
      time: "60 mins",
      meetLink: "https://meet.jit.si/LexNova-MAT-1042-Consult",
      agenda: [
        "Review evidence admissibility for Notice period service",
        "Sign-off on Statutory Legal Notice draft",
        "Establish settlement threshold vs Labour Court petition"
      ],
      notes: "Advocate has reviewed the notice period clause. Recommended sending legal notice directly to Managing Director & Head of HR via RPAD to avoid delay."
    }
  }
};

const TABS = [
  { id: "overview", label: "Strategy & Facts", icon: Briefcase },
  { id: "analysis", label: "AI Merits Dossier", icon: Sparkles },
  { id: "research", label: "Statutes & Citations", icon: BookOpen, count: 3 },
  { id: "documents", label: "Pleadings Studio", icon: FileText, count: 2 },
  { id: "evidence", label: "Evidence Locker", icon: FolderLock, count: 3 },
  { id: "action_plan", label: "Action Roadmap", icon: CheckSquare },
  { id: "timeline", label: "Docket Timeline", icon: Clock },
  { id: "consultation", label: "Video Room", icon: Video },
];

export default function MatterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "MAT-1042";

  const [matter, setMatter] = useState(SAMPLE_MATTER_DATA[id] || SAMPLE_MATTER_DATA["MAT-1042"]);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiChatLog, setAiChatLog] = useState([
    {
      role: 'assistant',
      text: `Hello Ragnar. I am your **Matter Intelligence Agent** for **${matter.id}**. I have synthesized your employment agreement, resignation acceptance, and statutory wage calculation under the **Payment of Wages Act, 1936**. How can I assist you with your case today?`
    }
  ]);

  const [actionItems, setActionItems] = useState(matter.actionPlan);

  const toggleActionItem = (itemId: string) => {
    setActionItems((prev: any) =>
      prev.map((item: any) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    );
  };

  const copyMeetLink = () => {
    navigator.clipboard.writeText(matter.consultation.meetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendAiQuestion = (customText?: string) => {
    const q = customText || aiQuestion;
    if (!q.trim()) return;

    setAiChatLog(prev => [...prev, { role: 'user', text: q }]);
    setAiQuestion("");
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("interest") || q.toLowerCase().includes("calculation")) {
        reply = `Under **Section 15(3) of the Payment of Wages Act, 1936**, delayed wages incur statutory compensation. For your **₹1,17,000** total claim, you can demand **18% per annum** compounded interest from June 1, 2025, which amounts to approximately **₹26,325** in statutory penal damages.`;
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
          1. TOP BREADCRUMBS & QUICK CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        
        {/* Left Breadcrumb Trail */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push("/dashboard/matters")}
            className="flex items-center gap-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Matters Hub
          </button>
          
          <span className="text-slate-300">/</span>
          
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
            <Briefcase size={14} className="text-blue-600" />
            <span className="font-mono text-[13px] font-bold text-slate-900 tracking-wide">
              {matter.id}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {matter.status} MATTER
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
            ⚡ {matter.priority} PRIORITY
          </span>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="flex items-center gap-2 text-[13px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Sparkles size={15} className="text-blue-600 animate-pulse" />
            <span>Ask Matter AI</span>
          </button>

          <Link
            href="/dashboard/documents"
            className="btn-ghost flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-xl"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Export Dossier</span>
          </Link>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="btn-primary text-[13px] font-semibold px-4 py-2 h-[38px] rounded-xl flex items-center gap-2 shadow-md"
          >
            <Video size={14} />
            <span>Consultation Room</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MATTER INTELLIGENCE HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[12px] font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
                {matter.category}
              </span>
              <span className="text-[13px] text-slate-500 flex items-center gap-1.5">
                <Landmark size={13} className="text-slate-400" />
                Jurisdiction: <span className="text-slate-800 font-medium">{matter.jurisdiction}</span>
              </span>
            </div>

            <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 tracking-tight leading-[1.15]">
              {matter.title}
            </h1>
            
            <p className="text-[14.5px] text-slate-600 leading-relaxed max-w-2xl">
              {matter.overview}
            </p>
          </div>

          {/* Limitation Countdown Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 w-full lg:w-[320px] shrink-0 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-amber-800 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> Statutory Limitation
              </span>
              <span className="font-mono text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                Art. 7
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-[32px] font-bold font-display text-slate-900 tracking-tight">
                {matter.daysRemaining}
              </span>
              <span className="text-[15px] font-semibold text-amber-800">
                Days Remaining
              </span>
            </div>

            {/* Progress Segment */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 mb-2.5">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(matter.daysRemaining / 90) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11.5px] text-slate-600">
              <span>Deadline: <strong className="text-slate-900">{matter.limitationDeadline}</strong></span>
              <span className="text-emerald-700 font-semibold">Notice Ready</span>
            </div>
          </div>
        </div>

        {/* 4 Core Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 relative z-10">
          
          {/* Card 1: Client & Counterparty */}
          <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Users size={13} className="text-blue-600" /> Litigant Parties
            </div>
            <div className="space-y-1">
              <div className="text-[13.5px] text-slate-600 flex items-center justify-between">
                <span>Client:</span>
                <strong className="text-slate-900 font-semibold">{matter.client}</strong>
              </div>
              <div className="text-[13.5px] text-slate-600 flex items-center justify-between">
                <span>Opposing:</span>
                <strong className="text-slate-900 font-semibold truncate max-w-[140px]" title={matter.opposingParty}>{matter.opposingParty}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Claim Value */}
          <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-emerald-600" /> Total Claim Value
            </div>
            <div className="text-[20px] font-bold text-emerald-700 tracking-tight font-display">
              ₹{matter.claimTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ₹95K Principal + ₹22K Leave Encashment
            </div>
          </div>

          {/* Card 3: AI Legal Engine Confidence */}
          <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all">
            <div className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-600" /> AI Case Strength
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] font-bold text-slate-900 font-display">
                {matter.aiConfidence}%
              </span>
              <span className="text-[11.5px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Very Strong Merit
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Mapped to 50K+ SC Precedents
            </div>
          </div>

          {/* Card 4: Assigned Verified Advocate */}
          <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                RS
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold text-slate-900 truncate">
                  {matter.assignedLawyer.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  ★ 4.9 · {matter.assignedLawyer.experience} yrs exp
                </div>
              </div>
            </div>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="text-[11.5px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
            >
              Consult
            </button>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SLEEK SEGMENTED TAB NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all whitespace-nowrap relative ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Icon size={15} className={isActive ? "text-blue-600" : "text-slate-400"} />
              <span>{tab.label}</span>
              {tab.count && (
                <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-blue-200/60 text-blue-800"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[6px] left-3 right-3 h-[2px] bg-blue-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT WORKSPACES
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[500px] shadow-sm">
        
        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Action Prompt Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold uppercase tracking-wider text-amber-800">Immediate Action Required</div>
                  <h4 className="text-[16px] font-bold text-slate-900">Serve 15-Day Registered AD Legal Notice</h4>
                  <p className="text-[13px] text-slate-600">Statutory prerequisite before lodging claim petition with the Delhi Labour Commissioner.</p>
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
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-600" /> Executive Fact Matrix
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      AI Verified
                    </span>
                  </div>

                  <p className="text-[14px] text-slate-700 leading-relaxed">
                    {matter.analysis.whatHappened}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {matter.analysis.keyFacts.map((f: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[13.5px] font-semibold text-slate-900 block">{f.label}</strong>
                          <span className="text-[13px] text-slate-600 leading-normal">{f.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidentiary Gaps Checklist */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                  <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-600" /> Evidentiary Gaps to Close
                  </h3>
                  <p className="text-[13px] text-slate-600">Upload these documents to strengthen court petition filing admissibility:</p>
                  
                  <div className="space-y-2 pt-1">
                    {matter.analysis.missingInfo.map((item: string, idx: number) => (
                      <div key={idx} className="bg-white border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
                        <span className="text-[13px] text-slate-700">{item}</span>
                        <Link href="/dashboard/documents" className="text-[11.5px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0 border border-blue-200">
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
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                    <Scale size={16} className="text-emerald-600" /> Damage Valuation Matrix
                  </h3>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-[13.5px] text-slate-600">May & June Gross Salary</span>
                      <strong className="text-[15px] font-bold text-slate-900">₹{matter.claimPrincipal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-[13.5px] text-slate-600">Accrued Leave Encashment</span>
                      <strong className="text-[15px] font-bold text-slate-900">₹{matter.claimLeaveEncashment.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-[13.5px] text-slate-600">Statutory Interest</span>
                      <span className="text-[12.5px] font-semibold text-emerald-700">{matter.statutoryInterest}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[14px] font-bold text-slate-900 uppercase tracking-wider">Total Claim Demand</span>
                      <strong className="text-[22px] font-bold text-emerald-700 font-display">₹{matter.claimTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Advocate Dossier Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Counsel on Record</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      ✓ Bar Council Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      RS
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-slate-900">{matter.assignedLawyer.name}</h4>
                      <p className="text-[12.5px] text-blue-700 font-medium">{matter.assignedLawyer.specialization}</p>
                      <p className="text-[11.5px] text-slate-500">Bar Enrollment: {matter.assignedLawyer.barNumber}</p>
                    </div>
                  </div>

                  <div className="text-[12.5px] text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400" /> {matter.assignedLawyer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall size={13} className="text-slate-400" /> {matter.assignedLawyer.phone}
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
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3.5">
              <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14.5px] font-bold text-slate-900">AI Case Understanding Dossier</h4>
                <p className="text-[13px] text-slate-600 mt-0.5">{matter.analysis.caveat}</p>
              </div>
            </div>

            {/* Classification & Grounds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-blue-700 block">Case Classification</span>
                <p className="text-[14.5px] text-slate-900 leading-relaxed font-medium">
                  {matter.analysis.caseClassification}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-700 block">Statutory Grounds of Action</span>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  {matter.analysis.potentialGrounds}
                </p>
              </div>
            </div>

            {/* Facts Matrix Full */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900">Substantiated Pleadings & Evidence Alignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matter.analysis.keyFacts.map((fact: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-[14px] text-blue-700">{fact.label}</strong>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Admissible</span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{fact.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: LEGAL RESEARCH & PRECEDENTS ───────────────────── */}
        {activeTab === "research" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">Binding Statutory Provisions & Case Law Precedents</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">Indexed against 50,000+ Indian High Court and Supreme Court judgments.</p>
              </div>
              <span className="text-[12px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-bold">
                3 Governing Statutes Mapped
              </span>
            </div>

            <div className="space-y-4">
              {matter.research.map((res: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 space-y-3 transition-all shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-[16.5px] font-bold text-blue-700">{res.statute}</h4>
                      <p className="text-[13px] text-slate-500">{res.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {res.citation}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        {res.impact}
                      </span>
                    </div>
                  </div>

                  <p className="text-[14px] text-slate-700 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12.5px]">
                    <div className="text-slate-500">
                      Binding Judicial Authority: <strong className="text-slate-900 font-semibold">{res.authority}</strong>
                    </div>
                    <span className="text-blue-700 font-medium">{res.relevance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: DOCUMENTS STUDIO IN-MATTER ────────────────────── */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">Matter Pleadings & Legal Drafts</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">Court-formatted statutory documents generated for this case.</p>
              </div>
              <Link href="/dashboard/documents" className="btn-primary text-[13px] font-semibold px-4 py-2 rounded-xl">
                Open in Document Studio →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matter.documents.map((doc: any) => (
                <div key={doc.id} className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <FileText size={17} className="text-blue-600 shrink-0" />
                      <h4 className="text-[15.5px] font-bold text-slate-900 truncate">{doc.title}</h4>
                      <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        doc.status === 'READY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        doc.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-600 line-clamp-1 italic">{doc.snippet}</p>
                    <div className="text-[11.5px] text-slate-400 flex items-center gap-3">
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
                      className="btn-ghost text-[13px] font-semibold px-3.5 py-2 rounded-xl"
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
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">Admitted Exhibits & Chain-of-Custody Vault</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">Encrypted evidentiary documents with SHA-256 integrity hashes.</p>
              </div>
              <Link href="/dashboard/documents" className="btn-ghost text-[13px] font-semibold px-4 py-2 rounded-xl">
                + Add Exhibit
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matter.evidence.map((ev: any) => (
                <div key={ev.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                      Exhibit {ev.exhibit}
                    </span>
                    <span className="text-[11.5px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck size={13} /> {ev.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">{ev.type} · Tagged {ev.date} · {ev.size}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{ev.hash}</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">Preview</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: PROCEDURAL ROADMAP ────────────────────────────── */}
        {activeTab === "action_plan" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">Procedural Action Roadmap</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">Sequential milestones to ensure optimal legal outcome before statutory expiration.</p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                <span className="text-[13px] font-semibold text-slate-800">{progressPercent}% Completed</span>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
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
                      ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      item.done
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-slate-100 border-slate-300 text-transparent"
                    }`}>
                      <Check size={14} className="font-bold stroke-[3]" />
                    </div>
                    <div>
                      <span className={`text-[14.5px] font-medium block leading-normal ${
                        item.done ? "text-slate-400 line-through" : "text-slate-900"
                      }`}>
                        {item.text}
                      </span>
                      <span className="text-[11.5px] text-slate-400">
                        Responsible: <strong className="text-slate-700">{item.responsible}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${
                    item.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                    item.priority === 'URGENT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    item.priority === 'HIGH' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
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
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-[18px] font-bold text-slate-900">Chronological Case Docket History</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Immutable event record of legal actions, drafts, and consultations.</p>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {matter.timeline.map((event: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                    event.status === 'COMPLETED'
                      ? 'bg-blue-600 border-white shadow-sm'
                      : 'bg-slate-300 border-white'
                  }`} />
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-[15px] font-bold text-slate-900">{event.title}</h4>
                      <span className="font-mono text-[11.5px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 8: LIVE CONSULTATION ROOM ────────────────────────── */}
        {activeTab === "consultation" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Video size={24} />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-emerald-700 uppercase tracking-wider">● Secure HD Meeting Room Ready</div>
                    <h3 className="text-[20px] font-bold text-slate-900">Consultation with {matter.assignedLawyer.name}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[15px] font-bold text-slate-900">{matter.consultation.date}</div>
                  <div className="text-[13px] text-blue-600 font-semibold">{matter.consultation.time}</div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-500">Session Brief & Strategy Notes</h4>
                  <p className="text-[14px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    {matter.consultation.notes}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-500">Meeting Agenda</h4>
                  <ul className="space-y-2 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    {matter.consultation.agenda.map((ag: string, idx: number) => (
                      <li key={idx} className="text-[13px] text-slate-700 flex items-start gap-2">
                        <CheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
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
                  className="btn-primary text-[14.5px] font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Video size={16} /> Enter HD Video Meeting →
                </a>

                <button
                  onClick={copyMeetLink}
                  className="btn-ghost flex items-center gap-2 text-[13.5px] font-semibold px-4 py-3 rounded-xl"
                >
                  {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">Matter AI Intelligence</h3>
                    <p className="text-[11px] text-slate-500">Live Context: {matter.id} · {matter.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200"
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
                        : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-sm space-y-2'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: chat.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>') }} />
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-[12.5px] text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl w-fit">
                    <Sparkles size={13} className="animate-spin" /> Cross-referencing case facts with Indian law...
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  "Calculate statutory interest under §15",
                  "What are risks of no exit clearance?",
                  "Generate WhatsApp reminder to HR"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAiQuestion(prompt)}
                    className="text-[11.5px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiQuestion();
                  }}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-blue-500 transition-colors"
                >
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask about this matter's statutes, risks, or drafts..."
                    className="bg-transparent text-[13px] text-slate-900 placeholder-slate-400 outline-none flex-1"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shrink-0 shadow-xs"
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
