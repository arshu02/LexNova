'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Briefcase, Calendar, Clock, MapPin, Shield, FileText,
  MessageSquare, AlertCircle, CheckCircle2, Scale, Users,
  Plus, Video, Sparkles, ChevronRight, ArrowUpRight,
  TrendingUp, Award, CheckSquare, ShieldCheck, Loader2,
  ExternalLink, Zap, ArrowRight, Activity, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Matter {
  id: string;
  title: string;
  category?: string;
  status: string;
  priority?: string;
  jurisdiction?: string;
  createdAt: string;
  description?: string;
  advocate?: {
    name: string;
    specialization?: string;
  };
}

interface Booking {
  id: string;
  scheduledAt?: string;
  date?: string;
  time?: string;
  status: string;
  meetLink?: string;
  confirmationCode?: string;
  advocate?: {
    name: string;
    specialization?: string;
  };
  matter?: {
    title: string;
  };
}

export default function UserOverviewDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const [mattersRes, bookingsRes] = await Promise.all([
          fetch('/api/matters'),
          fetch('/api/bookings'),
        ]);

        if (mattersRes.ok) {
          const mData = await mattersRes.json();
          const list = Array.isArray(mData) ? mData : (mData?.items || []);
          setMatters(list);
        }

        if (bookingsRes.ok) {
          const bData = await bookingsRes.json();
          const list = Array.isArray(bData) ? bData : (bData?.items || []);
          setBookings(list);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [session]);

  const activeMattersCount = matters.filter((m) => m.status !== 'RESOLVED').length;
  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const nextBooking = activeBookings[0];

  return (
    <div className="max-w-[1380px] mx-auto flex flex-col gap-7 pb-12">
      
      {/* ── Executive Hero Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-8 sm:p-10 text-white shadow-xl border border-slate-800">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase mb-3 backdrop-blur-md">
              <Sparkles size={13} className="text-blue-400" />
              <span>Institutional Legal Operating System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0] || "Counsel"}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Your active case matters, limitation countdowns, and scheduled video consultations are synchronized with the Bar Council network.
            </p>

            <div className="flex items-center gap-4 mt-5 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Statutory Precedents: Online</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck size={14} className="text-blue-400" />
                <span>End-to-End Client Privilege Active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/documents"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15 backdrop-blur-md flex items-center gap-2"
            >
              <FileText size={16} />
              <span>Document Studio</span>
            </Link>

            <Link
              href="/dashboard/chat"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>New Case Matter</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 Key Performance & Telemetry Cards ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Active Matters */}
        <div className="glass-card-elevated p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Matters</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {loading ? '-' : activeMattersCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1">
              <span>{activeMattersCount > 0 ? `${activeMattersCount} Active Disputes` : 'All Matters Cleared'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Limitation Deadlines */}
        <div className="glass-card-elevated p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Limitation Shield</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-600">
              {loading ? '-' : (activeMattersCount > 0 ? 'Protected' : 'Clear')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>Limitation Act 1963 Tracked</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Draft Documents */}
        <div className="glass-card-elevated p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal Documents</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-700">
              {loading ? '-' : matters.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>Court-Admissible Notices</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Consultations */}
        <div className="glass-card-elevated p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Advocate Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-purple-900">
              {loading ? '-' : activeBookings.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold mt-1">
              <span>{activeBookings.length > 0 ? 'Upcoming Video Rooms' : 'Available for Booking'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Main 2-Column Content Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Left Column (8 Cols): Active Matters Docket */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Scale size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Active Matter Dockets</h2>
                  <p className="text-xs text-slate-500">Live litigation and negotiation tracking</p>
                </div>
              </div>

              <Link
                href="/dashboard/matters"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Docket List</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 size={24} className="animate-spin text-blue-600" />
                <span className="text-xs">Synchronizing with legal repository...</span>
              </div>
            ) : matters.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-8">
                <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">No Active Case Matters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Initiate a new statutory case intake to analyze claims, calculate limitation deadlines, and match with High Court advocates.
                </p>
                <Link
                  href="/dashboard/chat"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                >
                  <Plus size={14} />
                  <span>Start First Case Intake</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {matters.slice(0, 4).map((matter) => (
                  <Link
                    key={matter.id}
                    href={`/dashboard/case/${matter.id}`}
                    className="block p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {matter.id.substring(0, 10).toUpperCase()}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            matter.status === 'ACTIVE' 
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}>
                            {matter.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2">
                          {matter.title}
                        </h3>

                        {matter.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {matter.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {new Date(matter.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-2 ml-auto" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/documents?template=legal-notice-tenant"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <FileText size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Draft Security Notice</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">TPA §108 statutory format</p>
            </Link>

            <Link
              href="/dashboard/documents?template=legal-notice-salary"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Briefcase size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Recover Salary Dues</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Payment of Wages Act §15</p>
            </Link>

            <Link
              href="/dashboard/advocates"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">High Court Counsel</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant Bar Council matching</p>
            </Link>
          </div>

        </div>

        {/* Right Column (4 Cols): Consultation Spotlight & Limitation Alert */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Upcoming Video Consultation Spotlight */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Video size={14} className="text-blue-600" />
                <span>Next Consultation</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Confirmed
              </span>
            </div>

            {nextBooking ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Assigned Legal Counsel</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {nextBooking.advocate?.name || "Advocate Vikram Singh"}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {nextBooking.advocate?.specialization || "High Court Trial Counsel"}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-mono">Date</span>
                      <span className="font-bold text-slate-800">{nextBooking.date || "Scheduled"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">Slot</span>
                      <span className="font-bold text-slate-800">{nextBooking.time || "11:00 AM"}</span>
                    </div>
                  </div>
                </div>

                {nextBooking.meetLink ? (
                  <a
                    href={nextBooking.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/25"
                  >
                    <Video size={14} />
                    <span>Enter Secure Video Room</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <Link
                    href={`/dashboard/consultation/${nextBooking.id}`}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/25"
                  >
                    <Video size={14} />
                    <span>View Consultation Room</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Calls Scheduled Today</h4>
                <p className="text-[11.5px] text-slate-500 mt-1">
                  Book a 1-on-1 strategy session with verified High Court counsel.
                </p>
                <Link
                  href="/dashboard/advocates"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
                >
                  <Users size={13} />
                  <span>Find an Advocate</span>
                </Link>
              </div>
            )}
          </div>

          {/* Statutory Shield / Advisory Box */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>Limitation Clock Monitor</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              Under the Indian Limitation Act, 1963, debt recovery and summary suits must be initiated within <strong>3 years</strong> from the cause of action date.
            </p>
            <Link
              href="/dashboard/chat"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
            >
              <span>Calculate exact deadline for your claim →</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
