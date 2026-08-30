"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, CheckCircle, XCircle, Edit3, MessageSquare,
  FileText, Clock, User, AlertTriangle, ChevronDown, ChevronUp,
  Send, Eye, BarChart3
} from "lucide-react";

interface ReviewItem {
  id: string;
  clientName: string;
  docType: string;
  docContent: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "editing";
  urgency: "high" | "normal";
  comment?: string;
}

const MOCK_QUEUE: ReviewItem[] = [
  {
    id: "R001",
    clientName: "Rahul Mehta",
    docType: "Legal Notice",
    docContent: `LEGAL NOTICE
Date: 31st March 2026

From: Rahul Mehta, Mumbai

To: ABC Rentals Pvt Ltd, Andheri East

SUBJECT: Non-refund of Security Deposit of ₹75,000

Dear Sir/Madam,

My client Rahul Mehta vacated the premises at 4B, Flower Heights on 1st Feb 2026 after serving proper notice. Despite repeated requests, the security deposit of ₹75,000 has not been returned.

You are hereby called upon to refund ₹75,000 within 15 days of this notice, failing which legal proceedings shall be initiated.

[AI Generated — Pending Lawyer Review]`,
    submittedAt: "2026-03-31 14:30",
    status: "pending",
    urgency: "high",
  },
  {
    id: "R002",
    clientName: "Priya Ventures Pvt Ltd",
    docType: "Non-Disclosure Agreement",
    docContent: `NON-DISCLOSURE AGREEMENT
Date: 31st March 2026

Between:
Disclosing Party: Priya Ventures Pvt Ltd
Receiving Party: TechSprint Solutions

Purpose: Evaluation of strategic partnership for SaaS product development.

Duration: 2 years
Governing Law: Maharashtra

[Standard NDA clauses — AI Generated — Pending Lawyer Review and customization]`,
    submittedAt: "2026-03-30 09:15",
    status: "pending",
    urgency: "normal",
  },
  {
    id: "R003",
    clientName: "Suresh Patel",
    docType: "Contract Analysis Report",
    docContent: `CONTRACT ANALYSIS — Service Agreement
Risk Score: 72/100 (Medium Risk)

High Risk Clauses:
1. §7.3 Indemnification — overly broad
2. §9.1 IP Assignment — no carve-out for pre-existing IP

Recommendations:
- Narrow indemnification scope
- Add IP carve-out clause
- Verify limitation of liability is mutual

[AI Analyzed — Awaiting Lawyer Verification]`,
    submittedAt: "2026-03-29 16:45",
    status: "approved",
    urgency: "normal",
    comment: "Reviewed and verified. Risk assessment is accurate. Client advised to negotiate §7.3 and §9.1 before signing.",
  },
];

export default function ReviewPage() {
  const [queue, setQueue] = useState<ReviewItem[]>(MOCK_QUEUE);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const activeItem = queue.find(q => q.id === activeId);
  const filtered = queue.filter(q => filter === "all" || q.status === filter);

  const updateStatus = (id: string, status: ReviewItem["status"], commentText?: string) => {
    setQueue(q => q.map(item => item.id === id ? { ...item, status, comment: commentText || item.comment } : item));
    setActiveId(null);
    setEditingId(null);
    setComment("");
  };

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706", label: "Pending Review" },
    approved: { bg: "rgba(34,197,94,0.1)", color: "#16a34a", label: "Approved" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", label: "Rejected" },
    editing: { bg: "rgba(37,99,235,0.1)", color: "#7C3AED", label: "In Edit" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Lawyer Review Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Review, edit, and approve AI-generated legal documents</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="px-3 py-1.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: "#d97706" }}>
            {queue.filter(q => q.status === "pending").length} Pending
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
            style={filter === f
              ? { background: "linear-gradient(135deg,#1e3a8a,#7C3AED)", color: "white" }
              : { background: "white", color: "#64748b", border: "1px solid #E5E7EB" }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((item) => {
            const ss = statusStyle[item.status];
            return (
              <button key={item.id} onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                className="w-full text-left p-4 rounded-2xl border transition-all"
                style={{
                  borderColor: activeId === item.id ? "#F59E0B" : "#E5E7EB",
                  background: activeId === item.id ? "rgba(37,99,235,0.03)" : "white",
                }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                  {item.urgency === "high" && (
                    <span className="text-[10px] font-black text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> URGENT
                    </span>
                  )}
                </div>
                <p className="font-black text-white text-sm">{item.clientName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.docType}</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-300">
                  <Clock className="w-3 h-3" /> {item.submittedAt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div key={activeItem.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                className="bg-[#0D0D18] rounded-2xl border" style={{ borderColor: "#E5E7EB" }}>
                {/* Header */}
                <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
                  <div>
                    <p className="font-black text-white">{activeItem.clientName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activeItem.docType} · {activeItem.submittedAt}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full"
                    style={{ background: statusStyle[activeItem.status].bg, color: statusStyle[activeItem.status].color }}>
                    {statusStyle[activeItem.status].label}
                  </span>
                </div>

                {/* Document Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Document Content</p>
                    {activeItem.status === "pending" && editingId !== activeItem.id && (
                      <button onClick={() => { setEditingId(activeItem.id); setEditContent(activeItem.docContent); }}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-[#080810] transition-all"
                        style={{ borderColor: "#E5E7EB", color: "#F59E0B" }}>
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  {editingId === activeItem.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-48 p-4 text-xs font-mono rounded-xl border text-slate-300 outline-none resize-none"
                      style={{ borderColor: "#F59E0B", background: "rgba(37,99,235,0.02)", fontFamily: "monospace" }}
                    />
                  ) : (
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-[#080810] rounded-xl p-4 max-h-48 overflow-y-auto"
                      style={{ fontFamily: "monospace" }}>
                      {activeItem.docContent}
                    </pre>
                  )}
                </div>

                {/* Comment & Approved comment */}
                {activeItem.comment && (
                  <div className="mx-5 mb-4 p-3 rounded-xl text-xs font-medium"
                    style={{ background: "rgba(34,197,94,0.06)", color: "#15803d" }}>
                    <p className="font-black mb-1">Lawyer Comment:</p>
                    {activeItem.comment}
                  </div>
                )}

                {/* Actions */}
                {activeItem.status === "pending" && (
                  <div className="p-5 border-t space-y-3" style={{ borderColor: "#F1F5F9" }}>
                    <textarea
                      placeholder="Add your professional comment / recommendations..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none font-medium"
                      style={{ borderColor: "#E5E7EB" }}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(activeItem.id, "approved", comment || "Reviewed and approved by licensed advocate.")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#15803d,#16a34a)" }}>
                        <CheckCircle className="w-4 h-4" /> Approve &amp; Sign
                      </button>
                      <button
                        onClick={() => updateStatus(activeItem.id, "rejected", comment || "Document requires significant revision.")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-64 flex flex-col items-center justify-center rounded-2xl border"
                style={{ borderColor: "#E5E7EB", background: "white" }}>
                <ClipboardCheck className="w-10 h-10 text-gray-200 mb-3" />
                <p className="font-bold text-slate-500">Select a document to review</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
