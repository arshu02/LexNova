"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Advocate } from "@/lib/mockData";
import { 
    ShieldCheck, 
    Video, 
    Star, 
    Clock, 
    Building2, 
    ExternalLink, 
    CheckCircle2 
} from "lucide-react";
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0B0F19]/90 border border-white/[0.08] hover:border-blue-500/40 p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/40 hover:shadow-blue-500/10"
            >
                {/* Subtle top ambient gradient */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Header: Avatar, Name, Verification */}
                <div className="flex items-start gap-3.5 mb-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 relative bg-slate-800">
                            {advocate.photo ? (
                                <Image 
                                    src={advocate.photo} 
                                    alt={advocate.name} 
                                    fill 
                                    sizes="52px"
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-blue-600 to-indigo-700">
                                    {advocate.initials}
                                </div>
                            )}
                        </div>
                        {/* Live active indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0B0F19] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <h4 className="text-[14.5px] font-bold text-white tracking-tight truncate group-hover:text-blue-300 transition-colors">
                                {advocate.name}
                            </h4>
                            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex-shrink-0">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Verified</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-[#8D9CB0] font-medium truncate mb-1.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span>{advocate.courts || advocate.city}</span>
                        </p>

                        <div className="flex items-center gap-3 text-[11px]">
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{advocate.rating}</span>
                                <span className="text-slate-500 font-normal">({advocate.reviewCount})</span>
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-400 font-medium">
                                {advocate.experience} Yrs Bar
                            </span>
                        </div>
                    </div>
                </div>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {advocate.specializations.slice(0, 2).map((spec, idx) => (
                        <span 
                            key={idx} 
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#A2B4CE] group-hover:border-blue-500/20 transition-colors"
                        >
                            {spec}
                        </span>
                    ))}
                    {advocate.barNumber && (
                        <span className="text-[9.5px] font-mono font-medium px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                            {advocate.barNumber}
                        </span>
                    )}
                </div>

                {/* Fee & Action Button */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <div>
                        <span className="text-[9.5px] uppercase font-bold text-slate-500 tracking-wider block">
                            Retainer Fee
                        </span>
                        <div className="text-[15px] font-bold text-white tracking-tight">
                            ₹{advocate.fee.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">/session</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-[12px] tracking-wide shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-1.5 transition-all cursor-pointer group/btn"
                        >
                            <Video className="w-3.5 h-3.5 text-blue-200 group-hover/btn:scale-110 transition-transform" />
                            <span>Deploy Session</span>
                        </button>
                    </div>
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
