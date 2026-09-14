import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Scale, Clock, FileText, ArrowRight, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Deposit Recovery India — Legal Help | LexNova',
  description: 'Landlord refusing to return your security deposit in India? Get instant legal analysis, AI-generated demand notice, and connect with property law advocates. Know your rights under Transfer of Property Act §108.',
  keywords: ['security deposit recovery India', 'landlord security deposit refund', 'security deposit legal notice', 'rent deposit return India', 'Transfer of Property Act 108'],
  openGraph: {
    title: 'Security Deposit Recovery — LexNova',
    description: 'Landlord refusing to return your deposit? AI-generated demand notice citing Transfer of Property Act §108. Verified advocates across India.',
  },
};

const FAQ_ITEMS = [
  {
    q: 'How long does a landlord have to return the security deposit?',
    a: 'Under most State Rent Control Acts (e.g., Maharashtra Rent Control Act, Karnataka Rent Act), a landlord must return the security deposit within 30 days of the tenant vacating, subject to deductions for legitimate damages beyond normal wear and tear. If no state-specific timeline exists, the Indian Contract Act 1872 requires return within a "reasonable time".',
  },
  {
    q: 'What is the legal notice format for security deposit recovery?',
    a: 'A valid demand notice must: (1) be addressed to the landlord by name, (2) cite the Transfer of Property Act 1882, Section 108(B)(q) and the relevant State Rent Act, (3) specify the exact deposit amount and the date it became due, (4) demand repayment within 15 days, and (5) be sent via Registered Post with Acknowledgement Due (RPAD) and retain the postal receipt.',
  },
  {
    q: 'Can I file a consumer complaint for security deposit refund?',
    a: 'Yes, if your landlord is a housing society, real estate company, or builder, the Consumer Protection Act 2019 (Section 35) applies. For individual landlords, you must file in Rent Controller\'s Court or Small Causes Court. LexNova\'s AI can classify the correct forum for your specific situation.',
  },
  {
    q: 'What is the limitation period for security deposit recovery?',
    a: 'Under the Limitation Act 1963, Article 62, you have 3 years from the date the deposit was due to be returned to file a suit for recovery. However, it is strongly recommended to act within the first 6 months while evidence is fresh.',
  },
  {
    q: 'What damages can I claim beyond the deposit amount?',
    a: 'You can claim: (1) The deposit amount in full, (2) 18% per annum interest under Section 80 of the Transfer of Property Act, (3) litigation costs, and (4) mental harassment damages before consumer forums. An advocate can help maximise your recovery.',
  },
];

const CITIES = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

// JSON-LD FAQ Schema
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function SecurityDepositPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-800 antialiased font-sans bg-[#F8FAFC] text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-[12px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
            <Scale size={13} className="text-indigo-600" />
            <span>Security Deposit Recovery · Statutory Protection</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
            Landlord Refusing to Return Your <span className="text-gradient">Security Deposit?</span>
          </h1>
          <p className="text-xl max-w-2xl leading-relaxed text-slate-600 font-normal">
            Know your rights under statutory property law. Get an AI-drafted demand notice in minutes and connect with verified property counsel near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-3.5 rounded-full text-[14.5px] transition-all bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <span>Analyze My Case Free</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/advocates"
              className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full text-[14.5px] transition-all bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              Find Property Advocates
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 pt-4 text-[13px] text-slate-600 font-medium">
            {['Free analysis · No credit card', 'Transfer of Property Act cited', '2,400+ Verified advocates', '₹75,000 avg. recovery'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps (Pasted on Clean White Canvas) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">How to Recover Your Security Deposit in 3 Steps</h2>
            <p className="text-[14px] text-slate-600">Structured statutory procedure to maximize swift settlement</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Case', desc: 'Tell the AI about your tenancy: deposit amount, move-out date, landlord response. Takes 2 minutes.', icon: FileText },
              { step: '02', title: 'Get Legal Notice Draft', desc: 'Our AI generates an RPAD demand notice citing Transfer of Property Act §108 and your State Rent Act.', icon: Scale },
              { step: '03', title: 'Book a Property Advocate', desc: 'Match with a verified property law advocate in your city. Fixed transparent pricing protected by Escrow.', icon: CheckCircle2 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="rounded-3xl p-6 space-y-3 bg-[#F8FAFC] border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
                  <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-indigo-700">STEP {item.step}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-200 text-indigo-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitation warning */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-6 flex gap-4 bg-amber-50/80 border border-amber-200 shadow-2xs">
            <AlertCircle size={22} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <h3 className="text-[15px] font-bold text-amber-900 mb-1">Limitation Period Notice</h3>
              <p className="text-[13.5px] leading-relaxed text-amber-800">
                Under statutory limitation rules (Limitation Act 1963, Article 62), you have <strong>3 years</strong> from the date your deposit was due to be returned to institute recovery. Acting promptly preserves essential documentary evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City targeting */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Available Across All Major Hubs</h2>
          <p className="text-[14px] text-slate-600">Verified property law advocates ready for video consultation</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/dashboard/chat?init=My+landlord+in+${city}+is+refusing+to+return+security+deposit`}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 shadow-2xs"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-slate-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl p-6 space-y-2 bg-white border border-slate-200/90 shadow-2xs">
                <h3 className="text-[15px] font-bold text-slate-900">{item.q}</h3>
                <p className="text-[14px] leading-relaxed text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-white border-t border-slate-200/80">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Start Your Free Case Analysis</h2>
          <p className="text-lg text-slate-600">No registration required. Get instant statutory analysis in under 2 minutes.</p>
          <div className="pt-2">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-full text-[15px] transition-all bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <span>Analyze My Deposit Case</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
