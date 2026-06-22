const { Client } = require('pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

function formatUsername(name) {
  let username = name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric/underscore with underscore
    .replace(/__+/g, '_')         // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '');     // Trim underscores from start and end

  if (username.length < 3) {
    username = (username + '_salon').substring(0, 30);
  }
  if (username.length > 30) {
    username = username.substring(0, 30);
  }
  return username;
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("🔌 Connecting to Supabase database...");
    await client.connect();

    console.log("🛠️ Adding 'username' and 'verified' columns to 'salons' table...");
    await client.query(`
      ALTER TABLE salons ADD COLUMN IF NOT EXISTS username VARCHAR(30);
      ALTER TABLE salons ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
    `);

    console.log("🛠️ Creating 'username_history' table for SEO redirects...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS username_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
        old_username VARCHAR(30) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_username_history_old_username ON username_history(old_username);
    `);

    console.log("🔍 Fetching all salons to generate/validate usernames...");
    const { rows: salons } = await client.query("SELECT id, name, username FROM salons");

    const usedUsernames = new Set();
    // Gather already set usernames
    for (const salon of salons) {
      if (salon.username) {
        usedUsernames.add(salon.username.toLowerCase());
      }
    }

    for (const salon of salons) {
      if (!salon.username) {
        let baseUsername = formatUsername(salon.name || 'salon');
        let username = baseUsername;
        
        // If username exists, append random numbers (3 digits)
        while (usedUsernames.has(username)) {
          const rand = Math.floor(100 + Math.random() * 900); // 3-digit random
          const suffix = `_${rand}`;
          // Make sure it fits in 30 characters
          username = baseUsername.substring(0, 30 - suffix.length) + suffix;
        }

        console.log(`Setting username for "${salon.name}" -> "${username}"`);
        await client.query("UPDATE salons SET username = $1 WHERE id = $2", [username, salon.id]);
        usedUsernames.add(username);
      }
    }

    console.log("🔒 Adding UNIQUE constraint and NOT NULL to 'username' column...");
    try {
      // Clean up any remaining nulls if somehow there
      await client.query("UPDATE salons SET username = 'salon_' || SUBSTRING(id::text from 1 for 8) WHERE username IS NULL");
      await client.query("ALTER TABLE salons ALTER COLUMN username SET NOT NULL");
      await client.query("ALTER TABLE salons ADD CONSTRAINT salons_username_key UNIQUE (username)");
      console.log("✅ Unique constraint added successfully.");
    } catch (e) {
      console.log("⚠️ Unique constraint might already exist or failed:", e.message);
    }

    console.log("⚡ Creating index on salons(username) for fast queries...");
    await client.query("CREATE INDEX IF NOT EXISTS idx_salons_username ON salons(username)");

    console.log("✅ Username migration completed successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
