'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ShieldCheck, Calendar, Clock, Users, FileText, CheckCircle2,
  AlertCircle, ChevronRight, Video, MessageSquare, ArrowUpRight,
  TrendingUp, Award, Sparkles, Check, X, Scale
} from 'lucide-react';

const LAWYER_BOOKINGS = [
  {
    id: "BK-8471",
    clientName: "Ragnar Lothbrok",
    matterId: "MAT-1042",
    matterTitle: "Salary Recovery & Unlawful Termination",
    date: "Today, 24 August 2026",
    time: "04:30 PM",
    duration: "60 mins",
    status: "CONFIRMED",
    fee: 1499,
    meetLink: "https://meet.jit.si/LexNova-MAT-1042-Consult",
    aiBrief: "Client tendered 30-day resignation. Completed notice period on May 31. TechCorp withheld May-June salary (₹95,000) and experience certificate without grounds.",
  },
  {
    id: "BK-8472",
    clientName: "Priya Sharma",
    matterId: "MAT-1043",
    matterTitle: "Security Deposit Withholding (Indiranagar)",
    date: "Tomorrow, 25 August 2026",
    time: "11:00 AM",
    duration: "60 mins",
    status: "PENDING",
    fee: 999,
    meetLink: "https://meet.jit.si/LexNova-MAT-1043-Consult",
    aiBrief: "Landlord withheld ₹75,000 deposit citing routine wear & tear. Tenancy agreement specifies refundable deposit within 7 days of key handover.",
  }
];

const PENDING_REVIEWS = [
  {
    id: "DOC-201",
    title: "Legal Notice — Demand for Unpaid Wages (RPAD)",
    matterId: "MAT-1042",
    client: "Ragnar Lothbrok",
    generatedDate: "12 Aug 2026",
    statute: "Payment of Wages Act §15",
  },
  {
    id: "DOC-202",
    title: "Consumer Forum Complaint Petition",
    matterId: "MAT-1044",
    client: "Rahul Kumar",
    generatedDate: "15 Aug 2026",
    statute: "Consumer Protection Act §35",
  }
];

export default function AdvocateConsolePage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState(LAWYER_BOOKINGS);
  const [approvedDocs, setApprovedDocs] = useState<string[]>([]);

  const handleApproveDoc = (id: string) => {
    setApprovedDocs((prev) => [...prev, id]);
  };

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
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
            color: "#059669",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            <ShieldCheck size={15} color="#059669" /> Bar Council Verified Advocate Console
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Advocate Practice Console
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginTop: "4px" }}>
            Review incoming AI case briefs, conduct video consultations, and approve drafted legal notices for clients.
          </p>
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "7px 16px",
          borderRadius: "9999px",
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          fontSize: "13px",
          fontWeight: "600",
          color: "#2563EB",
        }}>
          <span>Bar Enrollment: <strong style={{ color: "#1D4ED8" }}>MAH/8832/2012</strong></span>
        </div>
      </div>

      {/* 4 Practice Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Today's Consultations</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", marginTop: "6px" }}>1 Scheduled</div>
          <div style={{ fontSize: "12.5px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>04:30 PM (HD Video)</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pending Client Briefs</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#D97706", marginTop: "6px" }}>2 Matters</div>
          <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px" }}>Awaiting Notice Sign-off</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Earnings (This Month)</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#059669", marginTop: "6px" }}>₹42,500</div>
          <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px" }}>Direct Bank Settlement</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Practice Rating</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#D97706", marginTop: "6px" }}>★ 4.9</div>
          <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px" }}>210 Verified Client Reviews</div>
        </div>
      </div>

      {/* Main Grid: Scheduled Consultations + Document Review */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left: Consultations with 60s Brief */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={17} color="#2563EB" /> Scheduled Client Appointments
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>{booking.clientName}</span>
                      <span style={{ fontSize: "11.5px", color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "2px 7px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                        {booking.matterId}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                      {booking.matterTitle}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#D97706" }}>{booking.time}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{booking.date}</div>
                  </div>
                </div>

                {/* 60-Second AI Brief for Advocate */}
                <div style={{
                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#1E293B",
                  lineHeight: "1.6",
                }}>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.06em" }}>
                    ⚡ 60-Second AI Case Brief:
                  </div>
                  {booking.aiBrief}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <Link
                    href={`/dashboard/matters/${booking.matterId}`}
                    className="btn-ghost"
                    style={{ fontSize: "12.5px", padding: "6px 14px", height: "36px" }}
                  >
                    Open Case File
                  </Link>
                  <a
                    href={booking.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: "12.5px", padding: "6px 16px", height: "36px", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                  >
                    <Video size={14} /> Enter Video Room
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Document Sign-Off Queue */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={17} color="#059669" /> Document Review Queue
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {PENDING_REVIEWS.map((doc) => {
              const isApproved = approvedDocs.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14.5px", fontWeight: "600", color: "#0F172A" }}>{doc.title}</div>
                    <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: "2px" }}>
                      Client: <strong style={{ color: "#0F172A" }}>{doc.client}</strong> · {doc.statute}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "10px" }}>
                    <Link
                      href="/dashboard/documents"
                      style={{ fontSize: "12.5px", color: "#2563EB", textDecoration: "none", fontWeight: "600" }}
                    >
                      View Draft →
                    </Link>

                    <button
                      onClick={() => handleApproveDoc(doc.id)}
                      disabled={isApproved}
                      className={isApproved ? "btn-ghost" : "btn-primary"}
                      style={{ fontSize: "12px", padding: "4px 12px", height: "32px", display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      {isApproved ? <Check size={13} color="#059669" /> : null}
                      {isApproved ? "Approved & Signed" : "Approve & Sign"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
