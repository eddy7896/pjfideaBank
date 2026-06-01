import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { rateLimit, ipFromRequest } from "@/lib/ratelimit";
import type { Role } from "@/types";

/**
 * Full NextAuth instance, Node runtime only. Providers use scrypt + Prisma
 * which cannot run on the Edge runtime that `middleware.ts` executes in,
 * so providers must live here, not in `auth.config.ts`.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "user-credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds, request) {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;

        const ip = ipFromRequest(request as Request);
        const gate = rateLimit(`login:user:${ip}:${email}`, 10, 15 * 60 * 1000);
        if (!gate.allowed) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            assignedSubGeos: { select: { subGeographyId: true } },
          },
        });
        if (!user || !user.passwordHash) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          role: user.role as Role,
          displayName: user.displayName,
          schoolName: user.schoolName,
          teamId: user.teamId,
          geographyId: user.geographyId,
          subGeographyId: user.subGeographyId,
          subGeographyIds: user.assignedSubGeos.map((j) => j.subGeographyId),
        };
      },
    }),
    Credentials({
      id: "student-credentials",
      name: "Team ID & PIN",
      credentials: {
        teamId: { label: "Team ID", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(creds, request) {
        const teamId = String(creds?.teamId ?? "").trim();
        const pin = String(creds?.pin ?? "").trim();
        if (!teamId || !pin) return null;

        const ip = ipFromRequest(request as Request);
        const gate = rateLimit(`login:student:${ip}:${teamId}`, 5, 15 * 60 * 1000);
        if (!gate.allowed) return null;

        const team = await prisma.studentTeam.findUnique({ where: { id: teamId } });
        if (!team) return null;

        let ok = false;
        if (team.pin.includes(":")) {
          ok = await verifyPassword(pin, team.pin);
        } else {
          ok = team.pin === pin;
        }
        if (!ok) return null;

        return {
          id: team.id,
          email: `${team.id}@team.local`,
          role: "student" as Role,
          displayName: team.name,
          schoolName: team.schoolName,
          teamId: team.id,
          teamType: team.type,
        };
      },
    }),
  ],
});
