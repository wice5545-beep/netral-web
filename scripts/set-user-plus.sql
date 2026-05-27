-- Script pour mettre un utilisateur en plan Plus
-- Usage: psql $DATABASE_URL -f scripts/set-user-plus.sql

-- Mettre zerhyaceisthebest3@gmail.com en plan Plus avec expiration dans 1 an
UPDATE "User"
SET
  plan = 'plus',
  "planExpiresAt" = NOW() + INTERVAL '1 year',
  "messagesUsed" = 0,
  "messagesResetAt" = NOW() + INTERVAL '2 days'
WHERE email = 'zerhyaceisthebest3@gmail.com';

-- Vérification
SELECT id, email, plan, "planExpiresAt", "messagesUsed"
FROM "User"
WHERE email = 'zerhyaceisthebest3@gmail.com';
