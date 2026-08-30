'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Briefcase, Calendar, Clock, MapPin, Shield, FileText,
  MessageSquare, AlertCircle, CheckCircle2, Scale, Users,
  Plus, Video, Sparkles, ChevronRight, ArrowUpRight,
  TrendingUp, Award, CheckSquare, ShieldCheck
} from 'lucide-react';

const RECENT_MATTERS = [
  {
    id: "MAT-1042",
    title: "Salary Recovery & Unlawful Termination",
    category: "Labour & Employment",
    status: "ACTIVE",
    priority: "HIGH",
    daysLeft: 18,
    advocate: "Advocate Rajesh Sharma",
    nextAction: "File Section 15 Recovery Petition",
  },
  {
    id: "MAT-1043",
    title: "Security Deposit Withholding Dispute",
    category: "Property & Tenancy",
    status: "INTAKE_COMPLETE",
    priority: "MEDIUM",
    daysLeft: 42,
    advocate: "Advocate Priya Mehta",
    nextAction: "Send 15-Day RPAD Legal Notice",
  },
  {
    id: "MAT-1044",
    title: "Defective Smart TV Warranty Claim",
    category: "Consumer Protection",
    status: "HEARING_SCHEDULED",
    priority: "MEDIUM",
    daysLeft: 4,
    advocate: "Advocate Ananya Iyer",
    nextAction: "First Hearing & Evidence Submission",
  }
];

const UPCOMING_BOOKING = {
  id: "BK-8471",
  advocateName: "Advocate Rajesh Sharma",
  specialization: "Employment & Labour Counsel",
  date: "24 August 2026",
  time: "04:30 PM",
  meetLink: "https://meet.jit.si/LexNova-MAT-1042-Consult",
  matterTitle: "Salary Recovery & Unlawful Termination",
};

export default function UserOverviewDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Welcome Banner */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderBottom: "1px solid #263142",
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
            color: "#60A5FA",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            <Sparkles size={14} /> Enterprise Legal Command Center
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0] || "User"}
          </h1>
          <p style={{ fontSize: "15px", color: "#D7DCE5", marginTop: "4px" }}>
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
        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Matters</span>
            <Briefcase size={17} color="#60A5FA" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#FFFFFF", marginTop: "6px" }}>3</div>
          <div style={{ fontSize: "13px", color: "#60A5FA", marginTop: "4px" }}>2 High Priority</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Upcoming Limitation</span>
            <Clock size={17} color="#F59E0B" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#F59E0B", marginTop: "6px" }}>4 Days</div>
          <div style={{ fontSize: "13px", color: "#9AA5B5", marginTop: "4px" }}>Consumer Forum Complaint</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Draft Notices Ready</span>
            <FileText size={17} color="#22C55E" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#22C55E", marginTop: "6px" }}>2</div>
          <div style={{ fontSize: "13px", color: "#9AA5B5", marginTop: "4px" }}>RPAD Notices Prepared</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Consultations</span>
            <Video size={17} color="#A78BFA" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#FFFFFF", marginTop: "6px" }}>1 Active</div>
          <div style={{ fontSize: "13px", color: "#22C55E", marginTop: "4px" }}>Confirmed for Today</div>
        </div>
      </div>

      {/* Main 2-Column Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Active Matters */}
        <div style={{
          background: "#121823",
          border: "1px solid #263142",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={16} color="#60A5FA" /> Active Legal Matters
            </div>
            <Link href="/dashboard/matters" style={{ fontSize: "13px", color: "#60A5FA", textDecoration: "none", fontWeight: "600" }}>
              View All Matters →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {RECENT_MATTERS.map((matter) => (
              <Link
                key={matter.id}
                href={`/dashboard/matters/${matter.id}`}
                style={{
                  textDecoration: "none",
                  background: "#171E29",
                  border: "1px solid #263142",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#38475C";
                  (e.currentTarget as HTMLElement).style.background = "#1C2433";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#263142";
                  (e.currentTarget as HTMLElement).style.background = "#171E29";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "#60A5FA", fontWeight: "700", background: "rgba(59, 130, 246, 0.16)", padding: "2px 7px", borderRadius: "4px" }}>
                      {matter.id}
                    </span>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", marginTop: "4px" }}>
                      {matter.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#D7DCE5", marginTop: "2px" }}>
                      {matter.category} · Counsel: <strong style={{ color: "#FFFFFF" }}>{matter.advocate}</strong>
                    </p>
                  </div>

                  <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: "700" }}>
                    ⏳ {matter.daysLeft}d left
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "#9AA5B5", borderTop: "1px solid #263142", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Next: <strong style={{ color: "#FFFFFF" }}>{matter.nextAction}</strong></span>
                  <ChevronRight size={14} color="#60A5FA" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Next Video Consultation & Fast Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* Confirmed Consultation Card */}
          <div style={{
            background: "#121823",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(59, 130, 246, 0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "#22C55E", fontWeight: "700", textTransform: "uppercase" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E" }} />
              Today's Video Consultation
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", marginTop: "10px" }}>
              {UPCOMING_BOOKING.advocateName}
            </h3>
            <p style={{ fontSize: "13.5px", color: "#D7DCE5" }}>
              {UPCOMING_BOOKING.specialization}
            </p>

            <div style={{
              background: "#171E29",
              border: "1px solid #263142",
              borderRadius: "12px",
              padding: "12px 16px",
              marginTop: "14px",
              fontSize: "13.5px",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span>📅 {UPCOMING_BOOKING.date}</span>
              <span>⏰ {UPCOMING_BOOKING.time}</span>
            </div>

            <div style={{ marginTop: "18px" }}>
              <a
                href={UPCOMING_BOOKING.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: "100%", fontSize: "13.5px", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", textDecoration: "none" }}
              >
                <Video size={16} /> Join HD Video Call Now
              </a>
            </div>
          </div>

          {/* Quick Launchpad */}
          <div style={{
            background: "#121823",
            border: "1px solid #263142",
            borderRadius: "16px",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#9AA5B5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Legal Workspace Tools
            </div>

            <Link
              href="/dashboard/documents"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#171E29",
                border: "1px solid #263142",
                borderRadius: "12px",
                fontSize: "14px",
                color: "#FFFFFF",
                fontWeight: "500",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={16} color="#60A5FA" />
                <span>Draft Security Deposit / Salary Notice</span>
              </div>
              <ChevronRight size={14} color="#9AA5B5" />
            </Link>

            <Link
              href="/dashboard/advocates"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#171E29",
                border: "1px solid #263142",
                borderRadius: "12px",
                fontSize: "14px",
                color: "#FFFFFF",
                fontWeight: "500",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Users size={16} color="#22C55E" />
                <span>Browse Bar Council Advocates</span>
              </div>
              <ChevronRight size={14} color="#9AA5B5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
