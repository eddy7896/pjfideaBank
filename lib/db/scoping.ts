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
