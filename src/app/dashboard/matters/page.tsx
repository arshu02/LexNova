'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, Search, Plus, Clock, Scale, Users, FileText,
  ChevronRight, AlertCircle, CheckCircle2, ArrowUpDown, Filter,
  Sparkles, Calendar, ShieldCheck, ArrowUpRight
} from 'lucide-react';

interface Matter {
  id: string;
  title: string;
  category: string;
  status: "ACTIVE" | "INTAKE_COMPLETE" | "HEARING_SCHEDULED" | "NOTICE_SENT" | "RESOLVED";
  urgency: "HIGH" | "MEDIUM" | "LOW";
  jurisdiction: string;
  client: string;
  opposingParty: string;
  limitationDays: number;
  assignedAdvocate: string;
  claimAmount: number;
  lastUpdated: string;
  nextStep: string;
}

const MATTERS_STORE: Matter[] = [
  {
    id: "MAT-1042",
    title: "Salary Recovery & Unlawful Termination",
    category: "Labour & Employment",
    status: "ACTIVE",
    urgency: "HIGH",
    jurisdiction: "Delhi Labour Tribunal",
    client: "Ragnar Lothbrok",
    opposingParty: "TechCorp Solutions Pvt. Ltd.",
    limitationDays: 18,
    assignedAdvocate: "Advocate Rajesh Sharma",
    claimAmount: 95000,
    lastUpdated: "Today, 11:20 AM",
    nextStep: "File Section 15 Recovery Application",
  },
  {
    id: "MAT-1043",
    title: "Security Deposit Withholding Dispute",
    category: "Property & Tenancy",
    status: "INTAKE_COMPLETE",
    urgency: "MEDIUM",
    jurisdiction: "Bengaluru City Civil Court",
    client: "Ragnar Lothbrok",
    opposingParty: "Indiranagar Flat Owner",
    limitationDays: 42,
    assignedAdvocate: "Advocate Priya Mehta",
    claimAmount: 75000,
    lastUpdated: "Yesterday",
    nextStep: "Dispatch 15-Day RPAD Demand Notice",
  },
  {
    id: "MAT-1044",
    title: "Defective Smart TV Warranty Claim",
    category: "Consumer Protection",
    status: "HEARING_SCHEDULED",
    urgency: "HIGH",
    jurisdiction: "District Consumer Forum Bengaluru",
    client: "Ragnar Lothbrok",
    opposingParty: "ElectroRetail Commerce Ltd.",
    limitationDays: 4,
    assignedAdvocate: "Advocate Ananya Iyer",
    claimAmount: 65000,
    lastUpdated: "2 days ago",
    nextStep: "Attend Consumer Forum Preliminary Hearing",
  },
  {
    id: "MAT-1045",
    title: "Cyber Banking Phishing Fraud",
    category: "Cyber & Criminal",
    status: "NOTICE_SENT",
    urgency: "HIGH",
    jurisdiction: "Cyber Crime Police Station Delhi",
    client: "Ragnar Lothbrok",
    opposingParty: "Unknown Beneficiary Account",
    limitationDays: 12,
    assignedAdvocate: "Advocate Sanjay Gupta",
    claimAmount: 120000,
    lastUpdated: "3 days ago",
    nextStep: "Submit Account Freeze Request to Nodal Officer",
  },
  {
    id: "MAT-1040",
    title: "Commercial Invoicing Settlement",
    category: "Commercial & Contracts",
    status: "RESOLVED",
    urgency: "LOW",
    jurisdiction: "MSEFC Mumbai",
    client: "Ragnar Lothbrok",
    opposingParty: "Apex Logistics Corp",
    limitationDays: 0,
    assignedAdvocate: "Advocate Vikram Singh",
    claimAmount: 120000,
    lastUpdated: "1 week ago",
    nextStep: "Matter Concluded (Settlement Executed)",
  }
];

export default function MattersWorkspaceHub() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredMatters = useMemo(() => {
    return MATTERS_STORE.filter((m) => {
      const matchQuery =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase()) ||
        m.opposingParty.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && m.status === "ACTIVE") ||
        (statusFilter === "INTAKE_COMPLETE" && m.status === "INTAKE_COMPLETE") ||
        (statusFilter === "HEARING_SCHEDULED" && m.status === "HEARING_SCHEDULED") ||
        (statusFilter === "NOTICE_SENT" && m.status === "NOTICE_SENT") ||
        (statusFilter === "RESOLVED" && m.status === "RESOLVED");

      return matchQuery && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Header */}
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
            <Briefcase size={14} /> Enterprise Case Management
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Matters Workspace
          </h1>
          <p style={{ fontSize: "15px", color: "#D7DCE5", marginTop: "4px" }}>
            Central repository of structured legal disputes, court pleadings, statutory limitation tracking, and assigned counsel.
          </p>
        </div>

        <Link
          href="/dashboard/chat"
          className="btn-primary"
          style={{ fontSize: "14px", padding: "10px 20px" }}
        >
          <Plus size={16} /> New Case Intake
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}>
        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Matters</span>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#FFFFFF", marginTop: "6px" }}>5</div>
          <div style={{ fontSize: "13px", color: "#60A5FA", marginTop: "4px" }}>4 Active · 1 Resolved</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Statutory Deadlines</span>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#F59E0B", marginTop: "6px" }}>1 Urgent</div>
          <div style={{ fontSize: "13px", color: "#9AA5B5", marginTop: "4px" }}>Consumer Forum (4 days left)</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Assigned Advocates</span>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#22C55E", marginTop: "6px" }}>3</div>
          <div style={{ fontSize: "13px", color: "#9AA5B5", marginTop: "4px" }}>Bar Council Verified Counsel</div>
        </div>

        <div style={{ background: "#121823", border: "1px solid #263142", borderRadius: "16px", padding: "20px" }}>
          <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>Claims in Dispute</span>
          <div style={{ fontSize: "36px", fontWeight: "700", color: "#FFFFFF", marginTop: "6px" }}>₹3,55,000</div>
          <div style={{ fontSize: "13px", color: "#22C55E", marginTop: "4px" }}>₹1,20,000 Recovered</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#121823",
          border: "1px solid #263142",
          borderRadius: "12px",
          padding: "9px 16px",
          width: "360px",
        }}>
          <Search size={15} color="#9AA5B5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, party, ID, or category..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#FFFFFF",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: "All Matters" },
            { id: "ACTIVE", label: "Active" },
            { id: "INTAKE_COMPLETE", label: "Intake Complete" },
            { id: "HEARING_SCHEDULED", label: "Hearing Scheduled" },
            { id: "NOTICE_SENT", label: "Notice Sent" },
            { id: "RESOLVED", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                fontSize: "13px",
                fontWeight: statusFilter === tab.id ? "600" : "500",
                padding: "7px 14px",
                borderRadius: "9999px",
                cursor: "pointer",
                background: statusFilter === tab.id ? "#FFFFFF" : "#121823",
                color: statusFilter === tab.id ? "#07090D" : "#D7DCE5",
                border: statusFilter === tab.id ? "none" : "1px solid #263142",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matters Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filteredMatters.map((matter) => {
          const isUrgent = matter.limitationDays > 0 && matter.limitationDays <= 7;

          return (
            <div
              key={matter.id}
              style={{
                background: "#121823",
                border: "1px solid #263142",
                borderRadius: "16px",
                padding: "22px 26px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#38475C";
                e.currentTarget.style.background = "#171E29";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#263142";
                e.currentTarget.style.background = "#121823";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      color: "#60A5FA",
                      background: "rgba(59, 130, 246, 0.16)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}>
                      {matter.id}
                    </span>

                    <span style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: matter.status === "RESOLVED" ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
                      color: matter.status === "RESOLVED" ? "#22C55E" : "#60A5FA",
                      border: matter.status === "RESOLVED" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)",
                    }}>
                      {matter.status.replace("_", " ")}
                    </span>

                    <span style={{ fontSize: "13px", color: "#9AA5B5" }}>
                      • {matter.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", marginTop: "6px" }}>
                    {matter.title}
                  </h3>

                  <p style={{ fontSize: "14px", color: "#D7DCE5", marginTop: "2px" }}>
                    Claim: <strong style={{ color: "#FFFFFF" }}>₹{matter.claimAmount.toLocaleString()}</strong> · Opposing: <strong style={{ color: "#FFFFFF" }}>{matter.opposingParty}</strong> · Jurisdiction: {matter.jurisdiction}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  {matter.limitationDays > 0 ? (
                    <span style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: isUrgent ? "#EF4444" : "#F59E0B",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      ⏳ {matter.limitationDays} Days Left
                    </span>
                  ) : (
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#22C55E" }}>
                      ✓ Concluded
                    </span>
                  )}

                  <Link
                    href={`/dashboard/matters/${matter.id}`}
                    className="btn-ghost"
                    style={{ fontSize: "13px", padding: "6px 14px", height: "36px" }}
                  >
                    Open Workspace →
                  </Link>
                </div>
              </div>

              {/* Bottom Row: Assigned Advocate + Next Action */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #263142",
                paddingTop: "12px",
                fontSize: "13px",
                color: "#9AA5B5",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div>
                  Assigned Counsel: <strong style={{ color: "#FFFFFF" }}>{matter.assignedAdvocate}</strong>
                </div>
                <div>
                  Next Action: <strong style={{ color: "#60A5FA" }}>{matter.nextStep}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
