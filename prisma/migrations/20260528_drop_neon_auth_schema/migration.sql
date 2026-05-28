-- Phase I — Drop the unused `neon_auth` schema.
--
-- Neon shipped its hosted-auth feature with an auto-provisioned
-- `neon_auth.*` schema (user / session / account / organization /
-- member / invitation / jwks / verification / project_config). This
-- project uses NextAuth JWTs only and writes to `public.User`; nothing
-- in the codebase references `neon_auth.*`.
--
-- Dropping the schema removes the confusion of having two `user`
-- tables when an operator opens the DB. If Neon Auth is ever
-- re-enabled in the Neon dashboard, the schema will be re-created
-- automatically.
--
-- Idempotent.

DROP SCHEMA IF EXISTS "neon_auth" CASCADE;
