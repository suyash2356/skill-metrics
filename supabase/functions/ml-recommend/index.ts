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
  resource_type?: string | null;
  /** When true, do NOT filter by domain — feed model all admin resources. */
  ignore_domain?: boolean;
}

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  domain: string | null;
  difficulty: string | null;
  related_skills: string[] | null;
  weighted_rating: number | null;
  total_ratings: number | null;
  link: string | null;
  resource_type: string | null;
  section_type: string | null;
  created_at: string | null;
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
    const resourceType = (body.resource_type ?? "").trim().toLowerCase() || null;
    const resourceTypes: string[] | null = Array.isArray((body as any).resource_types) && (body as any).resource_types.length
      ? (body as any).resource_types.map((s: string) => String(s).trim().toLowerCase()).filter(Boolean)
      : null;
    const ignoreDomain = !!body.ignore_domain;

    // 1) User context: preferences + interactions + profile
    const [{ data: prefs }, { data: interactions }, { data: profile }] = await Promise.all([
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
      supabase
        .from("user_profile_details")
        .select("experience_level, skills, interested_domains, interested_subdomains")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const interactionMap = new Map<string, number>();
    (interactions ?? []).forEach((row: any) => {
      interactionMap.set(
        row.item_id,
        (interactionMap.get(row.item_id) ?? 0) + Number(row.score ?? 0),
      );
    });
    const hasInteractions = interactionMap.size > 0;

    const userPrimaryDomain: string | null = ((prefs as any)?.primary_domain as string | null) ?? null;
    const userDomain = ignoreDomain
      ? null
      : (domain || userPrimaryDomain || null);
    const interests: string[] =
      ((prefs as any)?.interests as string[] | null) ?? [];

    const userKeywords = new Set<string>();
    interests.forEach(i => i && userKeywords.add(i.toLowerCase()));

    const userInterestedDomains = new Set<string>();
    const userInterestedSubdomains = new Set<string>();

    if (profile) {
      if (profile.interested_domains && Array.isArray(profile.interested_domains)) {
        profile.interested_domains.forEach((d: string) => userInterestedDomains.add(d.toLowerCase()));
      }
      if (profile.interested_subdomains && Array.isArray(profile.interested_subdomains)) {
        profile.interested_subdomains.forEach((sd: string) => userInterestedSubdomains.add(sd.toLowerCase()));
      }
      if (profile.skills && Array.isArray(profile.skills)) {
        profile.skills.forEach((s: any) => {
          if (s.name) userKeywords.add(s.name.toLowerCase());
        });
      }
    }
    const hasRichProfile = userInterestedDomains.size > 0 || userInterestedSubdomains.size > 0 || !!profile?.experience_level;
    const userExperienceLevel = profile?.experience_level?.toLowerCase() || null;

    // 2) Candidate resources (sourced from admin-managed `resources` table)
    let q = supabase
      .from("resources")
      .select(
        "id, title, description, category, domain, difficulty, related_skills, weighted_rating, total_ratings, link, resource_type, section_type, created_at",
      )
      .eq("is_active", true)
      .limit(800);

    if (userDomain) {
      q = q.or(
        `domain.ilike.%${userDomain}%,category.ilike.%${userDomain}%`,
      );
    }
    if (resourceTypes && resourceTypes.length) {
      q = q.in("resource_type", resourceTypes);
    } else if (resourceType) {
      q = q.ilike("resource_type", resourceType);
    }
    if (query) {
      q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data: rawResources, error: resErr } = await q;
    if (resErr) throw resErr;
    const resources = (rawResources ?? []) as ResourceRow[];

    // Cold-start fallback: pull global popular if filter returned <8
    if (resources.length < 8) {
      let extraQ = supabase
        .from("resources")
        .select(
          "id, title, description, category, domain, difficulty, related_skills, weighted_rating, total_ratings, link, resource_type, section_type, created_at",
        )
        .eq("is_active", true)
        .order("weighted_rating", { ascending: false, nullsFirst: false })
        .limit(50);
      if (resourceTypes && resourceTypes.length) extraQ = extraQ.in("resource_type", resourceTypes);
      else if (resourceType) extraQ = extraQ.ilike("resource_type", resourceType);
      const { data: extra } = await extraQ;
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
    const nowMs = Date.now();
    const cfRaw = resources.map((r) => interactionMap.get(r.id) ?? 0);
    const popRaw = resources.map((r) => Number(r.weighted_rating ?? 0));
    // Freshness: linearly decays over 30 days; resources newer than 30d get >0
    const freshRaw = resources.map((r) => {
      if (!r.created_at) return 0;
      const ageDays = (nowMs - new Date(r.created_at).getTime()) / 86400000;
      if (ageDays < 0) return 1;
      if (ageDays > 30) return 0;
      return 1 - ageDays / 30;
    });
    const contentRaw = resources.map((r) => {
      let s = 0;
      const text = `${r.title} ${r.description ?? ""} ${(r.related_skills ?? []).join(" ")}`.toLowerCase();
      const rDomain = (r.domain ?? "").toLowerCase();
      const rCat = (r.category ?? "").toLowerCase();
      
      // Bonus for exact experience level match
      if (userExperienceLevel && r.difficulty) {
        if (userExperienceLevel === r.difficulty.toLowerCase()) {
          s += 3; // strong boost for exact difficulty match
        }
      }

      // Strong boost for matching explicit interested domains/subdomains
      if (userInterestedDomains.has(rDomain)) {
        s += 6; // massive boost for primary domain match
      }
      
      let subdomainMatch = false;
      userInterestedSubdomains.forEach((sub) => {
        if (rCat.includes(sub) || (r.related_skills && r.related_skills.some((sk: string) => sk.toLowerCase().includes(sub))) || text.includes(sub)) {
          s += 4; // strong boost
          subdomainMatch = true;
        }
      });

      userKeywords.forEach((kw) => {
        if (text.includes(kw) || rDomain.includes(kw) || rCat.includes(kw)) {
          s += 1.5;
        }
      });

      // Always weight the user's onboarding primary_domain heavily — even
      // when ignore_domain is true (explore tabs). Cross-domain results
      // still appear, but same-domain items dominate.
      if (userPrimaryDomain) {
        const pd = userPrimaryDomain.toLowerCase();
        if (rDomain.includes(pd) || rCat.includes(pd) || text.includes(pd)) {
          s += 4; // strong boost
        }
      }
      if (userDomain && rDomain.includes(userDomain.toLowerCase())) s += 1.5;
      if (query && text.includes(query)) s += 2;
      return s;
    });

    const cfZ = zscore(cfRaw);
    const popZ = zscore(popRaw);
    const contentZ = zscore(contentRaw);
    const freshZ = zscore(freshRaw);

    // Weights — emphasize CF when we have signal, otherwise content + popularity.
    // Freshness always gets a meaningful slice so newly-added admin resources
    // surface in recommendations instead of being drowned out by older items
    // that already have ratings or user interactions.
    const wCF = hasInteractions ? 0.45 : 0.0;
    
    // If the user has a rich profile from onboarding but no interactions, we heavily weigh content matching
    // instead of defaulting to popularity. This solves the cold-start problem by deeply personalizing.
    const wContent = hasInteractions ? 0.25 : (hasRichProfile ? 0.55 : 0.45);
    const wPop = hasInteractions ? 0.15 : (hasRichProfile ? 0.25 : 0.35);
    const wFresh = hasInteractions ? 0.15 : 0.2;

    const scored = resources.map((r, i) => {
      const cf = cfZ.get(i) ?? 0;
      const ct = contentZ.get(i) ?? 0;
      const pp = popZ.get(i) ?? 0;
      const fr = freshZ.get(i) ?? 0;
      const score = wCF * cf + wContent * ct + wPop * pp + wFresh * fr;

      const reasons: string[] = [];
      if (cf > 0.5) reasons.push("Based on your activity");
      if (ct > 0.5) {
        if (query) reasons.push("Matches your search");
        else if (userExperienceLevel && userExperienceLevel === r.difficulty?.toLowerCase()) reasons.push("Perfect for your level");
        else reasons.push("Matches your profile");
      }
      if (pp > 0.5) reasons.push("Popular in community");
      if (fr > 0.5) reasons.push("Newly added");
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
