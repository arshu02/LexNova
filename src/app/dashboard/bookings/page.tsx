"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  Calendar, Clock, Video, Star, 
  RotateCcw, XCircle, AlertCircle, CheckCircle2, 
  IndianRupee, Loader2, Sparkles, ArrowRight, 
  ExternalLink, User, Shield, X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInMinutes } from "date-fns";

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
      const res = await fetch(`/api/bookings?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
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
          action: "CANCEL",
          reason: cancelReasonInput || "Cancelled by client",
        }),
      });

      if (res.ok) {
        setNotification({ type: "success", message: "Booking cancelled successfully." });
        setCancellingId(null);
        setCancelReasonInput("");
        fetchBookings();
      } else {
        const err = await res.json();
        setNotification({ type: "error", message: err.error || "Failed to cancel." });
      }
    } catch {
      setNotification({ type: "error", message: "Network error." });
    } finally {
      setCancelLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const currentList = activeTab === "UPCOMING" 
    ? upcomingBookings 
    : activeTab === "PAST" 
      ? pastBookings 
      : cancelledBookings;

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Consultations
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Manage video consultations, schedules, and past legal session notes.
          </p>
        </div>
        <Link
          href="/dashboard/advocates"
          className="btn-accent"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
        >
          <Sparkles size={14} /> Find a Lawyer
        </Link>
      </div>

      {/* STATS ROW: 3 Small number boxes (Total | Upcoming | Spent) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Consultations</span>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "var(--text-primary)", marginTop: "6px" }}>{totalConsultations}</div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Upcoming</span>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#60A5FA", marginTop: "6px" }}>{upcomingCount}</div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Spent</span>
          <div style={{ fontSize: "26px", fontWeight: "700", color: "var(--text-primary)", marginTop: "6px" }}>₹{totalSpent.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: "500",
              background: notification.type === "success" ? "var(--success-subtle)" : "var(--danger-subtle)",
              border: `1px solid ${notification.type === "success" ? "var(--success)" : "var(--danger)"}`,
              color: notification.type === "success" ? "var(--success)" : "var(--danger)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {notification.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS: Upcoming | Past | Cancelled */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", gap: "24px" }}>
        {[
          { key: "UPCOMING", label: `Upcoming (${upcomingBookings.length})` },
          { key: "PAST", label: `Past (${pastBookings.length})` },
          { key: "CANCELLED", label: `Cancelled (${cancelledBookings.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 4px 14px",
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                cursor: "pointer",
                position: "relative",
                transition: "color 0.15s ease",
              }}
            >
              {tab.label}
              {isActive && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "white" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* BOOKING CARDS */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 10px" }} />
          <p style={{ fontSize: "13px" }}>Loading consultations...</p>
        </div>
      ) : currentList.length === 0 ? (
        /* EMPTY STATE */
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "60px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "var(--bg-tertiary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)",
          }}>
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-secondary)" }}>
            No consultations yet
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "320px" }}>
            Book your first consultation with a Bar Council verified advocate.
          </p>
          <Link
            href="/dashboard/advocates"
            className="btn-accent"
            style={{ textDecoration: "none", fontSize: "13px", marginTop: "8px", padding: "8px 18px" }}
          >
            Find a Lawyer →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {currentList.map((booking) => {
            const { dayNum, monthYear } = parseDateComponents(booking.date);
            const joinable = isSlotJoinable(booking.date, booking.time);

            return (
              <div
                key={booking.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-xl)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
              >
                {/* Main Row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                  
                  {/* Left Side: Date Block */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: "20px",
                    borderRight: "1px solid var(--border-subtle)",
                    minWidth: "72px",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "32px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1" }}>
                      {dayNum}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", textAlign: "center", whiteSpace: "nowrap" }}>
                      {monthYear}
                    </span>
                  </div>

                  {/* Right Side: Main Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)" }}>
                          {booking.advocate?.name || "Advocate Consultation"}
                        </h3>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {booking.advocate?.type || booking.advocate?.specialization || "Advocate"}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span style={{
                        fontSize: "11px", fontWeight: "600",
                        padding: "3px 10px", borderRadius: "var(--radius-full)",
                        background: booking.status === "CONFIRMED" ? "var(--success-subtle)" : booking.status === "CANCELLED" ? "var(--danger-subtle)" : "var(--bg-tertiary)",
                        border: `1px solid ${booking.status === "CONFIRMED" ? "rgba(16,185,129,0.3)" : booking.status === "CANCELLED" ? "rgba(239,68,68,0.3)" : "var(--border-subtle)"}`,
                        color: booking.status === "CONFIRMED" ? "var(--success)" : booking.status === "CANCELLED" ? "var(--danger)" : "var(--text-secondary)",
                      }}>
                        {booking.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        Code: {booking.confirmationCode || booking.id.slice(-8).toUpperCase()}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} color="var(--text-muted)" /> {booking.time} IST · {booking.duration} mins
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        Fee: <strong style={{ color: "var(--text-primary)" }}>₹{booking.consultationFee}</strong>
                      </span>
                    </div>

                    {booking.userNotes && (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                        {booking.userNotes}
                      </p>
                    )}

                    {booking.cancelReason && (
                      <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "8px" }}>
                        Reason: {booking.cancelReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap", gap: "10px" }}>
                  
                  {/* Left: Join or Time status */}
                  {activeTab === "UPCOMING" && (
                    <>
                      {booking.meetLink ? (
                        <a
                          href={booking.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            padding: "8px 16px", borderRadius: "var(--radius-md)",
                            fontSize: "12px", fontWeight: "600",
                            textDecoration: "none",
                            background: joinable ? "var(--success)" : "var(--bg-tertiary)",
                            color: joinable ? "white" : "var(--text-muted)",
                            border: joinable ? "none" : "1px solid var(--border-subtle)",
                            cursor: joinable ? "pointer" : "default",
                          }}
                        >
                          <Video size={14} />
                          {joinable ? "Join Video Call" : `Starts at ${booking.time}`}
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Meet link generating...</span>
                      )}

                      {/* Right: Cancel button */}
                      {cancellingId === booking.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Reason for cancelling..."
                            value={cancelReasonInput}
                            onChange={(e) => setCancelReasonInput(e.target.value)}
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                          />
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelLoading}
                            style={{ background: "var(--danger)", color: "white", border: "none", borderRadius: "var(--radius-md)", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                          >
                            {cancelLoading ? "Cancelling..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setCancellingId(null)}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
                          >
                            Back
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setCancellingId(booking.id); setCancelReasonInput(""); }}
                          className="btn-ghost"
                          style={{ padding: "6px 14px", fontSize: "12px", color: "var(--text-muted)" }}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}

                  {activeTab === "PAST" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                        <span>Rate:</span>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setRatings(prev => ({ ...prev, [booking.id]: s }));
                              setNotification({ type: "success", message: `Rated ${s} star${s > 1 ? "s" : ""}.` });
                              setTimeout(() => setNotification(null), 3000);
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                          >
                            <Star size={14} fill={(ratings[booking.id] || 0) >= s ? "var(--gold)" : "none"} color="var(--gold)" />
                          </button>
                        ))}
                      </div>

                      <Link
                        href="/dashboard/advocates"
                        className="btn-ghost"
                        style={{ textDecoration: "none", padding: "6px 14px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <RotateCcw size={12} /> Book Again
                      </Link>
                    </div>
                  )}

                  {activeTab === "CANCELLED" && (
                    <div style={{ width: "100%", textAlign: "right" }}>
                      <Link
                        href="/dashboard/advocates"
                        className="btn-ghost"
                        style={{ textDecoration: "none", padding: "6px 14px", fontSize: "12px" }}
                      >
                        Book Another Lawyer
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
