"use client";

import React, { useState } from "react";
import { Advocate } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, ShieldCheck, ArrowRight, Zap, Star } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { motion } from "framer-motion";

interface AdvocateCardProps {
    advocate: Advocate;
}

export function AdvocateCard({ advocate }: AdvocateCardProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0D0D18]/[0.02] border border-white/5 p-8 rounded-3xl transition-all cursor-default group relative overflow-hidden"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 blur-3xl -z-10 transition-all opacity-0 group-hover:opacity-20" style={{ background: "#7C3AED" }} />
                
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center text-white font-black text-lg rounded-2xl shadow-xl" style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
                            {advocate.initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <h4 className="text-base font-black text-white tracking-tight uppercase">{advocate.name}</h4>
                                {advocate.verified && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {advocate.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Star className="w-2 h-2 text-yellow-500/50" /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10 pb-8 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Expertise</p>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight line-clamp-1">{advocate.specializations[0]}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Experience</p>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{advocate.experience} Years Active</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Retainer</p>
                        <p className="text-[11px] font-black uppercase tracking-tight" style={{ color: "#F59E0B" }}>₹{advocate.fee}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Response</p>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" style={{ color: "rgba(139,92,246,0.5)" }} />
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{advocate.responseTime}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn-gold flex-1 py-4 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
                    >
                        Deploy Session
                    </button>
                    <button className="px-6 py-4 border hover:bg-[#0D0D18]/5 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                        Link
                    </button>
                </div>
            </motion.div>

            {showModal && (
                <BookingModal 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)} 
                    lawyer={advocate as any} 
                    userId="" 
                    caseId="" 
                    onSuccess={() => {}} 
                />
            )}
        </>
    );
}
