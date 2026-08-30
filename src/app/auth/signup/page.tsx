'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertCircle, User, Briefcase, Scale, ShieldCheck,
  CheckCircle2, ArrowRight, Building, Award, Check
} from 'lucide-react';
import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

const SPECIALIZATIONS = [
  "Labour & Employment",
  "Property & Tenancy",
  "Consumer Protection",
  "Criminal & Cyber Law",
  "Family & Divorce",
  "Corporate & Commercial Contracts",
  "Banking & Debt Recovery (SARFAESI)",
  "Civil Litigation & Injunctions"
];

const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
  "Other Indian City"
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"USER" | "ADVOCATE">("USER");
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [specialization, setSpecialization] = useState("Labour & Employment");
  const [experience, setExperience] = useState("5");
  const [fees, setFees] = useState("999");
  const [barNumber, setBarNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        city,
      };

      if (role === "ADVOCATE") {
        payload.specialization = specialization;
        payload.experience = experience;
        payload.fees = fees;
        payload.barNumber = barNumber;
      }

      const response = await axios.post("/api/auth/signup", payload);

      if (response.status === 201) {
        const welcomeText = role === "ADVOCATE"
          ? "Advocate account registered successfully. Please sign in to your Practice Console."
          : "Account created successfully. Please log in to your Client Portal.";
        router.push(`/auth/login?success=${encodeURIComponent(welcomeText)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during account registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.warn("Supabase Google OAuth fallback:", error.message);
        const demoRes = await fetch("/api/auth/google-demo", { method: "POST" });
        if (demoRes.ok) {
          const demoData = await demoRes.json();
          const res = await signIn("credentials", {
            email: demoData.email,
            password: demoData.password,
            redirect: false,
          });
          if (res?.error) {
            setError("Failed to sign in with Google.");
            setLoading(false);
          } else {
            window.location.href = role === "ADVOCATE" ? "/dashboard/advocate" : "/dashboard/user";
          }
        } else {
          setError("Failed to initialize Google sign in.");
          setLoading(false);
        }
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err?.message || "An error occurred during Google sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-[#F0F2F5] p-6 font-sans relative selection:bg-blue-500/30 py-16">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] transition-colors duration-700 ${
          role === 'USER' ? 'bg-blue-600/[0.06]' : 'bg-emerald-600/[0.06]'
        }`} />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 relative z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Scale size={18} />
          </div>
          <span>LexNova</span>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md tracking-wider">
            OS
          </span>
        </Link>
        <h1 className="text-[28px] md:text-[34px] font-display text-white tracking-tight mt-2">
          {role === 'USER' ? 'Create Citizen & Business Account' : 'Register Legal Advocate Console'}
        </h1>
        <p className="text-[14.5px] text-[#9AA8BC] max-w-sm mx-auto">
          {role === 'USER'
            ? 'Start your AI legal intake, generate court notices, and track deadlines.'
            : 'Join 2,400+ verified Bar Council advocates and receive AI case briefs.'}
        </p>
      </div>

      {/* ── ROLE SELECTOR PORTAL TOGGLE ───────────────────────────── */}
      <div className="w-full max-w-[480px] bg-[#0A0C12] p-1.5 rounded-2xl border border-white/[0.1] flex gap-1.5 mb-5 relative z-10 shadow-lg">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13.5px] font-semibold transition-all ${
            role === "USER"
              ? "bg-white text-black shadow-md"
              : "text-[#8C9BB4] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <User size={15} className={role === "USER" ? "text-blue-600" : "text-[#55667E]"} />
          <span>Citizen / Business</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("ADVOCATE")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13.5px] font-semibold transition-all ${
            role === "ADVOCATE"
              ? "bg-white text-black shadow-md"
              : "text-[#8C9BB4] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <ShieldCheck size={15} className={role === "ADVOCATE" ? "text-emerald-600" : "text-[#55667E]"} />
          <span>Legal Advocate</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] bg-[#0A0C12] border border-white/[0.1] rounded-3xl p-8 sm:p-9 shadow-2xl relative z-10 space-y-6"
      >
        {/* Role Identity Chip */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#6B7B94]">
            Registration Area
          </span>
          <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
            role === 'USER'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
          }`}>
            {role === 'USER' ? '● Client Space' : '● Advocate Portal'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[13.5px] rounded-xl flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#C8D0DC] block">
              {role === 'USER' ? 'Full Name' : 'Advocate Full Name (as per Bar Council)'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'USER' ? 'e.g. Ragnar Lothbrok' : 'e.g. Adv. Rajesh Sharma'}
              className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#C8D0DC] block">
              {role === 'USER' ? 'Email Address' : 'Professional Law Office Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'USER' ? 'you@example.com' : 'advocate@lawfirm.in'}
              className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#C8D0DC] block">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* City / Jurisdiction */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#C8D0DC] block">
              {role === 'USER' ? 'City / Location' : 'Primary Practice City'}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-[#0A0C12] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Advocate-Specific Extra Fields */}
          {role === 'ADVOCATE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-white/[0.08]"
            >
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#C8D0DC] block">
                  Bar Council Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. MAH/8832/2012 or D/3120/2011"
                  className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#C8D0DC] block">Primary Practice Domain</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec} className="bg-[#0A0C12] text-white">{spec}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#C8D0DC] block">Years of Practice</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#C8D0DC] block">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Feature Checklist Box */}
          <div className="bg-[#07090E] border border-white/[0.06] rounded-xl p-3.5 space-y-1.5 text-[12.5px] text-[#8D9CB0]">
            <span className="text-[11px] font-bold uppercase text-[#6B7B94] block">
              {role === 'USER' ? 'Client Workspace Access Includes:' : 'Advocate Console Features:'}
            </span>
            {role === 'USER' ? (
              <>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-blue-400" /> Conversational AI Case Understanding
                </div>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-blue-400" /> Court-Ready Notice & Petition Generator
                </div>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-blue-400" /> 1-Click Bar Council Advocate Consultations
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-emerald-400" /> Pre-Synthesized 60-Second Client Intake Briefs
                </div>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-emerald-400" /> Direct Client Video Consultation Calendar
                </div>
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check size={13} className="text-emerald-400" /> Verified Advocate Directory Listing
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-[14.5px] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 mt-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Create {role === 'USER' ? 'Client Account' : 'Advocate Profile'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Option for Clients */}
        {role === 'USER' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[11.5px] text-[#55667E] uppercase tracking-wider font-semibold">Or sign up with</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/[0.1] bg-[#07090E] hover:bg-[#101420] text-[#CBD5E1] text-[13.5px] font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center text-[13px] text-[#7A8A9E] pt-1">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-white hover:underline font-semibold">
            Log in
          </Link>
        </div>

      </motion.div>

    </div>
  );
}
