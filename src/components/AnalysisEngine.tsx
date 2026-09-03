"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLegalStore } from "@/store/legalStore";
import { CaseAnalysisCard } from "@/components/CaseAnalysisCard";
import {
    generateLegalRoadmap,
    detectCaseCategory,
    detectCity,
} from "@/lib/mockData";
import {
    Shield,
    Cpu,
    Zap,
    Lock,
    Terminal,
    ArrowRight,
    Scale,
    Briefcase,
    Sparkles,
    FileText
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnalysisEngine() {
    const {
        sessions,
        activeSessionId,
        isTyping,
        addMessage,
        setTyping,
        createNewSession,
        updateSessionContext,
    } = useLegalStore();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasHandledQueryRef = useRef(false);

    const activeSession = sessions.find((s) => s.id === activeSessionId);
    const messages = activeSession?.messages || [];
    const isFirstSession = messages.length === 0;

    const processRequest = useCallback(
        async (text: string) => {
            if (!text.trim()) return;

            let sessionId = activeSessionId;
            if (!sessionId) {
                createNewSession();
                await new Promise((r) => setTimeout(r, 50));
                sessionId = useLegalStore.getState().activeSessionId;
            }

            addMessage({
                id: Date.now().toString(),
                role: "user",
                content: text,
                timestamp: new Date(),
            });

            setInput("");
            setTyping(true);

            // Autonomous Statutory Mapping
            await new Promise((r) => setTimeout(r, 1200));
            
            const category = detectCaseCategory(text);
            const city = detectCity(text);
            const urgency = (category === "Police Complaint" || category === "Cyber Crime") ? "High" : "Medium";
            const complexity = (category === "Business Legal Help" || category === "Cyber Crime") ? "Complex" : "Standard";

            // Dynamically update the case context & advocate recommendation panel
            updateSessionContext(category, city, urgency, complexity);

            const roadmap = generateLegalRoadmap(category, city, text);

            setTyping(false);
            addMessage({
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "",
                timestamp: new Date(),
                roadmap,
            });
        },
        [activeSessionId, addMessage, createNewSession, setTyping, updateSessionContext]
    );

    // Auto-resize textarea as user types
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }, [input]);

    // Read URL search params on mount
    useEffect(() => {
        if (typeof window === "undefined" || hasHandledQueryRef.current) return;
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q") || params.get("init");
        if (q && q.trim()) {
            hasHandledQueryRef.current = true;
            processRequest(q.trim());
        }
    }, [processRequest]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) processRequest(input.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#06080F] h-full relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0 bg-blue-600/5" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0 bg-indigo-600/5" />
            
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Institutional Status Bar */}
            <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-40 bg-[#06080F]/90 backdrop-blur-xl">
                <div className="flex items-center gap-5 text-[12px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                        <span className="font-bold text-white tracking-wide">LexNova Intelligence Core</span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded">
                            v4.2
                        </span>
                    </div>

                    <div className="h-3.5 w-[1px] bg-white/10 hidden sm:block" />

                    <div className="items-center gap-2 text-slate-400 font-medium hidden sm:flex">
                        <Scale className="w-3.5 h-3.5 text-blue-400" />
                        <span>Live RAG: Supreme Court & High Courts</span>
                    </div>

                    <div className="h-3.5 w-[1px] bg-white/10 hidden md:block" />

                    <div className="items-center gap-1.5 text-slate-400 font-medium hidden md:flex">
                        <span className="text-slate-500">Jurisdiction:</span>
                        <span className="text-slate-200 font-semibold">{activeSession?.city || "All India · High Courts"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10.5px] font-medium text-slate-400">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>DPDPA 2023 · AES-256</span>
                    </div>

                    {messages.length > 0 && (
                        <button
                            onClick={() => createNewSession()}
                            className="text-[11.5px] font-semibold px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                            + New Docket
                        </button>
                    )}
                </div>
            </div>

            {/* Main Stream Area */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 custom-scrollbar relative z-10">
                <AnimatePresence mode="popLayout">
                {isFirstSession ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6"
                    >
                        {/* Hero Header */}
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold tracking-wide uppercase mb-4 shadow-sm">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <span>Autonomous Legal Intelligence Operating System</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                                Case Assessment & Counsel Dispatch
                            </h1>
                            <p className="text-[14px] text-[#8D9CB0] font-normal leading-relaxed">
                                Describe any legal dispute, breach of contract, or claim. LexNova maps statutes, computes limitation deadlines, drafts admissible demand notices, and connects verified High Court advocates.
                            </p>
                        </div>

                        {/* 4 Instant Dispute Starter Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                            <button
                                onClick={() => processRequest("My landlord is withholding my ₹75,000 security deposit after 30 days notice in Bengaluru")}
                                className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                                        Tenancy & Rent
                                    </span>
                                </div>
                                <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                                    Landlord Withholding ₹75,000 Security Deposit
                                </h4>
                                <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                    Statutory demand notice under Transfer of Property Act §108 & 18% p.a. interest calculation.
                                </p>
                            </button>

                            <button
                                onClick={() => processRequest("Company refused to disburse my ₹1,40,000 unpaid salary and withholding relieving letter in Mumbai")}
                                className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                                        Employment & Labour
                                    </span>
                                </div>
                                <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors">
                                    Unpaid Earned Salary & Relieving Breach
                                </h4>
                                <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                    Section 15 Payment of Wages Act recovery notice & pre-institution mediation pathway.
                                </p>
                            </button>

                            <button
                                onClick={() => processRequest("Business client dishonored ₹2,50,000 commercial cheque due to insufficient funds in Delhi")}
                                className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                                        Commercial Law
                                    </span>
                                </div>
                                <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                                    Section 138 Cheque Bounce Recovery
                                </h4>
                                <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                    Strict 30-day statutory notice countdown & summary suit filing under Order 37 CPC.
                                </p>
                            </button>

                            <button
                                onClick={() => processRequest("Unauthorized fraudulent UPI debit of ₹45,000 via phishing link in Bengaluru")}
                                className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-400 transition-colors">
                                        Cyber Crime & Banking
                                    </span>
                                </div>
                                <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-rose-200 transition-colors">
                                    Unauthorized Banking / UPI Phishing Fraud
                                </h4>
                                <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                    RBI Zero Customer Liability framework & 72-hour statutory bank dispute protocol.
                                </p>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-12 pb-32">
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {msg.role === "user" ? (
                                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                                            YOU
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                                                Submitted Case Grievance
                                            </div>
                                            <p className="text-[15px] font-semibold text-white leading-relaxed">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <CaseAnalysisCard message={msg} />
                                )}
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-blue-500/30 animate-pulse flex items-center gap-4 shadow-xl">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-white tracking-tight">
                                        Synthesizing Statutory Dossier & Precedents...
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Querying Limitation Act 1963, High Court case law, and matching active Bar Council advocates.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
                </AnimatePresence>
            </div>

            {/* Executive Floating Input Bar */}
            <div className="p-5 border-t border-white/[0.06] sticky bottom-0 z-40 bg-[#06080F]/95 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="relative rounded-2xl bg-[#0B0F19] border border-white/10 focus-within:border-blue-500/50 shadow-2xl transition-all"
                    >
                        {/* Textarea */}
                        <div className="flex items-center px-4 py-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe your legal matter, contract issue, or dispute in plain words..."
                                className="flex-1 bg-transparent py-3 text-[14px] text-white outline-none resize-none placeholder:text-slate-500 min-h-[48px] max-h-36 custom-scrollbar"
                                rows={1}
                            />

                            <button
                                type="submit"
                                aria-label="Submit case"
                                disabled={!input.trim() || isTyping}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl font-bold text-[12.5px] transition-all flex items-center gap-2 cursor-pointer shadow-md",
                                    input.trim() && !isTyping
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50"
                                        : "bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/[0.05]"
                                )}
                            >
                                <span>Execute Assessment</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Helper tags & hotkey hints */}
                        <div className="px-4 py-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                                    <Scale className="w-3 h-3 text-blue-400" />
                                    <span>All-India High Courts</span>
                                </span>
                                <span className="text-slate-700">·</span>
                                <span className="inline-flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                                    <FileText className="w-3 h-3 text-amber-400" />
                                    <span>Auto-Draft Legal Notice</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-500">
                                <span>Press</span>
                                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-slate-300 text-[10px]">
                                    Enter ↵
                                </kbd>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
