"use client";

import { motion } from "framer-motion";
import { Search, Home, ArrowRight, ShieldCheck, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
      {/* Soft Ambient Glows */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-60"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)" }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Visual Badge / Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200/90 flex items-center justify-center shadow-md shadow-indigo-500/10 group transition-transform duration-500 hover:scale-105">
            <Search className="w-9 h-9 text-indigo-600" />
          </div>
          <motion.div 
            animate={{ scale: [0.95, 1.12, 0.95] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-3 border border-dashed border-indigo-200/60 rounded-full pointer-events-none"
          />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-700 text-xs font-bold font-mono uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span>Error 404 · Destination Relocated</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-md mx-auto mb-8">
          The legal matter, page, or document node you requested cannot be reached. It may have been relocated or is no longer an active path.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-white text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/dashboard/chat"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-700 text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Start Case Intake</span>
          </Link>
          <Link
            href="/dashboard/advocates"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-700 text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs hover:-translate-y-0.5"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Find Advocate</span>
          </Link>
        </div>

        {/* Technical Footer Verification */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex items-center justify-center gap-8 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>LexNova AI Legal OS</span>
          </div>
          <div className="h-3.5 w-px bg-slate-200" />
          <div className="font-mono text-[11px] text-slate-400">
            SECURE-ESCROW-PROTECTED
          </div>
        </div>
      </motion.div>
    </div>
  );
}
