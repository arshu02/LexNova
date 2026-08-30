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
  ok: { bg: "rgba(34,197,94,0.08)", color: "#16a34a", label: "Compliant", icon: CheckCircle },
  upcoming: { bg: "rgba(245,158,11,0.08)", color: "#d97706", label: "Due Soon", icon: Clock },
  overdue: { bg: "rgba(239,68,68,0.08)", color: "#dc2626", label: "Overdue", icon: AlertTriangle },
};

const PRIORITY_COLOR: Record<string, string> = { high: "#ef4444", normal: "#94a3b8" };

export default function CompliancePage() {
  const [filter, setFilter] = useState<"all" | "overdue" | "upcoming" | "ok">("all");
  const filtered = REGULATIONS.filter(r => filter === "all" || r.status === filter);
  const overdue = REGULATIONS.filter(r => r.status === "overdue").length;
  const upcoming = REGULATIONS.filter(r => r.status === "upcoming").length;
  const ok = REGULATIONS.filter(r => r.status === "ok").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Compliance Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor regulatory deadlines and compliance obligations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Overdue", value: overdue, color: "#ef4444", icon: AlertTriangle },
          { label: "Due Soon", value: upcoming, color: "#f59e0b", icon: Clock },
          { label: "Compliant", value: ok, color: "#22c55e", icon: CheckCircle },
        ].map((s) => (
          <div key={s.label} className="bg-[#0D0D18] rounded-2xl border p-5" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
            </div>
            <p className="text-sm font-bold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-black text-white text-sm uppercase tracking-widest">Active Alerts</h2>
          {ALERTS.map((alert, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ background: alert.severity === "high" ? "rgba(239,68,68,0.05)" : "rgba(245,158,11,0.05)", border: `1px solid ${alert.severity === "high" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)"}` }}>
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: alert.severity === "high" ? "#ef4444" : "#f59e0b" }} />
              <div>
                <p className="font-black text-white text-sm">{alert.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
              </div>
              <button className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                style={{ background: alert.severity === "high" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: alert.severity === "high" ? "#dc2626" : "#d97706" }}>
                Take Action
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Regulations Table */}
      <div className="bg-[#0D0D18] rounded-2xl border" style={{ borderColor: "#E5E7EB" }}>
        <div className="p-5 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: "#F1F5F9" }}>
          <h2 className="font-black text-white">Compliance Checklist</h2>
          <div className="flex gap-2">
            {(["all", "overdue", "upcoming", "ok"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={filter === f
                  ? { background: "linear-gradient(135deg,#1e3a8a,#7C3AED)", color: "white" }
                  : { background: "#F9FAFB", color: "#64748b", border: "1px solid #E5E7EB" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
          {filtered.map((reg) => {
            const ss = STATUS_STYLE[reg.status];
            return (
              <div key={reg.id} className="p-5 flex items-center justify-between hover:bg-[#080810] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_COLOR[reg.priority] }} />
                  <div>
                    <p className="font-bold text-white text-sm">{reg.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{reg.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-xs font-bold text-slate-500">Due: {reg.due}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: ss.bg, color: ss.color }}>
                  <ss.icon className="w-3 h-3" /> {ss.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl text-xs font-medium"
        style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.1)", color: "#1e40af" }}>
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
        AI-assisted compliance monitoring. Always verify with your legal counsel and chartered accountant before taking action on regulatory matters.
      </div>
    </div>
  );
}
