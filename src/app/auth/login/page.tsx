'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Mail, Lock, AlertCircle, Scale,
  User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2
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

  const successMessage = searchParams.get('success');

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
      await supabase.auth.signOut();
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden" style={{ background: '#05060A', color: '#F0F2FF' }}>
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shadow-lg shadow-indigo-500/20" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
            LN
          </div>
          <span className="font-mono text-[22px] font-extrabold tracking-[0.16em] text-white group-hover:text-indigo-400 transition-colors">
            LEXNOV\A
          </span>
        </Link>
        <p className="text-[13.5px]" style={{ color: '#8F96B3' }}>
          Global Autonomous Legal Operating System
        </p>
      </div>

      {/* Role Selector */}
      <div className="w-full max-w-[420px] mb-4 p-1 rounded-2xl flex relative z-10" style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <button
          type="button"
          onClick={() => setRole('USER')}
          className="flex-1 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
          style={role === 'USER' ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            border: '1px solid rgba(99,102,241,0.4)'
          } : {
            color: '#8F96B3'
          }}
        >
          <User size={15} /> Citizen &amp; Business
        </button>
        <button
          type="button"
          onClick={() => setRole('ADVOCATE')}
          className="flex-1 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
          style={role === 'ADVOCATE' ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            border: '1px solid rgba(99,102,241,0.4)'
          } : {
            color: '#8F96B3'
          }}
        >
          <ShieldCheck size={15} /> Legal Advocate
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] rounded-3xl p-8 space-y-6 relative z-10"
        style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <span className="text-[11px] font-mono font-bold tracking-[0.1em] uppercase" style={{ color: '#818CF8' }}>
            Authentication
          </span>
          <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#A8AECF' }}>
            {role === 'USER' ? 'Client Portal' : 'Advocate Console'}
          </span>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-xl text-[13px] flex items-center gap-2.5" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl text-[13px] flex items-center gap-2.5"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12.5px] font-medium block mb-1.5" style={{ color: '#A8AECF' }}>
              Account Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B72A0' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
                style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-medium" style={{ color: '#A8AECF' }}>
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[11.5px] hover:underline font-medium" style={{ color: '#818CF8' }}>
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B72A0' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
                style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
              />
            </div>
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
                <span>Sign in to {role === 'USER' ? 'Client Portal' : 'Advocate Console'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.15)' }} />
            <span className="text-[11px] uppercase tracking-wider font-mono" style={{ color: '#6B72A0' }}>Or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.15)' }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-white text-[13.5px] font-medium transition-colors hover:bg-white/[0.04]"
            style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
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
        <div className="text-center text-[13px] pt-1" style={{ color: '#8F96B3' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="hover:underline font-semibold" style={{ color: '#818CF8' }}>
            Sign up
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#05060A' }} />}>
      <LoginForm />
    </Suspense>
  );
}
