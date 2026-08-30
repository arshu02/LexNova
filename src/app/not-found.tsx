"use client";

import { motion } from "framer-motion";
import { Search, Home, ArrowRight, Cpu, Zap, Lock } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background Neural Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)" }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Not Found Visual Asset */}
        <div className="relative mb-12 flex justify-center">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)] group transition-transform duration-700 hover:rotate-12" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Search className="w-10 h-10" style={{ color: "#F59E0B" }} />
            </div>
            <motion.div 
               animate={{ scale: [0.8, 1.2, 0.8] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -inset-4 border border-dashed rounded-full"
               style={{ borderColor: "rgba(124,58,237,0.3)" }}
            />
        </div>

        <h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
          NODE <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #8B5CF6)" }}>NOT FOUND</span>
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mb-12 leading-loose">
          The requested synthesis node cannot be reached. It may have been relocated within the neural matrix or is no longer an active legal path.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <Link
            href="/"
            className="btn-gold w-full sm:w-auto px-10 py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-4 h-4" /> Root Navigation
          </Link>
          <Link
            href="/chat"
            className="w-full sm:w-auto px-10 py-5 rounded-full border hover:bg-white/5 text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            Initialize Module <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="mt-20 pt-10 border-t flex items-center justify-center gap-10 opacity-30 hover:opacity-100 transition-opacity" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
                <Zap className="w-4 h-4" style={{ color: "#F59E0B" }} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">LEXNOVA-404-PROTOCOL</p>
            </div>
            <div className="h-4 w-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center gap-3">
                <Lock className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">NODE-VERIFIED: NO</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
