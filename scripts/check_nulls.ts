import { createClient } from '@supabase/supabase-js';
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

async function checkNulls() {
  const { data: resources, error } = await supabase
    .from('resources')
    .select('id, title, category, domain, subdomain')
    .or('domain.is.null,subdomain.is.null');

  if (error) {
    console.error('Error fetching resources:', error);
    return;
  }

  console.log(`Found ${resources?.length || 0} resources with null domain or subdomain.`);
  if (resources && resources.length > 0) {
    console.log(JSON.stringify(resources, null, 2));
  }
}

checkNulls().catch(console.error);
