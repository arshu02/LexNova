'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search, Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{background: scrolled ? 'rgba(5, 5, 8, 0.92)' : 'rgba(5, 5, 8, 0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99, 102, 241, 0.1)'}}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-[72px] flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-[19px] sm:text-[21px] font-extrabold tracking-[0.18em] select-none" style={{background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
            LEXNOV\A
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <div className="relative group cursor-pointer">
            <span className="text-[14px] font-medium text-[#A8AECF] group-hover:text-white transition-colors flex items-center gap-1">
              Research
              <ChevronDown size={13} className="text-[#6B72A0] group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </span>
            <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50" style={{background: 'rgba(10, 11, 18, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)'}}>
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                Autonomous Jurisdictions
              </Link>
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                Statutory Limitation AI
              </Link>
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                Court Admissibility Benchmarks
              </Link>
            </div>
          </div>

          <Link
            href="/how-it-works"
            className="text-[14px] font-medium text-[#A8AECF] hover:text-white transition-colors"
          >
            Policy
          </Link>

          <div className="relative group cursor-pointer">
            <span className="text-[14px] font-medium text-[#A8AECF] group-hover:text-white transition-colors flex items-center gap-1">
              Jurisdictions
              <ChevronDown size={13} className="text-[#6B72A0] group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </span>
            <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50" style={{background: 'rgba(10, 11, 18, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)'}}>
              <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider" style={{color: '#6B72A0'}}>
                Active Frameworks
              </div>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                🇺🇸 US Delaware & UCC §2-708
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                🇬🇧 UK High Court & CPR Claims
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                🇪🇺 EU GDPR & Mahnschreiben
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                🇸🇬 Singapore SIAC Arbitration
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#A8AECF] hover:text-white hover:bg-white/5 rounded-xl font-medium">
                🇮🇳 India Sec 138 NI & BNS
              </Link>
            </div>
          </div>

          <Link
            href="/advocates"
            className="text-[14px] font-medium text-[#A8AECF] hover:text-white transition-colors"
          >
            Advocates
          </Link>

          <Link
            href="/pricing"
            className="text-[14px] font-medium text-[#A8AECF] hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
              );
            }}
            className="text-[#6B72A0] hover:text-white transition-colors p-1.5"
            title="Search (⌘K)"
          >
            <Search size={17} />
          </button>

          <Link
            href="/auth/login"
            className="text-[14px] font-medium text-[#A8AECF] hover:text-white transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-white text-[13.5px] font-semibold tracking-tight shadow-lg hover:shadow-xl transition-all"
            style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 14px rgba(99,102,241,0.4)'}}
          >
            <span>Try LexNova</span>
            <ArrowRight size={13} className="text-white/80" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/dashboard/chat"
            className="px-3.5 py-1.5 rounded-full text-white text-[12.5px] font-semibold"
            style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'}}
          >
            Try LexNova
          </Link>
          <button
            className="text-white p-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 py-6 space-y-4"
            style={{background: 'rgba(5, 5, 8, 0.97)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)'}}
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/chat"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-white"
              >
                AI Case Intake
              </Link>
              <Link
                href="/advocates"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#A8AECF]"
              >
                Advocates Directory
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#A8AECF]"
              >
                Research & How It Works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#A8AECF]"
              >
                Enterprise Pricing
              </Link>
            </div>

            <div className="pt-4 flex flex-col gap-3" style={{borderTop: '1px solid rgba(99, 102, 241, 0.15)'}}>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-[14px] font-medium text-[#A8AECF]"
                style={{border: '1px solid rgba(99, 102, 241, 0.2)', background: 'rgba(255,255,255,0.03)'}}
              >
                Sign in
              </Link>
              <Link
                href="/dashboard/user"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-white text-[14px] font-semibold"
                style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'}}
              >
                Launch Console
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
