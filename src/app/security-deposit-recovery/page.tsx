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
    <div className="min-h-screen bg-[#FBF9F5] text-[#141413]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F7F4EE] border border-[#E8E4DA] text-[#42403B] text-[12px] font-mono font-semibold uppercase px-4 py-1.5 rounded-full mb-6">
            <Scale size={13} className="text-[#141413]" /> Security Deposit Recovery · Statutory Protection
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-[#141413] tracking-tight leading-tight mb-4 max-w-3xl">
            Landlord Refusing to Return Your Security Deposit?
          </h1>
          <p className="font-serif text-xl text-[#636059] max-w-2xl leading-relaxed mb-8">
            Know your rights under statutory property law. Get an AI-drafted demand notice in minutes and connect with verified property counsel near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
              className="inline-flex items-center justify-center gap-2 bg-[#141413] hover:bg-black text-white font-medium px-8 py-3.5 rounded-full text-[14.5px] transition-all shadow-xs"
            >
              Analyze My Case Free <ArrowRight size={15} />
            </Link>
            <Link
              href="/advocates"
              className="inline-flex items-center justify-center gap-2 border border-[#DED9CE] hover:border-[#B5AFA2] text-[#141413] font-medium px-7 py-3.5 rounded-full text-[14.5px] transition-all bg-white"
            >
              Find Property Advocates
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6 mt-8 text-[13px] text-[#636059]">
            {['Free analysis · No credit card', 'Transfer of Property Act cited', '2,400+ Verified advocates', '₹75,000 avg. recovery'].map(t => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#141413] shrink-0" />{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 border-y border-[#E8E4DA] bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#141413] text-center mb-12">How to Recover Your Security Deposit in 3 Steps</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe Your Case', desc: 'Tell the AI about your tenancy: deposit amount, move-out date, landlord response. Takes 2 minutes.', icon: FileText },
              { step: '02', title: 'Get Legal Notice Draft', desc: 'Our AI generates an RPAD demand notice citing Transfer of Property Act §108 and your State Rent Act.', icon: Scale },
              { step: '03', title: 'Book a Property Advocate', desc: 'Match with a verified property law advocate in your city. Fixed transparent pricing.', icon: CheckCircle2 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-[#FBF9F5] border border-[#E8E4DA] rounded-3xl p-6 space-y-3">
                  <div className="text-[11px] font-mono font-bold text-[#87837B] tracking-widest uppercase">STEP {item.step}</div>
                  <Icon size={22} className="text-[#141413]" />
                  <h3 className="text-[17px] font-bold text-[#141413]">{item.title}</h3>
                  <p className="text-[13.5px] text-[#636059] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitation warning */}
      <section className="py-16 px-6 bg-[#FBF9F5]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-[#E8E4DA] rounded-3xl p-6 flex gap-4 shadow-xs">
            <AlertCircle size={22} className="text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-bold text-[#141413] mb-1">Limitation Period Notice</h3>
              <p className="text-[13.5px] text-[#5A5752] leading-relaxed">
                Under statutory limitation rules, you have <strong>3 years</strong> from the date your deposit was due to be returned to institute recovery. Acting promptly preserves essential documentary evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City targeting */}
      <section className="py-16 px-6 border-t border-[#E8E4DA] bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#141413] mb-2">Available Across All Major Hubs</h2>
          <p className="text-[#636059] mb-6">Verified property law advocates ready for consultation</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/dashboard/chat?init=My+landlord+in+${city}+is+refusing+to+return+security+deposit`}
                className="px-4 py-2 bg-[#F7F4EE] border border-[#E8E4DA] hover:border-[#B5AFA2] text-[#141413] rounded-full text-[13px] font-medium transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#FBF9F5]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#141413] mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-xs">
                <h3 className="text-[15px] font-bold text-[#141413] mb-2">{item.q}</h3>
                <p className="font-serif text-[14px] text-[#5A5752] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#E8E4DA] bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#141413]">Start Your Free Case Analysis</h2>
          <p className="font-serif text-lg text-[#636059]">No registration required. Get instant statutory analysis in under 2 minutes.</p>
          <Link
            href="/dashboard/chat?init=My+landlord+is+refusing+to+return+my+security+deposit"
            className="inline-flex items-center gap-2 bg-[#141413] hover:bg-black text-white font-medium px-8 py-3.5 rounded-full text-[15px] transition-all shadow-xs"
          >
            Analyze My Deposit Case <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
