"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Shield,
  Key,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        setName(data.admin.name || "");
        setCity(data.admin.city || "");
        setPhone(data.admin.phone || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      if (newPassword && newPassword !== confirmPassword) {
        showToast("New passwords do not match.", "error");
        setSaving(false);
        return;
      }

      const payload: any = { name, city, phone };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        showToast("Admin profile & credentials updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        fetchProfile();
      } else {
        showToast(result.error || "Failed to update profile.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error updating profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Toast */}
      {toastMessage && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2",
            toastMessage.type === "success" ? "bg-amber-400" : "bg-rose-500 text-white"
          )}
        >
          {toastMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">
              Administrative Credentials Hub
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin <span className="text-indigo-600">Profile</span> & Security
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your root administrative profile, credential keys, and session parameters.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all self-start shadow-xs"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-indigo-600")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Clearance Overview Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black flex items-center justify-center text-lg shadow-xs">
            {admin?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900">{admin?.name || "Administrator"}</h2>
            <p className="text-xs text-slate-500">{admin?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                ROLE: {admin?.role || "ADMIN"}
              </span>
              <span className="text-[10px] text-slate-400">ID: {admin?.id}</span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Clearance</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1.5 justify-end">
            <Fingerprint className="w-4 h-4 text-emerald-600" /> Full Institutional Access
          </span>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Profile Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Administrative Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Admin Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">City / Jurisdiction</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Official Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Security Credentials & Password
            </h3>
            <p className="text-[11px] text-slate-500">
              Leave blank if you do not wish to change your password.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Save className={cn("w-4 h-4", saving && "animate-spin")} />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
