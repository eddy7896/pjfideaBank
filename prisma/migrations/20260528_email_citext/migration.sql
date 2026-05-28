-- Phase J — Move User.email to citext so case-mismatch can no longer
-- create duplicate accounts. We already lowercase at insert in the API,
-- but a citext column makes the database the ultimate guard rail.

CREATE EXTENSION IF NOT EXISTS citext;

ALTER TABLE "User"
  ALTER COLUMN "email" TYPE CITEXT USING "email"::CITEXT;

-- The existing unique index on email keeps working under citext (it
-- becomes case-insensitive automatically), so no constraint changes
-- are needed.
