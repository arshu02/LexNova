"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Video,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (paymentFilter !== "ALL") params.append("paymentStatus", paymentFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [paymentFilter]);

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((acc, b) => acc + (b.consultationFee || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400">
              Consultations & Financial Ledger
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bookings & <span className="text-yellow-400">Revenue</span> Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track all lawyer-client consultations, monitor Razorpay settlements, and access session meet links.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all self-start"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-yellow-400")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Revenue Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0B0B16] to-[#0B0B16] border border-amber-500/20 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Total Settled Revenue (Filtered)
          </span>
          <p className="text-3xl font-black text-white tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Consults</span>
            <span className="text-base font-bold text-white">{bookings.length}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Paid Rate</span>
            <span className="text-base font-bold text-emerald-400">
              {bookings.length > 0
                ? Math.round((bookings.filter((b) => b.paymentStatus === "PAID").length / bookings.length) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"].map((st) => (
          <button
            key={st}
            onClick={() => setPaymentFilter(st)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
              paymentFilter === st
                ? "bg-yellow-500 text-slate-950 font-black border-yellow-400 shadow-md"
                : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:border-white/15"
            )}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-[#0B0B16] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-4">Ref Code</th>
                <th className="p-4">Client</th>
                <th className="p-4">Advocate</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Meeting Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-yellow-400" />
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    No bookings found matching filter.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Confirmation Code */}
                    <td className="p-4 font-mono font-bold text-amber-400 text-xs">
                      {b.confirmationCode || `LN-${b.id.slice(-6).toUpperCase()}`}
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-white">{b.user?.name || "Client"}</p>
                        <p className="text-[10px] text-slate-500">{b.user?.email}</p>
                      </div>
                    </td>

                    {/* Advocate */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">{b.advocate?.name || "Advocate"}</p>
                        <p className="text-[10px] text-slate-500">{b.advocate?.city}</p>
                      </div>
                    </td>

                    {/* Date/Time */}
                    <td className="p-4 text-slate-300 font-medium">
                      <div>{b.date || "Scheduled"}</div>
                      <div className="text-[10px] text-slate-500">{b.time} ({b.duration || 60} mins)</div>
                    </td>

                    {/* Consultation Fee */}
                    <td className="p-4 font-bold text-white">
                      ₹{(b.consultationFee || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Payment Status */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                          b.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : b.paymentStatus === "PENDING"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        )}
                      >
                        {b.paymentStatus || "PENDING"}
                      </span>
                    </td>

                    {/* Meet Link */}
                    <td className="p-4 text-right">
                      {b.meetLink ? (
                        <a
                          href={b.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-[11px] font-bold transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Room</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs italic">N/A</span>
                      )}
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
