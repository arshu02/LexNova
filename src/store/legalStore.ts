import { create } from "zustand";
import { CaseCategory, LegalRoadmap } from "@/lib/mockData";
import { Lawyer } from "@/components/LawyerCard";

export interface ChatMessage {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
    roadmap?: LegalRoadmap;
    lawyers?: Lawyer[];
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    category: CaseCategory;
    city: string | null;
}

interface LegalStore {
    sessions: ChatSession[];
    activeSessionId: string | null;
    isTyping: boolean;
    detectedCategory: CaseCategory;
    detectedCity: string | null;
    urgency: "High" | "Medium" | "Low";
    complexity: "Standard" | "Complex" | "Highly Complex";

    // Actions
    createNewSession: () => void;
    setActiveSession: (id: string) => void;
    addMessage: (message: ChatMessage) => void;
    setTyping: (val: boolean) => void;
    updateSessionContext: (
        category: CaseCategory,
        city: string | null,
        urgency?: "High" | "Medium" | "Low",
        complexity?: "Standard" | "Complex" | "Highly Complex"
    ) => void;
}

const createEmptySession = (): ChatSession => ({
    id: Date.now().toString(),
    title: "New Case",
    messages: [],
    createdAt: new Date(),
    category: "General",
    city: null,
});

export const useLegalStore = create<LegalStore>((set, get) => ({
    sessions: [],
    activeSessionId: null,
    isTyping: false,
    detectedCategory: "General",
    detectedCity: null,
    urgency: "Medium",
    complexity: "Standard",

    createNewSession: () => {
        const session = createEmptySession();
        set((state) => ({
            sessions: [session, ...state.sessions],
            activeSessionId: session.id,
            detectedCategory: "General",
            detectedCity: null,
        }));
    },

    setActiveSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (session) {
            set({
                activeSessionId: id,
                detectedCategory: session.category,
                detectedCity: session.city,
            });
        }
    },

    addMessage: (message) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        set((state) => ({
            sessions: state.sessions.map((s) => {
                if (s.id !== activeSessionId) return s;
                const title = s.messages.length === 0
                    ? message.content.slice(0, 40) + (message.content.length > 40 ? "…" : "")
                    : s.title;
                return {
                    ...s,
                    title,
                    messages: [...s.messages, message],
                };
            }),
        }));
    },

    setTyping: (val) => set({ isTyping: val }),

    updateSessionContext: (category, city, urgency, complexity) => {
        const { activeSessionId } = get();
        set((state) => ({
            detectedCategory: category,
            detectedCity: city,
            ...(urgency ? { urgency } : {}),
            ...(complexity ? { complexity } : {}),
            sessions: state.sessions.map((s) =>
                s.id === activeSessionId ? { ...s, category, city } : s
            ),
        }));
    },
}));
