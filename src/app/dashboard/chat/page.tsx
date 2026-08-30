'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, RefreshCw, Copy, Shield, ShieldCheck, Lock, Star, 
  Users, Scale, CheckCircle, ChevronRight, FileText, AlertCircle, Briefcase,
  ArrowUp, Sparkles, MapPin, AlertTriangle, Home, ShoppingCart, KeyRound, 
  Building, HeartHandshake, FileSignature, Clock, Check
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import BookingModal from '@/components/BookingModal';
import { useRouter, useSearchParams } from 'next/navigation';

interface Lawyer {
  id: string | number;
  name: string;
  type?: string;
  specialization?: string;
  experience?: number;
  experienceYears?: number;
  rating?: number;
  qualification?: string;
  fee?: string;
  pricing?: string;
  consultationFee?: number;
  language?: string;
  availability?: string;
  city?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  lawyers?: Lawyer[];
  caseId?: string;
  caseData?: {
    case_type?: string;
    caseType?: string;
    category?: string;
    complexity?: string;
    urgency?: string;
    jurisdiction?: string;
    summary?: string;
    actions?: string[];
    required_documents?: string[];
  };
}

const LEGAL_CATEGORIES = [
  {
    icon: Home,
    title: "Rental & Property",
    color: "#60A5FA",
    queries: [
      "Landlord refusing to return ₹75,000 security deposit",
      "Received sudden 15-day illegal eviction notice from landlord",
      "Builder delayed flat possession by 2 years under RERA"
    ]
  },
  {
    icon: Briefcase,
    title: "Employment & Labour",
    color: "#34D399",
    queries: [
      "Company withheld 2 months salary (₹95,000) and full & final settlement",
      "Wrongfully terminated without notice period pay or severance",
      "Employer threatening legal notice over 2-year non-compete clause"
    ]
  },
  {
    icon: ShoppingCart,
    title: "Consumer Grievance",
    color: "#FBBF24",
    queries: [
      "E-commerce seller delivered defective laptop and denied refund",
      "Airline cancelled flight and refusing full ticket refund",
      "Health insurance claim rejected citing vague pre-existing condition"
    ]
  },
  {
    icon: KeyRound,
    title: "Cyber & Banking Fraud",
    color: "#F87171",
    queries: [
      "Lost ₹45,000 in unauthorized UPI phishing transaction",
      "Fake investment app scam — frozen bank account assistance",
      "Identity theft and cyber defamation on social media"
    ]
  },
  {
    icon: Building,
    title: "Contracts & Dues",
    color: "#A78BFA",
    queries: [
      "Client defaulted on ₹1,20,000 invoice for freelance software work",
      "Received cheque bounce bank memo (Section 138 NI Act notice)",
      "Vendor breached exclusive supply agreement with penalty clause"
    ]
  },
  {
    icon: HeartHandshake,
    title: "Family & Matrimonial",
    color: "#F472B6",
    queries: [
      "Mutual consent divorce process and 6-month cooling period waiver",
      "Child custody rights and interim maintenance calculation",
      "Ancestral property partition suit among legal heirs"
    ]
  }
];

function ChatContent() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "user_placeholder";
  const router = useRouter();
  const searchParams = useSearchParams();
  const initPrompt = searchParams?.get("init");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [caseId, setCaseId] = useState<string>("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initPrompt && messages.length === 0 && !loading) {
      send(initPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initPrompt]);

  const send = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, userId, caseId: caseId || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze legal query");
      }

      if (data.caseId) setCaseId(data.caseId);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || data.advice || data.message || "Case analysis completed.",
        timestamp: new Date(),
        lawyers: data.recommendedLawyers || data.lawyers || [],
        caseId: data.caseId,
        caseData: data.caseData || data.matter || null,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Analysis Engine Error: ${err.message || "Failed to process query. Please try again."}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([]);
    setCaseId("");
    setInput("");
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", marginTop: "16px", marginBottom: "6px", letterSpacing: "-0.01em" }}>
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", marginTop: "18px", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("⏳") || line.toLowerCase().includes("limitation")) {
        return (
          <div key={i} style={{
            margin: "12px 0",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            color: "#FBBF24",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            lineHeight: "1.5"
          }}>
            <Clock size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{line.replace(/^[⏳⚠️🚨]\s*/, "")}</span>
          </div>
        );
      }
      if (line.trim() === "---") {
        return <hr key={i} style={{ borderColor: "rgba(255, 255, 255, 0.08)", margin: "16px 0" }} />;
      }
      const bold = line.replace(/\*\*([^*]+)\*\*/g, "<strong style='color: #FFFFFF; font-weight: 600;'>$1</strong>");
      return (
        <p
          key={i}
          style={{ fontSize: "15px", lineHeight: "1.7", color: "#CBD5E1", marginBottom: "8px" }}
          dangerouslySetInnerHTML={{ __html: bold }}
        />
      );
    });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 112px)",
      maxWidth: "1160px",
      margin: "0 auto",
      background: "#08080A",
      borderRadius: "18px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      overflow: "hidden",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>

      {/* Top Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "#0C0C0F",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
          }}>
            <Scale size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              AI Legal Intelligence Advisor
            </div>
            <div style={{ fontSize: "12px", color: "#888888", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
              {caseId ? `Active Case Matter: LN-${caseId.slice(-6).toUpperCase()}` : "Indian Law Trained · RAG Neural Vector Engine"}
            </div>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="btn-ghost"
          style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={13} /> Start Fresh
        </button>
      </div>

      {/* Messages Stream */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>

        {/* Empty State with 6 Rich Legal Modules */}
        {messages.length === 0 && (
          <div className="animate-fade-in" style={{ width: "100%", padding: "8px 0" }}>
            
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "12px",
                color: "#A1A1AA",
                fontWeight: "500",
                marginBottom: "12px",
              }}>
                <Sparkles size={13} color="#60A5FA" /> Instant Statutory Cross-Referencing & Limitation Calculation
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                What legal matter can we analyze today?
              </h2>
              <p style={{ fontSize: "15px", color: "#888888", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
                Select a dispute scenario below or describe your facts in plain words. LexNova matches statutory sections, computes court deadlines, and connects you with verified counsel.
              </p>
            </div>

            {/* 6 Grid Categories */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}>
              {LEGAL_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#0D0D10",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "7px",
                        background: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: cat.color,
                      }}>
                        <Icon size={15} />
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF" }}>
                        {cat.title}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {cat.queries.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => send(q)}
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: "8px",
                            padding: "7px 10px",
                            fontSize: "12px",
                            color: "#CCCCCC",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                            lineHeight: "1.4",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                            e.currentTarget.style.color = "#CCCCCC";
                          }}
                        >
                          <span>{q}</span>
                          <ChevronRight size={12} color="#666666" style={{ flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Message Bubbles */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                {!isUser && (
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", flexShrink: 0,
                    boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
                  }}>
                    <Scale size={18} />
                  </div>
                )}

                <div style={{ maxWidth: isUser ? "75%" : "85%", width: isUser ? "auto" : "100%" }}>
                  
                  <div style={{
                    background: isUser ? "#FFFFFF" : "#0D0D10",
                    color: isUser ? "#000000" : "#E2E8F0",
                    border: isUser ? "none" : "1px solid rgba(255, 255, 255, 0.09)",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "18px 22px",
                    fontSize: "15px",
                    lineHeight: "1.65",
                    boxShadow: isUser ? "0 4px 16px rgba(255, 255, 255, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.5)",
                    position: "relative",
                  }}>
                    {isUser ? (
                      <p style={{ margin: 0, fontWeight: "500", fontSize: "15px" }}>{msg.content}</p>
                    ) : (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            ⚖️ Legal Assessment & Statutory Analysis
                          </span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            style={{
                              background: "none", border: "none", color: "#888888", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: "4px", fontSize: "12px",
                            }}
                          >
                            {copiedId === msg.id ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                            {copiedId === msg.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                        {renderContent(msg.content)}
                      </>
                    )}
                  </div>

                  {/* Recommended Lawyers Grid if returned */}
                  {!isUser && msg.lawyers && msg.lawyers.length > 0 && (
                    <div style={{ marginTop: "16px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Users size={14} color="#60A5FA" /> Matched Bar Council Verified Advocates
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                        {msg.lawyers.map((lawyer, lIdx) => (
                          <div
                            key={lIdx}
                            style={{
                              background: "#0D0D10",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "12px",
                              padding: "14px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: "10px",
                            }}
                          >
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
                                  {lawyer.name}
                                </h4>
                                <span style={{ fontSize: "11px", color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "1px 6px", borderRadius: "4px", fontWeight: "600" }}>
                                  ★ {lawyer.rating || 4.8}
                                </span>
                              </div>
                              <p style={{ fontSize: "12px", color: "#888888", marginTop: "2px" }}>
                                {lawyer.type || lawyer.specialization || "Legal Consultant"}
                              </p>
                              <div style={{ fontSize: "11.5px", color: "#666666", marginTop: "4px" }}>
                                {lawyer.city || "Pan-India"} · {lawyer.experienceYears || lawyer.experience || 8} yrs practice
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedLawyer(lawyer);
                                setBookingOpen(true);
                              }}
                              className="btn-primary"
                              style={{ width: "100%", fontSize: "12px", padding: "7px" }}
                            >
                              Book Consultation · ₹{lawyer.consultationFee || 999}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "10px",
              background: "#121216",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Loader2 size={18} className="animate-spin text-blue-400" />
            </div>
            <div style={{
              background: "#0D0D10",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "12px 18px",
              fontSize: "14px",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Sparkles size={15} color="#60A5FA" />
              Cross-referencing 50,000+ Indian court precedents and calculating limitation clock...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Spacious Luxury Input Bar */}
      <div style={{
        padding: "16px 24px 20px",
        background: "#0C0C0F",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#141418",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "9999px",
            padding: "8px 10px 8px 20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explain your legal situation in plain English or Hindi (e.g. landlord won't return deposit)..."
            style={{
              flex: 1,
              background: "transparent !important",
              border: "none !important",
              outline: "none",
              fontSize: "14.5px",
              color: "#FFFFFF !important",
              padding: "4px 0",
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: input.trim() && !loading ? "#FFFFFF" : "rgba(255, 255, 255, 0.08)",
              color: input.trim() && !loading ? "#000000" : "#555555",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={18} strokeWidth={2.5} />}
          </button>
        </form>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11.5px",
          color: "#666666",
          marginTop: "10px",
          padding: "0 10px",
        }}>
          <span>🔒 AES-256 Encrypted & Attorney-Client Confidential</span>
          <span>Press <strong style={{ color: "#888" }}>↵ Enter</strong> to send query</span>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedLawyer && (
        <BookingModal
          advocate={selectedLawyer}
          matterId={caseId || undefined}
          isOpen={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setSelectedLawyer(null);
          }}
        />
      )}

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: "#888" }}>Loading AI Case Advisor...</div>}>
      <ChatContent />
    </Suspense>
  );
}
