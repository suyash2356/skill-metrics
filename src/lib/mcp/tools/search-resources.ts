import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "search_resources",
  title: "Search learning resources",
  description:
    "Search the app's admin-curated learning resources (courses, videos, degrees, certifications, books, blogs, papers, tools, projects). Filter by free-text query, domain, subdomain, category, or difficulty.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free-text search over title and description."),
    domain: z.string().trim().optional().describe("Domain name, e.g. 'Machine Learning'."),
    subdomain: z.string().trim().optional().describe("Subdomain name."),
    category: z.string().trim().optional().describe("Resource category, e.g. 'Course', 'Video', 'Certification'."),
    difficulty: z.string().trim().optional().describe("Difficulty level, e.g. 'Beginner', 'Intermediate', 'Advanced'."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, domain, subdomain, category, difficulty, limit }) => {
    const supabase = db();
    let q = supabase
      .from("resources")
      .select("id,title,description,link,category,domain,subdomain,difficulty,weighted_rating,total_ratings")
      .order("weighted_rating", { ascending: false, nullsFirst: false })
      .limit(limit ?? 10);
    if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    if (domain) q = q.ilike("domain", `%${domain}%`);
    if (subdomain) q = q.ilike("subdomain", `%${subdomain}%`);
    if (category) q = q.ilike("category", `%${category}%`);
    if (difficulty) q = q.ilike("difficulty", `%${difficulty}%`);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { results: data ?? [], count: data?.length ?? 0 },
    };
  },
});
