"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Pause, Play, Trash2, Download, CheckCircle2, Shield, Filter } from "lucide-react";

interface LogEntry {
  id: string;
  time: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "DB" | "AUTH" | "AUDIT";
  endpoint: string;
  status: number;
  latencyMs: number;
  ip: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: "1", time: "12:08:42", method: "GET", endpoint: "/api/admin/stats", status: 200, latencyMs: 14, ip: "103.211.54.18" },
  { id: "2", time: "12:08:44", method: "POST", endpoint: "/api/chat (BNS RAG Intake)", status: 200, latencyMs: 382, ip: "49.207.214.90" },
  { id: "3", time: "12:08:45", method: "DB", endpoint: "prisma.matter.findMany({ status: 'ACTIVE' })", status: 200, latencyMs: 6, ip: "internal.db.pool" },
  { id: "4", time: "12:08:47", method: "GET", endpoint: "/api/admin/advocates?verified=true", status: 200, latencyMs: 22, ip: "103.211.54.18" },
  { id: "5", time: "12:08:50", method: "AUTH", endpoint: "NextAuth JWT Session verify (arshusingh26@gmail.com)", status: 200, latencyMs: 4, ip: "103.211.54.18" },
  { id: "6", time: "12:08:52", method: "AUDIT", endpoint: "ADMIN_OVERRIDE: Verified Advocate D/1482/2014", status: 200, latencyMs: 18, ip: "103.211.54.18" },
  { id: "7", time: "12:08:55", method: "GET", endpoint: "/api/matters/DLHC01-004829-2026/limitation", status: 200, latencyMs: 12, ip: "115.112.98.4" },
  { id: "8", time: "12:08:58", method: "POST", endpoint: "/api/payments/verify (Razorpay Settlement ₹1,499)", status: 200, latencyMs: 245, ip: "api.razorpay.com" },
];

export default function LiveTerminalStream() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Live stream simulation
  useEffect(() => {
    if (!isLive) return;

    const endpoints = [
      { method: "GET", endpoint: "/api/admin/telemetry", status: 200, latency: 12 },
      { method: "POST", endpoint: "/api/chat (Section 138 NI Analysis)", status: 200, latency: 410 },
      { method: "DB", endpoint: "prisma.caseNotification.findMany()", status: 200, latency: 5 },
      { method: "GET", endpoint: "/api/hearings/today?court=HighCourt", status: 200, latency: 18 },
      { method: "AUTH", endpoint: "Token Verification (RSA-256 Validated)", status: 200, latency: 3 },
      { method: "POST", endpoint: "/api/documents/generate (Notice PDF)", status: 200, latency: 520 },
      { method: "GET", endpoint: "/api/organizations/org_cm82x/usage", status: 200, latency: 15 },
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const randomEp = endpoints[Math.floor(Math.random() * endpoints.length)];

      const newLog: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        method: randomEp.method as any,
        endpoint: randomEp.endpoint,
        status: randomEp.status,
        latencyMs: randomEp.latency + Math.floor((Math.random() - 0.5) * 6),
        ip: `103.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
      };

      setLogs((prev) => [...prev.slice(-30), newLog]);
    }, 3200);

    return () => clearInterval(interval);
  }, [isLive]);

  // Scroll to bottom on new log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((l) => {
    if (filter === "ALL") return true;
    if (filter === "API") return l.method === "GET" || l.method === "POST" || l.method === "PATCH";
    if (filter === "DB") return l.method === "DB";
    if (filter === "AUTH") return l.method === "AUTH";
    if (filter === "AUDIT") return l.method === "AUDIT";
    return true;
  });

  const getMethodBadge = (m: string) => {
    switch (m) {
      case "GET":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "POST":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "DB":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "AUTH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "AUDIT":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="rounded-2xl bg-[#070A12] border border-slate-800 font-mono text-left shadow-2xl overflow-hidden flex flex-col h-[380px]">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-[#0B0F19] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-slate-400 font-bold tracking-tight text-[11px] flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>live-ingress-stream.stdout</span>
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isLive ? "STREAMING" : "PAUSED"}
          </span>
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex items-center bg-[#06080F] border border-slate-800 rounded-md p-0.5">
            {["ALL", "API", "DB", "AUTH", "AUDIT"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  filter === f ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title={isLive ? "Pause Stream" : "Resume Stream"}
          >
            {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Clear Logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div ref={logContainerRef} className="flex-1 overflow-y-auto p-3 space-y-1 text-[11px] leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-xs">Waiting for inbound event traffic...</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 px-2 py-1 rounded hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-slate-500 flex-shrink-0">{log.time}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold border flex-shrink-0 ${getMethodBadge(
                  log.method
                )}`}
              >
                {log.method}
              </span>
              <span className="text-slate-200 truncate flex-1">{log.endpoint}</span>
              <span className="text-slate-500 text-[10px] hidden md:inline flex-shrink-0">{log.ip}</span>
              <span
                className={`text-[10px] font-bold flex-shrink-0 ${
                  log.latencyMs < 50 ? "text-emerald-400" : log.latencyMs < 300 ? "text-amber-400" : "text-rose-400"
                }`}
              >
                {log.latencyMs}ms
              </span>
              <span className="text-slate-500 text-[10px] flex-shrink-0 font-bold">{log.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
