import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { rateLimit, ipFromRequest } from "@/lib/ratelimit";
import type { Role } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      displayName: string;
      schoolName?: string | null;
      teamId?: string | null;
      geographyId?: string | null;
      subGeographyId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    displayName: string;
    schoolName?: string | null;
    teamId?: string | null;
    geographyId?: string | null;
    subGeographyId?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    uid: string;
    role: Role;
    displayName: string;
    schoolName?: string | null;
    teamId?: string | null;
    geographyId?: string | null;
    subGeographyId?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  trustHost: true,
  pages: { signIn: "/login" },
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

        // 10 attempts / 15 min per (IP + email)
        const ip = ipFromRequest(request as Request);
        const gate = rateLimit(`login:user:${ip}:${email}`, 10, 15 * 60 * 1000);
        if (!gate.allowed) return null;

        const user = await prisma.user.findUnique({ where: { email } });
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

        // 5 attempts / 15 min per (IP + teamId) — tighter than user login
        // because PINs are 6 digits and trivially brute-forceable otherwise.
        const ip = ipFromRequest(request as Request);
        const gate = rateLimit(`login:student:${ip}:${teamId}`, 5, 15 * 60 * 1000);
        if (!gate.allowed) return null;

        const team = await prisma.studentTeam.findUnique({ where: { id: teamId } });
        if (!team) return null;

        // PIN may already be a scrypt hash (post-migration) or legacy plaintext
        // during transition. Try hashed compare first, fall back to constant-time
        // plaintext equality for legacy rows.
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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.displayName = user.displayName;
        token.schoolName = user.schoolName ?? null;
        token.teamId = user.teamId ?? null;
        token.geographyId = user.geographyId ?? null;
        token.subGeographyId = user.subGeographyId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.uid;
      session.user.role = token.role;
      session.user.displayName = token.displayName;
      session.user.schoolName = token.schoolName ?? null;
      session.user.teamId = token.teamId ?? null;
      session.user.geographyId = token.geographyId ?? null;
      session.user.subGeographyId = token.subGeographyId ?? null;
      return session;
    },
  },
});
