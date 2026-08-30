'use client';
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
    <aside style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: '250px',
      background: '#0D1118',
      borderRight: '1px solid #263142',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Logo -> Redirects to Main Page */}
      <Link 
        href="/" 
        style={{
          textDecoration: 'none',
          padding: '20px 20px',
          borderBottom: '1px solid #263142',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'background 0.15s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#121823';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
        title="Go to LexNova Homepage"
      >
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)',
          flexShrink: 0,
        }}>
          <Scale size={20} color="white" />
        </div>
        <div>
          <div style={{
            fontSize: '17px', fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            LexNova
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(59, 130, 246, 0.16)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60A5FA',
              fontWeight: '700',
              letterSpacing: '0.04em',
            }}>
              OS
            </span>
          </div>
          <div style={{
            fontSize: '11px', color: '#9AA5B5',
            letterSpacing: '0.04em',
            fontWeight: '600',
            marginTop: '2px',
          }}>
            AI Legal Operating System
          </div>
        </div>
      </Link>

      {/* Start New Matter Action CTA Button */}
      <div style={{ padding: '16px 16px 8px 16px' }}>
        <Link
          href="/dashboard/chat"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #1C2433, #121823)',
            border: '1px solid #38475C',
            borderRadius: '12px',
            padding: '11px 16px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#3B82F6';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(59, 130, 246, 0.35)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#38475C';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} color="#60A5FA" />
            <span>New Case Matter</span>
          </div>
          <ChevronRight size={14} color="#9AA5B5" />
        </Link>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#6B7A90',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '8px 10px 4px 10px',
        }}>
          Workspace
        </div>

        {NAV_MAIN.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard/user' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '14.5px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#FFFFFF' : '#D7DCE5',
                background: isActive ? '#1C2433' : 'transparent',
                border: isActive ? '1px solid #38475C' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#121823';
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#D7DCE5';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} color={isActive ? '#3B82F6' : '#9AA5B5'} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: '#3B82F6',
                  boxShadow: '0 0 8px #3B82F6',
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Settings */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #263142',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: '#0D1118',
      }}>
        <Link
          href="/dashboard/settings"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#9AA5B5',
            padding: '6px 8px',
            borderRadius: '8px',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#9AA5B5';
          }}
        >
          <Settings size={15} />
          <span>Settings & API Keys</span>
        </Link>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: '#121823',
          border: '1px solid #263142',
          borderRadius: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #1E293B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', color: '#FFFFFF',
              flexShrink: 0,
            }}>
              {session?.user?.name ? session.user.name[0].toUpperCase() : (session?.user?.email ? session.user.email[0].toUpperCase() : 'U')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: '#9AA5B5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session?.user?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try { await supabase.auth.signOut(); } catch (e) {}
              await signOut({ callbackUrl: '/auth/login' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#9AA5B5',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#9AA5B5';
            }}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

    </aside>
  );
}
export default Sidebar;
