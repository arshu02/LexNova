'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, Twitter, Linkedin, Github, Mail, CheckCircle2 } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'AI Case Intake', href: '/dashboard/chat' },
    { label: 'Matter Workspace', href: '/dashboard/matters' },
    { label: 'Document Studio', href: '/dashboard/documents' },
    { label: 'Find an Advocate', href: '/advocates' },
    { label: 'Consultation Booking', href: '/dashboard/bookings' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Platform: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Security Deposit Recovery', href: '/security-deposit-recovery' },
    { label: 'Bar Council Verification', href: '/how-it-works' },
    { label: 'Limitation Engine', href: '/how-it-works' },
    { label: 'Security & Encryption', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About LexNova', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Press Kit', href: '/' },
    { label: 'Blog', href: '/' },
    { label: 'Contact Us', href: 'mailto:legal@lexnova.in' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/privacy-policy' },
    { label: 'Disclaimer', href: '/terms-of-service' },
    { label: 'DPDPA 2023', href: '/privacy-policy' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-[#E8E4DA] bg-[#FAF8F5] text-[#636059] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2 text-[#141413] font-bold text-[19px]">
              <span className="font-mono text-[20px] font-extrabold tracking-[0.18em] text-[#141413]">
                LEXNOV\A
              </span>
            </Link>
            <p className="text-[13.5px] text-[#636059] leading-relaxed max-w-sm">
              The Global AI Legal Operating System. Autonomous multi-jurisdictional intelligence across the US, UK, EU, India, and APAC. Multi-currency claim quantification, international arbitration, and verified global counsel matching.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <p className="text-[12px] font-semibold text-[#87837B] uppercase tracking-wider font-mono">
                Global Legal Briefing & Regulatory Shifts
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[13px] text-emerald-700 font-medium py-1">
                  <CheckCircle2 size={16} /> Subscribed to Global LexNova Briefing!
                </div>
              ) : (
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@company.com"
                    required
                    className="flex-1 bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2 text-[13.5px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors min-w-0"
                  />
                  <button
                    type="submit"
                    className="bg-[#141413] text-white text-[13px] font-medium px-4 py-2 rounded-xl hover:bg-black transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-[12px] font-bold text-[#141413] uppercase tracking-[0.08em] font-mono">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[#636059] hover:text-[#141413] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#E8E4DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#87837B]">
          <p>© 2026 LexNova Global Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Global Multi-Jurisdiction Engine · Not a law firm</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              US · UK · EU · APAC Nodes Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

