import React from "react";
import { Star, MapPin, Briefcase } from "lucide-react";

export interface Lawyer {
  id: string | number;
  name: string;
  type: string;
  experience: number;
  location?: string;
  city?: string;
  rating: number;
  casesHandled?: number;
  qualification: string;
  specialization: string[] | string;
  fee: string;
  reason?: string;
}

export default function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div style={card}>
      <h3 className="text-lg font-bold text-slate-800">{lawyer.name}</h3>
      <p className="font-medium text-purple-600 mb-2">{lawyer.type}</p>

      <div className="text-[13px] text-slate-600 space-y-1 mb-3">
        <p>🎓 {lawyer.qualification}</p>
        <p>📍 {lawyer.location || lawyer.city || "India"}</p>
        <p className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {lawyer.rating} ({lawyer.casesHandled ? `${lawyer.casesHandled} cases` : "Verified"}) • {lawyer.experience} yrs
        </p>
      </div>

      <div className="bg-slate-50 p-2 rounded-md mb-3 text-xs border border-slate-100">
        <p className="font-semibold text-slate-700 mb-1">💼 Specialization:</p>
        <ul className="list-disc list-inside text-slate-500">
          {Array.isArray(lawyer.specialization) ? (
            lawyer.specialization.map((s, i) => (
              <li key={i}>{s}</li>
            ))
          ) : (
            <li>{lawyer.specialization}</li>
          )}
        </ul>
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-3">💰 {lawyer.fee}</p>

      {lawyer.reason && (
        <p className="text-xs text-green-700 bg-green-50 p-2 rounded-md mb-3 font-medium flex gap-2">
            ✅ {lawyer.reason}
        </p>
      )}

      <button style={btn}>Contact</button>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginTop: "10px",
  border: "1px solid #e2e8f0"
};

const btn = {
  marginTop: "10px",
  padding: "8px 16px",
  background: "#3B82F6",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer"
};
