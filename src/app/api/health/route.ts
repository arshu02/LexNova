import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ── GET /api/health ─────────────────────────────────────────
// Used by UptimeRobot / Better Uptime for 24/7 monitoring.
// Returns 200 if all systems are healthy, 503 if any fail.

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const checks: Record<string, "ok" | "error"> = {};

  // ── Database check ───────────────────────────────────────
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (e) {
    console.error("[Health] DB check failed:", e);
    checks.database = "error";
  }

  // ── Redis check ──────────────────────────────────────────
  try {
    const redisUrl   = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (redisUrl && redisToken) {
      const res = await fetch(`${redisUrl}/ping`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        signal: AbortSignal.timeout(3000),
      });
      checks.cache = res.ok ? "ok" : "error";
    } else {
      checks.cache = "ok"; // Not configured = not required in dev
    }
  } catch {
    checks.cache = "error";
  }

  // ── Supabase Storage check ───────────────────────────────
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      const res = await fetch(`${supabaseUrl}/storage/v1/`, {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(3000),
      });
      checks.storage = res.status < 500 ? "ok" : "error";
    } else {
      checks.storage = "ok";
    }
  } catch {
    checks.storage = "error";
  }

  const latencyMs = Date.now() - start;
  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status:    allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      latencyMs,
      version:   process.env.npm_package_version || "1.0.0",
      env:       process.env.NODE_ENV,
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
