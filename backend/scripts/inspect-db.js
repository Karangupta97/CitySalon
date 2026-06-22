const { Client } = require('pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase DB. Querying salons columns...");
    const { rows } = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'salons'
    `);
    console.log("Columns in 'salons':", rows);
    await client.end();
  } catch (error) {
    console.error("Inspector failed:", error.message);
  }
}

run();
