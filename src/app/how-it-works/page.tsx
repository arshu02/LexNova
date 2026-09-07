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
    <div className="min-h-screen bg-white text-[#141413] selection:bg-[#F4EFEA] selection:text-[#141413] font-sans antialiased flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-20">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F4EE] border border-[#E8E4DA] text-[12px] font-mono font-semibold text-[#42403B]">
            <Cpu size={14} className="text-[#141413]" /> Technical Architecture & Workflow
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#141413] tracking-tight leading-[1.05]">
            How LexNova powers autonomous legal resolution.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-[#636059] leading-relaxed max-w-2xl">
            From plain-language dispute intake to statutory analysis, court document generation, and Bar-verified advocate collaboration — fully automated.
          </p>
        </div>

        {/* 3 Full-Bleed Technical Architecture Cards */}
        <div className="space-y-10">
          {ARCHITECTURE_LAYERS.map((layer) => {
            return (
              <motion.div
                key={layer.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="p-8 sm:p-12 bg-white border border-[#E8E4DA] rounded-3xl grid lg:grid-cols-12 gap-10 items-center shadow-xs"
              >
                {/* Left Description Side (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[13px] font-mono font-bold px-3 py-1 rounded-full bg-[#141413] text-white">
                      Step {layer.step}
                    </span>
                    <span className="text-[12.5px] text-[#87837B] font-mono font-medium tracking-wide">
                      {layer.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[26px] sm:text-[32px] font-bold text-[#141413] tracking-tight leading-tight">
                      {layer.title}
                    </h2>
                    <p className="text-[14px] font-medium mt-1 text-[#636059]">
                      {layer.subtitle}
                    </p>
                  </div>

                  <p className="text-[15px] text-[#42403B] leading-relaxed">
                    {layer.desc}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {layer.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2.5 text-[14px] text-[#2D2C2A]">
                        <CheckCircle2 size={16} className="shrink-0 text-[#141413]" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Code/JSON Architecture Terminal (5 cols) */}
                <div className="lg:col-span-5 bg-[#141413] border border-[#141413] rounded-2xl p-6 shadow-md font-mono text-[12.5px] text-white space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10.5px] uppercase font-bold text-white/50 tracking-wider">
                      {layer.codeSnippet.header}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto text-[#E8E4DA]">
                    {layer.codeSnippet.code}
                  </pre>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
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
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
              Enterprise Grade Security & Compliance
            </h2>
            <p className="font-serif text-lg text-[#636059]">
              Built with bank-level encryption and strict adherence to Bar Council regulations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: "AES-256 Encryption", desc: "All pleadings, consultation transcripts, and evidence files are encrypted in transit and at rest." },
              { icon: ShieldCheck, title: "Bar Council Verification", desc: "Every advocate's enrollment certificate, active standing, and state bar license is rigorously verified." },
              { icon: Database, title: "Confidential Vaults", desc: "Attorney-client privilege isolation ensures your dispute records are private and never monetized." },
              { icon: Scale, title: "Court Compliant", desc: "Notices and petitions follow standard civil procedure code (CPC) and High Court filing formats." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-white border border-[#E8E4DA] rounded-2xl p-6 space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#E8E4DA] flex items-center justify-center text-[#141413]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#141413]">{p.title}</h3>
                  <p className="text-[13px] text-[#636059] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-10 sm:p-14 bg-white border border-[#E8E4DA] rounded-3xl text-center space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F4EE] border border-[#E8E4DA] text-[12px] font-mono text-[#42403B]">
            <Sparkles size={13} className="text-[#141413]" /> Free to start · No payment method needed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight">
            Ready to resolve your dispute?
          </h2>
          <p className="font-serif text-lg text-[#636059] max-w-lg mx-auto leading-relaxed">
            Start a free AI intake today. Get immediate statutory clarity and connect with top Bar Council advocates.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/chat" className="px-7 py-3 rounded-full bg-[#141413] hover:bg-black text-white text-[14px] font-medium shadow-xs transition-all">
              Start Free Case Intake &rarr;
            </Link>
            <Link href="/pricing" className="px-6 py-3 rounded-full border border-[#DED9CE] hover:border-[#B5AFA2] text-[#141413] text-[14px] font-medium transition-colors">
              View Pricing Plans
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
