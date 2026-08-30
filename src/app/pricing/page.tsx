'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check, ArrowRight, Shield, Sparkles, Scale, Video } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] selection:bg-blue-600/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-[160px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-44 pb-32 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="resend-badge">
            <span className="text-[13.5px]">Plans & Transparent Pricing</span>
          </div>
          
          <h1 className="text-[52px] md:text-[68px] font-display text-white tracking-tight leading-[1.02]">
            Simple, transparent<br />pricing
          </h1>
          <p className="text-[19px] text-[#CBD5E1] leading-relaxed max-w-xl">
            Start with free AI legal analysis. Upgrade to automated court-ready drafting or schedule consultations with verified advocates.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Free Starter */}
          <div className="p-8 sm:p-9 bg-[#0A0A0D] border border-white/[0.1] rounded-2xl flex flex-col justify-between hover:border-white/[0.2] transition-colors space-y-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-[22px] font-bold text-white">AI Case Intake</h3>
                <p className="text-[14px] text-[#94A3B8] mt-1">For citizens and individuals exploring legal rights.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-[42px] font-bold text-white font-mono">₹0</span>
                <span className="text-[14px] text-[#94A3B8]">/ forever free</span>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-3.5">
                {[
                  "4-Step Conversational AI Intake",
                  "Statutory Act Identification (CPC, CPA 2019)",
                  "Limitation Period Clock Calculation",
                  "Authoritative Supreme Court Guidance",
                  "Advocate Matching & Compatibility Score",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[15px] text-[#CBD5E1]">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/chat"
              className="btn-ghost text-[15px] font-semibold text-center w-full"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Document Studio (Featured) */}
          <div className="p-8 sm:p-9 bg-[#0E0E12] border border-white/[0.25] rounded-2xl flex flex-col justify-between shadow-2xl relative space-y-8 shadow-blue-950/30">
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-white text-black text-[11px] font-mono font-bold rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-[22px] font-bold text-white">Document Studio</h3>
                <p className="text-[14px] text-[#94A3B8] mt-1">For automated legal notices & complaint drafting.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-[42px] font-bold text-white font-mono">₹499</span>
                <span className="text-[14px] text-[#94A3B8]">/ month</span>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-3.5">
                {[
                  "Everything in AI Case Intake",
                  "Unlimited Legal Notice Drafting",
                  "Consumer Court (NCDRC) Petitions",
                  "Section 138 Cheque Bounce Notices",
                  "Direct Print & PDF Export",
                  "Custom Fact Customization & History",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[15px] text-[#CBD5E1]">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/documents"
              className="btn-primary text-[15px] font-semibold text-center w-full"
            >
              Access Document Studio →
            </Link>
          </div>

          {/* Plan 3: Advocate Video Consultations */}
          <div className="p-8 sm:p-9 bg-[#0A0A0D] border border-white/[0.1] rounded-2xl flex flex-col justify-between hover:border-white/[0.2] transition-colors space-y-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-[22px] font-bold text-white">Video Consultation</h3>
                <p className="text-[14px] text-[#94A3B8] mt-1">Direct 1-on-1 strategy call with verified counsel.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-[42px] font-bold text-white font-mono">₹799</span>
                <span className="text-[14px] text-[#94A3B8]">/ from per 60-min session</span>
              </div>

              <div className="pt-5 border-t border-white/[0.08] space-y-3.5">
                {[
                  "Bar Council Enrolled Trial Advocates",
                  "60-Minute HD Video Consultation Room",
                  "Pre-Meeting 60s AI Counsel Briefing",
                  "Document Sign-off & RPAD Notice Review",
                  "Email Confirmation & Appointment Reminders",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[15px] text-[#CBD5E1]">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/advocates"
              className="btn-ghost text-[15px] font-semibold text-center w-full"
            >
              Browse Advocates
            </Link>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
