-- Run this in your Supabase SQL Editor or PostgreSQL client
-- Creates the Integration table if it doesn't exist

CREATE TABLE IF NOT EXISTS "Integration" (
  id           TEXT PRIMARY KEY DEFAULT concat('intg_', replace(gen_random_uuid()::text, '-', '')),
  "userId"     TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  provider     TEXT NOT NULL,
  service      TEXT NOT NULL,
  "accessToken"  TEXT NOT NULL,
  "refreshToken" TEXT,
  "expiresAt"  TIMESTAMPTZ,
  scope        TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("userId", provider, service)
);

CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration"("userId");
