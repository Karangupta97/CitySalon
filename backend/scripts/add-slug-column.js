const { Client } = require('pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.zczsoeghpryzmpmonhir:CitySalon%403319@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("🔌 Connecting to Supabase database...");
    await client.connect();

    console.log("🛠️ Adding 'slug' column to 'salons' table...");
    await client.query(`
      ALTER TABLE salons ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    `);
    
    // Attempt to make it UNIQUE if it isn't already, but we must populate it first
    // to prevent errors if there are multiple nulls/duplicates.
    console.log("🔍 Fetching all salons to populate slugs...");
    const { rows: salons } = await client.query("SELECT id, name, slug FROM salons");

    console.log(`Found ${salons.length} salons.`);
    const usedSlugs = new Set();

    for (const salon of salons) {
      let slug = salon.slug;
      if (!slug) {
        let baseSlug = slugify(salon.name || 'untitled-salon');
        slug = baseSlug;
        let counter = 1;
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        console.log(`Setting slug for "${salon.name}" -> "${slug}"`);
        await client.query("UPDATE salons SET slug = $1 WHERE id = $2", [slug, salon.id]);
      }
      usedSlugs.add(slug);
    }

    console.log("🔒 Adding UNIQUE constraint and NOT NULL to 'slug' column...");
    // Let's add unique constraint if not exists
    try {
      await client.query("ALTER TABLE salons ADD CONSTRAINT salons_slug_key UNIQUE (slug)");
      console.log("✅ Unique constraint added successfully.");
    } catch (e) {
      console.log("⚠️ Unique constraint might already exist or failed:", e.message);
    }

    console.log("✅ Slug migration completed successfully!");
    await client.end();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
