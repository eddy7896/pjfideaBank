/**
 * Enforces vertical and horizontal data-isolation (multi-tenancy)
 * by applying role-based where constraints on queries.
 */
export function applyRoleScoping(user: { role: string; schoolName?: string; teamId?: string; geographyId?: string; subGeographyId?: string }, baseWhere: any = {}) {
  const where = { ...baseWhere };

  switch (user.role) {
    case "super-admin":
    case "program-lead":
      // Global: View everything
      break;

    case "geography-lead":
      // Scoped to designated State (geographyId)
      where.school = {
        subGeography: {
          geographyId: user.geographyId
        }
      };
      break;

    case "sed-department":
      // Scoped to designated State + read-only on advanced gates (Prototype & Test)
      where.school = {
        subGeography: {
          geographyId: user.geographyId
        }
      };
      where.status = {
        in: ["Prototype", "Test"]
      };
      break;

    case "teacher-trainer":
      // Scoped to managed districts (subGeographyId)
      where.school = {
        subGeographyId: user.subGeographyId
      };
      break;

    case "school":
      // Scoped to own institution
      where.schoolName = user.schoolName;
      break;

    case "student":
      // Scoped to own student team workspace
      where.teamId = user.teamId;
      break;

    default:
      // Restrict access entirely
      where.id = "DENIED_BY_SCOPING_RULE";
      break;
  }

  return where;
}
