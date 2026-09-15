import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { applySchoolScoping } from '@/lib/db/scoping';

export const SCHOOL_LIST_SELECT = {
  id: true,
  name: true,
  location: true,
  address: true,
  phone: true,
  website: true,
  principalName: true,
  udaiseCode: true,
  subGeographyId: true,
  createdAt: true,
  subGeography: {
    select: {
      id: true,
      name: true,
      geographyId: true,
      geography: { select: { id: true, name: true, code: true } },
    },
  },
} as const;

/**
 * Scoped school list. Replaces the hard-coded `SCHOOLS` constant that
 * used to live in `lib/constants.ts`.
 *
 * Scope rules — see applySchoolScoping in lib/db/scoping.ts:
 *   super-admin / program-lead    — every school
 *   geography-lead (subGeo set)   — schools whose subGeographyId is in
 *                                   the lead's assigned districts
 *   geography-lead (no subGeo)    — every school in the lead's state
 *   sed-department                — every school in the state
 *   teacher-trainer               — every school in the assigned district
 *   school                        — own school only
 *   student                       — own school only (read by school name)
 */
export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  const schools = await prisma.school.findMany({
    where: applySchoolScoping(user),
    select: SCHOOL_LIST_SELECT,
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(schools);
}
