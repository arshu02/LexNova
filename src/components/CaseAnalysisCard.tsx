"use client";

import React from "react";
import { ChatMessage } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { 
    AlertTriangle, 
    FileText, 
    Scale, 
    ArrowRight, 
    CheckSquare, 
    ShieldAlert, 
    Info,
    Cpu,
    Zap,
    Lock,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

interface CaseAnalysisCardProps {
    message: ChatMessage;
}

export function CaseAnalysisCard({ message }: CaseAnalysisCardProps) {
    if (!message.roadmap) return null;
    const { roadmap } = message;

    return (
        <div className="space-y-12 animate-in">
            {/* Header / Synthesis Intelligence */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-10 mb-16 gap-6" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                        <Cpu className="w-7 h-7" style={{ color: "#A78BFA" }} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                            Neural Synthesis <span style={{ color: "#F59E0B" }}>v4.2</span>
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                            Jurisdictional Logic Model: {roadmap.category}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#F59E0B" }} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5" style={{ color: "#F59E0B" }}>
                            Verified Protocol
                        </span>
                    </div>
                    <span className="text-[11px] font-bold text-white/50 uppercase tracking-tighter">
                        Timestamp: {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Structured Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* 1. Case Identity & Risk */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <SectionLabel icon={Info} label="Synthesis Metadata" />
                        <div className="p-8 rounded-[2rem] border relative overflow-hidden group" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                            <div className="absolute top-0 right-0 p-4 border-l border-b bg-[#0D0D18]/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest rounded-bl-xl" style={{ borderColor: "rgba(255,255,255,0.05)" }}>ID: {message.id.slice(-6)}</div>
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</p>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest px-3 py-1 rounded-md" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>{roadmap.category}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Jurisdiction</p>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest px-3 py-1 bg-[#0D0D18]/5 border border-white/10 rounded-md">{roadmap.city || "Universal"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SectionLabel icon={ShieldAlert} label="Intelligence Risk Score" />
                        <div className={cn(
                            "p-8 rounded-[2rem] border relative overflow-hidden transition-all duration-700",
                            roadmap.riskLevel === "High" ? "bg-rose-500/5 border-rose-500/20" :
                            roadmap.riskLevel === "Medium" ? "bg-amber-500/5 border-amber-500/20" :
                            "bg-cyan-500/5 border-cyan-500/20"
                        )}>
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Exposure Level</p>
                                    <h4 className={cn(
                                        "text-4xl font-black uppercase tracking-tighter drop-shadow-sm",
                                        roadmap.riskLevel === "High" ? "text-rose-500" :
                                        roadmap.riskLevel === "Medium" ? "text-amber-400" :
                                        "text-cyan-400"
                                    )}>
                                        {roadmap.riskLevel} Case
                                    </h4>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                                    roadmap.riskLevel === "High" ? "bg-rose-500 text-white" :
                                    roadmap.riskLevel === "Medium" ? "bg-amber-500 text-white" :
                                    "bg-cyan-500 text-white shadow-cyan-500/20"
                                )}>
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                            </div>
                            {/* Ambient glow decoration */}
                            <div className={cn(
                                "absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20",
                                roadmap.riskLevel === "High" ? "bg-rose-500" :
                                roadmap.riskLevel === "Medium" ? "bg-amber-500" :
                                "bg-cyan-500"
                            )} />
                        </div>
                    </div>
                </div>

                {/* 2. Situation Summary */}
                <div className="space-y-6">
                    <SectionLabel icon={FileText} label="Situation Intelligence" />
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border relative h-full" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <div className="absolute top-6 right-8">
                            <Zap className="w-6 h-6" style={{ color: "rgba(139,92,246,0.3)" }} />
                        </div>
                        <p className="text-xl font-medium text-slate-300 leading-relaxed tracking-tight selection:bg-purple-500/30">
                            {roadmap.summary}
                        </p>
                    </div>
                </div>

                {/* 3. Legal Pathways */}
                <div className="space-y-8">
                    <SectionLabel icon={ArrowRight} label="Resolution Pathways" />
                    <div className="grid gap-4">
                        {roadmap.legalPathways.map((path, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                className="flex gap-6 items-start group p-6 rounded-2xl hover:bg-[#0D0D18]/5 border border-transparent transition-all"
                                style={{ border: "1px solid rgba(255,255,255,0.02)" }}
                            >
                                <span className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: "rgba(245,158,11,0.5)" }}>0{idx + 1}</span>
                                <p className="text-base font-bold text-white leading-tight">
                                    {path}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. Required Ingestion */}
                <div className="space-y-8">
                    <SectionLabel icon={CheckSquare} label="Document Ingestion List" />
                    <div className="grid grid-cols-1 gap-3">
                        {roadmap.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-6 p-5 rounded-2xl bg-[#080810] border transition-all group overflow-hidden relative" style={{ borderColor: "rgba(255,255,255,0.05)" }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
                            >
                                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-[#0D0D18]/5 transition-colors" style={{ background: "rgba(139,92,246,0.5)" }} />
                                <div className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform" style={{ background: "#A78BFA", boxShadow: "0 0 8px #A78BFA" }} />
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] pt-0.5">
                                    {doc}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Strategic Next Steps (Full Width) */}
                <div className="lg:col-span-2 space-y-8">
                    <SectionLabel icon={Zap} label="Strategic Directives" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {roadmap.nextActions.map((action, idx) => (
                            <div key={idx} className={cn(
                                "p-8 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
                                idx === 0 
                                    ? "bg-transparent border-transparent text-white shadow-2xl" 
                                    : "bg-[#0D0D18]/5 border-white/5 hover:border-white/20"
                            )}
                            style={idx === 0 ? { background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" } : {}}
                            >
                                {idx === 0 && (
                                    <div className="absolute -right-4 -top-4 opacity-10">
                                        <Zap className="w-24 h-24 text-white" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-8">
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", idx === 0 ? "text-white/50" : "text-slate-500")}>Priority 0{idx + 1}</span>
                                    {idx === 0 && <span className="text-[9px] font-black uppercase px-3 py-1 bg-[#0D0D18]/20 backdrop-blur-md text-white rounded-full">Critical Operation</span>}
                                </div>
                                <h5 className={cn("text-lg font-black leading-tight tracking-tight mb-4", idx === 0 ? "text-white" : "text-slate-200")}>
                                    {action}
                                </h5>
                                <div className="pt-4 flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", idx === 0 ? "text-white/70" : "text-amber-500")}>Initialize Action</span>
                                    <ArrowRight className={cn("w-3 h-3", idx === 0 ? "text-white" : "text-amber-500")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Institutional SEAL */}
            <div className="mt-16 pt-16 border-t flex flex-col md:flex-row items-center justify-between gap-10" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-8 opacity-30 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Integrated Intelligence SEAL</p>
                    </div>
                    <div className="hidden md:block w-[1px] h-4 bg-[#0D0D18]/20" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        SOC2 TYPE II Certified Synthesis
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1">Session Synthesis ID</p>
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">LVN-{message.id.slice(-8)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl border border-white/5 bg-[#0D0D18]/5 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionLabel({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all" style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.2)" }}>
                <Icon className="w-4 h-4" style={{ color: "#A78BFA" }} />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{label}</p>
        </div>
    );
}
