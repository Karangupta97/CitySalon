const { Client } = require('pg');

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'eu-south-1',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2'
];

async function testHost(host, region) {
  const connectionString = `postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@${host}:6543/postgres`;
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 2000
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS: Connected via ${host}`);
    const res = await client.query("SELECT NOW()");
    console.log("DB Time:", res.rows[0]);
    await client.end();
    return true;
  } catch (error) {
    if (error.message.includes("tenant/user")) {
      // Host resolved, but tenant not found
    } else {
      console.log(`❌ ${host} - ${error.message}`);
    }
    return false;
  }
}

async function run() {
  for (const r of regions) {
    for (const prefix of ['aws-0', 'aws-1']) {
      const host = `${prefix}-${r}.pooler.supabase.com`;
      const success = await testHost(host, r);
      if (success) {
        console.log(`\n🎉 FOUND! Connection String: postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@${host}:6543/postgres`);
        process.exit(0);
      }
    }
  }
  console.log("\n😢 No pooler succeeded.");
  process.exit(1);
}

run();
