"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Scale,
  Users,
  FileText,
  Shield,
  Activity,
  Award,
  Calendar,
  Lock,
  ArrowRight,
  BookOpen,
  Zap,
  Sliders,
  Sparkles,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Statutes & Law" | "Admin Actions" | "Case Tools";
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  badge?: string;
}

export default function GlobalCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Predefined enterprise command items
  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-cmd-center",
        title: "Admin Command Center",
        subtitle: "Live system telemetry, node health, and platform metrics",
        category: "Navigation",
        icon: Activity,
        href: "/admin",
        badge: "ADMIN",
      },
      {
        id: "nav-users",
        title: "User Directory & Clearances",
        subtitle: "Manage accounts, assign roles, and resolve security lockouts",
        category: "Navigation",
        icon: Users,
        href: "/admin/users",
        badge: "ADMIN",
      },
      {
        id: "nav-advocates",
        title: "Bar Council Verification Console",
        subtitle: "Review advocate licenses, verify credentials, and set fees",
        category: "Navigation",
        icon: Award,
        href: "/admin/advocates",
        badge: "ADMIN",
      },
      {
        id: "nav-cases",
        title: "Global Cases Oversight",
        subtitle: "Browse legal matters, timelines, and case status",
        category: "Navigation",
        icon: Scale,
        href: "/admin/cases",
        badge: "ADMIN",
      },
      {
        id: "nav-workflows",
        title: "Legal Automation Workflows",
        subtitle: "Visual enterprise legal workflow pipelines and triggers",
        category: "Navigation",
        icon: Zap,
        href: "/admin/workflows",
        badge: "ENTERPRISE",
      },
      {
        id: "nav-orgs",
        title: "Enterprise Organizations",
        subtitle: "Law firms, corporate legal departments, and seat quotas",
        category: "Navigation",
        icon: Shield,
        href: "/admin/organizations",
        badge: "ENTERPRISE",
      },
      {
        id: "nav-bookings",
        title: "Bookings & Platform Revenue",
        subtitle: "Consultation ledger, Razorpay settlements, and video rooms",
        category: "Navigation",
        icon: Calendar,
        href: "/admin/bookings",
        badge: "ADMIN",
      },
      {
        id: "nav-audit",
        title: "Security Audit Logs (ISO 27001)",
        subtitle: "Tamper-evident logs of administrative actions and access",
        category: "Navigation",
        icon: Lock,
        href: "/admin/audit-logs",
        badge: "SOC 2",
      },
      {
        id: "nav-admin-profile",
        title: "Root Admin Profile",
        subtitle: "Manage administrative credentials, keys, and security settings",
        category: "Navigation",
        icon: Sliders,
        href: "/admin/profile",
        badge: "ADMIN",
      },
      {
        id: "nav-client-dash",
        title: "Client Dashboard",
        subtitle: "Citizen & business case management view",
        category: "Navigation",
        icon: Scale,
        href: "/dashboard",
      },
      {
        id: "nav-ai-chat",
        title: "AI Legal Intake Assistant",
        subtitle: "Start a structured legal fact-finding consultation",
        category: "Navigation",
        icon: Sparkles,
        href: "/chat",
      },

      // Statutes & Indian Law Reference
      {
        id: "statute-bns",
        title: "Bharatiya Nyaya Sanhita (BNS 2023)",
        subtitle: "Sections 1–358 · Substantive criminal penal code of India",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "CRIMINAL LAW",
      },
      {
        id: "statute-bnss",
        title: "Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)",
        subtitle: "Sections 1–531 · Criminal procedure, bail guidelines & arrest rules",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "PROCEDURE",
      },
      {
        id: "statute-cpc",
        title: "Code of Civil Procedure (CPC 1908)",
        subtitle: "Pleadings, plaints, injunctions (Order 39), summary suits (Order 37)",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "CIVIL LITIGATION",
      },
      {
        id: "statute-contract-act",
        title: "Indian Contract Act 1872 & Specific Relief Act",
        subtitle: "Breach of contract, liquidated damages, specific performance & NDAs",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "COMMERCIAL",
      },
      {
        id: "statute-consumer",
        title: "Consumer Protection Act 2019",
        subtitle: "Deficiency in service, unfair trade practices & E-daakhil filings",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "CONSUMER",
      },
      {
        id: "statute-ni-act",
        title: "Negotiable Instruments Act — Section 138",
        subtitle: "Cheque bounce demand notices, 15-day compliance & magistrate filings",
        category: "Statutes & Law",
        icon: BookOpen,
        href: "/dashboard/compliance",
        badge: "FINANCIAL DISPUTE",
      },

      // Case Tools & Drafting
      {
        id: "tool-doc-gen",
        title: "Instant Legal Notice Generator",
        subtitle: "Draft certified statutory demand notices with AI",
        category: "Case Tools",
        icon: FileText,
        href: "/dashboard/documents",
        badge: "AI DRAFT",
      },
      {
        id: "tool-limitation",
        title: "Statutory Limitation Period Calculator",
        subtitle: "Calculate limitation countdown under Limitation Act 1963",
        category: "Case Tools",
        icon: Calendar,
        href: "/dashboard/matters",
        badge: "COMPLIANCE",
      },
    ],
    []
  );

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q) ||
        (c.badge && c.badge.toLowerCase().includes(q))
    );
  }, [commands, query]);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setIsOpen(false);
      setQuery("");
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router]
  );

  // Keyboard navigation inside list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex]);
    }
  };

  return (
    <>
      {/* Omni-search trigger hint bar for mobile / desktop header button */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-2xl rounded-2xl bg-[#0B0B16] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden text-left flex flex-col max-h-[75vh]"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.01]">
                <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleListKeyDown}
                  placeholder="Search cases, statutes, verified advocates, or admin power actions..."
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded bg-white/5"
                  >
                    Clear
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  <span>ESC</span>
                </div>
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-white/[0.02]">
                {filteredCommands.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 space-y-2">
                    <Search className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs font-semibold">No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-[11px] text-slate-600">
                      Try searching for &quot;BNS&quot;, &quot;Advocates&quot;, &quot;Workflows&quot;, or &quot;Audit Logs&quot;.
                    </p>
                  </div>
                ) : (
                  filteredCommands.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "px-3.5 py-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all",
                          isSelected
                            ? "bg-gradient-to-r from-amber-500/15 via-white/[0.04] to-transparent text-white border border-amber-500/30"
                            : "text-slate-300 hover:bg-white/[0.02] border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                              isSelected
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-white/5 text-slate-400 border border-white/5"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold truncate">{item.title}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-white/5 text-amber-400/90 border border-white/10">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
                            {item.category}
                          </span>
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Bar with Keyboard Shortcuts */}
              <div className="px-4 py-2.5 border-t border-white/5 bg-[#080812] flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">↓</kbd>
                    <span>to navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">↵</kbd>
                    <span>to select</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <Command className="w-3 h-3 text-amber-400" />
                  <span>LexNova Omni-Search</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
