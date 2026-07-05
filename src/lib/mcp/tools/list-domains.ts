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
  name: "list_domains",
  title: "List skill domains",
  description:
    "List distinct learning domains and subdomains available in the platform's curated resource catalog, with resource counts.",
  inputSchema: {
    limit: z.number().int().min(1).max(200).optional().describe("Max domains to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = db();
    const { data, error } = await supabase
      .from("resources")
      .select("domain,subdomain")
      .not("domain", "is", null)
      .limit(5000);
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    const counts = new Map<string, { domain: string; subdomains: Map<string, number>; total: number }>();
    for (const r of data ?? []) {
      const d = (r as any).domain as string;
      if (!d) continue;
      if (!counts.has(d)) counts.set(d, { domain: d, subdomains: new Map(), total: 0 });
      const entry = counts.get(d)!;
      entry.total += 1;
      const s = (r as any).subdomain as string | null;
      if (s) entry.subdomains.set(s, (entry.subdomains.get(s) ?? 0) + 1);
    }
    const out = Array.from(counts.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit ?? 50)
      .map((e) => ({
        domain: e.domain,
        total_resources: e.total,
        subdomains: Array.from(e.subdomains, ([name, count]) => ({ name, count })).sort(
          (a, b) => b.count - a.count,
        ),
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
      structuredContent: { domains: out },
    };
  },
});
