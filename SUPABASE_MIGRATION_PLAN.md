# Migration Plan: Prisma+Connection-String → Supabase Auth + RLS

## Read this first

There are two different things "switch to secret/publish/anon/service-role keys" could mean, and they land at completely different places:

**Path A — the keys actually do something.** You adopt Supabase Auth (GoTrue) as the identity system, write Row-Level-Security policies that replicate `lib/db/scoping.ts`'s role logic in SQL, and the anon/publishable key becomes meaningful because RLS is enforcing access per-request. This is a genuine architecture change: new identity system, new authorization model, every query rewritten. Realistic estimate: **3-5 weeks** solo.

**Path B — swap the client library, keep everything else.** You keep NextAuth exactly as it is, and just replace `import { prisma }` with a `supabase-js` client authenticated via the `service_role` key. This compiles and "uses the keys" in a literal sense, but `service_role` **bypasses RLS entirely** — so this delivers zero security benefit over today's connection-string setup, while costing you Prisma's type safety, `include`-based joins, and `$transaction`, replaced by a weaker, hand-typed query builder. **This is not worth doing.** It's the same database access, wrapped in a worse API.

This plan is written for **Path A**, since that's the only version of "complete migration" where the keys mean anything. Flagging the fork here because it changes the estimate by an order of magnitude, and I don't want to start Phase 1 on an assumption you haven't actually confirmed.

**My recommendation, stated plainly:** don't do this. The browser in this app never talks to the database directly — every request is mediated by a Next.js API route. RLS's main value is protecting a database that untrusted clients hit directly (a mobile app using `supabase-js` from the device, e.g.). Here, the two real RBAC gaps that exist (`activity-reports` GET, idea `timeline` GET — both flagged earlier, both unscoped-query bugs) are fixable in the current Prisma code in about 30 minutes each. Path A spends 3-5 weeks rebuilding a system that, once those two routes are fixed, is already doing the job RLS would do — just in TypeScript instead of SQL, with compile-time checking SQL policies don't give you.

If there's a specific driver behind this (a compliance requirement mandating RLS, a future mobile/direct-client app that will bypass your API routes, something else) — say what it is and the plan below can be scoped tighter around that actual need. Otherwise, the plan is here if you want to proceed anyway.

---

## Current architecture (what's being replaced)

- **Identity**: NextAuth v5, JWT session strategy, two `Credentials` providers — staff (email+password, scrypt hash) and student (Team ID + PIN, scrypt hash)
- **Data access**: Prisma Client → Postgres via `DATABASE_URL`/`DIRECT_URL` connection strings
- **Authorization**: 100% in application code — `lib/permissions.ts` (client-side UI gating), `lib/db/scoping.ts` (server-side query `where`-clause construction per role), per-route `requireRole`/`requireSession` checks in `lib/auth/session.ts`
- **Surface**: 23 API routes (`app/api/**/route.ts`), 12 Prisma models (see `DATABASE.md`)

---

## Phase 1 — Identity migration (NextAuth → Supabase Auth)

**Staff accounts (email + password)**
- Move into `auth.users` (Supabase's built-in table). Supabase Auth hashes passwords with bcrypt via GoTrue — your existing scrypt hashes (`lib/auth-utils.ts`) **cannot be reused directly**. Every existing staff account needs a forced password reset (or a one-time migration script that creates the `auth.users` row and immediately triggers a reset-password email — there is no way to carry over a working password silently across hash schemes).
- App-specific fields (`role`, `schoolId`, `geographyId`, `subGeographyId`, `assignedLeadUserId`) don't fit in `auth.users`. Add a `profiles` table keyed by `auth.users.id` (uuid) holding these — RLS policies read from it via `(select role from profiles where id = auth.uid())`.

**Student accounts (Team ID + PIN)**
- No standard Supabase Auth strategy covers this. Two options, neither clean:
  1. A Next.js API route verifies the PIN server-side (using the `service_role` key, bypassing RLS for this one check), then manually mints a Supabase-compatible JWT signed with the project's JWT secret, representing that student's session.
  2. Treat each `StudentTeam` as a synthetic Supabase Auth user (fake email like `TM-DEMO01@team.local`, already the pattern in `auth.ts`) and use `signInWithPassword` under the hood via a service-role-brokered call.
- This is the least standard part of the whole migration — there's no Supabase-blessed pattern for "PIN, not password, not email-based" auth. Budget real design time here, not just implementation time.

**Files rewritten**: `auth.ts`, `auth.config.ts`, `middleware.ts`, `store/use-auth-store.ts`, `lib/auth-utils.ts` (retired), `app/login/page.tsx` (session handling changes).

---

## Phase 2 — RLS policy design

- Add `profiles` table, migrate `User` → `profiles` (int id → uuid mapping needed; `User.id` is currently `Int @id @default(autoincrement())`, Supabase Auth uses `uuid`).
- Enable RLS on every table: `ALTER TABLE "Idea" ENABLE ROW LEVEL SECURITY;` etc.
- Translate `lib/db/scoping.ts`'s per-role logic into SQL policies, one set per table. The `Idea` table alone needs ~6 policies (one per role's read scope, several with subqueries into `School`/`SubGeography`/`Geography` joins, one with an additional `status IN ('Prototype','Test')` filter for `sed-department`). Same exercise repeats for `StudentTeam`, `School`, `ActivityReport`, `TimelineEvent`, `ThemeActivity`, `AuditLog`.
- This is genuinely hard to get right the first time — a too-loose policy is a silent data leak (School A reads School B's data), a too-tight policy is a silent 403 nobody notices until a real user hits it. Both classes of bug are harder to catch than the equivalent Prisma `where`-clause bug, because there's no TypeScript compiler checking a SQL policy string.

---

## Phase 3 — Data layer rewrite (Prisma → supabase-js)

- Replace `lib/prisma.ts` with `lib/supabase/server.ts` (RLS-respecting client, using the user's session) and `lib/supabase/admin.ts` (`service_role` client, used *only* where RLS must be bypassed on purpose — auth-time password checks, auto-provisioning during onboarding before a session exists).
- Rewrite all 23 routes' queries from Prisma's typed fluent API to `supabase-js`'s `.from(table).select()/.insert()/.update()/.delete()`. Lose Prisma's `include` (nested relation fetching) — replace with either manual sequential queries, Postgres views, or `.select('*, timeline(*)')`-style embedded resource syntax (supabase-js supports this, but it's less type-safe and doesn't handle every relation shape Prisma does).
- `lib/db/repositories.ts` and `lib/db/scoping.ts` become largely dead code — the ~80 lines of `where`-clause building in `scoping.ts` get deleted, replaced by RLS doing the same job invisibly. Net simplification *if* the policies are right; net opacity if you ever need to debug why a query returned the wrong rows (no `console.log`-able `where` object anymore, it's inside Postgres).
- Multi-statement transactions (idea creation + auto-team-provisioning in `POST /api/ideas`, PIN reset + member replace in `PUT /api/teams/[id]`) lose Prisma's `$transaction`. Rewrite as Postgres RPC functions (`supabase.rpc('create_idea_with_team', {...})`) for atomicity, or accept non-atomic sequential calls with manual compensating logic on partial failure.

---

## Phase 4 — Validation & error handling

Largely unaffected — the zod schemas in every route stay as-is regardless of which client executes the query underneath.

---

## Phase 5 — Testing

- Existing 22 unit tests (`tests/unit/`) need updating wherever they touch `lib/permissions.ts`/`lib/db/scoping.ts` logic that's moving into SQL.
- New surface that doesn't exist today: an RLS policy test matrix — 7 roles × 12 tables × read/write, verifying each policy actually enforces what it's supposed to. This is the most important new test investment, since a wrong policy is a silent security hole, not a failing build.
- Full E2E re-verification: both login flows, onboarding, idea lifecycle (submit → stage docs → advance request → approve/reject), analytics scoping per role.

---

## Phase 6 — Cutover

- Data migration script: map every existing `User.id` (int) to a new `auth.users.id` (uuid), backfill `profiles`.
- Env vars: add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `PUBLISHABLE_KEY` on newer Supabase projects), `SUPABASE_SERVICE_ROLE_KEY` (or `SECRET_KEY`). `DATABASE_URL`/`DIRECT_URL` can stay for one-off `psql`/admin access even after the app stops using Prisma at runtime.
- Rollback plan: keep the current Prisma+connection-string code on a branch until Path A is verified in production — once RLS is enabled and staff are forced through password reset, there's no clean way back without another forced reset.

---

## Effort & risk summary

| | |
|---|---|
| Estimated effort | 3-5 weeks solo, not counting the student-PIN-auth design work, which has no existing pattern to copy |
| Files touched | ~30+ (every API route, all of `lib/db/`, `lib/auth*`, `auth.ts`/`auth.config.ts`, `middleware.ts`, every store that calls `fetch` against these routes stays the same — routes' internals change, not their contracts, which limits blast radius on the frontend) |
| New failure mode | Silent RLS policy bugs — no compiler catches a wrong SQL policy the way `tsc` catches a wrong Prisma `where` clause |
| Security benefit given current architecture | Marginal — there's no untrusted direct-DB client today; the browser only ever talks to your own API routes |
| Fixes the two known RBAC gaps? | Not by itself — those need fixing either way, in Prisma today or in RLS policies under this plan; migrating doesn't fix them for free |

---

*If you want to proceed with Path A, tell me and I'll turn Phase 1 into an actual execution plan (specific files, specific order, specific commits) rather than this overview. If the real goal is closing the two RBAC gaps, say so instead — that's a same-day fix in the current code.*
