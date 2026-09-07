"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Bell, FileText, Eye, ChevronRight, RefreshCw, BarChart3
} from "lucide-react";

const REGULATIONS = [
  { id: 1, title: "GST Filing Deadline", due: "April 20, 2026", status: "upcoming", category: "Tax", priority: "high" },
  { id: 2, title: "Annual Return (MCA)", due: "September 30, 2026", status: "ok", category: "Corporate", priority: "normal" },
  { id: 3, title: "Labour Compliance (POSH)", due: "Annually", status: "overdue", category: "HR", priority: "high" },
  { id: 4, title: "FSSAI License Renewal", due: "June 15, 2026", status: "upcoming", category: "Regulatory", priority: "normal" },
  { id: 5, title: "PF/ESI Monthly Deposit", due: "April 15, 2026", status: "upcoming", category: "HR", priority: "high" },
  { id: 6, title: "Income Tax Advance Payment", due: "June 15, 2026", status: "ok", category: "Tax", priority: "normal" },
];

const ALERTS = [
  { title: "POSH Compliance Overdue", desc: "Annual Internal Complaints Committee report must be submitted.", severity: "high" },
  { title: "GST Filing Due in 20 Days", desc: "Monthly GSTR-3B filing due April 20. Ensure data is reconciled.", severity: "medium" },
  { title: "PF Deposit Due in 15 Days", desc: "Ensure employer and employee PF contributions are deposited.", severity: "medium" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; icon: any }> = {
  ok: { bg: "#ECFDF5", color: "#059669", label: "Compliant", icon: CheckCircle },
  upcoming: { bg: "#FEF3C7", color: "#D97706", label: "Due Soon", icon: Clock },
  overdue: { bg: "#FEE2E2", color: "#DC2626", label: "Overdue", icon: AlertTriangle },
};

const PRIORITY_COLOR: Record<string, string> = { high: "#EF4444", normal: "#94A3B8" };

export default function CompliancePage() {
  const [filter, setFilter] = useState<"all" | "overdue" | "upcoming" | "ok">("all");
  const filtered = REGULATIONS.filter(r => filter === "all" || r.status === filter);
  const overdue = REGULATIONS.filter(r => r.status === "overdue").length;
  const upcoming = REGULATIONS.filter(r => r.status === "upcoming").length;
  const ok = REGULATIONS.filter(r => r.status === "ok").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor regulatory deadlines, statutory filings, and compliance obligations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Overdue", value: overdue, color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", icon: AlertTriangle },
          { label: "Due Soon", value: upcoming, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: Clock },
          { label: "Compliant", value: ok, color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: CheckCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            </div>
            <p className="text-sm font-semibold text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Active Alerts</h2>
          {ALERTS.map((alert, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
              style={{ borderLeft: `4px solid ${alert.severity === "high" ? "#EF4444" : "#F59E0B"}` }}>
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: alert.severity === "high" ? "#DC2626" : "#D97706" }} />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{alert.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
              </div>
              <button className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: alert.severity === "high" ? "#FEE2E2" : "#FEF3C7", color: alert.severity === "high" ? "#DC2626" : "#D97706" }}>
                Take Action
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Regulations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-bold text-slate-900">Compliance Checklist</h2>
          <div className="flex gap-2">
            {(["all", "overdue", "upcoming", "ok"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={filter === f
                  ? { background: "#0F172A", color: "white" }
                  : { background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((reg) => {
            const ss = STATUS_STYLE[reg.status];
            return (
              <div key={reg.id} className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PRIORITY_COLOR[reg.priority] }} />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{reg.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{reg.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-xs font-medium text-slate-600">Due: {reg.due}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{ background: ss.bg, color: ss.color }}>
                  <ss.icon className="w-3.5 h-3.5" /> {ss.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl text-xs font-medium bg-blue-50/80 border border-blue-200 text-blue-900">
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
        AI-assisted compliance monitoring. Always verify with your legal counsel and chartered accountant before taking action on regulatory matters.
      </div>
    </div>
  );
}
