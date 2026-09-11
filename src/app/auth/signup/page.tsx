'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertCircle, User, Scale, ShieldCheck,
  CheckCircle2, ArrowRight, Check, Sparkles
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role')?.toUpperCase();
      if (roleParam === 'ADVOCATE' || roleParam === 'LAWYER') {
        setRole('ADVOCATE');
      }
    }
  }, []);

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
      await supabase.auth.signOut();
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
        setError(error.message || "Failed to sign in with Google.");
        setLoading(false);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during Google sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative py-16 overflow-hidden" style={{ background: '#05060A', color: '#F0F2FF' }}>
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shadow-lg shadow-indigo-500/20" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
            LN
          </div>
          <span className="font-mono text-[22px] font-extrabold tracking-[0.16em] text-white group-hover:text-indigo-400 transition-colors">
            LEXNOV\A
          </span>
        </Link>
        <h1 className="text-[26px] md:text-[32px] font-bold text-white tracking-tight mt-1">
          {role === 'USER' ? 'Create Client & Enterprise Account' : 'Register Verified Advocate Console'}
        </h1>
        <p className="text-[14px] max-w-sm mx-auto" style={{ color: '#8F96B3' }}>
          {role === 'USER'
            ? 'Start your AI legal intake, generate court notices, and track limitation deadlines.'
            : 'Join verified legal practitioners receiving pre-triaged client briefs.'}
        </p>
      </div>

      {/* Role Toggle */}
      <div className="w-full max-w-[480px] p-1.5 rounded-2xl flex gap-1.5 mb-5 relative z-10" style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <button
          type="button"
          onClick={() => setRole("USER")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={role === "USER" ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            border: '1px solid rgba(99,102,241,0.4)'
          } : {
            color: '#8F96B3'
          }}
        >
          <User size={15} />
          <span>Citizen / Business</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("ADVOCATE")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={role === "ADVOCATE" ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            border: '1px solid rgba(99,102,241,0.4)'
          } : {
            color: '#8F96B3'
          }}
        >
          <ShieldCheck size={15} />
          <span>Legal Advocate</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] rounded-3xl p-8 sm:p-9 space-y-6 relative z-10"
        style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
            Registration Workspace
          </span>
          <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#A8AECF' }}>
            {role === 'USER' ? 'Client Space' : 'Advocate Portal'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl text-[13.5px] flex items-center gap-2.5" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>
              {role === 'USER' ? 'Full Name' : 'Advocate Full Name (as per Bar Council)'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'USER' ? 'e.g. Sarah Jenkins' : 'e.g. Adv. Rajesh Sharma'}
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
              style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>
              {role === 'USER' ? 'Email Address' : 'Professional Office Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
              style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
              style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>
              {role === 'USER' ? 'City / Location' : 'Primary Practice City'}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:outline-none transition-colors cursor-pointer"
              style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c} style={{ background: '#0A0B12', color: '#F0F2FF' }}>{c}</option>
              ))}
            </select>
          </div>

          {role === 'ADVOCATE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2"
              style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}
            >
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>
                  Bar Council Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. MAH/8832/2012 or NY/4891024"
                  className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                  style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>Primary Practice Domain</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:outline-none transition-colors cursor-pointer"
                  style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec} style={{ background: '#0A0B12', color: '#F0F2FF' }}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>Years of Practice</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:outline-none transition-colors font-mono"
                    style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium block" style={{ color: '#A8AECF' }}>Consultation Fee (₹/$)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-white focus:outline-none transition-colors font-mono"
                    style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="rounded-2xl p-4 space-y-2 text-[12.5px]" style={{ background: 'rgba(14,16,24,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <span className="text-[11px] font-mono font-bold uppercase block" style={{ color: '#818CF8' }}>
              {role === 'USER' ? 'Client Workspace Access Includes:' : 'Advocate Console Features:'}
            </span>
            {role === 'USER' ? (
              <>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Conversational AI Case Intake &amp; Notice Generator
                </div>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> 50+ Jurisdictions Limitation Clocks
                </div>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Verified Advocate Direct Matching &amp; Escrow
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Pre-Synthesized 60-Second Client Intake Briefs
                </div>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Automated Plaint, Petition &amp; Evidence Drafts
                </div>
                <div className="flex items-center gap-2" style={{ color: '#A8AECF' }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Verified Advocate Directory Profile
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-[14px] font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[13px] pt-1" style={{ color: '#8F96B3' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="hover:underline font-semibold" style={{ color: '#818CF8' }}>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
