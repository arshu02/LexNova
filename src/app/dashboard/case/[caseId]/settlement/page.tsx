"use client";

import React, {
  useState, useEffect, useCallback, useRef, Suspense,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, ChevronRight, Loader2, AlertTriangle, CheckCircle,
  X, Plus, Sparkles, IndianRupee, Clock, FileText, Users,
  ThumbsUp, ThumbsDown, RotateCcw, Send, Shield, Gavel,
  ScrollText, KeySquare, PenLine, ArrowRight, Info,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow, isPast } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────
interface Settlement {
  id: string;
  caseId: string;
  proposedBy: string;
  terms: string;
  amount: number | null;
  status: string;
  signedByPlaintiff: boolean;
  signedByDefendant: boolean;
  signedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CaseMeta {
  id: string;
  title: string;
  caseType?: string | null;
  category?: string | null;
  jurisdiction: string;
  status: string;
  user: { id: string; name: string | null; email: string };
  advocate?: { name: string } | null;
  caseParties: {
    role: string;
    userId: string;
    user: { id: string; name: string | null; email: string };
    lawyer?: { name: string } | null;
  }[];
}

interface AISuggestion {
  suggestion: string;
  parsedAmounts: { min: number | null; max: number | null; optimal: number | null };
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PROPOSED:    { label: "Proposed",    color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)"  },
  ACCEPTED:    { label: "Accepted",    color: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)"  },
  REJECTED:    { label: "Rejected",    color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
  EXECUTED:    { label: "Executed ✓",  color: "#A78BFA", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.35)"},
  SUPERSEDED:  { label: "Superseded",  color: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" },
  COUNTER:     { label: "Counter",     color: "#FB923C", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)"  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtINR = (n?: number | null) =>
  n != null ? "₹" + n.toLocaleString("en-IN") : "—";

const fmtDate = (iso?: string | null) =>
  iso ? format(new Date(iso), "dd MMM yyyy · h:mm a") : "—";

function parseTermsLines(terms: string) {
  const lines = terms.split("\n").filter(Boolean);
  return lines.map((l) => {
    const colon = l.indexOf(":");
    return colon > -1
      ? { label: l.slice(0, colon).trim(), value: l.slice(colon + 1).trim() }
      : { label: "", value: l.trim() };
  });
}

// ── AI Suggestion panel ───────────────────────────────────────────────────────
function AISuggestionPanel({
  caseId,
  caseType,
  jurisdiction,
  onApply,
}: {
  caseId: string;
  caseType: string;
  jurisdiction: string;
  onApply: (amount: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimAmount, setClaimAmount] = useState("");
  const [strength, setStrength] = useState<"STRONG" | "MODERATE" | "WEAK">("MODERATE");

  const fetch_ = async () => {
    if (!claimAmount) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/settlement-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseType: caseType || "CONSUMER_GRIEVANCE",
          claimAmount: parseFloat(claimAmount),
          jurisdiction,
          evidenceStrength: strength,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Failed"); return; }
      setSuggestion(d);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all placeholder-slate-600";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.05)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b"
        style={{ borderColor: "rgba(124,58,237,0.18)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <p className="text-sm font-bold text-white">AI Settlement Advisor</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Your Claim Amount (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              <input
                id="ai-claim-amount"
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="50000"
                className={inputCls + " pl-8"}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Evidence Strength
            </label>
            <div className="flex gap-1.5">
              {(["STRONG", "MODERATE", "WEAK"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStrength(s)}
                  className="flex-1 py-2 rounded-lg text-[10px] font-bold transition-all"
                  style={
                    strength === s
                      ? {
                          background: s === "STRONG" ? "rgba(52,211,153,0.15)" : s === "MODERATE" ? "rgba(251,146,60,0.15)" : "rgba(248,113,113,0.15)",
                          color: s === "STRONG" ? "#34d399" : s === "MODERATE" ? "#fb923c" : "#f87171",
                          border: `1px solid ${s === "STRONG" ? "rgba(52,211,153,0.3)" : s === "MODERATE" ? "rgba(251,146,60,0.3)" : "rgba(248,113,113,0.3)"}`,
                        }
                      : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {s[0] + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          id="ai-suggest-btn"
          onClick={fetch_}
          disabled={loading || !claimAmount}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Analysing precedents…" : "Suggest Fair Settlement"}
        </button>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        {/* Result */}
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Amount range pills */}
            {suggestion.parsedAmounts.optimal && (
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Min", amount: suggestion.parsedAmounts.min, color: "#F87171" },
                  { label: "Optimal", amount: suggestion.parsedAmounts.optimal, color: "#A78BFA" },
                  { label: "Max", amount: suggestion.parsedAmounts.max, color: "#34D399" },
                ].filter((r) => r.amount).map((r) => (
                  <button
                    key={r.label}
                    onClick={() => r.amount && onApply(r.amount)}
                    className="flex-1 py-2.5 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `${r.color}12`,
                      border: `1px solid ${r.color}30`,
                    }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: r.color }}>
                      {r.label}
                    </p>
                    <p className="text-sm font-black text-white mt-0.5">{fmtINR(r.amount)}</p>
                    {r.label === "Optimal" && (
                      <p className="text-[9px] text-slate-600 mt-0.5">← click to apply</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Full suggestion text */}
            <div
              className="rounded-xl p-3.5 max-h-52 overflow-y-auto"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {suggestion.suggestion}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Proposal form ─────────────────────────────────────────────────────────────
function ProposalForm({
  caseId,
  caseType,
  jurisdiction,
  onSaved,
}: {
  caseId: string;
  caseType: string;
  jurisdiction: string;
  onSaved: (s: Settlement) => void;
}) {
  const [amount, setAmount] = useState("");
  const [paymentTimeline, setPaymentTimeline] = useState("LUMP_SUM");
  const [nonMonetary, setNonMonetary] = useState("");
  const [validityDays, setValidityDays] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          amount: parseFloat(amount),
          paymentTimeline,
          nonMonetaryTerms: nonMonetary || undefined,
          validityDays: parseInt(validityDays),
        }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Failed to submit"); return; }
      onSaved(d);
      setAmount(""); setNonMonetary(""); setPaymentTimeline("LUMP_SUM");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = "w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder-slate-600";
  const fieldStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="space-y-4">
      {/* AI advisor toggle */}
      <button
        id="toggle-ai-advisor"
        onClick={() => setShowAI((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
        style={{
          background: showAI ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
          border: showAI ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">AI Settlement Advisor</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}
          >
            Beta
          </span>
        </div>
        <span className="text-xs text-slate-500">{showAI ? "Hide" : "Suggest fair amount →"}</span>
      </button>

      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <AISuggestionPanel
              caseId={caseId}
              caseType={caseType}
              jurisdiction={jurisdiction}
              onApply={(amt) => { setAmount(String(amt)); setShowAI(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposal form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="flex gap-2 items-start p-3 rounded-xl text-xs text-red-300"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Settlement Amount (₹) *
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            <input
              id="settlement-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              min="0"
              step="any"
              className={fieldCls + " pl-9"}
              style={fieldStyle}
            />
          </div>
          {amount && (
            <p className="text-xs text-purple-400 font-semibold mt-1">
              = {fmtINR(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Payment timeline */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Payment Timeline *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "LUMP_SUM", label: "Lump Sum" },
              { value: "INSTALLMENTS_3", label: "3 Installments" },
              { value: "INSTALLMENTS_6", label: "6 Installments" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentTimeline(opt.value)}
                className="py-2.5 rounded-xl text-xs font-bold transition-all"
                style={
                  paymentTimeline === opt.value
                    ? { background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.4)" }
                    : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Non-monetary terms */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Non-Monetary Terms (optional)
          </label>
          <textarea
            id="non-monetary-terms"
            value={nonMonetary}
            onChange={(e) => setNonMonetary(e.target.value)}
            placeholder="e.g. Defendant must issue a public apology; Plaintiff withdraws all social media posts; Defendant to return original documents…"
            rows={3}
            className={fieldCls + " resize-none"}
            style={fieldStyle}
          />
        </div>

        {/* Validity */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Proposal Valid For
          </label>
          <div className="flex gap-2">
            {["7", "14", "30", "60"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setValidityDays(d)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={
                  validityDays === d
                    ? { background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.4)" }
                    : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <button
          id="submit-proposal-btn"
          type="submit"
          disabled={loading || !amount}
          className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
            boxShadow: "0 0 24px rgba(124,58,237,0.3)",
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Submitting…" : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}

// ── OTP Sign modal ───────────────────────────────────────────────────────────
function OTPSignModal({
  settlementId,
  amount,
  onClose,
  onSigned,
}: {
  settlementId: string;
  amount: number | null;
  onClose: () => void;
  onSigned: (s: Settlement) => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const sendOtp = async () => {
    setSent(true);
    // In real implementation: call /api/auth/otp/send
    // Here we simply note that any 4-digit code is accepted in dev
  };

  const handleSign = async () => {
    if (!otp || otp.length < 4) { setError("Enter a 4-digit OTP"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settlements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementId, action: "SIGN", otp }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Failed to sign"); return; }
      onSigned(d);
      onClose();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-sm rounded-3xl p-6 space-y-5"
        style={{
          background: "linear-gradient(160deg, #0d0d1a, #111122)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white transition-all hover:bg-white/[0.06]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <PenLine className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-black text-white">E-Sign Settlement</h3>
          <p className="text-xs text-slate-400">
            You are signing the settlement for{" "}
            <span className="text-purple-300 font-bold">{fmtINR(amount)}</span>.
            This is legally binding.
          </p>
        </div>

        {/* OTP area */}
        {!sent ? (
          <button
            id="send-otp-btn"
            onClick={sendOtp}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)" }}
          >
            <KeySquare className="w-4 h-4" />
            Send OTP to my phone / email
          </button>
        ) : (
          <div className="space-y-3">
            <div
              className="text-center py-2 px-3 rounded-xl text-xs text-amber-300"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <strong>Dev mode:</strong> Enter any 4+ digit code (e.g. 1234)
            </div>
            <input
              id="otp-input"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              placeholder="Enter OTP"
              className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 rounded-xl text-white outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.4)", letterSpacing: "0.4em" }}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}
            <button
              id="confirm-sign-btn"
              onClick={handleSign}
              disabled={loading || otp.length < 4}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? "Signing…" : "Confirm & E-Sign"}
            </button>
          </div>
        )}

        <p className="text-[10px] text-slate-600 text-center leading-relaxed">
          Your e-signature is binding under the Indian Contract Act 1872 and CPC Order XXIII Rule 3.
        </p>
      </motion.div>
    </div>
  );
}

// ── Settlement card ───────────────────────────────────────────────────────────
function SettlementCard({
  settlement,
  callerId,
  plaintiffId,
  onAction,
  onSign,
  isLatestActive,
}: {
  settlement: Settlement;
  callerId: string;
  plaintiffId: string;
  onAction: (id: string, action: "ACCEPT" | "REJECT") => Promise<void>;
  onSign: (s: Settlement) => void;
  isLatestActive: boolean;
}) {
  const [actLoading, setActLoading] = useState<string | null>(null);
  const cfg = STATUS_CFG[settlement.status] ?? STATUS_CFG.PROPOSED;
  const terms = parseTermsLines(settlement.terms);
  const isProposer = settlement.proposedBy === callerId;
  const isExpired = settlement.expiresAt && isPast(new Date(settlement.expiresAt));
  const canAct = isLatestActive && settlement.status === "PROPOSED" && !isProposer && !isExpired;

  const act = async (action: "ACCEPT" | "REJECT") => {
    setActLoading(action);
    await onAction(settlement.id, action);
    setActLoading(null);
  };

  const isSigned = settlement.status === "ACCEPTED" || settlement.status === "EXECUTED";
  const callerIsPlaintiff = callerId === plaintiffId;
  const mySignKey = callerIsPlaintiff ? "signedByPlaintiff" : "signedByDefendant";
  const mySigned = settlement[mySignKey as keyof Settlement] as boolean;
  const canSign = isSigned && !mySigned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: settlement.status === "EXECUTED"
          ? "rgba(167,139,250,0.06)"
          : "rgba(255,255,255,0.02)",
        border: settlement.status === "EXECUTED"
          ? "1px solid rgba(167,139,250,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: settlement.status === "EXECUTED"
          ? "0 0 40px rgba(167,139,250,0.08)"
          : "none",
      }}
    >
      {/* Card top */}
      <div
        className="px-4 py-3 flex flex-wrap items-start justify-between gap-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
            {isProposer && (
              <span className="text-[10px] text-slate-600 font-semibold">Your proposal</span>
            )}
            {isExpired && settlement.status === "PROPOSED" && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                Expired
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5">
            {formatDistanceToNow(new Date(settlement.createdAt), { addSuffix: true })}
          </p>
        </div>
        {settlement.amount && (
          <p className="text-xl font-black text-white">{fmtINR(settlement.amount)}</p>
        )}
      </div>

      {/* Terms */}
      <div className="px-4 py-3 space-y-1.5">
        {terms.map((t, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {t.label ? (
              <>
                <span className="text-slate-600 w-32 flex-shrink-0 font-semibold">{t.label}</span>
                <span className="text-slate-300">{t.value}</span>
              </>
            ) : (
              <span className="text-slate-400 col-span-2">{t.value}</span>
            )}
          </div>
        ))}

        {settlement.expiresAt && settlement.status === "PROPOSED" && !isExpired && (
          <p className="text-[10px] text-amber-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            Expires {formatDistanceToNow(new Date(settlement.expiresAt), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Signature status (for ACCEPTED/EXECUTED) */}
      {(settlement.status === "ACCEPTED" || settlement.status === "EXECUTED") && (
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
            E-Signatures
          </p>
          <div className="flex gap-3">
            {[
              { label: "Plaintiff", signed: settlement.signedByPlaintiff },
              { label: "Defendant", signed: settlement.signedByDefendant },
            ].map(({ label, signed }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                {signed
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                <span className={signed ? "text-emerald-400 font-semibold" : "text-slate-600"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {settlement.status === "EXECUTED" && settlement.signedAt && (
            <p className="text-[10px] text-purple-400 font-semibold mt-1.5">
              ✓ Agreement executed {fmtDate(settlement.signedAt)}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      {(canAct || canSign) && (
        <div
          className="px-4 py-3 flex gap-2 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {canAct && (
            <>
              <button
                id={`accept-${settlement.id}`}
                onClick={() => act("ACCEPT")}
                disabled={!!actLoading}
                className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
              >
                {actLoading === "ACCEPT" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                Accept
              </button>
              <button
                id={`reject-${settlement.id}`}
                onClick={() => act("REJECT")}
                disabled={!!actLoading}
                className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}
              >
                {actLoading === "REJECT" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                Reject
              </button>
            </>
          )}
          {canSign && (
            <button
              id={`sign-${settlement.id}`}
              onClick={() => onSign(settlement)}
              className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", color: "#fff" }}
            >
              <PenLine className="w-3.5 h-3.5" />
              E-Sign Agreement
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Executed agreement viewer ─────────────────────────────────────────────────
function ExecutedBanner({ settlement }: { settlement: Settlement }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(124,58,237,0.06))",
        border: "1px solid rgba(167,139,250,0.4)",
        boxShadow: "0 0 60px rgba(167,139,250,0.1)",
      }}
    >
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7C3AED, #A78BFA, #C4B5FD)" }} />
      <div className="p-5 flex flex-wrap items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.4)" }}
        >
          <ScrollText className="w-5 h-5 text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white">Settlement Agreement Executed</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Both parties have signed. The agreement is legally binding and the case is now marked as{" "}
            <span className="text-purple-300 font-bold">SETTLED</span>.
          </p>
          {settlement.signedAt && (
            <p className="text-[10px] text-purple-400 mt-1 font-semibold">
              Executed on {fmtDate(settlement.signedAt)}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-2xl font-black text-white">{fmtINR(settlement.amount)}</p>
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
            Final settlement
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function SettlementPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [caseMeta, setCaseMeta] = useState<CaseMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signTarget, setSignTarget] = useState<Settlement | null>(null);

  const callerId = (session?.user as any)?.id as string | undefined;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?next=/dashboard/case/${caseId}/settlement`);
    }
  }, [authStatus, caseId, router]);

  const load = useCallback(async () => {
    if (!caseId || authStatus !== "authenticated") return;
    setLoading(true);
    setError(null);
    try {
      const [caseRes, settleRes] = await Promise.all([
        fetch(`/api/cases/${caseId}`),
        fetch(`/api/settlements?caseId=${caseId}`),
      ]);
      if (!caseRes.ok) { setError("Could not load case."); return; }
      setCaseMeta(await caseRes.json());
      if (settleRes.ok) setSettlements(await settleRes.json());
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [caseId, authStatus]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, action: "ACCEPT" | "REJECT") => {
    const res = await fetch("/api/settlements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settlementId: id, action }),
    });
    if (res.ok) {
      const updated: Settlement = await res.json();
      setSettlements((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  };

  const handleSaved = (s: Settlement) => {
    setSettlements((prev) => [...prev, s]);
  };

  const handleSigned = (updated: Settlement) => {
    setSettlements((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const executed = settlements.find((s) => s.status === "EXECUTED");
  const active = settlements
    .filter((s) => s.status === "PROPOSED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const isSettled = caseMeta?.status === "SETTLED" || !!executed;

  const plaintiffId = caseMeta?.user?.id;
  const defendant = caseMeta?.caseParties?.find((p) => p.role === "DEFENDANT");

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <p className="text-xs text-slate-500">Loading settlement…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <p className="text-sm font-bold text-white">Failed to Load</p>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={load} className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Link href="/dashboard/user" className="hover:text-slate-300 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/dashboard/case/${caseId}`} className="hover:text-slate-300 transition-colors">Case Room</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">Settlement</span>
        </div>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-purple-400 flex-shrink-0" />
            Settlement Negotiation
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            {caseMeta?.title} &middot;{" "}
            {isSettled
              ? "🟢 Case Settled"
              : `${settlements.filter((s) => s.status !== "SUPERSEDED").length} proposal${settlements.filter((s) => s.status !== "SUPERSEDED").length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* ── Parties bar ───────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-black text-white">
              {(caseMeta?.user?.name || caseMeta?.user?.email || "P")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {caseMeta?.user?.name || caseMeta?.user?.email?.split("@")[0]}
              </p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Plaintiff</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.08)" }} />
            <Scale className="w-4 h-4" />
            <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <div className="flex items-center gap-3">
            {defendant ? (
              <>
                <div>
                  <p className="text-xs font-bold text-white text-right">
                    {defendant.user?.name || defendant.user?.email?.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider text-right">
                    Defendant
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xs font-black text-white">
                  {(defendant.user?.name || defendant.user?.email || "D")[0].toUpperCase()}
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-600 italic">Defendant not joined</div>
            )}
          </div>
        </div>

        {/* ── Executed banner ───────────────────────────────────────────── */}
        {executed && <ExecutedBanner settlement={executed} />}

        {/* ── Info block ────────────────────────────────────────────────── */}
        {!isSettled && (
          <div
            className="flex gap-3 p-3.5 rounded-xl"
            style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}
          >
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300/80 leading-relaxed">
              Either party may propose a settlement at any time. Both parties must accept and
              e-sign for it to become binding. Settlements are encouraged under{" "}
              <strong className="text-blue-300">CPC Section 89</strong> (court-annexed mediation) and
              can save years of litigation.
            </p>
          </div>
        )}

        {/* ── Proposal form ─────────────────────────────────────────────── */}
        {!isSettled && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              New Proposal
            </h2>
            <ProposalForm
              caseId={caseId as string}
              caseType={caseMeta?.category || caseMeta?.caseType || "CONSUMER_GRIEVANCE"}
              jurisdiction={caseMeta?.jurisdiction || "India"}
              onSaved={handleSaved}
            />
          </div>
        )}

        {/* ── Settlement timeline ───────────────────────────────────────── */}
        {settlements.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Proposal Timeline
            </h2>
            <div className="space-y-3">
              {[...settlements]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((s) => (
                  <SettlementCard
                    key={s.id}
                    settlement={s}
                    callerId={callerId || ""}
                    plaintiffId={plaintiffId || ""}
                    onAction={handleAction}
                    onSign={setSignTarget}
                    isLatestActive={s.id === active?.id}
                  />
                ))}
            </div>
          </div>
        )}

        {settlements.length === 0 && !isSettled && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Scale className="w-10 h-10 text-slate-700" />
            <p className="text-sm font-semibold text-slate-500">No proposals yet</p>
            <p className="text-xs text-slate-600 max-w-xs">
              Either party can initiate a settlement. Use the form above to submit the first proposal.
            </p>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* ── OTP Sign modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {signTarget && (
          <OTPSignModal
            settlementId={signTarget.id}
            amount={signTarget.amount}
            onClose={() => setSignTarget(null)}
            onSigned={handleSigned}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function SettlementPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    }>
      <SettlementPage />
    </Suspense>
  );
}
