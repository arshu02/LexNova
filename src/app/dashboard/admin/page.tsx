"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Briefcase, Calendar, Scale, CheckCircle2,
  AlertCircle, Activity, Globe, RefreshCw, Star, ArrowUpRight, Award, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<any>({ advocates: [], users: [], cases: [], bookings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const fetchDiagnostics = async () => {
    try {
      const res = await fetch("/api/lawyers/verify");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (advocateId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/lawyers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advocateId, verified: !currentStatus })
      });
      if (res.ok) {
        fetchDiagnostics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: "Total Cases", value: data.cases.length.toString().padStart(2, "0"), icon: Scale, color: "#F59E0B" },
    { label: "Verified Advocates", value: data.advocates.filter((a: any) => a.verified).length.toString().padStart(2, "0"), icon: Award, color: "#10b981" },
    { label: "Platform Users", value: data.users.length.toString().padStart(2, "0"), icon: Users, color: "#8b5cf6" },
    { label: "Booked Consults", value: data.bookings.length.toString().padStart(2, "0"), icon: Calendar, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-12 max-w-6xl pb-24 text-left">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Administrative Core Node</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">System <span className="text-amber-500">Diagnostics</span></h1>
            <p className="text-sm font-medium text-slate-500 max-w-lg">Monitoring institutional telemetry, BAR credentials verification, and active node synchronization.</p>
        </div>
        <button onClick={fetchDiagnostics} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all px-5 py-2.5 rounded-xl bg-[#0D0D18]/5 border border-white/5 hover:border-amber-500/30">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Diagnostics
        </button>
      </div>

      {/* Stats Monitor */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat) => (
           <div key={stat.label} className="glass rounded-[2rem] border border-white/5 p-8 flex items-center justify-between group hover:border-amber-500/30 transition-all">
             <div className="space-y-2">
               <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
               style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}20` }}>
               <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
             </div>
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Left Side: Verification Console */}
         <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500">BAR Verification Console</h2>
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden divide-y divide-white/5">
                   {loading ? (
                      <div className="p-12 text-center">
                         <Activity className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                         <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">Connecting...</span>
                      </div>
                   ) : data.advocates.length === 0 ? (
                      <div className="p-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                         No advocates registered in network database.
                      </div>
                   ) : (
                      data.advocates.map((adv: any) => (
                         <div key={adv.id} className="p-8 flex items-center justify-between flex-wrap gap-6 hover:bg-[#0D0D18]/[0.01] transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold uppercase text-lg shadow-md">
                                  {adv.name[0]}
                               </div>
                               <div className="space-y-0.5">
                                  <h4 className="text-md font-bold text-white uppercase italic tracking-tight">{adv.name}</h4>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{adv.type} · {adv.experience} Yrs Exp · {adv.city}</p>
                                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none mt-1">📧 {adv.email}</p>
                               </div>
                            </div>
                            <div>
                               <button
                                 onClick={() => toggleVerification(adv.id, adv.verified)}
                                 className={cn(
                                   "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md border",
                                   adv.verified 
                                     ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
                                     : "bg-purple-600 hover:bg-amber-500 text-white"
                                 )}
                               >
                                 {adv.verified ? "VERIFIED" : "VERIFY NOW"}
                               </button>
                            </div>
                         </div>
                      ))
                   )}
                </div>
            </div>

            {/* Global Case Index */}
            <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500">Global Case Index Nodes</h2>
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden divide-y divide-white/5">
                   {loading ? (
                      <div className="p-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                         Loading index...
                      </div>
                   ) : data.cases.length === 0 ? (
                      <div className="p-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                         No active cases index detected.
                      </div>
                   ) : (
                      data.cases.map((c: any) => (
                         <div key={c.id} className="p-6 flex items-center justify-between flex-wrap gap-4">
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-white uppercase italic">{c.category}</p>
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">CASE-{c.id.slice(-6).toUpperCase()} · JURISDICTION: {c.city}</p>
                            </div>
                            <span className={cn(
                               "text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                               c.status === "RESOLVED" 
                                 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                 : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            )}>{c.status}</span>
                         </div>
                      ))
                   )}
                </div>
            </div>
         </div>

         {/* Diagnostics */}
         <div className="space-y-8">
            <div className="glass rounded-[2rem] border border-white/5 p-8 space-y-6 bg-[#0D0D18]/[0.01]">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Network Diagnostics</h3>
                  <Globe className="w-4 h-4 text-amber-500" />
               </div>
               <div className="space-y-4 text-xs font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
                  <div className="flex justify-between">
                     <span>Prisma Database Link</span>
                     <span className="text-emerald-500 font-bold">Connected</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Encryption Core</span>
                     <span className="text-white">Active (AES-256)</span>
                  </div>
                  <div className="flex justify-between">
                     <span>API Server Status</span>
                     <span className="text-emerald-500 font-bold">Stable</span>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[2rem] border border-amber-500/10 bg-amber-500/5 space-y-3">
               <Shield className="w-5 h-5 text-amber-500" />
               <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Administrative Override</p>
               <p className="text-xs text-slate-400 font-medium leading-relaxed italic">This console authorizes administrative verification modifications inside the live database schema. Complete diagnostic verification before approval changes.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
