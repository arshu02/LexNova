'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Plus, X, CheckCircle, Calendar, FileText, ArrowRight, User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function DashboardNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    await signOut({ callbackUrl: '/auth/login' });
  };

  const initial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U';

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/dashboard/chat?init=${encodeURIComponent(search.trim())}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      height: '60px',
      background: '#FFFFFF',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Search Input Bar & Omni-Search Trigger */}
      <button
        onClick={() => {
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
          );
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '8px 14px',
          width: '400px',
          transition: 'all 0.15s ease',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Search size={15} color="#2563EB" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: '#64748B', flex: 1 }}>
          Quick search cases, statutes, advocates...
        </span>
        <div style={{
          fontSize: '10px',
          fontWeight: '700',
          color: '#475569',
          background: '#E2E8F0',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #CBD5E1',
          fontFamily: 'var(--font-mono)',
        }}>
          ⌘K
        </div>
      </button>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* + New Matter CTA */}
        <Link
          href="/dashboard/chat"
          className="btn-primary"
          style={{
            height: '38px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={15} />
          <span>New Case Matter</span>
        </Link>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1';
              (e.currentTarget as HTMLElement).style.color = '#0F172A';
              (e.currentTarget as HTMLElement).style.background = '#F1F5F9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
              (e.currentTarget as HTMLElement).style.color = '#475569';
              (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
            }}
            title="Notifications"
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 4px #10B981',
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '340px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 7px', borderRadius: '9999px', fontWeight: '600' }}>
                  2 New
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Video Call Scheduled Today</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Advocate Rajesh Sharma at 04:30 PM</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Limitation Alert (MAT-1044)</div>
                  <div style={{ fontSize: '11.5px', color: '#D97706', marginTop: '2px' }}>4 Days Remaining for Consumer Petition</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}
          >
            {initial}
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '240px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '1px' }}>{session?.user?.email || ''}</div>
              </div>

              {(session?.user as any)?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13.5px',
                    color: '#D97706',
                    fontWeight: '700',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                  }}
                >
                  <FileText size={15} color="#D97706" /> Institutional Admin
                </Link>
              )}

              <Link
                href="/dashboard/settings"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  color: '#334155',
                  padding: '6px 8px',
                  borderRadius: '8px',
                }}
              >
                <Settings size={15} /> Settings & Profile
              </Link>

              <button
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  color: '#DC2626',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
export default DashboardNavbar;
