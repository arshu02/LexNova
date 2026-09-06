'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary:  true,   // always on
    analytics:  false,
    marketing:  false,
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ln_cookie_consent') : null;
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (accepted: boolean) => {
    const consent = accepted
      ? { necessary: true, analytics: true, marketing: true, timestamp: Date.now() }
      : { ...prefs, timestamp: Date.now() };
    localStorage.setItem('ln_cookie_consent', JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0D1119] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">🍪</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-white mb-1">
                We use cookies
              </h3>
              <p className="text-[13px] text-[#8D9CB0] leading-relaxed">
                We use essential cookies to operate the platform and optional cookies to improve your experience.
                Under the{' '}
                <strong className="text-white">Digital Personal Data Protection Act 2023</strong>
                {' '}and GDPR, you have the right to choose which non-essential cookies you accept.{' '}
                <Link href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>
              </p>

              {/* Granular controls */}
              {showDetails && (
                <div className="mt-4 space-y-3 border-t border-white/[0.08] pt-4">
                  {[
                    { key: 'necessary',  label: 'Necessary',  desc: 'Authentication, security, core functionality. Cannot be disabled.', locked: true },
                    { key: 'analytics',  label: 'Analytics',  desc: 'Anonymous usage stats to improve the platform (no personal data sold).', locked: false },
                    { key: 'marketing',  label: 'Marketing',  desc: 'Personalised content and relevant legal information for your case type.', locked: false },
                  ].map(({ key, label, desc, locked }) => (
                    <div key={key} className="flex items-start gap-3">
                      <button
                        disabled={locked}
                        onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={`mt-0.5 w-10 h-5 rounded-full relative transition-colors shrink-0 ${
                          prefs[key as keyof typeof prefs]
                            ? 'bg-blue-500'
                            : 'bg-white/20'
                        } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          prefs[key as keyof typeof prefs] ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                      <div>
                        <div className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                          {label}
                          {locked && <span className="text-[10px] text-[#6B7B94] font-normal">(Always on)</span>}
                        </div>
                        <div className="text-[12px] text-[#7A8A9E]">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[13px] text-[#7A8A9E] hover:text-white transition-colors text-left sm:text-center"
          >
            {showDetails ? 'Hide details ▲' : 'Manage preferences ▼'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => save(false)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/[0.12] text-[13.5px] font-semibold text-[#A0B0C4] hover:bg-white/[0.06] transition-all"
            >
              {showDetails ? 'Save preferences' : 'Reject all'}
            </button>
            <button
              onClick={() => save(true)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-[13.5px] font-semibold text-white transition-all"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
