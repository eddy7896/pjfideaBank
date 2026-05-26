import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, ipFromRequest } from '@/lib/ratelimit';

/**
 * Public read used by the onboarding form so a teacher-trainer can pick
 * their assigned geography-lead. The payload is minimised to a
 * non-sensitive identifier set — never returns `passwordHash` or other
 * PII-grade fields. Ratelimited because the response would otherwise let
 * anyone enumerate lead accounts at will.
 */
export async function GET(request: NextRequest) {
  const ip = ipFromRequest(request);
  const rl = rateLimit(`geo-leads:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const leads = await prisma.user.findMany({
      where: { role: 'geography-lead' },
      select: {
        id: true,
        displayName: true,
        email: true,
        geographyId: true,
      },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('GET /api/auth/geography-leads error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch geography leads' },
      { status: 500 }
    );
  }
}
