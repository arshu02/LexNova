import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Users,
  Briefcase,
  Calendar,
  Scale,
  Activity,
  Lock,
  UserCheck,
  ExternalLink,
  Sliders,
  Building2,
  Zap,
  Settings,
  Crown,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Operations",
    items: [
      { href: "/admin", label: "Command Center", icon: Activity, iconColor: "text-indigo-400" },
      { href: "/admin/cases", label: "Cases & Litigation", icon: Scale, iconColor: "text-blue-400" },
      { href: "/admin/bookings", label: "Consultations", icon: Calendar, iconColor: "text-cyan-400" },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/admin/users", label: "User Accounts", icon: Users, iconColor: "text-slate-300" },
      { href: "/admin/advocates", label: "Bar Verification", icon: UserCheck, iconColor: "text-emerald-400" },
      { href: "/admin/organizations", label: "Law Firm Workspaces", icon: Building2, iconColor: "text-blue-400" },
    ],
  },
  {
    title: "Security & Config",
    items: [
      { href: "/admin/workflows", label: "Legal Workflows", icon: Zap, iconColor: "text-amber-400" },
      { href: "/admin/audit-logs", label: "Audit Logs (SOC 2)", icon: Lock, iconColor: "text-slate-400" },
      { href: "/admin/settings", label: "Platform Settings", icon: Settings, iconColor: "text-rose-400" },
      { href: "/admin/profile", label: "Admin Profile", icon: Sliders, iconColor: "text-slate-400" },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const adminName = session.user.name || "Administrator";
  const adminEmail = session.user.email || "";
  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 px-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900">LexNova</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Admin Console
              </span>
              {isSuperAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" /> Super Admin
                </span>
              )}
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-200 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-600">
              PRODUCTION · AP-SOUTH-1 (MUMBAI) · LIVE
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all"
          >
            <span>Client View</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
              {adminName[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{adminName}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">{adminEmail}</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-60 border-r border-slate-200 bg-white p-3.5 hidden md:flex flex-col justify-between flex-shrink-0 shadow-xs">
          <div className="space-y-5">
            {NAV_SECTIONS.map(section => (
              <div key={section.title} className="space-y-0.5">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {section.title}
                </p>
                {section.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all group"
                    >
                      <Icon className={`w-4 h-4 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700 mb-1">
                <span>SECURITY</span>
                <span>ACTIVE</span>
              </div>
              <p className="text-[10px] text-emerald-600 leading-snug">
                Zero-trust RBAC · TLS 1.3 · AES-256
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-700 mb-1">
                <span>AI ENGINE</span>
                <span className="text-emerald-700">ONLINE</span>
              </div>
              <p className="text-[10px] text-indigo-600 leading-snug">
                Claude 3.5 Sonnet · Rate-limited
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
