"use client";

import React from "react";
import { useLegalStore } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { filterAdvocates } from "@/lib/mockData";
import { AdvocateCard } from "@/components/AdvocateCard";
import { Scale, RefreshCw, Shield, Zap, Terminal, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function AdvocatePanel() {
    const { detectedCategory, detectedCity, activeSessionId, urgency, complexity } = useLegalStore();
    const advocates = filterAdvocates(detectedCategory, detectedCity);

    return (
        <aside className="w-[400px] flex-shrink-0 bg-[#080810] flex flex-col h-full border-l border-white/5 overflow-hidden sticky right-0">
            {/* Intel Panel Header */}
            <div className="p-8 border-b bg-[#0D0D18]/[0.02] relative" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <Activity className="w-4 h-4" style={{ color: "#F59E0B" }} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Lawyer Matching</h2>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Top Verified Advocates</p>
                    </div>
                </div>

                {/* Case Snapshot Card */}
                {activeSessionId && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-3xl text-white relative overflow-hidden group shadow-2xl"
                        style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D0D18]/10 rounded-full translate-x-16 -translate-y-16 blur-2xl transition-all duration-700 group-hover:scale-110" />
                        
                        <div className="flex gap-2 items-center mb-6">
                            <Terminal className="w-3 h-3 text-white/50" />
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.4em]">Case Summary</p>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5 leading-none">Category</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white leading-tight truncate">{detectedCategory}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5 leading-none">Location</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white leading-tight truncate">{detectedCity || "India"}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5 leading-none">Urgency</p>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", urgency === "High" ? "bg-[#0D0D18] animate-pulse" : "bg-emerald-300")} />
                                        <p className="text-[10px] font-black uppercase tracking-tight leading-none text-white">{urgency}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1.5 leading-none">Complexity</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-white leading-none">{complexity}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Matching Engine */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar">
                <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recommended Advocates</p>
                    {advocates.length > 0 && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                             <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: "#A78BFA" }} />
                             <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#A78BFA" }}>{advocates.length} Lawyers Found</span>
                        </div>
                    )}
                </div>

                {advocates.length === 0 ? (
                    <div className="py-20 text-center px-10 border border-dashed rounded-[2rem]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <RefreshCw className="w-8 h-8 text-white/5 mx-auto mb-6 animate-spin-slow" />
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] leading-loose">Describe your issue to find matching lawyers...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {advocates.map((advocate) => (
                            <AdvocateCard key={advocate.id} advocate={advocate} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer System Status */}
            <div className="p-6 bg-[#0D0D18]/[0.02] border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Zap className="w-3.5 h-3.5" style={{ color: "rgba(245,158,11,0.5)" }} />
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Network Live</p>
                    </div>
                    <Shield className="w-4 h-4 text-white/10" />
                </div>
            </div>
        </aside>
    );
}
