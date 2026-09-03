/**
 * LexNova — Centralized Auth Helpers
 *
 * Eliminates the repeated session-resolution boilerplate that currently appears
 * in every API route. All role/permission logic is defined here once.
 *
 * Usage:
 *   const { user, errorResponse } = await requireAuth(req);
 *   if (errorResponse) return errorResponse;
 */

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// ── Shared user type returned by helpers ─────────────────────
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  orgId: string | null;
  isActive: boolean;
  isBanned: boolean;
  plan: string;
}

// ── Role constants ────────────────────────────────────────────
export const ROLES = {
  USER:       'USER',
  ADVOCATE:   'ADVOCATE',
  LAWYER:     'LAWYER',
  ADMIN:      'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

// ── Role predicates ───────────────────────────────────────────

/** Returns true for ADMIN or SUPER_ADMIN */
export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

/** Returns true only for SUPER_ADMIN */
export function isSuperAdmin(role: string): boolean {
  return role === ROLES.SUPER_ADMIN;
}

/** Returns true for ADVOCATE or LAWYER (both spellings used in schema) */
export function isLawyer(role: string): boolean {
  return role === ROLES.ADVOCATE || role === ROLES.LAWYER;
}

// ── Core session resolution ───────────────────────────────────

/**
 * Resolves the currently authenticated user from the NextAuth session.
 * Returns { user } on success or { errorResponse } on failure.
 *
 * This replaces the 20-line boilerplate that appears in every route.
 */
export async function requireAuth(req?: Request): Promise<
  | { user: SessionUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse }
> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      ),
    };
  }

  const sessionUserId = (session.user as any)?.id as string | undefined;
  const sessionEmail  = session.user.email;

  // Resolve the full user record from DB (session token may only have id or email)
  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        ...(sessionUserId ? [{ id: sessionUserId }] : []),
        ...(sessionEmail  ? [{ email: sessionEmail }] : []),
      ],
    },
    select: {
      id: true, email: true, name: true, role: true,
      orgId: true, isActive: true, isBanned: true, plan: true,
    },
  });

  if (!dbUser) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'User not found', message: 'Your account could not be found.' },
        { status: 404 }
      ),
    };
  }

  if (!dbUser.isActive || dbUser.isBanned) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Account disabled', message: 'Your account has been suspended.' },
        { status: 403 }
      ),
    };
  }

  return { user: dbUser as SessionUser, errorResponse: null };
}

/**
 * Requires admin-level authentication (ADMIN or SUPER_ADMIN).
 * Returns { user } or { errorResponse }.
 */
export async function requireAdmin(): Promise<
  | { user: SessionUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse }
> {
  const result = await requireAuth();
  if (result.errorResponse) return result;

  if (!isAdmin(result.user.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Forbidden', message: 'Administrative privileges required.' },
        { status: 403 }
      ),
    };
  }

  return result;
}

/**
 * Verifies that the authenticated user owns or is authorized to access
 * the given matter. Returns true if authorized.
 *
 * Authorization rules:
 * - ADMIN / SUPER_ADMIN: always authorized
 * - Owner (userId): authorized
 * - Assigned advocate (advocate.userId): authorized
 * - Case party (caseParties.userId): authorized
 */
export async function canAccessMatter(
  userId: string,
  role: string,
  matterId: string
): Promise<boolean> {
  if (isAdmin(role)) return true;

  const matter = await prisma.matter.findFirst({
    where: {
      id: matterId,
      OR: [
        { userId },
        { advocate: { userId } },
        { caseParties: { some: { userId } } },
      ],
    },
    select: { id: true },
  });

  return !!matter;
}

/**
 * Verifies that the authenticated user owns or is authorized to modify
 * the given matter (owner or assigned advocate only — not just case party).
 */
export async function canModifyMatter(
  userId: string,
  role: string,
  matterId: string
): Promise<boolean> {
  if (isAdmin(role)) return true;

  const matter = await prisma.matter.findFirst({
    where: {
      id: matterId,
      OR: [
        { userId },
        { advocate: { userId } },
      ],
    },
    select: { id: true },
  });

  return !!matter;
}

// ── Error response helpers ────────────────────────────────────

export function unauthorizedResponse(message = 'Authentication required.'): NextResponse {
  return NextResponse.json({ error: 'Unauthorized', message }, { status: 401 });
}

export function forbiddenResponse(message = 'Access denied.'): NextResponse {
  return NextResponse.json({ error: 'Forbidden', message }, { status: 403 });
}

export function notFoundResponse(resource = 'Resource'): NextResponse {
  return NextResponse.json(
    { error: 'Not Found', message: `${resource} not found or access denied.` },
    { status: 404 }
  );
}

export function validationErrorResponse(messages: string[]): NextResponse {
  return NextResponse.json(
    { error: 'Validation Failed', details: messages },
    { status: 400 }
  );
}

export function internalErrorResponse(message = 'An unexpected error occurred.'): NextResponse {
  return NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 });
}
