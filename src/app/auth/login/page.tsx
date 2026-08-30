'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Mail, Lock, AlertCircle, CheckCircle2, Scale,
  User, Briefcase, ShieldCheck, ArrowRight
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
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
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred with Google Sign-in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/[0.06] rounded-full blur-[140px]" />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-[22px] tracking-tight mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Scale size={18} />
          </div>
          <span>LexNova</span>
        </Link>
        <p className="text-[13.5px] text-[#7A8A9E] mt-1">
          India&apos;s AI Legal Operating System · Enterprise Workspace
        </p>
      </div>

      {/* Role Selector */}
      <div className="w-full max-w-[420px] mb-4 bg-[#0A0C12] p-1 rounded-2xl border border-white/[0.08] flex relative z-10">
        <button
          type="button"
          onClick={() => setRole('USER')}
          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
            role === 'USER'
              ? 'bg-white text-black shadow-md'
              : 'text-[#8D9CB0] hover:text-white'
          }`}
        >
          <User size={15} /> Citizen & Business
        </button>
        <button
          type="button"
          onClick={() => setRole('ADVOCATE')}
          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
            role === 'ADVOCATE'
              ? 'bg-white text-black shadow-md'
              : 'text-[#8D9CB0] hover:text-white'
          }`}
        >
          <ShieldCheck size={15} /> Legal Advocate
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-[#0A0C12] border border-white/[0.08] rounded-3xl p-7 shadow-2xl relative z-10 space-y-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#6B7B94]">
            Authentication Workspace
          </span>
          <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
            {role === 'USER' ? 'Client Portal' : 'Advocate Console'}
          </span>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] flex items-center gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#8D9CB0] block mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E5D70]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@lawfirm.in or client@gmail.com"
                className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder-[#4E5D70] focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-semibold text-[#8D9CB0]">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[11.5px] text-blue-400 hover:underline font-medium">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E5D70]" />
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

        {/* Google OAuth */}
        <div className="space-y-3 pt-2">
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
