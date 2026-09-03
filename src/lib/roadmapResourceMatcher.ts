export interface RoadmapResourceCandidate {
  id: string;
  title: string;
  description?: string | null;
  link: string;
  category?: string | null;
  domain?: string | null;
  subdomain?: string | null;
  difficulty?: string | null;
  resource_type?: string | null;
  related_skills?: string[] | null;
  learning_outcomes?: string[] | null;
  duration?: string | null;
  provider?: string | null;
  weighted_rating?: number | null;
  quality_score?: number | null;
}

export interface RoadmapStepForMatching {
  title: string;
  description?: string | null;
  topics?: string[] | null;
  learningObjectives?: string[] | null;
  whatToLearn?: string[] | null;
  tasks?: Array<{ title?: string; description?: string }> | null;
}

export interface RoadmapResourceMatch {
  id: string;
  title: string;
  url: string;
  type: string;
  duration: string | null;
  difficulty: string | null;
  provider: string | null;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "for", "in", "on", "with", "from", "by",
  "this", "that", "these", "those", "into", "using", "use", "learn", "learning", "understand",
  "understanding", "introduction", "intro", "basics", "basic", "fundamentals", "fundamental",
  "beginner", "intermediate", "advanced", "month", "week", "weeks", "phase", "step", "build",
  "create", "complete", "project", "projects", "skills", "skill", "concepts", "concept",
]);

const ALIASES: Record<string, string> = {
  "ml": "machine learning",
  "ai": "artificial intelligence",
  "ds": "data science",
  "dsa": "data structures algorithms",
  "frontend": "front end",
  "backend": "back end",
  "js": "javascript",
  "ts": "typescript",
  "sql": "database",
};

function stem(token: string): string {
  if (token.length > 6 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 5 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 5 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function expand(text: string): string[] {
  const normalized = (text || "").toLowerCase().replace(/[^a-z0-9+#.]+/g, " ");
  const rawTokens = normalized.split(/\s+/).filter(Boolean);
  const expanded = rawTokens.flatMap((token) => {
    const alias = ALIASES[token];
    return alias ? [token, ...alias.split(" ")] : [token];
  });
  return [...new Set(expanded.map(stem).filter((token) => token.length >= 3 && !STOPWORDS.has(token)))];
}

function textParts(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return typeof value === "string" ? [value] : [];
}

function overlap(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  left.forEach((token) => {
    if (right.has(token)) shared += 1;
  });
  return shared / Math.min(left.size, right.size);
}

function typeForResource(resourceType?: string | null): string {
  const type = (resourceType || "article").toLowerCase();
  if (type === "exam_prep") return "course";
  if (type === "tutorial") return "article";
  return type;
}

function scoreCandidate(
  resource: RoadmapResourceCandidate,
  step: RoadmapStepForMatching,
  focusAreas: string[],
  roadmapTitle: string,
): number {
  const stepTitleTokens = new Set(expand(step.title));
  const stepContextTokens = new Set(expand([
    step.title,
    step.description || "",
    ...textParts(step.topics),
    ...textParts(step.learningObjectives),
    ...textParts(step.whatToLearn),
    ...(step.tasks || []).flatMap((task) => [task.title || "", task.description || ""]),
  ].join(" ")));
  const titleTokens = new Set(expand(resource.title));
  const resourceTokens = new Set(expand([
    resource.title,
    resource.description || "",
    resource.category || "",
    resource.subdomain || "",
    ...textParts(resource.related_skills),
    ...textParts(resource.learning_outcomes),
  ].join(" ")));
  const focusTokens = new Set(expand([roadmapTitle, ...focusAreas].join(" ")));

  const titleOverlap = overlap(stepTitleTokens, titleTokens);
  const contextOverlap = overlap(stepContextTokens, resourceTokens);
  const focusOverlap = overlap(focusTokens, new Set(expand([
    resource.domain || "",
    resource.subdomain || "",
    resource.category || "",
  ].join(" "))));

  // A resource must be about the step itself. Domain/category matches alone never qualify.
  const titleGate = titleOverlap >= 0.4 || [...stepTitleTokens].some((token) => token.length >= 5 && titleTokens.has(token));
  const contextGate = contextOverlap >= 0.4;
  if (!titleGate && !contextGate) return -1;
  if (focusAreas.length > 0 && focusOverlap === 0) return -1;

  const rating = Math.min(5, Math.max(0, Number(resource.weighted_rating || resource.quality_score || 0)));
  return titleOverlap * 60 + contextOverlap * 25 + focusOverlap * 15 + rating;
}

/**
 * Matches every generated step against active admin resources. The same catalog
 * resource can be used at most twice across a roadmap, and no AI-provided URL is
 * accepted by this function.
 */
export function matchRoadmapResources(
  resources: RoadmapResourceCandidate[],
  steps: RoadmapStepForMatching[],
  options: { focusAreas: string[]; roadmapTitle: string; maxPerStep?: number },
): RoadmapResourceMatch[][] {
  const usage = new Map<string, number>();
  const maxPerStep = options.maxPerStep ?? 5;

  return steps.map((step) => resources
    .map((resource) => ({ resource, score: scoreCandidate(resource, step, options.focusAreas, options.roadmapTitle) }))
    .filter(({ resource, score }) => score >= 0 && (usage.get(resource.id) || 0) < 2)
    .sort((left, right) => right.score - left.score)
    .slice(0, maxPerStep)
    .map(({ resource }) => {
      usage.set(resource.id, (usage.get(resource.id) || 0) + 1);
      return {
        id: resource.id,
        title: resource.title,
        url: resource.link,
        type: typeForResource(resource.resource_type),
        duration: resource.duration || null,
        difficulty: resource.difficulty || null,
        provider: resource.provider || null,
      };
    }));
}