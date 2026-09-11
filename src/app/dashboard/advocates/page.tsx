'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Star, ShieldCheck, MapPin,
  Calendar, ArrowUpDown, ChevronRight, Award, Check,
  Clock, Sparkles, SlidersHorizontal, BookOpen, X, Video,
  CheckCircle2, Shield, ArrowRight, MessageSquare, Scale
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import { motion } from 'framer-motion';

interface Advocate {
  id: string;
  name: string;
  specialization: string;
  practiceAreas: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  city: string;
  courts: string[];
  languages: string[];
  barNumber: string;
  verificationStatus: "VERIFIED" | "PENDING";
  responseTime: string;
  profileCompletion: number;
  bio: string;
  isDemo: boolean;
  avatar: string;
  availability: "TODAY" | "TOMORROW" | "THIS_WEEK";
}

const ADVOCATES_DATA: Advocate[] = [
  {
    id: "adv_1",
    name: "Advocate Priya Mehta",
    specialization: "Property & Tenancy Specialist",
    practiceAreas: ["Property Dispute", "Tenancy", "RERA Litigation", "Civil Recovery"],
    experienceYears: 9,
    rating: 4.8,
    reviewsCount: 142,
    consultationFee: 999,
    city: "Bengaluru",
    courts: ["Karnataka High Court", "City Civil Court Bengaluru", "Karnataka RERA"],
    languages: ["English", "Hindi", "Kannada"],
    barNumber: "KAR/2491/2015",
    verificationStatus: "VERIFIED",
    responseTime: "< 15 mins",
    profileCompletion: 100,
    bio: "Specialist in real estate, tenancy disputes, builder delay claims under RERA, and illegal eviction matters. Over 9 years of trial practice with 850+ argued and settled matters.",
    isDemo: true,
    avatar: "PM",
    availability: "TODAY",
  },
  {
    id: "adv_2",
    name: "Advocate Rajesh Sharma",
    specialization: "Employment & Labour Counsel",
    practiceAreas: ["Labour Code", "Unpaid Salary", "Industrial Disputes", "Non-Compete"],
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 210,
    consultationFee: 1499,
    city: "Mumbai",
    courts: ["Bombay High Court", "Mumbai Industrial Tribunal", "Labour Commissioner Office"],
    languages: ["English", "Hindi", "Marathi"],
    barNumber: "MAH/8832/2012",
    verificationStatus: "VERIFIED",
    responseTime: "< 10 mins",
    profileCompletion: 100,
    bio: "Senior counsel representing employees and corporate professionals in unpaid salary disputes, wrongful termination, severance negotiations, and non-compete enforceability matters.",
    isDemo: true,
    avatar: "RS",
    availability: "TODAY",
  },
  {
    id: "adv_3",
    name: "Advocate Ananya Iyer",
    specialization: "Consumer Protection Lawyer",
    practiceAreas: ["Consumer Forum", "E-Commerce", "Insurance Claims", "Medical Negligence"],
    experienceYears: 6,
    rating: 4.7,
    reviewsCount: 88,
    consultationFee: 799,
    city: "Chennai",
    courts: ["Madras High Court", "State Consumer Disputes Commission", "District Consumer Forum"],
    languages: ["English", "Tamil", "Kannada"],
    barNumber: "TN/1104/2018",
    verificationStatus: "VERIFIED",
    responseTime: "< 30 mins",
    profileCompletion: 95,
    bio: "Dedicated consumer forum litigation specialist handling e-commerce defect disputes, insurance dishonours, medical malpractice, and airline compensation claims under CPA 2019.",
    isDemo: true,
    avatar: "AI",
    availability: "TOMORROW",
  },
  {
    id: "adv_4",
    name: "Advocate Sanjay Gupta",
    specialization: "Criminal & Cyber Defense",
    practiceAreas: ["Cyber Crime", "Financial Fraud", "Bail Petitions", "IT Act §66D"],
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 310,
    consultationFee: 1999,
    city: "Delhi",
    courts: ["Delhi High Court", "Patiala House Sessions Court", "Cyber Appellate Tribunal"],
    languages: ["English", "Hindi", "Punjabi"],
    barNumber: "D/1429/2009",
    verificationStatus: "VERIFIED",
    responseTime: "< 15 mins",
    profileCompletion: 100,
    bio: "15+ years defending complex cyber banking fraud, unauthorized UPI phishing, crypto asset freezing, anticipatory bails, and criminal defense before High Court and Special Sessions Courts.",
    isDemo: true,
    avatar: "SG",
    availability: "TODAY",
  },
  {
    id: "adv_5",
    name: "Advocate Meera Krishnan",
    specialization: "Family & Matrimonial Law",
    practiceAreas: ["Family Court", "Mutual Divorce", "Child Custody", "Maintenance"],
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 165,
    consultationFee: 1299,
    city: "Bengaluru",
    courts: ["Karnataka High Court", "Principal Family Court Bengaluru"],
    languages: ["English", "Malayalam", "Tamil", "Kannada"],
    barNumber: "KAR/3920/2016",
    verificationStatus: "VERIFIED",
    responseTime: "< 20 mins",
    profileCompletion: 98,
    bio: "Empathetic, highly effective trial counsel for mutual consent separation, contested divorces, domestic violence relief, child custody, and alimony settlement mediation.",
    isDemo: true,
    avatar: "MK",
    availability: "TODAY",
  },
  {
    id: "adv_6",
    name: "Advocate Vikram Singh",
    specialization: "Corporate & Contract Counsel",
    practiceAreas: ["Corporate NDA", "Breach of Contract", "Arbitration", "Founder Disputes"],
    experienceYears: 11,
    rating: 4.7,
    reviewsCount: 178,
    consultationFee: 2499,
    city: "Mumbai",
    courts: ["Bombay High Court", "NCLT Mumbai Bench", "MCIA Arbitration Centre"],
    languages: ["English", "Hindi"],
    barNumber: "MAH/7641/2013",
    verificationStatus: "VERIFIED",
    responseTime: "< 1 hour",
    profileCompletion: 100,
    bio: "Advising startups, tech founders, and business enterprises on commercial breach of contract, shareholder disputes, IP assignments, and institutional arbitration.",
    isDemo: true,
    avatar: "VS",
    availability: "TOMORROW",
  },
];

export default function FindAdvocatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [sortBy, setSortBy] = useState<"MATCH" | "EXPERIENCE" | "RATING" | "FEE_LOW" | "AVAILABILITY">("MATCH");
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const categories = ["ALL", "Property", "Labour", "Consumer", "Cyber Crime", "Corporate"];
  const cities = ["ALL", "Bengaluru", "Mumbai", "Delhi", "Chennai"];

  const filteredAdvocates = useMemo(() => {
    return ADVOCATES_DATA.filter((adv) => {
      const matchesSearch =
        adv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adv.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adv.courts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        adv.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "ALL" ||
        adv.practiceAreas.some((p) => p.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        adv.specialization.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesCity = selectedCity === "ALL" || adv.city.toLowerCase() === selectedCity.toLowerCase();

      return matchesSearch && matchesCategory && matchesCity;
    }).sort((a, b) => {
      if (sortBy === "EXPERIENCE") return b.experienceYears - a.experienceYears;
      if (sortBy === "RATING") return b.rating - a.rating;
      if (sortBy === "FEE_LOW") return a.consultationFee - b.consultationFee;
      if (sortBy === "AVAILABILITY") return a.availability === "TODAY" ? -1 : 1;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCity, sortBy]);

  const handleBookAdvocate = (adv: Advocate) => {
    setSelectedAdvocate(adv);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-[1380px] mx-auto flex flex-col gap-7 pb-12">
      
      {/* ── Marketplace Header ───────────────────────────────────── */}
      <div className="flex items-end justify-between border-b border-slate-200/90 pb-6 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Bar Council of India Verified Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Find a Verified Advocate</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              High Court Counsel
            </span>
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-2xl">
            Book direct 1-on-1 video consultations with verified Indian trial, appellate, and High Court advocates. Transparent fixed consultation fees with instant video meeting links.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>200+ Verified Advocates Active</span>
        </div>
      </div>

      {/* ── Search & Filter Command Bar ──────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="flex items-center gap-3 bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-blue-500 rounded-xl px-4 py-2.5 w-full sm:w-96 transition-all focus-within:ring-3 focus-within:ring-blue-500/15">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by advocate, court, language, or specialty..."
              className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <ArrowUpDown size={13} />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="MATCH">Best Match Score</option>
              <option value="EXPERIENCE">Experience (High to Low)</option>
              <option value="RATING">Highest Rating</option>
              <option value="FEE_LOW">Consultation Fee (Lowest)</option>
              <option value="AVAILABILITY">Earliest Availability</option>
            </select>
          </div>

        </div>

        {/* Category & City Pills */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          
          {/* Practice Area Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Practice Areas" : cat}
              </button>
            ))}
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">City:</span>
            <div className="flex items-center gap-1">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCity === city
                      ? "bg-slate-900 text-white font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Advocates Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvocates.map((adv) => (
          <div
            key={adv.id}
            className="glass-card-elevated p-6 flex flex-col justify-between gap-5 relative overflow-hidden group"
          >
            <div>
              {/* Header: Avatar, Name, Verified Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    {adv.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <span>{adv.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {adv.specialization}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Bio Excerpt */}
              <p className="text-xs text-slate-600 mt-3.5 leading-relaxed line-clamp-3">
                {adv.bio}
              </p>

              {/* Rating, Experience, City */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10.5px] uppercase font-bold text-slate-400 block font-mono">Rating</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    <span>{adv.rating}</span>
                    <span className="text-[11px] text-slate-400">({adv.reviewsCount})</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10.5px] uppercase font-bold text-slate-400 block font-mono">Experience</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {adv.experienceYears} Years
                  </span>
                </div>

                <div>
                  <span className="text-[10.5px] uppercase font-bold text-slate-400 block font-mono">Jurisdiction</span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate">
                    {adv.city}
                  </span>
                </div>
              </div>

              {/* Courts Admitted */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {adv.courts.slice(0, 2).map((court, i) => (
                  <span
                    key={i}
                    className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80"
                  >
                    {court}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer: Fee & Booking Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block font-mono">Fixed Fee</span>
                <div className="text-base font-extrabold text-slate-900">
                  ₹{adv.consultationFee}
                  <span className="text-xs font-normal text-slate-400">/session</span>
                </div>
              </div>

              <button
                onClick={() => handleBookAdvocate(adv)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 group-hover:shadow-md"
              >
                <Video size={14} />
                <span>Book Video Consult</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedAdvocate && (
        <BookingModal
          advocate={{
            id: selectedAdvocate.id,
            name: selectedAdvocate.name,
            specialization: selectedAdvocate.specialization,
            rating: selectedAdvocate.rating,
            consultationFee: selectedAdvocate.consultationFee,
          }}
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedAdvocate(null);
          }}
        />
      )}

    </div>
  );
}
