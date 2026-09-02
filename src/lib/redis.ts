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

// ── In-Memory Fallback Store (when Redis is unconfigured or offline) ─────────
interface MemoryEntry {
  count: number;
  resetAt: number;
}
const memoryStore = new Map<string, MemoryEntry>();
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

// Periodic cleanup of stale memory entries (every 2 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
    const msNow = Date.now();
    for (const [key, item] of memoryCache.entries()) {
      if (item.expiresAt <= msNow) {
        memoryCache.delete(key);
      }
    }
  }, 120_000).unref?.();
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    const item = memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt <= Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    try {
      return JSON.parse(item.value) as T;
    } catch {
      return item.value as unknown as T;
    }
  }

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
  if (!REDIS_URL || !REDIS_TOKEN) {
    memoryCache.set(key, {
      value: serialised,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return;
  }

  await redisRequest(
    "POST",
    `/set/${encodeURIComponent(key)}`,
    [serialised, "EX", ttlSeconds]
  );
}

export async function cacheDel(key: string): Promise<void> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    memoryCache.delete(key);
    return;
  }
  await redisRequest("GET", `/del/${encodeURIComponent(key)}`);
}

// ── Rate limiting (sliding window with memory fallback) ─────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp seconds
}

/**
 * Robust rate limiter using Redis INCR + EXPIRE, with in-memory fallback.
 * @param identifier - e.g. "ip:1.2.3.4" or "user:abc123"
 * @param limit      - max requests per window
 * @param windowSec  - window size in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSec = 60
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);

  // Fallback to in-memory rate limiting if Redis is not configured
  if (!REDIS_URL || !REDIS_TOKEN) {
    const entry = memoryStore.get(identifier);
    if (!entry || entry.resetAt <= now) {
      const resetAt = now + windowSec;
      memoryStore.set(identifier, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    entry.count += 1;
    const remaining = Math.max(0, limit - entry.count);
    return {
      allowed: entry.count <= limit,
      remaining,
      resetAt: entry.resetAt,
    };
  }

  const key = `rl:${identifier}`;
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
    // If Redis call fails, fall back to memory store rather than allowing unrestricted requests
    const entry = memoryStore.get(identifier);
    if (!entry || entry.resetAt <= now) {
      memoryStore.set(identifier, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }
    entry.count += 1;
    return {
      allowed: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      resetAt: entry.resetAt,
    };
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
