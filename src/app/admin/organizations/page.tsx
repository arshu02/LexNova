"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Shield,
  Plus,
  Scale,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgPlan, setNewOrgPlan] = useState("ENTERPRISE");
  const [newOrgSeats, setNewOrgSeats] = useState(50);
  const [creating, setCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/organizations");
      if (res.ok) {
        const data = await res.json();
        setOrgs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;

    try {
      setCreating(true);
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOrgName,
          plan: newOrgPlan,
          maxUsers: newOrgSeats,
        }),
      });

      if (res.ok) {
        showToast(`Enterprise Workspace "${newOrgName}" provisioned.`);
        setNewOrgName("");
        setShowCreateModal(false);
        fetchOrgs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
              Multi-Tenant Institutional Workspaces
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Enterprise <span className="text-blue-400">Organizations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise corporate legal departments, law firm partner seats, and dedicated tenant isolation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Workspace</span>
          </button>
          <button
            onClick={fetchOrgs}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-blue-400")} />
          </button>
        </div>
      </div>

      {/* Provision Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0B0B16] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Provision Enterprise Workspace</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Law Firm / Company Name</label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Shardul & Partners LLP"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07070F] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Tier Tier</label>
                <select
                  value={newOrgPlan}
                  onChange={(e) => setNewOrgPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07070F] border border-white/10 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ENTERPRISE">ENTERPRISE (Full AI & RAG)</option>
                  <option value="BOUTIQUE_FIRM">BOUTIQUE FIRM</option>
                  <option value="LEGAL_DEPT">CORPORATE LEGAL DEPT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Max Member Seats</label>
                <input
                  type="number"
                  value={newOrgSeats}
                  onChange={(e) => setNewOrgSeats(Number(e.target.value))}
                  min={5}
                  max={1000}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07070F] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Confirm & Launch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organizations Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
          Loading organization workspaces...
        </div>
      ) : orgs.length === 0 ? (
        <div className="p-16 text-center text-slate-500 text-xs font-medium rounded-2xl bg-[#0B0B16] border border-white/5">
          No enterprise organizations registered yet. Click &quot;Provision Workspace&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="p-6 rounded-3xl bg-[#0B0B16] border border-white/5 hover:border-blue-500/30 transition-all space-y-5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-lg flex-shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-white text-base">{org.name}</h3>
                      <p className="text-[11px] font-mono text-slate-500">ID: {org.id}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    {org.plan}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                      Enrolled Members
                    </span>
                    <span className="font-bold text-white text-sm">
                      {org.members?.length || 0} active members
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                      Active Case Portfolio
                    </span>
                    <span className="font-bold text-purple-400 text-sm">
                      {org.cases?.length || 0} matters
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>Created {new Date(org.createdAt).toLocaleDateString()}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>Tenant Isolated</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
