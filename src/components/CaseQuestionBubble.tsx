"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface CaseQuestionBubbleProps {
  content: string;
  /** 0 = first question round, 1 = second follow-up round */
  questionRound: number;
  isReady?: boolean; // true when AI signals context is complete
  onProceedToAnalysis?: () => void;
}

export function CaseQuestionBubble({
  content,
  questionRound,
  isReady = false,
  onProceedToAnalysis,
}: CaseQuestionBubbleProps) {
  // Strip the [CASE_CONTEXT_COMPLETE] signal token from display content
  const displayContent = content
    .replace("[CASE_CONTEXT_COMPLETE]", "")
    .trim();

  // Parse the content into acknowledgment + questions
  const lines = displayContent.split("\n").filter((l) => l.trim() !== "");

  // Separate: first non-numbered line = acknowledgment, numbered lines = questions,
  // last non-numbered line after questions = closing
  const acknowledgmentLines: string[] = [];
  const questions: string[] = [];
  const closingLines: string[] = [];
  let inQuestions = false;
  let questionsEnded = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const isNumbered = /^\d+\./.test(trimmed);

    if (isNumbered) {
      inQuestions = true;
      questions.push(trimmed.replace(/^\d+\.\s*/, "").replace(/^["']|["']$/g, ""));
    } else if (inQuestions && !isNumbered && trimmed.length > 0) {
      questionsEnded = true;
      closingLines.push(trimmed);
    } else if (!inQuestions && !questionsEnded) {
      acknowledgmentLines.push(trimmed);
    }
  }

  const stepLabel = questionRound === 0
    ? "Step 1: Understanding Your Case"
    : "Step 2: Clarifying Key Details";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent pointer-events-none" />

      <div className="relative rounded-2xl border border-amber-500/25 bg-[#0D0F18] overflow-hidden shadow-xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/15 bg-amber-500/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
                {stepLabel}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                LexNova Intake Intelligence · Case Understanding Phase
              </p>
            </div>
          </div>

          {/* Progress pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className={`h-1.5 w-12 rounded-full ${questionRound >= 0 ? "bg-amber-400" : "bg-white/10"}`} />
            <div className={`h-1.5 w-12 rounded-full ${questionRound >= 1 ? "bg-amber-400" : "bg-white/10"}`} />
            <div className="h-1.5 w-12 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Acknowledgment text */}
          {acknowledgmentLines.length > 0 && (
            <p className="text-[13.5px] text-slate-300 leading-relaxed">
              {acknowledgmentLines.join(" ")}
            </p>
          )}

          {/* Questions block */}
          {questions.length > 0 && (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.3 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-500/25 transition-colors">
                    <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                  </div>
                  <p className="text-[13px] text-slate-200 leading-relaxed flex-1">
                    {q}
                  </p>
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400/50 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Closing line */}
          {closingLines.length > 0 && (
            <p className="text-[11.5px] text-slate-500 italic leading-relaxed">
              {closingLines.join(" ")}
            </p>
          )}

          {/* Context complete — ready to analyze */}
          {isReady && onProceedToAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-[12.5px] font-semibold text-emerald-300">
                  Case context gathered. Ready for full legal analysis.
                </p>
              </div>
              <button
                onClick={onProceedToAnalysis}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11.5px] font-bold hover:bg-emerald-500/25 transition-all cursor-pointer flex-shrink-0"
              >
                Analyse Now
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Typing cursor for the last question (subtle animation) */}
        {!isReady && (
          <div className="px-5 pb-3 flex items-center gap-2 text-[10.5px] text-slate-600">
            <Loader2 className="w-3 h-3 animate-spin text-amber-400/60" />
            <span>Awaiting your response to proceed with legal analysis...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
