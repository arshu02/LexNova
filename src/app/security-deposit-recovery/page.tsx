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
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-200" style={{ background: '#05060A', color: '#F0F2FF' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-[12px] font-mono font-semibold uppercase px-4 py-1.5 rounded-full" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
            <Scale size={13} style={{ color: '#C084FC' }} /> Security Deposit Recovery · Statutory Protection
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl">
            Landlord Refusing to Return Your <span className="text-gradient">Security Deposit?</span>
          </h1>
          <p className="text-xl max-w-2xl leading-relaxed" style={{ color: '#8F96B3' }}>
            Know your rights under statutory property law. Get an AI-drafted demand notice in minutes and connect with verified property counsel near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-3.5 rounded-full text-[14.5px] transition-all"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
            >
              <span>Analyze My Case Free</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/advocates"
              className="inline-flex items-center justify-center gap-2 font-medium px-7 py-3.5 rounded-full text-[14.5px] transition-all"
              style={{ border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8', background: 'rgba(99,102,241,0.05)' }}
            >
              Find Property Advocates
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 pt-4 text-[13px]" style={{ color: '#8F96B3' }}>
            {['Free analysis · No credit card', 'Transfer of Property Act cited', '2,400+ Verified advocates', '₹75,000 avg. recovery'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" style={{ color: '#10B981' }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 relative z-10" style={{ borderTop: '1px solid rgba(99,102,241,0.12)', background: 'rgba(10,11,18,0.7)' }}>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">How to Recover Your Security Deposit in 3 Steps</h2>
            <p className="text-[14px]" style={{ color: '#8F96B3' }}>Structured statutory procedure to maximize swift settlement</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Case', desc: 'Tell the AI about your tenancy: deposit amount, move-out date, landlord response. Takes 2 minutes.', icon: FileText },
              { step: '02', title: 'Get Legal Notice Draft', desc: 'Our AI generates an RPAD demand notice citing Transfer of Property Act §108 and your State Rent Act.', icon: Scale },
              { step: '03', title: 'Book a Property Advocate', desc: 'Match with a verified property law advocate in your city. Fixed transparent pricing protected by Escrow.', icon: CheckCircle2 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="rounded-3xl p-6 space-y-3" style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                  <div className="text-[11px] font-mono font-bold tracking-widest uppercase" style={{ color: '#818CF8' }}>STEP {item.step}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[17px] font-bold text-white">{item.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: '#8F96B3' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitation warning */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-6 flex gap-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <AlertCircle size={22} className="shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Limitation Period Notice</h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: '#A8AECF' }}>
                Under statutory limitation rules (Limitation Act 1963, Article 62), you have <strong>3 years</strong> from the date your deposit was due to be returned to institute recovery. Acting promptly preserves essential documentary evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City targeting */}
      <section className="py-16 px-6 relative z-10" style={{ borderTop: '1px solid rgba(99,102,241,0.12)', background: 'rgba(10,11,18,0.7)' }}>
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Available Across All Major Hubs</h2>
          <p className="text-[14px]" style={{ color: '#8F96B3' }}>Verified property law advocates ready for video consultation</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/dashboard/chat?init=My+landlord+in+${city}+is+refusing+to+return+security+deposit`}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.15)', color: '#A8AECF' }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl p-6 space-y-2" style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <h3 className="text-[15px] font-bold text-white">{item.q}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: '#8F96B3' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative z-10" style={{ borderTop: '1px solid rgba(99,102,241,0.12)', background: 'rgba(10,11,18,0.7)' }}>
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Start Your Free Case Analysis</h2>
          <p className="text-lg" style={{ color: '#8F96B3' }}>No registration required. Get instant statutory analysis in under 2 minutes.</p>
          <div className="pt-2">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-full text-[15px] transition-all"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
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
