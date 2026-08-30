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
      background: 'rgba(13, 17, 24, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #263142',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Search Input Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#121823',
        border: '1px solid #263142',
        borderRadius: '10px',
        padding: '8px 14px',
        width: '400px',
        transition: 'all 0.15s ease',
      }}>
        <Search size={15} color="#9AA5B5" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search statutory acts, cases, advocates... (Press Enter)"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13.5px',
            color: '#FFFFFF',
            width: '100%',
          }}
        />
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#9AA5B5',
          background: '#171E29',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #38475C',
          fontFamily: 'var(--font-mono)',
        }}>
          ↵
        </div>
      </div>

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
              background: '#121823',
              border: '1px solid #263142',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#D7DCE5',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#38475C';
              (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#263142';
              (e.currentTarget as HTMLElement).style.color = '#D7DCE5';
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
              background: '#22C55E',
              boxShadow: '0 0 6px #22C55E',
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '340px',
              background: '#0D1118',
              border: '1px solid #38475C',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #263142', paddingBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#22C55E', background: 'rgba(34, 197, 94, 0.14)', padding: '2px 7px', borderRadius: '9999px', fontWeight: '600' }}>
                  2 New
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#121823', border: '1px solid #263142', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Video Call Scheduled Today</div>
                  <div style={{ fontSize: '11.5px', color: '#9AA5B5', marginTop: '2px' }}>Advocate Rajesh Sharma at 04:30 PM</div>
                </div>

                <div style={{ background: '#121823', border: '1px solid #263142', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Limitation Alert (MAT-1044)</div>
                  <div style={{ fontSize: '11.5px', color: '#F59E0B', marginTop: '2px' }}>4 Days Remaining for Consumer Petition</div>
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
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
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
              background: '#0D1118',
              border: '1px solid #38475C',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ borderBottom: '1px solid #263142', paddingBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '12px', color: '#9AA5B5', marginTop: '1px' }}>{session?.user?.email || ''}</div>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  color: '#D7DCE5',
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
                  color: '#EF4444',
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
