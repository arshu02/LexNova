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
    courts: "Bombay High Court, Central Labour Tribunal",
    qualification: "LLM Labour Law, Mumbai University · Bar Enrolled (MAH/1982/2006)",
    availableToday: true,
    bio: "Senior employment litigator representing executives in unpaid wages recovery, non-compete enforcement, severance defaults, and POSH committees."
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
    photo: "/advocate-sanjay.jpg",
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
    photo: "/advocate-rajesh.jpg", // fallback photo
    courts: "Calcutta High Court, NCLT Kolkata Bench",
    qualification: "LLM Corporate Law, WBNUJS Kolkata · Bar Enrolled (WB/810/2010)",
    availableToday: false,
    bio: "Advises seed-to-Series B founders on founder vesting agreements, vendor defaults, MSME statutory interest recoveries, and Section 9 IBC petitions."
  },
  {
    id: "adv_6",
    name: "Advocate Meera Krishnan",
    role: "Family Law & Matrimonial Settlements",
    specialization: "Family Law",
    email: "meera.krishnan@lexnova.in",
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
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20 selection:text-indigo-800 antialiased font-sans bg-[#F8FAFC] text-slate-900">
      <Navbar />

      {/* Subtle ambient light gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-28 space-y-8 flex-1 relative z-10 w-full">
        
        {/* Header Title Section */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>2,400+ Verified Bar Council Advocates</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Find verified legal counsel across <span className="text-gradient">jurisdictions.</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl font-normal">
            Every advocate on LexNova is Bar Council verified with transparent fixed-fee consultation rates and encrypted strategy sessions.
          </p>
        </div>

        {/* Search & Filter Controls (Zepto/Blinkit Style White Card) */}
        <div className="rounded-3xl p-5 sm:p-6 space-y-4 bg-white border border-slate-200/90 shadow-[0_4px_25px_rgba(15,23,42,0.05)]">
          
          {/* Top Search Bar & City Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by advocate name, specialty, legal act, or keyword..."
                className="w-full rounded-2xl pl-11 pr-14 py-3 text-[14px] text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded bg-slate-200/60"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-60 shrink-0">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-[14px] text-slate-800 font-semibold bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all cursor-pointer shadow-2xs"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 border border-indigo-600'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Advocates Cards Grid (Pasted on Clean White Canvas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvocates.map((adv) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 flex flex-col justify-between space-y-5 bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] hover:border-indigo-300 transition-all group"
            >
              <div className="space-y-4">
                
                {/* Top Profile Row */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <Image src={adv.photo} alt={adv.name} fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    {adv.availableToday && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Available Today" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-[16px] font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{adv.name}</h3>
                      <span title="Verified Bar Council Enrolled">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">{adv.role}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-[12px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <strong className="text-slate-800 font-bold">{adv.rating}</strong>
                        <span className="text-slate-400 font-normal">({adv.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" /> {adv.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-2">
                  {adv.bio}
                </p>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[12px]">
                  <div className="rounded-xl p-2.5 bg-slate-50 border border-slate-200/70">
                    <span className="uppercase font-bold text-[10px] text-slate-400 block tracking-wider">Experience</span>
                    <strong className="font-extrabold text-[13px] text-slate-900 mt-0.5 block">{adv.experience} Years</strong>
                  </div>

                  <div className="rounded-xl p-2.5 bg-slate-50 border border-slate-200/70">
                    <span className="uppercase font-bold text-[10px] text-slate-400 block tracking-wider">Cases Handled</span>
                    <strong className="font-extrabold text-[13px] text-slate-900 mt-0.5 block">{adv.cases}+ Matters</strong>
                  </div>
                </div>

                {/* Courts & Languages */}
                <div className="text-[11.5px] space-y-1 text-slate-500 border-t border-slate-100 pt-3">
                  <div><strong className="text-slate-700 font-semibold">Courts:</strong> {adv.courts}</div>
                  <div><strong className="text-slate-700 font-semibold">Languages:</strong> {adv.languages.join(", ")}</div>
                </div>

              </div>

              {/* Bottom Fee & Action Row */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Consultation</span>
                  <div className="text-[18px] font-black text-slate-900 leading-tight">₹{adv.consultationFee}</div>
                  <span className="text-[10.5px] font-medium text-slate-500">60-min strategy session</span>
                </div>

                <button
                  onClick={() => handleBook(adv)}
                  className="text-white text-[13px] font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all"
                >
                  <Video size={14} />
                  <span>Book Consult</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredAdvocates.length === 0 && (
          <div className="text-center py-20 rounded-3xl space-y-3 bg-white border border-slate-200 shadow-sm">
            <Scale size={36} className="mx-auto text-slate-400" />
            <h3 className="text-[18px] font-bold text-slate-900">No advocates matched your search criteria</h3>
            <p className="text-[14px] text-slate-500">Try clearing your search term or switching the city and domain filter.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All Domains"); setSelectedCity("All Cities"); }}
              className="text-[13px] font-semibold px-5 py-2 mt-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
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
