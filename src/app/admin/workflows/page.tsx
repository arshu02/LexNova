"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  FileCode,
  Layers,
  Sparkles,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminWorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/workflows");
      if (res.ok) {
        const data = await res.json();
        setWorkflows(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleRunWorkflow = async (wfId: string, name: string) => {
    try {
      setExecutingId(wfId);
      // Simulate enterprise automated execution
      await new Promise((r) => setTimeout(r, 1200));
      showToast(`Automation pipeline "${name}" triggered across 4 stages.`);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Enterprise Orchestration Engine
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Legal <span className="text-amber-400">Automation</span> Workflows
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-stage legal procedures, statutory notice dispatchers, and court registry connectors.
          </p>
        </div>

        <button
          onClick={fetchWorkflows}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all self-start"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-amber-400")} />
          <span>Refresh Pipelines</span>
        </button>
      </div>

      {/* Workflows Pipeline Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
          Loading automation pipelines...
        </div>
      ) : (
        <div className="space-y-6">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="p-6 rounded-3xl bg-[#0B0B16] border border-white/5 hover:border-amber-500/30 transition-all space-y-6 shadow-xl"
            >
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">{wf.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {wf.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{wf.description}</p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right hidden sm:block text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Throughput</span>
                    <span className="font-mono text-white font-bold">{wf.executionCount.toLocaleString()} runs</span>
                  </div>
                  <button
                    onClick={() => handleRunWorkflow(wf.id, wf.name)}
                    disabled={executingId === wf.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Play className={cn("w-3.5 h-3.5 fill-current", executingId === wf.id && "animate-spin")} />
                    <span>{executingId === wf.id ? "Triggering..." : "Execute Test"}</span>
                  </button>
                </div>
              </div>

              {/* Stage Flow Nodes */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">
                  Pipeline Execution Stages
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {wf.stages.map((st: any) => (
                    <div
                      key={st.step}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center border border-amber-500/30">
                          {st.step}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          {st.service}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-200 leading-snug">{st.name}</p>
                      <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Automated Node</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
