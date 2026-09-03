'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, RefreshCw, Copy, Shield, ShieldCheck, Lock, Star, 
  Users, Scale, CheckCircle, ChevronRight, FileText, AlertCircle, Briefcase,
  ArrowUp, Sparkles, MapPin, AlertTriangle, Home, ShoppingCart, KeyRound, 
  Building, HeartHandshake, FileSignature, Clock, Check, Mic, Paperclip,
  Languages, CornerDownLeft, X, Image as ImageIcon, FileCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import BookingModal from '@/components/BookingModal';
import { useRouter, useSearchParams } from 'next/navigation';

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

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
  attachments?: AttachedFile[];
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

const getAdvocatePhoto = (name?: string): string => {
  const n = (name || "").toLowerCase();
  if (n.includes("priya")) return "/advocate-priya.jpg";
  if (n.includes("rajesh")) return "/advocate-rajesh.jpg";
  if (n.includes("ananya")) return "/advocate-ananya.jpg";
  if (n.includes("vikram")) return "/advocate-vikram.jpg";
  if (n.includes("sanjay")) return "/advocate-sanjay.jpg";
  if (n.includes("meera")) return "/advocate-ananya.jpg";
  return "/advocate-priya.jpg";
};

const formatSpecialization = (spec?: string): string => {
  if (!spec) return "High Court Counsel";
  const key = spec.toUpperCase().replace(/[\s-]+/g, "_");
  const map: Record<string, string> = {
    PROPERTY_DISPUTE: "Property & Tenancy Specialist",
    LABOUR_DISPUTE: "Labour & Employment Counsel",
    CONSUMER_GRIEVANCE: "Consumer Protection & Redressal",
    CRIMINAL_CYBER: "Cyber Crime & Economic Offences",
    CORPORATE_CONTRACT: "Corporate & Contractual Litigation",
    FAMILY_DIVORCE: "Family & Matrimonial Specialist",
    CIVIL_LITIGATION: "Civil & Commercial Litigation",
    CONSTITUTIONAL: "Constitutional & Writ Advocate",
  };
  if (map[key]) return map[key];
  return spec.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getCourtAdmission = (name?: string, city?: string): string => {
  const n = (name || "").toLowerCase();
  if (n.includes("priya")) return "Karnataka High Court & City Civil Court";
  if (n.includes("rajesh")) return "Bombay High Court & Labour Tribunal";
  if (n.includes("ananya")) return "Madras High Court & Consumer Forum";
  if (n.includes("vikram")) return "Delhi High Court & Commercial Division";
  if (n.includes("sanjay")) return "Delhi High Court & Sessions Court";
  return `${city || "High Court"} Advocate`;
};

const getBarNumber = (name?: string): string => {
  const n = (name || "").toLowerCase();
  if (n.includes("priya")) return "KAR/2491/2014";
  if (n.includes("rajesh")) return "MAH/1842/2010";
  if (n.includes("ananya")) return "TN/3104/2018";
  if (n.includes("vikram")) return "D/1520/2011";
  if (n.includes("sanjay")) return "D/980/2007";
  return "BCI Verified";
};

const getExperience = (name?: string, exp?: number): number => {
  if (exp && exp > 0) return exp;
  const n = (name || "").toLowerCase();
  if (n.includes("sanjay")) return 15;
  if (n.includes("rajesh")) return 12;
  if (n.includes("vikram")) return 14;
  if (n.includes("priya")) return 9;
  if (n.includes("ananya")) return 6;
  return 10;
};

function ChatContent() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "user_placeholder";
  const searchParams = useSearchParams();
  const initPrompt = searchParams?.get("init");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caseId, setCaseId] = useState<string>("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TA'>('EN');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 15MB upload limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

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
    const currentAttachments = [...attachments];
    const query = (text || input).trim();
    if ((!query && currentAttachments.length === 0) || loading) return;

    setInput("");
    setAttachments([]);

    const displayContent = query || `Attached ${currentAttachments.length} document${currentAttachments.length > 1 ? 's' : ''} for evidentiary analysis: ${currentAttachments.map(a => a.name).join(', ')}`;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: displayContent, 
      timestamp: new Date(),
      attachments: currentAttachments,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: query || "Analyze attached case documents, extract governing clauses, and evaluate statutory compliance.", 
          userId, 
          caseId: caseId || undefined,
          language: selectedLang,
          attachments: currentAttachments.map((a) => ({
            name: a.name,
            type: a.type,
            size: a.size,
          })),
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
    <div className="flex flex-col h-[calc(100vh-112px)] max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-[#070A12]/95 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
      
      {/* Sleek Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-to-b from-blue-600/[0.09] to-transparent rounded-full blur-[110px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#0A0D18]/90 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Scale size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14.5px] font-bold text-white tracking-tight">LexNova AI Legal Intelligence</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Live RAG
              </span>
            </div>
            <p className="text-[11px] text-[#6B7B94]">
              {caseId ? `Active Docket: LN-${caseId.slice(-6).toUpperCase()}` : "Supreme Court Precedents · Limitation Act 1963 · Indian Statutory Code"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 text-[11px] font-medium text-[#8D9CB0]">
            {(['EN', 'HI', 'TA'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  selectedLang === lang ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'hover:text-white'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>

          <button
            onClick={resetChat}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8D9CB0] hover:text-white transition-all cursor-pointer"
            title="Start Fresh Inquiry"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Messages Stream / Empty State */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 relative z-10 scrollbar-thin scrollbar-thumb-white/10 flex flex-col justify-center">
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in w-full my-auto">
            
            {/* Hero Prompt Headline */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11.5px] font-medium shadow-sm">
                <Sparkles size={12} />
                <span>Instant Legal Assessment & Notice Preparation</span>
              </div>
              <h2 className="text-[24px] sm:text-[27px] font-bold text-white tracking-tight">
                How can LexNova assist your legal matter today?
              </h2>
              <p className="text-[13.5px] text-[#8D9CB0] max-w-lg mx-auto leading-relaxed">
                Describe your situation in plain words. Our neural engine maps Indian statutes, calculates court limitation deadlines, and drafts court-compliant demand notices.
              </p>
            </div>

            {/* 4 Compact Prompt Cards (Fits without vertical scroll!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
              {POPULAR_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => send(item.query)}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-2xl bg-[#090C16]/90 hover:bg-[#0E1424] border border-white/[0.08] hover:border-blue-500/40 text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/30 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                          {item.tag}
                        </span>
                        <ChevronRight size={12} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                      <h4 className="text-[13.5px] font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#7A8A9E] truncate mt-0.5">
                        {item.description}
                      </p>
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
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {isUser ? (
                  <div className="flex flex-col items-end max-w-xl ml-auto mb-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span>Submitted Inquiry</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/25 text-white shadow-xl shadow-blue-600/25 rounded-2xl rounded-tr-xs px-5 py-3 backdrop-blur-md">
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 border border-white/20 text-white text-[11px] font-medium shadow-sm">
                              <Paperclip size={11} className="text-blue-200" />
                              <span className="max-w-[170px] truncate">{att.name}</span>
                              <span className="text-[9.5px] text-blue-200/80 font-mono">
                                {(att.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-[14.5px] font-medium leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3.5 w-full max-w-3xl">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-500/25">
                      <Scale size={15} />
                    </div>

                    <div className="flex-1 rounded-2xl p-6 bg-gradient-to-b from-[#0D1222]/95 to-[#080B16]/95 border border-white/[0.08] text-[#E2E8F0] shadow-2xl rounded-tl-xs relative overflow-hidden backdrop-blur-xl">
                      {/* Top ambient highlight line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                      {renderContent(msg.content)}

                      {/* Recommended Advocates */}
                      {msg.lawyers && msg.lawyers.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-blue-400 uppercase tracking-wider">
                              <Users size={14} />
                              <span>Bar Council Verified Counsel On Record</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck size={11} /> Verified Roster
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {msg.lawyers.slice(0, 2).map((adv: any) => {
                              const photo = getAdvocatePhoto(adv.name);
                              const formattedSpec = formatSpecialization(adv.specialization || adv.type);
                              const court = getCourtAdmission(adv.name, adv.city);
                              const barNo = getBarNumber(adv.name);
                              const experience = getExperience(adv.name, adv.experience || adv.experienceYears);

                              return (
                                <div
                                  key={adv.id}
                                  className="p-4 rounded-2xl bg-gradient-to-b from-[#0E1322] to-[#0A0D17] border border-white/[0.08] hover:border-blue-500/40 flex flex-col justify-between gap-3.5 transition-all shadow-xl group relative overflow-hidden"
                                >
                                  {/* Top accent line */}
                                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                  <div>
                                    {/* Avatar & Header */}
                                    <div className="flex items-start gap-3 mb-2.5">
                                      <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 relative bg-slate-800 shadow-md">
                                          <Image
                                            src={photo}
                                            alt={adv.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                          />
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0E1322] flex items-center justify-center">
                                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        </span>
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                          <h4 className="text-[14px] font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                                            {adv.name}
                                          </h4>
                                          <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                            <CheckCircle size={10} /> Verified
                                          </span>
                                        </div>

                                        <p className="text-[11.5px] text-[#8D9CB0] truncate mt-0.5">
                                          {court}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                                            <Star size={11} fill="currentColor" /> {adv.rating || '4.9'}
                                          </span>
                                          <span className="text-slate-600">·</span>
                                          <span>{experience} Yrs Bar</span>
                                          <span className="text-slate-600">·</span>
                                          <span className="font-mono text-[10px] text-blue-300">{barNo}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Specialization tag */}
                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-slate-300">
                                      <Briefcase size={11} className="text-blue-400" />
                                      <span>{formattedSpec}</span>
                                    </div>
                                  </div>

                                  {/* Fee & Deploy Call CTA */}
                                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                                    <div>
                                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                                        Retainer / Session
                                      </div>
                                      <div className="text-[14px] font-extrabold text-white">
                                        ₹{adv.consultationFee || 999}
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => {
                                        setSelectedLawyer(adv);
                                        setBookingOpen(true);
                                      }}
                                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[12px] font-bold transition-all shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-1.5 cursor-pointer active:scale-95"
                                    >
                                      <span>Deploy Session</span>
                                      <ChevronRight size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Gold-Standard Floating Command Console (Claude / ChatGPT 4o grade with Attachments) */}
      <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-gradient-to-t from-[#070A12] via-[#070A12]/95 to-transparent relative z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              const fakeEvent = { target: { files } } as any;
              handleFileUpload(fakeEvent);
            }
          }}
          className="max-w-3xl mx-auto relative group"
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Reactive Ambient Glow */}
          <div className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-blue-500/25 blur-lg opacity-40 group-focus-within:opacity-80 transition duration-500 pointer-events-none" />

          {/* Luxury Floating Pill Console Body */}
          <div className="relative rounded-[24px] bg-[#0C101D]/95 border border-white/[0.12] group-focus-within:border-blue-500/50 shadow-[0_12px_45px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 p-3">
            
            {/* Attachment Preview Tray */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2.5 pt-0.5 px-2 border-b border-white/[0.06]">
                {attachments.map((file, idx) => {
                  const isPdf = file.type.includes('pdf') || /\.pdf$/i.test(file.name);
                  const isImg = file.type.includes('image') || /\.(png|jpe?g|webp)$/i.test(file.name);
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-200 text-[11.5px] shadow-sm animate-fade-in"
                    >
                      {isPdf ? (
                        <FileText size={13} className="text-red-400 shrink-0" />
                      ) : isImg ? (
                        <ImageIcon size={13} className="text-purple-400 shrink-0" />
                      ) : (
                        <FileCheck size={13} className="text-emerald-400 shrink-0" />
                      )}
                      <span className="max-w-[140px] truncate font-medium">{file.name}</span>
                      <span className="text-[10px] text-blue-400/80 font-mono">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="p-0.5 rounded-md hover:bg-white/10 text-blue-300 hover:text-white transition-colors cursor-pointer"
                        title="Remove attachment"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Main Textarea */}
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
              placeholder={attachments.length > 0 ? "Add questions about your attached files (or press Enter to analyze)..." : "Ask anything, or attach agreements, cheques & notices for instant AI analysis..."}
              className="w-full bg-transparent border-none text-white text-[14.5px] leading-relaxed placeholder:text-[#52627A] focus:outline-none resize-none px-2 pt-1"
            />

            {/* Bottom Controls Row inside the Pill */}
            <div className="flex items-center justify-between pt-1 px-1">
              <div className="flex items-center gap-2">
                {/* Attach File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer group/att"
                  title="Attach agreements, notices, cheques, or photos (PDF, PNG, JPG, DOCX)"
                >
                  <Paperclip size={13} className="text-blue-400 group-hover/att:rotate-45 transition-transform" />
                  <span>Attach</span>
                  {attachments.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9.5px] font-bold flex items-center justify-center">
                      {attachments.length}
                    </span>
                  )}
                </button>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-medium">
                  <Scale size={12} className="text-blue-400" />
                  <span className="hidden sm:inline">Supreme Court & High Courts Live RAG</span>
                  <span className="sm:hidden">Live RAG</span>
                </span>

                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  <span>256-Bit DPDPA</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10.5px] text-slate-500 hidden sm:inline font-mono">
                  Enter ↵
                </span>

                <button
                  type="submit"
                  disabled={(!input.trim() && attachments.length === 0) || loading}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:hover:from-blue-600 disabled:hover:to-indigo-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
                  aria-label="Execute legal inquiry"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ArrowUp size={16} />
                  )}
                </button>
              </div>
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
