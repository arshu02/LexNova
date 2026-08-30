// src/lib/rag-search.ts
// ─────────────────────────────────────────────────────────────────────────────
// RAG (Retrieval-Augmented Generation) search over the Indian law Pinecone index.
// Used by the chat API to inject real section text into Claude's prompt.
// ─────────────────────────────────────────────────────────────────────────────

const PINECONE_KEY  = process.env.PINECONE_API_KEY!;
const PINECONE_HOST = process.env.PINECONE_INDEX_HOST!;
const OPENAI_KEY    = process.env.OPENAI_API_KEY!;

// Minimum similarity score to include a result (0–1)
const MIN_RELEVANCE_SCORE = 0.30;

// Map of city/state keywords → state-specific act file name prefix
const STATE_ACT_MAP: Record<string, string> = {
  bengaluru:   "karnataka-rent",
  bangalore:   "karnataka-rent",
  karnataka:   "karnataka-rent",
  mumbai:      "maharashtra-rent",
  pune:        "maharashtra-rent",
  maharashtra: "maharashtra-rent",
  delhi:       "delhi-rent",
  "new delhi": "delhi-rent",
  chennai:     "tn-buildings",
  "tamil nadu": "tn-buildings",
  hyderabad:   "telangana-rent",
  telangana:   "telangana-rent",
  kolkata:     "wb-premises",
  "west bengal": "wb-premises",
};

// ─── Embed a query using OpenAI text-embedding-3-small ────────────────────────
async function embedQuery(query: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: query.slice(0, 8000), // token safety limit
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`OpenAI embed error: ${data.error.message}`);
  return data.data[0].embedding;
}

// ─── Detect state-specific act from free text ─────────────────────────────────
export function detectJurisdiction(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, actFile] of Object.entries(STATE_ACT_MAP)) {
    if (lower.includes(keyword)) return actFile;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main public function: search Pinecone for relevant Indian law sections
// Returns a formatted string to inject into Claude's prompt, or "" on failure.
// ─────────────────────────────────────────────────────────────────────────────
export async function searchIndianLaw(
  query: string,
  topK: number = 5,
  stateActFile?: string | null
): Promise<string> {

  // If Pinecone is not configured, return empty (graceful fallback)
  if (!PINECONE_KEY || !PINECONE_HOST || !OPENAI_KEY) {
    console.warn("[RAG] Pinecone or OpenAI not configured — skipping RAG lookup");
    return "";
  }

  try {
    // 1. Embed the query
    const queryVector = await embedQuery(query);

    // 2. Build optional Pinecone metadata filter
    //    Always include central acts + optionally the state-specific rent act
    let filter: Record<string, unknown> | undefined;
    if (stateActFile) {
      // Pinecone filter: match vectors whose fileName is NOT a state rent act
      // OR is exactly the matching state rent act
      const stateRentFiles = Object.values(STATE_ACT_MAP);
      const otherStateActs = [...new Set(stateRentFiles)].filter(
        (f) => f !== stateActFile
      );
      filter = {
        fileName: { $nin: otherStateActs },
      };
    }

    // 3. Query Pinecone
    const res = await fetch(`${PINECONE_HOST}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PINECONE_KEY,
      },
      body: JSON.stringify({
        vector: queryVector,
        topK,
        includeMetadata: true,
        ...(filter ? { filter } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Pinecone query failed (${res.status}): ${err}`);
    }

    const data = await res.json();

    if (!data.matches || data.matches.length === 0) {
      console.log("[RAG] No matches returned from Pinecone");
      return "";
    }

    // 4. Filter by minimum relevance and format for Claude
    const relevant = data.matches.filter(
      (m: any) => (m.score ?? 0) >= MIN_RELEVANCE_SCORE
    );

    if (relevant.length === 0) {
      console.log(`[RAG] ${data.matches.length} matches found but all below ${MIN_RELEVANCE_SCORE} threshold`);
      return "";
    }

    console.log(`[RAG] Found ${relevant.length} relevant law sections (score ≥ ${MIN_RELEVANCE_SCORE})`);

    const context = relevant
      .map((m: any, i: number) => {
        const meta = m.metadata || {};
        const score = ((m.score ?? 0) * 100).toFixed(0);
        return [
          `[${i + 1}] ${meta.actName} — Section ${meta.sectionNumber}`,
          `Title: ${meta.sectionTitle || "(untitled)"}`,
          `Relevance: ${score}%`,
          `---`,
          meta.text || "(text not stored in metadata)",
        ].join("\n");
      })
      .join("\n\n");

    return context;

  } catch (err: any) {
    // Always fail gracefully — Claude answers without RAG if this fails
    console.error("[RAG] searchIndianLaw error:", err.message);
    return "";
  }
}

// ─── Convenience: detect jurisdiction + search in one call ────────────────────
export async function searchLawForCase(
  caseText: string,
  topK: number = 5
): Promise<{ context: string; jurisdiction: string | null }> {
  const jurisdiction = detectJurisdiction(caseText);
  const context = await searchIndianLaw(caseText, topK, jurisdiction);
  return { context, jurisdiction };
}
