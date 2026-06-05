-- Add NOT NULL constraint to domain and subdomain columns
-- ONLY run this migration AFTER confirming that all existing records have been backfilled

ALTER TABLE resources
ALTER COLUMN domain SET NOT NULL;

ALTER TABLE resources
ALTER COLUMN subdomain SET NOT NULL;
