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
  { href: '/dashboard/advocate',  icon: ShieldCheck,     label: 'Lawyer Console' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[250px] bg-white border-r border-slate-200 flex flex-col z-40 shadow-xs">
      
      {/* Brand Header */}
      <Link 
        href="/" 
        className="p-5 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors group cursor-pointer"
        title="Go to LexNova Homepage"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
          <Scale size={18} />
        </div>
        <div>
          <div className="text-[16px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            LexNova
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-md tracking-wider uppercase">
              2.5
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            AI Legal Operating System
          </p>
        </div>
      </Link>

      {/* Start New Matter Action CTA Button */}
      <div className="p-4 pb-2">
        <Link
          href="/dashboard/chat"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-semibold transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Plus size={15} className="text-white group-hover:rotate-90 transition-transform" />
            <span>New Case Matter</span>
          </div>
          <ChevronRight size={14} className="text-blue-200 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
        <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
          Workspace Hub
        </div>

        {NAV_MAIN.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard/user' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border border-blue-200/80 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.4)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-xs">
              {session?.user?.name ? session.user.name[0].toUpperCase() : (session?.user?.email ? session.user.email[0].toUpperCase() : 'U')}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 truncate">
                {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {session?.user?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try { await supabase.auth.signOut(); } catch (e) {}
              await signOut({ callbackUrl: '/auth/login' });
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
