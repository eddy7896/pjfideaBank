import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, ipFromRequest } from '@/lib/ratelimit';

/**
 * Public read used by the teacher-trainer onboarding form to pick an
 * assigned geography-lead. Returns minimal identifiers plus the lead's
 * state (geography) and assigned districts (sub-geographies) so the
 * trainer can confirm coverage before selecting. PasswordHash and other
 * sensitive columns are excluded.
 *
 * Rate-limited because the response would otherwise let anyone
 * enumerate lead accounts at will.
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
        geography: { select: { name: true, code: true } },
        assignedSubGeos: {
          select: {
            subGeography: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { displayName: 'asc' },
    });

    // Flatten the join into a simple `subGeographies` array.
    const shaped = leads.map((l) => ({
      id: l.id,
      displayName: l.displayName,
      email: l.email,
      geographyId: l.geographyId,
      geographyName: l.geography?.name ?? null,
      geographyCode: l.geography?.code ?? null,
      subGeographies: l.assignedSubGeos.map((j) => j.subGeography),
    }));

    return NextResponse.json(shaped);
  } catch (error) {
    console.error('GET /api/auth/geography-leads error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch geography leads' },
      { status: 500 }
    );
  }
}
