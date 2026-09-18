'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  MessageSquare, Scale, Users, ArrowRight,
  Check, Shield, Clock, FileText, ChevronRight, Lock, Sparkles,
  Cpu, Database, ShieldCheck, Video, FileCheck,
  Zap, ArrowUpRight, CheckCircle2, Award, AlertTriangle,
  Home, Briefcase, KeyRound, Building, ExternalLink,
  ChevronDown, HelpCircle, PhoneCall
} from 'lucide-react';

const REAL_SCENARIOS = [
  {
    id: 'tenancy',
    tag: 'TENANCY & RENT',
    icon: Home,
    title: 'Withheld Rental Deposit',
    clientSays: 'My landlord is refusing to refund my ₹75,000 security deposit after I vacated the flat with 30 days notice.',
    aiAnalysis: {
      statute: 'Transfer of Property Act, 1882 §108 & State Rent Control Act',
      violation: 'Unlawful withholding of tenant deposit without itemized repair invoices',
      limitation: '3 Years (Limitation Act 1963 Schedule Art. 22)',
      curePeriod: '15-Day Statutory Cure Period',
      remedy: 'Full refund of ₹75,000 + 18% statutory interest per annum',
    },
    actionTaken: 'Auto-generated formal 15-day RPAD Demand Notice with legal penal notice warning.',
    matchedCounsel: {
      name: 'Advocate Priya Mehta',
      barNo: 'KAR/2491/2014',
      court: 'High Court of Karnataka & City Civil Court',
      experience: '9 Yrs Litigation',
      fee: '₹999',
    }
  },
  {
    id: 'salary',
    tag: 'LABOUR & EMPLOYMENT',
    icon: Briefcase,
    title: 'Unpaid Salary & Wrongful Exit',
    clientSays: 'I was terminated without notice period pay and the company is withholding 2 months salary (₹1,20,000) and relieving letter.',
    aiAnalysis: {
      statute: 'Payment of Wages Act 1936 §15 & Industrial Disputes Act §25F',
      violation: 'Withholding statutory wages; non-compete clause void ab initio under Contract Act §27',
      limitation: '3 Years to file civil suit / 1 Year for Labour Court',
      curePeriod: '7-Day Demand for Clearance',
      remedy: '₹1,20,000 back wages + mandatory relieving letter + damages',
    },
    actionTaken: 'Generated statutory demand brief for Labour Commissioner and employer escalation.',
    matchedCounsel: {
      name: 'Advocate Rajesh Sharma',
      barNo: 'MAH/1842/2010',
      court: 'Bombay High Court & Labour Tribunal',
      experience: '12 Yrs Litigation',
      fee: '₹1,499',
    }
  },
  {
    id: 'cheque',
    tag: 'COMMERCIAL NEGOTIABLE INSTRUMENTS',
    icon: Building,
    title: 'Section 138 Cheque Bounce',
    clientSays: 'A client issued a cheque of ₹2,50,000 for invoice dues which was dishonoured by the bank for "Insufficient Funds".',
    aiAnalysis: {
      statute: 'Negotiable Instruments Act, 1881 §138 & §142',
      violation: 'Dishonour of cheque creates immediate criminal liability under statutory presumption',
      limitation: 'STRICT: Notice must be served within 30 days of bank memo receipt',
      curePeriod: '15 Days to Pay from Notice Receipt',
      remedy: '₹2,50,000 principal + up to 2x statutory fine and 2-year imprisonment',
    },
    actionTaken: 'Calculated strict 30-day limitation window and drafted Section 138 Statutory Notice.',
    matchedCounsel: {
      name: 'Advocate Vikram Singh',
      barNo: 'D/1520/2011',
      court: 'Delhi High Court & Commercial Division',
      experience: '14 Yrs Litigation',
      fee: '₹2,499',
    }
  },
  {
    id: 'cyber',
    tag: 'CYBER FRAUD & BANKING',
    icon: KeyRound,
    title: 'Unauthorized UPI / Online Fraud',
    clientSays: 'Lost ₹45,000 in an unauthorized UPI phishing transaction yesterday after clicking an electricity bill link.',
    aiAnalysis: {
      statute: 'Information Technology Act §66D & RBI Zero Liability Circular 2017',
      violation: 'Third-party breach with zero customer negligence reported within 72 hours',
      limitation: '72 Hours for RBI Zero-Liability reversal mandate',
      curePeriod: 'Immediate Bank Lien Escalation',
      remedy: 'Full bank chargeback reversal of ₹45,000 under RBI nodal escalation',
    },
    actionTaken: 'Synthesized cyber crime FIR dossier and National Cyber Crime Portal (1930) escalation brief.',
    matchedCounsel: {
      name: 'Advocate Sanjay Gupta',
      barNo: 'D/980/2007',
      court: 'Delhi High Court & Cyber Appellate Tribunal',
      experience: '15 Yrs Litigation',
      fee: '₹1,999',
    }
  }
];

const COMPARISON_POINTS = [
  {
    feature: 'Initial Assessment',
    traditional: 'Days waiting for an appointment + ₹5,000 consultation fee',
    lexnova: 'Instant in 30 seconds · 100% Free',
    winner: true,
  },
  {
    feature: 'Language & Jargon',
    traditional: 'Confusing Latin maxims & 200-page complex legal codes',
    lexnova: 'Plain conversational English & Hindi (Zero jargon)',
    winner: true,
  },
  {
    feature: 'Limitation Deadlines',
    traditional: 'Often overlooked until rights are permanently lost',
    lexnova: 'Automated statutory countdown clock (Limitation Act 1963)',
    winner: true,
  },
  {
    feature: 'Legal Notice Drafting',
    traditional: '3 to 7 days of back-and-forth drafts costing ₹10,000+',
    lexnova: 'Court-admissible RPAD Notice generated in 60 seconds',
    winner: true,
  },
  {
    feature: 'Lawyer Consultation',
    traditional: 'Unvetted referrals with opaque hourly rates',
    lexnova: 'Bar Council verified High Court advocates for a flat ₹999',
    winner: true,
  },
];

export default function HowItWorksPage() {
  const [selectedScenario, setSelectedScenario] = useState(REAL_SCENARIOS[0]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-800 antialiased font-sans bg-[#FBFBFD] text-slate-900">
      <Navbar />

      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08)_0%,rgba(168,85,247,0.03)_50%,transparent_75%)]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-28 space-y-24 relative z-10 w-full">
        
        {/* ── 1. BILLION-DOLLAR HERO SECTION ── */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11.5px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
            <Sparkles size={13} className="text-indigo-600" />
            <span>THE AUTONOMOUS LEGAL OPERATING SYSTEM</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-slate-900 tracking-tight leading-[1.08]">
            Legal protection. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Simplified to 3 simple steps.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto font-normal">
            No expensive retainers. No confusing Latin jargon. Just describe what happened in plain words, and LexNova does the rest in under 60 seconds.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/dashboard/chat"
              className="px-7 py-3.5 rounded-full text-white text-[14px] font-bold transition-all flex items-center gap-2 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Try Instant AI Case Intake</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="#interactive-demo"
              className="px-6 py-3.5 rounded-full text-[14px] font-semibold transition-all bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs"
            >
              See It in Action
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              <span>100% Free Initial Assessment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" />
              <span>Bar Council Verified</span>
            </div>
          </div>
        </div>

        {/* ── 2. THE 3-STEP VISUAL PIPELINE (ZERO WALL OF TEXT) ── */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              From dispute to resolution in minutes.
            </h2>
            <p className="text-sm text-slate-500">
              Here is what happens behind the scenes when you describe a legal problem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* STEP 1 CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center border border-indigo-100">
                    01
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-slate-100 text-slate-600">
                    CONVERSATIONAL
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Describe What Happened
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Speak or type naturally in everyday language. No confusing clauses or legal preparation needed.
                  </p>
                </div>

                {/* Visual Mock Element */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                    <MessageSquare size={12} className="text-indigo-500" />
                    <span>User Prompt</span>
                  </div>
                  <p className="text-slate-700 italic text-[11.5px] bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    &ldquo;My landlord refuses to return my ₹75,000 deposit after I moved out with 30 days notice.&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      Tenancy Code
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Claim: ₹75,000
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11.5px] text-slate-500 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Zero legal background required</span>
              </div>
            </motion.div>

            {/* STEP 2 CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-7 rounded-3xl bg-white border border-indigo-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    AI REASONING
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Instant Statutory Audit &amp; Deadlines
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI cross-references 50+ central and state laws, calculates your statutory deadline, and quotes binding precedents.
                  </p>
                </div>

                {/* Visual Mock Element */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10.5px]">
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <Scale size={12} /> STATUTORY AUDIT
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">100% MATCH</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Governing Law:</span>
                      <span className="text-slate-200 font-bold">TPA 1882 §108</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Limitation Bar:</span>
                      <span className="text-amber-400 font-bold">3 Yrs (Limitation Act)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Interest Relief:</span>
                      <span className="text-emerald-400 font-bold">18% p.a. Statutory</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11.5px] text-slate-500 font-medium flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-600 shrink-0" />
                <span>Never miss a legal filing deadline</span>
              </div>
            </motion.div>

            {/* STEP 3 CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm flex items-center justify-center border border-emerald-100">
                    03
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    RESOLUTION
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Legal Notice &amp; Lawyer Call
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Export a court-admissible 15-day demand notice, or jump into a private 1-on-1 video call with a verified advocate.
                  </p>
                </div>

                {/* Visual Mock Element */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText size={13} className="text-indigo-600" />
                      <span>15-Day RPAD Notice</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.2 rounded">READY</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-900">Advocate Consultation</div>
                      <div className="text-[10px] text-slate-500">Video call included · ₹999 flat</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                      Book Call
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11.5px] text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Court-admissible RPAD formatting</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── 3. INTERACTIVE DISPUTE SIMULATOR (SEE IT IN ACTION) ── */}
        <div id="interactive-demo" className="pt-8 space-y-8 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600">
              INTERACTIVE DEMO
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pick a real dispute to test the AI.
            </h2>
            <p className="text-sm text-slate-500">
              Click any situation below to see how LexNova instantly extracts the claim, law, and next step.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {REAL_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs scale-102'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-indigo-400' : 'text-slate-400'} />
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Output Showcase Card */}
          <motion.div
            key={selectedScenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-md grid lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column (7 cols): What Client Said & AI Extraction */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedScenario.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  {selectedScenario.title}
                </h3>
              </div>

              {/* Client Statement Quote */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  What You Say to the AI:
                </span>
                <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
                  &ldquo;{selectedScenario.clientSays}&rdquo;
                </p>
              </div>

              {/* Instant Statutory Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                  <div className="text-[10.5px] font-mono font-bold text-slate-400 uppercase">Governing Law</div>
                  <div className="text-xs font-bold text-slate-900">{selectedScenario.aiAnalysis.statute}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                  <div className="text-[10.5px] font-mono font-bold text-amber-600 uppercase">Limitation Deadline</div>
                  <div className="text-xs font-bold text-amber-950">{selectedScenario.aiAnalysis.limitation}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 sm:col-span-2">
                  <div className="text-[10.5px] font-mono font-bold text-emerald-600 uppercase">Enforceable Remedy</div>
                  <div className="text-xs font-bold text-emerald-950">{selectedScenario.aiAnalysis.remedy}</div>
                </div>
              </div>

              {/* Action notice taken */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2.5">
                <Zap size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-900">Immediate AI Deliverable:</strong> {selectedScenario.actionTaken}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Verified Counsel Card Ready to Deploy */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080B14] text-white border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>MATCHED COUNSEL READY</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AVAILABLE NOW
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white tracking-tight">
                  {selectedScenario.matchedCounsel.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedScenario.matchedCounsel.court}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-indigo-300 font-semibold">{selectedScenario.matchedCounsel.barNo}</span>
                  <span>·</span>
                  <span>{selectedScenario.matchedCounsel.experience}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Consultation Retainer</span>
                  <span className="text-lg font-black font-mono text-emerald-400">{selectedScenario.matchedCounsel.fee}</span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">60 Mins Encrypted Video</span>
              </div>

              <Link
                href={`/dashboard/chat?init=${encodeURIComponent(selectedScenario.clientSays)}`}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Run This Dispute in Console</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── 4. TRADITIONAL VS LEXNOVA COMPARISON MATRIX ── */}
        <div className="pt-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600">
              THE ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Old Legal System vs. LexNova
            </h2>
            <p className="text-sm text-slate-500">
              Why thousands of citizens and businesses have switched to autonomous dispute resolution.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-12 bg-slate-50/80 p-4 sm:px-6 border-b border-slate-200/90 text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
              <div className="col-span-4 sm:col-span-3">Feature</div>
              <div className="col-span-4 sm:col-span-4 text-slate-500">Traditional Process</div>
              <div className="col-span-4 sm:col-span-5 text-indigo-700">LexNova Autonomous OS</div>
            </div>

            <div className="divide-y divide-slate-100">
              {COMPARISON_POINTS.map((cp, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:px-6 items-center text-xs sm:text-sm hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-semibold text-slate-900">
                    {cp.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-slate-500 text-xs sm:text-sm pr-2">
                    {cp.traditional}
                  </div>
                  <div className="col-span-4 sm:col-span-5 font-bold text-indigo-700 flex items-center gap-1.5 text-xs sm:text-sm">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{cp.lexnova}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. ENTERPRISE COMPLIANCE & PRIVILEGE PILLARS ── */}
        <div className="pt-4 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Bank-grade security. Attorney-client privileged.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Your data is encrypted, confidential, and never used to train public LLM models.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Lock, title: 'AES-256 GCM Encryption', desc: 'All case pleadings and uploaded evidence are encrypted at rest and in transit.' },
              { icon: ShieldCheck, title: 'Bar Council Verified', desc: 'Every lawyer is verified against state Bar Council records and license credentials.' },
              { icon: FileCheck, title: 'Court-Ready Standards', desc: 'Notices adhere strictly to Civil Procedure Code (CPC) and RPAD requirements.' },
              { icon: Database, title: 'Strict Client Privilege', desc: 'Zero data leakage. Case files are strictly accessible only by you and your advocate.' },
            ].map((col, cIdx) => {
              const Icon = col.icon;
              return (
                <div key={cIdx} className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{col.title}</h4>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">{col.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 6. SLEEK BOTTOM CTA BANNER ── */}
        <div className="p-8 sm:p-12 rounded-3xl text-center space-y-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 text-blue-300 border border-white/15">
            <Sparkles size={12} className="text-blue-400" />
            <span>START RESOLVING TODAY</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Have a dispute? Get your legal answer in 60 seconds.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start a free case intake. Describe what happened and see your legal rights, claim calculation, and matched advocates immediately.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/dashboard/chat"
              className="px-7 py-3 rounded-full text-white text-[13.5px] font-bold transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5"
            >
              <span>Launch Free Legal Console</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/dashboard/advocates"
              className="px-6 py-3 rounded-full text-[13.5px] font-semibold transition-all bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-sm"
            >
              Browse Verified Advocates
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
