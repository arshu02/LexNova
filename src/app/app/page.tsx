"use client";

import { Sidebar } from "@/components/Sidebar";
import { AnalysisEngine } from "@/components/AnalysisEngine";
import { AdvocatePanel } from "@/components/AdvocatePanel";

export default function AppPage() {
    return (
        <main className="flex h-screen w-full bg-[#080810] text-slate-200 overflow-hidden">
            <Sidebar />
            <AnalysisEngine />
            <AdvocatePanel />
        </main>
    );
}
