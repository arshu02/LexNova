"use client";

import React, {
  useState, useEffect, useCallback, useRef, Suspense,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel, Calendar, Clock, Building2, User, ChevronRight,
  Plus, X, Loader2, AlertTriangle, ChevronDown, Bell,
  BellOff, FileText, MapPin, Timer, CheckCircle, Hash,
  ArrowLeft, RotateCcw, Save, MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
  format, isPast, formatDistanceToNowStrict, differenceInDays,
  isToday, isTomorrow,
} from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────
interface Hearing {
  id: string;
  caseId: string;
  hearingDate: string;
  hearingTime: string;
  courtName: string;
  courtNumber?: string | null;
  judgeName?: string | null;
  purpose: string;
  outcome?: string | null;
  adjournReason?: string | null;
  nextDate?: string | null;
  notes?: string | null;
  reminderSent: boolean;
}

interface CaseMeta {
  id: string;
  title: string;
  caseNumber?: string | null;
  caseType?: string | null;
  courtName?: string | null;
  nextHearingDate?: string | null;
  advocate?: { name: string } | null;
}

type ReminderChannel = "APP" | "EMAIL" | "WHATSAPP";

interface ReminderPrefs {
  days7: boolean;
  days1: boolean;
  hours3: boolean;
  channels: ReminderChannel[];
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PURPOSE_OPTIONS = [
  { value: "FIRST_HEARING", label: "First Hearing" },
  { value: "EVIDENCE", label: "Evidence Recording" },
  { value: "ARGUMENTS", label: "Arguments" },
  { value: "JUDGMENT", label: "Judgment" },
  { value: "ADJOURNED", label: "Adjourned / Misc" },
];

const OUTCOME_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  JUDGMENT_PASSED: { label: "Order Passed", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: CheckCircle },
  ADJOURNED:       { label: "Adjourned",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",  icon: RotateCcw },
  ARGUED:          { label: "Argued",       color: "#60A5FA", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)",  icon: MessageSquare },
  ORDER_RESERVED:  { label: "Order Reserved", color: "#A78BFA", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", icon: FileText },
  SCHEDULED:       { label: "Scheduled",    color: "#94A3B8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.2)", icon: Calendar },
  MISSED:          { label: "Missed",       color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   icon: AlertTriangle },
};

function purposeLabel(p: string) {
  return PURPOSE_OPTIONS.find((o) => o.value === p)?.label ?? p;
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, dd MMMM yyyy");
}

function deriveOutcome(h: Hearing): string {
  if (h.outcome) return h.outcome;
  if (isPast(new Date(h.hearingDate))) return "MISSED";
  return "SCHEDULED";
}

// ── Countdown timer (live) ───────────────────────────────────────────────────
function BigCountdown({ targetISO }: { targetISO: string }) {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [past, setPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      const gap = new Date(targetISO).getTime() - Date.now();
      if (gap <= 0) { setPast(true); return; }
      setParts({
        d: Math.floor(gap / 86400000),
        h: Math.floor((gap % 86400000) / 3600000),
        m: Math.floor((gap % 3600000) / 60000),
        s: Math.floor((gap % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  if (past) return <span className="text-slate-500 text-sm font-semibold">Hearing passed</span>;

  return (
    <div className="flex items-end gap-2">
      {[
        { v: parts.d, label: "days" },
        { v: parts.h, label: "hrs" },
        { v: parts.m, label: "min" },
        { v: parts.s, label: "sec" },
      ].map(({ v, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black text-white tabular-nums"
            style={{
              background: "rgba(124,58,237,0.18)",
              border: "1.5px solid rgba(124,58,237,0.4)",
              boxShadow: "0 0 16px rgba(124,58,237,0.15) inset",
            }}
          >
            {String(v).padStart(2, "0")}
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1.5">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Outcome badge ─────────────────────────────────────────────────────────────
function OutcomeBadge({ outcome }: { outcome: string }) {
  const cfg = OUTCOME_CONFIG[outcome] ?? OUTCOME_CONFIG.SCHEDULED;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Add Hearing Modal ────────────────────────────────────────────────────────
function AddHearingModal({
  caseId,
  onClose,
  onSaved,
}: {
  caseId: string;
  onClose: () => void;
  onSaved: (h: Hearing) => void;
}) {
  const [form, setForm] = useState({
    hearingDate: "",
    hearingTime: "10:30",
    courtName: "",
    courtNumber: "",
    judgeName: "",
    purpose: "FIRST_HEARING",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hearings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add hearing"); return; }
      onSaved(data);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const inputCls =
    "w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all placeholder-slate-600";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const inputFocus = { borderColor: "rgba(124,58,237,0.5)" } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d0d1a, #111122)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b z-10"
          style={{ background: "#0d0d1a", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
            >
              <Gavel className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-base font-bold text-white">Add Hearing</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="flex gap-2 p-3 rounded-xl text-xs text-red-300"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Hearing Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  id="hearing-date"
                  type="date"
                  value={form.hearingDate}
                  onChange={set("hearingDate")}
                  required
                  className={inputCls + " pl-9"}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  id="hearing-time"
                  type="time"
                  value={form.hearingTime}
                  onChange={set("hearingTime")}
                  required
                  className={inputCls + " pl-9"}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </div>
            </div>
          </div>

          {/* Court name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Court Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <input
                id="court-name"
                type="text"
                value={form.courtName}
                onChange={set("courtName")}
                placeholder="District Court, Bengaluru"
                required
                className={inputCls + " pl-9"}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Court number + Judge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Court No.
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  id="court-number"
                  type="text"
                  value={form.courtNumber}
                  onChange={set("courtNumber")}
                  placeholder="7"
                  className={inputCls + " pl-9"}
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Judge Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  id="judge-name"
                  type="text"
                  value={form.judgeName}
                  onChange={set("judgeName")}
                  placeholder="R. K. Verma"
                  className={inputCls + " pl-9"}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Purpose *
            </label>
            <div className="relative">
              <Gavel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <select
                id="hearing-purpose"
                value={form.purpose}
                onChange={set("purpose")}
                required
                className={inputCls + " pl-9 pr-9 appearance-none cursor-pointer"}
                style={inputStyle}
              >
                {PURPOSE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#111122" }}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Notes (optional)
            </label>
            <textarea
              id="hearing-notes"
              value={form.notes}
              onChange={set("notes")}
              placeholder="Any additional notes for the hearing…"
              rows={3}
              className={inputCls + " resize-none"}
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-400 transition-all hover:text-white hover:bg-white/[0.05]"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancel
            </button>
            <button
              id="add-hearing-submit"
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                boxShadow: "0 0 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Saving…" : "Save Hearing"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Reminder Settings panel ──────────────────────────────────────────────────
function ReminderSettings({
  prefs,
  onChange,
}: {
  prefs: ReminderPrefs;
  onChange: (p: ReminderPrefs) => void;
}) {
  const toggle = (key: keyof Omit<ReminderPrefs, "channels">) =>
    onChange({ ...prefs, [key]: !prefs[key] });

  const toggleChannel = (ch: ReminderChannel) => {
    const has = prefs.channels.includes(ch);
    onChange({
      ...prefs,
      channels: has
        ? prefs.channels.filter((c) => c !== ch)
        : [...prefs.channels, ch],
    });
  };

  const ToggleRow = ({
    label,
    desc,
    active,
    onToggle,
    id,
  }: {
    label: string;
    desc: string;
    active: boolean;
    onToggle: () => void;
    id: string;
  }) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        id={id}
        onClick={onToggle}
        className="relative w-11 h-6 rounded-full transition-all flex-shrink-0 focus:outline-none"
        style={{
          background: active
            ? "linear-gradient(135deg, #7C3AED, #8B5CF6)"
            : "rgba(255,255,255,0.08)",
          boxShadow: active ? "0 0 12px rgba(124,58,237,0.4)" : "none",
          border: active ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.1)",
        }}
        aria-pressed={active}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
          style={{ transform: active ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );

  const ChannelChip = ({ ch, label }: { ch: ReminderChannel; label: string }) => {
    const active = prefs.channels.includes(ch);
    return (
      <button
        id={`channel-${ch.toLowerCase()}`}
        onClick={() => toggleChannel(ch)}
        className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
        style={
          active
            ? {
                background: "rgba(124,58,237,0.2)",
                color: "#c4b5fd",
                border: "1px solid rgba(124,58,237,0.4)",
              }
            : {
                background: "rgba(255,255,255,0.04)",
                color: "#64748b",
                border: "1px solid rgba(255,255,255,0.07)",
              }
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white">Reminder Settings</h3>
      </div>

      <div
        className="divide-y"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <ToggleRow
          id="reminder-7d"
          label="7 days before"
          desc="Weekly advance notice to prepare"
          active={prefs.days7}
          onToggle={() => toggle("days7")}
        />
        <ToggleRow
          id="reminder-1d"
          label="1 day before"
          desc="Daily reminder to organize documents"
          active={prefs.days1}
          onToggle={() => toggle("days1")}
        />
        <ToggleRow
          id="reminder-3h"
          label="3 hours before"
          desc="Same-day reminder before the hearing"
          active={prefs.hours3}
          onToggle={() => toggle("hours3")}
        />
      </div>

      {/* Channel selector */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">
          Notify via
        </p>
        <div className="flex gap-2 flex-wrap">
          <ChannelChip ch="APP" label="📱 App" />
          <ChannelChip ch="EMAIL" label="✉️ Email" />
          <ChannelChip ch="WHATSAPP" label="💬 WhatsApp" />
        </div>
      </div>

      <p className="text-[10px] text-slate-700 mt-4 leading-relaxed">
        Reminder preferences are stored locally. WhatsApp and Email delivery requires a Pro subscription.
      </p>
    </div>
  );
}

// ── Hearing card ─────────────────────────────────────────────────────────────
function HearingCard({
  hearing,
  index,
  isNext,
  userRole,
  onUpdate,
}: {
  hearing: Hearing;
  index: number;
  isNext: boolean;
  userRole: string;
  onUpdate: (updated: Hearing) => void;
}) {
  const [expanded, setExpanded] = useState(isNext);
  const [updatingOutcome, setUpdatingOutcome] = useState(false);
  const outcome = deriveOutcome(hearing);
  const outcomeCfg = OUTCOME_CONFIG[outcome] ?? OUTCOME_CONFIG.SCHEDULED;
  const hearingPast = isPast(new Date(hearing.hearingDate));
  const isAdvocate = userRole === "ADVOCATE" || userRole === "LAWYER";

  const handleOutcomeChange = async (newOutcome: string) => {
    setUpdatingOutcome(true);
    try {
      const res = await fetch("/api/hearings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hearing.id, outcome: newOutcome }),
      });
      if (res.ok) onUpdate(await res.json());
    } finally {
      setUpdatingOutcome(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center z-10"
          style={{
            background: isNext
              ? "rgba(124,58,237,0.2)"
              : hearingPast
              ? "rgba(255,255,255,0.04)"
              : "rgba(245,158,11,0.1)",
            border: isNext
              ? "2px solid rgba(124,58,237,0.6)"
              : hearingPast
              ? "2px solid rgba(255,255,255,0.08)"
              : "2px solid rgba(245,158,11,0.4)",
            boxShadow: isNext ? "0 0 16px rgba(124,58,237,0.25)" : "none",
          }}
        >
          <Gavel
            className="w-4.5 h-4.5"
            style={{
              color: isNext ? "#a78bfa" : hearingPast ? "#334155" : "#fbbf24",
            }}
          />
        </div>
        {/* Connector line — don't render for last card */}
        <div
          className="w-px flex-1 mt-2 min-h-[28px]"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl mb-4 overflow-hidden transition-all"
        style={{
          background: isNext
            ? "rgba(124,58,237,0.06)"
            : hearingPast
            ? "rgba(255,255,255,0.015)"
            : "rgba(245,158,11,0.04)",
          border: isNext
            ? "1px solid rgba(124,58,237,0.25)"
            : hearingPast
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(245,158,11,0.2)",
        }}
      >
        {/* Card header — always visible */}
        <button
          className="w-full text-left p-4 flex flex-wrap items-start justify-between gap-3"
          onClick={() => setExpanded((v) => !v)}
        >
          <div>
            {/* Date */}
            <div className="flex items-baseline gap-2 flex-wrap">
              {isNext && (
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}
                >
                  NEXT
                </span>
              )}
              <span className="text-base font-black text-white">
                {format(new Date(hearing.hearingDate), "dd MMM yyyy")}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                {hearing.hearingTime}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {purposeLabel(hearing.purpose)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <OutcomeBadge outcome={outcome} />
            <ChevronDown
              className="w-4 h-4 text-slate-600 transition-transform"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </button>

        {/* Expandable detail */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-4 pb-4 pt-0 space-y-4 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                {/* Details grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 pt-3">
                  {[
                    {
                      icon: Building2,
                      label: "Court",
                      value: `${hearing.courtName}${hearing.courtNumber ? ` · Court ${hearing.courtNumber}` : ""}`,
                    },
                    hearing.judgeName
                      ? { icon: User, label: "Judge", value: `Hon. ${hearing.judgeName}` }
                      : null,
                    hearing.nextDate
                      ? { icon: Calendar, label: "Next Date", value: fmtDate(hearing.nextDate) }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((row) => {
                      const Icon = row!.icon;
                      return (
                        <div key={row!.label} className="flex items-start gap-2">
                          <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                              {row!.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-300 mt-0.5">
                              {row!.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Adjournment reason */}
                {hearing.adjournReason && (
                  <div
                    className="flex gap-2 p-3 rounded-xl"
                    style={{
                      background: "rgba(245,158,11,0.07)",
                      border: "1px solid rgba(245,158,11,0.18)",
                    }}
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                        Adjournment Reason
                      </p>
                      <p className="text-xs text-amber-300/80 mt-0.5">{hearing.adjournReason}</p>
                    </div>
                  </div>
                )}

                {/* Lawyer notes */}
                {hearing.notes && (
                  <div
                    className="flex gap-2 p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        Notes
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {hearing.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Outcome picker (lawyer only, past hearings) */}
                {isAdvocate && hearingPast && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Update Outcome
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["JUDGMENT_PASSED", "ADJOURNED", "ARGUED", "ORDER_RESERVED", "MISSED"] as const).map(
                        (oc) => {
                          const cfg = OUTCOME_CONFIG[oc];
                          const active = outcome === oc;
                          return (
                            <button
                              key={oc}
                              id={`outcome-${oc.toLowerCase()}`}
                              onClick={() => handleOutcomeChange(oc)}
                              disabled={updatingOutcome}
                              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-50"
                              style={
                                active
                                  ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
                                  : {
                                      background: "rgba(255,255,255,0.04)",
                                      color: "#64748b",
                                      border: "1px solid rgba(255,255,255,0.07)",
                                    }
                              }
                            >
                              {cfg.label}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function HearingsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [caseMeta, setCaseMeta] = useState<CaseMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reminderPrefs, setReminderPrefs] = useState<ReminderPrefs>({
    days7: true,
    days1: true,
    hours3: false,
    channels: ["APP"],
  });

  const userRole = (session?.user as any)?.role as string | undefined;
  const isAdvocate = userRole === "ADVOCATE" || userRole === "LAWYER";

  // ── Redirect if not authed ───────────────────────────────────────────────
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?next=/dashboard/case/${caseId}/hearings`);
    }
  }, [authStatus, caseId, router]);

  // ── Load case meta + hearings ────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!caseId || authStatus !== "authenticated") return;
    setLoading(true);
    setError(null);
    try {
      const [caseRes, hearingsRes] = await Promise.all([
        fetch(`/api/cases/${caseId}`),
        fetch(`/api/hearings?caseId=${caseId}`),
      ]);

      if (!caseRes.ok) { setError("Could not load case details."); return; }
      if (!hearingsRes.ok) { setError("Could not load hearings."); return; }

      const [caseData, hearingData] = await Promise.all([
        caseRes.json(),
        hearingsRes.json(),
      ]);

      setCaseMeta(caseData);
      setHearings(Array.isArray(hearingData) ? hearingData : []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [caseId, authStatus]);

  useEffect(() => { load(); }, [load]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const sorted = [...hearings].sort(
    (a, b) => new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime()
  );

  const nextHearing = sorted.find((h) => !isPast(new Date(h.hearingDate)));

  const handleSaved = (h: Hearing) => setHearings((prev) => [...prev, h]);
  const handleUpdate = (updated: Hearing) =>
    setHearings((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));

  // ── Loading ──────────────────────────────────────────────────────────────
  if (authStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <p className="text-xs text-slate-500">Loading hearings…</p>
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
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Next hearing days label ───────────────────────────────────────────────
  const daysLabel = nextHearing
    ? (() => {
        const d = differenceInDays(new Date(nextHearing.hearingDate), new Date());
        if (d === 0) return "Today";
        if (d === 1) return "Tomorrow";
        return `in ${d} days`;
      })()
    : null;

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Link href="/dashboard/user" className="hover:text-slate-300 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/dashboard/case/${caseId}`}
            className="hover:text-slate-300 transition-colors"
          >
            Case Room
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">Hearings</span>
        </div>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {caseMeta?.caseNumber && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-slate-400"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Hash className="w-3 h-3" />
                  {caseMeta.caseNumber}
                </span>
              )}
              {caseMeta?.caseType && (
                <span className="text-xs text-slate-500 font-medium">{caseMeta.caseType}</span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              {caseMeta?.title ?? "Case Hearings"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {sorted.length} hearing{sorted.length !== 1 ? "s" : ""} on record
            </p>
          </div>

          {isAdvocate && (
            <button
              id="add-hearing-btn"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add Hearing
            </button>
          )}
        </div>

        {/* ── Next Hearing hero banner ──────────────────────────────────── */}
        {nextHearing ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(139,92,246,0.06) 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow: "0 0 60px rgba(124,58,237,0.08)",
            }}
          >
            {/* Banner top strip */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #7C3AED, #8B5CF6, #A78BFA)" }}
            />
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  Next Hearing {daysLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xl md:text-2xl font-black text-white leading-tight">
                    {nextHearing.courtName}
                    {nextHearing.courtNumber && (
                      <span className="text-purple-300">, Court No. {nextHearing.courtNumber}</span>
                    )}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {format(new Date(nextHearing.hearingDate), "EEEE, dd MMMM yyyy")} &middot;{" "}
                    {nextHearing.hearingTime}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Gavel className="w-3.5 h-3.5 text-purple-400" />
                      {purposeLabel(nextHearing.purpose)}
                    </span>
                    {nextHearing.judgeName && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        Hon. {nextHearing.judgeName}
                      </span>
                    )}
                  </div>
                </div>
                <BigCountdown targetISO={nextHearing.hearingDate} />
              </div>
            </div>
          </motion.div>
        ) : (
          <div
            className="rounded-2xl p-5 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Calendar className="w-8 h-8 text-slate-700" />
            <div>
              <p className="text-sm font-bold text-slate-400">No upcoming hearings</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {isAdvocate
                  ? "Use the 'Add Hearing' button to schedule a new date."
                  : "Your advocate will add the next hearing date when scheduled."}
              </p>
            </div>
          </div>
        )}

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Hearing Timeline
          </h2>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Gavel className="w-10 h-10 text-slate-700" />
              <p className="text-sm font-semibold text-slate-500">No hearings on record</p>
              {isAdvocate && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white mt-1"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule first hearing
                </button>
              )}
            </div>
          ) : (
            <div>
              {sorted.map((h, idx) => (
                <HearingCard
                  key={h.id}
                  hearing={h}
                  index={idx}
                  isNext={h.id === nextHearing?.id}
                  userRole={userRole || "USER"}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Reminder settings ─────────────────────────────────────────── */}
        <ReminderSettings prefs={reminderPrefs} onChange={setReminderPrefs} />

        {/* Bottom padding */}
        <div className="h-4" />
      </div>

      {/* ── Add Hearing Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <AddHearingModal
            caseId={caseId as string}
            onClose={() => setShowModal(false)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function HearingsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      }
    >
      <HearingsPage />
    </Suspense>
  );
}
