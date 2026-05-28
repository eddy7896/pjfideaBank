import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

/**
 * Scoped school list. Replaces the hard-coded `SCHOOLS` constant that
 * used to live in `lib/constants.ts`.
 *
 * Scope rules:
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

  let where: any = {};
  switch (user.role) {
    case 'super-admin':
    case 'program-lead':
      break;
    case 'geography-lead':
      if (user.subGeographyIds && user.subGeographyIds.length > 0) {
        where = { subGeographyId: { in: user.subGeographyIds } };
      } else if (user.geographyId) {
        where = { subGeography: { geographyId: user.geographyId } };
      } else {
        where = { id: '__none__' };
      }
      break;
    case 'sed-department':
      where = user.geographyId
        ? { subGeography: { geographyId: user.geographyId } }
        : { id: '__none__' };
      break;
    case 'teacher-trainer':
      where = user.subGeographyId
        ? { subGeographyId: user.subGeographyId }
        : { id: '__none__' };
      break;
    case 'school':
    case 'student':
      where = user.schoolName ? { name: user.schoolName } : { id: '__none__' };
      break;
    default:
      where = { id: '__none__' };
  }

  const schools = await prisma.school.findMany({
    where,
    select: {
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
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(schools);
}
