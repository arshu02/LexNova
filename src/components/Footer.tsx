'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, CheckCircle2, Globe, Shield, ArrowRight } from 'lucide-react';

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
    { label: 'Statutory Limitation Clock', href: '/how-it-works' },
    { label: 'Escrow Protection', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About LexNova', href: '/' },
    { label: 'Developer Portal', href: '/developer' },
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
    <footer className="relative overflow-hidden" style={{ background: '#05060A', borderTop: '1px solid rgba(99,102,241,0.12)' }}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shadow-lg shadow-indigo-500/20" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                LN
              </div>
              <span className="font-mono text-[20px] font-extrabold tracking-[0.16em] text-white group-hover:text-indigo-400 transition-colors">
                LEXNOV\A
              </span>
            </Link>

            <p className="text-[13.5px] leading-relaxed max-w-sm" style={{ color: '#8F96B3' }}>
              The Global AI Legal Operating System. Autonomous multi-jurisdictional intelligence across the US, UK, EU, India, and APAC with verified court citations, limitation countdowns, and licensed counsel.
            </p>

            {/* Newsletter */}
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: '#818CF8' }}>
                Global Legal Briefing & Regulatory Updates
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[13px] font-medium py-2 px-3.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
                  <CheckCircle2 size={16} /> Subscribed to LexNova Global Briefing!
                </div>
              ) : (
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="counsel@firm.com"
                    required
                    className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-slate-500 focus:outline-none transition-all min-w-0"
                    style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                  />
                  <button
                    type="submit"
                    className="text-white text-[12.5px] font-semibold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 10px rgba(99,102,241,0.3)' }}
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(14,16,24,0.6)', border: '1px solid rgba(99,102,241,0.15)', color: '#8F96B3' }}
                >
                  <item.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.1em] font-mono" style={{ color: '#F0F2FF' }}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] transition-colors block hover:translate-x-0.5 transform duration-150"
                      style={{ color: '#8F96B3' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8F96B3')}
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
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono" style={{ borderTop: '1px solid rgba(99,102,241,0.1)', color: '#6B72A0' }}>
          <p>© 2026 LexNova Global Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield size={13} style={{ color: '#818CF8' }} />
              256-Bit TLS &amp; Escrow Guaranteed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              US · UK · EU · SG · IN Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
