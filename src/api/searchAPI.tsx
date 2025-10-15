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
  "cyber security",
  "cloud computing",
  "blockchain",
  "software development",
  "design",
  "digital marketing",
  "finance",
  "education",
];

// ------------------------------
// 🔹 Local Resource Data (Example: AI)
// ------------------------------
const localResources: Record<string, Recommendation[]> = {
  ai: [
    {
      type: "course",
      title: "AI for Everyone – Andrew Ng (Coursera)",
      description: "A non-technical introduction to artificial intelligence.",
      provider: "Coursera",
      url: "https://www.coursera.org/learn/ai-for-everyone",
      rating: 4.9,
      views: "2.4M learners",
      difficulty: "beginner",
      isPaid: false,
    },
    {
      type: "youtube",
      title: "Learn AI in 10 Minutes",
      description: "Quick overview of how artificial intelligence works.",
      provider: "YouTube",
      url: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
      views: "4.8M",
      rating: 4.8,
      isPaid: false,
      difficulty: "beginner",
    },
    {
      type: "book",
      title: "Artificial Intelligence: A Modern Approach",
      description: "The most popular AI textbook by Stuart Russell and Peter Norvig.",
      provider: "Pearson",
      url: "https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003578/9780134610993",
      rating: 4.7,
      views: "120K+ readers",
      isPaid: true,
      difficulty: "advanced",
    },
  ],
};

// ------------------------------
// 🔹 Search Suggestions
// ------------------------------
export type Suggestion =
  | { kind: "user"; id: string; name: string; avatar?: string }
  | { kind: "community"; id: string; name: string; image?: string }
  | { kind: "skill"; name: string };

const suggestionCache: Record<string, Suggestion[]> = {};

export async function fetchSearchSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];
  if (suggestionCache[q]) return suggestionCache[q];

  const prefix = `${q}%`;
  const contains = `%${q}%`;
  const perKind = Math.max(2, Math.floor(limit / 3));

  const [profilesRes, communitiesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .or(`full_name.ilike.${prefix},full_name.ilike.${contains}`)
      .limit(perKind),
    supabase
      .from("communities")
      .select("id, name, image")
      .or(`name.ilike.${prefix},name.ilike.${contains}`)
      .limit(perKind),
  ]);

  const suggestions: Suggestion[] = [];

  if (profilesRes.data) {
    profilesRes.data.forEach((p) => {
      suggestions.push({
        kind: "user",
        id: p.user_id,
        name: p.full_name || p.user_id,
        avatar: p.avatar_url,
      });
    });
  }

  if (communitiesRes.data) {
    communitiesRes.data.forEach((c) => {
      suggestions.push({
        kind: "community",
        id: c.id,
        name: c.name,
        image: c.image,
      });
    });
  }

    const skills: Suggestion[] = allowedTopics
      .filter((s) => s.toLowerCase().startsWith(q.toLowerCase()))
      .slice(0, perKind)
      .map((s) => ({ kind: "skill", name: s }));

    const all: Suggestion[] = [...suggestions, ...skills].slice(0, limit);
    suggestionCache[q] = all;
    return all;
}

// ------------------------------
// 🔹 Recommendations (YouTube, Books, + Local Resources)
// ------------------------------
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export async function fetchRecommendations(query: string): Promise<Recommendation[]> {
  const lowerQuery = query.toLowerCase();
  let recommendations: Recommendation[] = [];

  // Add local resources first (e.g., AI)
  if (localResources[lowerQuery]) {
    recommendations = [...recommendations, ...localResources[lowerQuery]];
  }

  try {
    const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        type: "channel",
        maxResults: 5,
      },
    });
    ytRes.data.items.forEach((item: any) => {
      recommendations.push({
        type: "youtube",
        title: item.snippet.title,
        description: item.snippet.description,
        provider: "YouTube",
        url: `https://www.youtube.com/channel/${item.id.channelId}`,
        views: `${Math.floor(Math.random() * 1000)}K+`, // mock views
        rating: 4 + Math.random(),
        isPaid: false,
      });
    });
  } catch (e) {
    console.error("YouTube API Error:", e);
  }

  try {
    const booksRes = await axios.get(GOOGLE_BOOKS_API, { params: { q: query, maxResults: 5 } });
    booksRes.data.items?.forEach((item: any) => {
      recommendations.push({
        type: "book",
        title: item.volumeInfo.title,
        description: item.volumeInfo.description,
        author: item.volumeInfo.authors?.join(", "),
        provider: "Google Books",
        url: item.volumeInfo.infoLink,
        rating: 4 + Math.random(),
        isPaid: Math.random() > 0.7,
        views: `${Math.floor(Math.random() * 50)}K+ readers`,
      });
    });
  } catch (e) {
    console.error("Books API Error:", e);
  }

  return recommendations;
}
