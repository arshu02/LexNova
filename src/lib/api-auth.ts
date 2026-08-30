import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/redis';

export interface AuthenticatedOrg {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

/**
 * Validates enterprise API requests authenticated via Authorization header or x-api-key.
 */
export async function authenticateApiKey(
  req: NextRequest
): Promise<{ org: AuthenticatedOrg | null; errorResponse?: NextResponse }> {
  const authHeader = req.headers.get('authorization');
  const apiKeyHeader = req.headers.get('x-api-key');

  let key = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    key = authHeader.substring(7).trim();
  } else if (apiKeyHeader) {
    key = apiKeyHeader.trim();
  }

  if (!key) {
    return {
      org: null,
      errorResponse: NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Missing API key. Provide Authorization: Bearer <API_KEY> or x-api-key header.',
        },
        { status: 401 }
      ),
    };
  }

  // Rate limit per API key (120 req/min for Enterprise)
  const rl = await rateLimit(`apikey:${key}`, 120, 60);
  if (!rl.allowed) {
    return {
      org: null,
      errorResponse: NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Your API key exceeded 120 requests per minute. Contact enterprise support for higher tiers.',
          retryAfter: rl.resetAt,
        },
        { status: 429 }
      ),
    };
  }

  // Look up Organization
  const org = await prisma.organization.findUnique({
    where: { apiKey: key },
    select: { id: true, name: true, slug: true, plan: true, isActive: true },
  });

  if (!org || !org.isActive) {
    return {
      org: null,
      errorResponse: NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Invalid or deactivated API key.',
        },
        { status: 403 }
      ),
    };
  }

  return {
    org: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      plan: org.plan,
    },
  };
}
