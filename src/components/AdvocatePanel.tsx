"use client";

import React from "react";
import { useLegalStore } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { filterAdvocates } from "@/lib/mockData";
import { AdvocateCard } from "@/components/AdvocateCard";
import { 
    Scale, 
    ShieldCheck, 
    Lock, 
    Sparkles, 
    Search, 
    ArrowRight,
    Briefcase,
    MapPin,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export function AdvocatePanel() {
    const { detectedCategory, detectedCity, activeSessionId, urgency, complexity } = useLegalStore();
    const advocates = filterAdvocates(detectedCategory, detectedCity);

    return (
        <aside className="w-[390px] flex-shrink-0 bg-[#070A12] flex flex-col h-full border-l border-white/[0.08] overflow-hidden sticky right-0 z-30">
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] bg-[#0A0E1A]/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                            <Scale className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[13.5px] font-bold text-white tracking-tight">
                                Counsel on Record
                            </h2>
                            <p className="text-[10px] text-[#6B7B94] font-medium">
                                Bar Council Verified Advocates
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9.5px] font-semibold text-emerald-400">
                            {advocates.length} Available
                        </span>
                    </div>
                </div>

                {/* Case Intelligence Snapshot */}
                {activeSessionId && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-inner"
                    >
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                            <span>Active Matter Snapshot</span>
                            <span className="text-blue-400 font-mono">LIVE INTELLIGENCE</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <span className="text-slate-500 text-[10px] block mb-0.5">Specialization</span>
                                <span className="font-semibold text-slate-200 truncate block">
                                    {detectedCategory}
                                </span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <span className="text-slate-500 text-[10px] block mb-0.5">Forum / City</span>
                                <span className="font-semibold text-slate-200 truncate block">
                                    {detectedCity || "Bengaluru"}
                                </span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <span className="text-slate-500 text-[10px] block mb-0.5">Urgency Level</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", urgency === "High" ? "bg-rose-400 animate-pulse" : "bg-amber-400")} />
                                    <span className="font-semibold text-slate-200">{urgency}</span>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <span className="text-slate-500 text-[10px] block mb-0.5">Complexity</span>
                                <span className="font-semibold text-slate-200">{complexity}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Advocate Cards Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[11px] font-semibold text-[#8D9CB0] uppercase tracking-wider">
                        Recommended Advocates
                    </span>
                    <span className="text-[10px] text-slate-500">
                        Ranked by win rate & city
                    </span>
                </div>

                {advocates.length === 0 ? (
                    <div className="py-16 text-center px-6 border border-dashed border-white/10 rounded-2xl">
                        <Scale className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                            Submit your legal matter in the intake console to match verified High Court advocates.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {advocates.map((advocate) => (
                            <AdvocateCard key={advocate.id} advocate={advocate} />
                        ))}
                    </div>
                )}
            </div>

            {/* Institutional Security Footer */}
            <div className="p-3.5 px-5 bg-[#050810] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#6B7B94]">
                <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>Attorney-Client Privilege Protected</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-blue-400/70" />
            </div>
        </aside>
    );
}
