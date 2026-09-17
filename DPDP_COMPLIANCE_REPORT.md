# DPDP Act Compliance Report — Ideabank by PiJam

**Date:** 2026-09-17
**Scope:** `pijam-ideabank` production application (`https://ideabank-six.vercel.app`), covering the public marketing site, school/staff/student authentication, and the Design Thinking tracking dashboard.
**Law:** Digital Personal Data Protection Act, 2023 (DPDP Act), India. Rules under the Act are being phased in; this report is written so implementation can proceed now and be tightened as final rules land, rather than waiting.

This is an implementation-facing report, not a public legal document — it maps DPDP obligations directly onto this codebase's actual data model (`prisma/schema.prisma`) and flows, and lists concrete engineering + operational work. The public-facing Privacy Policy (`/privacy`) and Terms of Service (`/terms`) shipped alongside this report are the user-facing counterpart; this document is what closes the gap between "policy says X" and "the system actually does X."

---

## 1. Role under the Act

Pi Jam Foundation is the **Data Fiduciary** for all personal data processed through Ideabank — it determines the purpose and means of processing, even though individual schools are the point of collection for student data. Schools act as an intermediary collection point but do not independently control the processing system, so they are not a separate Data Fiduciary for this analysis; Pi Jam carries the compliance obligation end to end.

**Significant Data Fiduciary (SDF) status:** not yet applicable — SDF thresholds (notified by the Central Government based on volume/sensitivity of data processed) are not published against Ideabank's current scale. Re-check this when the government notifies SDF thresholds, since SDF status adds obligations (mandatory DPO, independent data audits, Data Protection Impact Assessments).

---

## 2. Data inventory (from the actual schema)

Derived directly from `prisma/schema.prisma`, not from assumption:

| Model | Personal data fields | Data Principal | Sensitivity |
|---|---|---|---|
| `School` | `phone`, `address`, `principalName`, `udaiseCode` | Institution / principal (natural person) | Standard |
| `User` | `displayName`, `email`, `passwordHash` | School Admin, Teacher Trainer, Geography Lead, Programme Lead, SED observer | Standard, credential-adjacent |
| `TeamMember` | `name`, `grade`, `contactNumber`, `gender` | **Student, typically a minor** | **Child's data — highest obligation tier** |
| `StudentTeam` | `pin` | Shared team credential (not individually identifying) | Low |
| `Idea` / `TimelineEvent` | Free-text stage documentation, may incidentally contain names/details students write in | Student team | Standard, user-generated |
| `AuditLog` | `actorEmail`, `ip`, `payload` (JSON, may embed request data) | Staff/admin actors | Standard, security-purpose |

**The one field that needs the most attention:** `TeamMember.contactNumber`. This is a phone number tied to a named minor with no independent consent flow of their own — it is collected by whoever fills in the team-creation form (a School Admin), not by the student or a guardian directly. This is the single highest-risk field in the schema for DPDP §9 (children's data) purposes. See §5.

---

## 3. Children's data — DPDP Section 9

Section 9 requires **verifiable parental/guardian consent** before processing a child's (under-18) personal data, and bans:
1. Processing likely to cause detrimental effect on a child's wellbeing.
2. Tracking or behavioural monitoring of children.
3. Targeted advertising directed at children.

**Where Ideabank already stands well:**
- No individual student accounts, e-mail, or password — students authenticate via a school-issued team ID + PIN, which avoids collecting a direct, individually-linkable credential from a minor.
- No advertising, no third-party analytics/tracking scripts found anywhere in the codebase (confirmed by search — no `gtag`, `posthog`, `mixpanel`, `hotjar`, or similar). No behavioural tracking exists to prohibit.
- Access to a student team's data is scoped (see `lib/db/scoping.ts`) to that team's own school and assigned staff — not broadcast or browsable by other students, which limits secondary exposure of a child's data.

**Where there is a real gap:**
- There is currently **no consent capture step at all** in the school-registration or team-creation flow (`app/pijam/page.tsx`, team-creation forms). A School Admin can create a `TeamMember` with a name, grade, gender, and phone number with zero record that consent was obtained from that student's parent/guardian.
- `TeamMember.contactNumber` has no field documenting *whose* number it is (student's own vs. guardian's). In practice this is very likely being filled with the guardian's number already, given the age group, but the system has no way to confirm or enforce that.

**Recommended fix (see §7 for the checklist):** add an explicit consent-affirmation step to team creation, and relabel/constrain the contact number field so it is unambiguous that it should be a guardian/parent number, not the student's personal number.

---

## 4. Legal basis for other processing

- **Staff accounts (`User`):** consent captured implicitly at account creation (staff supply their own e-mail/name); this should be made explicit with a checkbox linking to the Terms/Privacy Policy on the registration form in `app/pijam/page.tsx`, which currently has no such acknowledgment.
- **Audit logs:** justified under DPDP §7 "legitimate use" (security, fraud prevention, enforcing terms) — no separate consent needed, but must be disclosed (now is, in `/privacy` §1 and §4).
- **Aggregate/reporting use for SED and programme reporting:** legitimate use in the course of Pi Jam's stated educational programme purpose; must remain aggregate/de-identified where possible, per `/privacy` §4.

---

## 5. Cross-border data transfer

**Confirmed during the earlier QA/perf investigation this week:** the production Supabase database is hosted in `ap-northeast-2` (Seoul, South Korea), not in India. This means every piece of personal data in this system — including minors' names and phone numbers — is currently stored and processed outside India.

The DPDP Act does **not** ban cross-border transfer outright (unlike some other jurisdictions' data-localisation regimes); Section 16 allows transfer to any country **except** ones the Central Government specifically restricts by notification. South Korea is not currently on any such restricted list, so this is not an outright violation today. However:

- It is a disclosure obligation either way — the Privacy Policy now discloses this (§5).
- It is genuinely fragile: a future government notification could restrict this without warning, and there is no technical reason to keep it this way.
- It's the same root cause already identified and documented in `QA_FAILURE_LOG_2026-09-17.md` §1 as the primary driver of the product's slow login/page-load times (Mumbai Vercel function ↔ Seoul DB round trip on every request).

**Recommendation: migrate the Supabase project to an India region (`ap-south-1`, Mumbai).** This single action resolves both the outstanding performance issue and removes any future cross-border-transfer exposure at the source, rather than managing it via disclosure alone. This still needs your explicit sign-off before anyone touches production data — flagged here again because it's now a compliance recommendation, not just a performance one, which may change how you want to prioritise it.

---

## 6. Data Principal rights — what needs to actually exist

The Privacy Policy (`/privacy` §8) now states the rights DPDP grants (access, correction, erasure, consent withdrawal, nomination, grievance). None of these currently have an operational path in the product — they exist only as a promise in the policy text. To be genuinely compliant, not just documented:

| Right | Current state | Needed |
|---|---|---|
| Access (know what data is held) | No self-serve view; would require a manual DB query today | Low priority initially — a documented internal process (support handles requests to `privacy@thepijam.org` manually) is an acceptable starting point for an org this size |
| Correction | School Admins can already edit team member details in the dashboard | Already functionally covered — confirm this is true for every editable field |
| Erasure | No delete flow for a `TeamMember`/`Idea`/`School` currently visible in the codebase searched | Needs a documented internal deletion runbook at minimum; a self-serve "delete my school's data" action is a longer-term improvement |
| Consent withdrawal | N/A — no consent capture exists yet (see §3) | Build alongside the consent-capture fix |
| Grievance handling | `privacy@thepijam.org` published in the policy | **This inbox needs to actually exist and be monitored** — it is currently a placeholder address, not a provisioned mailbox. Provision it before or immediately after this report is acted on. |

---

## 7. Action checklist, in priority order

1. **Provision `privacy@thepijam.org` and `safety@thepijam.org`** (or your chosen addresses) as real, monitored mailboxes, and name an actual Grievance Officer to replace the `[name to be designated]` placeholder in `/privacy` §9. Zero engineering effort, highest immediate compliance value — the policy currently makes a promise nothing backs. **Still open — operational, not code.**
2. **Consent-acknowledgment checkbox on school/staff registration** — done. Both `app/onboard/page.tsx` (school self-registration) and `app/pijam/page.tsx` (instructor/Teacher Trainer registration) now show a required checkbox linking to `/terms` and `/privacy` on the final review step, block the submit button until checked, and `/api/auth/onboard` rejects the request server-side (Zod `termsAccepted` literal) even if a client bypasses the UI. `User.termsAcceptedAt` is stamped on creation.
3. **Consent step on student team creation** — done. `components/teams/create-team-modal.tsx` requires a School Admin to check a guardian-consent affirmation (linked to `/child-safety`) before "Create Team"/"Save Changes" is enabled, once at least one student member is listed. `StudentTeam.guardianConsentAcknowledged` (boolean) + `guardianConsentAcknowledgedAt` (timestamp) are stored, and both `POST /api/teams` and `PUT /api/teams/[id]` reject a student-team submission with members if consent wasn't acknowledged — enforced server-side, not just in the UI.
4. **Relabel `TeamMember.contactNumber`** — done. UI now reads "Parent/Guardian Contact Number (optional)", the field is no longer required to add a member, and the schema column is now nullable (migration `20260917_dpdp_consent_fields`, applied). Column name unchanged to avoid a breaking rename; the intent is documented in a schema comment.
5. **Migrate the Supabase database to `ap-south-1`.** Skipped in this pass — already in progress as part of the CI/CD pipeline work and not yet finalized. Revisit once that lands.
6. **Write an internal data-deletion runbook** covering how a school-offboarding or an individual erasure request gets actioned against `School`, `User`, `StudentTeam`, `TeamMember`, and `Idea` rows, including the `AuditLog` retention exception. **Still open.**
7. **Define and document actual retention periods** (currently `/privacy` §6 says "reasonable period," a placeholder — pick real numbers and encode them in the runbook from item 6). **Still open.**
8. **Re-check Significant Data Fiduciary thresholds** once the Central Government publishes them. **Ongoing / monitoring, no action yet.**

Items 2–4 (the ones touching what a student or a school actually experiences) are implemented and verified by `tsc`/`next build`. Item 1 is a five-minute operational task with no engineering dependency — do it whenever convenient. Items 6–7 are short internal docs, not code, and worth an hour whenever you want to close them out. Item 5 is intentionally deferred per your CI/CD note; item 8 has no action to take yet.

---

## 8. What shipped alongside this report

- `/terms` — Terms of Service.
- `/privacy` — Privacy Policy, covering the data inventory in §2 above, children's data handling, legal basis, cross-border disclosure, retention, and Data Principal rights.
- `/eula` — End User License Agreement, the software-licensing terms for schools/staff use of the Platform.
- `/child-safety` — Child Safety Policy: zero-tolerance statement, product-level safeguards (no messaging/chat, no individual student accounts, adult supervision by design), school responsibilities, and a reporting path.
- `/cookie-policy` — discloses the single strictly-necessary session cookie and confirms no advertising/analytics/tracking cookies exist.
- `/accessibility` — WCAG 2.1 AA commitment, tied to the RPWD Act, 2016, and what that means concretely in the product.
- All six linked from the site footer, organised under "Legal" and "Trust & Safety."
- Consent capture wired into the actual flows that create personal data: school/staff registration (`app/onboard/page.tsx`, `app/pijam/page.tsx`) and student-team creation (`components/teams/create-team-modal.tsx`), each enforced both client-side (disabled submit) and server-side (`/api/auth/onboard`, `/api/teams`, `/api/teams/[id]` all reject the request without it).
- `TeamMember.contactNumber` relabelled to parent/guardian and made optional, end to end (UI, type, API, schema).

These pages describe the system as it is today. As the remaining §7 items (grievance mailbox, deletion runbook, retention numbers) are closed out, revisit the policy text so it keeps describing reality rather than drifting ahead of it.
