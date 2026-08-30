'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check, ArrowRight, ShieldCheck, Sparkles, Scale, Video, Zap, Building2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: "Citizen Starter",
    desc: "For individuals and citizens evaluating legal disputes and limitation deadlines.",
    priceMonthly: "₹0",
    priceAnnual: "₹0",
    period: "forever free",
    badge: null,
    highlight: false,
    cta: "Start Free Assessment",
    ctaLink: "/dashboard/chat",
    features: [
      "AI Neural Case Assessment (42ms)",
      "Statutory Act & Section Mapping",
      "Limitation Clock Countdown",
      "Supreme Court Precedent Search",
      "High Court Advocate Matching",
      "Standard Community Support",
    ],
  },
  {
    name: "Professional Advocate",
    desc: "For practicing advocates, solo legal counsels, and litigation teams.",
    priceMonthly: "₹799",
    priceAnnual: "₹639",
    period: "per month, billed annually",
    badge: "Most Popular",
    highlight: true,
    cta: "Start 14-Day Free Trial",
    ctaLink: "/auth/signup",
    features: [
      "Everything in Citizen Starter",
      "Court-Ready RPAD Demand Notice Drafting",
      "Section 138 Cheque Bounce & Recovery Notices",
      "Consumer Court (NCDRC/DCDRC) Complaints",
      "Digital Watermark & Seal Customization",
      "Client Video Consultation Room with Jitsi",
      "Priority WhatsApp & Email Support",
    ],
  },
  {
    name: "Enterprise Law Firm",
    desc: "For multi-advocate law firms, corporate legal teams, and enterprise enterprises.",
    priceMonthly: "₹4,999",
    priceAnnual: "₹3,999",
    period: "per workspace / month",
    badge: "Enterprise Grade",
    highlight: false,
    cta: "Deploy Enterprise Workspace",
    ctaLink: "/dashboard/team",
    features: [
      "Everything in Professional Advocate",
      "Unlimited Multi-Tenant Team Members",
      "Role-Based Access (Partner, Senior, Associate)",
      "Public REST API v1 (120 req/min)",
      "Automated PII Sanitization Engine",
      "Immutable SOC 2 / ISO 27001 SIEM Audit Logs",
      "Dedicated Enterprise Account Manager & SLA",
    ],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#05070D] text-white selection:bg-blue-600 selection:text-white flex flex-col">
      <Navbar />

      {/* Hero Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-glow from-blue-600/[0.1] to-transparent rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 pt-36 sm:pt-44 pb-28 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-semibold">
            <Sparkles size={13} /> Transparent Pricing Architecture
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gradient leading-tight">
            Predictable Plans for Every Legal Scale
          </h1>
          <p className="text-[16px] text-[#8D9CB0] max-w-xl mx-auto">
            From single-matter citizen assessments to multi-partner enterprise law firm infrastructure.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-[13.5px] font-semibold ${!annual ? 'text-white' : 'text-[#8D9CB0]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-7 rounded-full bg-white/[0.08] border border-white/[0.12] p-1 relative transition-colors focus:outline-none"
            >
              <div className={`w-5 h-5 rounded-full bg-blue-500 transition-transform ${annual ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[13.5px] font-semibold flex items-center gap-1.5 ${annual ? 'text-white' : 'text-[#8D9CB0]'}`}>
              <span>Annual</span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#0E1528] to-[#080C17] border-2 border-blue-500/50 shadow-2xl shadow-blue-500/10 -translate-y-2'
                  : 'bg-[#080B14]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-[13px] text-[#8D9CB0] mt-1 leading-relaxed">{plan.desc}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {annual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-[13px] text-[#8D9CB0] ml-1">/ {annual ? 'mo (billed annually)' : 'month'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[13.5px] text-[#CBD5E1]">
                      <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.ctaLink}
                  className={`w-full py-3 rounded-xl font-semibold text-[14px] transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'btn-glow-blue shadow-lg shadow-blue-600/30'
                      : 'btn-ghost'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Security Section */}
        <div className="p-8 rounded-3xl bg-[#080B14] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-white">Need a Custom Enterprise SLA or On-Premises Deployment?</h4>
              <p className="text-[13px] text-[#8D9CB0]">We support custom compliance requirements, SSO/SAML integration, and high-concurrency dedicated RAG clusters.</p>
            </div>
          </div>

          <Link href="/dashboard/team" className="btn-primary shrink-0 text-[13.5px]">
            Contact Legal Engineering →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
