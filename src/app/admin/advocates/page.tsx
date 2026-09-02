"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Scale,
  ShieldCheck,
  Building,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAdvocatesPage() {
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifiedFilter, setVerifiedFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (verifiedFilter === "VERIFIED") params.append("verified", "true");
      if (verifiedFilter === "PENDING") params.append("verified", "false");

      const res = await fetch(`/api/admin/advocates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        // Support both legacy array response and new paginated format
        setAdvocates(Array.isArray(data) ? data : (data.advocates || []));
      }
    } catch (err) {
      console.error("Failed to load advocates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [verifiedFilter]);

  const handleToggleVerification = async (advocateId: string, currentStatus: boolean) => {
    try {
      setActionLoading(advocateId);
      const res = await fetch("/api/admin/advocates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advocateId, verified: !currentStatus }),
      });
      if (res.ok) {
        showToast(!currentStatus ? "Advocate verified successfully" : "Verification revoked");
        fetchAdvocates();
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Bar Council Credentials
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            BAR <span className="text-emerald-400">Verification</span> Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verify legal practitioner licenses, inspect enrollment details, and authorize counsel nodes.
          </p>
        </div>

        <button
          onClick={fetchAdvocates}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all self-start"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-emerald-400")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { label: "All Advocates", val: "ALL" },
          { label: "Verified Only", val: "VERIFIED" },
          { label: "Pending Review", val: "PENDING" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setVerifiedFilter(tab.val)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
              verifiedFilter === tab.val
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:border-white/15"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advocates Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          Loading advocate directory...
        </div>
      ) : advocates.length === 0 ? (
        <div className="p-16 text-center text-slate-500 text-xs font-medium rounded-2xl bg-[#0B0B16] border border-white/5">
          No advocates found matching the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {advocates.map((adv) => (
            <div
              key={adv.id}
              className="p-6 rounded-2xl bg-[#0B0B16] border border-white/5 hover:border-emerald-500/30 transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-base flex-shrink-0">
                      {adv.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-white text-sm">{adv.name}</h3>
                      <p className="text-[11px] text-slate-400">{adv.email || adv.user?.email}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{adv.city} · {adv.experience} Yrs Experience</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1",
                      adv.verified
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    )}
                  >
                    {adv.verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {adv.verified ? "VERIFIED" : "PENDING"}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                      Specialization
                    </span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {adv.specialization || adv.type || "General Practice"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                      Consultation Fee
                    </span>
                    <span className="font-semibold text-amber-400 block">
                      ₹{adv.consultationFee || 1499} / session
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                      Bar Council License Ref
                    </span>
                    <span className="font-mono text-slate-300 text-[11px] block">
                      {adv.barNumber || `BCI/${adv.city?.slice(0, 3).toUpperCase() || "IND"}/${adv.id.slice(-6).toUpperCase()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {adv._count?.bookings || 0} consultations completed
                </span>

                <button
                  onClick={() => handleToggleVerification(adv.id, adv.verified)}
                  disabled={actionLoading === adv.id}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border",
                    adv.verified
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                      : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-md"
                  )}
                >
                  {adv.verified ? "Revoke Verification" : "Approve & Verify"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
