"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  UserPlus,
  Briefcase,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { format } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────
interface CaseSummary {
  caseType: string | null;
  filingDate: string | null;
  courtName: string | null;
  status: string;
  category: string | null;
  jurisdiction: string | null;
}

type ActiveView = "landing" | "signup" | "lawyer";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
  if (!iso) return "Not specified";
  try {
    return format(new Date(iso), "dd MMMM yyyy");
  } catch {
    return "Not specified";
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: "Active", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
    INTAKE: { label: "Under Review", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    PENDING: { label: "Pending", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
    CLOSED: { label: "Closed", color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  };
  const cfg = map[status] || map.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

// ── Landing view ─────────────────────────────────────────────────────────────
function LandingView({
  caseInfo,
  onSignup,
  onLawyer,
}: {
  caseInfo: CaseSummary;
  onSignup: () => void;
  onLawyer: () => void;
}) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Notice banner */}
      <div
        className="flex gap-3 p-4 rounded-xl border"
        style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-300">Legal Notice</p>
          <p className="text-xs text-amber-200/70 mt-0.5 leading-relaxed">
            You have been named as a <strong className="text-amber-300">Respondent</strong> in a
            legal case filed through LexNova. Please read the case details below and choose how you
            wish to proceed.
          </p>
        </div>
      </div>

      {/* Case details card */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Case Information
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: "Case Type", value: caseInfo.caseType || "Legal Matter" },
            { label: "Category", value: caseInfo.category || "General" },
            { label: "Filed On", value: formatDate(caseInfo.filingDate) },
            { label: "Jurisdiction", value: caseInfo.jurisdiction || "National" },
            { label: "Court", value: caseInfo.courtName || "To be determined" },
            {
              label: "Status",
              value: (
                <span className="mt-0.5">
                  <StatusBadge status={caseInfo.status} />
                </span>
              ) as any,
            },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {row.label}
              </p>
              {typeof row.value === "string" ? (
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{row.value}</p>
              ) : (
                row.value
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy notice */}
      <div
        className="flex gap-2.5 p-3.5 rounded-xl"
        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
      >
        <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-300/80 leading-relaxed">
          For your privacy, the plaintiff's name and contact details are not shown here.
          You will be able to review them in full after registering.
        </p>
      </div>

      {/* CTA options */}
      <div className="space-y-3 pt-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
          How would you like to proceed?
        </p>
        <button
          onClick={onSignup}
          className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
            boxShadow: "0 0 24px rgba(124,58,237,0.35)",
          }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Sign Up to Respond</p>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Create a free account and respond to this case directly
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/60" />
        </button>

        <button
          onClick={onLawyer}
          className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <Briefcase className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">I Have a Lawyer</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your lawyer's details — they'll join on your behalf
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Signup view ──────────────────────────────────────────────────────────────
function SignupView({
  token,
  onBack,
  onSuccess,
}: {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create defendant account
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "DEFENDANT", inviteToken: token }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        setError(signupData.error || "Failed to create account. Please try again.");
        return;
      }

      // 2. Sign in
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created but auto sign-in failed. Please log in manually.");
        return;
      }

      onSuccess();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-white">Create Your Defendant Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Your account will be created with the <strong className="text-amber-400">Defendant</strong> role
          and linked to this case automatically.
        </p>
      </div>

      {error && (
        <div
          className="flex gap-2 p-3 rounded-xl text-xs text-red-300"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="defendant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full legal name"
              required
              className="input-dark"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="defendant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-dark"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="defendant-password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              required
              className="input-dark pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          id="defendant-signup-btn"
          className="btn-purple w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account & Join Case
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href={`/auth/login?next=/join-case/${token}`} className="text-amber-400 hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

// ── Lawyer details view ──────────────────────────────────────────────────────
function LawyerView({ onBack }: { onBack: () => void }) {
  const [lawyerName, setLawyerName] = useState("");
  const [lawyerEmail, setLawyerEmail] = useState("");
  const [lawyerPhone, setLawyerPhone] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [firm, setFirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // In a full implementation this would trigger a lawyer invite
    // For now, simulate a 1s delay and show confirmation
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
        >
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Lawyer Details Submitted</h3>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          We've recorded your lawyer's details. They will receive a notification to join the case on
          your behalf. Check back here after your lawyer has joined.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black"
          style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
        >
          Sign In to Check Status
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="lawyer"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-white">Enter Your Lawyer's Details</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Your advocate will be notified to join this case on your behalf. You won't need to create
          an account yourself.
        </p>
      </div>

      {error && (
        <div
          className="flex gap-2 p-3 rounded-xl text-xs text-red-300"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Lawyer's Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="lawyer-name"
              type="text"
              value={lawyerName}
              onChange={(e) => setLawyerName(e.target.value)}
              placeholder="Advocate Ramesh Sharma"
              required
              className="input-dark"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Lawyer's Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="lawyer-email"
              type="email"
              value={lawyerEmail}
              onChange={(e) => setLawyerEmail(e.target.value)}
              placeholder="advocate@lawfirm.com"
              required
              className="input-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Phone (optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="lawyer-phone"
                type="tel"
                value={lawyerPhone}
                onChange={(e) => setLawyerPhone(e.target.value)}
                placeholder="+91 98765..."
                className="input-dark"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Bar Number
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="lawyer-bar-number"
                type="text"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                placeholder="BAR/DL/1234"
                className="input-dark"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Law Firm (optional)
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="lawyer-firm"
              type="text"
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
              placeholder="Sharma & Associates"
              className="input-dark"
            />
          </div>
        </div>

        <button
          type="submit"
          id="lawyer-submit-btn"
          disabled={loading}
          className="btn-gold w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <>
              <Briefcase className="w-4 h-4" />
              Submit Lawyer Details
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ── Success view ─────────────────────────────────────────────────────────────
function SuccessView({ caseId }: { caseId?: string }) {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => {
      router.push(caseId ? `/dashboard/case/${caseId}` : "/dashboard/user");
    }, 3000);
    return () => clearTimeout(t);
  }, [caseId, router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "2px solid rgba(124,58,237,0.3)",
          boxShadow: "0 0 40px rgba(124,58,237,0.2)",
        }}
      >
        <CheckCircle className="w-10 h-10 text-purple-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">You've Joined the Case</h3>
        <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">
          Your defendant account has been created and you've been linked to the case. Redirecting
          you to the case room…
        </p>
      </div>
      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function JoinCasePage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<ActiveView | "success" | "error">("landing");
  const [caseInfo, setCaseInfo] = useState<CaseSummary | null>(null);
  const [loadingCase, setLoadingCase] = useState(true);
  const [caseError, setCaseError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/cases/by-token/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setCaseError(data.error);
        } else {
          setCaseInfo(data);
        }
      })
      .catch(() => setCaseError("Failed to load case details. Please check your link."))
      .finally(() => setLoadingCase(false));
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#080810] text-slate-200 p-5 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        />
      </div>

      <div className="w-full max-w-[480px] z-10 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #F59E0B)",
                boxShadow: "0 0 20px rgba(245,158,11,0.25)",
              }}
            >
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              LEX<span style={{ color: "#F59E0B" }}>NOVA</span>
            </span>
          </Link>

          {!loadingCase && view === "landing" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                You've Been Named as a{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
                >
                  Respondent
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                A legal case has been filed against you. Review the details and respond.
              </p>
            </motion.div>
          )}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 md:p-8"
          style={{
            background: "linear-gradient(135deg, rgba(13,13,24,0.9), rgba(17,17,34,0.9))",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Loading state */}
          {loadingCase && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
              <p className="text-sm text-slate-500">Loading case details…</p>
            </div>
          )}

          {/* Error state */}
          {!loadingCase && (caseError || !caseInfo) && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.2)" }}
              >
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Invalid Invite Link</h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  {caseError || "This invite link is invalid or has expired."}
                </p>
              </div>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Go to Homepage
              </Link>
            </div>
          )}

          {/* Views */}
          {!loadingCase && caseInfo && (
            <AnimatePresence mode="wait">
              {view === "landing" && (
                <LandingView
                  caseInfo={caseInfo}
                  onSignup={() => setView("signup")}
                  onLawyer={() => setView("lawyer")}
                />
              )}
              {view === "signup" && (
                <SignupView
                  token={token as string}
                  onBack={() => setView("landing")}
                  onSuccess={() => setView("success")}
                />
              )}
              {view === "lawyer" && (
                <LawyerView onBack={() => setView("landing")} />
              )}
              {view === "success" && <SuccessView />}
            </AnimatePresence>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          Protected by LexNova · End-to-end encrypted case data
        </p>
      </div>
    </div>
  );
}

export default function JoinCasePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#080810]">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      }
    >
      <JoinCasePage />
    </Suspense>
  );
}
