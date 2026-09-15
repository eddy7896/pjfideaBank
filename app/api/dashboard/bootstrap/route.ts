import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import {
  applyIdeaScoping,
  applyTeamScoping,
  applySchoolScoping,
  applyActivityScoping,
} from '@/lib/db/scoping';
import { IDEA_LIST_TIMELINE_INCLUDE } from '@/app/api/ideas/route';
import { SCHOOL_LIST_SELECT } from '@/app/api/schools/route';

/**
 * Everything the dashboard shell needs for its first paint, in one request.
 *
 * On a slow/flaky mobile connection, round-trip *count* matters as much as
 * payload size - the dashboard used to fire 5 separate GETs (ideas, teams,
 * activities, schools, themes) on every mount, each its own chance to drop.
 * This does the same 5 scoped queries in parallel server-side and returns
 * them as one response.
 *
 * This is purely additive - /api/ideas, /api/teams, /api/schools,
 * /api/activities, and /api/themes are unchanged and still used for
 * individual refreshes after a mutation (e.g. reloading just teams after
 * creating one). Nothing here duplicates their scoping logic; it's all
 * reused directly from lib/db/scoping.ts.
 */
export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const [ideas, teams, activityWhere, schools, themes] = await Promise.all([
      prisma.idea.findMany({
        where: applyIdeaScoping(user),
        include: { timeline: IDEA_LIST_TIMELINE_INCLUDE },
      }),
      prisma.studentTeam.findMany({
        where: applyTeamScoping(user),
        include: { members: true },
      }),
      applyActivityScoping(user),
      prisma.school.findMany({
        where: applySchoolScoping(user),
        select: SCHOOL_LIST_SELECT,
        orderBy: { name: 'asc' },
      }),
      prisma.theme.findMany({ orderBy: [{ sortOrder: 'asc' }, { month: 'asc' }] }),
    ]);

    const activities = await prisma.themeActivity.findMany({ where: activityWhere });

    return NextResponse.json({ ideas, teams, activities, schools, themes });
  } catch (error) {
    console.error('Failed to load dashboard bootstrap:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
