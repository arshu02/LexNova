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
      { name: 'Cross-Border Precedent Citations (Delaware, Rolls, SIAC, SC)', starter: '10 queries/mo', pro: 'Unlimited', enterprise: 'Unlimited + Dedicated Corpus' },
    ],
  },
  {
    category: 'Court Notices & Document Drafting',
    features: [
      { name: 'Court-Admissible Pre-Action Protocol Notices', starter: '1 trial notice', pro: 'Unlimited drafts', enterprise: 'Unlimited drafts' },
      { name: 'Section 138 NI & UCC §2-708 Formal Demand Letters', starter: false, pro: true, enterprise: true },
      { name: 'Custom Law Firm Watermarks, Seals & Letterheads', starter: false, pro: true, enterprise: true },
      { name: 'Automated PII Masking & GDPR/DPDPA Scrubbing', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Counsel Network & Escrow',
    features: [
      { name: 'Access to 140+ Bar-Admitted Global Advocates', starter: true, pro: true, enterprise: true },
      { name: 'LexNova Escrow Account Protection', starter: true, pro: true, enterprise: true },
      { name: 'Encrypted HD Video Strategy Rooms (Jitsi/WebRTC)', starter: false, pro: true, enterprise: true },
      { name: 'Priority Same-Day Advocate Retainer Slots', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Developer API, Team & Security',
    features: [
      { name: 'Team Seats Included', starter: '1 user', pro: 'Up to 3 users', enterprise: 'Unlimited team seats' },
      { name: 'Public REST API v1 Access', starter: false, pro: '60 req/min', enterprise: '1,200 req/min + Custom Webhooks' },
      { name: 'SOC 2 Type II & ISO 27001 SIEM Audit Logs', starter: false, pro: false, enterprise: true },
      { name: 'Dedicated Legal Engineer & 99.99% Uptime SLA', starter: false, pro: false, enterprise: true },
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
      badge: 'Free Forever',
      desc: 'For individuals, founders, and startups needing rapid legal triage and statute of limitations checks.',
      price: curr.starter,
      period: 'forever free',
      highlight: false,
      cta: 'Start Free Case Assessment',
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
    <div className="min-h-screen bg-white text-[#141413] flex flex-col selection:bg-[#F4EFEA] selection:text-[#141413]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 sm:pt-40 pb-24 relative z-10 space-y-16 w-full">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E4DA] text-[#636059] text-[12px] font-mono shadow-xs">
            <Sparkles size={13} className="text-[#141413]" />
            <span className="font-semibold text-[#141413]">Transparent Pricing Architecture</span>
            <span className="text-[#87837B]">· No Hidden Fees</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.1]">
            Predictable plans for every legal scale.
          </h1>

          <p className="text-[15px] sm:text-[17px] text-[#636059] max-w-2xl mx-auto leading-relaxed">
            From single-matter citizen disputes and limitation countdowns to multi-partner international law firm operations.
          </p>

          {/* Controls: Currency Switcher & Annual Toggle */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#E8E4DA] shadow-xs">
              {(['USD', 'INR', 'GBP', 'EUR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-full text-[12px] font-mono font-medium transition-all ${
                    currency === c
                      ? 'bg-[#141413] text-white shadow-xs'
                      : 'text-[#636059] hover:text-[#141413]'
                  }`}
                >
                  {PRICING_DATA[c].label}
                </button>
              ))}
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-[#E8E4DA] shadow-xs">
              <span className={`text-[13px] font-medium ${!annual ? 'text-[#141413] font-semibold' : 'text-[#87837B]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                aria-label="Toggle Annual Billing"
                className="w-12 h-6 rounded-full bg-[#E8E4DA] p-0.5 relative transition-colors focus:outline-hidden"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#141413] shadow-xs transition-transform ${
                    annual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-[13px] font-medium flex items-center gap-1.5 ${annual ? 'text-[#141413] font-semibold' : 'text-[#87837B]'}`}>
                <span>Annual</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Save 20%
                </span>
              </span>
            </div>

          </div>
        </div>

        {/* 3-Column Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? 'bg-[#141413] text-white border-2 border-[#141413] shadow-xl lg:-translate-y-2'
                  : 'bg-white text-[#141413] border border-[#E8E4DA] shadow-xs hover:border-[#141413]/30 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                    plan.highlight
                      ? 'bg-white/20 text-white border border-white/20'
                      : 'bg-[#F7F4EE] text-[#42403B] border border-[#E8E4DA]'
                  }`}
                >
                  {plan.badge}
                </span>
                {plan.highlight && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Recommended
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-6">
                <div>
                  <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-[#141413]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-[13.5px] mt-2 leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-[#636059]'}`}>
                    {plan.desc}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${plan.highlight ? 'text-white' : 'text-[#141413]'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-[12.5px] font-mono ml-1 ${plan.highlight ? 'text-white/60' : 'text-[#87837B]'}`}>
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className={`pt-6 border-t space-y-3 ${plan.highlight ? 'border-white/10' : 'border-[#E8E4DA]'}`}>
                  <div className={`text-[11.5px] font-mono uppercase tracking-wider ${plan.highlight ? 'text-white/50' : 'text-[#87837B]'}`}>
                    Included Capabilities:
                  </div>
                  {plan.keyFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[13px] leading-snug">
                      <CheckCircle2
                        size={16}
                        className={`shrink-0 mt-0.5 ${
                          plan.highlight ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                      <span className={plan.highlight ? 'text-white/90' : 'text-[#42403B]'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-8 mt-6 border-t border-transparent">
                <Link
                  href={plan.ctaLink}
                  className={`w-full py-3.5 px-6 rounded-2xl font-medium text-[13.5px] transition-all flex items-center justify-center gap-2 shadow-xs ${
                    plan.highlight
                      ? 'bg-white text-[#141413] hover:bg-[#FAF8F5]'
                      : 'bg-[#141413] text-white hover:bg-black'
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
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F4EE] border border-[#E8E4DA] flex items-center justify-center text-[#141413] shrink-0">
              <ShieldCheck size={28} className="text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-[17px] font-bold text-[#141413]">
                  Need a Custom Enterprise SLA, Sovereign Data Residency, or On-Premises LLM Cluster?
                </h4>
              </div>
              <p className="text-[13.5px] text-[#636059] leading-relaxed max-w-3xl">
                We provide dedicated multi-node RAG deployments, custom choice-of-law finetuning, zero-retention API guarantees, and SSO/SAML integrations for Magic Circle, AmLaw 100, and institutional legal departments.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/team"
            className="px-6 py-3.5 rounded-full bg-[#141413] text-white text-[13px] font-medium hover:bg-black transition-colors shrink-0 shadow-xs flex items-center gap-2"
          >
            <span>Speak with Legal Engineering</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Interactive Full Plan Comparison Matrix */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#141413]">Full Feature Comparison Matrix</h3>
              <p className="text-[13.5px] text-[#636059] mt-0.5">
                Detailed breakdown of algorithmic, statutory, and infrastructure capabilities across tiers.
              </p>
            </div>
            <button
              onClick={() => setOpenComparison(!openComparison)}
              className="px-4 py-2 rounded-full border border-[#E8E4DA] bg-white text-[12.5px] font-medium text-[#141413] hover:bg-[#F7F4EE] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{openComparison ? 'Collapse Table' : 'Expand All Features'}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openComparison ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {openComparison && (
            <div className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E8E4DA] bg-[#FAF8F5]">
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-[#141413] uppercase">
                        Feature / Capability
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-[#141413] uppercase w-[20%]">
                        Citizen Starter
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-[#141413] uppercase w-[22%] bg-[#F0ECE1]/50">
                        Professional Counsel
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-[#141413] uppercase w-[22%]">
                        Global Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DA]">
                    {FEATURE_CATEGORIES.map((cat, cIdx) => (
                      <React.Fragment key={cIdx}>
                        <tr className="bg-[#FAF8F5]/80">
                          <td colSpan={4} className="py-3 px-6 font-bold font-mono text-[11px] text-[#87837B] uppercase tracking-wider">
                            {cat.category}
                          </td>
                        </tr>
                        {cat.features.map((f, fIdx) => (
                          <tr key={fIdx} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3.5 px-6 font-medium text-[#141413]">
                              {f.name}
                            </td>
                            <td className="py-3.5 px-6 text-[#636059]">
                              {typeof f.starter === 'boolean' ? (
                                f.starter ? (
                                  <Check size={16} className="text-emerald-600" />
                                ) : (
                                  <span className="text-[#87837B] font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] text-[#42403B]">{f.starter}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-[#141413] font-medium bg-[#F0ECE1]/20">
                              {typeof f.pro === 'boolean' ? (
                                f.pro ? (
                                  <Check size={16} className="text-emerald-600" />
                                ) : (
                                  <span className="text-[#87837B] font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-semibold text-[#141413]">{f.pro}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-[#141413]">
                              {typeof f.enterprise === 'boolean' ? (
                                f.enterprise ? (
                                  <Check size={16} className="text-emerald-600 font-bold" />
                                ) : (
                                  <span className="text-[#87837B] font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-bold text-[#141413]">{f.enterprise}</span>
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
          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DA] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#E8E4DA] flex items-center justify-center text-[#141413]">
              <Lock size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-[#141413]">100% Escrow Account Protection</h5>
            <p className="text-[12.5px] text-[#636059] leading-relaxed">
              Consultation fees are safely held in trust. Funds are transferred to counsel only after completion of the strategy conference.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DA] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#E8E4DA] flex items-center justify-center text-[#141413]">
              <Globe size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-[#141413]">Multi-Currency Global Invoicing</h5>
            <p className="text-[12.5px] text-[#636059] leading-relaxed">
              Seamlessly pay in USD, INR, GBP, or EUR with corporate tax invoicing, VAT, and GST compliance receipts generated automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DA] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#E8E4DA] flex items-center justify-center text-[#141413]">
              <FileCheck size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-[#141413]">Cancel or Downgrade Anytime</h5>
            <p className="text-[12.5px] text-[#636059] leading-relaxed">
              No locked contracts or hidden termination penalties. Downgrade or pause subscriptions instantly with 1-click self-serve billing.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
