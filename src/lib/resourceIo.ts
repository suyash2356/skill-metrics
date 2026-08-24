/**
 * Pure import/export logic for the admin resource catalog.
 *
 * Kept free of React/DOM so it can be exercised by the roundtrip test
 * (`src/lib/resourceIo.roundtrip.test.ts`) which exports the live dataset and
 * re-imports it into a fresh in-memory schema to prove zero data drift.
 */
import { resolveCategoryMapping } from '@/utils/categoryMapping';

/** Column order for the canonical export/import file (category/subcategory/skills). */
export const EXPORT_FIELDS = [
  'category', 'subcategory', 'title', 'description', 'link', 'skills',
  'difficulty', 'is_free', 'icon', 'color', 'relevant_backgrounds', 'provider',
  'duration', 'rating', 'is_featured', 'is_active', 'resource_type',
  'target_countries', 'estimated_time', 'prerequisites', 'education_levels',
] as const;

/** Fields compared for drift after a roundtrip. */
export const ROUNDTRIP_COMPARE_FIELDS = [
  'title', 'description', 'link', 'category', 'section_type', 'domain', 'subdomain',
  'difficulty', 'is_free', 'icon', 'color', 'related_skills', 'relevant_backgrounds',
  'provider', 'duration', 'rating', 'is_featured', 'is_active', 'resource_type',
  'target_countries', 'estimated_time', 'prerequisites', 'education_levels',
] as const;

export interface ExportableResource {
  title: string;
  description?: string | null;
  link: string;
  category: string;
  section_type?: string | null;
  difficulty?: string | null;
  is_free?: boolean | null;
  icon?: string | null;
  color?: string | null;
  related_skills?: string[] | null;
  relevant_backgrounds?: string[] | null;
  provider?: string | null;
  duration?: string | null;
  rating?: number | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
  resource_type?: string | null;
  target_countries?: string[] | null;
  estimated_time?: string | null;
  prerequisites?: string[] | null;
  education_levels?: string[] | null;
  domain?: string | null;
  subdomain?: string | null;
}

/** DB row -> canonical export/import row */
export const toExportRow = (r: ExportableResource): Record<string, unknown> => ({
  category: r.section_type === 'exam' ? 'Exams' : 'Domains',
  subcategory: r.category,
  title: r.title,
  description: r.description,
  link: r.link,
  skills: r.related_skills || [],
  difficulty: r.difficulty,
  is_free: r.is_free,
  icon: r.icon,
  color: r.color,
  relevant_backgrounds: r.relevant_backgrounds || [],
  provider: r.provider,
  duration: r.duration,
  rating: r.rating,
  is_featured: r.is_featured,
  is_active: r.is_active,
  resource_type: r.resource_type,
  target_countries: r.target_countries || [],
  estimated_time: r.estimated_time,
  prerequisites: r.prerequisites || [],
  education_levels: r.education_levels || [],
});

export const escapeCSV = (value: string) => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const toJSONExport = (resources: ExportableResource[]) =>
  JSON.stringify(resources.map(toExportRow), null, 2);

export const toCSVExport = (resources: ExportableResource[]) => {
  const headers = [...EXPORT_FIELDS];
  return [
    headers.join(','),
    ...resources.map(toExportRow).map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (Array.isArray(value)) return escapeCSV(value.join(';'));
          if (typeof value === 'boolean' || typeof value === 'number') return String(value);
          return escapeCSV(String(value));
        })
        .join(',')
    ),
  ].join('\n');
};

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const ARRAY_FIELDS = new Set([
  'related_skills', 'skills', 'relevant_backgrounds', 'target_countries',
  'prerequisites', 'education_levels',
]);

export const parseCSV = (csv: string): Record<string, unknown>[] => {
  // Split on newlines that are not inside a quoted field.
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') inQuotes = !inQuotes;
    if (ch === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else if (ch !== '\r' || inQuotes) {
      current += ch;
    }
  }
  if (current.length) lines.push(current);

  const rows = lines.filter((l) => l.trim());
  if (rows.length < 2) return [];

  const headers = parseCSVLine(rows[0]).map((h) => h.trim().toLowerCase());
  const results: Record<string, unknown>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVLine(rows[i]);
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      if (header === 'is_free' || header === 'is_featured' || header === 'is_active') {
        obj[header] = value === '' ? null : value.toLowerCase() === 'true';
      } else if (header === 'rating' || header === 'avg_rating' || header === 'weighted_rating') {
        obj[header] = value ? parseFloat(value) : null;
      } else if (
        header === 'total_ratings' || header === 'recommend_percent' ||
        header === 'total_votes' || header === 'total_reviews'
      ) {
        obj[header] = value ? parseInt(value, 10) : null;
      } else if (ARRAY_FIELDS.has(header)) {
        obj[header] = value ? value.split(';').map((s) => s.trim()).filter(Boolean) : [];
      } else {
        obj[header] = value || null;
      }
    });
    results.push(obj);
  }

  return results;
};

/**
 * Normalize new-format rows (`category` = "Domains"/"Exams", `subcategory`,
 * `skills`) into DB-shaped rows. Backward compatible with the old format where
 * `category` was already the specific title and `section_type` was set.
 *
 * @param categoryTypes lowercase category name -> admin category type
 */
export const normalizeRow = (
  raw: Record<string, any>,
  categoryTypes: Map<string, string> = new Map()
): Record<string, any> => {
  const row = { ...raw };
  const catRaw = (row.category ?? '').toString().trim();
  const catLower = catRaw.toLowerCase();
  const isNewFormat =
    row.subcategory != null ||
    catLower === 'domains' || catLower === 'domain' ||
    catLower === 'exams' || catLower === 'exam';

  if (isNewFormat) {
    const subcategory = (row.subcategory ?? '').toString().trim();
    if (subcategory) {
      if (catLower.startsWith('exam')) row.section_type = 'exam';
      else if (catLower.startsWith('domain')) row.section_type = 'domain';
      row.category = subcategory;
    }
    delete row.subcategory;
  }

  if (row.skills && !row.related_skills) row.related_skills = row.skills;
  delete row.skills;

  if (row.category) {
    const mapping = resolveCategoryMapping(row.category);
    const knownType = categoryTypes.get(row.category.toString().trim().toLowerCase());
    if (mapping) {
      row.domain = mapping.domain;
      row.subdomain = mapping.subdomain;
    } else if (row.section_type === 'exam' || knownType === 'exam') {
      row.section_type = 'exam';
      row.domain = 'Exam Prep';
      row.subdomain = row.category;
    } else if (knownType) {
      row.section_type = row.section_type || 'domain';
      row.domain = row.category;
      row.subdomain = row.category;
    }
  }
  return row;
};

export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/** Validate + coerce parsed rows into DB-insert shape (mirrors the DB defaults). */
export const validateResources = (
  data: Record<string, any>[],
  fallbackResourceType: string,
  categoryTypes: Map<string, string> = new Map()
): { valid: Record<string, any>[]; errors: string[] } => {
  const valid: Record<string, any>[] = [];
  const errors: string[] = [];

  data.forEach((raw, index) => {
    const item = normalizeRow(raw, categoryTypes);
    const rowNum = index + 1;
    const rowErrors: string[] = [];

    if (!item.title?.trim()) rowErrors.push('title is required');
    if (!item.link?.trim()) rowErrors.push('link is required');
    if (!item.category?.trim()) rowErrors.push('category (or subcategory) is required');
    if (item.category && !item.domain) {
      rowErrors.push(
        `unknown category/subcategory "${item.category}" — no domain mapping found. Add it to CATEGORY_MAPPING or use an existing one.`
      );
    }
    if (item.link && !isValidUrl(item.link)) rowErrors.push('invalid link URL');

    if (rowErrors.length > 0) {
      errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
    } else {
      valid.push({
        title: item.title!.trim(),
        description: item.description?.trim() || '',
        link: item.link!.trim(),
        category: item.category!.trim(),
        difficulty: item.difficulty || 'beginner',
        is_free: item.is_free ?? true,
        icon: item.icon || '📚',
        color: item.color || 'blue',
        related_skills: item.related_skills || [],
        relevant_backgrounds: item.relevant_backgrounds || [],
        provider: item.provider || null,
        duration: item.duration || null,
        rating: item.rating ?? null,
        is_featured: item.is_featured ?? false,
        is_active: item.is_active ?? true,
        resource_type: item.resource_type || fallbackResourceType,
        section_type: item.section_type || 'domain',
        target_countries: item.target_countries || [],
        estimated_time: item.estimated_time || null,
        prerequisites: item.prerequisites || [],
        education_levels: item.education_levels || [],
        domain: item.domain,
        subdomain: item.subdomain,
      });
    }
  });

  return { valid, errors };
};

/**
 * Fresh-schema simulator: applies the same conflict target the real importer
 * relies on (`title,link,category` unique) plus DB column defaults, so the
 * roundtrip test can compare inserted rows to the original dataset.
 */
export const insertIntoFreshSchema = (rows: Record<string, any>[]) => {
  const table = new Map<string, Record<string, any>>();
  let skipped = 0;
  for (const row of rows) {
    const key = `${row.title}|${row.link}|${row.category}`;
    if (table.has(key)) {
      skipped++;
      continue;
    }
    table.set(key, { ...row });
  }
  return { rows: [...table.values()], skipped };
};

/** Field-level diff between two catalog snapshots keyed by title|link|category. */
export interface DriftEntry {
  key: string;
  field: string;
  before: unknown;
  after: unknown;
}

const normalizeValue = (v: unknown) => {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v;
  return String(v);
};

export const diffCatalogs = (
  before: Record<string, any>[],
  after: Record<string, any>[],
  fields: readonly string[] = ROUNDTRIP_COMPARE_FIELDS
): { drift: DriftEntry[]; missing: string[]; extra: string[] } => {
  const keyOf = (r: Record<string, any>) => `${r.title}|${r.link}|${r.category}`;
  const beforeMap = new Map(before.map((r) => [keyOf(r), r]));
  const afterMap = new Map(after.map((r) => [keyOf(r), r]));

  const drift: DriftEntry[] = [];
  const missing: string[] = [];
  for (const [key, b] of beforeMap) {
    const a = afterMap.get(key);
    if (!a) {
      missing.push(key);
      continue;
    }
    for (const field of fields) {
      const bv = JSON.stringify(normalizeValue(b[field]));
      const av = JSON.stringify(normalizeValue(a[field]));
      if (bv !== av) drift.push({ key, field, before: b[field], after: a[field] });
    }
  }
  const extra = [...afterMap.keys()].filter((k) => !beforeMap.has(k));
  return { drift, missing, extra };
};
