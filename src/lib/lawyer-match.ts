import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Fallback data when DB has no verified advocates
// ---------------------------------------------------------------------------
const FALLBACK_ADVOCATES = [
  {
    id: "adv_1",
    name: "Adv. Rahul Sharma",
    type: "Criminal & Employment Lawyer",
    specialization: "Criminal & Employment",
    experience: 12,
    experienceYears: 12,
    rating: 4.9,
    cases: 1240,
    qualification: "Bar Council Reg: D/1042/2012",
    fee: "₹1,500 / session",
    pricing: "₹1,500 / session",
    language: "English, Hindi",
    languages: "English, Hindi",
    city: "New Delhi",
    verified: true,
    availability: "Available Now",
    matchScore: 95,
    matchReason: "Top-rated criminal & employment specialist in your region",
    score: 10,
  },
  {
    id: "adv_2",
    name: "Adv. Priya Mehta",
    type: "Corporate & Employment Specialist",
    specialization: "Corporate & Employment",
    experience: 8,
    experienceYears: 8,
    rating: 4.8,
    cases: 850,
    qualification: "Bar Council Reg: MAH/850/2016",
    fee: "₹1,200 / session",
    pricing: "₹1,200 / session",
    language: "English, Hindi, Marathi",
    languages: "English, Hindi, Marathi",
    city: "Mumbai",
    verified: true,
    availability: "Next Week",
    matchScore: 88,
    matchReason: "Highly experienced in corporate and employment disputes",
    score: 9,
  },
  {
    id: "adv_3",
    name: "Adv. Sanjay Gupta",
    type: "Property & Tenancy Advocate",
    specialization: "Property & Tenancy",
    experience: 15,
    experienceYears: 15,
    rating: 4.7,
    cases: 2100,
    qualification: "Bar Council Reg: KAR/2100/2009",
    fee: "₹2,000 / session",
    pricing: "₹2,000 / session",
    language: "English, Kannada, Hindi",
    languages: "English, Kannada, Hindi",
    city: "Bengaluru",
    verified: true,
    availability: "In 2 Days",
    matchScore: 81,
    matchReason: "15+ years handling property and tenancy matters",
    score: 8,
  },
  {
    id: "adv_4",
    name: "Adv. Ananya Iyer",
    type: "Consumer & Cyber Law Specialist",
    specialization: "Consumer & Cyber Law",
    experience: 6,
    experienceYears: 6,
    rating: 4.9,
    cases: 420,
    qualification: "Bar Council Reg: TS/420/2018",
    fee: "₹1,000 / session",
    pricing: "₹1,000 / session",
    language: "English, Telugu, Hindi",
    languages: "English, Telugu, Hindi",
    city: "Hyderabad",
    verified: true,
    availability: "Available Now",
    matchScore: 78,
    matchReason: "Specialist in consumer protection and IT/cyber offences",
    score: 7,
  },
];

// ---------------------------------------------------------------------------
// Category ↔ specialization synonym map
// ---------------------------------------------------------------------------
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  labour_dispute:   ["labour", "employment", "workplace", "wage", "salary", "termination", "hr"],
  property_dispute: ["property", "tenancy", "tenant", "landlord", "real estate", "land", "rent"],
  consumer_grievance: ["consumer", "refund", "product", "defective", "ecommerce", "complaint", "ncdrc"],
  criminal_cyber:   ["criminal", "cyber", "fir", "fraud", "cheque", "ipc", "digital", "police"],
  family_divorce:   ["family", "divorce", "matrimonial", "custody", "alimony", "maintenance", "domestic"],
  corporate_contract: ["corporate", "contract", "company", "partnership", "startup", "commercial", "business"],
  general:          [],
};

function computeMatchScore(
  advocateSpec: string,
  advocateCity: string | null | undefined,
  advocateRating: number | null | undefined,
  advocateExp: number | null | undefined,
  advocateCases: number | null | undefined,
  advocateAvailability: string | null | undefined,
  category: string,
  userCity: string | null
): { score: number; matchScore: number; matchReason: string } {
  let raw = 0;
  let reasons: string[] = [];

  const spec = (advocateSpec || "").toLowerCase();
  const cat  = (category || "").toLowerCase();
  const synonyms = CATEGORY_SYNONYMS[cat] || CATEGORY_SYNONYMS[cat.replace(/-/g, "_")] || [];

  // Specialization match (max 40 pts)
  const specMatch = synonyms.some((kw) => spec.includes(kw)) || spec.includes(cat.split("_")[0]);
  if (specMatch) {
    raw += 40;
    reasons.push("specialization match");
  }

  // City match (max 25 pts)
  if (userCity && advocateCity && advocateCity.toLowerCase() === userCity.toLowerCase()) {
    raw += 25;
    reasons.push("based in your city");
  } else if (userCity && advocateCity && advocateCity.toLowerCase().includes(userCity.toLowerCase().split(" ")[0])) {
    raw += 10;
    reasons.push("nearby location");
  }

  // Rating (max 25 pts)
  const rating = advocateRating || 0;
  const ratingPts = Math.round(rating * 5); // 4.9 → 24.5
  raw += ratingPts;
  if (rating >= 4.8) reasons.push(`top-rated (${rating}★)`);

  // Experience (max 15 pts, capped)
  const expPts = Math.min((advocateExp || 0) * 1, 15);
  raw += expPts;
  if ((advocateExp || 0) >= 10) reasons.push(`${advocateExp}+ years experience`);

  // Availability bonus (10 pts)
  const avail = (advocateAvailability || "").toLowerCase();
  if (avail.includes("now") || avail.includes("today")) {
    raw += 10;
    reasons.push("available now");
  }

  // Cases handled (up to 5 pts)
  if ((advocateCases || 0) > 500) {
    raw += 5;
    reasons.push(`${(advocateCases || 0).toLocaleString()} cases handled`);
  }

  // Normalise to 0–100
  const MAX_POSSIBLE = 40 + 25 + 25 + 15 + 10 + 5; // 120
  const matchScore = Math.min(100, Math.round((raw / MAX_POSSIBLE) * 100));

  // Build human-readable reason
  const matchReason =
    reasons.length > 0
      ? reasons.slice(0, 3).map((r, i) => (i === 0 ? r.charAt(0).toUpperCase() + r.slice(1) : r)).join(" · ")
      : "Qualified advocate for your matter";

  return { score: raw, matchScore, matchReason };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function getMatchedLawyers(category: string, userCity: string | null) {
  try {
    const advocates = await prisma.advocate.findMany({ where: { verified: true } });

    if (!advocates || advocates.length === 0) {
      return enrichFallback(category, userCity);
    }

    const scored = advocates
      .map((advocate) => {
        const { score, matchScore, matchReason } = computeMatchScore(
          advocate.specialization || "",
          advocate.city,
          advocate.rating,
          advocate.experienceYears,
          null, // cases not in DB schema
          null, // availability not in DB schema
          category,
          userCity
        );

        return {
          id: advocate.id,
          name: advocate.name,
          type: advocate.specialization,
          specialization: advocate.specialization,
          experience: advocate.experienceYears,
          experienceYears: advocate.experienceYears,
          rating: advocate.rating,
          cases: null,
          qualification: advocate.barNumber ? `Bar No: ${advocate.barNumber}` : "Bar Council Verified",
          fee: advocate.pricing,
          pricing: advocate.pricing,
          language: advocate.languages,
          languages: advocate.languages,
          city: advocate.city,
          verified: advocate.verified,
          availability: "Contact to confirm",
          matchScore,
          matchReason,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored.length > 0 ? scored : enrichFallback(category, userCity);
  } catch (error) {
    console.error("Match lawyers error:", error);
    return enrichFallback(category, userCity);
  }
}

// Re-score fallback data against the actual query
function enrichFallback(category: string, userCity: string | null) {
  return FALLBACK_ADVOCATES.map((adv) => {
    const { score, matchScore, matchReason } = computeMatchScore(
      adv.specialization,
      adv.city,
      adv.rating,
      adv.experience,
      adv.cases,
      adv.availability,
      category,
      userCity
    );
    return { ...adv, score, matchScore, matchReason };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
