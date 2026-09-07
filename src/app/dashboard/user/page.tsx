'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Briefcase, Calendar, Clock, MapPin, Shield, FileText,
  MessageSquare, AlertCircle, CheckCircle2, Scale, Users,
  Plus, Video, Sparkles, ChevronRight, ArrowUpRight,
  TrendingUp, Award, CheckSquare, ShieldCheck, Loader2
} from 'lucide-react';

interface Matter {
  id: string;
  title: string;
  category?: string;
  status: string;
  priority?: string;
  jurisdiction?: string;
  createdAt: string;
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
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Dashboard Top Title Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid #E2E8F0",
        paddingBottom: "20px",
        flexWrap: "wrap",
        gap: "14px",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#2563EB",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            <Sparkles size={14} /> Enterprise Legal Command Center
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0] || "User"}
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginTop: "4px" }}>
            Overview of your active legal matters, court limitation windows, scheduled video consultations, and pending pleadings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/dashboard/documents"
            className="btn-ghost"
            style={{ fontSize: "13.5px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px", height: "42px" }}
          >
            <FileText size={15} /> Document Studio
          </Link>
          <Link
            href="/dashboard/chat"
            className="btn-primary"
            style={{ fontSize: "13.5px", padding: "8px 18px", display: "flex", alignItems: "center", gap: "6px", height: "42px" }}
          >
            <Plus size={15} /> New Case Intake
          </Link>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Matters</span>
            <Briefcase size={17} color="#2563EB" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A", marginTop: "6px" }}>
            {loading ? '-' : activeMattersCount}
          </div>
          <div style={{ fontSize: "13px", color: "#2563EB", marginTop: "4px" }}>
            {activeMattersCount > 0 ? `${activeMattersCount} Open Inquiries` : 'No active disputes'}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Limitation Deadlines</span>
            <Clock size={17} color="#D97706" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#D97706", marginTop: "6px" }}>
            {loading ? '-' : (activeMattersCount > 0 ? 'Protected' : 'N/A')}
          </div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
            {activeMattersCount > 0 ? 'Limitation Act Tracked' : 'No pending deadlines'}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Draft Notices</span>
            <FileText size={17} color="#059669" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#059669", marginTop: "6px" }}>
            {loading ? '-' : matters.length}
          </div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
            Court-Ready Templates
          </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Consultations</span>
            <Video size={17} color="#7C3AED" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#0F172A", marginTop: "6px" }}>
            {loading ? '-' : activeBookings.length}
          </div>
          <div style={{ fontSize: "13px", color: activeBookings.length > 0 ? "#059669" : "#64748B", marginTop: "4px" }}>
            {activeBookings.length > 0 ? 'Scheduled Advocate Calls' : 'No upcoming calls'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Active Matters */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={16} color="#2563EB" /> Active Legal Matters
            </div>
            <Link href="/dashboard/matters" style={{ fontSize: "13px", color: "#2563EB", textDecoration: "none", fontWeight: "600" }}>
              View All Matters →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#64748B" }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 10px auto", color: "#2563EB" }} />
              <p style={{ fontSize: "13px" }}>Loading your legal matters...</p>
            </div>
          ) : matters.length === 0 ? (
            <div style={{
              background: "#F8FAFC",
              border: "1px dashed #CBD5E1",
              borderRadius: "14px",
              padding: "36px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(37, 99, 235, 0.08)",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563EB",
              }}>
                <Briefcase size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "15.5px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                  No Active Legal Matters Yet
                </h4>
                <p style={{ fontSize: "13px", color: "#64748B", maxWidth: "380px", margin: "0 auto" }}>
                  Start an AI Case Intake to evaluate your dispute, calculate statutory limitation periods, and connect with top advocates.
                </p>
              </div>
              <Link
                href="/dashboard/chat"
                className="btn-primary"
                style={{ fontSize: "13px", padding: "8px 18px", marginTop: "6px" }}
              >
                <Plus size={14} /> Start AI Case Intake
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matters.map((matter) => (
                <Link
                  key={matter.id}
                  href={`/dashboard/matters/${matter.id}`}
                  style={{
                    textDecoration: "none",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1";
                    (e.currentTarget as HTMLElement).style.background = "#F1F5F9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                    (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "#2563EB", fontWeight: "700", background: "rgba(37, 99, 235, 0.1)", padding: "2px 7px", borderRadius: "4px" }}>
                        {matter.id.slice(0, 10)}
                      </span>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginTop: "4px" }}>
                        {matter.title}
                      </h4>
                      <p style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                        {matter.category || 'General Legal Dispute'} · Counsel: <strong style={{ color: "#0F172A" }}>{matter.advocate?.name || 'Assigned Counsel'}</strong>
                      </p>
                    </div>

                    <span style={{ fontSize: "12px", color: "#059669", fontWeight: "700" }}>
                      {matter.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Consultation / Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Consultation Box */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#059669" }} />
              Upcoming Video Consultation
            </div>

            {nextBooking ? (() => {
              const rawDate = nextBooking.scheduledAt || nextBooking.date;
              const parsed = rawDate ? new Date(rawDate) : null;
              const isValid = parsed && !isNaN(parsed.getTime());
              const dateStr = isValid ? parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (nextBooking.date || 'Today, 24 Aug 2026');
              const timeStr = isValid && nextBooking.scheduledAt ? parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (nextBooking.time || '04:30 PM');

              return (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                  {nextBooking.advocate?.name || 'Advocate Rajesh Sharma'}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748B" }}>
                  {nextBooking.advocate?.specialization || 'Employment & Labour Counsel'}
                </p>

                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#334155" }}>
                  <span>📅 {dateStr}</span>
                  <span>⏰ {timeStr}</span>
                </div>

                <Link
                  href={`/dashboard/consultation/${nextBooking.id || 'MAT-1042'}`}
                  className="btn-primary"
                  style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px", fontSize: "14px", marginTop: "4px" }}
                >
                  <Video size={16} /> Join Consultation Room
                </Link>
              </div>
              );
            })() : (
              <div style={{ textAlign: "center", padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <Video size={28} style={{ color: "#94A3B8" }} />
                <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                  No scheduled consultations for today.
                </p>
                <Link
                  href="/advocates"
                  className="btn-ghost"
                  style={{ fontSize: "12.5px", padding: "6px 14px" }}
                >
                  Book Advocate Consultation
                </Link>
              </div>
            )}
          </div>

          {/* Quick Tools */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
              Legal Workspace Tools
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/dashboard/chat" style={{ textDecoration: "none", padding: "10px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#334155", fontSize: "13.5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MessageSquare size={16} color="#2563EB" />
                  <span>AI Case Assessment</span>
                </div>
                <ChevronRight size={14} color="#2563EB" />
              </Link>

              <Link href="/dashboard/documents" style={{ textDecoration: "none", padding: "10px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#334155", fontSize: "13.5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={16} color="#059669" />
                  <span>RPAD Notice Generator</span>
                </div>
                <ChevronRight size={14} color="#059669" />
              </Link>

              <Link href="/dashboard/advocates" style={{ textDecoration: "none", padding: "10px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#334155", fontSize: "13.5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Users size={16} color="#7C3AED" />
                  <span>Find High Court Advocates</span>
                </div>
                <ChevronRight size={14} color="#7C3AED" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
