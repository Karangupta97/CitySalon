const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  try {
    console.log("Connecting to Supabase via SDK...", process.env.SUPABASE_URL);
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log("✅ Supabase API connection successful! User count status:", data);
  } catch (error) {
    console.error("❌ Supabase API failed:", error.message);
  }
}

run();
