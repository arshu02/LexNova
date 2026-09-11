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
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-200" style={{ background: '#05060A', color: '#F0F2FF' }}>
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute top-[800px] -left-48 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 sm:pt-40 pb-24 relative z-10 space-y-16 w-full">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-mono shadow-xs" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
            <Sparkles size={13} style={{ color: '#C084FC' }} />
            <span className="font-semibold text-white">Transparent Pricing Architecture</span>
            <span style={{ color: '#6B72A0' }}>· No Hidden Fees</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Predictable plans for every <span className="text-gradient">legal scale.</span>
          </h1>

          <p className="text-[15px] sm:text-[17px] max-w-2xl mx-auto leading-relaxed" style={{ color: '#8F96B3' }}>
            From single-matter citizen disputes and limitation countdowns to multi-partner international law firm operations.
          </p>

          {/* Controls: Currency Switcher & Annual Toggle */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
              {(['USD', 'INR', 'GBP', 'EUR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-full text-[12px] font-mono font-medium transition-all`}
                  style={currency === c ? {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.35)'
                  } : {
                    color: '#8F96B3'
                  }}
                >
                  {PRICING_DATA[c].label}
                </button>
              ))}
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full" style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="text-[13px] font-medium" style={{ color: !annual ? '#FFFFFF' : '#6B72A0' }}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                aria-label="Toggle Annual Billing"
                className="w-12 h-6 rounded-full p-0.5 relative transition-colors focus:outline-hidden"
                style={{ background: annual ? '#6366F1' : 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    annual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-[13px] font-medium flex items-center gap-1.5" style={{ color: annual ? '#FFFFFF' : '#6B72A0' }}>
                <span>Annual</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
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
                  ? 'lg:-translate-y-2'
                  : ''
              }`}
              style={plan.highlight ? {
                background: 'linear-gradient(180deg, rgba(20,22,38,0.95) 0%, rgba(10,11,18,0.95) 100%)',
                border: '2px solid rgba(99,102,241,0.6)',
                boxShadow: '0 12px 40px rgba(99,102,241,0.25)'
              } : {
                background: 'rgba(10,11,18,0.7)',
                border: '1px solid rgba(99,102,241,0.15)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
              }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider"
                  style={plan.highlight ? {
                    background: 'rgba(99,102,241,0.2)',
                    color: '#818CF8',
                    border: '1px solid rgba(99,102,241,0.4)'
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    color: '#8F96B3',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {plan.badge}
                </span>
                {plan.highlight && (
                  <span className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: '#10B981' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Recommended
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: '#8F96B3' }}>
                    {plan.desc}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-[12.5px] font-mono ml-1" style={{ color: '#6B72A0' }}>
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="pt-6 space-y-3" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                  <div className="text-[11.5px] font-mono uppercase tracking-wider" style={{ color: '#818CF8' }}>
                    Included Capabilities:
                  </div>
                  {plan.keyFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[13px] leading-snug">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: '#10B981' }}
                      />
                      <span style={{ color: plan.highlight ? '#F0F2FF' : '#A8AECF' }}>
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
                  className="w-full py-3.5 px-6 rounded-2xl font-medium text-[13.5px] transition-all flex items-center justify-center gap-2"
                  style={plan.highlight ? {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
                  } : {
                    background: 'rgba(99,102,241,0.08)',
                    color: '#818CF8',
                    border: '1px solid rgba(99,102,241,0.2)'
                  }}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Security & On-Premises Banner */}
        <div className="p-8 sm:p-10 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8" style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 32px rgba(99,102,241,0.06)' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[17px] font-bold text-white">
                Need a Custom Enterprise SLA, Sovereign Data Residency, or On-Premises LLM Cluster?
              </h4>
              <p className="text-[13.5px] leading-relaxed max-w-3xl" style={{ color: '#8F96B3' }}>
                We provide dedicated multi-node RAG deployments, custom choice-of-law finetuning, zero-retention API guarantees, and SSO/SAML integrations for Magic Circle, AmLaw 100, and institutional legal departments.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/team"
            className="px-6 py-3.5 rounded-full text-white text-[13px] font-medium transition-all shrink-0 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
          >
            <span>Speak with Legal Engineering</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Interactive Full Plan Comparison Matrix */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
            <div>
              <h3 className="text-2xl font-bold text-white">Full Feature Comparison Matrix</h3>
              <p className="text-[13.5px] mt-0.5" style={{ color: '#8F96B3' }}>
                Detailed breakdown of algorithmic, statutory, and infrastructure capabilities across tiers.
              </p>
            </div>
            <button
              onClick={() => setOpenComparison(!openComparison)}
              className="px-4 py-2 rounded-full text-[12.5px] font-medium flex items-center gap-1.5 transition-colors"
              style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}
            >
              <span>{openComparison ? 'Collapse Table' : 'Expand All Features'}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openComparison ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {openComparison && (
            <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(10,11,18,0.9)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.12)', background: 'rgba(14,16,24,0.9)' }}>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-white uppercase">
                        Feature / Capability
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-white uppercase w-[20%]">
                        Citizen Starter
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-indigo-400 uppercase w-[22%]" style={{ background: 'rgba(99,102,241,0.08)' }}>
                        Professional Counsel
                      </th>
                      <th className="py-4 px-6 font-mono text-[12px] font-bold text-white uppercase w-[22%]">
                        Global Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'rgba(99,102,241,0.08)' }}>
                    {FEATURE_CATEGORIES.map((cat, cIdx) => (
                      <React.Fragment key={cIdx}>
                        <tr style={{ background: 'rgba(99,102,241,0.04)' }}>
                          <td colSpan={4} className="py-3 px-6 font-bold font-mono text-[11px] uppercase tracking-wider" style={{ color: '#818CF8' }}>
                            {cat.category}
                          </td>
                        </tr>
                        {cat.features.map((f, fIdx) => (
                          <tr key={fIdx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-6 font-medium text-white">
                              {f.name}
                            </td>
                            <td className="py-3.5 px-6" style={{ color: '#8F96B3' }}>
                              {typeof f.starter === 'boolean' ? (
                                f.starter ? (
                                  <Check size={16} style={{ color: '#10B981' }} />
                                ) : (
                                  <span style={{ color: '#444870' }} className="font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px]" style={{ color: '#A8AECF' }}>{f.starter}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 font-medium" style={{ background: 'rgba(99,102,241,0.04)', color: '#FFFFFF' }}>
                              {typeof f.pro === 'boolean' ? (
                                f.pro ? (
                                  <Check size={16} style={{ color: '#10B981' }} />
                                ) : (
                                  <span style={{ color: '#444870' }} className="font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-semibold text-white">{f.pro}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-white">
                              {typeof f.enterprise === 'boolean' ? (
                                f.enterprise ? (
                                  <Check size={16} style={{ color: '#10B981' }} className="font-bold" />
                                ) : (
                                  <span style={{ color: '#444870' }} className="font-mono text-[12px]">—</span>
                                )
                              ) : (
                                <span className="font-mono text-[12px] font-bold text-white">{f.enterprise}</span>
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
          <div className="p-6 rounded-3xl space-y-2" style={{ background: 'rgba(10,11,18,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
              <Lock size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-white">100% Escrow Account Protection</h5>
            <p className="text-[12.5px] leading-relaxed" style={{ color: '#8F96B3' }}>
              Consultation fees are safely held in trust. Funds are transferred to counsel only after completion of the strategy conference.
            </p>
          </div>

          <div className="p-6 rounded-3xl space-y-2" style={{ background: 'rgba(10,11,18,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
              <Globe size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-white">Multi-Currency Global Invoicing</h5>
            <p className="text-[12.5px] leading-relaxed" style={{ color: '#8F96B3' }}>
              Seamlessly pay in USD, INR, GBP, or EUR with corporate tax invoicing, VAT, and GST compliance receipts generated automatically.
            </p>
          </div>

          <div className="p-6 rounded-3xl space-y-2" style={{ background: 'rgba(10,11,18,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
              <FileCheck size={18} />
            </div>
            <h5 className="font-bold text-[15px] text-white">Cancel or Downgrade Anytime</h5>
            <p className="text-[12.5px] leading-relaxed" style={{ color: '#8F96B3' }}>
              No locked contracts or hidden termination penalties. Downgrade or pause subscriptions instantly with 1-click self-serve billing.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
