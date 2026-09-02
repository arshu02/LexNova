"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Zap,
  Mail,
  DollarSign,
  Brain,
  Shield,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingGroup {
  label: string;
  icon: React.ReactNode;
  color: string;
  settings: {
    key: string;
    label: string;
    description: string;
    type: "toggle" | "text" | "number" | "select";
    options?: string[];
  }[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    label: "AI Engine",
    icon: <Brain className="h-4 w-4" />,
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    settings: [
      { key: "ai.maxFreeQuestions", label: "Free AI Questions Limit", description: "Max AI chats allowed per free user per month", type: "number" },
      { key: "ai.maxFreeDocuments", label: "Free Documents Limit", description: "Max documents allowed for free users", type: "number" },
      { key: "ai.model", label: "AI Model", description: "Which Claude model to use for legal analysis", type: "select", options: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"] },
      { key: "ai.maxTokens", label: "Max Tokens per Response", description: "Maximum token count for AI responses", type: "number" },
    ],
  },
  {
    label: "Email & Notifications",
    icon: <Mail className="h-4 w-4" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    settings: [
      { key: "email.fromEmail", label: "From Email Address", description: "Default sender email for all platform emails", type: "text" },
      { key: "email.supportEmail", label: "Support Email", description: "Email shown to users for support", type: "text" },
      { key: "email.bookingConfirmations", label: "Booking Confirmations", description: "Send email confirmations when a booking is made", type: "toggle" },
      { key: "email.weeklyDigest", label: "Weekly Digest", description: "Send weekly activity digest to users", type: "toggle" },
    ],
  },
  {
    label: "Payments & Revenue",
    icon: <DollarSign className="h-4 w-4" />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    settings: [
      { key: "payment.proPlanPriceINR", label: "Pro Plan Price (INR/mo)", description: "Monthly price of the Pro plan", type: "number" },
      { key: "payment.businessPlanPriceINR", label: "Business Plan Price (INR/mo)", description: "Monthly price of the Business plan", type: "number" },
      { key: "payment.lawyerCommissionPct", label: "Platform Commission (%)", description: "Percentage the platform takes on each consultation", type: "number" },
    ],
  },
  {
    label: "Feature Flags",
    icon: <Zap className="h-4 w-4" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    settings: [
      { key: "feature.documentGeneration", label: "Document Generation", description: "Allow users to generate legal documents with AI", type: "toggle" },
      { key: "feature.lawyerMarketplace", label: "Lawyer Marketplace", description: "Allow users to browse and book advocates", type: "toggle" },
      { key: "feature.hindiLanguage", label: "Hindi Language Support", description: "Enable Hindi language interface (beta)", type: "toggle" },
      { key: "feature.voiceInput", label: "Voice Input", description: "Allow voice-to-text for legal queries (beta)", type: "toggle" },
    ],
  },
  {
    label: "Maintenance Mode",
    icon: <Shield className="h-4 w-4" />,
    color: "from-red-500/20 to-rose-500/20 border-red-500/30",
    settings: [
      { key: "maintenance.enabled", label: "Maintenance Mode", description: "Show a maintenance banner to all users", type: "toggle" },
      { key: "maintenance.message", label: "Maintenance Message", description: "Message to display during maintenance", type: "text" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings || {});
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getValue = (key: string) => dirty[key] ?? settings[key] ?? "";

  const setValue = (key: string, value: string) => {
    setDirty(prev => ({ ...prev, [key]: value }));
  };

  const toggleValue = (key: string) => {
    const current = getValue(key);
    setValue(key, current === "true" ? "false" : "true");
  };

  const hasPendingChanges = Object.keys(dirty).length > 0;

  const saveAll = async () => {
    if (!hasPendingChanges) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: dirty }),
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...dirty }));
        setDirty({});
        showToast("✅ All settings saved successfully");
      } else {
        showToast("Failed to save settings", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 text-slate-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Settings className="h-5 w-5 text-amber-400" />
              </div>
              Platform Settings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure AI engine, pricing, email, features, and maintenance
            </p>
          </div>
          {hasPendingChanges && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {Object.keys(dirty).length} unsaved change{Object.keys(dirty).length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setDirty({})}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-all"
              >
                Discard
              </button>
              <button
                onClick={saveAll}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-sm font-medium transition-all disabled:opacity-60"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-4xl">
        {SETTING_GROUPS.map(group => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className={cn("p-2 rounded-lg bg-gradient-to-br border", group.color)}>
                {group.icon}
              </div>
              <h2 className="font-semibold text-white">{group.label}</h2>
            </div>

            <div className="divide-y divide-white/5">
              {group.settings.map(setting => {
                const value = getValue(setting.key);
                const isDirty = setting.key in dirty;

                return (
                  <div key={setting.key} className={cn("flex items-center justify-between px-6 py-4 gap-4", isDirty && "bg-amber-500/5")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{setting.label}</p>
                        {isDirty && <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">Modified</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{setting.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      {setting.type === "toggle" ? (
                        <button
                          onClick={() => toggleValue(setting.key)}
                          className={cn(
                            "relative w-12 h-6 rounded-full border transition-all duration-200",
                            value === "true"
                              ? "bg-emerald-500/30 border-emerald-500/50"
                              : "bg-white/5 border-white/10"
                          )}
                        >
                          <motion.div
                            animate={{ x: value === "true" ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={cn(
                              "absolute top-1 h-4 w-4 rounded-full transition-colors",
                              value === "true" ? "bg-emerald-400" : "bg-slate-500"
                            )}
                          />
                        </button>
                      ) : setting.type === "select" ? (
                        <select
                          value={value}
                          onChange={e => setValue(setting.key, e.target.value)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-w-[200px]"
                        >
                          {setting.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : setting.type === "number" ? (
                        <input
                          type="number"
                          value={value}
                          onChange={e => setValue(setting.key, e.target.value)}
                          className="w-28 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 text-right focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={e => setValue(setting.key, e.target.value)}
                          className="w-64 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border",
              toast.type === "success"
                ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-200"
                : "bg-red-900/90 border-red-500/30 text-red-200"
            )}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
