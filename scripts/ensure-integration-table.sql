-- Ensures the Integration table exists with correct schema
-- Run this if Prisma migrations haven't been applied to production
-- Usage: psql $DATABASE_URL -f scripts/ensure-integration-table.sql

CREATE TABLE IF NOT EXISTS "Integration" (
  "id"           TEXT PRIMARY KEY,
  "userId"       TEXT NOT NULL,
  "provider"     TEXT NOT NULL,
  "service"      TEXT NOT NULL,
  "accessToken"  TEXT NOT NULL,
  "refreshToken" TEXT,
  "expiresAt"    TIMESTAMP,
  "scope"        TEXT,
  "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Integration_userId_provider_service_key" UNIQUE ("userId", "provider", "service")
);

CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration" ("userId");

-- Add foreign key if User table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'User') THEN
    BEGIN
      ALTER TABLE "Integration"
        ADD CONSTRAINT "Integration_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
      -- Constraint already exists, skip
      NULL;
    END;
  END IF;
END $$;

-- Verify
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'Integration' ORDER BY ordinal_position;
