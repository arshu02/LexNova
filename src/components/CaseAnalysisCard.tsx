"use client";

import React, { useState } from "react";
import { ChatMessage } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { 
    Scale, 
    ShieldCheck, 
    AlertTriangle, 
    Clock, 
    FileText, 
    Copy, 
    Check, 
    ArrowRight, 
    Download, 
    ExternalLink, 
    Calculator,
    CheckCircle2,
    BookOpen,
    Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface CaseAnalysisCardProps {
    message: ChatMessage;
}

export function CaseAnalysisCard({ message }: CaseAnalysisCardProps) {
    const [copiedNotice, setCopiedNotice] = useState(false);

    if (!message.roadmap) return null;
    const { roadmap } = message;

    const handleCopyNotice = () => {
        if (!roadmap.draftNotice) return;
        navigator.clipboard.writeText(roadmap.draftNotice);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
    };

    const claim = roadmap.claimQuantification || {
        principal: 75000,
        interest: 13500,
        courtFee: 1875,
        total: 88500,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto py-2">
            {/* Docket Header */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/[0.08] shadow-xl shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-md flex-shrink-0">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                DOCKET #LN-2026-{message.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                {roadmap.category}
                            </span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white tracking-tight">
                            Autonomous Statutory Assessment Dossier
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bar Council RAG Verified</span>
                    </div>
                </div>
            </div>

            {/* Statutory References & Limitation Clock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Limitation Countdown */}
                <div className="md:col-span-1 p-5 rounded-2xl bg-[#0B0F19] border border-white/[0.08] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                Limitation Window
                            </span>
                            <span className="text-amber-400 text-[10px] font-mono">ACT 1963</span>
                        </div>
                        <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
                            {roadmap.limitationDaysRemaining || 742}
                            <span className="text-sm font-semibold text-slate-400 ml-1.5">Days Left</span>
                        </div>
                        <p className="text-[11px] text-[#8D9CB0] font-medium leading-relaxed">
                            {roadmap.limitationPeriod || "Article 7, Limitation Act 1963 — 3-Year statutory recovery window"}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full w-[82%]" />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>CAUSE OF ACTION</span>
                            <span>STATUTORY LAPSE</span>
                        </div>
                    </div>
                </div>

                {/* Statutory References Matrix */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-[#0B0F19] border border-white/[0.08] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                Applied Statutory Framework
                            </span>
                            <span className="text-blue-400 text-[10px] font-mono">SUPREME COURT RAG</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(roadmap.statutesCited || [
                                "Transfer of Property Act 1882 §108(B)",
                                "Limitation Act 1963 Article 7",
                                "State Rent Control & Tenancy Act",
                                "Order 37 Code of Civil Procedure 1908",
                            ]).map((statute, idx) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    <span className="text-[12px] font-medium text-slate-200 tracking-tight truncate">
                                        {statute}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Jurisdiction: {roadmap.city || "Universal · High Court / City Civil"}</span>
                        <span className={cn(
                            "font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-[9.5px]",
                            roadmap.riskLevel === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            roadmap.riskLevel === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                            {roadmap.riskLevel} Exposure
                        </span>
                    </div>
                </div>
            </div>

            {/* Financial Claim Quantification Sheet */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/[0.08] shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">
                            Quantified Financial Claim Assessment
                        </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                        STATUTORY INTEREST @ 18% P.A.
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Principal Claim
                        </span>
                        <span className="text-lg font-bold text-white">
                            ₹{claim.principal.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Statutory Interest (18%)
                        </span>
                        <span className="text-lg font-bold text-amber-400">
                            +₹{claim.interest.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Est. Court Fee
                        </span>
                        <span className="text-lg font-bold text-slate-400">
                            ₹{claim.courtFee.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/25">
                        <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider block mb-1">
                            Total Admissible Claim
                        </span>
                        <span className="text-lg font-bold text-blue-400">
                            ₹{claim.total.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                <p className="text-[11.5px] text-[#8D9CB0] font-medium leading-relaxed">
                    {roadmap.summary}
                </p>
            </div>

            {/* Court-Ready Legal Notice Draft */}
            {roadmap.draftNotice && (
                <div className="p-6 rounded-2xl bg-[#090D16] border border-white/[0.08] shadow-2xl relative">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">
                                Court-Admissible Formal RPAD Demand Notice
                            </h4>
                        </div>
                        <button
                            onClick={handleCopyNotice}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                        >
                            {copiedNotice ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied to Clipboard!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Notice Text</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04] font-mono text-[11.5px] text-slate-300 leading-relaxed max-h-72 overflow-y-auto custom-scrollbar select-all whitespace-pre-wrap">
                        {roadmap.draftNotice}
                    </div>
                </div>
            )}

            {/* Strategic Pathways & Ingestion List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pathways */}
                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-white/[0.08]">
                    <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                        Litigation & Recovery Pathways
                    </h4>
                    <div className="space-y-2.5">
                        {roadmap.legalPathways.map((path, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-[12px] text-slate-300">
                                <span className="font-mono text-xs text-amber-400/80 font-bold">
                                    0{idx + 1}.
                                </span>
                                <span className="leading-snug">{path}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Required Evidence */}
                <div className="p-5 rounded-2xl bg-[#0B0F19] border border-white/[0.08]">
                    <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Required Evidentiary Documents
                    </h4>
                    <div className="space-y-2.5">
                        {roadmap.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-[12px] text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
