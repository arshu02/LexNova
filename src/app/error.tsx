"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, ShieldAlert, Cpu } from "lucide-react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical System Interruption:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background Neural Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.1), transparent 70%)" }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Error Identity */}
        <div className="relative mb-12 flex justify-center">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4 border border-dashed rounded-full"
               style={{ borderColor: "rgba(245,158,11,0.3)" }}
            />
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
          SYSTEM <span className="text-red-500">INTERRUPTION</span>
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 leading-loose">
          A critical neural synthesis failure has been detected. The integrity of the session has been safeguarded.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-10 py-5 rounded-full text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #EF4444, #B91C1C)", boxShadow: "0 10px 30px rgba(239,68,68,0.3)" }}
          >
            <RotateCcw className="w-4 h-4" /> Initialize Recovery
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 rounded-full border hover:bg-white/5 text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            System Override
          </Link>
        </div>

        {/* Technical Metadata */}
        <div className="mt-20 pt-10 border-t flex items-center justify-center gap-8 opacity-30 hover:opacity-100 transition-opacity" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" style={{ color: "#F59E0B" }} />
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">LEXNOVA-ERROR-CORE</p>
            </div>
            <div className="h-4 w-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                DIGEST: {error.digest || "SYNTHESIS_ABORT_404_SEC"}
            </p>
        </div>
      </motion.div>
    </div>
  );
}
