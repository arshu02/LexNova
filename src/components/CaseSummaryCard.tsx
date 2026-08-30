"use client";

import React from "react";
import { useLegalStore } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { FileText, MapPin, Zap, CheckSquare, Square } from "lucide-react";
import { generateLegalRoadmap } from "@/lib/mockData";

const urgencyColors = {
    Low: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-red-100 text-red-700 border-red-200",
};

function detectUrgency(messages: { role: string; content: string }[]): "Low" | "Medium" | "High" {
    const allText = messages.map((m) => m.content).join(" ").toLowerCase();
    if (
        allText.includes("urgent") ||
        allText.includes("emergency") ||
        allText.includes("arrest") ||
        allText.includes("evict") ||
        allText.includes("violence") ||
        allText.includes("immediate")
    )
        return "High";
    if (
        allText.includes("dispute") ||
        allText.includes("fraud") ||
        allText.includes("complaint") ||
        allText.includes("notice")
    )
        return "Medium";
    return "Low";
}

export function CaseSummaryCard() {
    const { sessions, activeSessionId, detectedCategory, detectedCity } = useLegalStore();

    const activeSession = sessions.find((s) => s.id === activeSessionId);
    const messages = activeSession?.messages || [];
    const category = detectedCategory !== "General" ? detectedCategory : activeSession?.category;
    const city = detectedCity ?? activeSession?.city ?? null;

    if (!activeSessionId || !category || category === "General") {
        return (
            <div className="bg-[#0D0D18]/50 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 mb-4 text-center">
                <p className="text-[11px] text-slate-400">Discovering your legal context...</p>
            </div>
        );
    }

    const urgency = detectUrgency(messages);
    const roadmap = generateLegalRoadmap(category, city, "");

    return (
        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-sm p-6 mb-8 group transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-100/20 hover:border-emerald-100/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 shadow-inner border border-slate-100">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Snapshot</h3>
                </div>
                <div className={cn(
                    "w-3 h-3 rounded-full ring-4 ring-white shadow-sm",
                    urgency === "High" ? "bg-rose-500 animate-pulse" : urgency === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                )} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Type</span>
                    <span className="text-xs font-black text-slate-900 tracking-tight">{category}</span>
                </div>
                {city && (
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Jurisdiction</span>
                        <span className="text-xs font-black text-slate-900 tracking-tight">{city}</span>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 hidden group-hover:block transition-all animate-slide-in">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Critical Artifacts</p>
                <div className="space-y-2.5">
                    {(roadmap as any).documentsNeeded?.slice(0, 3).map((doc: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 bg-[#0D0D18] p-3 rounded-2xl border border-slate-100 shadow-sm">
                            <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{doc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
