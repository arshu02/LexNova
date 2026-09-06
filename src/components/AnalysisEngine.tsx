"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLegalStore } from "@/store/legalStore";
import { CaseAnalysisCard } from "@/components/CaseAnalysisCard";
import { CaseQuestionBubble } from "@/components/CaseQuestionBubble";
import {
    generateLegalRoadmap,
    detectCaseCategory,
    detectCity,
} from "@/lib/mockData";
import { detectIntakeCategory, IntakeCaseCategory } from "@/lib/intake-prompts";
import {
    Shield,
    Cpu,
    Zap,
    Lock,
    ArrowRight,
    Scale,
    Briefcase,
    Sparkles,
    FileText,
    Brain,
    MessageSquareText,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Typing Phase Labels ───────────────────────────────────────────────────────

const TYPING_LABELS: Record<string, { title: string; subtitle: string }> = {
    understanding: {
        title: "Understanding Your Case...",
        subtitle: "Analysing the situation and preparing targeted clarifying questions.",
    },
    analyzing: {
        title: "Generating Legal Analysis...",
        subtitle: "Mapping statutes, computing limitation deadlines, drafting demand notice, and matching advocates.",
    },
    followup: {
        title: "Processing Your Response...",
        subtitle: "Updating case context with your answers before generating full analysis.",
    },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function AnalysisEngine() {
    const {
        sessions,
        activeSessionId,
        isTyping,
        addMessage,
        setTyping,
        createNewSession,
        updateSessionContext,
        advanceIntakePhase,
        incrementIntakeTurns,
        setCaseContext,
        setIntakeCategory,
    } = useLegalStore();

    const [input, setInput] = useState("");
    const [typingLabel, setTypingLabel] = useState<"understanding" | "analyzing" | "followup">("understanding");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasHandledQueryRef = useRef(false);

    const activeSession = sessions.find((s) => s.id === activeSessionId);
    const messages = activeSession?.messages || [];
    const intakePhase = activeSession?.intakePhase || "understanding";
    const intakeTurns = activeSession?.intakeTurns || 0;
    const intakeCategory = activeSession?.intakeCategory || "GENERAL";
    const isFirstSession = messages.length === 0;

    // ─── Derive placeholder text from current phase ────────────────────────────

    const inputPlaceholder = isFirstSession
        ? "Describe your legal matter, dispute, or issue in plain words..."
        : intakePhase === "understanding"
        ? "Type your answer to the question above..."
        : intakePhase === "analyzing"
        ? "Your case is being analysed..."
        : "Ask a follow-up question or describe another matter...";

    // ─── Build conversation history for API ───────────────────────────────────

    const buildConversationHistory = useCallback(
        (sessionMessages: typeof messages) => {
            return sessionMessages
                .filter((m) => m.role === "user" || m.role === "ai" || m.role === "ai-question")
                .map((m) => ({
                    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
                    content: m.role === "ai" && m.roadmap
                        ? `[Case Analysis Generated for: ${m.roadmap.category}]`
                        : m.content,
                }));
        },
        []
    );

    // ─── Phase 2: Generate Full Analysis ──────────────────────────────────────

    const runAnalysis = useCallback(
        async (sessionMessages: typeof messages, category: IntakeCaseCategory) => {
            setTypingLabel("analyzing");
            setTyping(true);
            advanceIntakePhase("analyzing");

            try {
                const conversationHistory = buildConversationHistory(sessionMessages);

                const res = await fetch("/api/ai/case-intake", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        phase: "analyze",
                        category,
                    }),
                });

                if (!res.ok) throw new Error("Analysis API error");

                const data = await res.json();
                let analysis: any = null;

                try {
                    analysis = JSON.parse(data.content);
                } catch {
                    // If JSON parse fails, use fallback roadmap generation
                    console.warn("[AnalysisEngine] Could not parse analysis JSON, using fallback");
                }

                // Map AI analysis JSON → LegalRoadmap structure
                const city = analysis?.city || detectCity(sessionMessages[0]?.content || "") || null;
                const legacyCategory = detectCaseCategory(sessionMessages[0]?.content || "");

                // Update session context + case context
                const urgency = analysis?.urgency === "HIGH" ? "High" : analysis?.urgency === "LOW" ? "Low" : "Medium";
                const complexity = analysis?.complexity === "HIGH" ? "Complex" : analysis?.complexity === "LOW" ? "Standard" : "Standard";
                updateSessionContext(legacyCategory, city, urgency as any, complexity as any);

                if (analysis) {
                    setCaseContext({
                        category: analysis.category,
                        subCategory: analysis.subCategory,
                        urgency: analysis.urgency,
                        complexity: analysis.complexity,
                        city: analysis.city,
                        estimatedClaimValue: analysis.estimatedClaimValue,
                        caseFlags: analysis.caseFlags,
                        lawyerType: analysis.lawyerType,
                    });
                }

                // Build LegalRoadmap from AI analysis or fallback
                const roadmap = analysis
                    ? {
                          category: legacyCategory,
                          city,
                          summary: analysis.summary,
                          legalPathways: analysis.legalPathways || [],
                          requiredDocuments: analysis.requiredDocuments || [],
                          nextActions: analysis.nextActions || [],
                          riskLevel: (analysis.urgency === "HIGH" ? "High" : analysis.urgency === "LOW" ? "Low" : "Medium") as "High" | "Medium" | "Low",
                          statutesCited: analysis.statutesCited || [],
                          limitationPeriod: analysis.limitationPeriod,
                          draftNotice: analysis.draftNotice,
                          claimQuantification: analysis.claimQuantification
                              ? {
                                    principal: analysis.claimQuantification.principal || 0,
                                    interest: analysis.claimQuantification.interest || 0,
                                    courtFee: analysis.claimQuantification.courtFee || 0,
                                    total: analysis.claimQuantification.total || 0,
                                }
                              : undefined,
                      }
                    : generateLegalRoadmap(legacyCategory, city, sessionMessages[0]?.content || "");

                setTyping(false);
                advanceIntakePhase("complete");

                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "",
                    timestamp: new Date(),
                    roadmap,
                });

                // Trigger case-aware lawyer match
                if (analysis) {
                    fetch("/api/lawyers/match", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            category: analysis.category,
                            subCategory: analysis.subCategory,
                            urgency: analysis.urgency,
                            complexity: analysis.complexity,
                            estimatedValue: analysis.estimatedClaimValue,
                            city: analysis.city,
                            caseFlags: analysis.caseFlags,
                        }),
                    }).catch(() => {});
                }
            } catch (err) {
                console.error("[AnalysisEngine] Analysis error:", err);
                // Fallback: use legacy roadmap generation from first message
                const firstMsgContent = sessionMessages.find((m) => m.role === "user")?.content || "";
                const legacyCategory = detectCaseCategory(firstMsgContent);
                const city = detectCity(firstMsgContent);
                updateSessionContext(legacyCategory, city, "Medium", "Standard");
                const roadmap = generateLegalRoadmap(legacyCategory, city, firstMsgContent);
                setTyping(false);
                advanceIntakePhase("complete");
                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "",
                    timestamp: new Date(),
                    roadmap,
                });
            }
        },
        [
            addMessage,
            advanceIntakePhase,
            buildConversationHistory,
            setCaseContext,
            setTyping,
            updateSessionContext,
        ]
    );

    // ─── Phase 1: Ask Clarifying Questions ────────────────────────────────────

    const runUnderstanding = useCallback(
        async (
            text: string,
            sessionMessages: typeof messages,
            category: IntakeCaseCategory,
            questionRound: number
        ) => {
            setTypingLabel("understanding");
            setTyping(true);

            try {
                const conversationHistory = buildConversationHistory([
                    ...sessionMessages,
                    // The user's new message is already added before this call
                ]);

                const res = await fetch("/api/ai/case-intake", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        phase: "understand",
                        category,
                    }),
                });

                if (!res.ok) throw new Error("Understanding API error");

                const data = await res.json();
                const contextComplete = data.contextComplete || false;

                setTyping(false);
                incrementIntakeTurns();

                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: "ai-question",
                    content: data.content,
                    timestamp: new Date(),
                    questionRound,
                    contextComplete,
                });

                // If context is complete OR we've had 2+ turns, auto-advance to analysis
                if (contextComplete || questionRound >= 1) {
                    await new Promise((r) => setTimeout(r, 800));
                    // Collect updated messages including the question just added
                    const updatedMessages = useLegalStore.getState().sessions.find(
                        (s) => s.id === useLegalStore.getState().activeSessionId
                    )?.messages || [];
                    await runAnalysis(updatedMessages, category);
                }
            } catch (err) {
                console.error("[AnalysisEngine] Understanding error:", err);
                // Fallback: go straight to analysis
                setTyping(false);
                const updatedMessages = useLegalStore.getState().sessions.find(
                    (s) => s.id === useLegalStore.getState().activeSessionId
                )?.messages || [];
                await runAnalysis(updatedMessages, category);
            }
        },
        [addMessage, buildConversationHistory, incrementIntakeTurns, runAnalysis, setTyping]
    );

    // ─── Main Request Handler ─────────────────────────────────────────────────

    const processRequest = useCallback(
        async (text: string) => {
            if (!text.trim() || isTyping) return;

            // Ensure a session exists
            let sessionId = activeSessionId;
            if (!sessionId) {
                createNewSession();
                await new Promise((r) => setTimeout(r, 50));
                sessionId = useLegalStore.getState().activeSessionId;
            }

            // Add user message
            addMessage({
                id: Date.now().toString(),
                role: "user",
                content: text,
                timestamp: new Date(),
            });

            setInput("");

            // Get latest session state
            const currentSession = useLegalStore.getState().sessions.find(
                (s) => s.id === useLegalStore.getState().activeSessionId
            );
            const currentMessages = currentSession?.messages || [];
            const currentPhase = currentSession?.intakePhase || "understanding";
            const currentTurns = currentSession?.intakeTurns || 0;

            // Determine category from the FIRST user message
            let category = currentSession?.intakeCategory || "GENERAL";

            // If this is the very first message, detect the category
            const isFirstMessage = currentMessages.filter((m) => m.role === "user").length <= 1;
            if (isFirstMessage) {
                category = detectIntakeCategory(text);
                setIntakeCategory(category);
            }

            // Route based on current intake phase
            if (currentPhase === "complete") {
                // Follow-up question after analysis is complete — go straight to analysis
                setTypingLabel("analyzing");
                await runAnalysis(currentMessages, category);
            } else if (currentPhase === "understanding") {
                // Phase 1: ask clarifying questions
                setTypingLabel(currentTurns === 0 ? "understanding" : "followup");
                await runUnderstanding(text, currentMessages, category, currentTurns);
            } else {
                // Analyzing phase — silently wait, shouldn't happen
                console.warn("[AnalysisEngine] processRequest called during analyzing phase");
            }
        },
        [
            activeSessionId,
            addMessage,
            createNewSession,
            isTyping,
            runAnalysis,
            runUnderstanding,
            setIntakeCategory,
        ]
    );

    // ─── Manual "Proceed to Analysis" trigger ─────────────────────────────────

    const handleProceedToAnalysis = useCallback(async () => {
        const currentSession = useLegalStore.getState().sessions.find(
            (s) => s.id === useLegalStore.getState().activeSessionId
        );
        const currentMessages = currentSession?.messages || [];
        const category = currentSession?.intakeCategory || "GENERAL";
        await runAnalysis(currentMessages, category);
    }, [runAnalysis]);

    // ─── Auto-resize textarea ─────────────────────────────────────────────────

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }, [input]);

    // ─── Handle URL query param (init) ────────────────────────────────────────

    useEffect(() => {
        if (typeof window === "undefined" || hasHandledQueryRef.current) return;
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q") || params.get("init");
        if (q && q.trim()) {
            hasHandledQueryRef.current = true;
            processRequest(q.trim());
        }
    }, [processRequest]);

    // ─── Auto-scroll ──────────────────────────────────────────────────────────

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // ─── Event handlers ───────────────────────────────────────────────────────

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isTyping) processRequest(input.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    // ─── Typing label ─────────────────────────────────────────────────────────

    const currentTypingLabel = TYPING_LABELS[typingLabel] || TYPING_LABELS.understanding;

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#06080F] h-full relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0 bg-blue-600/5" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0 bg-indigo-600/5" />
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Status Bar */}
            <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-40 bg-[#06080F]/90 backdrop-blur-xl">
                <div className="flex items-center gap-5 text-[12px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                        <span className="font-bold text-white tracking-wide">LexNova Intelligence Core</span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                            v5.0
                        </span>
                    </div>

                    <div className="h-3.5 w-[1px] bg-white/10 hidden sm:block" />

                    {/* Phase indicator */}
                    <div className="hidden sm:flex items-center gap-2 text-slate-400 font-medium">
                        {intakePhase === "understanding" ? (
                            <>
                                <Brain className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300">Case Understanding Phase</span>
                            </>
                        ) : intakePhase === "analyzing" ? (
                            <>
                                <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                                <span>Generating Analysis...</span>
                            </>
                        ) : (
                            <>
                                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Analysis Complete · Follow-up Mode</span>
                            </>
                        )}
                    </div>

                    <div className="h-3.5 w-[1px] bg-white/10 hidden md:block" />

                    <div className="items-center gap-1.5 text-slate-400 font-medium hidden md:flex">
                        <span className="text-slate-500">Jurisdiction:</span>
                        <span className="text-slate-200 font-semibold">
                            {activeSession?.city || "All India · High Courts"}
                        </span>
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

            {/* Main Stream */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 custom-scrollbar relative z-10">
                <AnimatePresence mode="popLayout">
                    {isFirstSession ? (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6"
                        >
                            {/* Hero */}
                            <div className="text-center max-w-2xl mx-auto mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-wide uppercase mb-4 shadow-sm">
                                    <Brain className="w-3 h-3 text-amber-400" />
                                    <span>Conversational Legal Intelligence · Two-Phase Intake</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                                    Tell Me About Your Case
                                </h1>
                                <p className="text-[14px] text-[#8D9CB0] font-normal leading-relaxed">
                                    Start by describing your situation in plain words. LexNova will first
                                    ask a few targeted questions to deeply understand your specific case,
                                    then generate a complete legal analysis and match you with the right advocate.
                                </p>

                                {/* Phase flow diagram */}
                                <div className="flex items-center justify-center gap-2 mt-6 mb-8">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-semibold">
                                        <MessageSquareText className="w-3 h-3" />
                                        <span>1 · Understand</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[11px] font-semibold">
                                        <Brain className="w-3 h-3" />
                                        <span>2 · Analyse</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold">
                                        <Scale className="w-3 h-3" />
                                        <span>3 · Match Advocate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Start Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                                <button
                                    onClick={() => processRequest("My landlord is withholding my security deposit even though I vacated 35 days ago in Bengaluru")}
                                    className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-amber-500/30 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                                            <Scale className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                                            Tenancy & Rent
                                        </span>
                                    </div>
                                    <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                                        Landlord Withholding Security Deposit
                                    </h4>
                                    <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                        LexNova will ask about the deposit amount, agreement, and timeline before analysing.
                                    </p>
                                </button>

                                <button
                                    onClick={() => processRequest("My company hasn't paid my last two months salary and won't give me a relieving letter in Mumbai")}
                                    className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/30 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                                            Employment & Labour
                                        </span>
                                    </div>
                                    <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                                        Unpaid Salary & Withheld Relieving Letter
                                    </h4>
                                    <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                        LexNova will ask about your last working day, contract, and total dues.
                                    </p>
                                </button>

                                <button
                                    onClick={() => processRequest("My business client issued a cheque for ₹2,50,000 which bounced due to insufficient funds in Delhi")}
                                    className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-purple-500/30 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                                            Criminal / Commercial
                                        </span>
                                    </div>
                                    <h4 className="text-[14px] font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                                        Section 138 Cheque Bounce
                                    </h4>
                                    <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                        LexNova will ask about the date of dishonour and evidence before advising on the 30-day notice.
                                    </p>
                                </button>

                                <button
                                    onClick={() => processRequest("I received an unauthorized UPI debit of ₹45,000 from my account through a phishing link in Bengaluru")}
                                    className="p-4 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.08] hover:border-rose-500/30 hover:bg-[#0E1424] text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30"
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
                                        Unauthorized UPI / Phishing Fraud
                                    </h4>
                                    <p className="text-[11.5px] text-[#8D9CB0] leading-snug">
                                        LexNova will ask if an FIR is filed and check evidence before mapping your cyber crime remedies.
                                    </p>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8 pb-36">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* ── User Message ── */}
                                    {msg.role === "user" && (
                                        <div className="flex justify-end">
                                            <div className="max-w-[85%] p-4 rounded-2xl rounded-tr-sm bg-blue-600/15 border border-blue-500/20 flex items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="text-[10px] uppercase font-bold text-blue-400/70 tracking-wider mb-1.5">
                                                        You
                                                    </div>
                                                    <p className="text-[14px] font-medium text-white leading-relaxed">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-[10px] flex-shrink-0 mt-0.5">
                                                    YOU
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Phase 1: Clarifying Question Bubble ── */}
                                    {msg.role === "ai-question" && (
                                        <CaseQuestionBubble
                                            content={msg.content}
                                            questionRound={msg.questionRound || 0}
                                            isReady={msg.contextComplete}
                                            onProceedToAnalysis={
                                                msg.contextComplete ? handleProceedToAnalysis : undefined
                                            }
                                        />
                                    )}

                                    {/* ── Phase 2: Full Analysis Card ── */}
                                    {msg.role === "ai" && (
                                        <CaseAnalysisCard message={msg} />
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "p-5 rounded-2xl border flex items-center gap-4 shadow-xl",
                                        typingLabel === "understanding"
                                            ? "bg-amber-500/[0.05] border-amber-500/25"
                                            : "bg-blue-600/[0.05] border-blue-500/25"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0",
                                        typingLabel === "understanding"
                                            ? "bg-amber-500/15 border-amber-500/30"
                                            : "bg-blue-600/20 border-blue-500/30"
                                    )}>
                                        <div className={cn(
                                            "w-5 h-5 border-2 border-t-transparent rounded-full animate-spin",
                                            typingLabel === "understanding"
                                                ? "border-amber-400"
                                                : "border-blue-400"
                                        )} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-white tracking-tight">
                                            {currentTypingLabel.title}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {currentTypingLabel.subtitle}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Input Bar */}
            <div className="p-5 border-t border-white/[0.06] sticky bottom-0 z-40 bg-[#06080F]/95 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className={cn(
                            "relative rounded-2xl border shadow-2xl transition-all",
                            intakePhase === "understanding"
                                ? "bg-[#0D0F18] border-white/10 focus-within:border-amber-500/40"
                                : "bg-[#0B0F19] border-white/10 focus-within:border-blue-500/50"
                        )}
                    >
                        {/* Phase tag */}
                        {!isFirstSession && (
                            <div className={cn(
                                "px-4 pt-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider",
                                intakePhase === "understanding" ? "text-amber-400/70" : "text-blue-400/70"
                            )}>
                                {intakePhase === "understanding" ? (
                                    <>
                                        <Brain className="w-2.5 h-2.5" />
                                        <span>Case Understanding</span>
                                    </>
                                ) : intakePhase === "analyzing" ? (
                                    <>
                                        <Cpu className="w-2.5 h-2.5 animate-pulse" />
                                        <span>Generating Analysis</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>Follow-up Mode</span>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="flex items-center px-4 py-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={inputPlaceholder}
                                disabled={intakePhase === "analyzing" && isTyping}
                                className="flex-1 bg-transparent py-3 text-[14px] text-white outline-none resize-none placeholder:text-slate-500 min-h-[48px] max-h-36 custom-scrollbar disabled:opacity-40"
                                rows={1}
                            />

                            <button
                                type="submit"
                                aria-label="Submit response"
                                disabled={!input.trim() || isTyping || (intakePhase === "analyzing")}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl font-bold text-[12.5px] transition-all flex items-center gap-2 cursor-pointer shadow-md",
                                    input.trim() && !isTyping && intakePhase !== "analyzing"
                                        ? intakePhase === "understanding"
                                            ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30"
                                        : "bg-white/[0.04] text-slate-500 cursor-not-allowed border border-white/[0.05]"
                                )}
                            >
                                <span>
                                    {intakePhase === "understanding" ? "Answer" : "Submit"}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Bottom hints */}
                        <div className="px-4 py-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <Scale className="w-3 h-3 text-blue-400" />
                                    <span>All-India High Courts</span>
                                </span>
                                <span className="text-slate-700">·</span>
                                <span className="inline-flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-amber-400" />
                                    <span>Auto-Draft Legal Notice</span>
                                </span>
                                {intakePhase === "understanding" && intakeTurns > 0 && (
                                    <>
                                        <span className="text-slate-700">·</span>
                                        <span className="inline-flex items-center gap-1 text-amber-400/70">
                                            <Brain className="w-3 h-3" />
                                            <span>Round {intakeTurns + 1} of clarification</span>
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10.5px] font-mono">
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
