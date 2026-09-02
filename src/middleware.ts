import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/lib/redis";

// ── Rate limit rules per route pattern ─────────────────────
const RULES = [
  { pattern: /^\/api\/chat/,                   limit: 20,  window: 60  },
  { pattern: /^\/api\/auth\/(signin|login)/,   limit: 10,  window: 60  },
  { pattern: /^\/api\/auth\/signup/,           limit: 5,   window: 60  },
  { pattern: /^\/api\/documents\/generate/,    limit: 5,   window: 60  },
  { pattern: /^\/api\/payments/,               limit: 30,  window: 60  },
  { pattern: /^\/api\/admin/,                  limit: 100, window: 60  },
  { pattern: /^\/api\//,                       limit: 200, window: 60  }, // global API cap
];

function getClientId(req: NextRequest): string {
  // Prefer real IP from Vercel/Cloudflare headers
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() ?? "unknown";
  return `ip:${ip}`;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Protect Admin Routes (Zero-Trust RBAC) ───────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !["ADMIN", "SUPER_ADMIN"].includes(token.role as string)) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Forbidden: Administrative privileges required." },
          { status: 403 }
        );
      }
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 2. Rate-limit API routes ────────────────────────────────
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip health checks from rate limiting
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  // Find the most-specific matching rule
  const rule = RULES.find((r) => r.pattern.test(pathname));
  if (!rule) return NextResponse.next();

  const clientId = getClientId(req);
  const identifier = `${clientId}:${rule.pattern.source}`;

  const result = await rateLimit(identifier, rule.limit, rule.window);

  // Add rate-limit headers to response
  const response = result.allowed
    ? NextResponse.next()
    : NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please slow down.",
          retryAfter: result.resetAt,
        },
        { status: 429 }
      );

  response.headers.set("X-RateLimit-Limit", String(rule.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.resetAt));

  if (!result.allowed) {
    response.headers.set(
      "Retry-After",
      String(result.resetAt - Math.floor(Date.now() / 1000))
    );
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
