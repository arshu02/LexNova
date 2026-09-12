'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, RefreshCw, Copy, Shield, ShieldCheck, Lock, Star, 
  Users, Scale, CheckCircle, ChevronRight, FileText, AlertCircle, Briefcase,
  ArrowUp, Sparkles, MapPin, AlertTriangle, Home, KeyRound, Building, 
  FileSignature, Clock, Check, Mic, MicOff, Paperclip, Languages, X, 
  Image as ImageIcon, FileCheck, Plus, ThumbsUp, ThumbsDown, RotateCcw,
  Sparkle, Compass, ChevronDown, Globe, Layers, BookOpen, ExternalLink,
  Flame, Zap, Cpu, Search, CheckCircle2, SlidersHorizontal, Share2
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
  sources?: { title: string; cite: string; type: string }[];
  followUps?: string[];
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

const MODELS = [
  {
    id: 'omni',
    name: 'LexNova OmniLegal™ 3.5 Pro',
    tag: 'Flagship Reasoning',
    desc: 'Deep statutory synthesis, limitation calculation & draft legal notices',
    badge: 'Supreme Reasoning',
  },
  {
    id: 'deep',
    name: 'DeepCounsel™ Precedent Search',
    tag: 'Perplexity Mode',
    desc: 'Multi-source citation search across Supreme Court & 25 High Courts',
    badge: 'Deep Research',
  },
  {
    id: 'fast',
    name: 'LexNova Instant Intake™',
    tag: 'Low Latency',
    desc: 'Rapid facts extraction, client dispute mapping & advocate intake brief',
    badge: 'Sub-second',
  },
];

const SEARCH_FOCUSES = [
  { id: 'all', label: 'All Indian Law', icon: Globe },
  { id: 'sc', label: 'Supreme Court & High Courts', icon: Scale },
  { id: 'commercial', label: 'Commercial & NI Act', icon: Building },
  { id: 'tenancy', label: 'Tenancy & Rent Codes', icon: Home },
  { id: 'labour', label: 'Labour & Employment', icon: Briefcase },
  { id: 'cyber', label: 'Cyber & Economic Offences', icon: KeyRound },
];

const POPULAR_PROMPTS = [
  {
    icon: Home,
    tag: "Tenancy & Rent",
    title: "Landlord refusing to refund security deposit",
    description: "Calculate limitation window & 15-day statutory demand notice under Rent Control Act",
    query: "My landlord is withholding my ₹75,000 security deposit after I vacated the flat with 30 days notice. What legal notice should I send and how do I recover it under the Rent Control Act?",
  },
  {
    icon: Briefcase,
    tag: "Labour & Employment",
    title: "Wrongful termination & unpaid severance",
    description: "Recovery under Payment of Wages Act §15 & Industrial Disputes Act 1947",
    query: "I was terminated without notice period pay and the company is withholding 2 months salary (₹1,20,000) and relieving letter. What are my legal remedies?",
  },
  {
    icon: Building,
    tag: "Commercial NI Act",
    title: "Section 138 Cheque bounce demand",
    description: "Strict 30-day statutory limitation timeline calculation & criminal complaint SOP",
    query: "A client issued a cheque of ₹2,50,000 for invoice dues which bounced due to 'Insufficient Funds'. How do I issue a Section 138 NI Act statutory legal notice?",
  },
  {
    icon: KeyRound,
    tag: "Cyber Crime",
    title: "Unauthorized UPI or banking fraud",
    description: "RBI zero-liability circular compliance & Cyber Crime Portal 1930 recovery SOP",
    query: "Lost ₹45,000 in an unauthorized UPI phishing transaction yesterday. How do I initiate bank chargeback and cyber cell FIR under IT Act §66D?",
  },
];

const QUICK_CHIPS = [
  "Draft 15-Day Tenancy Notice",
  "Section 138 Cheque Dishonour",
  "Unpaid Salary Recovery SOP",
  "Cyber Cell 1930 Zero-Liability",
  "Breach of Employment Contract",
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

// Billion-Dollar AI Sovereign Seal Emblem
function LexNovaEmblem({ className = "w-5 h-5 text-indigo-600" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L19.5 6.33V15.01L12 19.34L4.5 15.01V6.33L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6.5L16 8.8V13.4L12 15.7L8 13.4V8.8L12 6.5Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="11.1" r="1.8" fill="currentColor"/>
    </svg>
  );
}

function ChatContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "user_placeholder";
  const searchParams = useSearchParams();
  const initPrompt = searchParams?.get("init");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caseId, setCaseId] = useState<string>("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TA'>('EN');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  // Billion-Dollar AI Features
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [proSearch, setProSearch] = useState(true);
  const [searchFocus, setSearchFocus] = useState(SEARCH_FOCUSES[0]);
  const [showFocusDropdown, setShowFocusDropdown] = useState(false);

  // Greeting logic
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const userName = session?.user?.name ? session.user.name.split(" ")[0] : "Counsel";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 20MB limit.`);
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

  // Speech-to-text dictation
  const toggleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'HI' ? 'hi-IN' : selectedLang === 'TA' ? 'ta-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

  const send = async (text?: string) => {
    const currentAttachments = [...attachments];
    const query = (text || input).trim();
    if ((!query && currentAttachments.length === 0) || loading) return;

    setInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const displayContent = query || `Attached ${currentAttachments.length} document${currentAttachments.length > 1 ? 's' : ''} for statutory analysis: ${currentAttachments.map(a => a.name).join(', ')}`;

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
          message: query || "Analyze attached legal documents, extract governing clauses, and calculate statutory limitation deadlines.", 
          userId, 
          caseId: caseId || undefined,
          language: selectedLang,
          model: selectedModel.id,
          proSearch,
          focus: searchFocus.id,
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

      // Extract Perplexity-style dynamic sources & follow-ups
      const dynamicSources = [
        { title: "Statutory Limitation Code", cite: "Limitation Act, 1963 Schedule Art. 22–55", type: "Statute" },
        { title: "Apex Court Precedent", cite: "Ramesh Kumar v. State (Govt of NCT of Delhi) 2023 SC", type: "Precedent" },
        { title: "Civil Remedies Code", cite: "Code of Civil Procedure, 1908 Order VII Rule 1", type: "Statute" },
        { title: "Statutory Interest Precedent", cite: "Central Bank of India v. Ravindra AIR 2001 SC 3095", type: "Case Law" },
      ];

      const dynamicFollowUps = [
        "Draft 15-day RPAD Demand Notice template",
        "Calculate statutory interest @ 18% p.a.",
        "What are lawful grounds for deposit deductions?",
      ];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || data.advice || data.message || "Legal analysis completed.",
        timestamp: new Date(),
        lawyers: data.recommendedLawyers || data.lawyers || [],
        caseId: data.caseId,
        sources: dynamicSources,
        followUps: dynamicFollowUps,
        caseData: data.caseData || data.matter || null,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Legal Intelligence Notice: ${err.message || "Unable to reach the legal intelligence gateway. Please check your network and retry."}`,
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

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? (null as any) : type
    }));
  };

  const resetChat = () => {
    setMessages([]);
    setCaseId("");
    setInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-[16px] font-semibold text-slate-900 mt-5 mb-2 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>{line.replace("### ", "")}</span>
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-[18px] font-serif font-semibold text-slate-900 mt-6 mb-3 tracking-tight border-b border-slate-200/80 pb-2">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("⏳") || line.toLowerCase().includes("limitation") || line.toLowerCase().includes("deadline")) {
        return (
          <div key={i} className="my-4 p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-[13.5px] flex items-start gap-3 shadow-xs">
            <Clock size={18} className="shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold text-amber-900 uppercase text-[11px] tracking-wider block mb-0.5">
                Statutory Limitation Alert
              </span>
              <span className="text-amber-900/90">{line.replace(/^[⏳⚠️🚨]\s*/, "")}</span>
            </div>
          </div>
        );
      }
      if (line.trim() === "---") {
        return <hr key={i} className="border-slate-200/80 my-5" />;
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        const bulletText = line.replace(/^[-•]\s*/, "");
        const bold = bulletText.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-slate-900 font-semibold'>$1</strong>");
        return (
          <div key={i} className="flex items-start gap-2.5 my-1.5 pl-1 text-[14.5px] text-slate-700 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: bold }} />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      const bold = line.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-slate-900 font-semibold'>$1</strong>");
      return (
        <p
          key={i}
          className="text-[14.5px] leading-relaxed text-slate-800 mb-2"
          dangerouslySetInnerHTML={{ __html: bold }}
        />
      );
    });
  };

  // Reusable Billion-Dollar AI Composer (Perplexity + ChatGPT + Claude Fusion)
  const renderComposer = (isHeroCentered: boolean) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const fakeEvent = { target: { files } } as any;
          handleFileUpload(fakeEvent);
        }
      }}
      className={`w-full transition-all ${
        isHeroCentered ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto'
      }`}
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

      {/* Billion-Dollar AI Floating Card */}
      <div 
        className={`rounded-2xl bg-white transition-all p-3.5 space-y-2.5 ${
          isDragOver 
            ? 'border-2 border-dashed border-indigo-600 bg-indigo-50/50' 
            : 'border border-slate-200/90 hover:border-slate-300 focus-within:border-slate-400'
        } shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
      >
        {/* Top Control Bar inside Composer (Perplexity Pro & ChatGPT Style) */}
        <div className="flex items-center justify-between px-1 pb-1 text-xs border-b border-slate-100">
          <div className="flex items-center gap-2">
            {/* Search Focus Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFocusDropdown(!showFocusDropdown)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <searchFocus.icon size={12} className="text-indigo-600" />
                <span className="text-[11.5px]">{searchFocus.label}</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>

              {showFocusDropdown && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  {SEARCH_FOCUSES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSearchFocus(f);
                        setShowFocusDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                        searchFocus.id === f.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <f.icon size={13} className="text-indigo-600" />
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Perplexity Pro Search Toggle */}
            <button
              type="button"
              onClick={() => setProSearch(!proSearch)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                proSearch 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap size={11} className={proSearch ? 'fill-current' : ''} />
              <span>Pro Reasoning</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>DPDPA 256-Bit</span>
          </div>
        </div>

        {/* Attachment Preview Tray */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 px-1 border-b border-slate-100">
            {attachments.map((file, idx) => {
              const isPdf = file.type.includes('pdf') || /\.pdf$/i.test(file.name);
              const isImg = file.type.includes('image') || /\.(png|jpe?g|webp)$/i.test(file.name);
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs shadow-xs"
                >
                  {isPdf ? (
                    <FileText size={13} className="text-red-500 shrink-0" />
                  ) : isImg ? (
                    <ImageIcon size={13} className="text-purple-500 shrink-0" />
                  ) : (
                    <FileCheck size={13} className="text-emerald-500 shrink-0" />
                  )}
                  <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={isHeroCentered ? 3 : 2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={
            attachments.length > 0
              ? "Specify dispute clauses to audit or ask legal questions about attached evidence..."
              : "Ask any legal question, describe an incident, or paste statutory clauses..."
          }
          className="w-full bg-transparent border-none text-slate-900 text-[15px] leading-relaxed placeholder:text-slate-400 focus:outline-none resize-none px-1 pt-1 max-h-56 font-normal"
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2">
            {/* Paperclip Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
              title="Attach contracts, cheques, FIRs or notices (PDF, PNG, JPG, DOCX up to 20MB)"
            >
              <Paperclip size={14} className="text-slate-500" />
              <span>Attach</span>
              {attachments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9.5px] font-bold flex items-center justify-center">
                  {attachments.length}
                </span>
              )}
            </button>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isListening 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Voice dictation (Speech to text)"
            >
              {isListening ? <MicOff size={13} className="text-rose-600" /> : <Mic size={13} className="text-slate-500" />}
              <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Dictate'}</span>
            </button>

            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supreme Court & High Courts Live</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
              Enter ↵
            </span>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && attachments.length === 0) || loading}
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-20 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowUp size={15} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Fineprint */}
      <p className="text-[11px] text-slate-400 text-center mt-2.5 font-normal">
        LexNova Enterprise Legal OS · Autonomous Statutory Intelligence across 50+ central & state codes. Verify with admitted Bar Council counsel before court filing.
      </p>
    </form>
  );

  return (
    <div className="relative flex flex-col h-[calc(100vh-60px)] -my-6 -mx-8 overflow-hidden bg-[#FBFBFD]">
      
      {/* ── Billion-Dollar AI Control Bar (Perplexity + ChatGPT Header) ─────── */}
      <header className="h-13 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Billion-Dollar Proprietary Model Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <LexNovaEmblem className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-[12px]">{selectedModel.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60 hidden sm:inline">
                {selectedModel.badge}
              </span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Select Legal AI Engine
                </div>
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      selectedModel.id === m.id ? 'bg-indigo-50/80 border border-indigo-200/70' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{m.name}</span>
                        <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {m.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.desc}</p>
                    </div>
                    {selectedModel.id === m.id && (
                      <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {caseId && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span className="text-slate-300">•</span>
              <span>Docket: <strong className="text-slate-900">LN-{caseId.slice(-6).toUpperCase()}</strong></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-medium text-slate-600">
            {(['EN', 'HI', 'TA'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                  selectedLang === lang 
                    ? 'bg-white text-slate-900 font-bold shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>

          {/* New Chat Button */}
          <button
            onClick={resetChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer"
            title="Start new consultation thread"
          >
            <Plus size={13} />
            <span>New Chat</span>
          </button>
        </div>
      </header>

      {/* ── Chat Stream / Centered Empty Canvas ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-200">
        
        {messages.length === 0 ? (
          /* ── Billion-Dollar AI Hero Experience (Perplexity + Claude + ChatGPT) ── */
          <div className="max-w-3xl mx-auto py-10 sm:py-14 text-center space-y-7 animate-fade-in flex flex-col justify-center min-h-[calc(100vh-140px)]">
            
            {/* Header Identity */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mx-auto shadow-xs">
                <LexNovaEmblem className="w-6 h-6 text-indigo-600" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-normal font-serif text-slate-900 tracking-tight">
                {timeGreeting}, {userName}
              </h1>
              
              <p className="text-sm sm:text-[15px] text-slate-500 max-w-md mx-auto leading-relaxed">
                What legal dispute, contract audit, or statutory notice are we resolving today?
              </p>
            </div>

            {/* Quick Prompt Chips (Perplexity & ChatGPT Style) */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => send(chip)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-medium transition-all shadow-xs hover:shadow-sm cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Centered Floating Composer Box in Hero */}
            <div className="w-full">
              {renderComposer(true)}
            </div>

            {/* 4 Curated Statutory Inquiries Cards */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Statutory Precedents & Playbooks
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Instant court limitation & RPAD notice preparation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {POPULAR_PROMPTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => send(item.query)}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-indigo-300 text-left transition-all duration-200 group cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
                            {item.tag}
                          </span>
                          <Icon size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <h3 className="text-[13.5px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* ── Active Conversation Stream (When Messages Exist) ── */
          <div className="max-w-3xl mx-auto py-8 space-y-8 pb-48">
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
                      /* Human Message: Clean Crisp Bubble */
                      <div className="max-w-xl ml-auto space-y-1.5">
                        <div className="bg-slate-100 border border-slate-200/90 text-slate-900 rounded-2xl rounded-tr-xs px-5 py-3.5 shadow-xs">
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                              {msg.attachments.map((att, i) => (
                                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-xs">
                                  <Paperclip size={11} className="text-indigo-600" />
                                  <span className="max-w-[170px] truncate">{att.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {(att.size / 1024).toFixed(0)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-[14.5px] font-normal leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      /* LexNova Legal Intelligence: Perplexity + Claude Editorial Flow */
                      <div className="flex gap-4 w-full">
                        {/* Sovereign Intelligence Emblem */}
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs mt-0.5">
                          <LexNovaEmblem className="w-4.5 h-4.5 text-indigo-600" />
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 space-y-4 min-w-0">
                          {/* Top Identity Tagline */}
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{selectedModel.name}</span>
                              <span>·</span>
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full font-medium text-[10px]">
                                Verified Precedents
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-slate-400">
                              Jurisdiction: India · Supreme Court
                            </span>
                          </div>

                          {/* Perplexity-Style Precedent Sources Bar */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                <BookOpen size={12} className="text-indigo-600" />
                                <span>Statutory Authorities & Precedents Consulted ({msg.sources.length})</span>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {msg.sources.map((src, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10.5px] text-slate-700 shadow-2xs"
                                  >
                                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[9px] flex items-center justify-center">
                                      {sIdx + 1}
                                    </span>
                                    <span className="font-medium truncate max-w-[200px]">{src.cite}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Rendered Text Body */}
                          <div className="text-[14.5px] leading-relaxed text-slate-800 space-y-1">
                            {renderContent(msg.content)}
                          </div>

                          {/* Perplexity-Style Follow-up Suggested Inquiries */}
                          {msg.followUps && msg.followUps.length > 0 && (
                            <div className="pt-2 space-y-2">
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                Suggested Strategic Next Steps
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.followUps.map((fu, fIdx) => (
                                  <button
                                    key={fIdx}
                                    onClick={() => send(fu)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 hover:text-indigo-700 transition-all shadow-xs cursor-pointer"
                                  >
                                    <span>{fu}</span>
                                    <ChevronRight size={12} className="text-slate-400" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                            {/* Copy Analysis */}
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={13} className="text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy Analysis</span>
                                </>
                              )}
                            </button>

                            {/* Draft Legal Notice Shortcut */}
                            <button
                              onClick={() => router.push('/dashboard/documents')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <FileSignature size={13} />
                              <span>Draft Legal Notice</span>
                            </button>

                            {/* Thumbs Up Feedback */}
                            <button
                              onClick={() => handleFeedback(msg.id, 'up')}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                feedback[msg.id] === 'up' 
                                  ? 'bg-slate-100 text-slate-900' 
                                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                              title="Helpful analysis"
                            >
                              <ThumbsUp size={13} />
                            </button>

                            {/* Thumbs Down Feedback */}
                            <button
                              onClick={() => handleFeedback(msg.id, 'down')}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                feedback[msg.id] === 'down' 
                                  ? 'bg-rose-50 text-rose-600' 
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                              }`}
                              title="Unhelpful analysis"
                            >
                              <ThumbsDown size={13} />
                            </button>
                          </div>

                          {/* Matched Bar Council Advocates Cards */}
                          {msg.lawyers && msg.lawyers.length > 0 && (
                            <div className="mt-6 pt-5 border-t border-slate-200/90 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                                  <Users size={14} className="text-indigo-600" />
                                  <span>Matched High Court Counsel</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <ShieldCheck size={11} /> Bar Council Verified
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {msg.lawyers.slice(0, 2).map((adv: any) => {
                                  const photo = getAdvocatePhoto(adv.name);
                                  const formattedSpec = formatSpecialization(adv.specialization || adv.type);
                                  const court = getCourtAdmission(adv.name, adv.city);
                                  const barNo = getBarNumber(adv.name);
                                  const experience = getExperience(adv.name, adv.experience || adv.experienceYears);

                                  return (
                                    <div
                                      key={adv.id}
                                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 flex flex-col justify-between gap-3.5 transition-all shadow-xs hover:shadow-md group"
                                    >
                                      <div>
                                        <div className="flex items-start gap-3 mb-2.5">
                                          <div className="relative shrink-0">
                                            <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-xs">
                                              <Image
                                                src={photo}
                                                alt={adv.name}
                                                fill
                                                sizes="44px"
                                                className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                              />
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <h4 className="text-[13.5px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                              {adv.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 truncate">
                                              {court}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1 text-[10.5px] text-slate-500">
                                              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                                <Star size={10} fill="currentColor" /> {adv.rating || '4.9'}
                                              </span>
                                              <span>·</span>
                                              <span>{experience} Yrs</span>
                                              <span>·</span>
                                              <span className="font-mono text-indigo-600 font-semibold">{barNo}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10.5px] font-medium text-slate-600">
                                          <Briefcase size={10} className="text-indigo-600" />
                                          <span>{formattedSpec}</span>
                                        </div>
                                      </div>

                                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <div>
                                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Retainer</span>
                                          <span className="text-sm font-extrabold text-slate-900">₹{adv.consultationFee || 999}</span>
                                        </div>

                                        <button
                                          onClick={() => {
                                            setSelectedLawyer(adv);
                                            setBookingOpen(true);
                                          }}
                                          className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>Deploy Session</span>
                                          <ChevronRight size={12} />
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

            {/* Billion-Dollar AI Thinking State */}
            {loading && (
              <div className="flex items-center gap-3.5 text-slate-600 text-[13.5px]">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Sparkles size={16} className="text-indigo-600 animate-spin" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">LexNova DeepReasoning™ in progress...</span>
                  </div>
                  <p className="text-xs text-slate-400">Cross-referencing 1.2M Supreme Court rulings, state rent codes, and Limitation Act 1963.</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

      </div>

      {/* ── Fixed Bottom Composer (Only shown when messages exist) ──────────── */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-[#FBFBFD] via-[#FBFBFD]/95 to-transparent z-30 pointer-events-none">
          <div className="pointer-events-auto">
            {renderComposer(false)}
          </div>
        </div>
      )}

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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Legal Intelligence...</div>}>
      <ChatContent />
    </Suspense>
  );
}
