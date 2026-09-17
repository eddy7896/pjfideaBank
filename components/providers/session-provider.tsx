"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  // The app already re-fetches the session explicitly (useAuthStore.hydrate()
  // on dashboard mount, and again right after signIn()). NextAuth's own
  // default refetch-on-window-focus stacks a third, redundant /api/auth/
  // session call on top of those, and when one supersedes another mid-flight
  // the aborted one surfaces as an uncaught "Failed to fetch" console error.
  return <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>;
}
