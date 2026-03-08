// api/searchAPI.ts
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

// ------------------------------
// 🔹 Types
// ------------------------------
export type Recommendation = {
  type: "youtube" | "book" | "course" | "website" | "reddit" | "discord" | "blog";
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  duration?: string;
  rating?: number;
  url: string;
  views?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isPaid?: boolean;
};

export const allowedTopics = [
  // Tech
  "ai", "machine learning", "data science", "data analyst",
  "cyber security", "cloud computing", "blockchain",
  "software development", "full stack development", "devops",
  "iot", "ar/vr", "web development", "mobile development",
  "game development", "computer vision", "robotics",
  // Creative & Arts
  "graphic design", "ui/ux design", "illustration",
  "photography", "video editing", "animation",
  "music production", "creative writing", "fashion design",
  "interior design", "fine arts", "painting", "sculpture",
  "digital art", "filmmaking", "acting", "dance",
  // Business & Finance
  "financial management", "accounting", "investment",
  "stock market", "personal finance", "entrepreneurship",
  "business strategy", "marketing", "digital marketing",
  "sales", "supply chain", "real estate",
  // Communication & Leadership
  "communication", "public speaking", "leadership",
  "project management", "emotional intelligence",
  "negotiation", "team management", "conflict resolution",
  // Health & Wellness
  "nutrition", "fitness", "mental health", "yoga",
  "meditation", "healthcare management",
  // Education & Language
  "education", "teaching", "language learning",
  "english", "spanish", "french", "german", "japanese",
  // Science & Engineering
  "physics", "chemistry", "biology", "mathematics",
  "civil engineering", "mechanical engineering",
  "electrical engineering", "environmental science",
  // Law & Social Sciences
  "law", "psychology", "sociology", "political science",
  "economics", "philosophy", "history",
];

// ------------------------------
// 🔹 Search Suggestions
// ------------------------------
export type Suggestion =
  | { kind: "user"; id: string; name: string; avatar?: string }
  | { kind: "skill"; name: string; description?: string; link?: string }
  | { kind: "domain"; name: string; description?: string; resourceCount?: number; category?: string }
  | { kind: "explore"; name: string; subtype?: "certification" | "category" | "path" | "resource" | "degree"; description?: string; link?: string };

const suggestionCache: Record<string, Suggestion[]> = {};

export async function fetchPeopleCommunitySuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];
  if (suggestionCache[`people:${q}`]) return suggestionCache[`people:${q}`];

  const { data: profilesData, error } = await supabase
    .rpc('search_profiles', { search_query: q, result_limit: limit });

  const suggestions: Suggestion[] = [];

  if (!error && profilesData) {
    profilesData.forEach((p: { user_id: string; full_name: string | null; avatar_url: string | null }) => {
      suggestions.push({
        kind: "user",
        id: p.user_id,
        name: p.full_name || p.user_id,
        avatar: p.avatar_url ?? undefined,
      });
    });
  }

  const all = suggestions.slice(0, limit);
  suggestionCache[`people:${q}`] = all;
  return all;
}

export async function fetchExploreSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];

  const perKind = Math.max(2, Math.floor(limit / 4));

  // Domain/skill matches from allowedTopics
  const skills: Suggestion[] = allowedTopics
    .filter((s) => s.toLowerCase().includes(q.toLowerCase()))
    .slice(0, perKind)
    .map((s) => ({ kind: "skill", name: s }));

  // Fetch domain categories, resources and community resources in parallel
  const [{ data: categories }, { data: dbResources }, { data: communityResources }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, description, type, icon, color')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(perKind),
    supabase
      .from('resources')
      .select('id, category, title, link, description')
      .ilike('title', `%${q}%`)
      .eq('is_active', true)
      .limit(perKind),
    supabase
      .from('user_resources')
      .select('id, category, title, link, description')
      .ilike('title', `%${q}%`)
      .eq('status', 'approved')
      .eq('is_active', true)
      .limit(perKind),
  ]);

  // Domain/category matches
  const domainItems: Suggestion[] = (categories || []).map((c) => ({
    kind: "domain" as const,
    name: c.name,
    description: c.description || `Explore ${c.name} resources`,
    category: c.type,
  }));

  // Also add unique resource categories as domain suggestions
  const resourceCategories = new Set<string>();
  (dbResources || []).forEach((r) => {
    if (r.category && r.category.toLowerCase().includes(q.toLowerCase())) {
      resourceCategories.add(r.category);
    }
  });
  const categoryDomains: Suggestion[] = [...resourceCategories]
    .filter((cat) => !domainItems.some((d) => d.name.toLowerCase() === cat.toLowerCase()))
    .slice(0, 2)
    .map((cat) => ({
      kind: "domain" as const,
      name: cat,
      description: `Browse all ${cat} resources`,
    }));

  const exploreItems: Suggestion[] = (dbResources || []).map((r) => ({
    kind: "explore" as const,
    name: r.title,
    subtype: "resource" as const,
    link: r.link,
    description: r.description,
  }));

  const communityItems: Suggestion[] = (communityResources || []).map((r) => ({
    kind: "explore" as const,
    name: r.title,
    subtype: "resource" as const,
    link: r.link,
    description: r.description,
  }));

  return [...skills, ...domainItems, ...categoryDomains, ...exploreItems, ...communityItems].slice(0, limit);
}

export async function fetchSearchSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const people = await fetchPeopleCommunitySuggestions(query, Math.max(3, Math.floor(limit / 2)));
  const explore = await fetchExploreSuggestions(query, Math.max(3, Math.floor(limit / 2)));
  return [...people, ...explore].slice(0, limit);
}

// ------------------------------
// 🔹 Recommendations from Database
// ------------------------------
export type UniversalSearchResults = {
  resources: any[];
  communityResources: any[];
  people: Suggestion[];
};

export async function fetchUniversalSearch(query: string, limit = 30): Promise<UniversalSearchResults> {
  const q = query.trim();
  if (!q) return { resources: [], communityResources: [], people: [] };

  const resourceLimit = Math.ceil(limit * 0.5);
  const communityLimit = Math.ceil(limit * 0.3);
  const peopleLimit = Math.ceil(limit * 0.2);

  // Run all queries in parallel
  const [resourcesRes, communityRes, peopleRes] = await Promise.all([
    supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%,related_skills.cs.{${q}}`)
      .order('weighted_rating', { ascending: false, nullsFirst: false })
      .order('avg_rating', { ascending: false, nullsFirst: false })
      .limit(resourceLimit),

    supabase
      .from('user_resources')
      .select('*')
      .eq('status', 'approved')
      .eq('is_active', true)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
      .order('avg_rating', { ascending: false, nullsFirst: false })
      .order('view_count', { ascending: false })
      .limit(communityLimit),

    supabase.rpc('search_profiles', { search_query: q, result_limit: peopleLimit }),
  ]);

  const people: Suggestion[] = (peopleRes.data || []).map((p: any) => ({
    kind: 'user' as const,
    id: p.user_id,
    name: p.full_name || p.user_id,
    avatar: p.avatar_url ?? undefined,
  }));

  return {
    resources: resourcesRes.data || [],
    communityResources: communityRes.data || [],
    people,
  };
}

export async function fetchRecommendations(query: string): Promise<Recommendation[]> {
  const lowerQuery = query.toLowerCase();
  const recommendations: Recommendation[] = [];

  const { data: dbResources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('is_active', true)
    .or(`category.ilike.%${lowerQuery}%,title.ilike.%${lowerQuery}%,related_skills.cs.{${query}}`);

  if (!error && dbResources) {
    dbResources.forEach((resource) => {
      let type: Recommendation['type'] = 'website';
      const providerLower = (resource.provider || '').toLowerCase();
      const linkLower = (resource.link || '').toLowerCase();
      
      if (linkLower.includes('youtube.com') || providerLower.includes('youtube')) {
        type = 'youtube';
      } else if (providerLower.includes('coursera') || providerLower.includes('udemy') || providerLower.includes('edx')) {
        type = 'course';
      } else if (providerLower.includes('o\'reilly') || linkLower.includes('book') || providerLower.includes('author')) {
        type = 'book';
      }

      recommendations.push({
        type,
        title: resource.title,
        description: resource.description,
        provider: resource.provider || undefined,
        url: resource.link,
        rating: resource.rating || undefined,
        difficulty: resource.difficulty as Recommendation['difficulty'],
        isPaid: !resource.is_free,
        duration: resource.duration || undefined,
      });
    });
  }

  return recommendations;
}