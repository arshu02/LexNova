'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronRight, ShieldCheck, Star, Clock,
  CheckCircle2, Sparkles, X, Check, FileSignature,
  Cpu, FileCheck, ChevronDown
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ─── Feature Navigation Items ───────────────────────────────── */
const FEATURES = [
  {
    id: 'intake',
    num: '01',
    title: 'Plain-Language Intake',
    desc: 'Just describe what happened. No legal jargon, no confusing forms. LexNova understands your situation in plain English and extracts the facts, parties, and timelines automatically.',
    tryLabel: 'Try: "My landlord is keeping my deposit"',
    tryQuery: 'My landlord is keeping my security deposit and refuses to give it back.',
    preview: {
      badge: 'AI Parsing Complete',
      badgeColor: '#10B981',
      items: [
        { label: 'Dispute Type', val: 'Security Deposit Withholding', color: '#3B82F6' },
        { label: 'Claimant', val: 'Tenant (You)', color: '#8B5CF6' },
        { label: 'Claim Amount', val: '$3,500 · Fully Quantified', color: '#F59E0B' },
        { label: 'Evidence Needed', val: 'Lease + Move-Out Video', color: '#10B981' },
      ],
    },
  },
  {
    id: 'limitation',
    num: '02',
    title: 'Limitation Audit',
    desc: 'LexNova cross-checks your dispute against 50+ statutory codes and calculates exact limitation deadlines. You\'ll always know how many days you have before your claim legally expires.',
    tryLabel: 'Try: "Section 138 cheque bounce notice"',
    tryQuery: 'A cheque of ₹2,50,000 was returned unpaid due to insufficient funds.',
    preview: {
      badge: '⚠️ 28 Days Remaining',
      badgeColor: '#F59E0B',
      items: [
        { label: 'Governing Statute', val: 'Section 138 NI Act', color: '#EF4444' },
        { label: 'Limitation Period', val: '30 Days from Dishonour', color: '#F59E0B' },
        { label: 'Days Elapsed', val: '2 Days', color: '#64748B' },
        { label: 'Days Remaining', val: '28 Days — Act Now', color: '#EF4444' },
      ],
    },
  },
  {
    id: 'notice',
    num: '03',
    title: 'Court-Ready Notices',
    desc: 'Generate jurisdictionally accurate pre-action demand notices in under 60 seconds. RPAD-compliant (India), CPR Pre-Action (UK), UCC §2-708 (US). Court-admissible PDFs ready to serve.',
    tryLabel: 'Try: "Draft demand notice for unpaid salary"',
    tryQuery: 'My employer has withheld 3 months salary of ₹1,20,000. Draft a legal notice.',
    preview: {
      badge: '✓ Court Admissible PDF',
      badgeColor: '#10B981',
      items: [
        { label: 'Notice Type', val: 'Statutory 15-Day Demand', color: '#6366F1' },
        { label: 'Format', val: 'RPAD / Registered Post AD', color: '#8B5CF6' },
        { label: 'Statutory Basis', val: 'Payment of Wages Act §15', color: '#3B82F6' },
        { label: 'Digital Seal', val: 'Affixed & Timestamped', color: '#10B981' },
      ],
    },
  },
  {
    id: 'advocates',
    num: '04',
    title: 'Verified Advocates',
    desc: 'Review Bar-certified attorneys, King\'s Counsel, and SIAC arbitrators. Check credentials, real-time availability, and verified case counts. Book a 1-click encrypted video strategy session.',
    tryLabel: 'Try: "Find a cheque bounce specialist"',
    tryQuery: 'Find me a Sec 138 cheque bounce specialist advocate in Mumbai.',
    preview: {
      badge: '● Available Now',
      badgeColor: '#10B981',
      items: [
        { label: 'Advocate', val: 'Adv. Rajesh Sharma', color: '#1E293B' },
        { label: 'Bar License', val: 'BCM #3081/2010 · Verified', color: '#10B981' },
        { label: 'Speciality', val: 'Sec 138 NI Act · BNS §318', color: '#6366F1' },
        { label: 'Fee', val: '₹12,000/hr · Escrow Protected', color: '#8B5CF6' },
      ],
    },
  },
  {
    id: 'escrow',
    num: '05',
    title: 'Escrow-Backed Booking',
    desc: 'All consultation fees are locked in LexNova Escrow until your strategy session is completed. If counsel can\'t attend, you receive an immediate 100% refund. Zero risk, maximum trust.',
    tryLabel: 'Try: "Book a 45-minute consultation"',
    tryQuery: 'I want to book a consultation with a verified advocate.',
    preview: {
      badge: '🔒 Escrow Active',
      badgeColor: '#6366F1',
      items: [
        { label: 'Escrow Status', val: 'Funds Locked & Protected', color: '#10B981' },
        { label: 'Release Trigger', val: 'Session Completion', color: '#6366F1' },
        { label: 'Refund Policy', val: '100% if Counsel Fails', color: '#3B82F6' },
        { label: 'Encryption', val: 'AES-256 Zero-Knowledge', color: '#64748B' },
      ],
    },
  },
];

/* ─── Advocates ─────────────────────────────────────────────── */
export interface GlobalAdvocateItem {
  id: string; name: string; title: string;
  countryCode: 'US' | 'GB' | 'EU' | 'SG' | 'IN';
  jurisdiction: string; credentials: string; focus: string;
  tags: string[]; rating: string; reviewsCount: number;
  fee: string; flag: string; photo: string; nextSlot: string;
}

const GLOBAL_ADVOCATES: GlobalAdvocateItem[] = [
  { id: 'sarah-jenkins', name: 'Sarah Jenkins, Esq.', title: 'Partner, Commercial & Tech Litigation', countryCode: 'US', jurisdiction: 'New York & Delaware Bar', credentials: 'NY Bar #4891024 · S.D.N.Y.', focus: 'Cross-Border SaaS, UCC §2-708 Contracts, Delaware Chancery', tags: ['Delaware Chancery', 'UCC §2-708', 'Enterprise SaaS'], rating: '5.0', reviewsCount: 164, fee: '$350/hr', flag: '🇺🇸', photo: '/images/advocate-sarah.jpg', nextSlot: 'Today, 4:30 PM EST' },
  { id: 'david-alistair', name: 'David Alistair-Smith, KC', title: "King's Counsel & Solicitor Advocate", countryCode: 'GB', jurisdiction: 'England & Wales (High Court)', credentials: 'SRA ID #598210 · Rolls Building', focus: 'UK CPR Pre-Action Claims, Commercial Debt & Labour', tags: ['CPR Debt Claims', 'Rolls Building', 'High Court'], rating: '4.9', reviewsCount: 198, fee: '£295/hr', flag: '🇬🇧', photo: '/images/advocate-david.jpg', nextSlot: 'Today, 5:00 PM GMT' },
  { id: 'priya-mehta', name: 'Advocate Priya Mehta', title: 'Senior Commercial Litigator', countryCode: 'IN', jurisdiction: 'High Court of Delhi & Supreme Court', credentials: 'Bar Council of Delhi #D/1942/2012', focus: 'Tenancy Recovery, Commercial Contracts & Injunctions', tags: ['Rent Control', 'Commercial Courts', 'Section 9'], rating: '5.0', reviewsCount: 210, fee: '₹14,500/hr', flag: '🇮🇳', photo: '/advocate-priya.jpg', nextSlot: 'Today, 7:00 PM IST' },
  { id: 'rajesh-sharma', name: 'Advocate Rajesh Sharma', title: 'Corporate Dispute Counsel', countryCode: 'IN', jurisdiction: 'High Court of Bombay', credentials: 'BCM #MAH/3081/2010', focus: 'Section 138 NI Act, Summary Suits, BNS §318', tags: ['Sec 138 NI Act', 'Order 37 CPC', 'Bombay HC'], rating: '4.9', reviewsCount: 254, fee: '₹12,000/hr', flag: '🇮🇳', photo: '/advocate-rajesh.jpg', nextSlot: 'Today, 8:30 PM IST' },
  { id: 'helene-moreau', name: 'Dr. Hélène Moreau', title: 'European Regulatory Counsel', countryCode: 'EU', jurisdiction: 'Paris & Frankfurt Bar', credentials: 'Barreau de Paris #B1948', focus: 'EU Late Payment Directive, GDPR Art. 82, EOP', tags: ['EU Directive 2011/7', 'European Payment Orders'], rating: '4.9', reviewsCount: 142, fee: '€275/hr', flag: '🇪🇺', photo: '/images/advocate-helene.jpg', nextSlot: 'Today, 6:15 PM CET' },
  { id: 'kenneth-tan', name: 'Kenneth Tan, FCIArb', title: 'Chartered Institute of Arbitrators', countryCode: 'SG', jurisdiction: 'Singapore (SIAC) & Hong Kong', credentials: 'Law Society Singapore #2012/S89', focus: 'International Arbitration, NY Convention 1958', tags: ['SIAC Expedited Rules', 'NY Convention 1958'], rating: '4.9', reviewsCount: 176, fee: 'S$380/hr', flag: '🇸🇬', photo: '/images/advocate-kenneth.jpg', nextSlot: 'Tomorrow, 9:30 AM SGT' },
];

/* ─── FAQs ──────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How does LexNova understand my dispute without legal knowledge?', a: "You simply describe what happened in everyday English — like telling a friend. LexNova's AI extracts the legal facts, identifies governing statutes, calculates deadlines, and produces a court-ready action plan." },
  { q: 'Are the notices legally admissible in court?', a: 'Yes. Notices follow jurisdiction-specific formats: RPAD evidentiary standard in India, UK Civil Procedure Rules Pre-Action Protocol, and US UCC §2-708 demand standards.' },
  { q: 'How does LexNova Escrow protect my money?', a: 'Your consultation fee is held in secure escrow and only released after your session is completed. If counsel cannot attend, you receive an immediate 100% refund — no questions asked.' },
  { q: 'Can I speak with a real licensed advocate?', a: 'Yes. All advocates on LexNova are Bar-verified with publicly searchable license IDs. Book encrypted 1-on-1 video consultations with King\'s Counsel, trial lawyers, and SIAC arbitrators.' },
  { q: 'What happens to my statutory limitation clock?', a: 'LexNova shows you exactly how many days remain before your claim legally expires. We track this automatically across 50+ jurisdictions so you never miss a deadline.' },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [activeFeatureId, setActiveFeatureId] = useState('intake');
  const [heroInput, setHeroInput] = useState('');
  const [selectedAdvocateCountry, setSelectedAdvocateCountry] = useState<'ALL' | 'US' | 'GB' | 'EU' | 'SG' | 'IN'>('ALL');
  const [bookingAdvocate, setBookingAdvocate] = useState<GlobalAdvocateItem | null>(null);
  const [bookingSlot, setBookingSlot] = useState('Today, 4:30 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeFeature = FEATURES.find((f) => f.id === activeFeatureId) || FEATURES[0];
  const filteredAdvocates = selectedAdvocateCountry === 'ALL'
    ? GLOBAL_ADVOCATES
    : GLOBAL_ADVOCATES.filter((a) => a.countryCode === selectedAdvocateCountry);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/chat${heroInput.trim() ? `?init=${encodeURIComponent(heroInput.trim())}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO — Painterly Sky Background
      ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-0 text-center overflow-hidden min-h-[520px] sm:min-h-[620px]">
        {/* Sky background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero_sky.jpg"
            alt="LexNova Hero Sky"
            fill
            priority
            className="object-cover object-top"
          />
          {/* Gentle bottom fade to white */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-8 sm:pt-14 space-y-6">

          {/* Headline — bold + italic Vyra style */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-1"
          >
            <h1
              className="text-5xl sm:text-7xl lg:text-[82px] text-slate-900 leading-[1.06] tracking-tight"
              style={{ fontWeight: 900 }}
            >
              Legal clarity in.
            </h1>
            <h1
              className="text-5xl sm:text-7xl lg:text-[82px] text-slate-900 leading-[1.06] tracking-tight"
              style={{ fontWeight: 700, fontStyle: 'italic', fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Court-ready action out.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed"
          >
            Describe your dispute naturally. Get a court-admissible notice in minutes.<br className="hidden sm:inline" />
            Every legal tool, one conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/dashboard/chat"
              className="px-7 py-3.5 rounded-full text-white text-[15px] font-semibold transition-all shadow-lg"
              style={{ background: '#3B6FF6', boxShadow: '0 4px 20px rgba(59,111,246,0.35)' }}
            >
              Get started for free
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3.5 rounded-full text-slate-700 text-[15px] font-medium bg-white/70 backdrop-blur-sm border border-slate-200 hover:bg-white transition-all"
            >
              See how it works
            </Link>
          </motion.div>

        </div>

        {/* Floating App UI Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="relative z-10 mt-10 mx-auto max-w-2xl px-4 sm:px-0"
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80"
            style={{ background: '#14161F' }}
          >
            {/* App Titlebar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ background: '#1E2030' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="text-[12px] font-mono text-white/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LexNova Intake Console
              </div>
              <div className="text-[11px] font-mono text-white/30 bg-white/10 px-2 py-0.5 rounded-md">Export PDF</div>
            </div>

            {/* App Body */}
            <div className="grid grid-cols-2 min-h-[220px]">
              {/* Left: Input Panel */}
              <div className="p-5 border-r border-white/10 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Plain-Language Input</div>
                  <p className="text-[13px] text-white/80 leading-relaxed italic">
                    "My landlord is withholding my $3,500 security deposit after I gave 30-day notice and vacated in perfect condition."
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center px-3 gap-2">
                    <Sparkles size={12} className="text-blue-400" />
                    <span className="text-[12px] text-white/30">Ask LexNova anything…</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Right: AI Output Panel */}
              <div className="p-5 space-y-3">
                <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">AI Analysis</div>
                {[
                  { dot: '#10B981', label: 'Statute', val: 'State Tenancy Act §108' },
                  { dot: '#F59E0B', label: 'Limitation', val: '1,065 Days Left' },
                  { dot: '#6366F1', label: 'Notice', val: '15-Day Demand · RPAD' },
                  { dot: '#3B82F6', label: 'Score', val: '98.4% Enforceable' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.dot }} />
                    <span className="text-white/40 w-20 shrink-0">{row.label}</span>
                    <span className="text-white/90 font-medium">{row.val}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold">✓ Court notice ready to serve</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: '$840M+', label: 'Disputes Processed' },
              { val: '52', label: 'Statutory Jurisdictions' },
              { val: '4,200+', label: 'Verified Advocates' },
              { val: '< 60s', label: 'Time to Court Notice' },
            ].map((stat, i) => (
              <div key={i} className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{stat.val}</div>
                <div className="text-[12px] font-medium text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FEATURES — Vyra-style numbered sidebar nav + preview
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-lg mb-14">
            <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Everything you need to resolve any dispute.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: Numbered Feature Nav */}
            <div className="space-y-0">
              {FEATURES.map((feat, idx) => {
                const isActive = feat.id === activeFeatureId;
                return (
                  <div
                    key={feat.id}
                    onClick={() => setActiveFeatureId(feat.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveFeatureId(feat.id)}
                    className="w-full text-left py-5 border-b border-slate-100 group flex items-start gap-5 transition-all cursor-pointer select-none"
                  >
                    <span
                      className="text-[13px] font-mono mt-0.5 shrink-0 transition-colors"
                      style={{ color: isActive ? '#94A3B8' : '#CBD5E1' }}
                    >
                      {feat.num}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <div
                        className="text-xl sm:text-2xl font-bold tracking-tight transition-colors leading-tight"
                        style={{ color: isActive ? '#0F172A' : '#CBD5E1' }}
                      >
                        {feat.title}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3 pt-1"
                        >
                          <p className="text-[14px] text-slate-500 leading-relaxed">{feat.desc}</p>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/chat?init=${encodeURIComponent(feat.tryQuery)}`);
                            }}
                            role="button"
                            tabIndex={0}
                            className="inline-flex items-center gap-1.5 text-[13px] text-blue-600 font-medium hover:underline cursor-pointer"
                          >
                            <span>{feat.tryLabel}</span>
                            <ArrowRight size={13} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Feature Preview Card */}
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
                  style={{ background: '#14161F' }}
                >
                  {/* Preview Header */}
                  <div
                    className="px-5 py-4 flex items-center justify-between border-b border-white/10"
                    style={{ background: '#1E2030' }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <span
                      className="text-[11.5px] font-mono font-bold px-3 py-1 rounded-full"
                      style={{ background: `${activeFeature.preview.badgeColor}20`, color: activeFeature.preview.badgeColor, border: `1px solid ${activeFeature.preview.badgeColor}40` }}
                    >
                      {activeFeature.preview.badge}
                    </span>
                  </div>

                  {/* Preview Body */}
                  <div className="p-6 space-y-4">
                    <div className="text-[11px] font-mono text-white/30 uppercase tracking-widest">
                      LexNova AI · {activeFeature.title}
                    </div>
                    <div className="space-y-3">
                      {activeFeature.preview.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/8">
                          <span className="text-[12.5px] font-mono text-white/40">{item.label}</span>
                          <span
                            className="text-[13px] font-semibold"
                            style={{ color: item.color }}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action row */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-white/30">Powered by LexNova 2.5</span>
                      <button
                        onClick={() => router.push(`/dashboard/chat?init=${encodeURIComponent(activeFeature.tryQuery)}`)}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-blue-500 hover:bg-blue-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>Try it now</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          OLD vs NEW Comparison — Clean Light Cards
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-widest">Why LexNova</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The old legal system is broken.
            </h2>
            <p className="text-slate-500 text-[15px]">
              Here's how we're fixing it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="rounded-3xl bg-white border border-red-100 p-7 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-red-500 uppercase tracking-wider">Before LexNova</span>
                <span className="text-xs text-red-400 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full font-medium">Slow & Opaque</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { l: 'Cost', v: '$350–$750/hr with unpredictable invoices' },
                  { l: 'Turnaround', v: '2–4 weeks to draft a simple demand notice' },
                  { l: 'Language', v: 'Dense 40-page legal briefs most people can\'t read' },
                  { l: 'Deadlines', v: 'Manual tracking often misses limitation cutoffs' },
                  { l: 'Protection', v: 'Retainers locked upfront with no refund guarantee' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-[14px]">
                    <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <div><strong className="text-slate-700">{r.l}:</strong> <span className="text-slate-500">{r.v}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="rounded-3xl bg-white border border-blue-100 p-7 space-y-5" style={{ boxShadow: '0 4px 30px rgba(59,111,246,0.08)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} />
                  With LexNova
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">Instant & Guaranteed</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { l: 'Cost', v: 'Free intake & analysis. Fixed transparent fees.' },
                  { l: 'Turnaround', v: 'Under 60 seconds to generate a court-admissible notice' },
                  { l: 'Language', v: 'Plain English input. Clear executive summary output.' },
                  { l: 'Deadlines', v: 'Automated statutory clock across 50+ jurisdictions' },
                  { l: 'Protection', v: 'All fees held in 100% Escrow until session is done' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-[14px]">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div><strong className="text-slate-700">{r.l}:</strong> <span className="text-slate-500">{r.v}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ADVOCATES DIRECTORY — Clean White Cards
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-widest">Verified Legal Network</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Accredited counsel on standby.
              </h2>
              <p className="text-slate-500 text-[14.5px]">
                Bar-verified attorneys, King's Counsel, and SIAC arbitrators. Book instantly, backed by escrow.
              </p>
            </div>
            <Link href="/advocates" className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 shrink-0">
              <span>View all 140+ advocates</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Country Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'US', label: '🇺🇸 United States' },
              { id: 'GB', label: '🇬🇧 United Kingdom' },
              { id: 'EU', label: '🇪🇺 Europe' },
              { id: 'SG', label: '🇸🇬 Singapore' },
              { id: 'IN', label: '🇮🇳 India' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedAdvocateCountry(tab.id as any)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  selectedAdvocateCountry === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Advocate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAdvocates.map((adv) => (
              <div
                key={adv.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group"
              >
                <div className="space-y-4">
                  {/* Avatar & Identity */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 shrink-0">
                      <Image src={adv.photo} alt={adv.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-bold text-slate-900 truncate">{adv.name}</h4>
                        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-[12px] text-slate-500 truncate">{adv.title}</p>
                      <p className="text-[11.5px] text-blue-600 font-mono mt-0.5 truncate">{adv.flag} {adv.jurisdiction}</p>
                    </div>
                  </div>

                  {/* Credentials */}
                  <div className="flex items-center justify-between text-[11.5px] font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 truncate">{adv.credentials}</span>
                    <span className="text-emerald-600 font-bold shrink-0 ml-2">VERIFIED</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {adv.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">{tag}</span>
                    ))}
                  </div>

                  {/* Rating & Slot */}
                  <div className="flex items-center justify-between text-[12px] pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span>{adv.rating}</span>
                      <span className="text-slate-400 font-normal">({adv.reviewsCount})</span>
                    </span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Clock size={11} /> {adv.nextSlot}
                    </span>
                  </div>
                </div>

                {/* CTA Row */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-black text-slate-900">{adv.fee}</div>
                    <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">LexNova Escrow</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/chat?advocate=${encodeURIComponent(adv.name)}`}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Chat
                    </Link>
                    <button
                      onClick={() => { setBookingAdvocate(adv); setBookingConfirmed(false); setBookingSlot(adv.nextSlot); }}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                      style={{ background: '#3B6FF6', boxShadow: '0 2px 8px rgba(59,111,246,0.3)' }}
                    >
                      Book Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOOKING MODAL
      ══════════════════════════════════════════════════════════ */}
      {bookingAdvocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl max-w-md w-full bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden relative border border-slate-200 shrink-0">
                  <Image src={bookingAdvocate.photo} alt={bookingAdvocate.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[15px] font-bold text-slate-900">{bookingAdvocate.name}</h3>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-[11.5px] text-slate-500 font-mono">{bookingAdvocate.flag} {bookingAdvocate.credentials}</p>
                </div>
              </div>
              <button onClick={() => setBookingAdvocate(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X size={15} className="text-slate-600" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {!bookingConfirmed ? (
                <>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">45-Min Strategy Session</div>
                      <div className="text-xs text-slate-500 mt-0.5">Encrypted video · LexNova Escrow protected</div>
                    </div>
                    <div className="text-base font-mono font-black text-blue-600">{bookingAdvocate.fee}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Time Slot</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[bookingAdvocate.nextSlot, 'Today, 6:00 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 2:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-[12.5px] font-semibold transition-all border ${
                            bookingSlot === slot
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[12.5px] text-slate-600 leading-relaxed">
                      <strong className="text-emerald-700">LexNova Escrow:</strong> Your fee is locked in secure escrow. 100% money-back if counsel cannot attend.
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={30} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Confirmed!</h4>
                    <p className="text-sm text-slate-500 mt-1">Session with <strong className="text-slate-800">{bookingAdvocate.name}</strong> at <strong className="text-slate-800">{bookingSlot}</strong>.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
              {!bookingConfirmed ? (
                <>
                  <button onClick={() => setBookingAdvocate(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button onClick={() => setBookingConfirmed(true)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2" style={{ background: '#3B6FF6' }}>
                    <span>Confirm & Hold Slot</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button onClick={() => setBookingAdvocate(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Close</button>
                  <Link href={`/dashboard/chat?advocate=${encodeURIComponent(bookingAdvocate.name)}`} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5" style={{ background: '#3B6FF6' }}>
                    <span>Enter Strategy Room</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          FAQ — Clean Accordion
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-slate-100 bg-white">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-widest">Questions</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently asked questions.</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[15px] font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-5 text-[14px] text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — Sky gradient background
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 sm:px-10 text-center overflow-hidden">
        {/* Repeat sky at bottom */}
        <div className="absolute inset-0">
          <Image src="/images/hero_sky.jpg" alt="Sky CTA" fill className="object-cover object-bottom opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white/90" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Stop guessing.<br />
            <span style={{ fontStyle: 'italic', fontFamily: "'Georgia', serif", fontWeight: 700 }}>Take court-ready action today.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Autonomous statutory analysis, certified notices, and verified legal counsel. All in 60 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard/chat"
              className="px-8 py-4 rounded-full text-white font-bold text-[15px] transition-all shadow-lg"
              style={{ background: '#3B6FF6', boxShadow: '0 6px 24px rgba(59,111,246,0.35)' }}
            >
              Get started for free
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-4 rounded-full text-slate-700 font-medium text-[14.5px] bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Platform overview
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
