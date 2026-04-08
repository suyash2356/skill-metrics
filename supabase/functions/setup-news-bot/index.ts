import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const botEmail = "skillgram-news-bot@skillgram.app";
    const botPassword = "SkillGramNews@2026!";

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: botEmail,
      password: botPassword,
      email_confirm: true,
    });

    if (authError) {
      // If user already exists, find them
      if (authError.message.includes("already been registered")) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users?.find((u: any) => u.email === botEmail);
        if (existingUser) {
          // Ensure profile exists
          await supabase.from("profiles").upsert({
            user_id: existingUser.id,
            full_name: "SkillGram News",
            bio: "📰 Daily tech news, curated by AI. Stay updated with the latest in technology!",
            avatar_url: null,
          }, { onConflict: "user_id" });

          return new Response(JSON.stringify({
            message: "Bot already exists",
            user_id: existingUser.id,
            email: botEmail,
            password: botPassword,
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
      throw authError;
    }

    const botUserId = authData.user!.id;

    // Create profile
    await supabase.from("profiles").insert({
      user_id: botUserId,
      full_name: "SkillGram News",
      bio: "📰 Daily tech news, curated by AI. Stay updated with the latest in technology!",
    });

    return new Response(JSON.stringify({
      message: "Bot account created successfully!",
      user_id: botUserId,
      email: botEmail,
      password: botPassword,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
