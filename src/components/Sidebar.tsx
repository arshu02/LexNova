'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';
import {
  Scale, LayoutDashboard, MessageSquare, Briefcase,
  FileText, Users, Calendar, Settings, ShieldCheck,
  LogOut, ChevronRight, Sparkles, Plus, ExternalLink, Building2
} from 'lucide-react';

const NAV_MAIN = [
  { href: '/dashboard/user',      icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/matters',   icon: Briefcase,       label: 'Matters Workspace' },
  { href: '/dashboard/chat',      icon: MessageSquare,   label: 'AI Case Intake' },
  { href: '/dashboard/documents', icon: FileText,        label: 'Documents Studio' },
  { href: '/dashboard/advocates', icon: Users,           label: 'Find an Advocate' },
  { href: '/dashboard/bookings',  icon: Calendar,        label: 'Consultations' },
  { href: '/dashboard/team',      icon: Building2,       label: 'Team & API' },
  { href: '/dashboard/settings',  icon: Settings,        label: 'Settings' },
  { href: '/dashboard/advocate',  icon: ShieldCheck,     label: 'Lawyer Console' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdminUser = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-white border-r border-slate-200/90 flex flex-col z-40 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      
      {/* Brand Header */}
      <Link 
        href="/" 
        className="p-5 border-b border-slate-100/80 flex items-center gap-3.5 hover:bg-slate-50/70 transition-colors group cursor-pointer"
        title="LexNova Global AI Legal OS"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
          <Scale size={20} />
        </div>
        <div>
          <div className="text-[16px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            LexNova
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/90 px-1.5 py-0.5 rounded-md tracking-wider uppercase">
              2.5 Pro
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Legal OS Online</span>
          </p>
        </div>
      </Link>

      {/* Primary Action Button */}
      <div className="p-4 pb-2">
        <Link
          href="/dashboard/chat"
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13.5px] font-semibold transition-all shadow-sm shadow-blue-500/20 group hover:shadow-md hover:shadow-blue-500/30"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-blue-200 group-hover:rotate-12 transition-transform" />
            <span>New Case Intake</span>
          </div>
          <ChevronRight size={14} className="text-blue-200 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1 scrollbar-none">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 flex items-center justify-between">
          <span>Workspace Hub</span>
          <span className="text-[10px] text-slate-400 font-mono">v2.5</span>
        </div>

        {NAV_MAIN.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard/user' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all ${
                isActive
                  ? 'text-blue-600 bg-blue-50/90 border border-blue-200/90 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
              )}
            </Link>
          );
        })}

        {/* Institutional Admin Direct Access Shortcut */}
        {isAdminUser && (
          <div className="pt-3 mt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider px-3 py-1.5">
              Supervision
            </div>
            <Link
              href="/admin"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-amber-900 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 hover:border-amber-300 shadow-xs transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Institutional Admin</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 uppercase">
                Root
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* User Session Footer */}
      <div className="p-3.5 border-t border-slate-200/90 bg-slate-50/70">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[12.5px] font-bold shrink-0 shadow-xs">
              {session?.user?.name ? session.user.name[0].toUpperCase() : (session?.user?.email ? session.user.email[0].toUpperCase() : 'U')}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 truncate">
                {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span className="capitalize">{userRole ? userRole.toLowerCase().replace('_', ' ') : 'Client'}</span>
                <span>•</span>
                <span>Tier: Pro</span>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try { await supabase.auth.signOut(); } catch (e) {}
              await signOut({ callbackUrl: '/auth/login' });
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Sign out of account"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
