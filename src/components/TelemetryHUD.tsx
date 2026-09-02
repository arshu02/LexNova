"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Globe,
  Zap,
  Server,
  Database,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TelemetryHUD() {
  const [throughput, setThroughput] = useState(2480);
  const [activeConnections, setActiveConnections] = useState(1842);
  const [tokenVelocity, setTokenVelocity] = useState(482);
  const [cacheHitRate, setCacheHitRate] = useState(99.8);
  const [lastPing, setLastPing] = useState(12);

  // Live simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput((prev) => Math.max(2100, Math.min(3200, prev + Math.floor((Math.random() - 0.48) * 45))));
      setActiveConnections((prev) => Math.max(1600, Math.min(2400, prev + Math.floor((Math.random() - 0.48) * 12))));
      setTokenVelocity((prev) => Math.max(380, Math.min(620, prev + Math.floor((Math.random() - 0.5) * 20))));
      setLastPing((prev) => Math.max(9, Math.min(18, prev + Math.floor((Math.random() - 0.5) * 3))));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { region: "Mumbai (BOM1)", code: "ap-south-1", ping: `${lastPing}ms`, status: "OPTIMAL", color: "#10B981" },
    { region: "Singapore (SIN1)", code: "ap-southeast-1", ping: `${lastPing + 18}ms`, status: "OPTIMAL", color: "#10B981" },
    { region: "Frankfurt (FRA1)", code: "eu-central-1", ping: `${lastPing + 98}ms`, status: "HEALTHY", color: "#6366F1" },
    { region: "US-East (IAD1)", code: "us-east-1", ping: `${lastPing + 132}ms`, status: "HEALTHY", color: "#6366F1" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Enterprise Node Status */}
      <div className="p-6 rounded-3xl bg-[#090914] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    LEXNOVA HIGH-THROUGHPUT ENGINE
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LIVE STREAM
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Distributed multi-region legal orchestration cluster · Active SLA: 99.99%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-bold">{throughput.toLocaleString()} req/s</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span>{tokenVelocity} tok/s</span>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Quad */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                Concurrent Nodes
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {activeConnections.toLocaleString()}
              </p>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                +14.2% peak surge
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                Cache Hit Ratio
              </span>
              <p className="text-2xl font-black text-emerald-400 tracking-tight">
                {cacheHitRate}%
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                Sliding-Window L1/L2
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                Avg Network RTT
              </span>
              <p className="text-2xl font-black text-amber-400 tracking-tight">
                {lastPing}ms
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                Edge Ingress Latency
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                Statutory RAG Index
              </span>
              <p className="text-2xl font-black text-cyan-400 tracking-tight">
                84,290+
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                Indian Acts & Precedents
              </span>
            </div>
          </div>

          {/* Regional Edge Node Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Regional Ingress Endpoints
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                All 4 clusters synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nodes.map((node) => (
                <div
                  key={node.code}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{node.region}</p>
                    <p className="text-[10px] font-mono text-slate-500 truncate">{node.code}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-300 block">
                      {node.ping}
                    </span>
                    <span
                      className="text-[8px] font-black uppercase tracking-wider block"
                      style={{ color: node.color }}
                    >
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
