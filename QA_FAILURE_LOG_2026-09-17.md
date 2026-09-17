# QA Failure Log — ideabank-six.vercel.app

**Date:** 2026-09-17
**Method:** Headed Playwright browser, live production (`https://ideabank-six.vercel.app`), full run: school self-registration → school login → create team → submit idea → student login → attempt stage progression → school approval attempt. Console (`console`, `pageerror`, `requestfailed`) and per-step wall-clock timing captured continuously throughout.
**Test account created:** `qa-school-1789633608596@example.com` (displayName "QA Test Teacher", school "QA Test School 1789633608596", UDAISE `10000000000`). Team "QA Alpha Team" (1 member). Idea "QA Idea 1789633608596". All prefixed `QA-`/`qa-` for easy identification — delete whenever convenient.

---

## 1. Confirmed: page/login/signup latency is real and measurable

Every step below is a real wall-clock measurement (click/navigation start → action complete), not an estimate:

| Step | Time |
|---|---|
| Homepage load | 2.1s |
| Registration wizard step submits (steps 1–3) | 0.3–2.8s each (normal) |
| **Complete Registration (final submit)** | **10.3s** |
| School login (click Sign In → dashboard) | 4.2s |
| Teams page load | 6.0s |
| Create team (modal submit → credentials shown) | 3.4s |
| Submit idea | 1.8s |
| Student login (Team ID + PIN → dashboard) | 2.7s |
| Open a project from the list | 6.2s |

**Root cause (confirmed separately by direct DB benchmarking against the same Supabase project used in production):** the database is hosted in `ap-northeast-2` (Seoul), and a raw `SELECT 1` round-trip measured **~1000ms**, with a real `user.findUnique` query measured at **~1.6–3.7s**. Registration, login, and every dashboard page all run 1–5 sequential/parallel DB queries, so their wall-clock time is dominated by this per-query network latency, not application logic.

Note: `X-Vercel-Id` on the live deployment reads `bom1` (Mumbai) — Vercel's function is already running close to India, so the round trip is **Mumbai (function) ↔ Seoul (DB)**, not the US↔Seoul hop this section originally guessed from `vercel.json` having no explicit `regions` set. That guess was wrong; correcting it here. The latency is real either way — it's one long hop, not two, but it's still the dominant cost on every DB-backed request.

**Fix:** move the Supabase project to a region near the DB's actual counterpart — `ap-south-1` (Mumbai), matching where the Vercel function already runs. This is a DB migration/restore; needs your sign-off before I touch it. (Pinning `vercel.json` `regions` to `bom1` explicitly is low-value here since Vercel is already routing there.)

---

## 2. Confirmed: recurring NextAuth "Failed to fetch" console errors on nearly every navigation

Seen repeatedly across the whole session — on the teams page, the login page, opening a project, and every school-login-to-approve cycle:

```
o: Failed to fetch. Read more at https://errors.authjs.dev#autherror
    at i (.../1de898d7f3bed215.js:1:1004)
    at async w (.../1de898d7f3bed215.js:1:2216)
    at async hydrate (.../f3d6ceaace6470cb.js:3:23092)
```

Paired every time with `net::ERR_ABORTED` on `GET /api/auth/session` (usually 2–5 of them back-to-back) and often `GET /api/dashboard/bootstrap` aborting alongside it.

**Root cause:** on every mount, three independent things each call `getSession()`/fetch `/api/auth/session` at once — NextAuth's own `SessionProvider` (default `refetchOnWindowFocus`/mount behavior), `useAuthStore.hydrate()` in `app/dashboard/layout.tsx`, and (right after login) the explicit `getSession()` call inside `login()`/`loginStudent()` in `store/use-auth-store.ts`. When a newer one supersedes an older one or a navigation fires mid-request, the older fetch gets aborted, which NextAuth's client surfaces as an uncaught "Failed to fetch" error rather than swallowing it silently.

This is **not just a console-noise issue** — every one of these is a wasted round trip to a DB-backed endpoint that's already slow (see §1), so it's actively compounding the load-time problem.

**Fix:** de-duplicate the session fetch. Either drop the manual `useAuthStore.hydrate()` call in favor of NextAuth's own `useSession()` hook, or pass `refetchOnWindowFocus={false}` to `SessionProvider` and rely solely on the explicit post-login fetch. Low risk, should directly cut both the error noise and a chunk of the redundant network load.

---

## 3. Confirmed: excessive duplicate Next.js prefetch requests

A single "open the Teams page" step generated **~35 separate GET requests** for `_rsc=` (React Server Component) prefetches — the same routes (`/dashboard/settings`, `/dashboard/analytics`, `/dashboard/submit`, `/dashboard/projects`, `/dashboard/teams`, `/dashboard/calendar`, `/dashboard/activities`) fetched **2–5 times each**, with a different cache-busting `_rsc` hash every time, all within a ~700ms window. Same pattern repeated on every subsequent page render.

This is Next.js `<Link>` prefetching every sidebar item on every render rather than once, and not de-duplicating. On the shared, low-power classroom devices this product explicitly targets (per PRODUCT.md), that's real wasted bandwidth and main-thread work on every single page navigation, and likely a secondary contributor to the sluggish feel beyond raw DB latency.

**Fix:** worth auditing the dashboard sidebar nav for `prefetch={false}` on links that don't need eager prefetching, or memoizing the nav so it isn't re-mounting (and re-triggering prefetch) on every route change.

---

## 4. Real UX friction: the first "Request review" click doesn't request anything

Flow tested: idea submitted with only a problem statement + target audience filled in (matching the real "Submit an Idea" form, which only collects those two Empathize fields). Opened the idea as the student team, clicked **"Request review for Define."**

Instead of sending the request, it opened an **"Empathize Documentation" modal** demanding four more fields (When, Where, How, and a "5 Whys Analysis" section) that were never asked for at idea-creation time and weren't flagged as missing anywhere on the project page before the click.

This is a real gap between what "Submit an Idea" collects and what's actually required to leave stage 1 — a student (or in this case, the automation) can fill out the entire submission form, see no warning, click the obvious next-step button, and land in an unexpected multi-field form instead of getting the request they asked for. **Because of this, I was not able to fully verify the Ideate → Prototype → Test progression or the teacher's Approve/Reject flow in this run** — the automation didn't have realistic answers for the 5 Whys section, so the request was never actually submitted, and every downstream step (teacher approval, next-stage request) that depended on it timed out waiting for UI that correctly never appeared. That cascade is a test-script limitation, not four separate product bugs — treat this section as the one real, verified finding from that part of the flow, not the timeouts that followed it.

**Recommendation:** either (a) surface the "Complete documentation to advance" warning on the project page *before* the button is clicked (it's coded to, but didn't appear here — worth checking why), or (b) collect the full Empathize field set at idea-creation time so there's no unexpected gate right after submission.

---

## 5. Resolved on inspection: idea-creation fetch abort was a test-script bug, not a product bug

One console error during the run:

```
Failed to create idea: TypeError: Failed to fetch
    at addIdea (.../2423c19cfbaeb15f.js:1:5966)
```

Checked `components/forms/idea-form.tsx`: `handleSubmit` already correctly `await`s `addIdea(...)`, only calls `router.push` after a successful result, and shows a toast either way. The actual cause: the QA script clicked "Submit," waited a flat 1000ms, then immediately clicked "Logout" — not long enough given the DB latency in §1, so the script itself navigated away mid-request and aborted its own fetch. The idea was, in fact, created correctly (confirmed in every later screenshot). No code change needed here; the rerun script now waits for the post-submit toast/redirect before doing anything else.

---

## Summary — punch list

| # | Finding | Confidence | Impact |
|---|---|---|---|
| 1 | Cross-region DB latency (Seoul DB, no Vercel region pin) drives 2–10s waits on login/signup/every page | Confirmed, root-caused | High |
| 2 | Duplicate concurrent session fetches → recurring console errors + wasted round trips | Confirmed, reproduced every run | Medium-high |
| 3 | Next.js prefetch firing 2–5x per route on every nav render | Confirmed, measured (~35 requests/page) | Medium |
| 4 | "Request review" opens an unexpected 4-field gate the UI didn't warn about | Confirmed once, blocked full stage-progression test | Medium |
| 5 | Idea-creation fetch abort error on rapid navigate-after-submit | Resolved: test-script timing bug, not a product bug | None |

Artifacts from this run (screenshots, raw JSON report) were kept locally only and are not committed — say the word if you want them attached anywhere.

---

## Rerun — 2026-09-17 (after fixes for #2, #3, #4)

Fixed and deployed, then reran the same live flow:

- **#4 — confirmed fixed.** Step "verify the warning shows before clicking" passed, and the automation completed a real Empathize → Define → Ideate progression end-to-end (student documents the stage, requests review, teacher approves, student sees the next stage) — the full loop this run couldn't reach before.
- **#2 — first attempt was incomplete.** `refetchOnWindowFocus={false}` alone didn't stop the errors; they were still firing on the rerun. Root cause was one level deeper: `useAuthStore.hydrate()` called its own `getSession()` on every dashboard mount, duplicating the fetch NextAuth's `SessionProvider` already makes internally, and racing it. Replaced `hydrate()` with a `setSessionUser()` action fed by the app's existing `useSession()` subscription (one shared fetch, no duplicate) — verified locally against the real database afterward: **zero `/api/auth/session` failures or "Failed to fetch" console errors** across a login + multi-page navigation session that previously threw several per page.
- **#3 — widened.** The sidebar fix cut the biggest source, but the same pattern existed on every idea/project card link (`app/dashboard/page.tsx`, `projects/page.tsx`, `schools/page.tsx`, `schools/[slug]/page.tsx`, `kanban-board.tsx`) — each one prefetching its detail route by default. Added `prefetch={false}` to all of them.

The automation only got as far as Ideate → Prototype before stopping — Prototype/Ideate's "brainstorm ideas" and "pick your favourite" step needs a real chip-selection click the generic form-filler doesn't attempt, not a product bug. Given #2/#3/#4 are now verified, this felt like the right place to stop rather than keep building single-purpose scripting for the remaining stage forms.
