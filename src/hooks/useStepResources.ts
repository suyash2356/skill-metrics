import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SkillNode } from './useSkillGraph';

export interface StepResource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  difficulty: string;
  is_free: boolean;
  icon: string | null;
  color: string | null;
  provider: string | null;
  duration: string | null;
  rating: number | null;
  resource_type: string;
  related_skills: string[] | null;
  avg_rating: number | null;
  weighted_rating: number | null;
  total_ratings: number | null;
  recommend_percent: number | null;
}

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

/**
 * Extract meaningful search keywords from a skill-node name.
 *
 * "Statistics and Probability" → ["statistics probability", "statistics", "stati", "stat", "probability", "proba", "prob"]
 * "Deep Learning" → ["deep learning", "deep", "learning", "learn", "lear"]
 *
 * This generates powerful prefixes to catch variations like "stats", "proba", "maths"
 * regardless of how they are written in the resource title.
 */
function extractKeywords(name: string): string[] {
  const full = name.trim().toLowerCase();
  // Split on common separators or punctuation
  const parts = full.split(/[^a-z0-9]+/).filter(Boolean);

  const STOP_WORDS = new Set([
    'basic', 'basics', 'intro', 'introduction', 'advanced', 'intermediate',
    'fundamental', 'fundamentals', 'to', 'of', 'and', 'the', 'in', 'for',
    'with', 'an', 'a', 'on', 'is', 'or', 'not', 'how', 'what', 'why'
  ]);

  // Collect individual meaningful words
  const meaningful = parts.filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const keywords: string[] = [];

  // Add the combined meaningful phrase (e.g., "deep learning")
  if (meaningful.length > 0) {
    keywords.push(meaningful.join(' '));
  }
  
  // Also add the original full string just in case
  keywords.push(full);

  // Add individual meaningful words and their 4-5 letter prefixes
  meaningful.forEach(w => {
    keywords.push(w);
    
    // User requested: extract starting 4-5 letters to catch variations 
    // like statistics -> stat (matches stats), probability -> proba (matches probabilities)
    if (w.length >= 6) {
      keywords.push(w.slice(0, 5)); // "probability" -> "proba"
      keywords.push(w.slice(0, 4)); // "statistics" -> "stat"
    } else if (w.length === 5) {
      keywords.push(w.slice(0, 4)); // "maths" -> "math"
    }
  });

  // Remove duplicates and sort by length descending (so longest keywords are scored first)
  return [...new Set(keywords)].sort((a, b) => b.length - a.length);
}

/**
 * Check whether `text` contains `keyword` as a meaningful match.
 * Handles partial word matches like "mathematics" matching "maths",
 * and "linear algebra" matching "algebra & linear".
 */
function fuzzyMatch(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const t = text.toLowerCase();
  const k = keyword.toLowerCase();

  // Direct substring
  if (t.includes(k)) return true;

  // Handle maths ↔ mathematics
  const ALIASES: Record<string, string[]> = {
    maths: ['math', 'mathematics', 'mathematical'],
    math: ['maths', 'mathematics', 'mathematical'],
    mathematics: ['math', 'maths', 'mathematical'],
    stats: ['statistics', 'statistical'],
    statistics: ['stats', 'statistical'],
    algo: ['algorithm', 'algorithms', 'algorithmic'],
    algorithm: ['algo', 'algorithms', 'algorithmic'],
    algorithms: ['algo', 'algorithm', 'algorithmic'],
    ml: ['machine learning'],
    ai: ['artificial intelligence'],
    dl: ['deep learning'],
    ds: ['data science', 'data structures'],
    db: ['database', 'databases'],
    os: ['operating system', 'operating systems'],
    oop: ['object oriented programming'],
    dsa: ['data structures', 'algorithms'],
  };

  const aliases = ALIASES[k] || [];
  if (aliases.some(a => t.includes(a))) return true;

  // Also check if any alias of each word in keyword matches
  const kParts = k.split(/\s+/);
  if (kParts.length > 1) {
    // For multi-word keywords, check if all significant words appear in text
    const significantParts = kParts.filter(p => p.length > 2);
    if (significantParts.length > 0 && significantParts.every(p => {
      if (t.includes(p)) return true;
      const pAliases = ALIASES[p] || [];
      return pAliases.some(a => t.includes(a));
    })) {
      return true;
    }
  }

  return false;
}

/**
 * Hook: fetch admin-curated resources for a skill-graph step.
 *
 * Simple strategy:
 *  1. Search resources by step-name keywords (title match) AND domain category
 *  2. Sort by difficulty level (beginner → intermediate → advanced)
 */
export function useStepResources(skillNode: SkillNode | null | undefined) {
  const keywords = skillNode ? extractKeywords(skillNode.name) : [];
  const domain = skillNode?.domain || '';
  const nodeSkills: string[] = skillNode
    ? [
        skillNode.name.toLowerCase(),
        ...(skillNode.subdomain ? [skillNode.subdomain.toLowerCase()] : []),
        ...(skillNode.learning_outcomes || []).map(o => o.toLowerCase()),
      ]
    : [];

  return useQuery({
    queryKey: ['step-resources', skillNode?.id, domain],
    queryFn: async () => {
      if (!skillNode || !domain) return [];

      // ── Step 1: Fetch resources matching keywords & step domain ───
      // CRITICAL: scope strictly to this skill's domain (subdomain/category)
      // so a Psychology skill never pulls Web-Dev resources.
      const orFilters = keywords.map(k => `title.ilike.%${k}%`).join(',');
      const skillOverlap = keywords.map(k => `related_skills.cs.{${k}}`).join(',');
      const combinedFilter = [orFilters, skillOverlap].filter(Boolean).join(',');

      let query = supabase
        .from('resources')
        .select('id,title,description,link,category,difficulty,is_free,icon,color,provider,duration,rating,resource_type,related_skills,avg_rating,weighted_rating,total_ratings,recommend_percent')
        .eq('is_active', true)
        // Strict same-domain scoping (matches subdomain OR category)
        .or(`subdomain.ilike.${domain},category.ilike.${domain},subdomain.ilike.%${domain}%,category.ilike.%${domain}%`);

      if (combinedFilter) {
        query = query.or(combinedFilter);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('[useStepResources] query error:', error);
        return [];
      }

      const raw = (data || []) as StepResource[];

      // ── Step 2: Score by keyword relevance ────────────────────────────
      type Scored = StepResource & { _titleMatch: boolean; _skillMatch: boolean; _score: number };

      const scoreResource = (r: StepResource): Scored => {
        let titleMatch = false;
        let skillMatch = false;
        let score = 0;

        // Title keyword matching
        for (const kw of keywords) {
          if (fuzzyMatch(r.title, kw)) {
            titleMatch = true;
            score += kw.length;
          }
        }

        // Description keyword matching (weaker)
        if (!titleMatch) {
          for (const kw of keywords) {
            if (fuzzyMatch(r.description || '', kw)) {
              score += kw.length * 0.3;
            }
          }
        }

        // Skills overlap
        const rSkills = (r.related_skills || []).map(s => s.toLowerCase());
        for (const ns of nodeSkills) {
          for (const rs of rSkills) {
            if (fuzzyMatch(rs, ns) || fuzzyMatch(ns, rs)) {
              skillMatch = true;
              score += 2;
            }
          }
        }

        return { ...r, _titleMatch: titleMatch, _skillMatch: skillMatch, _score: score };
      };

      const scored = raw.map(scoreResource);

      // Title matches first; if none, fall back to skill matches
      let filtered = scored.filter(r => r._titleMatch);
      if (filtered.length === 0) {
        filtered = scored.filter(r => r._skillMatch || r._score > 0);
      }

      // ── Step 3: Sort by difficulty level (beginner → expert) ──────────
      filtered.sort((a, b) => {
        const da = DIFFICULTY_ORDER[a.difficulty?.toLowerCase()] ?? 99;
        const db = DIFFICULTY_ORDER[b.difficulty?.toLowerCase()] ?? 99;
        if (da !== db) return da - db;
        return b._score - a._score;
      });

      return filtered.map(({ _titleMatch, _skillMatch, _score, ...rest }) => rest) as StepResource[];
    },
    enabled: !!skillNode?.id,
    staleTime: 2 * 60 * 1000,
  });
}
