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

const RISK_COLOR: Record<string, string> = { high: "#DC2626", medium: "#D97706", low: "#059669" };
const RISK_BG: Record<string, string> = { high: "#FEF2F2", medium: "#FFFBEB", low: "#ECFDF5" };

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
    await new Promise((r) => setTimeout(r, 2000));
    setAnalysis({ ...MOCK_ANALYSIS, fileName: f.name });
    setAnalyzing(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const riskBarColor = analysis
    ? analysis.riskScore >= 70 ? "#DC2626" : analysis.riskScore >= 40 ? "#D97706" : "#059669"
    : "#2563EB";

  const requestLawyerReview = async () => {
    setRequestingReview(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRequestingReview(false);
    setReviewRequested(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contract Analyzer</h1>
        <p className="text-sm text-slate-500 mt-1">Upload an agreement to get AI risk scoring, high-risk clause extraction, and actionable suggestions</p>
      </div>

      {/* Upload Zone */}
      {!analysis && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="rounded-2xl border-2 border-dashed p-16 text-center transition-all cursor-pointer bg-white shadow-sm"
          style={{ borderColor: dragging ? "#2563EB" : "#CBD5E1", background: dragging ? "#EFF6FF" : "#FFFFFF" }}
          onClick={() => document.getElementById("contract-upload")?.click()}>
          <input id="contract-upload" type="file" accept=".pdf,.doc,.docx,.txt" hidden
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

          {analyzing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-blue-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">Analyzing {file?.name}…</p>
                <p className="text-sm text-slate-500 mt-1">Extracting legal clauses, calculating liability exposure, cross-referencing statutory norms</p>
              </div>
              <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 2.0, ease: "linear" }}
                  className="h-full rounded-full bg-blue-600" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-blue-50">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">Drop your contract here to analyze</p>
                <p className="text-sm text-slate-500 mt-1">Supports PDF, DOCX, TXT · Encrypted & Private · Up to 25MB</p>
              </div>
              <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-600">{analysis.fileName}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">AI Analyzed</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Risk Assessment Report</h2>
                </div>
                <div className="flex gap-3">
                  {!reviewRequested ? (
                    <button onClick={requestLawyerReview} disabled={requestingReview}
                      className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                      {requestingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Request Lawyer Review
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Lawyer Review Requested
                    </span>
                  )}
                  <button onClick={() => { setAnalysis(null); setFile(null); }}
                    className="btn-ghost px-4 py-2.5 rounded-xl text-sm font-semibold">
                    Analyze New
                  </button>
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-600">Overall Risk Score</span>
                    <span style={{ color: riskBarColor }}>{analysis.riskScore}/100 — {analysis.riskLevel} Risk</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${analysis.riskScore}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #10B981, ${riskBarColor})` }} />
                  </div>
                </div>
                <div className="flex gap-4">
                  {[{ icon: XCircle, color: "#DC2626", label: "High Risk", count: analysis.clauses.filter(c => c.risk === "high").length },
                    { icon: AlertTriangle, color: "#D97706", label: "Medium", count: analysis.clauses.filter(c => c.risk === "medium").length },
                    { icon: CheckCircle, color: "#059669", label: "Low Risk", count: analysis.clauses.filter(c => c.risk === "low").length }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <stat.icon className="w-5 h-5 mx-auto mb-1" style={{ color: stat.color }} />
                      <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.count}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4">{analysis.summary}</p>
            </div>

            {/* Clause Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Clause Analysis</h3>
                <p className="text-sm text-slate-500 mt-0.5">Click each clause to see AI suggestions and alternative redlines</p>
              </div>
              <div className="divide-y divide-slate-100">
                {analysis.clauses.map((clause, i) => (
                  <div key={i} className="p-5 cursor-pointer hover:bg-slate-50/70 transition-all"
                    onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RISK_COLOR[clause.risk] }} />
                        <h4 className="font-semibold text-slate-900 text-sm">{clause.title}</h4>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize"
                          style={{ background: RISK_BG[clause.risk], color: RISK_COLOR[clause.risk] }}>
                          {clause.risk} risk
                        </span>
                      </div>
                      {expanded === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-3 overflow-hidden">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contract Excerpt</p>
                            <p className="text-xs text-slate-700 italic font-serif">"{clause.excerpt}"</p>
                          </div>
                          <div className="rounded-xl p-3.5 border" style={{ background: RISK_BG[clause.risk], borderColor: RISK_COLOR[clause.risk] + "33" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: RISK_COLOR[clause.risk] }}>AI Revision Recommendation</p>
                            <p className="text-sm text-slate-800">{clause.suggestion}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Strategic Recommendations</h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-600 flex-shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-700 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3.5 rounded-xl text-xs text-amber-800 font-medium flex items-start gap-2 bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                AI-assisted analysis only. This report should be reviewed by a licensed lawyer before any legal action is taken.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
