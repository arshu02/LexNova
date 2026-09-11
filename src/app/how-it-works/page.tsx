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
  "principal_claim": "₹95,00,000 (Cross-Border Tech Retainer)",
  "accrued_benefits": "₹22,00,000 (Statutory Severance)",
  "total_damages": "₹1,17,00,000 + 18% Statutory Interest",
  "governing_statute": "Payment of Wages Act & BNS § 318",
  "forum": "Commercial Division, High Court of Bombay"
}`
    },
    accent: "blue"
  },
  {
    step: "02",
    badge: "Layer 2 · Statutory Mapping & Precedent Vector Retrieval",
    title: "Statutory Precision & Automated Limitation Clock",
    subtitle: "Indexed across 50,000+ Supreme Court & High Court Judgments",
    desc: "LexNova's neural RAG vector engine cross-references your factual pleading against central statutes (CPC, IPC/BNS, CPA 2019, Transfer of Property Act, RERA) and calculates exact statutory limitation deadlines under the Limitation Act 1963 to prevent fatal time-bar dismissals.",
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
    "act": "Commercial Courts Act 2015 · Section 12A",
    "citation": "Patil Automation v. Rakheja (2022) 10 SCC 1",
    "limitation_window": "Article 55, Limitation Act 1963 (3 Years)",
    "days_remaining_to_notice": 28,
    "mandatory_pre_action": "Pre-Institution Mediation & Settlement",
    "statutory_relief": "100% Principal Debt + 18% Interest"
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
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-200 font-sans antialiased" style={{ background: '#05060A', color: '#F0F2FF' }}>
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-20 relative z-10 w-full">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-mono font-semibold" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
            <Cpu size={14} /> Technical Architecture &amp; Workflow
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.05]">
            How LexNova powers <span className="text-gradient">autonomous legal resolution.</span>
          </h1>
          <p className="text-xl sm:text-2xl leading-relaxed max-w-2xl" style={{ color: '#8F96B3' }}>
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
                className="p-8 sm:p-12 rounded-3xl grid lg:grid-cols-12 gap-10 items-center"
                style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
              >
                {/* Left Description Side (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[13px] font-mono font-bold px-3 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                      Step {layer.step}
                    </span>
                    <span className="text-[12.5px] font-mono font-medium tracking-wide" style={{ color: '#818CF8' }}>
                      {layer.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-tight">
                      {layer.title}
                    </h2>
                    <p className="text-[14px] font-medium mt-1" style={{ color: '#C084FC' }}>
                      {layer.subtitle}
                    </p>
                  </div>

                  <p className="text-[15px] leading-relaxed" style={{ color: '#8F96B3' }}>
                    {layer.desc}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {layer.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2.5 text-[14px]" style={{ color: '#F0F2FF' }}>
                        <CheckCircle2 size={16} className="shrink-0" style={{ color: '#10B981' }} />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Code/JSON Architecture Terminal (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl p-6 font-mono text-[12.5px] space-y-3" style={{ background: 'rgba(5,6,10,0.9)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
                  <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10.5px] uppercase font-bold tracking-wider" style={{ color: '#818CF8' }}>
                      {layer.codeSnippet.header}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto" style={{ color: '#A8AECF' }}>
                    {layer.codeSnippet.code}
                  </pre>

                  <div className="pt-2 flex items-center justify-between text-[11px]" style={{ borderTop: '1px solid rgba(99,102,241,0.15)', color: '#6B72A0' }}>
                    <span>STATUS: VALIDATED</span>
                    <span className="flex items-center gap-1.5" style={{ color: '#10B981' }}>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enterprise Grade Security &amp; Compliance
            </h2>
            <p className="text-lg" style={{ color: '#8F96B3' }}>
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
                <div key={i} className="rounded-2xl p-6 space-y-3" style={{ background: 'rgba(10,11,18,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[16px] font-bold text-white">{p.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#8F96B3' }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-10 sm:p-14 rounded-3xl text-center space-y-6" style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 12px 40px rgba(99,102,241,0.1)' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[12px] font-mono" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
            <Sparkles size={13} style={{ color: '#10B981' }} /> Free to start · No payment method needed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to resolve your dispute?
          </h2>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: '#8F96B3' }}>
            Start a free AI intake today. Get immediate statutory clarity and connect with top Bar Council advocates.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/chat"
              className="px-7 py-3.5 rounded-full text-white text-[14px] font-medium transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
            >
              <span>Start Free Case Intake</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-full text-[14px] font-medium transition-colors"
              style={{ border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8', background: 'rgba(99,102,241,0.05)' }}
            >
              View Pricing Plans
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
