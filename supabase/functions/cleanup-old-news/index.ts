import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NEWS_BOT_USER_ID = Deno.env.get("NEWS_BOT_USER_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!NEWS_BOT_USER_ID) throw new Error("NEWS_BOT_USER_ID not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: oldPosts, error: queryError } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", NEWS_BOT_USER_ID)
      .eq("category", "News")
      .lt("created_at", cutoff);

    if (queryError) throw queryError;

    if (!oldPosts || oldPosts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No old news posts to clean up", deleted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const oldIds = oldPosts.map((p: any) => p.id);

    // Delete related records first
    for (const id of oldIds) {
      await supabase.from("likes").delete().eq("post_id", id);
      await supabase.from("comments").delete().eq("post_id", id);
      await supabase.from("bookmarks").delete().eq("post_id", id);
      await supabase.from("saved_posts").delete().eq("post_id", id);
      await supabase.from("post_preferences").delete().eq("post_id", id);
      await supabase.from("post_reports").delete().eq("post_id", id);
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .in("id", oldIds);

    if (deleteError) throw deleteError;

    console.log(`Deleted ${oldIds.length} news posts older than 48 hours`);

    return new Response(
      JSON.stringify({ success: true, deleted: oldIds.length, post_ids: oldIds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cleanup error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
