/**
 * Sentry error monitoring — graceful no-op when DSN not configured.
 * Captures exceptions with user context and request metadata.
 */

const SENTRY_DSN = process.env.SENTRY_DSN;

// ── Lazy Sentry initialisation ──────────────────────────────
let _Sentry: typeof import("@sentry/nextjs") | null = null;

async function getSentry() {
  if (!SENTRY_DSN) return null;
  if (_Sentry) return _Sentry;
  try {
    _Sentry = await import("@sentry/nextjs");
    _Sentry.init({
      dsn:                     SENTRY_DSN,
      environment:             process.env.NODE_ENV || "development",
      release:                 process.env.VERCEL_GIT_COMMIT_SHA,
      tracesSampleRate:        process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      profilesSampleRate:      0.1,
      normalizeDepth:          6,
      ignoreErrors: [
        // Ignore common non-actionable errors
        "ResizeObserver loop limit exceeded",
        "Network request failed",
        "Load failed",
      ],
    });
    return _Sentry;
  } catch {
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────

export async function captureException(
  error: unknown,
  context?: {
    userId?:   string;
    route?:    string;
    extra?:    Record<string, unknown>;
    tags?:     Record<string, string>;
  }
) {
  console.error("[Error]", context?.route ?? "unknown", error);

  const sentry = await getSentry();
  if (!sentry) return;

  sentry.withScope((scope) => {
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context?.route) {
      scope.setTag("route", context.route);
    }
    if (context?.tags) {
      Object.entries(context.tags).forEach(([k, v]) => scope.setTag(k, v));
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([k, v]) => scope.setExtra(k, v));
    }
    sentry.captureException(error);
  });
}

export async function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  extra?: Record<string, unknown>
) {
  console.log(`[${level.toUpperCase()}]`, message, extra ?? "");

  const sentry = await getSentry();
  if (!sentry) return;

  sentry.withScope((scope) => {
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => scope.setExtra(k, v));
    }
    sentry.captureMessage(message, level);
  });
}

// ── API route wrapper helper ─────────────────────────────────

export function withMonitoring(
  route: string,
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    const start = Date.now();
    try {
      const response = await handler(req);
      const latency = Date.now() - start;
      if (latency > 5000) {
        await captureMessage(`Slow API route: ${route} took ${latency}ms`, "warning");
      }
      return response;
    } catch (error) {
      await captureException(error, { route });
      throw error; // Re-throw so Next.js handles the 500
    }
  };
}
