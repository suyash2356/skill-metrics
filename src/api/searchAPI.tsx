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
  "ai",
  "machine learning",
  "data science",
  "data analyst",
  "cyber security",
  "cloud computing",
  "blockchain",
  "software development",
  "full stack development",
  "devops",
  "iot",
  "ar/vr",
  "communication",
  "project management",
  "digital marketing",
  "financial management",
  "emotional intelligence",
  "design",
  "education",
];

// ------------------------------
// 🔹 Search Suggestions
// ------------------------------
export type Suggestion =
  | { kind: "user"; id: string; name: string; avatar?: string }
  | { kind: "skill"; name: string; description?: string; link?: string }
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

  const perKind = Math.max(3, Math.floor(limit / 3));

  const skills: Suggestion[] = allowedTopics
    .filter((s) => s.toLowerCase().includes(q.toLowerCase()))
    .slice(0, perKind)
    .map((s) => ({ kind: "skill", name: s }));

  // Fetch categories from database resources
  const { data: dbResources } = await supabase
    .from('resources')
    .select('category, title, link, description')
    .ilike('title', `%${q}%`)
    .eq('is_active', true)
    .limit(perKind);

  const exploreItems: Suggestion[] = (dbResources || []).map((r) => ({
    kind: "explore" as const,
    name: r.title,
    subtype: "resource" as const,
    link: r.link,
    description: r.description,
  }));

  return [...skills, ...exploreItems].slice(0, limit);
}

export async function fetchSearchSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const people = await fetchPeopleCommunitySuggestions(query, Math.max(3, Math.floor(limit / 2)));
  const explore = await fetchExploreSuggestions(query, Math.max(3, Math.floor(limit / 2)));
  return [...people, ...explore].slice(0, limit);
}

// ------------------------------
// 🔹 Recommendations from Database
// ------------------------------
export async function fetchRecommendations(query: string): Promise<Recommendation[]> {
  const lowerQuery = query.toLowerCase();
  const recommendations: Recommendation[] = [];

  // Fetch from database - match by category or related_skills
  const { data: dbResources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('is_active', true)
    .or(`category.ilike.%${lowerQuery}%,title.ilike.%${lowerQuery}%,related_skills.cs.{${query}}`);

  if (!error && dbResources) {
    dbResources.forEach((resource) => {
      // Determine type based on provider/link
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