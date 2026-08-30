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
  Cpu, Building2, Gavel, FileCheck, Layers, AlertCircle,
  Code2, Copy, Play, RefreshCw, Sliders, Activity, Database
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const CODE_EXAMPLES = {
  curl: `curl -X POST https://lexnova.in/api/v1/cases/intake \\
  -H "Authorization: Bearer ln_live_9f83a2e7c4b109" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Commercial Breach of Contract",
    "description": "Buyer failed to remit ₹1.4 Cr for 500 tonnes steel supply.",
    "jurisdiction": "Delhi High Court"
  }'`,
  typescript: `import { LexNovaClient } from '@lexnova/sdk';

const lexnova = new LexNovaClient({
  apiKey: process.env.LEXNOVA_API_KEY
});

// Autonomous Case Assessment & Statutory Mapping
const analysis = await lexnova.cases.intake({
  description: "Landlord withheld ₹75,000 deposit post 30-day vacation.",
  jurisdiction: "Bengaluru City Civil Court",
  autoDraftNotice: true
});

console.log(analysis.statutes); // ["Transfer of Property Act §108(B)"]
console.log(analysis.limitationDeadline); // "2028-05-31"`,
  python: `from lexnova import LexNova

client = LexNova(api_key="ln_live_9f83a2e7c4b109")

# Calculate statutory limitation & draft RPAD notice
notice = client.documents.draft(
    document_type="LEGAL_NOTICE",
    sender_name="Acme Corp",
    recipient_name="Defaulting Vendor",
    claim_amount=250000,
    statute_cited="Section 138 NI Act 1881"
)

print(f"Admissible Notice Generated: {notice.pdf_url}")`,
};

const ADVOCATES_SHOWCASE = [
  {
    name: "Adv. Priya Mehta",
    barNumber: "KAR/2491/2015",
    courts: "Karnataka High Court",
    specialization: "Property, Tenancy & RERA",
    rating: "4.9",
    fee: "₹999",
  },
  {
    name: "Adv. Rajesh Sharma",
    barNumber: "D/1842/2012",
    courts: "Delhi High Court & NCLT",
    specialization: "Employment, Labour & Corporate",
    rating: "4.9",
    fee: "₹1,299",
  },
  {
    name: "Adv. Vikram Singh",
    barNumber: "MAH/4019/2014",
    courts: "Bombay High Court",
    specialization: "Commercial Recovery & NI Act §138",
    rating: "4.8",
    fee: "₹1,499",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [heroInput, setHeroInput] = useState('');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simClaimAmount, setSimClaimAmount] = useState(150000);
  const [simCategory, setSimCategory] = useState<'TENANCY' | 'SALARY' | 'CHEQUE' | 'COMMERCIAL'>('TENANCY');
  const [apiSimulating, setApiSimulating] = useState(false);
  const [apiResponseText, setApiResponseText] = useState<string | null>(null);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroInput.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(heroInput.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runApiSimulation = () => {
    setApiSimulating(true);
    setApiResponseText(null);
    setTimeout(() => {
      setApiResponseText(JSON.stringify({
        status: 201,
        success: true,
        caseId: "MAT-2026-X984",
        statuteMapped: "Payment of Wages Act 1936 §15",
        precedentsCited: [
          "State of Punjab v. Labour Court (SC 2021)",
          "Bharat Electronics v. Industrial Tribunal (Del HC 2023)"
        ],
        claimQuantification: {
          principal: 140000,
          statutoryInterest18Pct: 25200,
          totalPayable: 165200
        },
        limitationClock: {
          status: "ACTIVE",
          daysRemaining: 742,
          statute: "Limitation Act 1963 Article 7"
        },
        noticeStatus: "COURT_ADMISSIBLE_RPAD_GENERATED"
      }, null, 2));
      setApiSimulating(false);
    }, 600);
  };

  // Dynamic calculations for Simulator
  const interest18 = Math.round(simClaimAmount * 0.18);
  const estimatedCourtFee = Math.max(500, Math.round(simClaimAmount * 0.025));
  const totalRecovery = simClaimAmount + interest18;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col relative selection:bg-blue-600 selection:text-white hud-grid">
      <Navbar />

      {/* SpaceX / Tesla Telemetry Mesh Backdrop */}
      <div className="fixed inset-0 hud-mesh pointer-events-none z-0" />

      {/* ── HERO MISSION CONTROL SECTION ────────────────────────── */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 max-w-6xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Mission Telemetry Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.12] bg-[#05070C]/90 backdrop-blur-2xl shadow-2xl font-mono text-[11px] text-[#8D9CB0] tracking-wider uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
          <span>SYSTEM: NOMINAL · 24 HIGH COURTS ACTIVE · LATENCY: 14ms · AES-256 GCM</span>
        </motion.div>

        {/* Monolithic Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-gradient max-w-5xl mx-auto leading-[1.02]"
        >
          AUTONOMOUS LEGAL INTELLIGENCE.
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-[#8D9CB0] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Instant statutory cross-referencing, automated RPAD demand notices, limitation clock countdowns, and verified High Court advocate coordination in 60 seconds.
        </motion.p>

        {/* Interactive Neural Intake HUD Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto pt-4"
        >
          <form
            onSubmit={handleHeroSubmit}
            className="p-2.5 bg-[#05070C]/95 backdrop-blur-2xl border border-white/[0.14] focus-within:border-blue-500/70 rounded-2xl sm:rounded-3xl shadow-2xl transition-all space-y-2.5"
          >
            <div className="flex items-center px-3 pt-1">
              <Sparkles size={16} className="text-blue-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Describe your dispute (e.g. Landlord withheld ₹75,000 deposit, unpaid salary, cheque bounce)..."
                className="w-full bg-transparent border-none text-white text-[14.5px] placeholder-[#4E5D70] focus:outline-none py-2"
              />
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] px-2">
              <div className="flex items-center gap-2 text-[11.5px] text-[#6B7B94] font-mono">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>ATTORNEY_PRIVILEGE_ENCRYPTED</span>
              </div>

              <button
                type="submit"
                className="btn-glow-blue h-10 px-5 rounded-xl text-[13.5px] font-semibold flex items-center gap-1.5"
              >
                <span>Execute Analysis</span>
                <CornerDownLeft size={13} />
              </button>
            </div>
          </form>

          {/* Quick Scenario Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-[12px] text-[#7A8A9E]">
            <span className="text-[#4E5D70] font-mono text-[11px] uppercase">Telemetry Queries:</span>
            {["Security Deposit Refund", "Unpaid Salary §15", "Cheque Bounce §138", "UPI Phishing Recovery"].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroInput(item)}
                className="px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[#CBD5E1] text-[12px] transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Global Telemetry Metrics Matrix */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/[0.08]"
        >
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white font-mono">₹420+ Cr</div>
            <div className="text-[12px] text-[#8D9CB0] uppercase tracking-wider font-mono">Dispute Recovery Value</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-blue-400 font-mono">2,800+</div>
            <div className="text-[12px] text-[#8D9CB0] uppercase tracking-wider font-mono">High Court Advocates</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">99.4%</div>
            <div className="text-[12px] text-[#8D9CB0] uppercase tracking-wider font-mono">Statutory Precision</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-cyan-400 font-mono">&lt; 14ms</div>
            <div className="text-[12px] text-[#8D9CB0] uppercase tracking-wider font-mono">Vector Query Speed</div>
          </div>
        </motion.div>
      </section>

      {/* ── STRIPE-STYLE INTERACTIVE DEVELOPER API PLAYGROUND ──── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full font-mono">
              DEVELOPER PLATFORM · PUBLIC API v1
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-3">
              Integrate Legal Intelligence in 5 Lines of Code
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0] mt-1">
              Trigger autonomous statutory mapping, limitation countdowns, and court notice generation from your CRM or ERP.
            </p>
          </div>

          <Link href="/dashboard/team" className="btn-ghost text-[13.5px] font-semibold h-10 px-4 rounded-xl inline-flex items-center gap-1.5 shrink-0">
            <Terminal size={14} className="text-blue-400" />
            <span>Generate API Key</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Code Playground Box */}
        <div className="hud-panel overflow-hidden border border-white/[0.12]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#05070C]">
            <div className="flex items-center gap-2">
              {(['curl', 'typescript', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveCodeTab(tab);
                    setApiResponseText(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-mono font-semibold transition-all ${
                    activeCodeTab === tab
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-[#8D9CB0] hover:text-white'
                  }`}
                >
                  {tab === 'curl' ? 'cURL' : tab === 'typescript' ? 'Node.js (TypeScript)' : 'Python'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runApiSimulation}
                disabled={apiSimulating}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[12px] font-semibold font-mono flex items-center gap-1.5 transition-all"
              >
                {apiSimulating ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                <span>Test Endpoint</span>
              </button>

              <button
                onClick={copyCode}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8D9CB0] hover:text-white transition-all"
                title="Copy snippet"
              >
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] bg-[#020408]">
            {/* Left: Code Snippet */}
            <div className="p-5 font-mono text-[13px] text-[#CBD5E1] overflow-x-auto leading-relaxed">
              <pre>{CODE_EXAMPLES[activeCodeTab]}</pre>
            </div>

            {/* Right: Live Simulated Response */}
            <div className="p-5 font-mono text-[12px] overflow-x-auto bg-[#04060B]">
              <div className="text-[11px] text-[#55667E] uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                <span>Response Stream (JSON)</span>
                <span className="text-emerald-400">HTTP 201 OK</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed">
                {apiResponseText || `// Click "Test Endpoint" above to simulate live statutory analysis response...`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESLA-STYLE STATUTORY DAMAGES & LIMITATION SIMULATOR ── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full font-mono">
            INTERACTIVE RECOVERY SIMULATOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Calculate Statutory Damages & Limitation Windows
          </h2>
          <p className="text-[14.5px] text-[#8D9CB0]">
            Adjust your claim amount to quantify statutory interest, court fee stamps, and RPAD compliance timelines.
          </p>
        </div>

        <div className="hud-panel p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-white/[0.12]">
          
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-bold text-[#8D9CB0] uppercase tracking-wider font-mono">
                  Principal Claim Amount
                </label>
                <span className="text-2xl font-extrabold text-white font-mono">
                  ₹{simClaimAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <input
                type="range"
                min="25000"
                max="2500000"
                step="25000"
                value={simClaimAmount}
                onChange={(e) => setSimClaimAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-[#55667E] font-mono mt-1">
                <span>₹25,000</span>
                <span>₹10,00,000</span>
                <span>₹25,00,000</span>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#8D9CB0] uppercase tracking-wider font-mono">
                Dispute Classification
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px] font-semibold">
                {[
                  { key: 'TENANCY', label: 'Tenancy Deposit' },
                  { key: 'SALARY', label: 'Unpaid Wages §15' },
                  { key: 'CHEQUE', label: 'Cheque Bounce §138' },
                  { key: 'COMMERCIAL', label: 'Commercial Contract' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSimCategory(cat.key as any)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      simCategory === cat.key
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-bold'
                        : 'bg-white/[0.03] border-white/[0.06] text-[#8D9CB0] hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Computed Metrics HUD Card */}
          <div className="p-6 rounded-2xl bg-[#04060B] border border-white/[0.08] space-y-4 font-mono text-[13px]">
            <div className="text-[11px] text-blue-400 font-bold uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              Statutory Claim Matrix
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Principal Claim:</span>
                <span className="text-white font-bold">₹{simClaimAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Statutory Interest (18% p.a.):</span>
                <span className="text-emerald-400 font-bold">+₹{interest18.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8D9CB0]">
                <span>Est. Court Fee Stamp:</span>
                <span className="text-amber-400 font-bold">₹{estimatedCourtFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between text-[14px]">
                <span className="text-white font-bold">Total Recovery Demand:</span>
                <span className="text-cyan-400 font-bold">₹{totalRecovery.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href={`/dashboard/chat?init=${encodeURIComponent(`I want to recover ₹${simClaimAmount} for a ${simCategory.toLowerCase()} dispute with statutory interest.`)}`}
              className="btn-glow-blue w-full text-center justify-center text-[13px] font-semibold h-10 mt-2"
            >
              Draft Demand Notice →
            </Link>
          </div>

        </div>
      </section>

      {/* ── HIGH COURT ADVOCATE MATRIX ──────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full font-mono">
              BAR COUNCIL ENROLLED COUNSEL
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-3">
              Matched High Court Advocates
            </h2>
            <p className="text-[14.5px] text-[#8D9CB0] mt-1">
              Coordinate with vetted legal counsel across 24 High Courts for encrypted video strategy sessions.
            </p>
          </div>

          <Link href="/advocates" className="btn-ghost text-[13.5px] font-semibold h-10 px-4 rounded-xl inline-flex items-center gap-1.5">
            <span>Browse All Advocates</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ADVOCATES_SHOWCASE.map((adv, idx) => (
            <div key={idx} className="hud-panel p-6 flex flex-col justify-between gap-6 border border-white/[0.08]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-[14px]">
                    {adv.name.split(' ')[1]?.[0] || 'A'}
                  </div>
                  <div className="flex items-center gap-1 text-[11.5px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                    <Star size={11} fill="currentColor" /> {adv.rating}
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] font-bold text-white">{adv.name}</h4>
                  <p className="text-[12px] text-[#8D9CB0] font-mono">{adv.barNumber}</p>
                </div>

                <div className="text-[13px] text-[#CBD5E1] space-y-1 pt-1 border-t border-white/[0.05]">
                  <div>🏛️ {adv.courts}</div>
                  <div>⚖️ {adv.specialization}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6B7B94] font-mono block uppercase">Consultation</span>
                  <span className="text-[16px] font-bold text-white font-mono">{adv.fee}</span>
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

      {/* ── EXECUTIVE CTA BANNER ────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full text-center">
        <div className="relative rounded-3xl p-12 sm:p-16 border border-white/[0.14] bg-gradient-to-b from-[#080D1A] to-[#000000] overflow-hidden shadow-2xl space-y-6">
          <div className="absolute inset-0 hud-mesh pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10 max-w-3xl mx-auto">
            Ready to resolve your legal dispute with autonomous precision?
          </h2>
          <p className="text-[16px] text-[#8D9CB0] max-w-xl mx-auto relative z-10 font-normal">
            Join thousands of citizens, enterprises, and legal counsels using LexNova to protect statutory rights.
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
