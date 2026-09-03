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
    name: "Advocate Meera Krishnan",
    role: "Family & Matrimonial Counsel",
    specialization: "Family & Divorce",
    email: "meera.krishnan@lexnova.in",
    experience: 10,
    rating: 4.8,
    reviews: 290,
    cases: 680,
    city: "Bengaluru",
    consultationFee: 1299,
    verified: true,
    languages: ["English", "Malayalam", "Tamil", "Kannada"],
    matchTag: "Family",
    photo: "/advocate-priya.jpg", // fallback photo
    courts: "Principal Family Courts, Karnataka High Court",
    qualification: "LLB, Government Law College · Bar Enrolled (KAR/5512/2016)",
    availableToday: true,
    bio: "Compassionate counsel specializing in mutual consent divorce, cooling-off period waivers, child custody agreements, and alimony mediation."
  },
  {
    id: "adv_6",
    name: "Advocate Vikram Singh",
    role: "Corporate & Commercial Contracts",
    specialization: "Corporate & Contract",
    email: "vikram.singh@lexnova.in",
    experience: 14,
    rating: 4.9,
    reviews: 380,
    cases: 910,
    city: "Gurugram",
    consultationFee: 1799,
    verified: true,
    languages: ["English", "Hindi"],
    matchTag: "Corporate",
    photo: "/advocate-rajesh.jpg",
    courts: "NCLT Delhi, Delhi High Court Commercial Division",
    qualification: "LLB, ILS Pune · Bar Enrolled (D/4119/2012)",
    availableToday: false,
    bio: "Corporate drafting counsel representing founders and SMEs in MSA vendor disputes, shareholder agreements, MSME SAMADHAN filings, and Section 138 NI Act."
  }
];

const CATEGORIES = ["All Domains", "Property & Tenancy", "Labour & Employment", "Consumer Protection", "Criminal & Cyber Law", "Family & Divorce", "Corporate & Contract"];
const CITIES = ["All Cities", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Gurugram"];

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
    <div className="min-h-screen bg-[#050508] text-[#F0F2F5] selection:bg-blue-500/30 selection:text-white font-sans antialiased flex flex-col">
      <Navbar />

      {/* Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[800px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[180px]" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.03] rounded-full blur-[180px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-28 relative z-10 space-y-12 flex-1">
        
        {/* Header Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[13px] text-[#C8D0DC] font-medium">
            <ShieldCheck size={14} className="text-emerald-400" /> 2,400+ Verified Bar Council Advocates
          </div>

          <h1 className="text-[48px] sm:text-[64px] font-display text-white tracking-tight leading-[1.02]">
            Find verified counsel across India.
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[#9AA8BC] leading-relaxed max-w-2xl font-normal">
            Every advocate on LexNova is Bar Council verified with transparent fixed-fee consultation rates and HD video meeting rooms.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-xl">
          
          {/* Top Search Bar & City Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7B94]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by advocate name, specialty, legal act, or keyword..."
                className="w-full bg-[#07090E] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-[14.5px] text-white placeholder-[#5A6A80] focus:border-blue-500/60 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7B94] hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#07090E] border border-white/[0.1] rounded-xl px-4 py-3 text-[14px] text-[#CBD5E1] focus:border-blue-500/60 focus:outline-none transition-colors w-full sm:w-auto"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0A0C12] text-white">{c}</option>
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
                  className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap ${
                    active
                      ? "bg-white text-black shadow-md shadow-white/10"
                      : "bg-[#07090E] text-[#8C9BB4] border border-white/[0.08] hover:border-white/[0.18] hover:text-white"
                  }`}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl group relative overflow-hidden"
            >
              <div className="space-y-4">
                
                {/* Top Profile Row */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                    <Image src={adv.photo} alt={adv.name} fill sizes="64px" className="object-cover" />
                    {adv.availableToday && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0C12]" title="Available Today" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[17px] font-bold text-white leading-snug">{adv.name}</h3>
                      <span title="Verified Bar Council Enrolled">
                        <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                      </span>
                    </div>
                    <p className="text-[13px] text-blue-400 font-medium leading-tight mt-0.5">{adv.role}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-[12.5px] text-[#8D9CB0]">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <strong className="text-white font-semibold">{adv.rating}</strong>
                        <span>({adv.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#5B6B7C]" /> {adv.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-[13.5px] text-[#9AA8BC] leading-relaxed line-clamp-2">
                  {adv.bio}
                </p>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[12px]">
                  <div className="bg-[#07090E] border border-white/[0.06] rounded-xl p-2.5">
                    <span className="text-[#5B6B7C] uppercase font-bold text-[10.5px] block">Experience</span>
                    <strong className="text-[#E2E8F0] font-semibold text-[13px] mt-0.5 block">{adv.experience} Years</strong>
                  </div>

                  <div className="bg-[#07090E] border border-white/[0.06] rounded-xl p-2.5">
                    <span className="text-[#5B6B7C] uppercase font-bold text-[10.5px] block">Cases Handled</span>
                    <strong className="text-[#E2E8F0] font-semibold text-[13px] mt-0.5 block">{adv.cases}+ Matters</strong>
                  </div>
                </div>

                {/* Courts & Languages */}
                <div className="text-[12px] text-[#7A8A9E] space-y-1">
                  <div><strong>Courts:</strong> {adv.courts}</div>
                  <div><strong>Languages:</strong> {adv.languages.join(", ")}</div>
                </div>

              </div>

              {/* Bottom Fee & Action Row */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-[#7A8A9E] uppercase font-bold block">Consultation</span>
                  <div className="text-[18px] font-bold text-white font-display leading-tight">₹{adv.consultationFee}</div>
                  <span className="text-[11px] text-[#55667E]">60-min HD video</span>
                </div>

                <button
                  onClick={() => handleBook(adv)}
                  className="btn-primary text-[13.5px] font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Video size={14} />
                  <span>Book Consult</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredAdvocates.length === 0 && (
          <div className="text-center py-20 bg-[#0A0C12] border border-white/[0.08] rounded-3xl space-y-3">
            <Scale size={36} className="text-[#5B6B7C] mx-auto" />
            <h3 className="text-[18px] font-bold text-white">No advocates matched your search criteria</h3>
            <p className="text-[14px] text-[#7A8A9E]">Try clearing your search term or switching the city and domain filter.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All Domains"); setSelectedCity("All Cities"); }}
              className="btn-ghost text-[13px] px-5 py-2 mt-2"
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
