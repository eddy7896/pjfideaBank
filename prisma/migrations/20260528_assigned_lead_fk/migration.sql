-- Phase E — assignedLeadUserId FK on User.
--
-- Adds a real FK to User.id alongside the legacy email-text
-- `assignedLeadId` column. Backfills from email match. Keeps the text
-- column for now (DEPRECATED) so any code still reading it does not
-- break; a follow-up migration will drop it once every consumer reads
-- `assignedLeadUserId`.
--
-- Idempotent.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "assignedLeadUserId" INTEGER;

-- Backfill: match each user.assignedLeadId email against a
-- geography-lead user record. Case-insensitive to handle inconsistent
-- form input.
UPDATE "User" u
SET "assignedLeadUserId" = lead."id"
FROM "User" lead
WHERE lead."role" = 'geography-lead'
  AND lower(lead."email") = lower(u."assignedLeadId")
  AND u."assignedLeadUserId" IS NULL
  AND u."assignedLeadId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "User_assignedLeadUserId_idx"
  ON "User" ("assignedLeadUserId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_assignedLeadUserId_fkey'
  ) THEN
    ALTER TABLE "User"
      ADD CONSTRAINT "User_assignedLeadUserId_fkey"
      FOREIGN KEY ("assignedLeadUserId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
