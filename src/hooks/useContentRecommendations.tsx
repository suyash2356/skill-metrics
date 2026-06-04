import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ContentRecommendation {
  title: string;
  domain: string;
  subdomain: string;
  difficulty: string;
  resource_type: string;
  similarity_score: number;
  popularity_score: number;
  hybrid_score: number;
  // Enriched from Supabase:
  id?: string;
  link?: string;
  description?: string;
  provider?: string;
  avg_rating?: number | null;
  total_ratings?: number | null;
  is_free?: boolean;
}

interface ContentRecommendResponse {
  domain: string;
  recommendations: ContentRecommendation[];
}

// ─── ML Backend URL ──────────────────────────────────────────────────────────

const ML_API_BASE = 'http://localhost:8000';

// ─── Fetcher ─────────────────────────────────────────────────────────────────

async function fetchContentRecommendations(
  domain: string,
  topK: number = 8,
): Promise<ContentRecommendation[]> {
  try {
    // 1. Fetch from FastAPI ML backend
    const url = `${ML_API_BASE}/content-recommend?domain=${encodeURIComponent(domain)}&top_k=${topK}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`);
    }

    const data: ContentRecommendResponse = await response.json();
    const recommendations = data.recommendations || [];

    if (recommendations.length === 0) return [];

    // 2. Enrich with Supabase resource data (get id, link, description, etc.)
    const titles = recommendations.map((r) => r.title);
    const { data: dbResources } = await supabase
      .from('resources')
      .select('id, title, link, description, provider, avg_rating, total_ratings, is_free, resource_type')
      .eq('is_active', true)
      .in('title', titles);

    // Build a title→resource lookup
    const titleToResource: Record<string, any> = {};
    (dbResources || []).forEach((r: any) => {
      // Use first match per title (in case of duplicates)
      if (!titleToResource[r.title]) {
        titleToResource[r.title] = r;
      }
    });

    // 3. Merge ML recommendations with Supabase data
    return recommendations.map((rec) => {
      const dbRes = titleToResource[rec.title];
      return {
        ...rec,
        id: dbRes?.id,
        link: dbRes?.link,
        description: dbRes?.description,
        provider: dbRes?.provider,
        avg_rating: dbRes?.avg_rating,
        total_ratings: dbRes?.total_ratings,
        is_free: dbRes?.is_free,
        resource_type: dbRes?.resource_type || rec.resource_type,
      };
    });
  } catch (err) {
    console.warn('[content-recommend] Failed to fetch:', err);
    return [];
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Fetches TF-IDF content-based recommendations blended with popularity
 * for a given domain. Used in the Resources tab → "All" section.
 * Gracefully returns empty array if ML backend is unavailable.
 */
export function useContentRecommendations(domain: string | undefined, topK: number = 8) {
  return useQuery({
    queryKey: ['content_recommendations', domain, topK],
    queryFn: () => fetchContentRecommendations(domain!, topK),
    enabled: !!domain && domain.length > 0,
    staleTime: 120_000, // 2 minutes
    retry: 1, // Only retry once (ML backend may be down)
    retryDelay: 1000,
  });
}
