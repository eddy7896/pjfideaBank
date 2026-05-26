import type { NextAuthConfig } from "next-auth";
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
      subGeographyIds?: string[];
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    displayName: string;
    schoolName?: string | null;
    teamId?: string | null;
    geographyId?: string | null;
    subGeographyId?: string | null;
    subGeographyIds?: string[];
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
    subGeographyIds?: string[];
  }
}

/**
 * Edge-runtime-safe NextAuth config. Imported by both `auth.ts` (Node
 * runtime, full providers + scrypt verify) and `middleware.ts` (Edge
 * runtime, no Node `crypto`). The providers list intentionally stays
 * empty here so the Edge bundle never pulls in `verifyPassword` /
 * `prisma`.
 */
export default {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [],
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
        token.subGeographyIds = user.subGeographyIds ?? [];
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
      session.user.subGeographyIds = token.subGeographyIds ?? [];
      return session;
    },
  },
} satisfies NextAuthConfig;
