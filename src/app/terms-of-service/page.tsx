import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — LexNova',
  description: 'LexNova Terms of Service. Read our terms and conditions for using India\'s AI legal operating system.',
};

const LAST_UPDATED = 'August 31, 2026';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#141413]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-[12px] font-mono font-bold text-[#87837B] tracking-[0.1em] uppercase mb-3">
            Legal Framework
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#141413] tracking-tight leading-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-[#636059]">
            Last updated: <strong className="text-[#141413]">{LAST_UPDATED}</strong>
          </p>

          {/* Critical disclaimer */}
          <div className="mt-6 p-5 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
            <div className="text-[14.5px] font-bold text-[#141413] mb-1.5">
              LEGAL DISCLAIMER & STATUTORY NOTICE
            </div>
            <p className="text-[13.5px] text-[#5A5752] leading-relaxed">
              <strong>LexNova is an AI technology platform and is not a law firm.</strong> The AI-generated analysis on this platform constitutes statutory information and pre-action protocol drafts — not personal legal advice. Advocate-client privilege and formal advice are established exclusively upon booking and engaging with Bar-enrolled practitioners.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#42403B]">

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the LexNova platform ("<strong className="text-white">Platform</strong>"), you agree to be bound by these Terms of Service ("<strong className="text-white">Terms</strong>"). If you do not agree to these Terms, you may not use the Platform. These Terms constitute a legally binding agreement under the Indian Contract Act 1872.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">2. Description of Services</h2>
            <p>LexNova provides:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li><strong className="text-white">AI Legal Information:</strong> General information about Indian law based on your described facts</li>
              <li><strong className="text-white">Document Templates:</strong> AI-generated draft notices and complaint templates for review by an advocate</li>
              <li><strong className="text-white">Limitation Period Tracking:</strong> Estimated statutory deadlines based on your case type (not a substitute for legal advice)</li>
              <li><strong className="text-white">Advocate Matching:</strong> Technology-facilitated introduction to independent enrolled advocates</li>
              <li><strong className="text-white">Case Management:</strong> Digital workspace to organise your legal matter documents and timeline</li>
            </ul>
            <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[13.5px] text-red-300">
              <strong>Not provided:</strong> Legal representation, legal advice, court filing services, or guarantee of any legal outcome. AI output must be reviewed and verified by a qualified advocate before use.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">3. Eligibility</h2>
            <p>
              You must be at least <strong className="text-white">18 years of age</strong> to use the Platform. By creating an account, you represent that you are 18 or older and have the legal capacity to enter into contracts under Indian law.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">4. User Accounts</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for all activity that occurs under your account</li>
              <li>You must immediately notify us at <a href="mailto:security@lexnova.in" className="text-blue-400 hover:underline">security@lexnova.in</a> of any unauthorised access</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">5. Advocate Engagement & Payments</h2>
            <p>
              When you book a paid consultation through LexNova:
            </p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li>The consultation fee is paid to the independent advocate, not to LexNova</li>
              <li>LexNova facilitates the booking and payment but is not a party to the advocate-client relationship</li>
              <li>Refunds for cancelled bookings are governed by the cancellation policy displayed at booking</li>
              <li>All payments are processed by Razorpay and subject to Razorpay&apos;s terms</li>
              <li>LexNova may charge a platform service fee as disclosed at the time of booking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">6. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside mt-3 text-[14px]">
              <li>Use the Platform for any illegal purpose or to facilitate illegal activities</li>
              <li>Submit false, misleading, or fabricated case information</li>
              <li>Impersonate any person or entity, including advocates</li>
              <li>Attempt to bypass, disable, or interfere with security features</li>
              <li>Use automated bots, scrapers, or tools without our express written consent</li>
              <li>Reverse engineer or attempt to extract our AI models or proprietary algorithms</li>
              <li>Harass, threaten, or abuse other users or advocates on the Platform</li>
              <li>Upload content that infringes third-party intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
            </p>
            <ul className="space-y-2 list-disc list-inside mt-3 text-[14px]">
              <li>LexNova is not liable for any reliance on AI-generated legal information without independent advocate verification</li>
              <li>LexNova is not responsible for the advice, conduct, or negligence of independent advocates</li>
              <li>Our total aggregate liability shall not exceed the fees paid by you to LexNova in the 3 months preceding the claim</li>
              <li>We are not liable for any loss of data, revenue, profits, or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">8. Intellectual Property</h2>
            <p>
              All content, AI models, software, designs, trademarks, and data on the Platform are the intellectual property of LexNova Technologies Pvt. Ltd., protected under the Copyright Act 1957, Trade Marks Act 1999, and applicable Indian IP law. You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
            <p className="mt-3">
              Documents generated by you using the Platform (legal notices, complaint drafts) belong to you. However, you grant LexNova a perpetual, royalty-free licence to use anonymised, aggregated patterns from such documents to improve our AI models.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">9. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of <strong className="text-white">Bengaluru, Karnataka, India</strong>.
            </p>
            <p className="mt-3">
              Before initiating legal proceedings, you agree to attempt good-faith resolution by contacting <a href="mailto:legal@lexnova.in" className="text-blue-400 hover:underline">legal@lexnova.in</a>. We aim to resolve disputes within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">10. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@lexnova.in" className="text-blue-400 hover:underline">legal@lexnova.in</a>.
            </p>
            <p className="mt-3">
              See also:{' '}
              <Link href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>
              {' · '}
              <Link href="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</Link>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
