import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Role } from "@/types";

export type SessionUser = {
  id: string;
  role: Role;
  displayName: string;
  schoolName?: string | null;
  teamId?: string | null;
  geographyId?: string | null;
  subGeographyId?: string | null;
  subGeographyIds?: string[];
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    role: session.user.role,
    displayName: session.user.displayName,
    schoolName: session.user.schoolName,
    teamId: session.user.teamId,
    geographyId: session.user.geographyId,
    subGeographyId: session.user.subGeographyId,
    subGeographyIds: session.user.subGeographyIds ?? [],
  };
}

export async function requireSession(): Promise<
  { user: SessionUser } | { error: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user };
}

export function requireRole(
  user: SessionUser,
  allowed: Role[]
): NextResponse | null {
  if (!allowed.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function assertSchoolScope(
  user: SessionUser,
  schoolName: string
): NextResponse | null {
  if (user.role === "super-admin" || user.role === "program-lead") return null;
  if (user.role === "school" && user.schoolName === schoolName) return null;
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function assertTeamScope(
  user: SessionUser,
  teamId: string
): NextResponse | null {
  if (user.role === "super-admin" || user.role === "program-lead") return null;
  if (user.role === "school") return null; // school owns all its teams; caller must additionally check schoolName
  if (user.role === "student" && user.teamId === teamId) return null;
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
