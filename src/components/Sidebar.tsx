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
    <aside className="fixed top-0 left-0 bottom-0 w-[250px] bg-[#06080F] border-r border-white/[0.08] flex flex-col z-40">
      
      {/* Brand Header */}
      <Link 
        href="/" 
        className="p-5 border-b border-white/[0.06] flex items-center gap-3 hover:bg-white/[0.02] transition-colors group cursor-pointer"
        title="Go to LexNova Homepage"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
          <Scale size={18} />
        </div>
        <div>
          <div className="text-[16px] font-bold text-white tracking-tight flex items-center gap-1.5">
            LexNova
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.2 rounded-md tracking-wider uppercase">
              2.5
            </span>
          </div>
          <p className="text-[11px] text-[#6B7B94] font-medium mt-0.5">
            AI Legal Operating System
          </p>
        </div>
      </Link>

      {/* Start New Matter Action CTA Button */}
      <div className="p-4 pb-2">
        <Link
          href="/dashboard/chat"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/10 hover:from-blue-600/30 hover:to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/50 text-white text-[13.5px] font-semibold transition-all shadow-md group"
        >
          <div className="flex items-center gap-2">
            <Plus size={15} className="text-blue-400 group-hover:rotate-90 transition-transform" />
            <span>New Case Matter</span>
          </div>
          <ChevronRight size={14} className="text-[#8D9CB0] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
        <div className="text-[10.5px] font-bold text-[#55667E] uppercase tracking-wider px-3 py-2">
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
                  ? 'text-white bg-blue-600/15 border border-blue-500/30 shadow-sm'
                  : 'text-[#8D9CB0] hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-blue-400' : 'text-[#6B7B94]'} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3B82F6]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-[#04060B]">
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm">
              {session?.user?.name ? session.user.name[0].toUpperCase() : (session?.user?.email ? session.user.email[0].toUpperCase() : 'U')}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white truncate">
                {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-[11px] text-[#6B7B94] truncate">
                {session?.user?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try { await supabase.auth.signOut(); } catch (e) {}
              await signOut({ callbackUrl: '/auth/login' });
            }}
            className="p-1.5 text-[#8D9CB0] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
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
