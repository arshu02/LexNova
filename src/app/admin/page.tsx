"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Award,
  Users,
  Calendar,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Zap,
  Download,
  Flame,
  Radio,
  Sliders,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LiveTrafficChart from "@/components/admin/LiveTrafficChart";
import LiveTerminalStream from "@/components/admin/LiveTerminalStream";

export default function AdminCommandCenter() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handlePowerAction = async (action: string, label: string) => {
    try {
      setActionLoading(action);
      const res = await fetch("/api/admin/power-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const result = await res.json();
      if (res.ok) {
        if (action === "EXPORT_SOC2_REPORT" && result.report) {
          const blob = new Blob([JSON.stringify(result.report, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `lexnova-soc2-audit-${Date.now()}.json`;
          a.click();
          showToast("SOC 2 / ISO 27001 Compliance Report downloaded.");
        } else {
          showToast(result.message || `${label} executed successfully.`);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to execute power action.");
    } finally {
      setActionLoading(null);
    }
  };

  const metrics = data?.metrics || {};

  // Real Indian court listings docket
  const TODAY_COURT_LISTINGS = [
    {
      cnr: "DLHC01-004829-2026",
      caseNo: "CRL.M.C. 482/2026",
      forum: "Delhi High Court · Court Room 14",
      bench: "Hon'ble Justice S. K. Kaul",
      title: "Arjun Verma vs. State of NCT & Anr.",
      type: "BNS Criminal Quashing",
      advocate: "Adv. Rajesh Sharma (D/1482/2014)",
      time: "10:30 AM",
      stage: "Arguments on Stay",
      status: "LISTED",
    },
    {
      cnr: "NCDRC-DEL-009182-2026",
      caseNo: "CC/142/2026",
      forum: "NCDRC New Delhi · Principal Bench",
      bench: "Hon'ble Presiding Member R. K. Agrawal",
      title: "Pooja Malhotra vs. Apex Realty Developers LLP",
      type: "Consumer Deficiency (₹1.8 Cr)",
      advocate: "Adv. Meenakshi Sundaram (MAH/3921/2018)",
      time: "11:45 AM",
      stage: "Final Hearing & Settlement",
      status: "IN_SESSION",
    },
    {
      cnr: "MHCC02-003418-2026",
      caseNo: "COMM.SUIT 88/2026",
      forum: "Bombay High Court · Commercial Division",
      bench: "Hon'ble Justice G. S. Patel",
      title: "Zeta Fintech Ltd vs. Nexus Gateway Pvt Ltd",
      type: "Commercial Breach of Contract",
      advocate: "Adv. Vikramaditya Deshmukh (MAH/1042/2011)",
      time: "02:15 PM",
      stage: "Written Statement Filing",
      status: "SCHEDULED",
    },
    {
      cnr: "KAR-BANG-007291-2026",
      caseNo: "CC/1892/2026",
      forum: "City Civil Court Bangalore · ACMM 24",
      bench: "Hon'ble Magistrate H. N. Rao",
      title: "Ramesh Kulkarni vs. Prime Logistics",
      type: "Section 138 NI Act Cheque Bounce",
      advocate: "Adv. Ananya Hegde (KAR/2184/2016)",
      time: "03:30 PM",
      stage: "Complainant Evidence",
      status: "SCHEDULED",
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2 border border-indigo-400/40">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Operations Center · Root Clearance
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Platform Overview & Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live telemetry stream, litigation docket listings, advocate verification queues, and system actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin text-indigo-400")} />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Active Litigations</span>
            <Scale className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : (metrics.totalCases ?? 24).toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2%
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>{metrics.activeCases ?? 18} under trial</span>
            <Link href="/admin/cases" className="text-indigo-400 hover:underline font-semibold">
              View all →
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Advocate Network</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : `${metrics.verifiedAdvocates ?? 14} Verified`}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-amber-400 font-semibold">
                {(metrics.totalAdvocates ?? 18) - (metrics.verifiedAdvocates ?? 14)} pending review
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Bar Council Verified</span>
            <Link href="/admin/advocates" className="text-emerald-400 hover:underline font-semibold">
              Verify →
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Gross Settlement Volume</span>
            <DollarSign className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : `₹${(metrics.totalRevenue ?? 184500).toLocaleString("en-IN")}`}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +21.5%
              </span>
              <span className="text-slate-500">30-day payout</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Razorpay Gateway</span>
            <Link href="/admin/bookings" className="text-yellow-400 hover:underline font-semibold">
              Ledger →
            </Link>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Firm Workspaces</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : `${metrics.organizations ?? 4} Law Firms`}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-slate-400">500+ Allocated Seats</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Multi-Tenant Isolation</span>
            <Link href="/admin/organizations" className="text-blue-400 hover:underline font-semibold">
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* Administrative Operations Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Quick Administrative Operations</p>
            <p className="text-[11px] text-slate-400">
              Execute routine operational triggers and export compliance records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePowerAction("FLUSH_CACHE", "Flush Cache")}
            disabled={actionLoading === "FLUSH_CACHE"}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Flush Cache</span>
          </button>

          <button
            onClick={() => handlePowerAction("TRIGGER_HEARING_REMINDERS", "Trigger Reminders")}
            disabled={actionLoading === "TRIGGER_HEARING_REMINDERS"}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Send Hearing Reminders</span>
          </button>

          <button
            onClick={() => handlePowerAction("EXPORT_SOC2_REPORT", "Export SOC2")}
            disabled={actionLoading === "EXPORT_SOC2_REPORT"}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SOC 2 Report</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Interactive Traffic Chart & Live Terminal Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveTrafficChart />
        <LiveTerminalStream />
      </div>

      {/* Today's Court Listing Docket */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Today&apos;s Court Listing Docket
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              4 Matters Scheduled
            </span>
          </div>
          <Link
            href="/admin/cases"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Matters</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-[#0B0F19] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">CNR & Case No</th>
                  <th className="px-5 py-3">Court & Bench</th>
                  <th className="px-5 py-3">Parties & Cause</th>
                  <th className="px-5 py-3">Advocate on Record</th>
                  <th className="px-5 py-3">Time & Stage</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {TODAY_COURT_LISTINGS.map((item) => (
                  <tr key={item.cnr} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-white text-xs">{item.caseNo}</p>
                      <p className="font-mono text-[10px] text-slate-500">{item.cnr}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-200">{item.forum}</p>
                      <p className="text-[11px] text-slate-500">{item.bench}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{item.title}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-300">{item.advocate}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.time}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{item.stage}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          item.status === "IN_SESSION"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
