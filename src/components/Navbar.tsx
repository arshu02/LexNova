'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search, Menu, X, ArrowUpRight } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/90 backdrop-blur-md border-b border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-[72px] flex items-center justify-between">
        
        {/* Brand Logo - Anthropic Style */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-[19px] sm:text-[21px] font-extrabold tracking-[0.18em] text-[#141413] select-none">
            LEXNOV\A
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          <div className="relative group cursor-pointer">
            <span className="text-[14px] font-medium text-[#42403B] group-hover:text-[#141413] transition-colors flex items-center gap-1">
              Research
              <ChevronDown size={13} className="text-[#87837B] group-hover:text-[#141413] transition-transform group-hover:translate-y-0.5" />
            </span>
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E8E4DA] rounded-2xl p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                Autonomous Jurisdictions
              </Link>
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                Statutory Limitation AI
              </Link>
              <Link href="/how-it-works" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                Court Admissibility Benchmarks
              </Link>
            </div>
          </div>

          <Link
            href="/how-it-works"
            className="text-[14px] font-medium text-[#42403B] hover:text-[#141413] transition-colors"
          >
            Policy
          </Link>

          <div className="relative group cursor-pointer">
            <span className="text-[14px] font-medium text-[#42403B] group-hover:text-[#141413] transition-colors flex items-center gap-1">
              Jurisdictions
              <ChevronDown size={13} className="text-[#87837B] group-hover:text-[#141413] transition-transform group-hover:translate-y-0.5" />
            </span>
            <div className="absolute top-full left-0 mt-2 w-60 bg-[#FFFFFF] border border-[#E8E4DA] rounded-2xl p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-[#87837B] uppercase tracking-wider">
                Active Frameworks
              </div>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                🇺🇸 US Delaware & UCC §2-708
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                🇬🇧 UK High Court & CPR Claims
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                🇪🇺 EU GDPR & Mahnschreiben
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                🇸🇬 Singapore SIAC Arbitration
              </Link>
              <Link href="/dashboard/chat" className="block px-3.5 py-2 text-[13px] text-[#2D2C2A] hover:bg-[#F7F4EE] rounded-xl font-medium">
                🇮🇳 India Sec 138 NI & BNS
              </Link>
            </div>
          </div>

          <Link
            href="/advocates"
            className="text-[14px] font-medium text-[#42403B] hover:text-[#141413] transition-colors"
          >
            Advocates
          </Link>

          <Link
            href="/pricing"
            className="text-[14px] font-medium text-[#42403B] hover:text-[#141413] transition-colors"
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
            className="text-[#636059] hover:text-[#141413] transition-colors p-1.5"
            title="Search (⌘K)"
          >
            <Search size={17} />
          </button>

          <Link
            href="/auth/login"
            className="text-[14px] font-medium text-[#42403B] hover:text-[#141413] transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-[13.5px] font-medium tracking-tight shadow-sm hover:shadow transition-all"
          >
            <span>Try LexNova</span>
            <ChevronDown size={13} className="text-white/70" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/dashboard/chat"
            className="px-3.5 py-1.5 rounded-full bg-[#141413] text-white text-[12.5px] font-medium"
          >
            Try LexNova
          </Link>
          <button
            className="text-[#141413] p-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FBF9F5] border-b border-[#EBE7DF] px-6 py-6 space-y-4"
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/chat"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#141413]"
              >
                AI Case Intake
              </Link>
              <Link
                href="/advocates"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#141413]"
              >
                Advocates Directory
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#141413]"
              >
                Research & How It Works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#141413]"
              >
                Enterprise Pricing
              </Link>
            </div>

            <div className="pt-4 border-t border-[#EBE7DF] flex flex-col gap-3">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-[#DED9CE] text-[14px] font-medium text-[#141413] bg-white"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard/user"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#141413] text-white text-[14px] font-medium"
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
