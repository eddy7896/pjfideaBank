import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

/**
 * Admin-only listing of geographies (states) with their sub-geographies
 * (districts) inlined. Used by the super-admin user-management UI to
 * populate state + district selectors when minting a geography-lead.
 */
export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  if (gate.user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const geos = await prisma.geography.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      subGeographies: {
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(geos);
}
