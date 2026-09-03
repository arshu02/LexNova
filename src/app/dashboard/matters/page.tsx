'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, Search, Plus, Clock, Scale, Users, FileText,
  ChevronRight, AlertCircle, CheckCircle2, ArrowUpDown, Filter,
  Sparkles, Calendar, ShieldCheck, ArrowUpRight, Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Matter {
  id: string;
  title: string;
  category?: string;
  status: string;
  priority?: string;
  jurisdiction?: string;
  opposingParty?: string;
  createdAt: string;
  advocate?: {
    name: string;
    specialization?: string;
  };
}

export default function MattersWorkspaceHub() {
  const { data: session } = useSession();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    async function loadMatters() {
      try {
        setLoading(true);
        const res = await fetch('/api/matters');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data?.items || []);
          setMatters(list);
        }
      } catch (err) {
        console.error('Failed to load matters:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatters();
  }, [session]);

  const filteredMatters = useMemo(() => {
    return matters.filter((m) => {
      const matchQuery =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase())) ||
        (m.jurisdiction && m.jurisdiction.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && m.status === 'ACTIVE') ||
        (statusFilter === 'INTAKE_COMPLETE' && (m.status === 'INTAKE_COMPLETE' || m.status === 'INTAKE')) ||
        (statusFilter === 'RESOLVED' && m.status === 'RESOLVED');

      return matchQuery && matchStatus;
    });
  }, [matters, search, statusFilter]);

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
            <Sparkles size={14} /> Multi-Matter Portfolio
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
            Legal Matters Workspace
          </h1>
          <p style={{ fontSize: "15px", color: "#D7DCE5", marginTop: "4px" }}>
            Real-time docket management, statutory limitation deadlines, court pleadings, and advocate coordination.
          </p>
        </div>

        <Link
          href="/dashboard/chat"
          className="btn-primary"
          style={{ fontSize: "14px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={16} /> New Case Intake
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: "flex",
        gap: "14px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{
          position: "relative",
          flex: "1",
          minWidth: "280px",
          maxWidth: "460px",
        }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9AA5B5" }} />
          <input
            type="text"
            placeholder="Search by case title, matter ID, statute, or jurisdiction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#121823",
              border: "1px solid #263142",
              borderRadius: "12px",
              padding: "10px 14px 10px 40px",
              fontSize: "13.5px",
              color: "#FFFFFF",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["ALL", "ACTIVE", "INTAKE_COMPLETE", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? "rgba(59, 130, 246, 0.2)" : "#121823",
                color: statusFilter === st ? "#60A5FA" : "#9AA5B5",
                border: `1px solid ${statusFilter === st ? "#3B82F6" : "#263142"}`,
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "12.5px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Matters List */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#9AA5B5" }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px auto", color: "#3B82F6" }} />
          <p style={{ fontSize: "14px" }}>Loading your legal matters...</p>
        </div>
      ) : filteredMatters.length === 0 ? (
        <div style={{
          background: "#121823",
          border: "1px dashed #263142",
          borderRadius: "16px",
          padding: "60px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#60A5FA",
          }}>
            <Briefcase size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>
              {search || statusFilter !== 'ALL' ? 'No Matching Legal Matters' : 'No Open Legal Matters'}
            </h3>
            <p style={{ fontSize: "14px", color: "#9AA5B5", maxWidth: "440px", margin: "0 auto" }}>
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filter criteria.'
                : 'You have not submitted any legal disputes yet. Launch our AI Case Intake to evaluate merits and generate court-ready notices.'}
            </p>
          </div>
          <Link
            href="/dashboard/chat"
            className="btn-primary"
            style={{ fontSize: "13.5px", padding: "10px 22px", marginTop: "8px" }}
          >
            <Plus size={15} /> Start AI Case Assessment
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredMatters.map((matter) => (
            <Link
              key={matter.id}
              href={`/dashboard/matters/${matter.id}`}
              style={{
                textDecoration: "none",
                background: "#121823",
                border: "1px solid #263142",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#38475C";
                (e.currentTarget as HTMLElement).style.background = "#171E29";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#263142";
                (e.currentTarget as HTMLElement).style.background = "#121823";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#60A5FA", fontWeight: "700", background: "rgba(59, 130, 246, 0.16)", padding: "2px 8px", borderRadius: "6px" }}>
                      {matter.id.slice(0, 10)}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9AA5B5", fontWeight: "600" }}>
                      {matter.jurisdiction || 'India'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
                    {matter.title}
                  </h3>
                </div>

                <span style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: matter.status === 'ACTIVE' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: matter.status === 'ACTIVE' ? '#60A5FA' : '#22C55E',
                  border: `1px solid ${matter.status === 'ACTIVE' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                }}>
                  {matter.status}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1C2433", paddingTop: "12px", fontSize: "13px", color: "#9AA5B5" }}>
                <div>
                  Counsel: <strong style={{ color: "#FFFFFF" }}>{matter.advocate?.name || 'Assigned Counsel'}</strong>
                </div>
                <div style={{ color: "#60A5FA", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                  Open Docket <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
