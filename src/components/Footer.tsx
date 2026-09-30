'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, CheckCircle2, Globe, Shield, ArrowRight, Scale, Sparkles } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'AI Case Intake', href: '/dashboard/chat' },
    { label: 'Matter Workspace', href: '/dashboard/matters' },
    { label: 'Document Studio', href: '/dashboard/documents' },
    { label: 'Find an Advocate', href: '/advocates' },
    { label: 'Consultation Booking', href: '/dashboard/bookings' },
    { label: 'Pricing & Plans', href: '/pricing' },
  ],
  Platform: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Security Deposit Recovery', href: '/security-deposit-recovery' },
    { label: 'Bar Council Verification', href: '/how-it-works' },
    { label: 'Escrow Protection', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About LexNova', href: '/' },
    { label: 'Developer Portal', href: '/pricing' },
    { label: 'Press & Media', href: '/' },
    { label: 'Engineering Blog', href: '/' },
    { label: 'Contact Counsel Desk', href: 'mailto:legal@lexnova.in' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Compliance & DPDPA', href: '/privacy-policy' },
    { label: 'Legal Disclaimers', href: '/terms-of-service' },
    { label: 'Security Architecture', href: '/privacy-policy' },
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
    <footer className="relative overflow-hidden bg-white border-t border-slate-200/90 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Scale size={18} className="text-white" />
              </div>
              <span className="font-sans text-[20px] font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                LEXNOVA
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-50/90 via-violet-50/90 to-purple-50/90 text-indigo-700 border border-indigo-200/90 shadow-2xs tracking-widest font-mono">
                <Sparkles size={9} className="text-indigo-600 fill-indigo-500/20" />
                <span>JURIS</span>
              </span>
            </Link>

            <p className="text-[13.5px] leading-relaxed text-slate-600 max-w-sm">
              The Global AI Legal Operating System. Autonomous multi-jurisdictional intelligence across the US, UK, EU, India, and APAC with verified court citations, limitation countdowns, and licensed counsel.
            </p>

            {/* Newsletter */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-widest font-mono text-indigo-700">
                Global Legal Briefing & Regulatory Updates
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[13px] font-semibold py-2 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Subscribed to LexNova Global Briefing!
                </div>
              ) : (
                <form className="flex gap-2 max-w-sm" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="counsel@firm.com"
                    required
                    className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all min-w-0 font-medium"
                  />
                  <button
                    type="submit"
                    className="text-white text-[12.5px] font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-sm"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Mail, href: 'mailto:support@lexnova.ai', label: 'Email' }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/80 hover:border-indigo-200"
                >
                  <item.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-3.5">
              <h4 className="text-[12px] font-extrabold uppercase tracking-wider font-mono text-slate-900">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-600 hover:text-indigo-600 font-medium transition-colors block hover:translate-x-0.5 transform duration-150"
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
        <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-slate-500">
          <p>© 2026 LexNova Global Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Shield size={13} className="text-indigo-600" />
              256-Bit TLS &amp; Escrow Guaranteed
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              US · UK · EU · SG · IN Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
