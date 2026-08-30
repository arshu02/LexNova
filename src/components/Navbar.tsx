'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scale, Sparkles, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/dashboard/chat', label: 'AI Case Intake' },
  { href: '/advocates', label: 'Advocates' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Enterprise Pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 pt-3.5 pb-2">
      <div className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 px-5 h-[62px] flex items-center justify-between ${
        scrolled
          ? 'bg-[#080B14]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
          : 'bg-[#080B14]/60 backdrop-blur-xl border border-white/[0.08]'
      }`}>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Scale size={16} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold tracking-tight text-white">
              LexNova
            </span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              2.5
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  active
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'text-[#8D9CB0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-[13.5px] font-semibold text-[#CBD5E1] hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/[0.05]"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard/user"
            className="btn-glow-blue text-[13px] font-semibold h-[38px] px-4 rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            <span>Launch Console</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#8D9CB0] p-1.5 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden max-w-6xl mx-auto mt-2 bg-[#080B14]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[14px] font-medium text-[#CBD5E1] hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-[14px] font-semibold text-white bg-white/[0.05] rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard/user"
                onClick={() => setMobileOpen(false)}
                className="btn-glow-blue w-full text-center justify-center text-[14px] font-semibold h-11 rounded-xl"
              >
                Launch Console →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
