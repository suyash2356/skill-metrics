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
    const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const NEWS_BOT_USER_ID = Deno.env.get("NEWS_BOT_USER_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!GNEWS_API_KEY) throw new Error("GNEWS_API_KEY not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!NEWS_BOT_USER_ID) throw new Error("NEWS_BOT_USER_ID not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 0: Clean up news posts older than 48 hours
    const cutoff48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: oldPosts, error: cleanupQueryError } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", NEWS_BOT_USER_ID)
      .eq("category", "News")
      .lt("created_at", cutoff48h);

    if (!cleanupQueryError && oldPosts && oldPosts.length > 0) {
      const oldIds = oldPosts.map((p: any) => p.id);
      
      // Delete related data first (likes, comments, bookmarks, saved_posts)
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

      if (deleteError) {
        console.error("Failed to cleanup old news posts:", deleteError.message);
      } else {
        console.log(`Cleaned up ${oldIds.length} news posts older than 48 hours`);
      }
    } else {
      console.log("No old news posts to clean up");
    }

    // Deduplication: check if news posts were already created today
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { data: existingPosts } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", NEWS_BOT_USER_ID)
      .eq("category", "News")
      .gte("created_at", todayStart.toISOString())
      .limit(1);

    if (existingPosts && existingPosts.length > 0) {
      console.log("News posts already exist for today, skipping.");
      return new Response(
        JSON.stringify({ message: "Already posted today" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Fetch tech news from GNews API
    const gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=5&apikey=${GNEWS_API_KEY}`;
    console.log("Fetching news from GNews...");
    const newsResponse = await fetch(gnewsUrl);

    if (!newsResponse.ok) {
      const errText = await newsResponse.text();
      throw new Error(`GNews API error [${newsResponse.status}]: ${errText}`);
    }

    const newsData = await newsResponse.json();
    const articles = newsData.articles || [];

    if (articles.length === 0) {
      console.log("No articles found, skipping.");
      return new Response(
        JSON.stringify({ message: "No articles found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Step 2: For each article, generate a unique summary post with AI
    const createdPosts: string[] = [];

    for (const article of articles) {
      try {
        const articleTitle = article.title || "Untitled";
        const articleDesc = article.description || "";
        const articleSource = article.source?.name || "Unknown";
        const articleImage = article.image || null;
        const articleUrl = article.url || "";

        const prompt = `You are SkillGram News, a tech news writer for a learning community. Write an engaging post about this news story.

Headline: ${articleTitle}
Description: ${articleDesc}
Source: ${articleSource}
Date: ${today}

Requirements:
- Write a compelling 2-4 sentence summary explaining what happened and why it matters for tech learners/professionals
- Include your own analysis or takeaway (1-2 sentences)
- Use 1-2 relevant emojis for visual appeal
- Keep total post under 600 characters
- Do NOT include any links or URLs
- Do NOT repeat the headline verbatim as the first line
- Write in an informative but conversational tone`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are SkillGram News, a concise tech news writer." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI error for article "${articleTitle}": ${aiResponse.status}`);
          continue;
        }

        const aiData = await aiResponse.json();
        const summary = aiData.choices?.[0]?.message?.content?.trim();

        if (!summary) {
          console.error(`Empty AI response for article "${articleTitle}"`);
          continue;
        }

        // Build content with image using JSON block format
        const blocks: any[] = [];

        // Add text block
        blocks.push({ type: "paragraph", content: summary });

        // Add image block if available
        if (articleImage) {
          blocks.push({ type: "image", imageUrl: articleImage });
        }

        // Add source attribution
        blocks.push({ type: "paragraph", content: `📰 Source: ${articleSource}` });

        const content = JSON.stringify({
          type: "post",
          blocks,
        });

        // Generate tags from article content
        const tags = ["News"];
        const tagKeywords = ["AI", "Google", "Apple", "Microsoft", "Meta", "Samsung", "Tesla", "SpaceX", "OpenAI", "Startup", "Cybersecurity", "Cloud", "Mobile", "Web", "Chip", "Quantum", "Robotics", "EV"];
        const combinedLower = `${articleTitle} ${articleDesc}`.toLowerCase();
        for (const kw of tagKeywords) {
          if (combinedLower.includes(kw.toLowerCase()) && tags.length < 5) {
            tags.push(kw);
          }
        }

        // Clean up the title - use the original headline
        const postTitle = `📰 ${articleTitle}`;

        // Insert post
        const { data: post, error: postError } = await supabase
          .from("posts")
          .insert({
            user_id: NEWS_BOT_USER_ID,
            title: postTitle.length > 200 ? postTitle.slice(0, 197) + "..." : postTitle,
            content,
            category: "News",
            tags,
          })
          .select("id")
          .single();

        if (postError) {
          console.error(`Failed to insert post for "${articleTitle}": ${postError.message}`);
          continue;
        }

        createdPosts.push(post.id);
        console.log(`Created news post: ${post.id} - ${articleTitle}`);

        // Small delay between posts to space them out in the feed
        await new Promise((r) => setTimeout(r, 2000));
      } catch (articleError) {
        console.error(`Error processing article: ${articleError}`);
        continue;
      }
    }

    console.log(`Created ${createdPosts.length} news posts successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        posts_created: createdPosts.length,
        post_ids: createdPosts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Daily tech news error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
