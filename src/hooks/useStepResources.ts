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

/* ─────────────────────────────────────────────────────────────
 *  Tokenizer + alias-expander for token-overlap similarity.
 *  We compare the *step name* against the *resource title*
 *  (and the resource's related skills) using a Jaccard-like
 *  ratio: sharedTokens / stepTokens.
 *  A resource is considered relevant when the ratio is ≥ 0.4
 *  (i.e. at least 40–50 % of the step's meaningful words appear
 *  in the resource).
 * ───────────────────────────────────────────────────────────── */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'for', 'with', 'on', 'at',
  'is', 'are', 'be', 'by', 'from', 'as', 'into', 'this', 'that', 'these',
  'those', 'it', 'its', 'basic', 'basics', 'intro', 'introduction',
  'advanced', 'intermediate', 'fundamental', 'fundamentals', 'complete',
  'guide', 'course', 'tutorial', 'lesson', 'lessons', 'learn', 'learning',
  'crash', 'masterclass', 'full', 'part', 'chapter', 'series', 'video',
  'videos', 'book', 'books', 'using', 'made', 'easy', 'beginner', 'beginners',
  'expert', 'quick', 'you', 'your', 'how', 'what', 'why', 'when', 'not',
]);

const ALIAS_GROUPS: string[][] = [
  ['math', 'maths', 'mathematics', 'mathematical'],
  ['stat', 'stats', 'statistics', 'statistical'],
  ['prob', 'proba', 'probability', 'probabilities', 'probabilistic'],
  ['algo', 'algorithm', 'algorithms', 'algorithmic'],
  ['ml', 'machinelearning'],
  ['ai', 'artificialintelligence'],
  ['dl', 'deeplearning'],
  ['nn', 'neuralnetwork', 'neuralnetworks'],
  ['nlp', 'naturallanguageprocessing'],
  ['cv', 'computervision'],
  ['db', 'database', 'databases'],
  ['os', 'operatingsystem', 'operatingsystems'],
  ['dsa', 'datastructures'],
  ['ds', 'datascience'],
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['py', 'python'],
  ['regression', 'regressions'],
  ['classification', 'classifier', 'classifiers'],
  ['cluster', 'clustering'],
  ['optimization', 'optimisation', 'optimize', 'optimise'],
  ['visualization', 'visualisation', 'visualize', 'visualise', 'viz'],
  ['linear', 'linearity'],
  ['calculus', 'differential', 'integral'],
  ['algebra', 'algebraic'],
]; // each group maps to a canonical token = the first element

const ALIAS_LOOKUP: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const group of ALIAS_GROUPS) {
    const canon = group[0];
    for (const w of group) m[w] = canon;
  }
  return m;
})();

function canonicalize(word: string): string {
  const w = word.toLowerCase();
  if (ALIAS_LOOKUP[w]) return ALIAS_LOOKUP[w];
  // very light stemming: drop trailing "s"/"es"/"ing"/"ion"
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 5 && w.endsWith('ion')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string | null | undefined): Set<string> {
  if (!text) return new Set();
  const raw = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const out = new Set<string>();
  for (const w of raw) {
    if (w.length < 2) continue;
    if (STOP_WORDS.has(w)) continue;
    out.add(canonicalize(w));
  }
  return out;
}

/**
 * Token-overlap ratio: |shared| / |stepTokens|.
 * Falls back to 0 when the step has no meaningful tokens.
 */
function overlapRatio(stepTokens: Set<string>, otherTokens: Set<string>): number {
  if (stepTokens.size === 0) return 0;
  let shared = 0;
  for (const t of stepTokens) if (otherTokens.has(t)) shared++;
  return shared / stepTokens.size;
}

/* ─────────────────────────────────────────────────────────────
 *  Cross-step de-duplication registry.
 *  A single resource must not appear in more than 2 different
 *  steps of the same skill graph. We track (domain → resourceId
 *  → Set<nodeId>) in module scope. Each query first releases the
 *  current node's claim, then re-registers on the chosen items.
 * ───────────────────────────────────────────────────────────── */

const MAX_STEPS_PER_RESOURCE = 2;
const assignments: Map<string, Map<string, Set<string>>> = new Map();

function releaseNode(domain: string, nodeId: string) {
  const domainMap = assignments.get(domain);
  if (!domainMap) return;
  for (const [rid, nodes] of domainMap) {
    if (nodes.delete(nodeId) && nodes.size === 0) domainMap.delete(rid);
  }
}

function canClaim(domain: string, resourceId: string, nodeId: string): boolean {
  const domainMap = assignments.get(domain);
  if (!domainMap) return true;
  const nodes = domainMap.get(resourceId);
  if (!nodes) return true;
  if (nodes.has(nodeId)) return true;
  return nodes.size < MAX_STEPS_PER_RESOURCE;
}

function claim(domain: string, resourceId: string, nodeId: string) {
  let domainMap = assignments.get(domain);
  if (!domainMap) {
    domainMap = new Map();
    assignments.set(domain, domainMap);
  }
  let nodes = domainMap.get(resourceId);
  if (!nodes) {
    nodes = new Set();
    domainMap.set(resourceId, nodes);
  }
  nodes.add(nodeId);
}

/* ─────────────────────────────────────────────────────────────
 *  Hook
 * ───────────────────────────────────────────────────────────── */

export function useStepResources(skillNode: SkillNode | null | undefined) {
  const domain = skillNode?.domain || '';

  return useQuery({
    queryKey: ['step-resources', skillNode?.id, domain],
    queryFn: async () => {
      if (!skillNode || !domain) return [];

      // Step tokens: name + subdomain + learning outcomes (the "identity"
      // of the step). These form the comparison basis.
      const stepText = [
        skillNode.name,
        skillNode.subdomain || '',
        ...(skillNode.learning_outcomes || []),
      ].join(' ');
      const stepTokens = tokenize(stepText);

      // A tighter primary token set derived from the step *name* only.
      // Used to gate matches so that only truly on-topic resources pass.
      const nameTokens = tokenize(skillNode.name);
      if (nameTokens.size === 0) return [];

      // ── Pull the candidate pool: all active resources in this domain ──
      const { data, error } = await supabase
        .from('resources')
        .select(
          'id,title,description,link,category,difficulty,is_free,icon,color,provider,duration,rating,resource_type,related_skills,avg_rating,weighted_rating,total_ratings,recommend_percent,subdomain'
        )
        .eq('is_active', true)
        .or(
          `subdomain.ilike.%${domain}%,category.ilike.%${domain}%,domain.ilike.%${domain}%`
        )
        .limit(500);

      if (error) {
        console.error('[useStepResources] query error:', error);
        return [];
      }

      const raw = (data || []) as (StepResource & { subdomain?: string })[];

      // ── Score every candidate by token-overlap similarity ───────────
      type Scored = StepResource & {
        _nameRatio: number;
        _stepRatio: number;
        _skillRatio: number;
        _score: number;
      };

      const MIN_NAME_RATIO = 0.4; // user's 40–50 % threshold

      const scored: Scored[] = raw.map((r) => {
        const titleTokens = tokenize(r.title);
        const skillTokens = tokenize((r.related_skills || []).join(' '));

        const nameRatio = overlapRatio(nameTokens, titleTokens);
        const stepRatio = overlapRatio(stepTokens, titleTokens);
        const skillRatio = overlapRatio(nameTokens, skillTokens);

        // Small popularity/quality tie-breaker.
        const quality =
          (r.weighted_rating ?? r.avg_rating ?? r.rating ?? 0) / 5;

        const score =
          nameRatio * 3 + stepRatio * 1.5 + skillRatio * 2 + quality * 0.25;

        return {
          ...r,
          _nameRatio: nameRatio,
          _stepRatio: stepRatio,
          _skillRatio: skillRatio,
          _score: score,
        };
      });

      // Primary pass: strict 40 %+ overlap on the step *name*.
      // Fallback pass: strong skills-overlap counts too (≥ 50 %).
      let filtered = scored.filter(
        (r) =>
          r._nameRatio >= MIN_NAME_RATIO ||
          r._skillRatio >= 0.5 ||
          r._stepRatio >= 0.5
      );

      // If nothing matched strictly, relax to any positive overlap so the
      // step still surfaces something useful instead of being empty.
      if (filtered.length === 0) {
        filtered = scored.filter((r) => r._score > 0);
      }

      // ── Rank: relevance → difficulty ladder → quality ───────────────
      filtered.sort((a, b) => {
        if (Math.abs(b._score - a._score) > 0.15) return b._score - a._score;
        const da = DIFFICULTY_ORDER[a.difficulty?.toLowerCase()] ?? 99;
        const db = DIFFICULTY_ORDER[b.difficulty?.toLowerCase()] ?? 99;
        if (da !== db) return da - db;
        return (
          (b.weighted_rating ?? b.avg_rating ?? 0) -
          (a.weighted_rating ?? a.avg_rating ?? 0)
        );
      });

      // ── Cross-step dedup: max 2 different steps per resource ────────
      releaseNode(domain, skillNode.id);
      const final: Scored[] = [];
      for (const r of filtered) {
        if (canClaim(domain, r.id, skillNode.id)) {
          claim(domain, r.id, skillNode.id);
          final.push(r);
        }
      }

      return final.map(
        ({ _nameRatio, _stepRatio, _skillRatio, _score, ...rest }) => rest
      ) as StepResource[];
    },
    enabled: !!skillNode?.id,
    staleTime: 2 * 60 * 1000,
  });
}
