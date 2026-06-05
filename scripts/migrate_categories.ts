import { createClient } from '@supabase/supabase-js';
import { CATEGORY_MAPPING } from '../src/utils/categoryMapping';
import { resolve } from 'path';
import * as fs from 'fs';

// Manually parse .env file
const envPath = resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'] || process.env.VITE_SUPABASE_URL;
const supabaseKey = env['VITE_SUPABASE_PUBLISHABLE_KEY'] || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key is missing from environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Starting category migration...');

  // Fetch all resources where domain or subdomain is null
  const { data: resources, error: fetchError } = await supabase
    .from('resources')
    .select('id, category')
    .or('domain.is.null,subdomain.is.null');

  if (fetchError) {
    console.error('Error fetching resources:', fetchError);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log('No resources found requiring migration.');
    return;
  }

  console.log(`Found ${resources.length} resources to update.`);

  let successCount = 0;
  let errorCount = 0;

  for (const resource of resources) {
    const mapping = CATEGORY_MAPPING[resource.category];
    
    if (!mapping) {
      console.warn(`WARNING: No mapping found for category "${resource.category}" on resource ${resource.id}`);
      errorCount++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('resources')
      .update({
        domain: mapping.domain,
        subdomain: mapping.subdomain
      })
      .eq('id', resource.id);

    if (updateError) {
      console.error(`Error updating resource ${resource.id}:`, updateError);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log('Migration completed.');
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Failed to update: ${errorCount}`);
}

runMigration().catch(console.error);
