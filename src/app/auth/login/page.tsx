'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Mail, Lock, AlertCircle, CheckCircle2, Scale,
  User, Briefcase, ShieldCheck, Sparkles, ArrowRight, Gavel
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'USER' | 'ADVOCATE'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const userRole = session?.user?.role || role;
        
        // Segregated routing based on user vs advocate role
        if (userRole === "ADVOCATE" || role === "ADVOCATE") {
          router.push("/dashboard/advocate");
        } else {
          router.push("/dashboard/user");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (targetRole: 'USER' | 'ADVOCATE') => {
    setRole(targetRole);
    if (targetRole === 'USER') {
      setEmail('hailragnar01@gmail.com');
      setPassword('password123');
    } else {
      setEmail('rajesh.sharma@lexnova.in');
      setPassword('lawyer123');
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

  const successMessage = searchParams.get("success");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] text-[#F0F2F5] p-6 font-sans relative selection:bg-blue-500/30">
      
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
          {role === 'USER' ? 'Sign in to Client Portal' : 'Sign in to Advocate Console'}
        </h1>
        <p className="text-[14.5px] text-[#9AA8BC] max-w-sm mx-auto">
          {role === 'USER'
            ? 'Access your active case matters, AI intake briefs, and document studio.'
            : 'Access your practice briefs, consultation calendar, and client case dockets.'}
        </p>
      </div>

      {/* ── ROLE SELECTOR PORTAL TOGGLE ───────────────────────────── */}
      <div className="w-full max-w-[440px] bg-[#0A0C12] p-1.5 rounded-2xl border border-white/[0.1] flex gap-1.5 mb-5 relative z-10 shadow-lg">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
            role === "USER"
              ? "bg-white text-black shadow-md"
              : "text-[#8C9BB4] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <User size={15} className={role === "USER" ? "text-blue-600" : "text-[#55667E]"} />
          <span>Citizen & Business</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("ADVOCATE")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
            role === "ADVOCATE"
              ? "bg-white text-black shadow-md"
              : "text-[#8C9BB4] hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <ShieldCheck size={15} className={role === "ADVOCATE" ? "text-emerald-600" : "text-[#55667E]"} />
          <span>Legal Advocate</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[440px] bg-[#0A0C12] border border-white/[0.1] rounded-3xl p-8 sm:p-9 shadow-2xl relative z-10 space-y-6"
      >
        {/* Role Identity Chip */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#6B7B94]">
            Authentication Workspace
          </span>
          <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
            role === 'USER'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
          }`}>
            {role === 'USER' ? '● Client Portal' : '● Lawyer Console'}
          </span>
        </div>

        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13.5px] rounded-xl flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[13.5px] rounded-xl flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#C8D0DC] block">
              {role === 'USER' ? 'Account Email' : 'Advocate Registered Email'}
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6B7C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'USER' ? 'you@example.com' : 'advocate@lexnova.in'}
                className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#C8D0DC] block">Password</label>
              <Link href="/auth/forgot-password" className="text-[12px] text-blue-400 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6B7C]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
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
                <span>Sign in to {role === 'USER' ? 'Client Portal' : 'Advocate Console'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <span className="text-[11px] text-[#6B7B94] uppercase font-bold block text-center">
            One-Click Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <button
              type="button"
              onClick={() => handleDemoFill('USER')}
              className="bg-[#07090E] hover:bg-[#121828] border border-white/[0.08] hover:border-blue-500/40 text-[#9AA8BC] hover:text-white p-2 rounded-xl text-center transition-all"
            >
              👤 Fill Client Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ADVOCATE')}
              className="bg-[#07090E] hover:bg-[#121828] border border-white/[0.08] hover:border-emerald-500/40 text-[#9AA8BC] hover:text-white p-2 rounded-xl text-center transition-all"
            >
              ⚖️ Fill Lawyer Demo
            </button>
          </div>
        </div>

        {/* Google OAuth */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11.5px] text-[#55667E] uppercase tracking-wider font-semibold">Or continue with</span>
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

        {/* Footer Link */}
        <div className="text-center text-[13px] text-[#7A8A9E] pt-1">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-white hover:underline font-semibold">
            Sign up
          </Link>
        </div>

      </motion.div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050508]" />}>
      <LoginForm />
    </Suspense>
  );
}
