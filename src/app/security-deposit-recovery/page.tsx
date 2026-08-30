import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Scale, Clock, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

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

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

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
    <div className="min-h-screen bg-[#050508] text-[#F0F2F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-600/[0.07] to-transparent rounded-full blur-[160px]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[12px] font-bold tracking-wider uppercase px-4 py-2 rounded-full mb-8">
            <Scale size={13} /> Security Deposit Recovery · India
          </div>
          <h1 className="text-[42px] sm:text-[60px] font-bold text-white tracking-tight leading-tight mb-6 max-w-3xl">
            Landlord Refusing to Return Your Security Deposit?
          </h1>
          <p className="text-[18px] text-[#9BAABB] max-w-2xl leading-relaxed mb-10">
            Know your rights under the <strong className="text-white">Transfer of Property Act §108</strong>. Get an AI-drafted RPAD demand notice in minutes and match with a verified property law advocate near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl text-[15px] transition-all shadow-lg shadow-emerald-900/30"
            >
              Analyze My Case Free <ArrowRight size={16} />
            </Link>
            <Link
              href="/advocates"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.15] text-[#CBD5E1] hover:bg-white/[0.06] font-semibold px-8 py-4 rounded-xl text-[15px] transition-all"
            >
              Find Property Advocates
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 mt-10 text-[13px] text-[#7A8899]">
            {['Free analysis · No credit card', 'Transfer of Property Act cited', '2,400+ Bar Council advocates', '₹75,000 avg. recovery'].map(t => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" />{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 border-y border-white/[0.06] bg-[#07090D]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[32px] font-bold text-white text-center mb-12">How to Recover Your Security Deposit in 3 Steps</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Case', desc: 'Tell the AI about your tenancy: deposit amount, move-out date, landlord response. Takes 2 minutes.', icon: FileText },
              { step: '02', title: 'Get Legal Notice Draft', desc: 'Our AI generates an RPAD demand notice citing Transfer of Property Act §108 and your State Rent Act.', icon: Scale },
              { step: '03', title: 'Book a Property Advocate', desc: 'Match with a verified property law advocate in your city for ₹799–₹1,499. Fixed transparent pricing.', icon: CheckCircle2 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-6">
                  <div className="text-[11px] font-bold text-emerald-400 tracking-widest mb-3">STEP {item.step}</div>
                  <Icon size={24} className="text-emerald-400 mb-4" />
                  <h3 className="text-[17px] font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#8D9CB0] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitation warning */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
            <AlertCircle size={24} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[16px] font-bold text-amber-300 mb-2">⏳ Limitation Period Warning</h3>
              <p className="text-[14px] text-amber-200/80 leading-relaxed">
                Under the <strong>Limitation Act 1963, Article 62</strong>, you have <strong>3 years</strong> from the date your deposit was due to be returned to file a recovery suit. Don&apos;t wait — courts look favourably on prompt action, and evidence is strongest when fresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City targeting */}
      <section className="py-16 px-6 border-t border-white/[0.06] bg-[#07090D]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[28px] font-bold text-white mb-4">Available Across India</h2>
          <p className="text-[#8D9CB0] mb-8">Verified property law advocates in every major city</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/dashboard/chat?init=My+landlord+in+${city}+is+refusing+to+return+security+deposit`}
                className="px-5 py-2.5 bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.2] text-[#CBD5E1] hover:text-white rounded-xl text-[14px] font-medium transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[32px] font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-[16px] font-bold text-white mb-3">{item.q}</h3>
                <p className="text-[14px] text-[#9AA8BC] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/[0.06] bg-[#07090D]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[36px] font-bold text-white mb-4">Start Your Free Case Analysis</h2>
          <p className="text-[#8D9CB0] mb-8">No registration required. Get instant legal analysis in under 2 minutes.</p>
          <Link
            href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-10 py-4 rounded-xl text-[16px] transition-all shadow-xl shadow-emerald-900/30"
          >
            Analyze My Deposit Case <ArrowRight size={16} />
          </Link>
          <p className="text-[12px] text-[#5B6B7C] mt-4">
            ⚠️ Legal information only — not legal advice. Consult a licensed advocate for formal advice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
