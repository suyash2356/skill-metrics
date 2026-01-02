declare const Deno: any;

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Skill {
  name?: string;
  [key: string]: any;
}

interface LearningPath {
  goals?: string;
  background?: string;
}

interface UserProfileDetails {
  skills?: (Skill | string)[];
  experience_level?: string;
  learning_path?: LearningPath;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
  score?: number;
  recommendation_reason?: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  technologies: string[];
  estimated_time: string;
  is_public: boolean;
  score?: number;
  recommendation_reason?: string;
}

interface RecommendedItem {
  id: string;
  score: number;
  reason: string;
}

interface Recommendations {
  posts: RecommendedItem[];
  roadmaps: RecommendedItem[];
}

interface Profile {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get user from auth token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user");
    }

    // Fetch user profile details
    const { data: rawProfileDetails, error: profileError } = await supabase
      .from("user_profile_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Profile fetch error:", profileError);
    }

    // Cast profile details
    const profileDetails = rawProfileDetails as UserProfileDetails | null;

    // Fetch recent posts
    const { data: rawPosts, error: postsError } = await supabase
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

    // Cast posts
    const posts = (rawPosts || []) as Post[];

    // Fetch profiles for posts using the RPC function that respects privacy
    const postUserIds = [...new Set(posts.map(p => p.user_id))];
    const profilesMap: Record<string, { full_name: string; avatar_url: string | null }> = {};
    
    // Use Promise.all to fetch author info for each user
    await Promise.all(postUserIds.map(async (authorId) => {
      const { data } = await supabase.rpc('get_post_author_info', {
        _viewer_id: user.id,
        _author_id: authorId
      });
      if (data) {
        profilesMap[authorId] = {
          full_name: data.full_name || 'Anonymous',
          avatar_url: data.avatar_url || null
        };
      } else {
        profilesMap[authorId] = { full_name: 'Anonymous', avatar_url: null };
      }
    }));

    // Fetch public roadmaps
    const { data: rawRoadmaps, error: roadmapsError } = await supabase
      .from("roadmaps")
      .select("id, title, description, category, difficulty, technologies, estimated_time")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (roadmapsError) {
      console.error("Roadmaps fetch error:", roadmapsError);
    }

    const roadmaps = (rawRoadmaps || []) as Roadmap[];

    // Build AI prompt with user context
    const userSkills = profileDetails?.skills || [];
    const experienceLevel = profileDetails?.experience_level || "beginner";
    const learningGoals = profileDetails?.learning_path?.goals || "";
    const background = profileDetails?.learning_path?.background || "";

    const systemPrompt = `You are a personalized content recommendation AI. Analyze user profiles and content to provide relevance scores.
    
User Profile:
- Experience Level: ${experienceLevel}
- Skills: ${userSkills.map((s: Skill | string) => (typeof s === 'string' ? s : s.name || JSON.stringify(s))).join(", ")}
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
Posts (${posts.length} items):
${posts.slice(0, 20).map(p => `- ID: ${p.id}, Title: ${p.title}, Category: ${p.category || "N/A"}, Tags: ${p.tags?.join(", ") || "none"}`).join("\n")}

Roadmaps (${roadmaps.length} items):
${roadmaps.slice(0, 20).map(r => `- ID: ${r.id}, Title: ${r.title}, Category: ${r.category || "N/A"}, Difficulty: ${r.difficulty || "N/A"}, Tech: ${r.technologies?.join(", ") || "none"}`).join("\n")}`;

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
    let recommendations: Recommendations;
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
        posts: posts.slice(0, 10).map(p => ({ id: p.id, score: 50, reason: "Default recommendation" })),
        roadmaps: roadmaps.slice(0, 10).map(r => ({ id: r.id, score: 50, reason: "Default recommendation" })),
      };
    }

    // Merge scores with full content
    const scoredPosts = posts
      .map(post => {
        const rec = recommendations.posts?.find(r => r.id === post.id);
        const profile = profilesMap[post.user_id] || { full_name: 'Anonymous', avatar_url: null };
        return {
          ...post,
          profiles: {
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          },
          score: rec?.score || 0,
          recommendation_reason: rec?.reason || "",
        };
      })
      .filter(p => p.score > 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    const scoredRoadmaps = roadmaps
      .map(roadmap => {
        const rec = recommendations.roadmaps?.find(r => r.id === roadmap.id);
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
