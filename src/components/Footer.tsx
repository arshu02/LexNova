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
    <footer className="border-t border-white/[0.08] bg-[#050508] text-[#8D9CB0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-[19px]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Scale size={16} />
              </div>
              <span>LexNova</span>
            </Link>
            <p className="text-[13.5px] text-[#6B7B94] leading-relaxed max-w-sm">
              India&apos;s AI Legal Operating System. Instant case analysis, statutory limitation tracking, court-ready notice generation, and verified advocate matching.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <p className="text-[12px] font-semibold text-[#8D9CB0] uppercase tracking-wider">
                Legal updates & precedents
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[13px] text-emerald-400 font-medium py-1">
                  <CheckCircle2 size={16} /> Subscribed to LexNova Briefing!
                </div>
              ) : (
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-[13.5px] text-white placeholder-[#3D4E5E] focus:border-blue-500/50 focus:outline-none transition-colors min-w-0"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black text-[13px] font-semibold px-3.5 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0"
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
              <h4 className="text-[12.5px] font-bold text-[#C8D0DC] uppercase tracking-[0.08em]">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[#5B6B7C] hover:text-[#C8D0DC] transition-colors"
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
        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#3D4E5E]">
          <p>© 2026 LexNova Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Not a law firm · For informational purposes only</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
