-- Phase D — Drop legacy schoolName FKs on Idea + StudentTeam, promote
-- schoolId to NOT NULL. After this migration:
--   * Idea.schoolName / StudentTeam.schoolName stay as TEXT columns
--     (denormalized snapshots), but no longer enforce referential
--     integrity by name. Renaming a School no longer cascades into
--     these rows.
--   * Idea.schoolId / StudentTeam.schoolId become the only FK to
--     School. They were nullable for the additive migration; promote
--     to NOT NULL now that backfill is complete.
--
-- Idempotent.

-- 1. Ensure no schoolId is null before promoting to NOT NULL.
--    Phase 3.2 backfill plus Phase C onboard atomicity should leave 0
--    rows. If any remain, this migration aborts so we can investigate.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Idea" WHERE "schoolId" IS NULL) THEN
    RAISE EXCEPTION 'Idea rows with null schoolId still exist; refusing to migrate';
  END IF;
  IF EXISTS (SELECT 1 FROM "StudentTeam" WHERE "schoolId" IS NULL) THEN
    RAISE EXCEPTION 'StudentTeam rows with null schoolId still exist; refusing to migrate';
  END IF;
END $$;

-- 2. Drop the legacy name-based FKs.
ALTER TABLE "Idea"        DROP CONSTRAINT IF EXISTS "Idea_schoolName_fkey";
ALTER TABLE "StudentTeam" DROP CONSTRAINT IF EXISTS "StudentTeam_schoolName_fkey";

-- 3. Promote schoolId to NOT NULL.
ALTER TABLE "Idea"        ALTER COLUMN "schoolId" SET NOT NULL;
ALTER TABLE "StudentTeam" ALTER COLUMN "schoolId" SET NOT NULL;
