'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Video, Phone, MessageSquare, Send, Paperclip, ShieldCheck,
  Scale, FileText, CheckCircle2, Clock, Sparkles, User,
  MoreVertical, Copy, Check, ExternalLink, ChevronRight,
  ArrowLeft, Download
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'lawyer' | 'ai';
  senderName: string;
  text: string;
  time: string;
}

export default function ConsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const caseId = (params?.id as string) || "MAT-1042";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      senderName: "LexNova AI Assistant",
      text: "⚡ Pre-Meeting Brief: Client completed notice period on May 31, 2025. Gross unpaid wages: ₹95,000. Statutory notice draft under Payment of Wages Act §15 prepared.",
      time: "04:28 PM",
    },
    {
      id: "m2",
      sender: "lawyer",
      senderName: "Advocate Rajesh Sharma",
      text: "Good afternoon. I have reviewed your employment agreement and the resignation acceptance email. Everything is in order for the RPAD notice.",
      time: "04:30 PM",
    }
  ]);

  const [input, setInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const meetLink = `https://meet.jit.si/LexNova-${caseId}-Consult`;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "client",
      senderName: session?.user?.name || session?.user?.email?.split('@')[0] || "Client",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "lawyer",
          senderName: "Advocate Rajesh Sharma",
          text: "I've noted this down. I will review the additional bank statements and countersign the Section 15 petition today.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", height: "calc(100vh - 100px)" }}>
      
      {/* Top Consultation Room Bar */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "14px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.push("/dashboard/bookings")}
            className="btn-ghost"
            style={{ padding: "6px 12px", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", height: "36px" }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: "#CBD5E1" }}>/</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>
                Consultation Room · {caseId}
              </h2>
              <span style={{ fontSize: "12px", color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>
                ● Active Secure Call
              </span>
            </div>
            <p style={{ fontSize: "12.5px", color: "#64748B" }}>
              Advocate Rajesh Sharma · Employment Dispute · End-to-End Encrypted
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleCopyLink}
            className="btn-ghost"
            style={{ fontSize: "13px", padding: "6px 14px", height: "38px", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Copy size={14} /> {copiedLink ? "Copied Link!" : "Copy Meeting Link"}
          </button>

          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: "13px", padding: "7px 16px", height: "38px", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
          >
            <Video size={15} /> Launch Fullscreen HD Video
          </a>
        </div>
      </div>

      {/* 3-Column Consultation Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "310px 1fr 310px", gap: "18px", flex: 1, minHeight: 0 }}>
        
        {/* Left Column: 60-Second Brief & Key Facts */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={15} /> 60-Second Case Brief
          </div>

          <div style={{ background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "12px", padding: "14px", fontSize: "13px", color: "#1E293B", lineHeight: "1.55" }}>
            <strong style={{ color: "#0F172A" }}>Client:</strong> {session?.user?.name || session?.user?.email?.split('@')[0] || "Client"}<br />
            <strong style={{ color: "#0F172A" }}>Opposing:</strong> TechCorp Solutions<br />
            <strong style={{ color: "#0F172A" }}>Claim:</strong> ₹95,000 Unpaid Salary<br />
            <strong style={{ color: "#0F172A" }}>Statute:</strong> Payment of Wages Act §15
          </div>

          <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Key Discussion Items
          </div>

          <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: "1.65" }}>
            <li>Verify 30-day resignation notice service.</li>
            <li>Confirm bank statements for non-credit of salary.</li>
            <li>Approve RPAD notice draft to directors.</li>
            <li>Establish 15-day deadline for response.</li>
          </ul>

          <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
            <Link
              href={`/dashboard/matters/${caseId}`}
              className="btn-ghost w-full justify-center text-[13px] py-2"
            >
              Open Full Matter Workspace →
            </Link>
          </div>
        </div>

        {/* Center Column: Embedded Video & Chat */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          
          {/* Jitsi Video Preview / Frame */}
          <div style={{
            height: "260px",
            background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{
                width: "56px", height: "56px",
                borderRadius: "50%",
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
                color: "#2563EB",
              }}>
                <Video size={24} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>
                HD Video Room Connected
              </h3>
              <p style={{ fontSize: "13px", color: "#64748B", marginTop: "2px", marginBottom: "14px" }}>
                Advocate Rajesh Sharma is currently in this consultation room.
              </p>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "13px", padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
              >
                <Video size={14} /> Enter Video Call
              </a>
            </div>
          </div>

          {/* Real-time Client-Lawyer Chat Stream */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "#FFFFFF" }}>
            {messages.map((m) => {
              const isMe = m.sender === "client";
              const isAi = m.sender === "ai";
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isMe ? "flex-end" : isAi ? "center" : "flex-start",
                    maxWidth: isAi ? "90%" : "75%",
                    background: isMe ? "#2563EB" : isAi ? "#EFF6FF" : "#F1F5F9",
                    color: isMe ? "#FFFFFF" : isAi ? "#1E40AF" : "#0F172A",
                    border: isAi ? "1px solid #BFDBFE" : isMe ? "none" : "1px solid #E2E8F0",
                    borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    padding: "12px 16px",
                    fontSize: "13.5px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "700", opacity: 0.8, marginBottom: "3px" }}>
                    {m.senderName} · {m.time}
                  </div>
                  <div style={{ lineHeight: "1.5" }}>{m.text}</div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "12px 18px",
              background: "#F8FAFC",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Advocate Rajesh Sharma or ask AI assistant..."
              style={{
                flex: 1,
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "9px 16px",
                fontSize: "13.5px",
                color: "#0F172A",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "9px 16px", fontSize: "13px", height: "40px" }}
            >
              <Send size={14} />
            </button>
          </form>

        </div>

        {/* Right Column: Shared Documents & Action Items */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={15} /> Matter Documents
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>RPAD Legal Notice Draft</div>
              <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "2px" }}>Generated · Ready for Signature</div>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px" }}>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>Employment Agreement (PDF)</div>
              <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "2px" }}>Uploaded Exhibit P-1</div>
            </div>
          </div>

          <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "8px" }}>
            Agreed Action Items
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "#334155", display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Advocate signs notice under Bar Council seal.</span>
            </div>
            <div style={{ fontSize: "13px", color: "#334155", display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Client dispatches via Registered Post (RPAD).</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
