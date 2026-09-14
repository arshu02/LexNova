'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Scale, Search, MapPin, ChevronDown, Sparkles, ShieldCheck,
  Zap, FileText, Clock, ArrowRight, X, Menu, PhoneCall,
  CheckCircle2, ExternalLink, Globe, Building2, Briefcase,
  AlertCircle, MessageSquare, Award, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Search suggestions & trending items ────────────────────────
const TRENDING_SEARCHES = [
  { label: 'Security Deposit Refund', category: 'Property', href: '/security-deposit-recovery', icon: Building2 },
  { label: 'Unpaid Salary & Notice to Employer', category: 'Employment', href: '/advocates', icon: Briefcase },
  { label: 'Advocate Priya Mehta (NLSIU)', category: 'Advocates', href: '/advocates', icon: Award },
  { label: 'Section 138 Cheque Bounce Notice', category: 'Commercial', href: '/dashboard/chat', icon: FileText },
  { label: 'RERA Builder Possession Delay', category: 'Real Estate', href: '/advocates', icon: Building2 },
  { label: 'Defective Product Consumer Claim', category: 'Consumer', href: '/advocates', icon: Scale },
];

const JURISDICTIONS = [
  { id: 'delhi', name: 'Delhi High Court & Supreme Court', courts: 'Supreme Court · Delhi HC · District Courts', active: true, flag: '🇮🇳' },
  { id: 'mumbai', name: 'Bombay High Court & NCLT Mumbai', courts: 'Bombay HC · NCLT · City Civil Court', active: false, flag: '🇮🇳' },
  { id: 'bengaluru', name: 'Karnataka High Court & RERA Bengaluru', courts: 'Karnataka HC · RERA Tribunal · Civil Courts', active: false, flag: '🇮🇳' },
  { id: 'chennai', name: 'Madras High Court & State Consumer', courts: 'Madras HC · Consumer Disputes Commission', active: false, flag: '🇮🇳' },
  { id: 'us-delaware', name: 'US Delaware & Federal Chancery', courts: 'Delaware Chancery · US Fed District · AAA', active: false, flag: '🇺🇸' },
  { id: 'uk-highcourt', name: 'UK High Court & CPR Commercial', courts: 'Rolls Building · Commercial Court · SRA', active: false, flag: '🇬🇧' },
];

const MEGA_MENU_CATEGORIES = [
  {
    title: 'Autonomous Legal AI',
    badge: 'CORE ENGINE',
    items: [
      { name: 'AI Case Intake & Triage', desc: 'Auto-extract facts, governing acts & damage claims', href: '/dashboard/chat', icon: Zap, tag: 'Instant' },
      { name: 'Statutory Limitation Clock', desc: 'Precision limitation period countdown & deadlines', href: '/how-it-works', icon: Clock, tag: 'Live' },
      { name: 'Contract & Clause Risk Scanner', desc: 'Scan NDAs, lease deeds & commercial agreements', href: '/dashboard/chat', icon: FileText, tag: 'New' },
    ]
  },
  {
    title: 'Verified Advocate Network',
    badge: 'BAR COUNCIL VERIFIED',
    items: [
      { name: 'Top Verified Advocates (2,400+)', desc: 'Browse counsels across 7 practice domains with ratings', href: '/advocates', icon: Award, tag: '2.4k+' },
      { name: 'Fixed-Fee Consultations', desc: 'Encrypted 1-on-1 video strategy sessions from ₹799', href: '/advocates', icon: ShieldCheck, tag: 'Escrow' },
      { name: 'Security Deposit Recovery Concierge', desc: 'End-to-end landlord notice & legal recovery flow', href: '/security-deposit-recovery', icon: Building2, tag: 'Popular' },
    ]
  },
  {
    title: 'Court-Ready Automation',
    badge: 'STATUTORY COMPLIANT',
    items: [
      { name: '15-Day Statutory Legal Notice', desc: 'Generate court-admissible notices with tracked proof', href: '/dashboard/chat', icon: FileText, tag: 'Court PDF' },
      { name: 'Pre-Action Protocol Letters', desc: 'India BNS, Delaware UCC §2-708, UK CPR Claims', href: '/how-it-works', icon: Globe, tag: '52 States' },
      { name: 'Transparent Transparent Pricing', desc: 'Compare Citizen, Professional Counsel & Enterprise', href: '/pricing', icon: Scale, tag: 'Free Tier' },
    ]
  }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Interactive UI states
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(JURISDICTIONS[0]);
  
  // Cycling animated placeholder
  const placeholders = [
    'Search "Security deposit refund Mumbai"...',
    'Search "Unpaid 3 months salary legal notice"...',
    'Search "Advocate Priya Mehta (Property)"...',
    'Search "Cheque bounce Section 138 notice"...',
    'Search "RERA builder possession delay"...'
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);

  // Cycle search placeholder
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  // Scroll listener for elevation shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside to close flyouts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (locationContainerRef.current && !locationContainerRef.current.contains(event.target as Node)) {
        setLocationOpen(false);
      }
      if (featuresContainerRef.current && !featuresContainerRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/advocates?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/dashboard/chat');
    }
  };

  const triggerGlobalCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/98 shadow-[0_4px_25px_rgba(15,23,42,0.08)] border-b border-slate-200/90'
          : 'bg-white/95 shadow-[0_2px_15px_rgba(15,23,42,0.04)] border-b border-slate-200/80'
      } backdrop-blur-md`}
    >
      {/* ── ROW 1: PRIMARY COMMAND NAVBAR (Zepto & Blinkit Style) ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand + Jurisdiction Delivery Widget */}
        <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-[0_2px_12px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform">
              <Scale size={20} className="text-white" strokeWidth={2.3} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-[21px] text-slate-900 leading-none select-none font-sans">
                  LEXNOVA
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80 tracking-wider">
                  AI OS
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider hidden sm:block">
                GLOBAL LEGAL INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Location / Jurisdiction Delivery Selector (Iconic Zepto & Blinkit Feature!) */}
          <div className="relative hidden xl:block" ref={locationContainerRef}>
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-slate-100/80 transition-all text-left group"
              title="Select Jurisdiction / Active Court"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <MapPin size={15} className="text-emerald-600" />
              </div>
              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-[11px] font-bold text-slate-900 tracking-tight flex items-center gap-1">
                    <span>{selectedJurisdiction.flag}</span>
                    <span className="truncate max-w-[130px]">{selectedJurisdiction.name.split(' ')[0]} Jurisdiction</span>
                  </span>
                  <ChevronDown size={12} className={`text-slate-500 transition-transform duration-200 ${locationOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>2,400+ Advocates Active</span>
                </div>
              </div>
            </button>

            {/* Jurisdiction Dropdown Flyout */}
            <AnimatePresence>
              {locationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.12)] p-3 z-50"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Active Court Jurisdiction</p>
                    <p className="text-[12px] text-slate-600 font-medium">Automatic limitation calculation & advocate triage</p>
                  </div>
                  <div className="space-y-1">
                    {JURISDICTIONS.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => {
                          setSelectedJurisdiction(j);
                          setLocationOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 transition-colors ${
                          selectedJurisdiction.id === j.id
                            ? 'bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-200/80'
                            : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <span className="text-base">{j.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-slate-900">{j.name}</p>
                          <p className="truncate text-[11px] text-slate-500">{j.courts}</p>
                        </div>
                        {selectedJurisdiction.id === j.id && (
                          <CheckCircle2 size={14} className="text-indigo-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                    <Link href="/how-it-works" onClick={() => setLocationOpen(false)} className="hover:underline flex items-center gap-1">
                      <span>View All 52 Global Frameworks</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Prominent Zepto / Blinkit Search Bar */}
        <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div
              className={`h-11 rounded-2xl border transition-all duration-200 flex items-center px-3.5 gap-2.5 ${
                searchFocused
                  ? 'bg-white border-indigo-600 ring-4 ring-indigo-500/10 shadow-md'
                  : 'bg-slate-100/80 hover:bg-slate-100 border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              <Search
                size={17}
                className={`transition-colors flex-shrink-0 ${
                  searchFocused ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent text-[13.5px] text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={triggerGlobalCommandPalette}
                  className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 text-[10px] font-mono font-bold shadow-2xs hover:border-slate-300"
                  title="Press ⌘K to open command search"
                >
                  <span>⌘</span>
                  <span>K</span>
                </button>
              )}
            </div>
          </form>

          {/* Quick Search Flyout Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-4 z-50 overflow-hidden"
              >
                {/* Popular / Trending Searches */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500" />
                      Trending Legal Inquiries Today
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Quick Auto-Match</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {TRENDING_SEARCHES.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50/70 group transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100/70 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center flex-shrink-0 transition-colors">
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12.5px] font-semibold text-slate-800 group-hover:text-indigo-900 truncate">
                              {item.label}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium group-hover:text-indigo-600">
                              {item.category}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Quick 1-Click Action Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 -mx-4 -mb-4 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                    <Zap size={14} className="text-indigo-600" />
                    <span>Need instant legal strategy?</span>
                  </div>
                  <Link
                    href="/dashboard/chat"
                    onClick={() => setSearchFocused(false)}
                    className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>Launch AI Case Intake</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions: Directory, Sign In, Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Direct link to Advocates directory */}
          <Link
            href="/advocates"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          >
            <span>Advocates</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600 text-[10.5px] font-bold border border-emerald-200">
              2.4k+
            </span>
          </Link>

          {/* Pricing link */}
          <Link
            href="/pricing"
            className="hidden lg:block px-3 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          >
            Pricing
          </Link>

          {/* Sign In button */}
          <Link
            href="/auth/login"
            className="px-3.5 py-2 rounded-xl text-[13.5px] font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          >
            Sign in
          </Link>

          {/* High-Converting Zepto/Blinkit Style Action Button */}
          <Link
            href="/dashboard/chat"
            className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-full text-white text-[13px] sm:text-[13.5px] font-bold tracking-tight shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #7C3AED 100%)'
            }}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap size={14} className="text-amber-300 fill-amber-300 animate-pulse" />
            <span>Try LexNova Free</span>
            <ArrowRight size={13} className="text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── ROW 2: ZEPTO / BLINKIT CATEGORY & FEATURE RIBBON ── */}
      <div className="bg-white border-t border-slate-150 px-4 sm:px-6 lg:px-8 h-10 hidden md:flex items-center justify-between text-[12.5px] overflow-x-auto no-scrollbar shadow-2xs">
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
          
          {/* Mega Menu Trigger: All Features */}
          <div className="relative" ref={featuresContainerRef}>
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-colors ${
                featuresOpen
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Sparkles size={13} />
              <span>All Features</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {featuresOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-[760px] rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_60px_rgba(15,23,42,0.16)] p-6 z-50 text-slate-900"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {MEGA_MENU_CATEGORIES.map((col, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{col.title}</span>
                          <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{col.badge}</span>
                        </div>
                        <div className="space-y-1.5">
                          {col.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={itemIdx}
                                href={item.href}
                                onClick={() => setFeaturesOpen(false)}
                                className="block p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Icon size={15} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 leading-snug">
                                        {item.name}
                                      </p>
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                        {item.tag}
                                      </span>
                                    </div>
                                    <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 -mx-6 -mb-6 px-6 py-3.5 rounded-b-3xl">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span className="text-[12px] font-semibold text-slate-700">
                        Zero-Knowledge End-to-End Encryption · Certified Bar Council Counsels
                      </span>
                    </div>
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setFeaturesOpen(false)}
                      className="text-[12px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <span>Launch AI Consultation</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-slate-300">|</span>

          {/* Feature Quick Ribbon Pills */}
          <Link
            href="/dashboard/chat"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>⚡ AI Case Intake</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </Link>

          <Link
            href="/advocates"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>👨‍⚖️ Verified Advocates</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">2,400+</span>
          </Link>

          <Link
            href="/dashboard/chat"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>📄 Legal Notice Drafter</span>
          </Link>

          <Link
            href="/how-it-works"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>⏱️ Limitation Calculator</span>
          </Link>

          <Link
            href="/security-deposit-recovery"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>🏢 Property & Security Deposit</span>
          </Link>

          <Link
            href="/advocates"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>💼 Labour & Unpaid Salary</span>
          </Link>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 font-medium transition-colors whitespace-nowrap"
          >
            <span>💳 Pricing & Escrow</span>
          </Link>
        </div>

        {/* Right side of ribbon: 24/7 Helpline & Frameworks */}
        <div className="flex items-center gap-3 text-slate-500 font-medium text-[11.5px] flex-shrink-0">
          <span className="hidden xl:inline flex items-center gap-1 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>52 Jurisdictions Synchronized</span>
          </span>
          <Link
            href="/how-it-works"
            className="hover:text-indigo-600 flex items-center gap-1 font-semibold"
          >
            <span>How it works</span>
            <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── MOBILE SLIDE-DOWN DRAWER (Sleek Clean White) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden px-5 py-5 space-y-4"
          >
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search disputes, legal acts, or advocates..."
                  className="w-full bg-transparent text-[13px] text-slate-900 focus:outline-none"
                />
              </div>
            </form>

            {/* Jurisdiction quick-pick on mobile */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedJurisdiction.flag}</span>
                <span className="text-xs font-bold text-slate-900">{selectedJurisdiction.name}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                2.4k+ Online
              </span>
            </div>

            {/* Feature categories navigation */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/dashboard/chat"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <Zap size={16} className="text-indigo-600" />
                  <span className="text-[9px] font-bold text-indigo-700 bg-white px-1.5 rounded">INSTANT</span>
                </div>
                <span className="text-xs font-bold text-slate-900">AI Case Intake</span>
                <span className="text-[10px] text-slate-500">Extract facts & acts</span>
              </Link>

              <Link
                href="/advocates"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <Award size={16} className="text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 bg-white px-1.5 rounded">2,400+</span>
                </div>
                <span className="text-xs font-bold text-slate-900">Find Advocates</span>
                <span className="text-[10px] text-slate-500">Bar Council verified</span>
              </Link>

              <Link
                href="/security-deposit-recovery"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex flex-col gap-1"
              >
                <Building2 size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-slate-900">Deposit Recovery</span>
                <span className="text-[10px] text-slate-500">Tenant protection</span>
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col gap-1"
              >
                <Scale size={16} className="text-purple-600" />
                <span className="text-xs font-bold text-slate-900">Plans & Escrow</span>
                <span className="text-[10px] text-slate-500">From ₹0 free tier</span>
              </Link>
            </div>

            {/* Quick links list */}
            <div className="space-y-1 pt-2 border-t border-slate-100 text-sm font-semibold text-slate-700">
              <Link
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-lg"
              >
                <span>Statutory Limitation & Architecture</span>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
              <Link
                href="/privacy-policy"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-lg text-xs text-slate-500"
              >
                <span>DPDPA & GDPR Privacy Governance</span>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Sign In to Account
              </Link>
              <Link
                href="/dashboard/chat"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Zap size={14} className="text-amber-300" />
                <span>Launch Free AI Case Intake</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
