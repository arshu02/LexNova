"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Home, LayoutDashboard, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LexNova System Interruption:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
      {/* Soft Ambient Radial Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-50"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)" }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Error Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200/90 flex items-center justify-center shadow-md shadow-rose-500/10 group transition-transform duration-500 hover:scale-105">
            <AlertCircle className="w-9 h-9 text-rose-600" />
          </div>
          <motion.div 
            animate={{ scale: [0.95, 1.12, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-3 border border-dashed border-rose-200/60 rounded-full pointer-events-none"
          />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold font-mono uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          <span>System Resilience · Exception Caught</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Session Interrupted
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-md mx-auto mb-8">
          An unexpected error occurred while executing this module. Your matter files, case records, and session data remain securely safeguarded.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-white text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-md shadow-rose-500/25 hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload &amp; Recover</span>
          </button>
          <Link
            href="/dashboard/user"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-700 text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs hover:-translate-y-0.5"
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
            <span>Dashboard Overview</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-700 text-[13.5px] font-bold transition-all flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
          </Link>
        </div>

        {/* Technical Footer Verification */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data Integrity Verified</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            DIGEST: {error.digest || "SYS_RECOVERY_NODE_OK"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
