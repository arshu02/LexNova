/**
 * Upstash Redis client — serverless-compatible caching & rate limiting.
 * Falls back gracefully (returns null / noop) when env vars are missing,
 * so the app works locally without Redis configured.
 */

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  const res = await fetch(`${REDIS_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  return (json as any).result ?? null;
}

// ── Core operations ─────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  const result = await redisRequest("GET", `/get/${encodeURIComponent(key)}`);
  if (!result || typeof result !== "string") return null;
  try {
    return JSON.parse(result) as T;
  } catch {
    return result as unknown as T;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<void> {
  const serialised = JSON.stringify(value);
  await redisRequest(
    "POST",
    `/set/${encodeURIComponent(key)}`,
    [serialised, "EX", ttlSeconds]
  );
}

export async function cacheDel(key: string): Promise<void> {
  await redisRequest("GET", `/del/${encodeURIComponent(key)}`);
}

// ── Rate limiting (sliding window) ─────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp seconds
}

/**
 * Simple fixed-window rate limiter using Redis INCR + EXPIRE.
 * @param identifier - e.g. "ip:1.2.3.4" or "user:abc123"
 * @param limit      - max requests per window
 * @param windowSec  - window size in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSec = 60
): Promise<RateLimitResult> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    // No Redis — allow everything in dev
    return { allowed: true, remaining: limit - 1, resetAt: 0 };
  }

  const key = `rl:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSec;

  try {
    // Atomic INCR
    const count = (await redisRequest(
      "POST",
      `/incr/${encodeURIComponent(key)}`,
      []
    )) as number;

    // Set TTL on first request
    if (count === 1) {
      await redisRequest("GET", `/expire/${encodeURIComponent(key)}/${windowSec}`);
    }

    const remaining = Math.max(0, limit - count);
    return { allowed: count <= limit, remaining, resetAt };
  } catch {
    return { allowed: true, remaining: limit, resetAt };
  }
}

// ── Common cache key helpers ────────────────────────────────

export const CacheKeys = {
  lawyerMatch:    (category: string, city: string) =>
    `lawyers:${category}:${city?.toLowerCase() ?? "all"}`,
  ragSearch:      (hash: string) => `rag:${hash}`,
  userSession:    (userId: string) => `session:${userId}`,
  planLimits:     (userId: string) => `plan:${userId}`,
};

// ── TTLs (seconds) ──────────────────────────────────────────

export const TTL = {
  LAWYER_MATCH: 5  * 60,   // 5 minutes
  RAG_SEARCH:   60 * 60,   // 1 hour
  USER_SESSION: 15 * 60,   // 15 minutes
  PLAN_LIMITS:  10 * 60,   // 10 minutes
  AI_RESPONSE:  30 * 60,   // 30 minutes
};
