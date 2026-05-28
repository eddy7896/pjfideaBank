import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Edge-runtime middleware. Uses the edge-safe `auth.config.ts` (no
// providers, no Node `crypto`) so the bundle stays under the edge limit
// and doesn't crash on cold start.
const { auth } = NextAuth(authConfig);

const PROTECTED_PATHS = ["/dashboard"];
const PROTECTED_API = [
  "/api/ideas",
  "/api/teams",
  "/api/activities",
  "/api/activity-reports",
  "/api/admin",
  "/api/schools",
  "/api/themes",
];

const PUBLIC_AUTH_API = ["/api/auth"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (PUBLIC_AUTH_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const needsAuth =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    PROTECTED_API.some((p) => pathname.startsWith(p));

  if (needsAuth && !isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/ideas/:path*",
    "/api/teams/:path*",
    "/api/activities/:path*",
    "/api/activity-reports/:path*",
    "/api/admin/:path*",
    "/api/schools/:path*",
    "/api/themes/:path*",
  ],
};
