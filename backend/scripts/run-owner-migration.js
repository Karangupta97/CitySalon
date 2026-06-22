const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = "postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

// Load original migration SQL
let sql = fs.readFileSync(path.join(__dirname, 'owner-dashboard-migration.sql'), 'utf8');

// Modify owner_id to point to partners(id) instead of users(id)
sql = sql.replace(
  "owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,",
  "owner_id            UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,"
);

// We need to insert the new profile columns into the CREATE TABLE salons block.
// Let's insert them right before "created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP"
const target = "created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP";
const replacement = `instagram           VARCHAR(255),
  opening_hours       JSONB DEFAULT '{}',
  offers              JSONB DEFAULT '[]',
  products            JSONB DEFAULT '[]',
  faqs                JSONB DEFAULT '[]',
  gallery             JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`;

sql = sql.replace(target, replacement);

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("🔌 Connecting to Supabase database...");
    await client.connect();
    console.log("🔌 Connected successfully. Executing owner dashboard migration...");
    await client.query(sql);
    console.log("✅ Owner dashboard tables created successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
