"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, AlertTriangle, CheckCircle, XCircle,
  BarChart3, Eye, Download, Loader2, ChevronDown, ChevronUp, Shield
} from "lucide-react";

interface Clause { title: string; excerpt: string; risk: "high" | "medium" | "low"; suggestion: string; }
interface Analysis {
  fileName: string; riskScore: number; riskLevel: "High" | "Medium" | "Low";
  summary: string; clauses: Clause[]; recommendations: string[];
}

const MOCK_ANALYSIS: Analysis = {
  fileName: "",
  riskScore: 72,
  riskLevel: "Medium",
  summary: "This Service Agreement contains several standard commercial clauses with a few areas of concern. The indemnification clause is broadly worded and the IP assignment terms may be unfavorable. Overall, the contract is manageable with targeted revisions.",
  clauses: [
    { title: "Indemnification Clause (§7.3)", excerpt: "Party A shall indemnify and hold harmless Party B from any and all claims, damages, losses, costs...", risk: "high", suggestion: "Narrow the scope — add 'arising directly from Party A's negligence' to limit exposure." },
    { title: "IP Assignment (§9.1)", excerpt: "All intellectual property developed during the engagement shall be assigned exclusively to the Client...", risk: "high", suggestion: "Negotiate a license-back right or carve out pre-existing IP and background IP." },
    { title: "Limitation of Liability (§11)", excerpt: "In no event shall either party be liable for indirect, incidental, consequential damages...", risk: "medium", suggestion: "Ensure mutual limitation — verify both parties are covered equally." },
    { title: "Termination Clause (§14)", excerpt: "Either party may terminate this agreement with 30 days written notice...", risk: "low", suggestion: "30-day notice is standard. Consider adding a cure period for non-material breaches." },
    { title: "Governing Law (§17)", excerpt: "This agreement shall be governed by the laws of the State of Maharashtra, India...", risk: "low", suggestion: "Jurisdiction clause is standard. Verify arbitration rules are acceptable." },
  ],
  recommendations: [
    "Request revision of §7.3 indemnification scope before signing",
    "Negotiate IP carve-outs for pre-existing proprietary tools in §9.1",
    "Add a dispute resolution + arbitration clause if absent",
    "Request lawyer sign-off before execution — especially on IP terms",
  ],
};

const RISK_COLOR: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
const RISK_BG: Record<string, string> = { high: "rgba(239,68,68,0.08)", medium: "rgba(245,158,11,0.08)", low: "rgba(34,197,94,0.08)" };

export default function ContractAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [requestingReview, setRequestingReview] = useState(false);
  const [reviewRequested, setReviewRequested] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f);
    setAnalysis(null);
    setAnalyzing(true);
    setReviewRequested(false);
    await new Promise((r) => setTimeout(r, 2800));
    setAnalysis({ ...MOCK_ANALYSIS, fileName: f.name });
    setAnalyzing(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const riskBarColor = analysis
    ? analysis.riskScore >= 70 ? "#ef4444" : analysis.riskScore >= 40 ? "#f59e0b" : "#22c55e"
    : "#F59E0B";

  const requestLawyerReview = async () => {
    setRequestingReview(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRequestingReview(false);
    setReviewRequested(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Contract Analyzer</h1>
        <p className="text-sm text-slate-500 mt-1">Upload a contract to get AI-powered risk analysis and clause breakdown</p>
      </div>

      {/* Upload Zone */}
      {!analysis && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="rounded-2xl border-2 border-dashed p-16 text-center transition-all cursor-pointer"
          style={{ borderColor: dragging ? "#F59E0B" : "#E5E7EB", background: dragging ? "rgba(37,99,235,0.04)" : "white" }}
          onClick={() => document.getElementById("contract-upload")?.click()}>
          <input id="contract-upload" type="file" accept=".pdf,.doc,.docx,.txt" hidden
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

          {analyzing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(37,99,235,0.1)" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <p className="font-black text-white text-lg">Analyzing {file?.name}…</p>
                <p className="text-sm text-slate-500 mt-1">Extracting clauses, scoring risk, generating insights</p>
              </div>
              <div className="max-w-xs mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 2.5, ease: "linear" }}
                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#7C3AED,#F59E0B)" }} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(37,99,235,0.08)" }}>
                <Upload className="w-8 h-8" style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <p className="font-black text-white text-lg">Drop your contract here</p>
                <p className="text-sm text-slate-500 mt-1">Supports PDF, DOC, DOCX, TXT · Up to 10MB</p>
              </div>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#1e3a8a,#7C3AED)" }}>
                Browse Files
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score Card */}
            <div className="bg-[#0D0D18] rounded-2xl border p-8" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-sm font-bold text-slate-500">{analysis.fileName}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>AI Analyzed</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Risk Assessment Report</h2>
                </div>
                <div className="flex gap-3">
                  {!reviewRequested ? (
                    <button onClick={requestLawyerReview} disabled={requestingReview}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg,#1e3a8a,#7C3AED)" }}>
                      {requestingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Request Lawyer Review
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                      <CheckCircle className="w-4 h-4" /> Lawyer Review Requested
                    </span>
                  )}
                  <button onClick={() => { setAnalysis(null); setFile(null); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border hover:bg-[#080810] transition-all"
                    style={{ borderColor: "#E5E7EB", color: "#64748b" }}>
                    Analyze New
                  </button>
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-500">Overall Risk Score</span>
                    <span style={{ color: riskBarColor }}>{analysis.riskScore}/100 — {analysis.riskLevel} Risk</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${analysis.riskScore}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg,#22c55e,${riskBarColor})` }} />
                  </div>
                </div>
                <div className="flex gap-4">
                  {[{ icon: XCircle, color: "#ef4444", label: "High Risk", count: analysis.clauses.filter(c => c.risk === "high").length },
                    { icon: AlertTriangle, color: "#f59e0b", label: "Medium", count: analysis.clauses.filter(c => c.risk === "medium").length },
                    { icon: CheckCircle, color: "#22c55e", label: "Low Risk", count: analysis.clauses.filter(c => c.risk === "low").length }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <stat.icon className="w-5 h-5 mx-auto mb-1" style={{ color: stat.color }} />
                      <p className="text-lg font-black" style={{ color: stat.color }}>{stat.count}</p>
                      <p className="text-[10px] font-bold text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-[#080810] rounded-xl p-4">{analysis.summary}</p>
            </div>

            {/* Clause Breakdown */}
            <div className="bg-[#0D0D18] rounded-2xl border" style={{ borderColor: "#E5E7EB" }}>
              <div className="p-6 border-b" style={{ borderColor: "#E5E7EB" }}>
                <h3 className="font-black text-white">Clause Analysis</h3>
                <p className="text-sm text-slate-500 mt-0.5">Click each clause to see AI suggestions</p>
              </div>
              <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
                {analysis.clauses.map((clause, i) => (
                  <div key={i} className="p-5 cursor-pointer hover:bg-[#080810] transition-all"
                    onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RISK_COLOR[clause.risk] }} />
                        <h4 className="font-bold text-white text-sm">{clause.title}</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full capitalize"
                          style={{ background: RISK_BG[clause.risk], color: RISK_COLOR[clause.risk] }}>
                          {clause.risk} risk
                        </span>
                      </div>
                      {expanded === i ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 overflow-hidden">
                          <div className="bg-[#080810] rounded-xl p-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Excerpt</p>
                            <p className="text-xs text-slate-300 italic">"{clause.excerpt}"</p>
                          </div>
                          <div className="rounded-xl p-3" style={{ background: RISK_BG[clause.risk] }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: RISK_COLOR[clause.risk] }}>AI Suggestion</p>
                            <p className="text-sm text-slate-300">{clause.suggestion}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#0D0D18] rounded-2xl border p-6" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="font-black text-white mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(37,99,235,0.04)" }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#1e3a8a,#7C3AED)" }}>{i + 1}</span>
                    <p className="text-sm text-slate-300 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl text-xs text-amber-700 font-medium flex items-start gap-2"
                style={{ background: "rgba(245,158,11,0.08)" }}>
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                AI-assisted analysis only. This report should be reviewed by a licensed lawyer before any legal action is taken.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
