'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users, UserPlus, Key, Shield, Building2, Copy, Check,
  RefreshCw, Terminal, CheckCircle2, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  city?: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  apiKey: string;
  members: Member[];
  cases: Array<{ id: string; title: string; status: string }>;
}

export default function TeamWorkspacePage() {
  const { data: session } = useSession();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ASSOCIATE');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrg = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/organizations');
      if (res.ok) {
        const data = await res.json();
        setOrg(data.organization);
      }
    } catch (e) {
      console.error('Failed to load organization:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteLoading(true);
    try {
      const res = await fetch('/api/organizations/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: `Added ${inviteEmail} to workspace.` });
        setInviteName('');
        setInviteEmail('');
        fetchOrg();
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to add member.' });
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Network error.' });
    } finally {
      setInviteLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleRegenerateKey = async () => {
    if (!confirm('Are you sure you want to regenerate your enterprise API key? Existing integrations will break.')) return;
    setRegenLoading(true);
    try {
      const res = await fetch('/api/organizations/api-key', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setOrg((prev) => prev ? { ...prev, apiKey: data.apiKey } : null);
        setNotification({ type: 'success', message: 'Enterprise API key regenerated successfully.' });
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to regenerate key.' });
    } finally {
      setRegenLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const copyApiKey = () => {
    if (org?.apiKey) {
      navigator.clipboard.writeText(org.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-blue-600" />
        <p className="text-[13.5px]">Loading organization workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">{org?.name || 'Legal Workspace'}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50 border border-blue-200 text-blue-700">
              {org?.plan || 'ENTERPRISE'}
            </span>
          </div>
          <p className="text-[13.5px] text-slate-500">
            Manage multi-tenant team members, role-based access, and enterprise API keys.
          </p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-[13.5px] font-medium flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {notification.message}
        </div>
      )}

      {/* Main Grid: Team Members + Invite Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Team Members ({org?.members?.length || 0})
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {org?.members?.map((member) => (
              <div key={member.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-sm">
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-semibold text-slate-900 truncate">{member.name}</div>
                    <div className="text-[12.5px] text-slate-500 truncate">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wider uppercase bg-slate-100 border border-slate-200 text-slate-700">
                    {member.role || 'MEMBER'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Form */}
        <div className="space-y-4">
          <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-600" /> Invite Colleague
          </h2>

          <form onSubmit={handleInvite} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <label className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Adv. Vikram Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@lawfirm.in"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Role & Permissions
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              >
                <option value="MANAGING_PARTNER">Managing Partner (Full Admin)</option>
                <option value="SENIOR_ADVOCATE">Senior Advocate (Case Lead)</option>
                <option value="ASSOCIATE">Associate Advocate (Editor)</option>
                <option value="PARALEGAL">Paralegal / Researcher</option>
                <option value="CLIENT">Client Viewer (Read Only)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={inviteLoading}
              className="btn-primary w-full py-2.5 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {inviteLoading ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
              Send Team Invitation
            </button>
          </form>
        </div>
      </div>

      {/* Developer & B2B API Key Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Key size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Enterprise API Keys</h3>
              <p className="text-[13px] text-slate-500">Use this secret key to integrate LexNova with your CRM or enterprise billing systems.</p>
            </div>
          </div>

          <button
            onClick={handleRegenerateKey}
            disabled={regenLoading}
            className="btn-ghost inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold text-slate-700"
          >
            <RefreshCw size={13} className={regenLoading ? 'animate-spin' : ''} /> Regenerate Key
          </button>
        </div>

        {/* API Key Box */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <code className="flex-1 font-mono text-[13px] text-blue-700 font-semibold truncate">
            {org?.apiKey || 'ln_live_********************************'}
          </code>
          <button
            onClick={copyApiKey}
            className="btn-ghost px-4 py-1.5 text-slate-800 text-[12.5px] font-semibold rounded-lg flex items-center gap-1.5 shrink-0"
          >
            {copiedKey ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copiedKey ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Example cURL snippet */}
        <div className="space-y-2">
          <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal size={13} /> Example B2B Intake Request (cURL)
          </div>
          <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-[12px] font-mono text-slate-200 overflow-x-auto">
{`curl -X POST https://lexnova.in/api/v1/cases/intake \\
  -H "Authorization: Bearer ${org?.apiKey || 'ln_live_YOUR_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Breach of Commercial Agreement",
    "description": "Client supplied 500 tonnes of steel; buyer failed to remit ₹1.4 Cr within 45 days.",
    "jurisdiction": "Delhi High Court"
  }'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
