import { create } from "zustand";
import { CaseCategory, LegalRoadmap } from "@/lib/mockData";
import { Lawyer } from "@/components/LawyerCard";
import { IntakeCaseCategory } from "@/lib/intake-prompts";

// ─── Message Types ────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    role: "user" | "ai" | "ai-question"; // ai-question = Phase 1 clarifying question
    content: string;
    timestamp: Date;
    roadmap?: LegalRoadmap;
    lawyers?: Lawyer[];
    questionRound?: number; // Which round of clarifying questions (0 = first, 1 = second)
    contextComplete?: boolean; // AI has enough context to proceed to analysis
}

// ─── Structured Case Context (gathered during Phase 1) ────────────────────────

export interface CaseContext {
    category: IntakeCaseCategory;
    subCategory?: string;
    urgency?: "LOW" | "MEDIUM" | "HIGH";
    complexity?: "LOW" | "MEDIUM" | "HIGH";
    city?: string | null;
    estimatedClaimValue?: number | null;
    caseFlags?: string[];
    lawyerType?: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    category: CaseCategory;
    city: string | null;
    // Intake pipeline state
    intakePhase: "understanding" | "analyzing" | "complete";
    intakeTurns: number;  // How many clarification rounds have occurred
    intakeCategory: IntakeCaseCategory;
    caseContext: CaseContext | null;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

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
    // Intake pipeline actions
    advanceIntakePhase: (phase: "understanding" | "analyzing" | "complete") => void;
    incrementIntakeTurns: () => void;
    setCaseContext: (ctx: CaseContext) => void;
    setIntakeCategory: (category: IntakeCaseCategory) => void;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

const createEmptySession = (): ChatSession => ({
    id: Date.now().toString(),
    title: "New Case",
    messages: [],
    createdAt: new Date(),
    category: "General",
    city: null,
    intakePhase: "understanding",
    intakeTurns: 0,
    intakeCategory: "GENERAL",
    caseContext: null,
});

// ─── Store ────────────────────────────────────────────────────────────────────

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

    advanceIntakePhase: (phase) => {
        const { activeSessionId } = get();
        set((state) => ({
            sessions: state.sessions.map((s) =>
                s.id === activeSessionId ? { ...s, intakePhase: phase } : s
            ),
        }));
    },

    incrementIntakeTurns: () => {
        const { activeSessionId } = get();
        set((state) => ({
            sessions: state.sessions.map((s) =>
                s.id === activeSessionId ? { ...s, intakeTurns: s.intakeTurns + 1 } : s
            ),
        }));
    },

    setCaseContext: (ctx) => {
        const { activeSessionId } = get();
        set((state) => ({
            sessions: state.sessions.map((s) =>
                s.id === activeSessionId ? { ...s, caseContext: ctx } : s
            ),
        }));
    },

    setIntakeCategory: (category) => {
        const { activeSessionId } = get();
        set((state) => ({
            sessions: state.sessions.map((s) =>
                s.id === activeSessionId ? { ...s, intakeCategory: category } : s
            ),
        }));
    },
}));
