'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Star, ShieldCheck, MapPin,
  Calendar, ArrowUpDown, ChevronRight, Award, Check,
  Clock, Sparkles, SlidersHorizontal, BookOpen, X, Video
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

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
    practiceAreas: ["Property", "Tenancy", "RERA", "Civil Recovery"],
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
    bio: "Advocate Priya Mehta specializes in real estate, tenancy disputes, builder delay claims under RERA, and illegal eviction matters. Over 9 years of trial practice with 850+ settled and argued matters.",
    isDemo: true,
    avatar: "PM",
    availability: "TODAY",
  },
  {
    id: "adv_2",
    name: "Advocate Rajesh Sharma",
    specialization: "Employment & Labour Counsel",
    practiceAreas: ["Labour", "Employment", "Industrial Disputes", "Contracts"],
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
    practiceAreas: ["Consumer", "E-Commerce", "Insurance Claims", "Medical Negligence"],
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
    specialization: "Criminal & Cyber Law Expert",
    practiceAreas: ["Criminal", "Cyber", "Financial Fraud", "IT Act"],
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 310,
    consultationFee: 1999,
    city: "Delhi",
    courts: ["Supreme Court of India", "Delhi High Court", "Patiala House District Courts"],
    languages: ["English", "Hindi"],
    barNumber: "D/4412/2009",
    verificationStatus: "VERIFIED",
    responseTime: "< 5 mins",
    profileCompletion: 100,
    bio: "15+ years defending complex cyber fraud matters, unauthorized banking transactions, Section 138 cheque bounces, and white collar criminal litigation across Delhi NCR.",
    isDemo: true,
    avatar: "SG",
    availability: "TODAY",
  },
  {
    id: "adv_5",
    name: "Advocate Meera Krishnan",
    specialization: "Family & Matrimonial Counsel",
    practiceAreas: ["Family", "Matrimonial", "Divorce", "Child Custody"],
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 165,
    consultationFee: 1299,
    city: "Bengaluru",
    courts: ["Karnataka High Court", "Principal Family Court Bengaluru"],
    languages: ["English", "Malayalam", "Tamil", "Hindi"],
    barNumber: "KAR/3120/2016",
    verificationStatus: "VERIFIED",
    responseTime: "< 20 mins",
    profileCompletion: 98,
    bio: "Empathetic family dispute advocate specializing in mutual consent divorce proceedings, Section 125 maintenance calculations, and domestic violence protection orders.",
    isDemo: true,
    avatar: "MK",
    availability: "THIS_WEEK",
  },
  {
    id: "adv_6",
    name: "Advocate Vikram Singh",
    specialization: "Corporate & Commercial Advocate",
    practiceAreas: ["Corporate", "Commercial", "Contracts", "MSME Dues"],
    experienceYears: 11,
    rating: 4.7,
    reviewsCount: 190,
    consultationFee: 2499,
    city: "Mumbai",
    courts: ["Bombay High Court", "NCLT Mumbai Bench", "MSEFC Commercial Tribunal"],
    languages: ["English", "Hindi"],
    barNumber: "MAH/9014/2013",
    verificationStatus: "VERIFIED",
    responseTime: "< 15 mins",
    profileCompletion: 100,
    bio: "Advising startups and MSME founders on commercial contract enforcement, vendor invoicing recovery under MSMED Act, shareholder disputes, and NCLT insolvency proceedings.",
    isDemo: true,
    avatar: "VS",
    availability: "TOMORROW",
  }
];

export default function AdvocatesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [sortBy, setSortBy] = useState<"MATCH" | "EXPERIENCE" | "RATING" | "FEE_LOW" | "AVAILABILITY">("MATCH");
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [bookingAdvocate, setBookingAdvocate] = useState<Advocate | null>(null);

  const categories = ["ALL", "Property", "Labour", "Consumer", "Criminal", "Family", "Corporate"];
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
        adv.practiceAreas.includes(selectedCategory);

      const matchesCity =
        selectedCity === "ALL" || adv.city.toLowerCase() === selectedCity.toLowerCase();

      return matchesSearch && matchesCategory && matchesCity;
    }).sort((a, b) => {
      if (sortBy === "EXPERIENCE") return b.experienceYears - a.experienceYears;
      if (sortBy === "RATING") return b.rating - a.rating;
      if (sortBy === "FEE_LOW") return a.consultationFee - b.consultationFee;
      if (sortBy === "AVAILABILITY") {
        const order = { TODAY: 1, TOMORROW: 2, THIS_WEEK: 3 };
        return order[a.availability] - order[b.availability];
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCity, sortBy]);

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px" }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderBottom: "1px solid #E2E8F0",
        paddingBottom: "20px",
        flexWrap: "wrap",
        gap: "14px",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#059669",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            <ShieldCheck size={14} /> Bar Council Verified Network
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Find a Verified Advocate
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginTop: "4px" }}>
            Connect directly with verified Indian trial & high court advocates. Transparent fixed consultation fees with instant video bookings.
          </p>
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "7px 16px",
          borderRadius: "9999px",
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          fontSize: "13px",
          fontWeight: "600",
          color: "#059669",
        }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#059669" }} />
          <span>200+ Verified Advocates Active</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}>
          {/* Search Input */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "9px 16px",
            flex: 1,
            minWidth: "280px",
          }}>
            <Search size={15} color="#64748B" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by advocate name, court, language, or specialty..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#0F172A",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
              <ArrowUpDown size={13} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "13px",
                outline: "none",
              }}
            >
              <option value="MATCH">Best Match Score</option>
              <option value="EXPERIENCE">Years of Experience</option>
              <option value="RATING">Highest Rating</option>
              <option value="FEE_LOW">Consultation Fee (Low to High)</option>
              <option value="AVAILABILITY">Earliest Availability</option>
            </select>
          </div>
        </div>

        {/* Category Pills & City Filter */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
          
          {/* Practice Area Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  fontSize: "13px",
                  fontWeight: selectedCategory === cat ? "600" : "500",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  background: selectedCategory === cat ? "#2563EB" : "#F8FAFC",
                  color: selectedCategory === cat ? "#FFFFFF" : "#64748B",
                  border: selectedCategory === cat ? "none" : "1px solid #E2E8F0",
                  transition: "all 0.15s ease",
                }}
              >
                {cat === "ALL" ? "All Practice Areas" : cat}
              </button>
            ))}
          </div>

          {/* City Filter Pills */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "3px" }}>
              <Filter size={12} /> City:
            </span>
            {cities.map((city: string) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  fontSize: "12px",
                  fontWeight: selectedCity === city ? "600" : "500",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: selectedCity === city ? "#0F172A" : "#F8FAFC",
                  color: selectedCity === city ? "#FFFFFF" : "#64748B",
                  border: `1px solid ${selectedCity === city ? "#0F172A" : "#E2E8F0"}`,
                  transition: "all 0.15s ease",
                }}
              >
                {city}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Advocates Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "20px",
      }}>
        {filteredAdvocates.map((adv) => (
          <div
            key={adv.id}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "18px",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              
              {/* Top Row: Avatar + Name + Verified Badge */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{
                    width: "48px", height: "48px",
                    borderRadius: "14px",
                    background: "#EFF6FF",
                    border: "1px solid #DBEAFE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", fontWeight: "700", color: "#2563EB",
                    flexShrink: 0,
                  }}>
                    {adv.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>
                      {adv.name}
                    </h3>
                    <p style={{ fontSize: "13.5px", color: "#64748B", marginTop: "1px" }}>
                      {adv.specialization}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontSize: "11.5px",
                    fontWeight: "600",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    <Check size={12} strokeWidth={3} /> Verified
                  </span>
                </div>
              </div>

              {/* Bar Number & City */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "13px",
                color: "#64748B",
                marginTop: "14px",
              }}>
                <span>Bar Enrolled: <strong style={{ color: "#0F172A" }}>{adv.barNumber}</strong></span>
                <span>•</span>
                <span><MapPin size={12} style={{ display: "inline" }} /> {adv.city}</span>
              </div>

              {/* Rating + Experience + Fee Box */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "12px",
                marginTop: "14px",
                textAlign: "center",
              }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <Star size={13} fill="#D97706" /> {adv.rating}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{adv.reviewsCount} reviews</div>
                </div>

                <div style={{ borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>
                    {adv.experienceYears} Yrs
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>Trial Practice</div>
                </div>

                <div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#059669" }}>
                    ₹{adv.consultationFee}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>60-min video</div>
                </div>
              </div>

            </div>

            {/* Actions: View Profile + Book Video Consultation */}
            <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
              <button
                onClick={() => setSelectedAdvocate(adv)}
                className="btn-ghost"
                style={{ flex: 1, fontSize: "13.5px", height: "40px" }}
              >
                View Profile
              </button>
              <button
                onClick={() => setBookingAdvocate(adv)}
                className="btn-primary"
                style={{ flex: 1, fontSize: "13.5px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Video size={14} /> Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-in Advocate Profile Modal */}
      {selectedAdvocate && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "600px",
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{
                  width: "56px", height: "56px",
                  borderRadius: "16px",
                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: "700", color: "#2563EB",
                }}>
                  {selectedAdvocate.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0F172A" }}>{selectedAdvocate.name}</h2>
                  <p style={{ fontSize: "14px", color: "#64748B" }}>{selectedAdvocate.specialization}</p>
                  <span style={{ fontSize: "12px", color: "#059669", fontWeight: "600" }}>✓ Bar Enrolled: {selectedAdvocate.barNumber}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAdvocate(null)}
                style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            <p style={{ fontSize: "14.5px", color: "#D7DCE5", lineHeight: "1.6" }}>
              {selectedAdvocate.bio}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#9AA5B5", textTransform: "uppercase" }}>Courts Admitted</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selectedAdvocate.courts.map((court, i) => (
                  <span key={i} style={{ fontSize: "13px", background: "rgba(59, 130, 246, 0.16)", color: "#60A5FA", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "4px 10px", borderRadius: "8px" }}>
                    {court}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <button
                onClick={() => setSelectedAdvocate(null)}
                className="btn-ghost"
                style={{ flex: 1, height: "46px" }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const adv = selectedAdvocate;
                  setSelectedAdvocate(null);
                  setBookingAdvocate(adv);
                }}
                className="btn-primary"
                style={{ flex: 2, height: "46px" }}
              >
                Book Video Consultation · ₹{selectedAdvocate.consultationFee}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingAdvocate && (
        <BookingModal
          advocate={bookingAdvocate}
          isOpen={!!bookingAdvocate}
          onClose={() => setBookingAdvocate(null)}
        />
      )}

    </div>
  );
}
