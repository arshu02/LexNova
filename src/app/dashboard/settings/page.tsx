"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User, Mail, MapPin, CheckCircle2, Copy, Check, Save, ShieldCheck
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState("New Delhi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/user/profile`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setProfileData(data);
            if (data.name) setName(data.name);
            if (data.city) setCity(data.city);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  const handleCopyId = () => {
    const idToCopy = profileData?.id || (session?.user as any)?.id || "usr_lexnova_091823";
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const userId = profileData?.id || (session?.user as any)?.id || "usr_lexnova_091823";
  const userEmail = user?.email || "arshusingh28@gmail.com";
  const userName = name || user?.name || "Arshu Singh";
  const userInitial = userName[0]?.toUpperCase() || "A";

  return (
    <div className="max-w-3xl space-y-6 pb-12 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal profile details, contact preferences, and account ID.</p>
      </div>

      {/* Profile ID Card */}
      <div
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md flex-shrink-0"
            >
              {userInitial}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{userName}</h2>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <CheckCircle2 className="w-3 h-3" /> Verified Account
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">{userEmail}</p>
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">User ID</p>
              <code className="text-xs font-mono text-blue-700 font-semibold">{userId}</code>
            </div>
            <button
              onClick={handleCopyId}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              title="Copy ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        <div
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profile Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">Update your display name and default jurisdiction</p>
            </div>
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> Saved successfully
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm outline-none rounded-xl px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-colors"
                placeholder="Arshu Singh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div
                className="w-full text-sm rounded-xl px-4 py-2.5 text-slate-600 bg-slate-100 border border-slate-200 flex items-center justify-between font-mono"
              >
                <span>{userEmail}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Primary
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City / Legal Jurisdiction</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm outline-none rounded-xl px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-colors"
                placeholder="New Delhi"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl"
            >
              {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
