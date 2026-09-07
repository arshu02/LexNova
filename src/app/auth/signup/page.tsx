'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertCircle, User, Scale, ShieldCheck,
  CheckCircle2, ArrowRight, Check
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF9F5] text-[#141413] p-6 font-sans relative py-16">
      
      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-[#141413]">
          <span className="font-mono text-[22px] font-extrabold tracking-[0.18em] text-[#141413]">
            LEXNOV\A
          </span>
        </Link>
        <h1 className="text-[26px] md:text-[32px] font-bold text-[#141413] tracking-tight mt-1">
          {role === 'USER' ? 'Create Client & Enterprise Account' : 'Register Verified Advocate Console'}
        </h1>
        <p className="text-[14px] text-[#636059] max-w-sm mx-auto">
          {role === 'USER'
            ? 'Start your AI legal intake, generate court notices, and track limitation deadlines.'
            : 'Join verified legal practitioners receiving pre-triaged client briefs.'}
        </p>
      </div>

      {/* Role Toggle */}
      <div className="w-full max-w-[480px] bg-[#F7F4EE] p-1.5 rounded-2xl border border-[#E8E4DA] flex gap-1.5 mb-5 shadow-xs">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            role === "USER"
              ? "bg-white text-[#141413] shadow-xs border border-[#DED9CE]"
              : "text-[#636059] hover:text-[#141413]"
          }`}
        >
          <User size={15} />
          <span>Citizen / Business</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("ADVOCATE")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            role === "ADVOCATE"
              ? "bg-white text-[#141413] shadow-xs border border-[#DED9CE]"
              : "text-[#636059] hover:text-[#141413]"
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
        className="w-full max-w-[480px] bg-white border border-[#E8E4DA] rounded-3xl p-8 sm:p-9 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DA]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#87837B]">
            Registration Workspace
          </span>
          <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#F7F4EE] border border-[#E8E4DA] text-[#141413]">
            {role === 'USER' ? 'Client Space' : 'Advocate Portal'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[13.5px] rounded-xl flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-[#42403B] block">
              {role === 'USER' ? 'Full Name' : 'Advocate Full Name (as per Bar Council)'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'USER' ? 'e.g. Sarah Jenkins' : 'e.g. Adv. Rajesh Sharma'}
              className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-[#42403B] block">
              {role === 'USER' ? 'Email Address' : 'Professional Office Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-[#42403B] block">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-[#42403B] block">
              {role === 'USER' ? 'City / Location' : 'Primary Practice City'}
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] focus:border-[#141413] focus:outline-none transition-colors"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-white text-[#141413]">{c}</option>
              ))}
            </select>
          </div>

          {role === 'ADVOCATE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-[#E8E4DA]"
            >
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-[#42403B] block">
                  Bar Council Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. MAH/8832/2012 or NY/4891024"
                  className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-[#42403B] block">Primary Practice Domain</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] focus:border-[#141413] focus:outline-none transition-colors"
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec} className="bg-white text-[#141413]">{spec}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-[#42403B] block">Years of Practice</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] focus:border-[#141413] focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-[#42403B] block">Consultation Fee (₹/$)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full bg-white border border-[#DED9CE] rounded-xl px-3.5 py-2.5 text-[14px] text-[#141413] focus:border-[#141413] focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-[#F7F4EE] border border-[#E8E4DA] rounded-2xl p-4 space-y-2 text-[12.5px] text-[#636059]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#87837B] block">
              {role === 'USER' ? 'Client Workspace Access Includes:' : 'Advocate Console Features:'}
            </span>
            {role === 'USER' ? (
              <>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> Conversational AI Case Intake & Legal Notice Generator
                </div>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> 50+ Jurisdictions Limitation Clocks
                </div>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> Verified Advocate Direct Matching & Escrow Protection
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> Pre-Synthesized 60-Second Client Intake Briefs
                </div>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> Automated Plaint, Petition & Evidence Drafts
                </div>
                <div className="flex items-center gap-2 text-[#2D2C2A]">
                  <Check size={14} className="text-[#141413]" /> Verified Advocate Directory Profile
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#141413] hover:bg-black text-white text-[14px] font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all mt-2"
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

        <div className="text-center text-[13px] text-[#636059] pt-1">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#141413] hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
