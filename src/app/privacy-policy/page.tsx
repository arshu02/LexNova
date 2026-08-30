import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — LexNova',
  description: 'LexNova Privacy Policy — DPDPA 2023 compliant. Learn how we collect, use, and protect your personal data.',
};

const LAST_UPDATED = 'August 31, 2026';
const DPO_EMAIL = 'dpo@lexnova.in';
const CONTACT_EMAIL = 'legal@lexnova.in';
const APP_URL = 'https://lexnova.in';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050508] text-[#F0F2F5]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-400 tracking-[0.1em] uppercase mb-4">
            Legal Documents
          </div>
          <h1 className="text-[40px] sm:text-[52px] font-bold text-white tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#8D9CB0]">
            Last updated: <strong className="text-white">{LAST_UPDATED}</strong>
            {' '}· Effective for all users in India and worldwide
          </p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[14px] text-blue-300">
            This policy is compliant with the{' '}
            <strong>Digital Personal Data Protection Act 2023 (DPDPA)</strong>,{' '}
            <strong>Information Technology (Reasonable Security Practices) Rules 2011</strong>, and{' '}
            <strong>EU General Data Protection Regulation (GDPR)</strong> for international users.
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-[15px] leading-relaxed text-[#C5D0DC]">

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">1. Who We Are</h2>
            <p>
              LexNova ("<strong className="text-white">we</strong>", "<strong className="text-white">us</strong>", "<strong className="text-white">our</strong>") is an AI legal technology platform operated by <strong className="text-white">LexNova Technologies Pvt. Ltd.</strong>, incorporated under the Companies Act 2013 (India). Our registered address will be updated on this page upon incorporation.
            </p>
            <p className="mt-3">
              We operate the website <a href={APP_URL} className="text-blue-400 hover:underline">lexnova.in</a> and all associated applications (collectively, the "<strong className="text-white">Platform</strong>").
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">2. Data We Collect</h2>
            <div className="space-y-4">
              {[
                {
                  category: 'Account Data',
                  examples: 'Name, email address, password hash (never plaintext), city, phone number.',
                  legal: 'Contract performance (providing the service).',
                },
                {
                  category: 'Case & Legal Data',
                  examples: 'Your described dispute facts, uploaded documents, hearing dates, settlement terms.',
                  legal: 'Legitimate interest (providing legal information services); consent for sensitive data.',
                },
                {
                  category: 'Payment Data',
                  examples: 'Razorpay order ID, payment ID. We never store card numbers or CVVs — these are processed directly by Razorpay.',
                  legal: 'Contract performance (processing consultations).',
                },
                {
                  category: 'Usage Data',
                  examples: 'Pages visited, features used, IP address, browser type, session duration.',
                  legal: 'Legitimate interest (platform security and improvement).',
                },
                {
                  category: 'Communication Data',
                  examples: 'Messages between users and advocates on the platform.',
                  legal: 'Contract performance and legal obligation (record-keeping).',
                },
              ].map(item => (
                <div key={item.category} className="bg-[#0A0C12] border border-white/[0.08] rounded-xl p-5">
                  <h3 className="text-[15px] font-bold text-white mb-2">{item.category}</h3>
                  <p className="text-[13.5px] text-[#9AA8BC] mb-2">{item.examples}</p>
                  <p className="text-[12.5px] text-[#6B7B94]"><strong className="text-[#7A8A9E]">Legal basis:</strong> {item.legal}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">3. How We Use Your Data</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Provide AI-powered legal case analysis and document generation</li>
              <li>Match you with appropriate verified advocates</li>
              <li>Process consultation bookings and payments</li>
              <li>Send booking confirmations, hearing reminders, and account notifications</li>
              <li>Improve our AI models and platform features (using anonymized, aggregated data only)</li>
              <li>Comply with legal obligations under Indian law</li>
              <li>Detect and prevent fraud, abuse, and security threats</li>
            </ul>
            <p className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[13.5px] text-amber-300">
              <strong>⚠️ Important:</strong> We <strong>never sell, rent, or trade</strong> your personal data to third parties for marketing purposes. We never share your case facts with anyone other than the advocate you book a consultation with.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">4. Data Retention</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.1]">
                    <th className="text-left py-3 pr-6 text-white font-semibold">Data Type</th>
                    <th className="text-left py-3 text-white font-semibold">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {[
                    ['Account data', '7 years from account closure (tax/legal obligation)'],
                    ['Case facts & documents', '7 years from case closure'],
                    ['Payment records', '8 years (GST compliance)'],
                    ['Session data & logs', '90 days'],
                    ['Marketing preferences', 'Until withdrawn'],
                    ['Deleted account PII', 'Permanently erased within 30 days'],
                  ].map(([type, period]) => (
                    <tr key={type}>
                      <td className="py-3 pr-6 text-[#C5D0DC]">{type}</td>
                      <td className="py-3 text-[#9AA8BC]">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">5. Your Rights (DPDPA 2023 & GDPR)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { right: '📋 Right to Access', desc: 'Request a complete copy of all data we hold about you.' },
                { right: '✏️ Right to Correction', desc: 'Request correction of inaccurate personal data.' },
                { right: '🗑️ Right to Erasure', desc: 'Request deletion of your account and personal data.' },
                { right: '📤 Right to Portability', desc: 'Export all your data in machine-readable JSON format.' },
                { right: '🚫 Right to Object', desc: 'Object to processing based on legitimate interest.' },
                { right: '🔒 Right to Restrict', desc: 'Request restriction of processing while disputes are resolved.' },
              ].map(item => (
                <div key={item.right} className="bg-[#0A0C12] border border-white/[0.08] rounded-xl p-4">
                  <div className="font-bold text-white text-[14px] mb-1">{item.right}</div>
                  <div className="text-[13px] text-[#8D9CB0]">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              To exercise any of these rights, visit your{' '}
              <Link href="/dashboard/settings" className="text-blue-400 hover:underline">Account Settings</Link>{' '}
              or email our Data Protection Officer at{' '}
              <a href={`mailto:${DPO_EMAIL}`} className="text-blue-400 hover:underline">{DPO_EMAIL}</a>.
              We will respond within <strong className="text-white">72 hours</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">6. Security</h2>
            <p>
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Our infrastructure is hosted on Supabase (ISO 27001 certified) and Vercel. We conduct quarterly security reviews and penetration testing. Access to production data is restricted to authorised personnel only, subject to strict access controls and audit logs.
            </p>
            <p className="mt-3">
              In the event of a personal data breach that poses a risk to your rights, we will notify affected users and the relevant Data Protection Board within <strong className="text-white">72 hours</strong> as required by DPDPA 2023.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">7. Third-Party Services</h2>
            <div className="space-y-3">
              {[
                { name: 'Supabase', purpose: 'PostgreSQL database, file storage', policy: 'https://supabase.com/privacy' },
                { name: 'Anthropic (Claude)', purpose: 'AI legal analysis (no data retained by Anthropic)', policy: 'https://www.anthropic.com/privacy' },
                { name: 'Razorpay', purpose: 'Payment processing (PCI-DSS compliant)', policy: 'https://razorpay.com/privacy/' },
                { name: 'Resend', purpose: 'Transactional email delivery', policy: 'https://resend.com/privacy' },
                { name: 'Vercel', purpose: 'Application hosting and CDN', policy: 'https://vercel.com/legal/privacy-policy' },
                { name: 'Sentry', purpose: 'Error monitoring (anonymized)', policy: 'https://sentry.io/privacy/' },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between border-b border-white/[0.06] py-2">
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[#7A8A9E] text-[13px] ml-3">— {item.purpose}</span>
                  </div>
                  <a href={item.policy} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue-400 hover:underline shrink-0 ml-4">Policy ↗</a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">8. Cookies</h2>
            <p>
              We use essential cookies required for authentication and security, and optional cookies for analytics and personalisation. You can manage your cookie preferences at any time via the cookie banner or your browser settings. See our{' '}
              <Link href="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">9. Changes to This Policy</h2>
            <p>
              We will notify you of material changes to this policy via email and an in-app notice at least 30 days before the changes take effect. Continued use of the Platform after that date constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold text-white mb-4">10. Contact</h2>
            <div className="bg-[#0A0C12] border border-white/[0.08] rounded-xl p-6 space-y-3">
              <div>
                <div className="text-[13px] text-[#6B7B94]">Data Protection Officer</div>
                <a href={`mailto:${DPO_EMAIL}`} className="text-blue-400 hover:underline font-medium">{DPO_EMAIL}</a>
              </div>
              <div>
                <div className="text-[13px] text-[#6B7B94]">General Legal Enquiries</div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline font-medium">{CONTACT_EMAIL}</a>
              </div>
              <div>
                <div className="text-[13px] text-[#6B7B94]">Grievance Officer (as required by IT Rules 2021)</div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline font-medium">{CONTACT_EMAIL}</a>
                <div className="text-[12px] text-[#6B7B94] mt-1">Response within 72 hours; grievances resolved within 15 days per Rule 3(2).</div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
