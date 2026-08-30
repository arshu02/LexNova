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
      fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
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
    if (!user?.email) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
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
    <div className="max-w-2xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your profile details and account ID.</p>
      </div>

      {/* Profile ID Card */}
      <div
        className="rounded-xl border p-6 relative overflow-hidden"
        style={{ background: "#0a0a14", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-xl font-bold text-white shadow-lg flex-shrink-0"
              style={{ border: "2px solid rgba(255,255,255,0.1)" }}
            >
              {userInitial}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{userName}</h2>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{userEmail}</p>
            </div>
          </div>

          <div
            className="p-3 rounded-lg border flex items-center gap-3"
            style={{ background: "#080810", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">User ID</p>
              <code className="text-xs font-mono text-purple-300 font-semibold">{userId}</code>
            </div>
            <button
              onClick={handleCopyId}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: "#0a0a14", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Profile Information</h2>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm outline-none rounded-lg px-3.5 py-2.5 text-white transition-colors"
                style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
                placeholder="Arshu Singh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <div
                className="w-full text-sm rounded-lg px-3.5 py-2.5 text-slate-400 flex items-center justify-between font-mono"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span>{userEmail}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm outline-none rounded-lg px-3.5 py-2.5 text-white transition-colors"
                style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.08)" }}
                placeholder="New Delhi"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-black transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
            >
              {saving ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
