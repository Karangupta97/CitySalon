const { Client } = require('pg');

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1',
  'eu-west-1'
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const connectionString = `postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@${host}:6543/postgres`;
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log(`✅ Success with region: ${region} (${host})`);
    const res = await client.query("SELECT NOW()");
    console.log("Time from DB:", res.rows[0]);
    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed with region: ${region} - ${error.message}`);
    return false;
  }
}

async function run() {
  for (const r of regions) {
    const success = await testRegion(r);
    if (success) {
      console.log(`\n🎉 Found correct pooler host! Region: ${r}`);
      process.exit(0);
    }
  }
  console.log("\n😢 None of the tested poolers succeeded.");
  process.exit(1);
}

run();
