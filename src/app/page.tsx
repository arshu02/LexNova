'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, ArrowRight, Shield, Zap, CheckCircle2, ChevronRight,
  FileText, MessageSquare, Users, Lock, Sparkles, Star, Clock,
  Briefcase, ShieldCheck, Building, Award, ArrowUpRight,
  Search, Video, Check, Globe, CornerDownLeft, Terminal,
  Cpu, Building2, Gavel, FileCheck, Layers, AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const SAMPLE_QUERIES = [
  {
    title: "Tenancy Deposit Withholding",
    snippet: "Landlord refusing to refund ₹75,000 security deposit after 30-day notice.",
    statute: "Karnataka Rent Act 1999 §108",
    deadline: "3 Years (Limitation Act Art 62)",
  },
  {
    title: "Unpaid Salary & Wrongful Exit",
    snippet: "Employer withheld 2 months salary (₹1,40,000) and relieving letter.",
    statute: "Payment of Wages Act §15",
    deadline: "18 Days Left to File Petition",
  },
  {
    title: "Section 138 Cheque Bounce",
    snippet: "Client's ₹2,50,000 business cheque bounced with 'Funds Insufficient'.",
    statute: "NI Act 1881 §138 & §142",
    deadline: "Strict 30-Day Notice Period",
  },
  {
    title: "Unauthorized UPI Fraud",
    snippet: "Lost ₹45,000 in a phishing transaction; bank delaying chargeback.",
    statute: "IT Act §66D & RBI Circular",
    deadline: "Zero Liability (3-Day Window)",
  },
];

const ADVOCATES_SHOWCASE = [
  {
    name: "Adv. Priya Mehta",
    barNumber: "KAR/2491/2015",
    courts: "Karnataka High Court",
    specialization: "Property, Tenancy & RERA",
    experience: "9 Years",
    rating: "4.9",
    fee: "₹999",
  },
  {
    name: "Adv. Rajesh Sharma",
    barNumber: "D/1842/2012",
    courts: "Delhi High Court & NCLT",
    specialization: "Employment, Labour & Corporate",
    experience: "12 Years",
    rating: "4.9",
    fee: "₹1,299",
  },
  {
    name: "Adv. Vikram Singh",
    barNumber: "MAH/4019/2014",
    courts: "Bombay High Court",
    specialization: "Commercial Recovery & NI Act §138",
    experience: "10 Years",
    rating: "4.8",
    fee: "₹1,499",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [heroInput, setHeroInput] = useState('');
  const [selectedDemo, setSelectedDemo] = useState(0);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroInput.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(heroInput.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white flex flex-col relative selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Ambient Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-glow from-blue-600/[0.12] via-cyan-500/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 max-w-6xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Shimmer Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.1] bg-[#0A0E1A]/80 backdrop-blur-xl shadow-lg hover:border-blue-500/40 transition-colors cursor-pointer group"
          onClick={() => router.push('/dashboard/chat')}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[12.5px] font-semibold text-[#CBD5E1] group-hover:text-white transition-colors">
            LexNova 2.5 Live · Multi-Model RAG & B2B API Engine
          </span>
          <ChevronRight size={13} className="text-[#8D9CB0] group-hover:translate-x-0.5 transition-transform" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gradient max-w-4xl mx-auto leading-[1.1]"
        >
          The AI Legal Operating System for India & Enterprise.
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-[#8D9CB0] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Instant statutory cross-referencing, automated RPAD notice drafting, court limitation clock tracking, and verified High Court advocate coordination in 60 seconds.
        </motion.p>

        {/* Interactive Neural Intake Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto pt-4"
        >
          <form
            onSubmit={handleHeroSubmit}
            className="p-2 sm:p-2.5 bg-[#090D17]/90 backdrop-blur-2xl border border-white/[0.12] focus-within:border-blue-500/60 rounded-2xl sm:rounded-3xl shadow-2xl transition-all space-y-2"
          >
            <div className="flex items-center px-3 pt-1">
              <Sparkles size={16} className="text-blue-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Explain your legal situation (e.g. Landlord withheld ₹75,000 deposit, unpaid salary)..."
                className="w-full bg-transparent border-none text-white text-[14.5px] placeholder-[#55667E] focus:outline-none py-2"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] px-2">
              <div className="flex items-center gap-2 text-[11.5px] text-[#6B7B94]">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>256-Bit TLS · Attorney Privilege</span>
              </div>

              <button
                type="submit"
                className="btn-glow-blue h-10 px-5 rounded-xl text-[13.5px] font-semibold flex items-center gap-1.5"
              >
                <span>Analyze Case</span>
                <CornerDownLeft size={13} />
              </button>
            </div>
          </form>

          {/* Quick Scenario Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-[12px] text-[#7A8A9E]">
            <span className="text-[#55667E] font-medium">Try:</span>
            {["Security Deposit", "Unpaid Salary §15", "Cheque Bounce §138", "Cyber Fraud"].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroInput(item)}
                className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-[#CBD5E1] transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Global Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/[0.08]"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">₹420+ Cr</div>
            <div className="text-[12.5px] text-[#8D9CB0] mt-0.5">Dispute Claims Analyzed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">2,800+</div>
            <div className="text-[12.5px] text-[#8D9CB0] mt-0.5">High Court Advocates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.4%</div>
            <div className="text-[12.5px] text-[#8D9CB0] mt-0.5">Statutory Precision</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">&lt; 15s</div>
            <div className="text-[12.5px] text-[#8D9CB0] mt-0.5">Neural Synthesis Speed</div>
          </div>
        </motion.div>
      </section>

      {/* ── BENTO GRID: ENTERPRISE CORE ─────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11.5px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            Autonomous Legal Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for High-Stakes Legal Workflows
          </h2>
          <p className="text-[15px] text-[#8D9CB0]">
            From intake to tribunal enforcement, every module is engineered for statutory precision and court compliance.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Neural RAG Engine */}
          <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">Multi-Model Neural Legal RAG</h3>
                <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                  Synthesizes plain text facts against 50,000+ Supreme Court and High Court precedents. Features automatic fallback between Claude 3.5 Sonnet, GPT-4o, and deterministic logic.
                </p>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="mt-6 bg-[#05070D] border border-white/[0.08] rounded-xl p-4 font-mono text-[12px] space-y-2 text-[#9AA8BC]">
              <div className="flex items-center justify-between text-blue-400 pb-2 border-b border-white/[0.05]">
                <span>⚖️ STATUTE_MAPPED: Payment of Wages Act §15</span>
                <span className="text-emerald-400">CONFIDENCE: 99.4%</span>
              </div>
              <p className="text-[#CBD5E1]">
                &gt; Limitation Period: 3 Years (Limitation Act Art 7)<br />
                &gt; Claim Quantification: ₹1,40,000 + 18% Statutory Interest<br />
                &gt; Recommended Action: 15-Day RPAD Demand Notice before Labour Tribunal
              </p>
            </div>
          </div>

          {/* Bento 2: Limitation Clock */}
          <div className="glass-card p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">Limitation Clock Engine</h3>
                <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                  Calculates statutory extinction deadlines under the Limitation Act 1963. Triggers automated hearing alerts and Section 5 Condonation briefs.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12.5px] font-semibold flex items-center gap-2">
              <Clock size={16} className="text-amber-400 shrink-0" />
              <span>Section 138 NI Act: 30-Day Strict Countdown Active</span>
            </div>
          </div>

          {/* Bento 3: Court Notice Generator */}
          <div className="glass-card p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <FileCheck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">RPAD Demand Notice Studio</h3>
                <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                  Generates formal legal demand notices with standard High Court formatting, RPAD dispatch headers, and LexNova cryptographic watermark seals.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[13px] text-emerald-400 font-semibold">
              <span>Court-Admissible PDF</span>
              <ArrowUpRight size={15} />
            </div>
          </div>

          {/* Bento 4: Multi-Tenant Team & B2B API */}
          <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">Multi-Tenant Law Firm Workspace & B2B API</h3>
                <p className="text-[14px] text-[#8D9CB0] leading-relaxed">
                  Enterprise organization management for law firms and corporate legal departments. Includes role-based access control, immutable SIEM audit logs, and public REST API (v1).
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#05070D] border border-white/[0.08] font-mono text-[12px] text-purple-300">
              <code>POST https://lexnova.in/api/v1/cases/intake · Authorization: Bearer ln_live_...</code>
            </div>
          </div>

        </div>
      </section>

      {/* ── ADVOCATES MARKETPLACE CAROUSEL ──────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11.5px] font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Bar Council Enrolled
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-3">
              Matched High Court Advocates
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0] mt-1">
              Connect with verified legal counsel across 24 High Courts for encrypted video strategy sessions.
            </p>
          </div>

          <Link href="/advocates" className="btn-ghost text-[13.5px] font-semibold h-10 px-4 rounded-xl inline-flex items-center gap-1">
            <span>Browse All Advocates</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ADVOCATES_SHOWCASE.map((adv, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {adv.name.split(' ')[1]?.[0] || 'A'}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Star size={11} fill="currentColor" /> {adv.rating}
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] font-bold text-white">{adv.name}</h4>
                  <p className="text-[12.5px] text-[#8D9CB0] font-mono">{adv.barNumber}</p>
                </div>

                <div className="text-[13px] text-[#CBD5E1] space-y-1 pt-1 border-t border-white/[0.05]">
                  <div>🏛️ {adv.courts}</div>
                  <div>⚖️ {adv.specialization}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6B7B94] block">Consultation Fee</span>
                  <span className="text-[16px] font-bold text-white">{adv.fee}</span>
                </div>
                <Link
                  href="/dashboard/chat"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[12.5px] transition-all shadow-md shadow-blue-600/20"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECURITY & COMPLIANCE CITADEL ───────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-white/[0.08]">
        <div className="glass-card p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[11.5px] font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Enterprise Trust & Compliance
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Bank-Grade Security Architecture
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0]">
              LexNova protects client privilege with hardware-accelerated encryption and strict DPDPA 2023 compliance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-xl bg-[#05070D] border border-white/[0.06] space-y-1.5">
              <div className="text-blue-400 font-bold text-[14px]">DPDPA 2023</div>
              <p className="text-[12px] text-[#7A8A9E]">Right to Erasure, Data Portability, and Consent Logging built-in.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-white/[0.06] space-y-1.5">
              <div className="text-emerald-400 font-bold text-[14px]">AES-256 GCM</div>
              <p className="text-[12px] text-[#7A8A9E]">Client pleadings and evidence files are encrypted at rest and in transit.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-white/[0.06] space-y-1.5">
              <div className="text-purple-400 font-bold text-[14px]">PII Sanitization</div>
              <p className="text-[12px] text-[#7A8A9E]">Aadhaar and PAN numbers are anonymized before AI model dispatch.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-white/[0.06] space-y-1.5">
              <div className="text-amber-400 font-bold text-[14px]">Privilege Shield</div>
              <p className="text-[12px] text-[#7A8A9E]">Encrypted attorney-client channel compliant with Indian Evidence Act.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE CTA BANNER ────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full text-center">
        <div className="relative rounded-3xl p-12 sm:p-16 border border-white/[0.12] bg-gradient-to-b from-[#0B1020] to-[#05070D] overflow-hidden shadow-2xl space-y-6">
          <div className="absolute inset-0 bg-radial-glow from-blue-600/[0.15] to-transparent pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10 max-w-2xl mx-auto">
            Ready to resolve your legal dispute with AI precision?
          </h2>
          <p className="text-[16px] text-[#8D9CB0] max-w-xl mx-auto relative z-10">
            Join thousands of individuals, law firms, and businesses using LexNova to protect their legal rights.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap relative z-10">
            <Link
              href="/dashboard/chat"
              className="btn-primary h-12 px-8 rounded-xl text-[15px] font-bold shadow-xl"
            >
              Start Free AI Case Assessment →
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost h-12 px-8 rounded-xl text-[15px] font-semibold"
            >
              View Enterprise Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
