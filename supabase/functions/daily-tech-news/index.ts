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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const NEWS_BOT_USER_ID = Deno.env.get("NEWS_BOT_USER_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!GNEWS_API_KEY) throw new Error("GNEWS_API_KEY not configured");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");
    if (!NEWS_BOT_USER_ID) throw new Error("NEWS_BOT_USER_ID not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Deduplication: check if a news post was already created today
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", NEWS_BOT_USER_ID)
      .eq("category", "Tech News")
      .gte("created_at", todayStart.toISOString())
      .limit(1);

    if (existingPost && existingPost.length > 0) {
      console.log("News post already exists for today, skipping.");
      return new Response(
        JSON.stringify({ message: "Already posted today" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Fetch tech news from GNews API
    console.log("GNEWS_API_KEY length:", GNEWS_API_KEY?.length, "first 4 chars:", GNEWS_API_KEY?.substring(0, 4));
    const gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=10&apitoken=${GNEWS_API_KEY}`;
    
    console.log("Fetching news from GNews...");
    console.log("URL (without key):", gnewsUrl.replace(GNEWS_API_KEY, "***"));
    const newsResponse = await fetch(gnewsUrl);
    
    if (!newsResponse.ok) {
      const errText = await newsResponse.text();
      throw new Error(`GNews API error [${newsResponse.status}]: ${errText}`);
    }

    const newsData = await newsResponse.json();
    const articles = newsData.articles || [];

    if (articles.length === 0) {
      console.log("No articles found, skipping post.");
      return new Response(
        JSON.stringify({ message: "No articles found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Build a summary prompt for Gemini
    const articlesList = articles
      .map(
        (a: any, i: number) =>
          `${i + 1}. **${a.title}** — ${a.description || "No description"} (Source: ${a.source?.name || "Unknown"})`
      )
      .join("\n");

    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `You are SkillGram News, a tech news summarizer. Create an engaging, well-formatted post summarizing today's top tech news for a learning community.

Date: ${today}

Here are today's top tech headlines:
${articlesList}

Requirements:
- Start with a catchy title like "🗞️ Daily Tech Digest — ${today}"
- Write a brief 1-2 line intro
- Summarize each major story in 2-3 sentences, highlighting why it matters for tech learners and professionals
- Group related stories if applicable
- End with a brief takeaway or thought-provoking question for the community
- Use emojis sparingly for visual appeal (🔥, 💡, 🚀, 📱, 🤖, etc.)
- Keep the total post under 1500 characters
- Do NOT include any links or URLs
- Format for readability with line breaks between sections`;

    console.log("Sending to Gemini for summarization...");
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      throw new Error(`Gemini API error [${geminiResponse.status}]: ${errText}`);
    }

    const geminiData = await geminiResponse.json();
    const generatedContent =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedContent) {
      throw new Error("Gemini returned empty content");
    }

    // Step 3: Extract title and content
    const lines = generatedContent.trim().split("\n");
    let title = `🗞️ Daily Tech Digest — ${today}`;
    let content = generatedContent;

    // Try to extract the first line as a title if it looks like one
    const firstLine = lines[0].replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
    if (firstLine.length > 10 && firstLine.length < 120) {
      title = firstLine;
      content = lines.slice(1).join("\n").trim();
    }

    // Generate tags from article topics
    const tags = ["Tech News", "Daily Digest"];
    const tagKeywords = ["AI", "Google", "Apple", "Microsoft", "Meta", "Samsung", "Tesla", "SpaceX", "OpenAI", "Startup", "Cybersecurity", "Cloud", "Mobile", "Web"];
    const contentLower = (generatedContent + " " + articlesList).toLowerCase();
    for (const kw of tagKeywords) {
      if (contentLower.includes(kw.toLowerCase()) && tags.length < 6) {
        tags.push(kw);
      }
    }

    // Step 4: Insert post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: NEWS_BOT_USER_ID,
        title: title,
        content: content,
        category: "Tech News",
        tags: tags,
      })
      .select("id")
      .single();

    if (postError) {
      throw new Error(`Failed to insert post: ${postError.message}`);
    }

    console.log(`News post created successfully: ${post.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        post_id: post.id,
        title: title,
        article_count: articles.length,
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
