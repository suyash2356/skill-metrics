// ml-recommend: Hybrid recommendation endpoint
// Blends collaborative (interactions_ml), content (tags/domain match), and
// popularity (weighted_rating) signals. Falls back to popular-in-domain
// for cold-start users. Designed to back home/explore/search recommendation UIs.
declare const Deno: any;

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface ReqBody {
  domain?: string | null;
  surface?: "home" | "explore" | "search" | "skill";
  query?: string | null;
  limit?: number;
}

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  domain: string | null;
  difficulty: string | null;
  tags: string[] | null;
  weighted_rating: number | null;
  total_ratings: number | null;
  link: string | null;
}

function zscore(values: number[]): Map<number, number> {
  const m = new Map<number, number>();
  if (!values.length) return m;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance) || 1;
  values.forEach((v, i) => m.set(i, (v - mean) / std));
  return m;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) throw new Error("Invalid user");

    const body: ReqBody = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const domain = body.domain ?? null;
    const surface = body.surface ?? "home";
    const query = (body.query ?? "").trim().toLowerCase();
    const limit = Math.min(Math.max(body.limit ?? 12, 1), 50);

    // 1) User context: preferences + interactions
    const [{ data: prefs }, { data: interactions }] = await Promise.all([
      supabase
        .from("user_preferences")
        .select("primary_domain, interests")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("interactions_ml")
        .select("item_id, score")
        .eq("user_id", user.id)
        .limit(2000),
    ]);

    const interactionMap = new Map<string, number>();
    (interactions ?? []).forEach((row: any) => {
      interactionMap.set(
        row.item_id,
        (interactionMap.get(row.item_id) ?? 0) + Number(row.score ?? 0),
      );
    });
    const hasInteractions = interactionMap.size > 0;

    const userDomain =
      domain || (prefs as any)?.primary_domain || null;
    const interests: string[] =
      ((prefs as any)?.interests as string[] | null) ?? [];

    // 2) Candidate resources
    let q = supabase
      .from("resources")
      .select(
        "id, title, description, category, domain, difficulty, tags, weighted_rating, total_ratings, link",
      )
      .eq("is_active", true)
      .limit(400);

    if (userDomain) {
      q = q.or(
        `domain.ilike.%${userDomain}%,category.ilike.%${userDomain}%`,
      );
    }
    if (query) {
      q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data: rawResources, error: resErr } = await q;
    if (resErr) throw resErr;
    let resources = (rawResources ?? []) as ResourceRow[];

    // Cold-start fallback: pull global popular if domain filter returned <8
    if (resources.length < 8) {
      const { data: extra } = await supabase
        .from("resources")
        .select(
          "id, title, description, category, domain, difficulty, tags, weighted_rating, total_ratings, link",
        )
        .eq("is_active", true)
        .order("weighted_rating", { ascending: false, nullsFirst: false })
        .limit(50);
      const seen = new Set(resources.map((r) => r.id));
      (extra ?? []).forEach((r: any) => {
        if (!seen.has(r.id)) resources.push(r as ResourceRow);
      });
    }

    if (resources.length === 0) {
      return new Response(
        JSON.stringify({ items: [], reason: "no_candidates" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 3) Score components
    const cfRaw = resources.map((r) => interactionMap.get(r.id) ?? 0);
    const popRaw = resources.map((r) => Number(r.weighted_rating ?? 0));
    const contentRaw = resources.map((r) => {
      let s = 0;
      const text = `${r.title} ${r.description ?? ""} ${(r.tags ?? []).join(" ")}`.toLowerCase();
      interests.forEach((it) => {
        if (it && text.includes(it.toLowerCase())) s += 1;
      });
      if (userDomain && (r.domain ?? "").toLowerCase().includes(userDomain.toLowerCase())) s += 1.5;
      if (query && text.includes(query)) s += 2;
      return s;
    });

    const cfZ = zscore(cfRaw);
    const popZ = zscore(popRaw);
    const contentZ = zscore(contentRaw);

    // Weights — emphasize CF when we have signal, otherwise content + popularity
    const wCF = hasInteractions ? 0.55 : 0.0;
    const wContent = hasInteractions ? 0.25 : 0.55;
    const wPop = hasInteractions ? 0.2 : 0.45;

    const scored = resources.map((r, i) => {
      const cf = cfZ.get(i) ?? 0;
      const ct = contentZ.get(i) ?? 0;
      const pp = popZ.get(i) ?? 0;
      const score = wCF * cf + wContent * ct + wPop * pp;

      const reasons: string[] = [];
      if (cf > 0.5) reasons.push("Based on your activity");
      if (ct > 0.5) {
        if (query) reasons.push("Matches your search");
        else reasons.push("Matches your interests");
      }
      if (pp > 0.5) reasons.push("Popular in community");
      if (reasons.length === 0) reasons.push("Recommended for you");

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        link: r.link,
        category: r.category,
        domain: r.domain,
        difficulty: r.difficulty,
        weighted_rating: r.weighted_rating,
        total_ratings: r.total_ratings,
        score: Number(score.toFixed(4)),
        reason: reasons[0],
        reasons,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const items = scored.slice(0, limit);

    return new Response(
      JSON.stringify({
        items,
        meta: {
          surface,
          mode: hasInteractions ? "hybrid" : "cold_start",
          domain: userDomain,
          candidate_count: resources.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ml-recommend error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
