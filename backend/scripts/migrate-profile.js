const { Client } = require('pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

const sql = `
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS opening_hours JSONB DEFAULT '{}';
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers JSONB DEFAULT '[]';
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]';
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
  ALTER TABLE salons ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
`;

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("🔌 Connecting to Supabase via transaction pooler...");
    await client.connect();
    console.log("🔌 Connected successfully. Executing alter table commands...");
    await client.query(sql);
    console.log("✅ Database migration completed! The 'salons' table has been updated with the new columns.");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
