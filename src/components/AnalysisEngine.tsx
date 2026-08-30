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
    ArrowRight
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
    } = useLegalStore();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeSession = sessions.find((s) => s.id === activeSessionId);
    const messages = activeSession?.messages || [];
    const isFirstSession = messages.length === 0;

    // Auto-resize textarea as user types
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }, [input]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

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

            // Simulation of intelligence
            await new Promise((r) => setTimeout(r, 2000));
            
            const category = detectCaseCategory(text);
            const city = detectCity(text);
            const roadmap = generateLegalRoadmap(category, city, text);

            setTyping(false);
            addMessage({
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "", // Content is now structured via roadmap
                timestamp: new Date(),
                roadmap,
            });
        },
        [activeSessionId, addMessage, createNewSession, setTyping]
    );

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
        <div className="flex-1 flex flex-col min-w-0 bg-[#080810] h-full relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)" }} />
            
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: '60px 60px' }} />

            {/* Intel Status Bar */}
            <div className="h-16 border-b flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-50 backdrop-blur-xl" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(8,8,16,0.8)" }}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#F59E0B]" style={{ background: "#F59E0B" }} />
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Engine v4.2</p>
                    </div>
                    <div className="h-4 w-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3" style={{ color: "#A78BFA" }} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Junction: <span className="text-white">{activeSession?.city || "Universal"}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ background: "rgba(6,182,212,0.1)", borderColor: "rgba(6,182,212,0.2)" }}>
                        <Lock className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest leading-none pt-0.5">Quantum Guard Active</span>
                    </div>
                </div>
            </div>

            {/* Analysis Stream */}
            <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar perspective-1000 relative z-10">
                <AnimatePresence mode="popLayout">
                {isFirstSession ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-3xl mx-auto h-full flex flex-col items-center justify-center text-center py-20"
                    >
                        <div className="relative mb-12 group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border shadow-2xl relative z-10" style={{ background: "rgba(13,13,24,0.6)", borderColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                                <Image src="/legal-hero.jpg" alt="Neural Court" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 mix-blend-overlay" style={{ background: "rgba(124,58,237,0.2)" }} />
                            </div>
                            <div className="absolute -inset-6 blur-3xl -z-10 animate-pulse" style={{ background: "rgba(124,58,237,0.2)" }} />
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border rotate-12 z-20" style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)", borderColor: "rgba(255,255,255,0.1)" }}>
                               <Cpu className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-6">
                            NEURAL INGESTION <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #8B5CF6)" }}>READY</span>
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] max-w-sm leading-loose">
                            Initialize a new synthesis by submitting your case intelligence below.
                        </p>
                    </motion.div>
                ) : (
                    <div className="max-w-5xl mx-auto space-y-16 pb-32">
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="group"
                            >
                                {msg.role === "user" ? (
                                    <div className="flex flex-col gap-6 border-l pl-10 mb-20 relative" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #F59E0B, transparent)" }} />
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>User Request</div>
                                            <div className="h-[1px] flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                                        </div>
                                        <p className="text-2xl font-bold text-white leading-tight tracking-tight max-w-3xl">
                                            {msg.content}
                                        </p>
                                    </div>
                                ) : (
                                    <CaseAnalysisCard message={msg} />
                                )}
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="flex flex-col gap-6 border-l pl-10 animate-pulse" style={{ borderColor: "rgba(124,58,237,0.3)" }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)" }}>
                                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#A78BFA", borderTopColor: "transparent" }} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#A78BFA" }}>Synthesizing Neural Logic...</p>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-referencing 250k+ Jurisdictions</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
                </AnimatePresence>
            </div>

            {/* Structured Input Area */}
            <div className="p-8 border-t sticky bottom-0 z-50" style={{ background: "linear-gradient(to top, #080810 80%, transparent)", borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="relative group"
                    >
                        {/* Background glow for input */}
                        <div className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" style={{ background: "linear-gradient(to right, rgba(124,58,237,0.5), rgba(245,158,11,0.5))" }} />
                        
                        <div className="relative flex items-center border p-2 rounded-2xl transition-all shadow-2xl" style={{ background: "rgba(13,13,24,0.9)", borderColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Submit case intelligence here..."
                                className="flex-1 bg-transparent px-6 py-5 text-sm font-bold text-white outline-none resize-none placeholder-slate-500 min-h-[56px] max-h-40 custom-scrollbar"
                                rows={1}
                            />
                            <button
                                type="submit"
                                aria-label="Submit case"
                                disabled={!input.trim() || isTyping}
                                className={cn(
                                    "p-4 rounded-xl transition-all duration-300",
                                    input.trim() && !isTyping
                                        ? "btn-gold shadow-none hover:scale-105 active:scale-95"
                                        : "opacity-50 cursor-not-allowed"
                                )}
                                style={!input.trim() || isTyping ? { background: "rgba(255,255,255,0.05)", color: "#64748b" } : {}}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-4 flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3" style={{ color: "rgba(245,158,11,0.5)" }} />
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Link Latency: 12ms</p>
                            </div>
                            <div className="w-[1px] h-3" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3" style={{ color: "rgba(124,58,237,0.5)" }} />
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">End-to-End Encrypted</p>
                            </div>
                        </div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                            LEXNOVA Neural Core • Institutional Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
