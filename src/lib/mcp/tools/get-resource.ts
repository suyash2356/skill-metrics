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
  name: "get_resource",
  title: "Get resource details",
  description: "Fetch full details for a single learning resource by its ID.",
  inputSchema: {
    id: z.string().uuid().describe("Resource UUID."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const supabase = db();
    const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { resource: data },
    };
  },
});
