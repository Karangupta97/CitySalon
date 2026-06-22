-- ============================================================
-- CitySalon: Add Missing Salon Columns Migration
-- Adds columns that the application expects but weren't in the
-- original migration: instagram, opening_hours, gallery,
-- offers, products, faqs
-- ============================================================

ALTER TABLE salons ADD COLUMN IF NOT EXISTS instagram VARCHAR(500);
ALTER TABLE salons ADD COLUMN IF NOT EXISTS opening_hours JSONB DEFAULT '{}';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers JSONB DEFAULT '[]';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
