'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, RefreshCw, Copy, Shield, ShieldCheck, Lock, Star, 
  Users, Scale, CheckCircle, ChevronRight, FileText, AlertCircle, Briefcase,
  ArrowUp, Sparkles, MapPin, AlertTriangle, Home, ShoppingCart, KeyRound, 
  Building, HeartHandshake, FileSignature, Clock, Check, Mic, Paperclip,
  Languages, CornerDownLeft
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

const POPULAR_PROMPTS = [
  {
    icon: Home,
    tag: "Tenancy Dispute",
    title: "Landlord refusing to refund security deposit",
    description: "Calculate 15-day RPAD demand notice & statutory interest under State Rent Act",
    query: "My landlord is withholding my ₹75,000 security deposit after I vacated the flat with 30 days notice. What legal notice should I send and how do I recover it under the Rent Control Act?",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "group-hover:border-blue-500/40",
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Briefcase,
    tag: "Labour & Salary",
    title: "Wrongful termination & unpaid severance",
    description: "Recovery under Payment of Wages Act §15 & Industrial Disputes Act",
    query: "I was terminated without notice period pay and the company is withholding 2 months salary (₹1,20,000) and relieving letter. What are my legal remedies?",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "group-hover:border-emerald-500/40",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Building,
    tag: "Commercial NI Act",
    title: "Section 138 Cheque bounce demand",
    description: "Strict 30-day statutory limitation timeline calculation & criminal complaint",
    query: "A client issued a cheque of ₹2,50,000 for invoice dues which bounced due to 'Insufficient Funds'. How do I issue a Section 138 NI Act statutory legal notice?",
    color: "from-purple-500/20 to-indigo-500/10",
    border: "group-hover:border-purple-500/40",
    badge: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: KeyRound,
    tag: "Cyber Fraud",
    title: "Unauthorized bank/UPI fraud & freezing",
    description: "RBI circular compliance & Cyber Crime Portal 1930 recovery SOP",
    query: "Lost ₹45,000 in an unauthorized UPI phishing transaction yesterday. How do I initiate bank chargeback and cyber cell FIR under IT Act §66D?",
    color: "from-amber-500/20 to-orange-500/10",
    border: "group-hover:border-amber-500/40",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
];

function ChatContent() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "user_placeholder";
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
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TA'>('EN');

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (initPrompt && messages.length === 0 && !loading) {
      send(initPrompt);
    }
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
        body: JSON.stringify({ 
          message: query, 
          userId, 
          caseId: caseId || undefined,
          language: selectedLang 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze query");

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
          content: `⚠️ Analysis Engine Notice: ${err.message || "Failed to connect with AI Gateway. Please try again."}`,
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
          <h3 key={i} className="text-[15.5px] font-bold text-white mt-4 mb-2 tracking-tight">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-[17px] font-bold text-white mt-5 mb-2.5 tracking-tight border-b border-white/[0.06] pb-1.5">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("⏳") || line.toLowerCase().includes("limitation")) {
        return (
          <div key={i} className="my-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[13.5px] flex items-start gap-2.5 leading-relaxed">
            <Clock size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <span>{line.replace(/^[⏳⚠️🚨]\s*/, "")}</span>
          </div>
        );
      }
      if (line.trim() === "---") {
        return <hr key={i} className="border-white/[0.08] my-4" />;
      }
      const bold = line.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>");
      return (
        <p
          key={i}
          className="text-[14.5px] leading-relaxed text-[#CBD5E1] mb-2"
          dangerouslySetInnerHTML={{ __html: bold }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-[#07090E]/90 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
      
      {/* Sleek Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-b from-blue-600/[0.08] to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0A0C14]/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Scale size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-white tracking-tight">LexNova AI Legal Intelligence</span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Live RAG
              </span>
            </div>
            <p className="text-[11.5px] text-[#6B7B94] mt-0.5">
              {caseId ? `Active Docket: LN-${caseId.slice(-6).toUpperCase()}` : "Supreme Court Precedents · Limitation Act 1963 · Indian Statutory Code"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 text-[11.5px] font-medium text-[#8D9CB0]">
            {(['EN', 'HI', 'TA'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedLang === lang ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'hover:text-white'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>

          <button
            onClick={resetChat}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8D9CB0] hover:text-white transition-all"
            title="Start Fresh Inquiry"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Messages Stream / Empty State */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto py-8 text-center space-y-8 animate-fade-in">
            
            {/* Hero Prompt Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-medium shadow-sm">
                <Sparkles size={13} />
                <span>Instant Legal Assessment & Notice Preparation</span>
              </div>
              <h2 className="text-[28px] font-bold text-white tracking-tight">
                How can LexNova assist your legal matter today?
              </h2>
              <p className="text-[14px] text-[#8D9CB0] max-w-lg mx-auto leading-relaxed">
                Describe your situation in plain words. Our neural engine maps Indian statutes, calculates court limitation deadlines, and drafts court-compliant demand notices.
              </p>
            </div>

            {/* 4 Sleek Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
              {POPULAR_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => send(item.query)}
                    whileHover={{ y: -3 }}
                    className={`group relative p-4 rounded-2xl bg-gradient-to-br ${item.color} bg-[#0A0D16] border border-white/[0.07] ${item.border} text-left transition-all shadow-lg flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider border ${item.badge}`}>
                          {item.tag}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                          <Icon size={14} />
                        </div>
                      </div>
                      <h4 className="text-[14.5px] font-bold text-white group-hover:text-blue-300 transition-colors leading-snug mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[#7A8A9E] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11.5px] text-[#6B7B94] group-hover:text-blue-400">
                      <span>Analyze Scenario</span>
                      <ChevronRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

          </div>
        )}

        {/* Message Stream */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-500/20">
                    <Scale size={15} />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-5 ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 rounded-tr-sm'
                    : 'bg-[#0E121E] border border-white/[0.08] text-[#E2E8F0] shadow-xl rounded-tl-sm'
                }`}>
                  {isUser ? (
                    <p className="text-[14.5px] leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>
                      {renderContent(msg.content)}

                      {/* Recommended Advocates */}
                      {msg.lawyers && msg.lawyers.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-3">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-blue-400 uppercase tracking-wider">
                            <Users size={13} /> Matched High Court Counsel
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {msg.lawyers.slice(0, 2).map((adv: any) => (
                              <div
                                key={adv.id}
                                className="p-3.5 rounded-xl bg-[#080B14] border border-white/[0.08] flex flex-col justify-between gap-3"
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[13.5px] font-bold text-white">{adv.name}</span>
                                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                      <Star size={11} fill="currentColor" /> {adv.rating || '4.9'}
                                    </span>
                                  </div>
                                  <p className="text-[11.5px] text-[#7A8A9E] mt-0.5">{adv.specialization || 'High Court Counsel'}</p>
                                </div>

                                <button
                                  onClick={() => {
                                    setSelectedLawyer(adv);
                                    setBookingOpen(true);
                                  }}
                                  className="w-full py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5"
                                >
                                  Book Consultation (₹{adv.consultationFee || 999})
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3 text-[#8D9CB0] text-[13px] pl-11">
            <Loader2 size={16} className="animate-spin text-blue-400" />
            <span>Cross-referencing statutory databases & limitation clock...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Modern Floating Command Input Bar */}
      <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-[#0A0C14]/90 backdrop-blur-md relative z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="relative bg-[#05070C] border border-white/[0.1] focus-within:border-blue-500/50 rounded-2xl p-2.5 transition-all shadow-xl"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Explain your legal situation in plain English or Hindi (e.g. landlord won't return deposit, cheque bounced)..."
            className="w-full bg-transparent border-none text-white text-[14px] placeholder-[#4E5D70] focus:outline-none resize-none px-3 py-1.5"
          />

          <div className="flex items-center justify-between pt-2 px-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 text-[11.5px] text-[#6B7B94]">
              <span className="flex items-center gap-1">
                <Lock size={11} className="text-emerald-400" /> 256-Bit Encrypted · Attorney Privilege
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-[13px] transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/25 active:scale-95"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <span>Analyze</span>}
                <CornerDownLeft size={13} />
              </button>
            </div>
          </div>
        </form>
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
    <Suspense fallback={<div className="p-8 text-center text-[#8D9CB0]">Loading AI Case Advisor...</div>}>
      <ChatContent />
    </Suspense>
  );
}
