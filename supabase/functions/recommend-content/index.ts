import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user");
    }

    // Fetch user profile details
    const { data: profileDetails, error: profileError } = await supabase
      .from("user_profile_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError);
    }

    // Fetch recent posts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        category,
        tags,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (postsError) {
      console.error("Posts fetch error:", postsError);
    }

    // Fetch profiles for posts
    const postUserIds = [...new Set((posts || []).map(p => p.user_id))];
    const { data: postProfiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", postUserIds);

    const profilesMap = (postProfiles || []).reduce((acc: any, p: any) => {
      acc[p.user_id] = p;
      return acc;
    }, {});

    // Fetch public roadmaps
    const { data: roadmaps, error: roadmapsError } = await supabase
      .from("roadmaps")
      .select("id, title, description, category, difficulty, technologies, estimated_time")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (roadmapsError) {
      console.error("Roadmaps fetch error:", roadmapsError);
    }

    // Build AI prompt with user context
    const userSkills = profileDetails?.skills || [];
    const experienceLevel = profileDetails?.experience_level || "beginner";
    const learningGoals = profileDetails?.learning_path?.goals || "";
    const background = profileDetails?.learning_path?.background || "";

    const systemPrompt = `You are a personalized content recommendation AI. Analyze user profiles and content to provide relevance scores.
    
User Profile:
- Experience Level: ${experienceLevel}
- Skills: ${userSkills.map((s: any) => s.name || s).join(", ")}
- Background: ${background}
- Learning Goals: ${learningGoals}

Your task: Score each content item (posts and roadmaps) from 0-100 based on:
1. Relevance to user's skills and experience level
2. Alignment with learning goals
3. Appropriate difficulty level
4. Topic interest match

Return ONLY a valid JSON object with this structure:
{
  "posts": [{"id": "uuid", "score": 85, "reason": "brief reason"}],
  "roadmaps": [{"id": "uuid", "score": 90, "reason": "brief reason"}]
}`;

    const contentSummary = `
Posts (${posts?.length || 0} items):
${posts?.slice(0, 20).map(p => `- ID: ${p.id}, Title: ${p.title}, Category: ${p.category || "N/A"}, Tags: ${p.tags?.join(", ") || "none"}`).join("\n")}

Roadmaps (${roadmaps?.length || 0} items):
${roadmaps?.slice(0, 20).map(r => `- ID: ${r.id}, Title: ${r.title}, Category: ${r.category || "N/A"}, Difficulty: ${r.difficulty || "N/A"}, Tech: ${r.technologies?.join(", ") || "none"}`).join("\n")}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Calling Lovable AI for recommendations...");
    
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contentSummary }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error("No content from AI");
    }

    console.log("AI Response:", aiContent);

    // Parse AI response
    let recommendations;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                       aiContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      recommendations = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: return all content with default scores
      recommendations = {
        posts: posts?.slice(0, 10).map(p => ({ id: p.id, score: 50, reason: "Default recommendation" })) || [],
        roadmaps: roadmaps?.slice(0, 10).map(r => ({ id: r.id, score: 50, reason: "Default recommendation" })) || [],
      };
    }

    // Merge scores with full content
    const scoredPosts = (posts || [])
      .map(post => {
        const rec = recommendations.posts?.find((r: any) => r.id === post.id);
        const profile = profilesMap[post.user_id];
        return {
          ...post,
          profiles: profile ? {
            full_name: profile.full_name || 'Anonymous',
            avatar_url: profile.avatar_url,
          } : { full_name: 'Anonymous', avatar_url: null },
          score: rec?.score || 0,
          recommendation_reason: rec?.reason || "",
        };
      })
      .filter(p => p.score > 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    const scoredRoadmaps = (roadmaps || [])
      .map(roadmap => {
        const rec = recommendations.roadmaps?.find((r: any) => r.id === roadmap.id);
        return {
          ...roadmap,
          score: rec?.score || 0,
          recommendation_reason: rec?.reason || "",
        };
      })
      .filter(r => r.score > 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return new Response(
      JSON.stringify({
        posts: scoredPosts,
        roadmaps: scoredRoadmaps,
        userProfile: {
          experienceLevel,
          skills: userSkills,
          learningGoals,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in recommend-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
