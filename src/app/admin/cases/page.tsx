"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Search,
  Filter,
  RefreshCw,
  FolderOpen,
  FileText,
  Calendar,
  User,
  Shield,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/cases?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleUpdateStatus = async (caseId: string, status: string) => {
    try {
      setActionLoading(caseId);
      const res = await fetch("/api/admin/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, status }),
      });
      if (res.ok) {
        showToast(`Case status updated to ${status}`);
        fetchCases();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400">
              Institutional Case Repository
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Global <span className="text-purple-400">Cases</span> Index
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise all legal matters, manage case states, and inspect document volumes across jurisdictions.
          </p>
        </div>

        <button
          onClick={fetchCases}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all self-start"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-purple-400")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "INTAKE", "ACTIVE", "RESOLVED", "CLOSED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
              statusFilter === status
                ? "bg-purple-600 text-white border-purple-500 shadow-md"
                : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:border-white/15"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl bg-[#0B0B16] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-4">Case File</th>
                <th className="p-4">Client</th>
                <th className="p-4">Assigned Counsel</th>
                <th className="p-4">Artifacts</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">State Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
                    Loading cases repository...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No legal cases found matching filter.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Case Title & Type */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white truncate max-w-[220px]">
                          {c.title || "Legal Matter"}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          CASE-{c.id.slice(-6).toUpperCase()} · {c.jurisdiction || "India"}
                        </p>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">{c.user?.name || "Client"}</p>
                        <p className="text-[10px] text-slate-500">{c.user?.email}</p>
                      </div>
                    </td>

                    {/* Advocate */}
                    <td className="p-4">
                      {c.advocate ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-amber-400">{c.advocate.name}</p>
                          <p className="text-[10px] text-slate-500">{c.advocate.specialization || "Counsel"}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Artifacts Counts */}
                    <td className="p-4 text-slate-400 font-medium">
                      <span className="text-white font-bold">{c._count?.documents || 0}</span> docs ·{" "}
                      <span className="text-white font-bold">{c._count?.hearings || 0}</span> hearings
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                          c.status === "ACTIVE"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : c.status === "RESOLVED"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : c.status === "INTAKE"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : "bg-slate-500/10 border-slate-500/30 text-slate-400"
                        )}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <select
                        value={c.status}
                        disabled={actionLoading === c.id}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10 bg-[#080812] text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        <option value="INTAKE">INTAKE</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
