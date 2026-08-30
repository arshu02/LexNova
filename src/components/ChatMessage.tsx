"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/store/legalStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Scale,
    Star,
    Briefcase,
    MapPin,
    ArrowRight
} from "lucide-react";
import LawyerCard from "./LawyerCard";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end mb-8 animate-slide-in">
                <div className="max-w-[80%]">
                     <p className="text-[10px] font-medium text-slate-400 mb-2 text-right">
                        {format(message.timestamp, "h:mm a")}
                    </p>
                    <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    // AI response (Conversational)
    return (
        <div className="flex justify-start mb-8 animate-slide-in">
            <div className="max-w-[85%] flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-white\/20">
                    <Scale className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400 mb-2 flex items-center gap-2">
                        Legal Assistant • {format(message.timestamp, "h:mm a")}
                    </p>
                    
                    <div className="bg-[#0D0D18] border border-slate-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-lg shadow-slate-100/50">
                        {/* Check if content is actually provided or fallback to a roadmap summary if it exists */}
                        <div className="text-[15px] text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                            {message.content ? message.content : message.roadmap?.summary}
                        </div>

                        {message.lawyers && message.lawyers.length > 0 && (
                            <div className="mt-6 border border-white\/10 bg-[#0D0D18]\/5/30 rounded-xl p-5 shadow-sm">
                                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Recommended Experts
                                </h4>
                                <div className="space-y-4">
                                {message.lawyers.map((lawyer, i) => (
                                    <LawyerCard key={i} lawyer={lawyer} />
                                ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-50">
                            <p className="text-[10px] font-medium text-slate-400">
                                This is AI-assisted legal guidance. Consult a licensed lawyer for final advice.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TypingIndicator() {
    return (
        <div className="flex justify-start mb-8">
            <div className="max-w-[85%] flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-white\/20">
                    <Scale className="w-4 h-4 text-white" />
                </div>
                <div>
                     <p className="text-[10px] font-medium text-slate-400 mb-2">Legal Assistant</p>
                    <div className="bg-[#0D0D18] border border-slate-100 rounded-2xl rounded-tl-sm shadow-md shadow-slate-100/50 px-5 py-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
