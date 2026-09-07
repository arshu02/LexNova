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
            <Sparkles size={14} /> Multi-Matter Portfolio
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Legal Matters Workspace
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginTop: "4px" }}>
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
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
          <input
            type="text"
            placeholder="Search by case title, matter ID, statute, or jurisdiction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "10px 14px 10px 40px",
              fontSize: "13.5px",
              color: "#0F172A",
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
                background: statusFilter === st ? "#EFF6FF" : "#FFFFFF",
                color: statusFilter === st ? "#2563EB" : "#64748B",
                border: `1px solid ${statusFilter === st ? "#3B82F6" : "#E2E8F0"}`,
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
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px auto", color: "#2563EB" }} />
          <p style={{ fontSize: "14px" }}>Loading your legal matters...</p>
        </div>
      ) : filteredMatters.length === 0 ? (
        <div style={{
          background: "#FFFFFF",
          border: "1px dashed #CBD5E1",
          borderRadius: "16px",
          padding: "60px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563EB",
          }}>
            <Briefcase size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", marginBottom: "6px" }}>
              {search || statusFilter !== 'ALL' ? 'No Matching Legal Matters' : 'No Open Legal Matters'}
            </h3>
            <p style={{ fontSize: "14px", color: "#64748B", maxWidth: "440px", margin: "0 auto" }}>
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
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1";
                (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#2563EB", fontWeight: "700", background: "rgba(37, 99, 235, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                      {matter.id.slice(0, 10)}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                      {matter.jurisdiction || 'India'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                    {matter.title}
                  </h3>
                </div>

                <span style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: matter.status === 'ACTIVE' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  color: matter.status === 'ACTIVE' ? '#2563EB' : '#059669',
                  border: `1px solid ${matter.status === 'ACTIVE' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`,
                }}>
                  {matter.status}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "12px", fontSize: "13px", color: "#64748B" }}>
                <div>
                  Counsel: <strong style={{ color: "#0F172A" }}>{matter.advocate?.name || 'Assigned Counsel'}</strong>
                </div>
                <div style={{ color: "#2563EB", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
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
