"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Shield,
  RefreshCw,
  Terminal,
  Activity,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs?limit=100");
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400">
              ISO 27001 & SOC 2 Compliance Trail
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Security & <span className="text-rose-400">Audit</span> Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable, cryptographically timestamped records of all administrative actions, permission overrides, and user access.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all self-start"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-rose-400")} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Security Compliance Banner */}
      <div className="p-5 rounded-2xl bg-[#0B0B16] border border-rose-500/20 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Immutable Event Logging</p>
            <p className="text-[11px] text-slate-400">
              Entries are permanently recorded for external forensic and statutory audit readiness.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          SOC 2 COMPLIANT
        </span>
      </div>

      {/* Audit Log Stream */}
      <div className="rounded-2xl bg-[#0B0B16] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-400" />
            Streaming audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs font-medium">
            No audit log entries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5 font-mono text-xs">
            {logs.map((entry) => {
              let parsedMeta: any = {};
              try {
                parsedMeta = JSON.parse(entry.message || "{}");
              } catch {
                parsedMeta = entry.message;
              }

              return (
                <div
                  key={entry.id}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                        {entry.type?.replace("AUDIT_", "") || "EVENT"}
                      </span>
                      <span className="font-sans font-bold text-white text-xs">
                        {entry.title?.replace("Audit: ", "")}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans">
                      Actor:{" "}
                      <span className="text-slate-200 font-medium">
                        {entry.user?.name || "System Actor"}
                      </span>{" "}
                      ({entry.user?.email || "internal"}) · Role:{" "}
                      <span className="text-amber-400 font-bold uppercase">
                        {entry.user?.role || "SYSTEM"}
                      </span>
                    </div>

                    {parsedMeta && Object.keys(parsedMeta).length > 0 && (
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-400 font-mono overflow-x-auto max-w-2xl">
                        {JSON.stringify(parsedMeta, null, 2)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-shrink-0 font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(entry.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
