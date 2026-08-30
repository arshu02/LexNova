'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scale, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/advocates', label: 'Advocates' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#050508]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
            <Scale size={17} />
          </div>
          <span className="text-[19px] font-bold tracking-tight text-white">
            LexNova
          </span>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md tracking-wider">
            OS
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-[14.5px] font-medium transition-all ${
                  active
                    ? 'text-white bg-white/[0.07]'
                    : 'text-[#9BAABB] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-[14.5px] font-medium text-[#9BAABB] hover:text-white transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard/chat"
            className="btn-primary text-[14px] font-semibold h-9 px-5 inline-flex items-center gap-1.5"
          >
            Start Free →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#9BAABB] p-2 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07090D] border-b border-white/[0.08] px-6 py-5 flex flex-col gap-1 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15.5px] text-[#9BAABB] hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3 mt-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-[15px] text-[#9BAABB] hover:text-white py-2">
                Sign in
              </Link>
              <Link href="/dashboard/chat" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-[15px] py-3">
                Start Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
