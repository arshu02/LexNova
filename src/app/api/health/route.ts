import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ── GET /api/health ──────────────────────────────────────────
// Used by uptime monitors and Kubernetes liveness/readiness probes.
// Returns 200 when all critical systems are healthy, 503 when degraded.
//
// DO NOT expose this behind authentication — monitors need unauthenticated access.
// DO NOT include sensitive information (passwords, keys, internal IPs) in the response.

export const dynamic = 'force-dynamic';

interface CheckResult {
  status: 'ok' | 'degraded' | 'error';
  latencyMs?: number;
  message?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (e: any) {
    console.error('[Health] DB check failed:', e?.message);
    return { status: 'error', latencyMs: Date.now() - start, message: 'Database unavailable' };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start   = Date.now();
  const redisUrl   = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return { status: 'ok', message: 'Redis not configured (using in-memory fallback)' };
  }

  try {
    const res = await fetch(`${redisUrl}/ping`, {
      headers: { Authorization: `Bearer ${redisToken}` },
      signal:  AbortSignal.timeout(3000),
    });
    return {
      status:    res.ok ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      message:   res.ok ? undefined : `Redis responded with ${res.status}`,
    };
  } catch (e: any) {
    return { status: 'degraded', latencyMs: Date.now() - start, message: 'Redis timeout' };
  }
}

async function checkStorage(): Promise<CheckResult> {
  const start        = Date.now();
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey      = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { status: 'ok', message: 'Storage not configured' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/`, {
      headers: { apikey: anonKey },
      signal:  AbortSignal.timeout(3000),
    });
    return {
      status:    res.status < 500 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
    };
  } catch (e: any) {
    return { status: 'degraded', latencyMs: Date.now() - start, message: 'Storage timeout' };
  }
}

async function checkAI(): Promise<CheckResult> {
  const start  = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.startsWith('sk-ant-dummy')) {
    return { status: 'ok', message: 'AI provider not configured (features degraded)' };
  }

  try {
    // Lightweight check — just verify the endpoint is reachable
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      signal: AbortSignal.timeout(5000),
    });
    return {
      status:    res.status < 500 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      message:   res.ok ? undefined : `Anthropic API returned ${res.status}`,
    };
  } catch (e: any) {
    return { status: 'degraded', latencyMs: Date.now() - start, message: 'AI provider unreachable' };
  }
}

export async function GET() {
  const start = Date.now();

  // Run all checks in parallel
  const [database, cache, storage, ai] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStorage(),
    checkAI(),
  ]);

  const checks = { database, cache, storage, ai };

  // Determine overall status:
  // - 'ok'       : all checks pass
  // - 'degraded' : non-critical checks degraded but DB is ok
  // - 'error'    : database unavailable (critical)
  const overallStatus =
    database.status === 'error'
      ? 'error'
      : Object.values(checks).some((c) => c.status !== 'ok')
      ? 'degraded'
      : 'ok';

  const httpStatus =
    overallStatus === 'error' ? 503 : overallStatus === 'degraded' ? 207 : 200;

  return NextResponse.json(
    {
      status:    overallStatus,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - start,
      version:   process.env.npm_package_version || '1.0.0',
      env:       process.env.NODE_ENV,
      checks,
    },
    { status: httpStatus }
  );
}
