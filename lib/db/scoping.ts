import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth/session";

/**
 * Build a Prisma where-clause that scopes Idea queries to the session user's
 * tenancy. Reads identity from the verified session — never from request
 * headers or query params.
 */
export function applyIdeaScoping(user: SessionUser, baseWhere: any = {}) {
  const where: any = { ...baseWhere };

  switch (user.role) {
    case "super-admin":
    case "program-lead":
      break;

    case "geography-lead":
      // If the GL was assigned specific districts, scope to those;
      // otherwise fall back to state-wide visibility.
      if (user.subGeographyIds && user.subGeographyIds.length > 0) {
        where.school = { subGeographyId: { in: user.subGeographyIds } };
      } else {
        where.school = { subGeography: { geographyId: user.geographyId } };
      }
      break;

    case "sed-department":
      where.school = { subGeography: { geographyId: user.geographyId } };
      where.status = { in: ["Prototype", "Test"] };
      break;

    case "teacher-trainer":
      where.school = { subGeographyId: user.subGeographyId };
      break;

    case "school":
      // Multi-school instructor accounts (UserSchool join, resolved onto
      // the session as schoolIds) are scoped by the real FK; a legacy
      // single-school account without join rows falls back to schoolName.
      if (user.schoolIds && user.schoolIds.length > 0) {
        where.schoolId = { in: user.schoolIds };
      } else {
        where.schoolName = user.schoolName;
      }
      break;

    case "student":
      where.teamId = user.teamId;
      break;

    default:
      where.id = "DENIED_BY_SCOPING_RULE";
      break;
  }

  return where;
}

/**
 * Same shape as applyIdeaScoping but for the StudentTeam model.
 * Team has no `school.subGeography` join in current schema — geo/sub-geo roles
 * see all teams under schools matching their territory via the `schoolName`
 * → School relation.
 */
export function applyTeamScoping(user: SessionUser, baseWhere: any = {}) {
  const where: any = { ...baseWhere };

  switch (user.role) {
    case "super-admin":
    case "program-lead":
      break;

    case "geography-lead":
      if (user.subGeographyIds && user.subGeographyIds.length > 0) {
        where.school = { subGeographyId: { in: user.subGeographyIds } };
      } else {
        where.school = { subGeography: { geographyId: user.geographyId } };
      }
      break;

    case "sed-department":
      where.school = { subGeography: { geographyId: user.geographyId } };
      break;

    case "teacher-trainer":
      where.school = { subGeographyId: user.subGeographyId };
      break;

    case "school":
      if (user.schoolIds && user.schoolIds.length > 0) {
        where.schoolId = { in: user.schoolIds };
      } else {
        where.schoolName = user.schoolName;
      }
      break;

    case "student":
      where.id = user.teamId;
      break;

    default:
      where.id = "DENIED_BY_SCOPING_RULE";
      break;
  }

  return where;
}

/**
 * Scoping for the School model itself. Extracted from app/api/schools so
 * it can be reused by the dashboard bootstrap endpoint without a second
 * copy of this switch drifting out of sync.
 */
export function applySchoolScoping(user: SessionUser): any {
  switch (user.role) {
    case "super-admin":
    case "program-lead":
      return {};

    case "geography-lead":
      if (user.subGeographyIds && user.subGeographyIds.length > 0) {
        return { subGeographyId: { in: user.subGeographyIds } };
      }
      return user.geographyId
        ? { subGeography: { geographyId: user.geographyId } }
        : { id: "__none__" };

    case "sed-department":
      return user.geographyId
        ? { subGeography: { geographyId: user.geographyId } }
        : { id: "__none__" };

    case "teacher-trainer":
      return user.subGeographyId
        ? { subGeographyId: user.subGeographyId }
        : { id: "__none__" };

    case "school":
      if (user.schoolIds && user.schoolIds.length > 0) {
        return { id: { in: user.schoolIds } };
      }
      return user.schoolName ? { name: user.schoolName } : { id: "__none__" };

    case "student":
      return user.schoolName ? { name: user.schoolName } : { id: "__none__" };

    default:
      return { id: "__none__" };
  }
}

/**
 * Scoping for ThemeActivity. Global (schoolName: null) activities are
 * always visible; school-specific ones are filtered by the same
 * geography/district territory used everywhere else. Async because
 * resolving a geo/district territory to activities requires an
 * intermediate School lookup — there's no direct FK from ThemeActivity
 * to School to join through.
 */
export async function applyActivityScoping(user: SessionUser): Promise<any> {
  if (user.role === "super-admin" || user.role === "program-lead") {
    return {};
  }

  // Find the geographyId of the user's school if they are a school/student
  let geographyId = user.geographyId ?? null;
  let subGeographyId = user.subGeographyId ?? null;

  if (user.role === "school" || user.role === "student") {
    const schoolNames = user.role === "school" && user.schoolIds && user.schoolIds.length > 0
      ? await prisma.school.findMany({ where: { id: { in: user.schoolIds } }, select: { name: true, subGeography: true } })
      : await prisma.school.findMany({ where: { name: user.schoolName ?? "" }, select: { name: true, subGeography: true } });
    
    // We want activities where geographyId is null (system wide) or geographyId matches the school's geography
    const geos = new Set<string>();
    const subGeos = new Set<string>();
    const names = new Set<string>();

    for (const s of schoolNames) {
      if (s.name) names.add(s.name);
      if (s.subGeography) {
        geos.add(s.subGeography.geographyId);
        subGeos.add(s.subGeography.id);
      }
    }

    return {
      OR: [
        { geographyId: null, schoolName: null }, // System wide or legacy global
        { geographyId: { in: Array.from(geos) } }, // New geo scoping
        { schoolName: { in: Array.from(names) } }, // Legacy school scoping
      ]
    };
  }

  if (
    user.role === "geography-lead" ||
    user.role === "teacher-trainer" ||
    user.role === "sed-department"
  ) {
    const geos = [user.geographyId].filter(Boolean);
    const subGeos = user.subGeographyIds && user.subGeographyIds.length > 0 
      ? user.subGeographyIds 
      : [user.subGeographyId].filter(Boolean);

    let schoolGeoWhere: any = {};
    if (user.role === "geography-lead") {
      schoolGeoWhere =
        user.subGeographyIds && user.subGeographyIds.length > 0
          ? { subGeographyId: { in: user.subGeographyIds } }
          : { subGeography: { geographyId: user.geographyId } };
    } else if (user.role === "teacher-trainer") {
      schoolGeoWhere = { subGeographyId: user.subGeographyId };
    } else {
      schoolGeoWhere = { subGeography: { geographyId: user.geographyId } };
    }

    const schools = await prisma.school.findMany({
      where: schoolGeoWhere,
      select: { name: true },
    });
    const schoolNames = schools.map((s) => s.name);

    return { 
      OR: [
        { geographyId: null, schoolName: null },
        { geographyId: { in: geos as string[] } },
        { schoolName: { in: schoolNames } }
      ] 
    };
  }

  return { geographyId: null, schoolName: null };
}

/**
 * Scoping for the User model — powers the staff roster on the analytics
 * dashboard (which teacher-trainers and instructors report into a given
 * geography-lead's or teacher-trainer's scope). Async for the same reason
 * as applyActivityScoping: resolving "which schools are in my territory"
 * needs an intermediate School lookup. Only roles that manage staff below
 * them get a meaningful result; everyone else is fail-closed.
 */
export async function applyUserScoping(user: SessionUser): Promise<any> {
  switch (user.role) {
    case "super-admin":
    case "program-lead":
      return { role: { in: ["geography-lead", "teacher-trainer", "school"] } };

    case "geography-lead": {
      const inDistricts = Boolean(user.subGeographyIds && user.subGeographyIds.length > 0);
      const districtWhere: any = inDistricts
        ? { subGeographyId: { in: user.subGeographyIds } }
        : { subGeography: { geographyId: user.geographyId } };

      const teacherTrainerWhere: any = { role: "teacher-trainer" };
      if (inDistricts) teacherTrainerWhere.subGeographyId = { in: user.subGeographyIds };
      else teacherTrainerWhere.geographyId = user.geographyId;

      const schools = await prisma.school.findMany({ where: districtWhere, select: { id: true } });
      const schoolIds = schools.map((s) => s.id);

      const instructorWhere = {
        role: "school",
        OR: [
          { assignedSchools: { some: { schoolId: { in: schoolIds } } } },
          { schoolId: { in: schoolIds } },
        ],
      };

      return { OR: [teacherTrainerWhere, instructorWhere] };
    }

    case "teacher-trainer": {
      const schools = await prisma.school.findMany({
        where: { subGeographyId: user.subGeographyId ?? "__none__" },
        select: { id: true },
      });
      const schoolIds = schools.map((s) => s.id);

      return {
        role: "school",
        OR: [
          { assignedSchools: { some: { schoolId: { in: schoolIds } } } },
          { schoolId: { in: schoolIds } },
        ],
      };
    }

    default:
      // School/student/sed-department accounts don't manage staff below
      // them — no roster to show. -1 never matches a real (autoincrement)
      // user id, so this fails closed rather than throwing.
      return { id: -1 };
  }
}
