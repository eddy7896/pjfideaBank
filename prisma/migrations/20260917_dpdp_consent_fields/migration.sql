-- DPDP Act compliance: consent capture fields, and relax TeamMember.contactNumber
-- to optional (it should hold a parent/guardian number, not a student's own,
-- and not every school collects one at team-creation time). See
-- DPDP_COMPLIANCE_REPORT.md for the full rationale.

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "termsAcceptedAt" TIMESTAMP(3);

ALTER TABLE "StudentTeam"
  ADD COLUMN IF NOT EXISTS "guardianConsentAcknowledged" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "StudentTeam"
  ADD COLUMN IF NOT EXISTS "guardianConsentAcknowledgedAt" TIMESTAMP(3);

ALTER TABLE "TeamMember"
  ALTER COLUMN "contactNumber" DROP NOT NULL;
