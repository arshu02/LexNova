'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Check, ArrowRight, ShieldCheck, Sparkles, Scale, Video, Zap,
  Building2, HelpCircle, ChevronRight, CheckCircle2, Lock, Globe,
  FileCheck, Shield, ChevronDown
} from 'lucide-react';

type Currency = 'USD' | 'INR' | 'GBP' | 'EUR';

interface PlanPricing {
  monthly: number;
  annual: number;
  symbol: string;
  format: (amount: number) => string;
}

const PRICING_DATA: Record<Currency, { symbol: string; label: string; starter: string; pro: PlanPricing; ent: PlanPricing }> = {
  USD: {
    symbol: '$',
    label: 'USD ($)',
    starter: '$0',
    pro: {
      monthly: 39,
      annual: 31,
      symbol: '$',
      format: (n) => `$${n}`,
    },
    ent: {
      monthly: 199,
      annual: 159,
      symbol: '$',
      format: (n) => `$${n}`,
    },
  },
  INR: {
    symbol: '₹',
    label: 'INR (₹)',
    starter: '₹0',
    pro: {
      monthly: 799,
      annual: 639,
      symbol: '₹',
      format: (n) => `₹${n.toLocaleString('en-IN')}`,
    },
    ent: {
      monthly: 4999,
      annual: 3999,
      symbol: '₹',
      format: (n) => `₹${n.toLocaleString('en-IN')}`,
    },
  },
  GBP: {
    symbol: '£',
    label: 'GBP (£)',
    starter: '£0',
    pro: {
      monthly: 29,
      annual: 23,
      symbol: '£',
      format: (n) => `£${n}`,
    },
    ent: {
      monthly: 159,
      annual: 127,
      symbol: '£',
      format: (n) => `£${n}`,
    },
  },
  EUR: {
    symbol: '€',
    label: 'EUR (€)',
    starter: '€0',
    pro: {
      monthly: 35,
      annual: 28,
      symbol: '€',
      format: (n) => `€${n}`,
    },
    ent: {
      monthly: 189,
      annual: 151,
      symbol: '€',
      format: (n) => `€${n}`,
    },
  },
};

const FEATURE_CATEGORIES = [
  {
    category: 'Autonomous Legal AI & Research',
    features: [
      { name: 'AI Neural Case Assessment (< 40ms)', starter: true, pro: true, enterprise: true },
      { name: 'Statutory Act & Section Conflict Mapping', starter: true, pro: true, enterprise: true },
      { name: 'Multi-Jurisdiction Limitation Countdown', starter: '3 jurisdictions', pro: 'All 5 jurisdictions', enterprise: 'Unlimited custom' },
      { name: 'Direct Case Law & Precedent Citations', starter: 'Top 3 citations', pro: 'Unlimited deep search', enterprise: 'Unlimited + Sovereign RAG' },
      { name: 'Cross-Border Arbitration Risk Probability', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Court Notices & Document Studio',
    features: [
      { name: 'Pre-Action Protocol Demand Letter Generator', starter: '1 per month', pro: 'Unlimited generated', enterprise: 'Unlimited + Batch Bulk API' },
      { name: 'Jurisdiction-Compliant Formats (UCC, CPR, BNS)', starter: 'US & UK basic', pro: 'All 5 Global Standards', enterprise: 'Custom Firm Templates' },
      { name: 'Digital Signatures & Tamper-Proof Timestamps', starter: false, pro: true, enterprise: true },
      { name: 'Encrypted Client Document Repository', starter: '500 MB', pro: '25 GB Vault', enterprise: 'Unlimited Enterprise S3' },
      { name: 'Auto-Redaction of Personally Identifiable Info (PII)', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Verified Advocate Matching & Escrow',
    features: [
      { name: 'Access to 140+ Admitted Advocate Directory', starter: true, pro: true, enterprise: true },
      { name: 'Direct Video Consultation Rooms (Jitsi Powered)', starter: true, pro: true, enterprise: true },
      { name: 'LexNova Escrow Fee Protection Guarantee', starter: true, pro: true, enterprise: true },
      { name: 'Priority Advocate Availability Triage', starter: false, pro: true, enterprise: true },
      { name: 'Dedicated Case Coordinator & Concierge Desk', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Security, Compliance & Infrastructure',
    features: [
      { name: '256-Bit TLS & At-Rest Encryption', starter: true, pro: true, enterprise: true },
      { name: 'DPDPA 2023 & GDPR Compliant Data Governance', starter: true, pro: true, enterprise: true },
      { name: 'SOC 2 Type II Immutable Audit Logging', starter: false, pro: false, enterprise: true },
      { name: 'Single Sign-On (SAML / Okta / Azure AD)', starter: false, pro: false, enterprise: true },
      { name: 'Guaranteed 99.99% Uptime SLA', starter: false, pro: '99.9% Uptime', enterprise: '99.99% Guaranteed SLA' },
      { name: 'Dedicated Legal Solutions Architect', starter: false, pro: false, enterprise: true },
    ],
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [annual, setAnnual] = useState(true);
  const [openComparison, setOpenComparison] = useState(false);

  const curr = PRICING_DATA[currency];

  const plans = [
    {
      id: 'starter',
      name: 'Citizen Starter',
      badge: 'Free Tier',
      desc: 'Essential statutory analysis, limitation countdowns, and advocate discovery for individuals and small disputes.',
      price: curr.starter,
      period: 'forever free',
      highlight: false,
      cta: 'Get Started Free',
      ctaLink: '/dashboard/chat',
      keyFeatures: [
        'AI Neural Case Intake & Classification',
        'Statute of Limitations Clock (3 Jurisdictions)',
        'Basic Court Precedent Search',
        'Direct Access to Verified Advocate Directory',
        'LexNova Escrow Consultation Protection',
        'Community & Knowledge Base Support',
      ],
    },
    {
      id: 'pro',
      name: 'Professional Counsel',
      badge: 'Most Popular',
      desc: 'For practicing attorneys, solicitors, solo litigators, and in-house corporate legal teams.',
      price: annual ? curr.pro.format(curr.pro.annual) : curr.pro.format(curr.pro.monthly),
      period: annual ? 'per month, billed annually' : 'per month, billed monthly',
      highlight: true,
      cta: 'Start 14-Day Free Trial',
      ctaLink: '/auth/signup',
      keyFeatures: [
        'Everything in Citizen Starter, plus:',
        'Unlimited Court-Admissible Notice Generation',
        'UCC, UK CPR & Section 138 Demand Letter Drafting',
        'Full 5-Jurisdiction Global Limitation Tracker',
        'Encrypted Video Strategy Room (Jitsi Powered)',
        'Custom Law Firm Watermark & Bar Seal',
        'REST API Access (60 req/min)',
        'Priority WhatsApp & Concierge Support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Global Enterprise',
      badge: 'Enterprise Grade',
      desc: 'For international law firms, multi-partner practices, and enterprise platforms with high case velocity.',
      price: annual ? curr.ent.format(curr.ent.annual) : curr.ent.format(curr.ent.monthly),
      period: annual ? 'per workspace / mo, billed annually' : 'per workspace / month',
      highlight: false,
      cta: 'Deploy Enterprise Workspace',
      ctaLink: '/dashboard/team',
      keyFeatures: [
        'Everything in Professional Counsel, plus:',
        'Unlimited Multi-Tenant Advocate Seats',
        'High-Throughput REST API (1,200 req/min)',
        'Automated PII Redaction & Data Sanitization',
        'Zero-Knowledge Client Document Vault',
        'Immutable SIEM & SOC 2 Compliance Audit Trails',
        'Custom SSO (SAML / Okta / Azure AD)',
        'Dedicated Legal Engineering SLA (1-Hr Response)',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-800 antialiased font-sans bg-[#F8FAFC] text-slate-900">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 relative z-10 space-y-16 w-full">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Transparent Pricing Architecture</span>
            <span className="text-slate-400">· No Hidden Fees</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Predictable plans for every <span className="text-gradient">legal scale.</span>
          </h1>

          <p className="text-[15px] sm:text-[17px] max-w-2xl mx-auto leading-relaxed text-slate-600 font-normal">
            From single-matter citizen disputes and limitation countdowns to multi-partner international law firm operations.
          </p>

          {/* Controls: Currency Switcher & Annual Toggle */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200/90 shadow-xs">
              {(['USD', 'INR', 'GBP', 'EUR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-mono font-bold transition-all ${
                    currency === c
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {PRICING_DATA[c].label}
                </button>
              ))}
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs">
              <span className={`text-[13px] font-semibold ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                aria-label="Toggle Annual Billing"
                className="w-12 h-6 rounded-full p-0.5 relative transition-colors focus:outline-hidden"
                style={{ background: annual ? '#4F46E5' : '#CBD5E1' }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    annual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-[13px] font-semibold flex items-center gap-1.5 ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
                <span>Annual</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Save 20%
                </span>
              </span>
            </div>

          </div>
        </div>

        {/* 3-Column Pricing Cards (Pasted on Clean White Canvas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative bg-white ${
                plan.highlight
                  ? 'border-2 border-indigo-600 shadow-[0_16px_40px_rgba(99,102,241,0.14)] lg:-translate-y-2 ring-4 ring-indigo-500/10'
                  : 'border border-slate-200/90 shadow-[0_4px_25px_rgba(15,23,42,0.05)] hover:border-slate-300'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                    plan.highlight
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {plan.badge}
                </span>
                {plan.highlight && (
                  <span className="text-[11px] font-mono font-bold flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Recommended
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-[13.5px] mt-2 leading-relaxed text-slate-600">
                    {plan.desc}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-[12.5px] font-mono ml-1 text-slate-500 font-semibold">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="pt-6 space-y-3 border-t border-slate-150">
                  <div className="text-[11.5px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                    Included Capabilities:
                  </div>
                  {plan.keyFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[13px] leading-snug">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 mt-0.5 text-emerald-600"
                      />
                      <span className={`font-medium ${plan.highlight ? 'text-slate-800 font-semibold' : 'text-slate-600'}`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-8 mt-6">
                <Link
                  href={plan.ctaLink}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-[13.5px] transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Security & On-Premises Banner */}
        <div className="p-8 sm:p-10 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 bg-white border border-slate-200/90 shadow-[0_4px_25px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[17px] font-bold text-slate-900">
                Need a Custom Enterprise SLA, Sovereign Data Residency, or On-Premises LLM Cluster?
              </h4>
              <p className="text-[13.5px] leading-relaxed max-w-3xl text-slate-600 font-normal">
                We provide dedicated multi-node RAG deployments, custom choice-of-law finetuning, zero-retention API guarantees, and SSO/SAML integrations for Magic Circle, AmLaw 100, and institutional legal departments.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/team"
            className="px-6 py-3.5 rounded-full text-white text-[13px] font-bold transition-all shrink-0 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            <span>Speak with Legal Engineering</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Interactive Full Plan Comparison Matrix */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Full Feature Comparison Matrix</h3>
              <p className="text-[13.5px] mt-0.5 text-slate-600">
                Detailed breakdown of algorithmic, statutory, and infrastructure capabilities across tiers.
              </p>
            </div>
            <button
              onClick={() => setOpenComparison(!openComparison)}
              className="px-4 py-2 rounded-full text-[12.5px] font-bold flex items-center gap-1.5 transition-colors bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 shadow-xs"
            >
              <span>{openComparison ? 'Collapse Table' : 'Expand All Features'}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openComparison ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {openComparison && (
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-slate-900 uppercase">
                        Feature / Capability
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-slate-900 uppercase w-[20%]">
                        Citizen Starter
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-indigo-700 uppercase w-[22%] bg-indigo-50/50">
                        Professional Counsel
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-slate-900 uppercase w-[22%]">
                        Global Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FEATURE_CATEGORIES.map((cat, cIdx) => (
                      <React.Fragment key={cIdx}>
                        <tr className="bg-slate-50/80">
                          <td colSpan={4} className="py-3 px-6 font-bold font-mono text-[11px] uppercase tracking-wider text-indigo-700">
                            {cat.category}
                          </td>
                        </tr>
                        {cat.features.map((f, fIdx) => (
                          <tr key={fIdx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-6 font-semibold text-slate-800">
                              {f.name}
                            </td>
                            <td className="py-3.5 px-6 text-slate-600 font-medium">
                              {typeof f.starter === 'boolean' ? (
                                f.starter ? (
                                  <Check size={16} className="text-emerald-600" />
                                ) : (
                                  <span className="font-mono text-[12px] text-slate-300">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] text-slate-600">{f.starter}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 font-medium bg-indigo-50/20 text-slate-800">
                              {typeof f.pro === 'boolean' ? (
                                f.pro ? (
                                  <Check size={16} className="text-emerald-600 font-bold" />
                                ) : (
                                  <span className="font-mono text-[12px] text-slate-300">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-bold text-slate-900">{f.pro}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-slate-800">
                              {typeof f.enterprise === 'boolean' ? (
                                f.enterprise ? (
                                  <Check size={16} className="text-emerald-600 font-bold" />
                                ) : (
                                  <span className="font-mono text-[12px] text-slate-300">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-bold text-slate-900">{f.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Transparent Escrow Guarantee Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl space-y-2 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Lock size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-slate-900">100% Escrow Account Protection</h5>
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              Consultation fees are safely held in trust. Funds are transferred to counsel only after completion of the strategy conference.
            </p>
          </div>

          <div className="p-6 rounded-3xl space-y-2 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Globe size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-slate-900">Multi-Currency Global Invoicing</h5>
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              Seamlessly pay in USD, INR, GBP, or EUR with corporate tax invoicing, VAT, and GST compliance receipts generated automatically.
            </p>
          </div>

          <div className="p-6 rounded-3xl space-y-2 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-200 text-indigo-700">
              <FileCheck size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-slate-900">Cancel or Downgrade Anytime</h5>
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              No locked contracts or hidden termination penalties. Downgrade or pause subscriptions instantly with 1-click self-serve billing.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
