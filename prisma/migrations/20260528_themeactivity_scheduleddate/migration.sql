-- Phase H — Add a real DateTime column on ThemeActivity. The legacy
-- date/month/year Int triplet stays temporarily for UI back-compat and
-- will be dropped in a follow-up once consumers migrate.
--
-- Existing rows store `month` as 1-indexed (January = 1), which lines
-- up with Postgres `make_date`. UI code that treats month as 0-indexed
-- has a separate pre-existing bug that this migration does not try to
-- fix.

ALTER TABLE "ThemeActivity"
  ADD COLUMN IF NOT EXISTS "scheduledDate" TIMESTAMP(3);

UPDATE "ThemeActivity"
SET "scheduledDate" = make_date("year", "month", "date")
WHERE "scheduledDate" IS NULL
  AND "month" BETWEEN 1 AND 12
  AND "date"  BETWEEN 1 AND 31;

CREATE INDEX IF NOT EXISTS "ThemeActivity_scheduledDate_idx"
  ON "ThemeActivity" ("scheduledDate");
