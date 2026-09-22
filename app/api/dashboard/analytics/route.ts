import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession, requireRole } from '@/lib/auth/session';
import { applyIdeaScoping, applyTeamScoping, applyUserScoping } from '@/lib/db/scoping';
import type { Role } from '@/types';

const ANALYTICS_ROLES: Role[] = [
  'super-admin',
  'program-lead',
  'geography-lead',
  'teacher-trainer',
  'sed-department',
  'school',
];

// Roles that manage staff below them and get a roster section.
const ROSTER_ROLES: Role[] = ['super-admin', 'program-lead', 'geography-lead', 'teacher-trainer'];

type HeatmapRowKind = 'geography' | 'subGeography' | 'school';

/**
 * Everything the analytics dashboard needs beyond the raw ideas/teams/
 * schools already cached client-side from /api/dashboard/bootstrap:
 * a role-appropriate staff roster, a stage-by-territory heatmap, and (for
 * super-admin only) system-health data. Kept as its own endpoint rather
 * than folded into bootstrap because bootstrap is documented as being for
 * shell first-paint, not analytics aggregation.
 */
export async function GET(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  const forbidden = requireRole(user, ANALYTICS_ROLES);
  if (forbidden) return forbidden;

  try {
    const ideas = await prisma.idea.findMany({
      where: applyIdeaScoping(user),
      select: {
        id: true,
        status: true,
        schoolId: true,
        schoolName: true,
        school: {
          select: {
            name: true,
            subGeographyId: true,
            subGeography: { select: { id: true, name: true, geographyId: true, geography: { select: { name: true } } } },
          },
        },
      },
    });

    const teams = await prisma.studentTeam.findMany({
      where: applyTeamScoping(user),
      select: { id: true, schoolId: true, schoolName: true },
    });

    // --- Heatmap: rows = the natural sub-unit of the viewer's territory,
    // columns = Design Thinking stage. super-admin/program-lead roll up by
    // state, geography-lead by district, teacher-trainer/school by school.
    let rowKind: HeatmapRowKind = 'school';
    if (user.role === 'super-admin' || user.role === 'program-lead') rowKind = 'geography';
    else if (user.role === 'geography-lead' || user.role === 'sed-department') rowKind = 'subGeography';

    const rowCounts = new Map<string, Record<string, number>>();
    for (const idea of ideas) {
      let rowLabel: string | null = null;
      if (rowKind === 'geography') rowLabel = idea.school?.subGeography?.geography?.name ?? null;
      else if (rowKind === 'subGeography') rowLabel = idea.school?.subGeography?.name ?? null;
      else rowLabel = idea.school?.name ?? idea.schoolName;

      if (!rowLabel) continue;
      const bucket = rowCounts.get(rowLabel) ?? {};
      bucket[idea.status] = (bucket[idea.status] ?? 0) + 1;
      rowCounts.set(rowLabel, bucket);
    }

    const stages = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'];
    const heatmap = {
      rowKind,
      rows: Array.from(rowCounts.keys()).sort(),
      cols: stages,
      matrix: Array.from(rowCounts.keys())
        .sort()
        .map((row) => stages.map((stage) => rowCounts.get(row)?.[stage] ?? 0)),
    };

    // --- Roster: staff this viewer manages, with idea/team counts rolled
    // up from the same scoped ideas/teams fetched above.
    let roster: unknown[] = [];
    if (ROSTER_ROLES.includes(user.role)) {
      const ideasBySchoolId = new Map<string, number>();
      const ideasBySubGeoId = new Map<string, number>();
      const ideasByGeographyId = new Map<string, number>();
      const teamsBySchoolId = new Map<string, number>();

      for (const idea of ideas) {
        if (idea.schoolId) ideasBySchoolId.set(idea.schoolId, (ideasBySchoolId.get(idea.schoolId) ?? 0) + 1);
        const subGeoId = idea.school?.subGeographyId;
        if (subGeoId) ideasBySubGeoId.set(subGeoId, (ideasBySubGeoId.get(subGeoId) ?? 0) + 1);
        const geographyId = idea.school?.subGeography?.geographyId;
        if (geographyId) ideasByGeographyId.set(geographyId, (ideasByGeographyId.get(geographyId) ?? 0) + 1);
      }
      for (const team of teams) {
        if (team.schoolId) teamsBySchoolId.set(team.schoolId, (teamsBySchoolId.get(team.schoolId) ?? 0) + 1);
      }

      const rosterWhere = await applyUserScoping(user);
      const rosterUsers = await prisma.user.findMany({
        where: rosterWhere,
        select: {
          id: true,
          displayName: true,
          email: true,
          role: true,
          schoolName: true,
          schoolId: true,
          geographyId: true,
          subGeographyId: true,
          geography: { select: { name: true } },
          subGeography: { select: { name: true, geography: { select: { name: true } } } },
          assignedSubGeos: { select: { subGeography: { select: { name: true } } } },
          assignedSchools: { select: { schoolId: true, school: { select: { name: true } } } },
        },
        orderBy: { displayName: 'asc' },
      });

      roster = rosterUsers.map((u) => {
        if (u.role === 'geography-lead') {
          const districtNames = u.assignedSubGeos.map((j) => j.subGeography.name);
          return {
            id: u.id,
            displayName: u.displayName,
            email: u.email,
            role: u.role,
            scopeLabel:
              districtNames.length > 0
                ? `${districtNames.join(', ')} (${u.geography?.name ?? 'state'})`
                : u.geography?.name ?? 'No geography assigned',
            ideaCount: u.geographyId ? ideasByGeographyId.get(u.geographyId) ?? 0 : 0,
            teamCount: 0,
          };
        }

        if (u.role === 'teacher-trainer') {
          return {
            id: u.id,
            displayName: u.displayName,
            email: u.email,
            role: u.role,
            scopeLabel: u.subGeography
              ? `${u.subGeography.name}, ${u.subGeography.geography?.name ?? ''}`.replace(/, $/, '')
              : 'No district assigned',
            ideaCount: u.subGeographyId ? ideasBySubGeoId.get(u.subGeographyId) ?? 0 : 0,
            teamCount: 0,
          };
        }

        // role === "school" (instructor) — one or several assigned schools.
        const schoolIds =
          u.assignedSchools.length > 0
            ? u.assignedSchools.map((a) => a.schoolId)
            : u.schoolId
              ? [u.schoolId]
              : [];
        const schoolNames =
          u.assignedSchools.length > 0
            ? u.assignedSchools.map((a) => a.school.name)
            : u.schoolName
              ? [u.schoolName]
              : [];

        return {
          id: u.id,
          displayName: u.displayName,
          email: u.email,
          role: u.role,
          scopeLabel: schoolNames.length > 0 ? schoolNames.join(', ') : 'No school assigned',
          ideaCount: schoolIds.reduce((sum, id) => sum + (ideasBySchoolId.get(id) ?? 0), 0),
          teamCount: schoolIds.reduce((sum, id) => sum + (teamsBySchoolId.get(id) ?? 0), 0),
        };
      });
    }

    // --- System health — super-admin only, real data only (record counts
    // + audit log), never fabricated uptime/error-rate metrics this app
    // has no telemetry to actually source.
    let systemHealth: unknown = undefined;
    if (user.role === 'super-admin') {
      const auditAction = request.nextUrl.searchParams.get('auditAction') || undefined;
      const auditEntityType = request.nextUrl.searchParams.get('auditEntityType') || undefined;
      const auditPage = Math.max(1, Number(request.nextUrl.searchParams.get('auditPage')) || 1);
      const pageSize = 20;

      const auditWhere = {
        ...(auditAction ? { action: auditAction } : {}),
        ...(auditEntityType ? { entityType: auditEntityType } : {}),
      };

      const [recordCounts, auditTotal, auditLog, auditByAction] = await Promise.all([
        Promise.all([
          prisma.user.count(),
          prisma.school.count(),
          prisma.idea.count(),
          prisma.studentTeam.count(),
          prisma.geography.count(),
          prisma.subGeography.count(),
          prisma.auditLog.count(),
        ]).then(([users, schools, ideasCount, teamsCount, geographies, subGeographies, auditLogCount]) => ({
          users,
          schools,
          ideas: ideasCount,
          teams: teamsCount,
          geographies,
          subGeographies,
          auditLogEntries: auditLogCount,
        })),
        prisma.auditLog.count({ where: auditWhere }),
        prisma.auditLog.findMany({
          where: auditWhere,
          orderBy: { createdAt: 'desc' },
          skip: (auditPage - 1) * pageSize,
          take: pageSize,
        }),
        prisma.auditLog.groupBy({
          by: ['action'],
          _count: { action: true },
          orderBy: { _count: { action: 'desc' } },
          take: 10,
        }),
      ]);

      systemHealth = {
        recordCounts,
        auditLog: { entries: auditLog, total: auditTotal, page: auditPage, pageSize },
        auditByAction: auditByAction.map((a) => ({ action: a.action, count: a._count.action })),
      };
    }

    // --- Activity Analytics ---
    const { applyActivityScoping, applySchoolScoping } = await import('@/lib/db/scoping');
    
    // Fetch all activities in scope
    const activityWhere = await applyActivityScoping(user);
    const activities = await prisma.themeActivity.findMany({
      where: activityWhere,
      select: { id: true, title: true, theme: true, geographyId: true },
    });

    // Fetch reports in scope. Super Admin / Program Lead see all. 
    // Others see reports from schools in their scope.
    let reportsWhere: any = {};
    const schoolsInScope = await prisma.school.findMany({
      where: applySchoolScoping(user),
      select: { name: true, subGeography: { select: { geography: { select: { name: true } } } } }
    });

    if (user.role !== 'super-admin' && user.role !== 'program-lead') {
      const allowedSchoolNames = schoolsInScope.map(s => s.name);
      reportsWhere.schoolName = { in: allowedSchoolNames };
    }

    const reports = await prisma.activityReport.findMany({
      where: reportsWhere,
      select: {
        id: true,
        schoolName: true,
        totalStudents: true,
        boysCount: true,
        girlsCount: true,
        studentEngagement: true,
        ideasGenerated: true,
      }
    });

    // Compute basic stats
    const engagementCount: Record<string, number> = { High: 0, Moderate: 0, Low: 0 };
    let studentsEngaged = 0;
    let ideasFromActivities = 0;

    for (const report of reports) {
      studentsEngaged += (report.totalStudents || 0);
      ideasFromActivities += (report.ideasGenerated || 0);
      
      const eng = report.studentEngagement || 'Moderate';
      if (engagementCount[eng] !== undefined) {
        engagementCount[eng]++;
      }
    }

    // Reports by Geography (only for Super Admin / Program Lead)
    let reportsByGeography: { geographyName: string; count: number }[] = [];
    if (user.role === 'super-admin' || user.role === 'program-lead') {
      const schoolToGeo = new Map<string, string>();
      for (const school of schoolsInScope) {
        if (school.subGeography?.geography?.name) {
          schoolToGeo.set(school.name, school.subGeography.geography.name);
        }
      }
      
      const geoCounts: Record<string, number> = {};
      for (const report of reports) {
        const geo = schoolToGeo.get(report.schoolName);
        if (geo) {
          geoCounts[geo] = (geoCounts[geo] || 0) + 1;
        }
      }

      reportsByGeography = Object.entries(geoCounts)
        .map(([geographyName, count]) => ({ geographyName, count }))
        .sort((a, b) => b.count - a.count);
    }

    const activityStats = {
      totalScheduled: activities.length,
      totalReported: reports.length,
      studentsEngaged,
      ideasFromActivities,
      engagementCount,
      reportsByGeography,
    };

    return NextResponse.json({ heatmap, roster, systemHealth, activityStats });
  } catch (error) {
    console.error('Failed to load analytics data:', error);
    return NextResponse.json({ error: 'Failed to load analytics data' }, { status: 500 });
  }
}
