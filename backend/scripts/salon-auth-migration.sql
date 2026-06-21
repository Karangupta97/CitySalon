-- ============================================================
-- CitySalon: Partners (Salon Owners) — Separate Table
-- Completely independent from 'users' (clients/customers).
-- Same email can exist in both tables.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- PARTNERS TABLE (Salon Owners & Admins)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name                   VARCHAR(255) NOT NULL,
  email                       VARCHAR(255) UNIQUE NOT NULL,
  phone_number                VARCHAR(50),
  password_hash               VARCHAR(255) NOT NULL,
  role                        VARCHAR(20) DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'manager')),
  is_verified                 BOOLEAN DEFAULT FALSE,
  is_active                   BOOLEAN DEFAULT TRUE,
  verification_token          VARCHAR(255),
  verification_token_expires_at TIMESTAMPTZ,
  reset_token                 VARCHAR(255),
  reset_token_expires_at      TIMESTAMPTZ,
  failed_login_attempts       INTEGER DEFAULT 0,
  locked_until                TIMESTAMPTZ,
  last_login_at               TIMESTAMPTZ,
  last_login_ip               INET,
  password_changed_at         TIMESTAMPTZ,
  avatar_url                  VARCHAR(1000),
  business_name               VARCHAR(255),
  created_at                  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_verification_token ON partners(verification_token);
CREATE INDEX IF NOT EXISTS idx_partners_reset_token ON partners(reset_token);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active) WHERE is_active = TRUE;

-- ─────────────────────────────────────────────────────────────
-- PARTNER REFRESH TOKENS (Token Family for Rotation Detection)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_refresh_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  token_hash      VARCHAR(512) NOT NULL,
  family_id       UUID NOT NULL,
  is_revoked      BOOLEAN DEFAULT FALSE,
  device_info     VARCHAR(500),
  ip_address      INET,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partner_refresh_tokens_partner_id ON partner_refresh_tokens(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_refresh_tokens_token_hash ON partner_refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_partner_refresh_tokens_family_id ON partner_refresh_tokens(family_id);

-- ─────────────────────────────────────────────────────────────
-- PARTNER LOGIN ATTEMPTS (Brute-Force & Account Lockout)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_login_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL,
  ip_address      INET,
  user_agent      VARCHAR(500),
  success         BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason  VARCHAR(100),
  attempted_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partner_login_attempts_email ON partner_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_partner_login_attempts_ip ON partner_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_partner_login_attempts_time ON partner_login_attempts(attempted_at DESC);

-- ─────────────────────────────────────────────────────────────
-- UPDATE SALONS FK: Point to partners instead of users
-- ─────────────────────────────────────────────────────────────
-- NOTE: If you already have salons referencing users(id), run this:
-- ALTER TABLE salons DROP CONSTRAINT IF EXISTS salons_owner_id_fkey;
-- ALTER TABLE salons ADD CONSTRAINT salons_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES partners(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- CLEANUP (run via cron/pg_cron in production)
-- ─────────────────────────────────────────────────────────────
-- DELETE FROM partner_refresh_tokens WHERE expires_at < NOW();
-- DELETE FROM partner_login_attempts WHERE attempted_at < NOW() - INTERVAL '30 days';
