"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  Calendar, Clock, Video, Star, 
  RotateCcw, XCircle, AlertCircle, CheckCircle2, 
  IndianRupee, Loader2, Sparkles, ArrowRight, 
  ExternalLink, User, Shield, X, ShieldCheck,
  CalendarDays, VideoOff, MessageSquare, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInMinutes } from "date-fns";
import { PaymentButton } from "@/components/PaymentModal";

interface Booking {
  id: string;
  userId: string;
  advocateId: string;
  matterId?: string | null;
  date: string;
  time: string;
  duration: number;
  timezone: string;
  status: string;
  consultationType: string;
  meetLink?: string | null;
  userNotes?: string | null;
  lawyerNotes?: string | null;
  consultationFee: number;
  currency: string;
  paymentStatus: string;
  confirmationCode: string;
  cancelReason?: string | null;
  cancelledBy?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  advocate: {
    id: string;
    name: string;
    specialization: string;
    type?: string;
    city?: string;
    rating?: number;
    experienceYears?: number;
  };
}

type TabType = "UPCOMING" | "PAST" | "CANCELLED";

function parseDateComponents(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const dayNum = d.getDate();
    const monthYear = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    const fullDate = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return { dayNum, monthYear, fullDate };
  } catch {
    return { dayNum: "--", monthYear: dateStr, fullDate: dateStr };
  }
}

function isSlotJoinable(dateStr: string, timeStr: string): boolean {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    if (dateStr !== todayStr) return false;

    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return true;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const appointmentTime = new Date();
    appointmentTime.setHours(hours, minutes, 0, 0);

    const diffMins = differenceInMinutes(now, appointmentTime);
    return diffMins >= -15 && diffMins <= 90;
  } catch {
    return true;
  }
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || (session?.user as any)?.uid || "user_placeholder";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("UPCOMING");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.items || []);
        setBookings(list);
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const upcomingBookings = useMemo(() => {
    return bookings.filter(b => b.date >= todayStr && b.status === "CONFIRMED");
  }, [bookings, todayStr]);

  const pastBookings = useMemo(() => {
    return bookings.filter(b => (b.date < todayStr || b.status === "COMPLETED") && b.status !== "CANCELLED");
  }, [bookings, todayStr]);

  const cancelledBookings = useMemo(() => {
    return bookings.filter(b => b.status === "CANCELLED");
  }, [bookings]);

  const totalConsultations = bookings.length;
  const upcomingCount = upcomingBookings.length;
  const totalSpent = useMemo(() => {
    return bookings
      .filter(b => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + (b.consultationFee || 0), 0);
  }, [bookings]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: "CANCELLED",
          cancelReason: cancelReasonInput.trim() || "Cancelled by client",
          cancelledBy: "USER",
        }),
      });

      if (res.ok) {
        setNotification({ type: "success", message: "Consultation cancelled successfully. Funds released as per escrow policy." });
        setCancellingId(null);
        setCancelReasonInput("");
        fetchBookings();
      } else {
        const errData = await res.json();
        setNotification({ type: "error", message: errData.error || "Failed to cancel consultation." });
      }
    } catch (err) {
      setNotification({ type: "error", message: "Network error while cancelling." });
    } finally {
      setCancelLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const currentList = activeTab === "UPCOMING" ? upcomingBookings : activeTab === "PAST" ? pastBookings : cancelledBookings;

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-16">
      
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600">
              Bar Council Strategy Sessions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultations &amp; Strategy Rooms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage scheduled advocate video calls, escrow payments, and post-session strategy briefings.
          </p>
        </div>

        <Link
          href="/dashboard/advocates"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-center"
        >
          <Sparkles size={15} />
          <span>Find an Advocate</span>
        </Link>
      </div>

      {/* ── 3 TELEMETRY STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Total Consultations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Consultations
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <CalendarDays size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? "-" : totalConsultations}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              Historical &amp; active docket bookings
            </div>
          </div>
        </div>

        {/* Metric 2: Upcoming */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Strategy Calls
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-indigo-600 tracking-tight">
              {loading ? "-" : upcomingCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{upcomingCount > 0 ? "Advocate standby active" : "No upcoming calls"}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Spent */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Retainer Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? "-" : `₹${totalSpent.toLocaleString("en-IN")}`}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <Shield size={12} />
              <span>100% LexNova Escrow Protected</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── NOTIFICATION TOAST ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm border ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TAB SWITCHER ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "UPCOMING", label: "Upcoming Consultations", count: upcomingBookings.length },
          { key: "PAST", label: "Completed & Past", count: pastBookings.length },
          { key: "CANCELLED", label: "Cancelled", count: cancelledBookings.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── BOOKING CARDS LIST ── */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white border border-slate-200/90 rounded-2xl">
          <Loader2 size={28} className="animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Synchronizing consultation dockets with Bar Council...</p>
        </div>
      ) : currentList.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="py-20 px-6 text-center space-y-4 bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === "UPCOMING" ? "No upcoming strategy sessions" : activeTab === "PAST" ? "No past consultations recorded" : "No cancelled consultations"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              {activeTab === "UPCOMING"
                ? "Schedule your 1-on-1 strategy call with verified trial counsel. Fixed fees and encrypted rooms."
                : "Completed consultations and notes will appear here."}
            </p>
          </div>
          {activeTab === "UPCOMING" && (
            <Link
              href="/dashboard/advocates"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles size={14} />
              <span>Browse 140+ Verified Advocates</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {currentList.map((booking) => {
            const { dayNum, monthYear, fullDate } = parseDateComponents(booking.date);
            const joinable = isSlotJoinable(booking.date, booking.time);

            return (
              <div
                key={booking.id}
                className="p-5 sm:p-6 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col gap-5 group"
              >
                {/* Main Card Content */}
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  
                  {/* Left: Date Tile */}
                  <div className="flex sm:flex-col items-center justify-center p-3 sm:py-4 rounded-xl bg-slate-50 border border-slate-200/90 min-w-[85px] w-full sm:w-auto text-center shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                      {dayNum}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1 ml-2 sm:ml-0 font-mono">
                      {monthYear}
                    </span>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 min-w-0 space-y-2.5 w-full">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {booking.advocate?.name || "Advocate Consultation"}
                          </h3>
                          <span title="Verified Bar Council Enrolled">
                            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {booking.advocate?.city ? `${booking.advocate.city} · ` : ""}
                          {booking.advocate?.experienceYears ? `${booking.advocate.experienceYears} yrs experience` : "Admitted Counsel"}
                        </p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700">
                          {booking.advocate?.specialization || booking.consultationType || "General Legal"}
                        </span>
                        
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${
                            booking.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : booking.status === "CANCELLED"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Meta Row: Code, Time, Fee */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1">
                      <span className="font-mono text-slate-500 font-medium">
                        Docket: <strong className="text-slate-800">{booking.confirmationCode || `LN-${booking.id.slice(-6).toUpperCase()}`}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Clock size={13} className="text-slate-400" />
                        <span>{booking.time} IST · {booking.duration || 60} mins strategy call</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 font-medium">
                        Fee: <strong className="text-slate-900 font-bold">₹{booking.consultationFee || 999}</strong>
                      </span>
                      {booking.paymentStatus === "PAID" && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Escrow Secured ✓
                        </span>
                      )}
                    </div>

                    {/* User Matter Notes */}
                    {booking.userNotes && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2 mt-2">
                        <MessageSquare size={14} className="shrink-0 mt-0.5 text-indigo-500" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-800">Matter Notes:</span> {booking.userNotes}
                        </div>
                      </div>
                    )}

                    {/* Cancel Reason */}
                    {booking.cancelReason && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-start gap-2 mt-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-500" />
                        <div>
                          <span className="font-bold">Cancellation Reason:</span> {booking.cancelReason}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* ── CARD FOOTER ACTIONS ── */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  
                  {activeTab === "UPCOMING" && (
                    <>
                      <div className="flex flex-wrap items-center gap-2.5">
                        
                        {/* Payment Button if Pending */}
                        {booking.paymentStatus === "PENDING" && (
                          <PaymentButton
                            bookingId={booking.id}
                            amount={booking.consultationFee || 999}
                            advocateName={booking.advocate?.name || "Advocate"}
                            onSuccess={() => fetchBookings()}
                            label={`Pay ₹${booking.consultationFee || 999} via Escrow`}
                          />
                        )}

                        {/* Video Strategy Call Link */}
                        {booking.meetLink ? (
                          <a
                            href={booking.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                              joinable
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                            }`}
                          >
                            <Video size={14} className={joinable ? "animate-pulse" : ""} />
                            <span>{joinable ? "Enter Video Strategy Room" : `Starts at ${booking.time}`}</span>
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Clock size={13} />
                            <span>Secure video room generating...</span>
                          </span>
                        )}

                      </div>

                      {/* Cancel Action */}
                      {cancellingId === booking.id ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="Reason for cancellation..."
                            value={cancelReasonInput}
                            onChange={(e) => setCancelReasonInput(e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                          />
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelLoading}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0"
                          >
                            {cancelLoading ? "Cancelling..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setCancellingId(null)}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                          >
                            Back
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setCancellingId(booking.id); setCancelReasonInput(""); }}
                          className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors px-2 py-1"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </>
                  )}

                  {activeTab === "PAST" && (
                    <div className="flex items-center justify-between w-full">
                      {/* Rate Consultation */}
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="font-semibold">Counsel Review:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setRatings(prev => ({ ...prev, [booking.id]: s }));
                                setNotification({ type: "success", message: `Submitted ${s}-star counsel rating.` });
                                setTimeout(() => setNotification(null), 3000);
                              }}
                              className="p-1 hover:scale-110 transition-transform"
                              title={`${s} Stars`}
                            >
                              <Star
                                size={15}
                                className={
                                  (ratings[booking.id] || 0) >= s
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-slate-300 hover:text-amber-400"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Link
                        href="/dashboard/advocates"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <RotateCcw size={13} />
                        <span>Book Follow-up Session</span>
                      </Link>
                    </div>
                  )}

                  {activeTab === "CANCELLED" && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-slate-400">
                        Funds processed via LexNova Escrow Protection Guarantee
                      </span>
                      <Link
                        href="/dashboard/advocates"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <span>Book Another Advocate</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
