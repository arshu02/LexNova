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
    <div className="min-h-screen bg-white text-[#141413] selection:bg-[#F4EFEA] selection:text-[#141413] font-sans antialiased flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-28 space-y-10 flex-1">
        
        {/* Header Title */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F4EE] border border-[#E8E4DA] text-[12px] font-mono font-semibold text-[#42403B]">
            <ShieldCheck size={14} className="text-emerald-700" /> 2,400+ Verified Bar Council Advocates
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#141413] tracking-tight leading-[1.05]">
            Find verified legal counsel across jurisdictions.
          </h1>
          <p className="font-serif text-lg sm:text-xl text-[#636059] leading-relaxed max-w-2xl">
            Every advocate on LexNova is Bar Council verified with transparent fixed-fee consultation rates and encrypted strategy sessions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white border border-[#E8E4DA] rounded-3xl p-6 space-y-4 shadow-xs">
          
          {/* Top Search Bar & City Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87837B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by advocate name, specialty, legal act, or keyword..."
                className="w-full bg-[#F7F4EE] border border-[#E8E4DA] rounded-2xl pl-11 pr-4 py-2.5 text-[14px] text-[#141413] placeholder-[#87837B] focus:border-[#141413] focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#87837B] hover:text-[#141413]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-56 shrink-0">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#E8E4DA] rounded-2xl px-4 py-2.5 text-[14px] text-[#141413] focus:border-[#141413] focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#141413]">{c}</option>
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
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all whitespace-nowrap ${
                    active
                      ? "bg-[#141413] text-white shadow-xs"
                      : "bg-[#F7F4EE] text-[#636059] border border-[#E8E4DA] hover:border-[#B5AFA2] hover:text-[#141413]"
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E8E4DA] hover:border-[#B5AFA2] rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xs group"
            >
              <div className="space-y-4">
                
                {/* Top Profile Row */}
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#E8E4DA] shadow-xs">
                    <Image src={adv.photo} alt={adv.name} fill sizes="56px" className="object-cover" />
                    {adv.availableToday && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Available Today" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-[16px] font-bold text-[#141413] leading-snug">{adv.name}</h3>
                      <span title="Verified Bar Council Enrolled">
                        <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#87837B] font-mono leading-tight mt-0.5">{adv.role}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#636059]">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <strong className="text-[#141413] font-semibold">{adv.rating}</strong>
                        <span>({adv.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#87837B]" /> {adv.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-[13px] text-[#636059] leading-relaxed line-clamp-2">
                  {adv.bio}
                </p>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[12px]">
                  <div className="bg-[#F7F4EE] border border-[#E8E4DA] rounded-xl p-2.5">
                    <span className="text-[#87837B] uppercase font-mono font-bold text-[10px] block">Experience</span>
                    <strong className="text-[#141413] font-semibold text-[13px] mt-0.5 block">{adv.experience} Years</strong>
                  </div>

                  <div className="bg-[#F7F4EE] border border-[#E8E4DA] rounded-xl p-2.5">
                    <span className="text-[#87837B] uppercase font-mono font-bold text-[10px] block">Cases Handled</span>
                    <strong className="text-[#141413] font-semibold text-[13px] mt-0.5 block">{adv.cases}+ Matters</strong>
                  </div>
                </div>

                {/* Courts & Languages */}
                <div className="text-[11.5px] text-[#636059] space-y-0.5 font-mono">
                  <div><strong>Courts:</strong> {adv.courts}</div>
                  <div><strong>Languages:</strong> {adv.languages.join(", ")}</div>
                </div>

              </div>

              {/* Bottom Fee & Action Row */}
              <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10.5px] text-[#87837B] uppercase font-mono font-semibold block">Consultation</span>
                  <div className="text-[17px] font-bold text-[#141413] font-mono leading-tight">₹{adv.consultationFee}</div>
                  <span className="text-[10.5px] text-[#87837B]">60-min video</span>
                </div>

                <button
                  onClick={() => handleBook(adv)}
                  className="bg-[#141413] hover:bg-black text-white text-[13px] font-medium px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Video size={13} />
                  <span>Book Consult</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredAdvocates.length === 0 && (
          <div className="text-center py-20 bg-white border border-[#E8E4DA] rounded-3xl space-y-3">
            <Scale size={36} className="text-[#87837B] mx-auto" />
            <h3 className="text-[18px] font-bold text-[#141413]">No advocates matched your search criteria</h3>
            <p className="text-[14px] text-[#636059]">Try clearing your search term or switching the city and domain filter.</p>
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
