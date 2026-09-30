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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative py-16 overflow-hidden bg-[#F8FAFC] text-slate-900">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shadow-md shadow-indigo-500/20 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600">
            <Scale size={20} className="text-white" />
          </div>
          <span className="font-sans text-[22px] font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            LEXNOVA
          </span>
          <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-50/90 via-violet-50/90 to-purple-50/90 text-indigo-700 border border-indigo-200/90 shadow-2xs tracking-widest font-mono">
            <Sparkles size={10} className="text-indigo-600 fill-indigo-500/20" />
            <span>JURIS</span>
          </span>
        </Link>
        <h1 className="text-[26px] md:text-[32px] font-black text-slate-900 tracking-tight mt-1">
          {role === 'USER' ? 'Create Client & Enterprise Account' : 'Register Verified Advocate Console'}
        </h1>
        <p className="text-[14px] max-w-sm mx-auto text-slate-600">
          {role === 'USER'
            ? 'Start your AI legal intake, generate court notices, and track limitation deadlines.'
            : 'Join verified legal practitioners receiving pre-triaged client briefs.'}
        </p>
      </div>

      {/* Role Toggle */}
      <div className="w-full max-w-[480px] p-1.5 rounded-2xl flex gap-1.5 mb-5 relative z-10 bg-white border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
            role === "USER"
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User size={15} />
          <span>Citizen / Business</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("ADVOCATE")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
            role === "ADVOCATE"
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
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
        className="w-full max-w-[480px] rounded-3xl p-8 sm:p-9 space-y-6 relative z-10 bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-150">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700">
            Registration Workspace
          </span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {role === 'USER' ? 'Client Space' : 'Advocate Portal'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl text-[13.5px] flex items-center gap-2.5 bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold block text-slate-700">
              {role === 'USER' ? 'Full Name' : 'Advocate Full Name (as per Bar Council)'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'USER' ? 'e.g. Sarah Jenkins' : 'e.g. Adv. Rajesh Sharma'}
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold block text-slate-700">
              {role === 'USER' ? 'Email Address' : 'Professional Office Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold block text-slate-700">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-semibold block text-slate-700">
              {role === 'USER' ? 'City / Location' : 'Primary Practice City'}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all cursor-pointer font-medium"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {role === 'ADVOCATE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-slate-150"
            >
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold block text-slate-700">
                  Bar Council Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. MAH/8832/2012 or NY/4891024"
                  className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-mono font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-semibold block text-slate-700">Primary Practice Domain</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all cursor-pointer font-medium"
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec} className="bg-white text-slate-900">{spec}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-semibold block text-slate-700">Years of Practice</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-mono font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-semibold block text-slate-700">Consultation Fee (₹/$)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-mono font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="rounded-2xl p-4 space-y-2 text-[12.5px] bg-slate-50 border border-slate-200/90">
            <span className="text-[11px] font-mono font-bold uppercase block text-indigo-700">
              {role === 'USER' ? 'Client Workspace Access Includes:' : 'Advocate Console Features:'}
            </span>
            {role === 'USER' ? (
              <>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> Conversational AI Case Intake &amp; Notice Generator
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> 50+ Jurisdictions Limitation Clocks
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> Verified Advocate Direct Matching &amp; Escrow
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> Pre-Synthesized 60-Second Client Intake Briefs
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> Automated Plaint, Petition &amp; Evidence Drafts
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check size={14} className="text-emerald-600" /> Verified Advocate Directory Profile
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-[14px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:-translate-y-0.5"
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

        <div className="text-center text-[13px] pt-1 text-slate-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="hover:underline font-bold text-indigo-600">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
