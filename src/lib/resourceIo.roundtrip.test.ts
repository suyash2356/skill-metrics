/**
 * Import/export roundtrip test.
 *
 * Exports the current resource dataset (live Supabase catalog when reachable,
 * otherwise the committed fixture) in both JSON and CSV, re-imports it through
 * the exact importer pipeline (parse -> normalize -> validate) into a fresh
 * in-memory schema, and asserts zero data drift.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import {
  toJSONExport,
  toCSVExport,
  parseCSV,
  validateResources,
  insertIntoFreshSchema,
  diffCatalogs,
  canonicalizeCatalogRow,
  ROUNDTRIP_COMPARE_FIELDS,
  type ExportableResource,
} from './resourceIo';
import fixture from './__fixtures__/resources.snapshot.json';

const SUPABASE_URL = 'https://vecdjxbrkaqpvftwoafj.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY2RqeGJya2FxcHZmdHdvYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTg0OTksImV4cCI6MjA3MzgzNDQ5OX0.5MlACmnknf5dki0JMSNimzMJbJEf9M4V2_VzPq8mOqw';

const SELECT = [
  'title', 'description', 'link', 'category', 'section_type', 'domain', 'subdomain',
  'difficulty', 'is_free', 'icon', 'color', 'related_skills', 'relevant_backgrounds',
  'provider', 'duration', 'rating', 'is_featured', 'is_active', 'resource_type',
  'target_countries', 'estimated_time', 'prerequisites', 'education_levels',
].join(',');

async function fetchLiveCatalog(): Promise<ExportableResource[] | null> {
  const page = 1000;
  const rows: ExportableResource[] = [];
  try {
    for (let offset = 0; ; offset += page) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/resources?select=${SELECT}&order=title.asc&limit=${page}&offset=${offset}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return null;
      const chunk = (await res.json()) as ExportableResource[];
      rows.push(...chunk);
      if (chunk.length < page) break;
    }
  } catch {
    return null;
  }
  return rows.length ? rows : null;
}

let dataset: ExportableResource[] = [];
let source = 'fixture';

beforeAll(async () => {
  const live = await fetchLiveCatalog();
  if (live) {
    dataset = live;
    source = 'live';
  } else {
    dataset = fixture as unknown as ExportableResource[];
  }
  // eslint-disable-next-line no-console
  console.log(`[roundtrip] dataset source=${source} rows=${dataset.length}`);
}, 120_000);

/** Expected state: the dataset as the importer would canonicalize it. */
const expectedSnapshot = () => dataset.map((r) => canonicalizeCatalogRow(r as Record<string, any>));

/** Re-import a serialized export into a fresh schema. */
const reimport = (rows: Record<string, any>[]) => {
  const { valid, errors } = validateResources(rows, 'course');
  const inserted = insertIntoFreshSchema(valid);
  return { valid, errors, inserted };
};

describe('resource import/export roundtrip', () => {
  it('has a non-empty dataset to verify', () => {
    expect(dataset.length).toBeGreaterThan(0);
  });

  it('JSON export re-imports into a fresh schema with zero drift', () => {
    const exported = JSON.parse(toJSONExport(dataset)) as Record<string, any>[];
    expect(exported.length).toBe(dataset.length);

    const { errors, inserted } = reimport(exported);
    expect(errors).toEqual([]);

    const before = expectedSnapshot();
    const uniqueBefore = insertIntoFreshSchema(before);
    expect(inserted.rows.length).toBe(uniqueBefore.rows.length);

    const { drift, missing, extra } = diffCatalogs(uniqueBefore.rows, inserted.rows);
    expect({ drift: drift.slice(0, 10), missing: missing.slice(0, 10), extra: extra.slice(0, 10) })
      .toEqual({ drift: [], missing: [], extra: [] });
  });

  it('CSV export re-imports into a fresh schema with zero drift', () => {
    const csv = toCSVExport(dataset);
    const parsed = parseCSV(csv);
    expect(parsed.length).toBe(dataset.length);

    const { errors, inserted } = reimport(parsed);
    expect(errors).toEqual([]);

    const before = insertIntoFreshSchema(expectedSnapshot());
    const { drift, missing, extra } = diffCatalogs(before.rows, inserted.rows);
    expect({ drift: drift.slice(0, 10), missing: missing.slice(0, 10), extra: extra.slice(0, 10) })
      .toEqual({ drift: [], missing: [], extra: [] });
  });

  it('is idempotent: re-importing the same export twice inserts no duplicates', () => {
    const exported = JSON.parse(toJSONExport(dataset)) as Record<string, any>[];
    const { valid } = reimport(exported);
    const twice = insertIntoFreshSchema([...valid, ...valid]);
    const once = insertIntoFreshSchema(valid);
    expect(twice.rows.length).toBe(once.rows.length);
    expect(twice.skipped).toBeGreaterThanOrEqual(valid.length - once.rows.length);
  });

  it('JSON and CSV paths produce identical re-imported rows', () => {
    const viaJson = reimport(JSON.parse(toJSONExport(dataset))).inserted.rows;
    const viaCsv = reimport(parseCSV(toCSVExport(dataset))).inserted.rows;
    const { drift, missing, extra } = diffCatalogs(viaJson, viaCsv, ROUNDTRIP_COMPARE_FIELDS);
    expect({ drift: drift.slice(0, 10), missing: missing.slice(0, 10), extra: extra.slice(0, 10) })
      .toEqual({ drift: [], missing: [], extra: [] });
  });

  it('every row resolves a domain/subdomain (no unmapped categories)', () => {
    const { valid } = reimport(JSON.parse(toJSONExport(dataset)));
    const unmapped = valid.filter((r) => !r.domain || !r.subdomain).map((r) => r.category);
    expect([...new Set(unmapped)]).toEqual([]);
  });
});
