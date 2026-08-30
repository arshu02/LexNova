"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send, Plus, Scale, MapPin, Star, Briefcase, FileText,
  CheckCircle2, Users, Lock, Shield, Menu, X, Copy, Check,
  ExternalLink, ChevronRight, Zap, Award, Clock, Phone,
  TrendingUp, AlertTriangle, Info, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  lawyers?: any[];
  advice?: string;
  caseData?: any;
  step?: number;
  status?: string;
  timestamp?: Date;
}

interface SelectedLawyer {
  id: string | number;
  name: string;
  type: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const STEP_LABELS = ["Timeline & Facts", "Location & Parties", "Evidence & Docs", "Urgency & Outcome"];

const SUGGESTED_ISSUES = [
  { icon: "💼", text: "My employer hasn't paid salary for 2 months" },
  { icon: "🏠", text: "Landlord refusing to return my security deposit" },
  { icon: "💻", text: "I was scammed online — lost ₹50,000" },
  { icon: "⚖️", text: "My spouse wants a divorce — what are my rights?" },
  { icon: "📦", text: "Received defective product, seller not responding" },
  { icon: "🌿", text: "Someone is illegally encroaching on my land" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(date?: Date) {
  if (!date) return "";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function MarkdownContent({ content }: { content: string }) {
  const formatted = content
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-3 text-slate-300 text-sm leading-relaxed">')
    .replace(/\n/g, "<br/>");
  return (
    <p
      className="mb-3 text-slate-300 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative"
        style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}
      >
        <Scale className="w-4 h-4 text-white" />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-amber-400 animate-pulse"
          style={{ borderColor: "#05050f" }}
        />
      </div>
      <div
        className="px-4 py-3.5 rounded-2xl rounded-tl-sm"
        style={{ background: "#0f0f1f", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-1.5 py-0.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Intake Step Progress Bar
// ─────────────────────────────────────────────────────────────────────────────
function IntakeProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEP_LABELS.map((label, i) => {
        const s = i + 1;
        const done = s < step;
        const active = s === step;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 flex-shrink-0",
                done ? "bg-emerald-500 text-white" : active ? "text-black" : "bg-white/10 text-slate-600"
              )}
              style={active ? { background: "linear-gradient(135deg, #7C3AED, #F59E0B)" } : {}}
              title={label}
            >
              {done ? <Check className="w-3 h-3" /> : s}
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn("w-4 h-0.5 rounded-full transition-all duration-500", done ? "bg-emerald-500" : "bg-white/10")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Match Score Ring
// ─────────────────────────────────────────────────────────────────────────────
function MatchScoreRing({ score, rank }: { score: number; rank: number }) {
  const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#8B5CF6";
  const rankColors = ["#F59E0B", "#94A3B8", "#CD7F32"];

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 125.6} 125.6`}
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{score}%</span>
        </div>
      </div>
      <div
        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
        style={{ background: `${rankColors[rank] || "#8B5CF6"}20`, color: rankColors[rank] || "#8B5CF6" }}
      >
        #{rank + 1} MATCH
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Premium Lawyer Card (in chat)
// ─────────────────────────────────────────────────────────────────────────────
function LawyerMatchCard({
  lawyer,
  rank,
  onBook,
}: {
  lawyer: any;
  rank: number;
  onBook: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const matchScore = lawyer.matchScore ?? Math.max(60, 95 - rank * 8);
  const matchReason = lawyer.matchReason || "Qualified advocate for your matter";
  const rating = lawyer.rating || 4.7;
  const experience = lawyer.experience || lawyer.experienceYears || 5;
  const fee = lawyer.fee || lawyer.pricing || "₹1,500/session";
  const city = lawyer.city;
  const languages = lawyer.languages || lawyer.language;
  const availability = lawyer.availability || "Contact to confirm";
  const verified = lawyer.verified !== false;

  const initials = (lawyer.name || "A")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const availColor =
    availability?.toLowerCase().includes("now") || availability?.toLowerCase().includes("today")
      ? "#10B981"
      : availability?.toLowerCase().includes("week")
      ? "#F59E0B"
      : "#8B5CF6";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        background: "linear-gradient(145deg, #0d0d20 0%, #0a0a16 100%)",
        border: rank === 0 ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: rank === 0 ? "0 0 20px rgba(245,158,11,0.06)" : "none",
      }}
    >
      {/* Top ribbon for best match */}
      {rank === 0 && (
        <div
          className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold tracking-wider"
          style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.15), transparent)", color: "#F59E0B" }}
        >
          <Award className="w-3 h-3" /> BEST MATCH FOR YOUR CASE
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(245,158,11,0.5))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {initials}
          </div>

          {/* Name / type / badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-white">{lawyer.name || "Advocate"}</p>
              {verified && (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{lawyer.type || lawyer.specialization || "Legal Expert"}</p>
          </div>

          {/* Match score ring */}
          <MatchScoreRing score={matchScore} rank={rank} />
        </div>

        {/* Why matched */}
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg mb-3 text-[11px] text-slate-400"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }}
        >
          <Zap className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
          <span><span className="text-purple-300 font-medium">Why matched:</span> {matchReason}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div
            className="flex flex-col items-center py-2 px-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-0.5 mb-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-white">{Number(rating).toFixed(1)}</span>
            </div>
            <span className="text-[9px] text-slate-600">Rating</span>
          </div>
          <div
            className="flex flex-col items-center py-2 px-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs font-bold text-white">{experience}+ yrs</span>
            <span className="text-[9px] text-slate-600">Experience</span>
          </div>
          <div
            className="flex flex-col items-center py-2 px-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs font-bold text-amber-400">{fee.split("/")[0]}</span>
            <span className="text-[9px] text-slate-600">per session</span>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {city && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 px-2 py-1 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <MapPin className="w-2.5 h-2.5" /> {city}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md"
            style={{ background: `${availColor}15`, color: availColor, border: `1px solid ${availColor}25` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: availColor }} />
            {availability}
          </span>
        </div>

        {/* Expandable: qualification + languages */}
        {expanded && (
          <div
            className="mb-3 p-3 rounded-lg space-y-2 text-[11px]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {lawyer.qualification && (
              <div className="flex items-center gap-2 text-slate-500">
                <Shield className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                {lawyer.qualification}
              </div>
            )}
            {languages && (
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="w-3 h-3 text-blue-400 flex-shrink-0" />
                Speaks: {languages}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBook}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)", boxShadow: "0 4px 12px rgba(245,158,11,0.25)" }}
          >
            Book Consultation
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {expanded ? "Less" : "More"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Case Analysis Card
// ─────────────────────────────────────────────────────────────────────────────
function CaseAnalysisCard({ caseData, advice }: { caseData: any; advice?: string }) {
  const [copied, setCopied] = useState(false);
  const [adviceExpanded, setAdviceExpanded] = useState(true);

  const copyAdvice = () => {
    navigator.clipboard.writeText(advice || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urgency = (caseData?.urgency || "MEDIUM") as "HIGH" | "MEDIUM" | "LOW";
  const urgencyMap = {
    HIGH: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", icon: AlertTriangle, label: "High Urgency — Act Quickly" },
    MEDIUM: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: Clock, label: "Medium Urgency" },
    LOW: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", icon: Info, label: "Low Urgency" },
  };
  const urgencyConfig = urgencyMap[urgency] ?? urgencyMap["MEDIUM"];

  const UrgencyIcon = urgencyConfig.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0d0d20, #0a0a16)", border: "1px solid rgba(139,92,246,0.2)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "rgba(124,58,237,0.07)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <Briefcase className="w-4.5 h-4.5 text-purple-300" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{caseData?.caseType || "Legal Case Analysis"}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              {(caseData?.category || "").replace(/_/g, " ")} · {caseData?.lawyerType || "Specialist Advised"}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: urgencyConfig.bg, color: urgencyConfig.color, border: `1px solid ${urgencyConfig.border}` }}
        >
          <UrgencyIcon className="w-3 h-3" />
          {urgencyConfig.label}
        </div>
      </div>

      {/* AI Legal Analysis */}
      {advice && (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="px-5 py-3 flex items-center justify-between">
            <button
              onClick={() => setAdviceExpanded(!adviceExpanded)}
              className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Legal Analysis
              <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", adviceExpanded && "rotate-90")} />
            </button>
            <button
              onClick={copyAdvice}
              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {adviceExpanded && (
            <div className="px-5 pb-4">
              <MarkdownContent content={advice} />
            </div>
          )}
        </div>
      )}

      {/* Recommended Actions */}
      {caseData?.actions?.length > 0 && (
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Recommended Next Steps
          </p>
          <div className="space-y-2.5">
            {caseData.actions.map((action: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                  style={{
                    background: "rgba(245,158,11,0.15)",
                    color: "#F59E0B",
                    border: "1px solid rgba(245,158,11,0.25)",
                    minWidth: "20px",
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents to gather */}
      {caseData?.required_documents?.length > 0 && (
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Documents to Gather
          </p>
          <div className="flex flex-wrap gap-2">
            {caseData.required_documents.map((doc: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg text-slate-300"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.015)" }}>
        <Link
          href="/dashboard/documents"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" /> Draft Legal Notice
        </Link>
        <Link
          href="/dashboard/user"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
        >
          View in Dashboard <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Matched Advocates Section
// ─────────────────────────────────────────────────────────────────────────────
function MatchedAdvocatesSection({
  lawyers,
  onBook,
}: {
  lawyers: any[];
  onBook: (lawyer: any) => void;
}) {
  const topScore = lawyers[0]?.matchScore ?? 95;

  return (
    <div className="mt-4">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderBottom: "none" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <Users className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Best Matched Advocates</p>
            <p className="text-[10px] text-slate-500">AI-ranked by case fit · {lawyers.length} selected from verified pool</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <Zap className="w-3 h-3" /> {topScore}% top match
        </div>
      </div>

      {/* Cards */}
      <div
        className="p-3 space-y-3 rounded-b-2xl"
        style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.15)", borderTop: "none" }}
      >
        {lawyers.slice(0, 3).map((lawyer, i) => (
          <LawyerMatchCard
            key={lawyer.id || i}
            lawyer={lawyer}
            rank={i}
            onBook={() => onBook(lawyer)}
          />
        ))}

        <div className="pt-1">
          <Link
            href="/dashboard/advocates"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all hover:border-purple-500/30"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            View all verified advocates <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [intakeStep, setIntakeStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingModal, setBookingModal] = useState<{ open: boolean; lawyer: SelectedLawyer | null }>({
    open: false,
    lawyer: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, userId: "user_placeholder", caseId: caseId || undefined }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.caseId) setCaseId(data.caseId);
        if (data.step) setIntakeStep(data.step);
        if (data.status === "COMPLETE") setIntakeStep(5);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: data.reply || "",
            lawyers: data.lawyers || [],
            advice: data.advice,
            caseData: data.caseData,
            step: data.step,
            status: data.status,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Something went wrong. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Connection error. Please check your network and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNew = () => {
    setMessages([]);
    setCaseId(null);
    setIntakeStep(0);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen bg-[#05050f] text-white overflow-hidden">

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r flex-shrink-0 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-64" : "w-0 md:w-56"
        )}
        style={{ background: "#07070e", borderColor: "rgba(255,255,255,0.05)" }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}
            >
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              LEX<span className="text-amber-400">NOVA</span>
            </span>
          </Link>
        </div>

        {/* New chat button */}
        <div className="px-3 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <button
            onClick={startNew}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Plus className="w-3.5 h-3.5" /> New Case Analysis
          </button>
        </div>

        {/* Session history */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {caseId ? (
            <div className="px-3 py-2.5 rounded-lg" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <p className="text-xs font-semibold text-white">Active Session</p>
              </div>
              <p className="text-[10px] text-slate-500">
                {intakeStep >= 5 ? "✓ Analysis Complete" : `Intake — Step ${intakeStep}/4`}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-700 px-2">Your case sessions will appear here.</p>
          )}
        </nav>

        {/* Trust seals */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {[
            { icon: Lock, text: "End-to-End Encrypted" },
            { icon: Shield, text: "Bar Council Verified" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 py-1.5">
              <Icon className="w-3 h-3 text-slate-700" />
              <span className="text-[10px] text-slate-700 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN AREA ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-4 border-b flex-shrink-0"
          style={{ background: "#07070e", borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/5 transition-colors md:hidden"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}
              >
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AI Legal Advisor</p>
                <p className="text-[10px] text-slate-500">Indian Law · 4-Step Structured Intake</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {intakeStep > 0 && intakeStep < 5 && <IntakeProgress step={intakeStep} />}
            {intakeStep >= 5 && (
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full text-emerald-400"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                ✓ Analysis Complete
              </span>
            )}
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}
        >
          {isEmpty ? (
            /* ── WELCOME SCREEN ─────────────────────────────────────────── */
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
              <div className="text-center mb-10">
                {/* Animated logo */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-3xl animate-pulse"
                    style={{ background: "rgba(124,58,237,0.15)", filter: "blur(12px)" }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,158,11,0.15))", border: "1px solid rgba(139,92,246,0.25)" }}
                  >
                    <Scale className="w-9 h-9 text-purple-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">What's your legal concern?</h1>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Describe your situation in plain language. Our AI will analyse it under Indian law,
                  build a structured case profile, and match you with the right advocate.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 justify-center mt-5">
                  {[
                    { icon: Zap, text: "Instant Analysis" },
                    { icon: Shield, text: "100% Confidential" },
                    { icon: Users, text: "Verified Advocates" },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <Icon className="w-3 h-3 text-purple-400" /> {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested issues grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto w-full">
                {SUGGESTED_ISSUES.map((issue) => (
                  <button
                    key={issue.text}
                    onClick={() => handleSend(issue.text)}
                    className="text-left px-4 py-3.5 rounded-xl text-xs text-slate-400 hover:text-white transition-all hover:border-purple-500/30 group"
                    style={{ background: "#0a0a16", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="mr-2 text-base">{issue.icon}</span>
                    <span className="group-hover:text-slate-200 transition-colors">{issue.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── MESSAGES ───────────────────────────────────────────────── */
            <div className="max-w-2xl mx-auto w-full space-y-2 pb-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    /* User bubble */
                    <div className="flex justify-end mb-3">
                      <div className="max-w-[80%]">
                        <div
                          className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-black font-medium bg-white shadow-sm"
                        >
                          {msg.content}
                        </div>
                        <p className="text-right text-[9px] text-[#71717a] mt-1 pr-1">{formatTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  ) : (
                    /* AI bubble */
                    <div className="flex items-start gap-3 mb-4">
                      {/* AI avatar */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#18181b] border border-white/15"
                        >
                          <Scale className="w-4 h-4 text-white" />
                        </div>
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-emerald-400"
                          style={{ borderColor: "#000000" }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-white">LexNova AI</span>
                          <span className="text-[9px] text-[#71717a]">{formatTime(msg.timestamp)}</span>
                        </div>

                        {/* Main reply text */}
                        {msg.content && (
                          <div
                            className="mb-3 px-4 py-3.5 rounded-2xl rounded-tl-sm text-sm bg-[#0d0d0f] border border-white/[0.08] text-[#d4d4d8]"
                          >
                            <MarkdownContent content={msg.content} />
                          </div>
                        )}

                        {/* Case analysis card */}
                        {msg.status === "COMPLETE" && msg.caseData && (
                          <div className="mb-3">
                            <CaseAnalysisCard caseData={msg.caseData} advice={msg.advice} />
                          </div>
                        )}

                        {/* Matched advocates */}
                        {msg.lawyers && msg.lawyers.length > 0 && (
                          <MatchedAdvocatesSection
                            lawyers={msg.lawyers}
                            onBook={(lawyer) =>
                              setBookingModal({
                                open: true,
                                lawyer: {
                                  id: lawyer.id,
                                  name: lawyer.name,
                                  type: lawyer.type || lawyer.specialization || "Advocate",
                                },
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── INPUT AREA ─────────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 px-4 pb-5 pt-3 border-t bg-[#000000] border-white/[0.08]"
        >
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-end gap-2 p-2 rounded-2xl border transition-all bg-[#0a0a0a] border-white/[0.1] focus-within:border-white/30"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isEmpty
                    ? "Describe your legal issue in plain language..."
                    : intakeStep > 0 && intakeStep < 5
                    ? `Answer Step ${intakeStep} of 4...`
                    : "Continue the conversation..."
                }
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none resize-none placeholder-[#52525b] min-h-[44px] max-h-36"
                rows={1}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  input.trim() && !isLoading
                    ? "bg-white text-black hover:scale-105 shadow-md"
                    : "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-[10px] text-slate-700 mt-2.5">
              AI analysis for informational purposes only · Not a substitute for professional legal advice
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.open && bookingModal.lawyer && (
        <BookingModal
          isOpen={bookingModal.open}
          lawyer={bookingModal.lawyer}
          userId="user_placeholder"
          onClose={() => setBookingModal({ open: false, lawyer: null })}
          onSuccess={(bookingId: string) => {
            setBookingModal({ open: false, lawyer: null });
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "ai",
                content: `✅ **Booking Confirmed!** Your consultation with ${bookingModal.lawyer?.name} has been scheduled (Ref: #${bookingId?.slice(-6) || "—"}). You'll receive a confirmation shortly. Visit your [Dashboard](/dashboard/user) to view upcoming consultations.`,
                timestamp: new Date(),
              },
            ]);
          }}
        />
      )}
    </div>
  );
}
