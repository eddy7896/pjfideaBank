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
      where.schoolName = user.schoolName;
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
      where.schoolName = user.schoolName;
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

  if (user.role === "school") {
    return { OR: [{ schoolName: null }, { schoolName: user.schoolName }] };
  }

  if (
    user.role === "geography-lead" ||
    user.role === "teacher-trainer" ||
    user.role === "sed-department"
  ) {
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

    return { OR: [{ schoolName: null }, { schoolName: { in: schoolNames } }] };
  }

  return { schoolName: null };
}
