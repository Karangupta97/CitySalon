const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
require('dotenv').config();

const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Error: Please provide your PostgreSQL connection string as an argument.");
  console.error("\nExample syntax:");
  console.error("  node scripts/migrate.js \"postgresql://postgres:YOUR_PASSWORD@db.zczsoeghpryzmpmonhir.supabase.co:5432/postgres\"\n");
  process.exit(1);
}

const sql = fs.readFileSync(path.join(__dirname, 'migration.sql'), 'utf8');

async function run() {
  try {
    // Parse connection string components manually using URL parser
    const parsed = new URL(connectionString);
    const host = parsed.hostname;
    const port = parsed.port || '5432';
    const database = parsed.pathname.substring(1) || 'postgres';
    const user = parsed.username;
    
    // Decode password in case of URL-encoded characters (like %40 for @)
    const password = decodeURIComponent(parsed.password);

    console.log(`🔍 Resolving host: ${host} using IPv4...`);
    
    const resolvedIp = await new Promise((resolve, reject) => {
      dns.lookup(host, { family: 4 }, (err, address) => {
        if (err) {
          reject(new Error(`DNS resolution failed for ${host}: ${err.message}`));
        } else {
          resolve(address);
        }
      });
    });

    console.log(`🔌 Resolved IP: ${resolvedIp}. Connecting to Supabase database...`);

    const client = new Client({
      host: resolvedIp,
      port: parseInt(port, 10),
      database,
      user,
      password,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log("🔌 Connected. Executing SQL migration query...");
    await client.query(sql);
    console.log("✅ Migration completed successfully. The 'users' table is now provisioned.");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  }
}

run();
