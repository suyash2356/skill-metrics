/// <reference types="node" />
import * as fs from 'fs';
import { CATEGORY_MAPPING } from './src/utils/categoryMapping';

let sql = `UPDATE resources AS r
SET 
  domain = m.domain,
  subdomain = m.subdomain
FROM (
  VALUES 
`;

const values: string[] = [];
for (const [category, { domain, subdomain }] of Object.entries(CATEGORY_MAPPING)) {
  const safeCat = category.replace(/'/g, "''");
  const safeDom = domain.replace(/'/g, "''");
  const safeSub = subdomain.replace(/'/g, "''");
  values.push(`    ('${safeCat}', '${safeDom}', '${safeSub}')`);
}

sql += values.join(',\n') + '\n) AS m(category, domain, subdomain)\n';
sql += `WHERE r.category = m.category AND (r.domain IS NULL OR r.subdomain IS NULL);\n`;

fs.writeFileSync('supabase/migrations/backfill_categories.sql', sql);
console.log('Successfully generated backfill_categories.sql');
