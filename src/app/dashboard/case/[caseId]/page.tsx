"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Gavel,
  FileText,
  Lock,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Upload,
  Eye,
  EyeOff,
  Building2,
  User,
  Briefcase,
  Bell,
  Hash,
  ArrowUpRight,
  Timer,
  Shield,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow, isPast, differenceInDays } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────
interface Party {
  id: string;
  role: string;
  status: string;
  user: { id: string; name: string | null; email: string };
  lawyer?: { name: string; specialization: string; city: string } | null;
}

interface Hearing {
  id: string;
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

interface CourtDoc {
  id: string;
  title: string;
  type: string;
  filedBy: string;
  fileUrl?: string | null;
  isShared: boolean;
  filingDate: string;
  exhibitNumber?: string | null;
}

interface CaseDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  jurisdiction: string;
  category?: string | null;
  caseType?: string | null;
  caseNumber?: string | null;
  courtName?: string | null;
  courtCaseNum?: string | null;
  filingDate?: string | null;
  nextHearingDate?: string | null;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
  advocate?: { name: string; specialization: string } | null;
  caseParties: Party[];
  hearings: Hearing[];
  courtDocuments: CourtDoc[];
}

interface LimitationData {
  caseType: string;
  legalBasis: string;
  description: string;
  filingDeadline: string;
  daysRemaining: number;
  isUrgent: boolean;
  isCritical: boolean;
  isExpired: boolean;
  hasFixedPeriod: boolean;
}

type TabId = "timeline" | "shared" | "private";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso?: string | null) =>
  iso ? format(new Date(iso), "dd MMM yyyy") : "—";

const fmtDateTime = (iso?: string | null, time?: string) =>
  iso ? `${format(new Date(iso), "EEEE, dd MMM yyyy")}${time ? ` · ${time}` : ""}` : "—";

function purposeLabel(p: string) {
  const map: Record<string, string> = {
    FIRST_HEARING: "First Hearing",
    EVIDENCE: "Evidence Recording",
    ARGUMENTS: "Arguments",
    JUDGMENT: "Judgment",
    ADJOURNED: "Adjourned",
  };
  return map[p] || p;
}

function outcomeLabel(o?: string | null) {
  if (!o) return null;
  const map: Record<string, { label: string; color: string }> = {
    ADJOURNED: { label: "Adjourned", color: "#F59E0B" },
    ARGUED: { label: "Argued", color: "#8B5CF6" },
    ORDER_RESERVED: { label: "Order Reserved", color: "#06B6D4" },
    JUDGMENT_PASSED: { label: "Judgment Passed", color: "#10B981" },
  };
  return map[o] || null;
}

function docTypeLabel(t: string) {
  const map: Record<string, string> = {
    COMPLAINT: "Complaint",
    WRITTEN_STATEMENT: "Written Statement",
    AFFIDAVIT: "Affidavit",
    EVIDENCE: "Evidence",
    VAKALATNAMA: "Vakalatnama",
    LEGAL_NOTICE: "Legal Notice",
    ORDER: "Court Order",
  };
  return map[t] || t;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [past, setPast] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const gap = target - now;
      if (gap <= 0) { setPast(true); return; }
      setDiff({
        days: Math.floor(gap / (1000 * 60 * 60 * 24)),
        hours: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((gap % (1000 * 60)) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (past) {
    return (
      <span className="text-xs text-slate-500 font-medium">Hearing passed</span>
    );
  }

  const units = [
    { label: "Days", value: diff.days },
    { label: "Hrs", value: diff.hours },
    { label: "Min", value: diff.minutes },
    { label: "Sec", value: diff.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div
            className="w-12 h-10 rounded-xl flex items-center justify-center text-base font-extrabold text-blue-700 bg-white border border-blue-200 shadow-xs tabular-nums"
          >
            {String(u.value).padStart(2, "0")}
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Timeline ─────────────────────────────────────────────────────────────
function TimelineTab({ hearings }: { hearings: Hearing[] }) {
  const sorted = [...hearings].sort(
    (a, b) => new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <Calendar className="w-10 h-10 text-slate-700" />
        <p className="text-sm font-semibold text-slate-500">No hearings scheduled yet</p>
        <p className="text-xs text-slate-600">Hearings will appear here once added by counsel.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[19px] top-0 bottom-0 w-px"
        style={{ background: "#E2E8F0" }}
      />

      <div className="space-y-1">
        {sorted.map((h, idx) => {
          const isUpcoming = !isPast(new Date(h.hearingDate));
          const outcome = outcomeLabel(h.outcome);
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-4 pb-5"
            >
              {/* Dot */}
              <div className="relative flex-shrink-0 mt-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center z-10 relative"
                  style={{
                    background: isUpcoming
                      ? "#EFF6FF"
                      : "#F8FAFC",
                    border: isUpcoming
                      ? "2px solid #3B82F6"
                      : "2px solid #E2E8F0",
                  }}
                >
                  <Gavel className={`w-4 h-4 ${isUpcoming ? "text-blue-600" : "text-slate-400"}`} />
                </div>
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-xl p-4 shadow-xs"
                style={{
                  background: isUpcoming
                    ? "#EFF6FF"
                    : "#F8FAFC",
                  border: isUpcoming
                    ? "1px solid #BFDBFE"
                    : "1px solid #E2E8F0",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{purposeLabel(h.purpose)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{fmtDateTime(h.hearingDate, h.hearingTime)}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {isUpcoming && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}
                      >
                        Upcoming
                      </span>
                    )}
                    {outcome && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${outcome.color}15`, color: outcome.color, border: `1px solid ${outcome.color}30` }}
                      >
                        {outcome.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-3 h-3" />
                    <span>{h.courtName}{h.courtNumber ? ` · Court ${h.courtNumber}` : ""}</span>
                  </div>
                  {h.judgeName && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3 h-3" />
                      <span>Hon. {h.judgeName}</span>
                    </div>
                  )}
                  {h.adjournReason && (
                    <div className="col-span-2 flex items-start gap-1.5 text-amber-500/70 mt-1">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>Adjourn reason: {h.adjournReason}</span>
                    </div>
                  )}
                  {h.nextDate && (
                    <div className="col-span-2 flex items-center gap-1.5 text-emerald-500/70">
                      <Calendar className="w-3 h-3" />
                      <span>Next date: {fmtDate(h.nextDate)}</span>
                    </div>
                  )}
                  {h.notes && (
                    <div className="col-span-2 mt-1 text-slate-600 italic">"{h.notes}"</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Shared documents ─────────────────────────────────────────────────────
function SharedDocsTab({ docs }: { docs: CourtDoc[] }) {
  const sharedDocs = docs.filter((d) => d.isShared);

  if (sharedDocs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <FileText className="w-10 h-10 text-slate-700" />
        <p className="text-sm font-semibold text-slate-500">No shared documents yet</p>
        <p className="text-xs text-slate-600">Pleadings and orders shared by both parties will appear here.</p>
      </div>
    );
  }

  const iconColor: Record<string, string> = {
    COMPLAINT: "#EF4444",
    WRITTEN_STATEMENT: "#8B5CF6",
    AFFIDAVIT: "#F59E0B",
    EVIDENCE: "#06B6D4",
    VAKALATNAMA: "#10B981",
    LEGAL_NOTICE: "#F97316",
    ORDER: "#EC4899",
  };

  return (
    <div className="space-y-2">
      {sharedDocs.map((doc, idx) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:bg-slate-50 shadow-xs"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${iconColor[doc.type] || "#3B82F6"}15` }}
          >
            <FileCheck className="w-4 h-4" style={{ color: iconColor[doc.type] || "#3B82F6" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-500 font-medium">
                {docTypeLabel(doc.type)}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] text-slate-500">
                Filed by {doc.filedBy === "COURT" ? "Court" : doc.filedBy.charAt(0) + doc.filedBy.slice(1).toLowerCase()}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] text-slate-500">{fmtDate(doc.filingDate)}</span>
            </div>
          </div>
          {doc.exhibitNumber && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
              style={{ background: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" }}
            >
              {doc.exhibitNumber}
            </span>
          )}
          {doc.fileUrl ? (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0"
              title="View document"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : (
            <div className="p-1.5 flex-shrink-0 text-slate-300" title="No file attached">
              <Eye className="w-4 h-4" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Tab: Private workspace ────────────────────────────────────────────────────
function PrivateTab({
  docs,
  userId,
  userRole,
}: {
  docs: CourtDoc[];
  userId: string;
  userRole: string;
}) {
  // Private docs = not shared AND filed by your party role
  const partyRole = userRole === "DEFENDANT" ? "DEFENDANT" : "PLAINTIFF";
  const privateDocs = docs.filter((d) => !d.isShared && d.filedBy === partyRole);

  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200"
      >
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong className="text-amber-950 font-semibold">Private Workspace</strong> — Only you (
          {partyRole.charAt(0) + partyRole.slice(1).toLowerCase()}) can see these documents. The
          opposing party cannot access them until you choose to share.
        </p>
      </div>

      {privateDocs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Shield className="w-9 h-9 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Your private workspace is empty</p>
          <p className="text-xs text-slate-400 max-w-xs">
            Documents you draft or upload that are not yet shared with the opposing party will appear
            here.
          </p>
          <button
            className="btn-primary mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload a Document
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {privateDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 border border-amber-200"
              >
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {docTypeLabel(doc.type)} · {fmtDate(doc.filingDate)}
                </p>
              </div>
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function CaseRoomPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [caseData, setCaseData] = useState<CaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limitation, setLimitation] = useState<LimitationData | null>(null);

  const userId = (session?.user as any)?.id as string | undefined;
  const userRole = (session?.user as any)?.role as string | undefined;

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?next=/dashboard/case/${caseId}`);
    }
  }, [authStatus, caseId, router]);

  const fetchCase = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to load case");
        return;
      }
      setCaseData(await res.json());
      // Fetch limitation period in parallel (silently, non-blocking)
      fetch(`/api/cases/limitation?caseId=${caseId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((lim) => { if (lim && !lim.error) setLimitation(lim); })
        .catch(() => {/* no limitation set — silent */});
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (authStatus === "authenticated") fetchCase();
  }, [authStatus, fetchCase]);

  // ── Tabs config ──────────────────────────────────────────────────────────
  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    {
      id: "timeline",
      label: "Timeline",
      icon: Calendar,
      count: caseData?.hearings?.length,
    },
    {
      id: "shared",
      label: "Shared Documents",
      icon: FileText,
      count: caseData?.courtDocuments?.filter((d) => d.isShared).length,
    },
    {
      id: "private",
      label: "Private Workspace",
      icon: Lock,
    },
  ];

  // ── Next hearing ─────────────────────────────────────────────────────────
  const upcomingHearing = caseData?.hearings
    ?.filter((h) => !isPast(new Date(h.hearingDate)))
    .sort((a, b) => new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime())[0];

  const daysToHearing = upcomingHearing
    ? differenceInDays(new Date(upcomingHearing.hearingDate), new Date())
    : null;

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <p className="text-xs text-slate-500">Authenticating…</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") return null;

  // ── Case loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <p className="text-xs text-slate-500">Loading case room…</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <p className="text-base font-bold text-white">Unable to Load Case</p>
        <p className="text-xs text-slate-400">{error || "Case not found."}</p>
        <Link
          href="/dashboard/user"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  // ── Parties ──────────────────────────────────────────────────────────────
  const plaintiff = caseData.caseParties?.find((p) => p.role === "PLAINTIFF") || {
    role: "PLAINTIFF",
    user: caseData.user,
    lawyer: caseData.advocate,
    status: "ACTIVE",
  };
  const defendant = caseData.caseParties?.find((p) => p.role === "DEFENDANT");

  const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: "Active", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    INTAKE: { label: "Under Intake", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    PENDING: { label: "Pending", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    CLOSED: { label: "Closed", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  };
  const st = statusCfg[caseData.status] || statusCfg.ACTIVE;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/user"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-700 font-medium">Case Room</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
            {caseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ color: st.color, background: st.bg, border: `1px solid ${st.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
              {st.label}
            </span>
            {caseData.caseNumber && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200"
              >
                <Hash className="w-3 h-3" />
                {caseData.caseNumber}
              </span>
            )}
            {caseData.caseType && (
              <span className="text-xs text-slate-500 font-medium">{caseData.caseType}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="case-refresh-btn"
            onClick={fetchCase}
            className="btn-ghost flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
          >
            Refresh
          </button>
          <button
            id="case-notify-btn"
            className="btn-primary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </button>
        </div>
      </div>

      {/* ── Upcoming hearing countdown ──────────────────────────────────────── */}
      {upcomingHearing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50/80 via-blue-50/40 to-white border border-indigo-200 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Next Hearing
                </span>
                {daysToHearing !== null && daysToHearing <= 7 && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: daysToHearing <= 1 ? "#FEF2F2" : "#FFFBEB",
                      color: daysToHearing <= 1 ? "#DC2626" : "#D97706",
                      border: `1px solid ${daysToHearing <= 1 ? "#FCA5A5" : "#FDE68A"}`,
                    }}
                  >
                    {daysToHearing === 0 ? "Today!" : `${daysToHearing}d away`}
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-slate-900">
                {purposeLabel(upcomingHearing.purpose)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {fmtDateTime(upcomingHearing.hearingDate, upcomingHearing.hearingTime)}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {upcomingHearing.courtName}
                  {upcomingHearing.courtNumber && ` · Court ${upcomingHearing.courtNumber}`}
                </span>
                {upcomingHearing.judgeName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Hon. {upcomingHearing.judgeName}
                  </span>
                )}
              </div>
            </div>
            <CountdownTimer targetDate={upcomingHearing.hearingDate} />
          </div>
        </motion.div>
      )}

      {/* ── Limitation Period Countdown Banner ──────────────────────────────── */}
      {limitation && limitation.hasFixedPeriod && (() => {
        const dr = limitation.daysRemaining;
        const expired = limitation.isExpired;
        const critical = !expired && dr < 7;
        const urgent = !expired && !critical && dr < 30;
        const nearMid = !expired && !critical && !urgent && dr < 90;

        const color = expired || critical
          ? { text: "#f87171", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.35)", glow: "rgba(239,68,68,0.12)", label: expired ? "DEADLINE EXPIRED" : "CRITICAL DEADLINE", labelColor: "#f87171" }
          : urgent
          ? { text: "#fbbf24", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.35)", glow: "rgba(245,158,11,0.08)", label: "URGENT DEADLINE", labelColor: "#fbbf24" }
          : nearMid
          ? { text: "#fbbf24", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", glow: "transparent", label: "FILING DEADLINE", labelColor: "#fbbf24" }
          : { text: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", glow: "transparent", label: "FILING DEADLINE", labelColor: "#34d399" };

        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: color.bg,
              border: `1px solid ${color.border}`,
              boxShadow: `0 0 40px ${color.glow}`,
            }}
          >
            {/* Top strip */}
            <div
              className="h-1 w-full"
              style={{
                background: expired || critical
                  ? "linear-gradient(90deg, #EF4444, #F87171)"
                  : urgent
                  ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                  : nearMid
                  ? "linear-gradient(90deg, #F59E0B80, #FBBF2480)"
                  : "linear-gradient(90deg, #10B981, #34D399)",
              }}
            />
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0${
                    (expired || critical) ? " animate-pulse" : ""
                  }`}
                  style={{
                    background: `${color.text}18`,
                    border: `1px solid ${color.text}40`,
                  }}
                >
                  <AlertTriangle className="w-4.5 h-4.5" style={{ color: color.text }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest${
                        (expired || critical) ? " animate-pulse" : ""
                      }`}
                      style={{ color: color.labelColor }}
                    >
                      {color.label}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {expired
                      ? "Filing period has expired"
                      : critical
                      ? `File within ${dr} day${dr === 1 ? "" : "s"} — rights at risk`
                      : urgent
                      ? `Only ${dr} days left to file`
                      : `${dr} days remaining to file`}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {limitation.legalBasis} &middot; Deadline:{" "}
                    {format(new Date(limitation.filingDeadline), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {!expired && (() => {
                const total =
                  limitation.caseType === "PROPERTY_DISPUTE" ? 3650
                  : limitation.caseType === "CORPORATE_CONTRACT" || limitation.caseType === "LABOUR_DISPUTE" ? 1095
                  : limitation.caseType === "CONSUMER_GRIEVANCE" ? 730
                  : limitation.caseType === "CRIMINAL_CYBER" ? 180
                  : limitation.caseType === "CHEQUE_BOUNCE" ? 30
                  : 730;
                const pct = Math.min(100, Math.max(0, Math.round(((total - dr) / total) * 100)));
                return (
                  <div className="w-full sm:w-48">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Time used</span>
                      <span className="font-bold" style={{ color: color.text }}>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: expired || critical
                            ? "linear-gradient(90deg, #EF4444, #F87171)"
                            : urgent
                            ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                            : "linear-gradient(90deg, #10B981, #34D399)",
                        }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        );
      })()}

      {/* ── Case meta + Parties ─────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* Case meta */}
        <div
          className="md:col-span-1 rounded-2xl p-5 space-y-3 bg-white border border-slate-200 shadow-sm"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Details</p>
          {[
            { label: "Jurisdiction", value: caseData.jurisdiction, icon: MapPin },
            { label: "Category", value: caseData.category || "—", icon: Briefcase },
            { label: "Filed On", value: fmtDate(caseData.filingDate), icon: Calendar },
            { label: "Court", value: caseData.courtName || "—", icon: Building2 },
            { label: "Court Case No.", value: caseData.courtCaseNum || "—", icon: Hash },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Parties */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
          {/* Plaintiff */}
          <div
            className="rounded-2xl p-4 space-y-3 bg-red-50/50 border border-red-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200"
              >
                PLAINTIFF
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-xs">
                {(plaintiff.user?.name || plaintiff.user?.email || "P")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {plaintiff.user?.name || plaintiff.user?.email?.split("@")[0] || "Plaintiff"}
                </p>
                <p className="text-[10px] text-slate-500">{plaintiff.user?.email}</p>
              </div>
            </div>
            {plaintiff.lawyer && (
              <div
                className="rounded-xl p-2.5 bg-white border border-red-100"
              >
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Represented by
                </p>
                <p className="text-xs font-semibold text-slate-900">{plaintiff.lawyer.name}</p>
                <p className="text-[10px] text-slate-500">{plaintiff.lawyer.specialization}</p>
              </div>
            )}
          </div>

          {/* Defendant */}
          <div
            className="rounded-2xl p-4 space-y-3 bg-purple-50/50 border border-purple-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200"
              >
                DEFENDANT
              </span>
            </div>
            {defendant ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-xs">
                    {(defendant.user?.name || defendant.user?.email || "D")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {defendant.user?.name || defendant.user?.email?.split("@")[0] || "Defendant"}
                    </p>
                    <p className="text-[10px] text-slate-500">{defendant.user?.email}</p>
                  </div>
                </div>
                {defendant.lawyer && (
                  <div
                    className="rounded-xl p-2.5 bg-white border border-purple-100"
                  >
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Represented by
                    </p>
                    <p className="text-xs font-semibold text-slate-900">{defendant.lawyer.name}</p>
                    <p className="text-[10px] text-slate-500">{defendant.lawyer.specialization}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-3 text-center">
                <User className="w-7 h-7 text-slate-300" />
                <p className="text-xs text-slate-500">Awaiting defendant</p>
                <p className="text-[10px] text-slate-400">Invite not yet accepted</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div>
        {/* Tab bar */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-4 bg-slate-100 border border-slate-200"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
                style={
                  active
                    ? {
                        background: "#FFFFFF",
                        color: "#2563EB",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }
                    : { color: "#64748B" }
                }
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={
                      active
                        ? { background: "#EFF6FF", color: "#1D4ED8" }
                        : { background: "#E2E8F0", color: "#64748B" }
                    }
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div
          className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {activeTab === "timeline" && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TimelineTab hearings={caseData.hearings || []} />
              </motion.div>
            )}
            {activeTab === "shared" && (
              <motion.div key="shared" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SharedDocsTab docs={caseData.courtDocuments || []} />
              </motion.div>
            )}
            {activeTab === "private" && (
              <motion.div key="private" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PrivateTab
                  docs={caseData.courtDocuments || []}
                  userId={userId || ""}
                  userRole={userRole || "USER"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function CaseRoomPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full py-20">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      }
    >
      <CaseRoomPage />
    </Suspense>
  );
}
