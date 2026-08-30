'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  MessageSquare, Scale, Users, ArrowRight,
  Check, Shield, Clock, FileText, ChevronRight, Lock, Sparkles,
  Cpu, Database, ShieldCheck, Video, FolderLock, FileCheck,
  Zap, ArrowUpRight, CheckCircle2, Award
} from 'lucide-react';

const ARCHITECTURE_LAYERS = [
  {
    step: "01",
    badge: "Layer 1 · Neural Natural Language Intake",
    title: "Plain-Language Conversational Case Extraction",
    subtitle: "Zero legal jargon required · English & Indic Language Support",
    desc: "Explain what happened naturally — whether a withheld rental deposit, wrongful employment termination, or consumer fraud. Our proprietary legal intake engine parses your statements into an admissible civil fact matrix, isolating opposing parties, jurisdiction, monetary claims, and timeline milestones.",
    bullets: [
      "Translates unstructured layman narratives into structured legal pleadings",
      "Auto-detects cause of action, competent jurisdiction, and exact damages",
      "End-to-end AES-256 encrypted under attorney-client privilege guidelines",
      "Identifies missing evidentiary gaps before legal notices are drafted",
    ],
    codeSnippet: {
      header: "INCOMING DISPUTE STREAM → STRUCTURED PLEADING",
      code: `// Factual Matrix Synthesized in 42ms
{
  "matter_type": "EMPLOYMENT_WAGE_RECOVERY",
  "client": "Ragnar Lothbrok",
  "respondent": "TechCorp Solutions Pvt. Ltd.",
  "principal_claim": "₹95,000 (May-June 2025 Gross Wages)",
  "accrued_benefits": "₹22,000 (Leave Encashment)",
  "total_damages": "₹1,17,000 + 18% Statutory Interest",
  "governing_statute": "Payment of Wages Act, 1936 § 15",
  "forum": "Authority under Payment of Wages / Labour Court"
}`
    },
    accent: "blue"
  },
  {
    step: "02",
    badge: "Layer 2 · Statutory Mapping & Precedent Vector Retrieval",
    title: "Statutory Precision & Automated Limitation Clock",
    subtitle: "Indexed across 50,000+ Supreme Court & High Court Judgments",
    desc: "LexNova's neural RAG vector engine cross-references your factual pleading against central statutes (CPC, IPC, CPA 2019, Transfer of Property Act, RERA) and calculates exact statutory limitation deadlines under the Limitation Act 1963 to prevent fatal time-bar dismissals.",
    bullets: [
      "Real-time countdown clocks against statutory limitation windows",
      "Supreme Court & High Court binding precedent citation mapping",
      "Automatic damage multipliers calculation (up to 10x statutory penalties)",
      "Strength rating benchmarked against 10,000+ historical case outcomes",
    ],
    codeSnippet: {
      header: "STATUTORY RAG RETRIEVAL & LIMITATION AUDIT",
      code: `// Statutory Cross-Referencing Engine
[
  {
    "act": "Payment of Wages Act 1936 · Section 15",
    "citation": "1936 ACT IV § 15",
    "precedent": "State of Punjab v. Labour Court [AIR 1980 SC]",
    "limitation_window": "Article 7, Limitation Act 1963 (3 Years)",
    "days_remaining_to_notice": 18,
    "statutory_relief": "100% Wage Recovery + 10x Max Penalty"
  }
]`
    },
    accent: "purple"
  },
  {
    step: "03",
    badge: "Layer 3 · Court Document Generation & Bar Council Advocates",
    title: "Court-Ready Pleading Drafts & Verified Counsel Video Rooms",
    subtitle: "RPAD Registered Notices · Jitsi HD Video Rooms · Fixed Transparent Pricing",
    desc: "Generate professional court-ready demand notices, consumer forum petitions, and tribunal claims with authoritative statutory citations. Connect instantly with enrolled Bar Council advocates who receive pre-structured 60-second briefing dossiers.",
    bullets: [
      "One-click export to court-formatted RPAD Legal Notices and Petitions",
      "2,400+ verified Bar Council of India enrolled advocates",
      "Instant HD encrypted video consultation rooms with agenda notes",
      "Transparent fixed-fee structure with zero hidden hourly retainers",
    ],
    codeSnippet: {
      header: "LEGAL NOTICE DISPATCH & COUNSEL ENGAGEMENT",
      code: `// Legal Notice Metadata & Counsel Brief
{
  "document_id": "LN-RPAD-2026-1042",
  "dispatch_method": "Registered Post A.D. & Email",
  "statutory_cure_period": "15 Days from Receipt",
  "assigned_counsel": {
    "name": "Advocate Rajesh Sharma",
    "enrollment": "MAH/8832/2012",
    "rating": "4.9 / 5.0 (547 verified consultations)",
    "consultation_room": "https://meet.jit.si/LexNova-MAT-1042"
  }
}`
    },
    accent: "emerald"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#F0F2F5] selection:bg-blue-500/30 selection:text-white font-sans antialiased flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/[0.06] rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.03] rounded-full blur-[180px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-28 relative z-10 space-y-24">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[13px] text-[#C8D0DC] font-medium">
            <Cpu size={14} className="text-blue-400" /> Technical Architecture & Workflow
          </div>
          
          <h1 className="text-[48px] sm:text-[64px] font-display text-white tracking-tight leading-[1.02]">
            How LexNova powers modern legal resolution.
          </h1>
          <p className="text-[19px] sm:text-[20px] text-[#9AA8BC] leading-relaxed max-w-2xl font-normal">
            From plain-language dispute intake to statutory analysis, court document generation, and Bar Council advocate collaboration — fully automated.
          </p>
        </div>

        {/* 3 Full-Bleed Technical Architecture Cards */}
        <div className="space-y-12">
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isBlue = layer.accent === "blue";
            const isPurple = layer.accent === "purple";
            const isEmerald = layer.accent === "emerald";

            return (
              <motion.div
                key={layer.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="p-8 sm:p-12 bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.18] rounded-3xl grid lg:grid-cols-12 gap-10 items-center transition-all shadow-2xl relative overflow-hidden group"
              >
                {/* Subtle ambient back-glow on hover */}
                <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${
                  isBlue ? 'bg-blue-600/10' : isPurple ? 'bg-purple-600/10' : 'bg-emerald-600/10'
                }`} />

                {/* Left Description Side (7 cols) */}
                <div className="lg:col-span-7 space-y-6 relative z-10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[15px] font-mono font-bold px-3 py-1 rounded-full border ${
                      isBlue ? 'text-blue-400 bg-blue-500/10 border-blue-500/25' :
                      isPurple ? 'text-purple-400 bg-purple-500/10 border-purple-500/25' :
                      'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                    }`}>
                      Step {layer.step}
                    </span>
                    <span className="text-[13px] text-[#7A8A9E] font-medium tracking-wide">
                      {layer.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-tight">
                      {layer.title}
                    </h2>
                    <p className={`text-[14px] font-medium mt-1 ${
                      isBlue ? 'text-blue-400' : isPurple ? 'text-purple-400' : 'text-emerald-400'
                    }`}>
                      {layer.subtitle}
                    </p>
                  </div>

                  <p className="text-[15.5px] text-[#9AA8BC] leading-relaxed">
                    {layer.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {layer.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-[14.5px] text-[#CBD5E1]">
                        <CheckCircle2 size={16} className={`shrink-0 ${
                          isBlue ? 'text-blue-400' : isPurple ? 'text-purple-400' : 'text-emerald-400'
                        }`} />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Code/JSON Architecture Terminal (5 cols) */}
                <div className="lg:col-span-5 bg-[#06080E] border border-white/[0.09] rounded-2xl p-6 shadow-inner font-mono text-[12.5px] text-[#C5D0E0] space-y-3 relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10.5px] uppercase font-bold text-[#6D7D93] tracking-wider">
                      {layer.codeSnippet.header}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto text-[#9CB0C6]">
                    {layer.codeSnippet.code}
                  </pre>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#55667E]">
                    <span>STATUS: VALIDATED</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* 4 Pillars Grid (Trust, Encryption, Compliance, Verification) */}
        <div className="pt-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-[32px] sm:text-[42px] font-display text-white tracking-tight">
              Enterprise Grade Security & Compliance
            </h2>
            <p className="text-[16.5px] text-[#8D9CB0]">
              Built with bank-level encryption and strict adherence to Bar Council of India regulations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: "AES-256 Encryption", desc: "All pleadings, consultation transcripts, and evidence files are encrypted in transit and at rest." },
              { icon: ShieldCheck, title: "Bar Council Verification", desc: "Every advocate's enrollment certificate, active standing, and state bar license is rigorously verified." },
              { icon: Database, title: "Confidential Vaults", desc: "Attorney-client privilege isolation ensures your dispute records are private and never monetized." },
              { icon: Scale, title: "Indian Court Compliant", desc: "Notices and petitions follow standard civil procedure code (CPC) and High Court filing formats." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-white/[0.15] transition-all">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[17px] font-bold text-white">{p.title}</h3>
                  <p className="text-[13.5px] text-[#8D9CB0] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-12 sm:p-16 bg-gradient-to-b from-[#0F1422] to-[#07090E] border border-white/[0.12] rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[13px] text-[#8A9BAC]">
            <Sparkles size={13} className="text-amber-400" /> Free to start · No payment method needed
          </div>
          <h2 className="text-[38px] sm:text-[50px] font-display text-white tracking-tight leading-tight">
            Ready to resolve your dispute?
          </h2>
          <p className="text-[18px] text-[#9AA8BC] max-w-lg mx-auto leading-relaxed font-normal">
            Start a free AI intake today. Get immediate statutory clarity and connect with top Bar Council advocates.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/chat" className="btn-primary text-[15.5px] font-semibold px-8 py-3.5 h-[50px]">
              Start Your Free Matter Intake →
            </Link>
            <Link href="/pricing" className="btn-ghost text-[15.5px] px-7 py-3.5 h-[50px]">
              View Pricing Plans
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
