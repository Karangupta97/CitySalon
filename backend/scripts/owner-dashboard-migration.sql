-- ============================================================
-- CitySalon: Salon Owner Dashboard Migration
-- ============================================================

-- Add role to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'owner', 'admin'));

-- ─────────────────────────────────────────────────────────────
-- SALONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS salons (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(255) NOT NULL,
  tagline             VARCHAR(500),
  description         TEXT,
  phone               VARCHAR(50),
  email               VARCHAR(255),
  website             VARCHAR(500),
  full_address        TEXT,
  location            VARCHAR(255),
  city                VARCHAR(100),
  hero_image          VARCHAR(1000),
  rating              NUMERIC(3,2) DEFAULT 0.0,
  review_count        INTEGER DEFAULT 0,
  hygiene_score       INTEGER DEFAULT 0,
  price_guarantee     BOOLEAN DEFAULT FALSE,
  live_status         VARCHAR(20) DEFAULT 'available' CHECK (live_status IN ('available','short-wait','busy','fully-booked')),
  wait_time           VARCHAR(50),
  is_active           BOOLEAN DEFAULT TRUE,
  -- Hygiene checklist flags
  hc_autoclave        BOOLEAN DEFAULT FALSE,
  hc_fresh_towels     BOOLEAN DEFAULT FALSE,
  hc_licensed_staff   BOOLEAN DEFAULT FALSE,
  hc_disposable_kits  BOOLEAN DEFAULT FALSE,
  hc_sanitization     BOOLEAN DEFAULT FALSE,
  hc_air_purification BOOLEAN DEFAULT FALSE,
  ai_review_summary   TEXT,
  highlights          JSONB DEFAULT '[]',
  amenities           JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_salons_owner_id ON salons(owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);

-- ─────────────────────────────────────────────────────────────
-- SERVICES (per salon)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id    UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  price       INTEGER NOT NULL,       -- in rupees
  duration    INTEGER NOT NULL,       -- in minutes
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_salon_id ON services(salon_id);

-- ─────────────────────────────────────────────────────────────
-- STAFF / STYLISTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id     UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name         VARCHAR(255) NOT NULL,
  role         VARCHAR(100) DEFAULT 'Stylist',
  speciality   VARCHAR(255),
  experience   VARCHAR(100),
  phone        VARCHAR(50),
  email        VARCHAR(255),
  photo        VARCHAR(1000),
  rating       NUMERIC(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  clients      VARCHAR(50),
  availability VARCHAR(20) DEFAULT 'available' CHECK (availability IN ('available','busy','off')),
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_salon_id ON staff(salon_id);

-- Staff blocked slots (lunch, day off, etc.)
CREATE TABLE IF NOT EXISTS staff_blocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  salon_id     UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  reason       VARCHAR(255),
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_blocks_staff_id ON staff_blocks(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_blocks_date ON staff_blocks(date);

-- ─────────────────────────────────────────────────────────────
-- CUSTOMERS (CRM — per salon)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  name            VARCHAR(255) NOT NULL,
  phone           VARCHAR(50),
  email           VARCHAR(255),
  notes           TEXT,
  tag             VARCHAR(20) DEFAULT 'regular' CHECK (tag IN ('vip','regular','at-risk')),
  total_spent     INTEGER DEFAULT 0,   -- in rupees
  visit_count     INTEGER DEFAULT 0,
  last_visit_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_salon_id ON customers(salon_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ─────────────────────────────────────────────────────────────
-- APPOINTMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id         UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES customers(id) ON DELETE SET NULL,
  staff_id         UUID REFERENCES staff(id) ON DELETE SET NULL,
  service_ids      JSONB NOT NULL DEFAULT '[]',
  service_names    JSONB NOT NULL DEFAULT '[]',
  date             DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  total_price      INTEGER NOT NULL DEFAULT 0,   -- in rupees
  status           VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled','no-show')),
  is_walk_in       BOOLEAN DEFAULT FALSE,
  customer_name    VARCHAR(255),                  -- denormalized for quick display
  customer_phone   VARCHAR(50),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_salon_id ON appointments(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);

-- ─────────────────────────────────────────────────────────────
-- GALLERY IMAGES (per salon)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id    UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  url         VARCHAR(1000) NOT NULL,
  alt         VARCHAR(255),
  caption     VARCHAR(500),
  category    VARCHAR(100),   -- 'before-after', 'general', etc.
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gallery_salon_id ON gallery_images(salon_id);
