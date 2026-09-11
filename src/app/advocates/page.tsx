"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Search, Star, CheckCircle2, MapPin, Briefcase,
  Clock, Shield, ArrowRight, X, ExternalLink, ShieldCheck,
  Video, Sparkles, Filter, Award, PhoneCall, Mail, Scale
} from "lucide-react";
import BookingModal from "@/components/BookingModal";

const ADVOCATES_DATA = [
  {
    id: "adv_1",
    name: "Advocate Priya Mehta",
    role: "Property & Tenancy Specialist",
    specialization: "Property & Tenancy",
    email: "priya.mehta@lexnova.in",
    experience: 11,
    rating: 4.9,
    reviews: 312,
    cases: 890,
    city: "Bengaluru",
    consultationFee: 999,
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    matchTag: "Property",
    photo: "/advocate-priya.jpg",
    courts: "Karnataka High Court, Civil Courts",
    qualification: "LLB (Hons) NLSIU Bengaluru · Bar Enrolled (KAR/4120/2015)",
    availableToday: true,
    bio: "Specialist in landlord-tenant disputes, security deposit recovery, RERA builder delay claims, and ancestral property partition suits."
  },
  {
    id: "adv_2",
    name: "Advocate Rajesh Sharma",
    role: "Employment & Labour Counsel",
    specialization: "Labour & Employment",
    email: "rajesh.sharma@lexnova.in",
    experience: 18,
    rating: 4.9,
    reviews: 547,
    cases: 1420,
    city: "Mumbai",
    consultationFee: 1499,
    verified: true,
    languages: ["English", "Hindi", "Marathi"],
    matchTag: "Labour",
    photo: "/advocate-rajesh.jpg",
    courts: "Bombay High Court, Labour Tribunals, Supreme Court",
    qualification: "LLM Labour Laws, Bombay University · Bar Enrolled (MAH/8832/2012)",
    availableToday: true,
    bio: "Senior employment litigator representing executives in unpaid wages recovery, non-compete enforcement, severance disputes, and wrongful terminations."
  },
  {
    id: "adv_3",
    name: "Advocate Ananya Iyer",
    role: "Consumer Protection & Civil Rights",
    specialization: "Consumer Protection",
    email: "ananya.iyer@lexnova.in",
    experience: 8,
    rating: 4.8,
    reviews: 203,
    cases: 430,
    city: "Chennai",
    consultationFee: 799,
    verified: true,
    languages: ["English", "Tamil", "Hindi"],
    matchTag: "Consumer",
    photo: "/advocate-ananya.jpg",
    courts: "Madras High Court, State Consumer Disputes Redressal Commission",
    qualification: "LLB, NALSAR Hyderabad · Bar Enrolled (TN/1940/2018)",
    availableToday: false,
    bio: "Focused on consumer forum petitions, e-commerce defective product disputes, insurance claim repudiations, and commercial deficiency in service."
  },
  {
    id: "adv_4",
    name: "Advocate Sanjay Gupta",
    role: "Cyber Crime & Criminal Defense",
    specialization: "Criminal & Cyber Law",
    email: "sanjay.gupta@lexnova.in",
    experience: 15,
    rating: 4.9,
    reviews: 480,
    cases: 2100,
    city: "Delhi",
    consultationFee: 1999,
    verified: true,
    languages: ["English", "Hindi", "Punjabi"],
    matchTag: "Criminal",
    photo: "/advocate-rajesh.jpg", // fallback photo
    courts: "Delhi High Court, Special Cyber Crime Magistrates",
    qualification: "LLM Cyber Jurisprudence, Delhi University · Bar Enrolled (D/3120/2011)",
    availableToday: true,
    bio: "Cyber fraud specialist dealing in unauthorized UPI theft, bank phishing, account freezes under IT Act Section 66D, and commercial white-collar defense."
  },
  {
    id: "adv_5",
    name: "Advocate Vikramaditya Sen",
    role: "Corporate Commercial & Contracts",
    specialization: "Corporate Commercial",
    email: "vikram.sen@lexnova.in",
    experience: 14,
    rating: 4.9,
    reviews: 389,
    cases: 950,
    city: "Kolkata",
    consultationFee: 1299,
    verified: true,
    languages: ["English", "Bengali", "Hindi"],
    matchTag: "Corporate",
    photo: "/advocate-priya.jpg", // fallback photo
    courts: "Calcutta High Court, NCLT Kolkata Bench",
    qualification: "LLB NUJS Kolkata · Bar Enrolled (WB/5912/2010)",
    availableToday: true,
    bio: "Corporate counsel specializing in vendor contract breaches, Section 9 arbitration interim relief, MSME Samadhaan delayed payment recoveries, and insolvency petitions."
  },
  {
    id: "adv_6",
    name: "Advocate Fatima Khan",
    role: "Family Law & Matrimonial Disputes",
    specialization: "Family Law",
    email: "fatima.khan@lexnova.in",
    experience: 12,
    rating: 4.9,
    reviews: 410,
    cases: 1120,
    city: "Hyderabad",
    consultationFee: 999,
    verified: true,
    languages: ["English", "Telugu", "Urdu", "Hindi"],
    matchTag: "Family",
    photo: "/advocate-ananya.jpg", // fallback photo
    courts: "Telangana High Court, Family Court Secunderabad",
    qualification: "LLB Osmania University · Bar Enrolled (TS/2291/2014)",
    availableToday: true,
    bio: "Empathetic, aggressive advocate handling mutual consent divorces, child custody disputes, domestic violence protection orders, and maintenance settlements."
  }
];

const CATEGORIES = [
  "All Domains",
  "Property & Tenancy",
  "Labour & Employment",
  "Consumer Protection",
  "Criminal & Cyber Law",
  "Corporate Commercial",
  "Family Law"
];

const CITIES = ["All Cities", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Kolkata", "Hyderabad"];

export default function AdvocatesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Domains");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedAdvocate, setSelectedAdvocate] = useState<any>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const filteredAdvocates = useMemo(() => {
    return ADVOCATES_DATA.filter((adv) => {
      const matchSearch =
        search === "" ||
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.specialization.toLowerCase().includes(search.toLowerCase()) ||
        adv.bio.toLowerCase().includes(search.toLowerCase()) ||
        adv.city.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "All Domains" || adv.specialization === selectedCategory;

      const matchCity =
        selectedCity === "All Cities" || adv.city === selectedCity;

      return matchSearch && matchCategory && matchCity;
    });
  }, [search, selectedCategory, selectedCity]);

  const handleBook = (adv: any) => {
    setSelectedAdvocate(adv);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-200 antialiased font-sans" style={{ background: '#05060A', color: '#F0F2FF' }}>
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96" style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-10 flex-1 relative z-10 w-full">
        
        {/* Header Title */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-mono font-semibold" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
            <ShieldCheck size={14} style={{ color: '#10B981' }} /> 2,400+ Verified Bar Council Advocates
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05]">
            Find verified legal counsel across <span className="text-gradient">jurisdictions.</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: '#8F96B3' }}>
            Every advocate on LexNova is Bar Council verified with transparent fixed-fee consultation rates and encrypted strategy sessions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="rounded-3xl p-6 space-y-4" style={{ background: 'rgba(10,11,18,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          
          {/* Top Search Bar & City Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B72A0' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by advocate name, specialty, legal act, or keyword..."
                className="w-full rounded-2xl pl-11 pr-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none transition-colors"
                style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] transition-colors hover:text-white"
                  style={{ color: '#8F96B3' }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-56 shrink-0">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-2xl px-4 py-2.5 text-[14px] text-white focus:outline-none transition-colors cursor-pointer"
                style={{ background: 'rgba(14,16,24,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#0A0B12', color: '#F0F2FF' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all whitespace-nowrap"
                  style={active ? {
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                    border: '1px solid rgba(99,102,241,0.4)'
                  } : {
                    background: 'rgba(255,255,255,0.03)',
                    color: '#8F96B3',
                    border: '1px solid rgba(99,102,241,0.12)'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Advocates Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvocates.map((adv) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all group"
              style={{ background: 'rgba(10,11,18,0.75)', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
            >
              <div className="space-y-4">
                
                {/* Top Profile Row */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0" style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(14,16,24,0.8)' }}>
                    <Image src={adv.photo} alt={adv.name} fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    {adv.availableToday && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500" style={{ border: '2px solid #05060A' }} title="Available Today" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-[16px] font-bold text-white leading-snug">{adv.name}</h3>
                      <span title="Verified Bar Council Enrolled">
                        <ShieldCheck size={15} style={{ color: '#10B981' }} className="shrink-0" />
                      </span>
                    </div>
                    <p className="text-[12px] font-mono leading-tight mt-0.5" style={{ color: '#818CF8' }}>{adv.role}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-[12px]" style={{ color: '#8F96B3' }}>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <strong className="text-white font-semibold">{adv.rating}</strong>
                        <span style={{ color: '#6B72A0' }}>({adv.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} style={{ color: '#6B72A0' }} /> {adv.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: '#8F96B3' }}>
                  {adv.bio}
                </p>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[12px]">
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(14,16,24,0.7)', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <span className="uppercase font-mono font-bold text-[10px] block" style={{ color: '#6B72A0' }}>Experience</span>
                    <strong className="font-semibold text-[13px] mt-0.5 block text-white">{adv.experience} Years</strong>
                  </div>

                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(14,16,24,0.7)', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <span className="uppercase font-mono font-bold text-[10px] block" style={{ color: '#6B72A0' }}>Cases Handled</span>
                    <strong className="font-semibold text-[13px] mt-0.5 block text-white">{adv.cases}+ Matters</strong>
                  </div>
                </div>

                {/* Courts & Languages */}
                <div className="text-[11.5px] space-y-0.5 font-mono" style={{ color: '#6B72A0' }}>
                  <div><strong style={{ color: '#8F96B3' }}>Courts:</strong> {adv.courts}</div>
                  <div><strong style={{ color: '#8F96B3' }}>Languages:</strong> {adv.languages.join(", ")}</div>
                </div>

              </div>

              {/* Bottom Fee & Action Row */}
              <div className="pt-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                <div>
                  <span className="text-[10.5px] uppercase font-mono font-semibold block" style={{ color: '#6B72A0' }}>Consultation</span>
                  <div className="text-[17px] font-bold font-mono leading-tight text-white">₹{adv.consultationFee}</div>
                  <span className="text-[10.5px]" style={{ color: '#6B72A0' }}>60-min video</span>
                </div>

                <button
                  onClick={() => handleBook(adv)}
                  className="text-white text-[13px] font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 10px rgba(99,102,241,0.3)' }}
                >
                  <Video size={13} />
                  <span>Book Consult</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredAdvocates.length === 0 && (
          <div className="text-center py-20 rounded-3xl space-y-3" style={{ background: 'rgba(10,11,18,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Scale size={36} className="mx-auto" style={{ color: '#6B72A0' }} />
            <h3 className="text-[18px] font-bold text-white">No advocates matched your search criteria</h3>
            <p className="text-[14px]" style={{ color: '#8F96B3' }}>Try clearing your search term or switching the city and domain filter.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All Domains"); setSelectedCity("All Cities"); }}
              className="text-[13px] px-5 py-2 mt-2 rounded-full transition-colors"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* Booking Modal */}
      {bookingModalOpen && selectedAdvocate && (
        <BookingModal
          advocate={selectedAdvocate}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
