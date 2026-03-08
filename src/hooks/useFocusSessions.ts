import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useFocusSessions(roadmapId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get sessions for heatmap (last 365 days)
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ["focusSessions", user?.id, roadmapId],
    queryFn: async () => {
      if (!user) return [];
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      let query = supabase
        .from("focus_sessions" as any)
        .select("*")
        .eq("user_id", user.id)
        .gte("started_at", oneYearAgo.toISOString())
        .order("started_at", { ascending: false });

      if (roadmapId) {
        query = query.eq("roadmap_id", roadmapId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Get or create streak
  const { data: streak, isLoading: isLoadingStreak } = useQuery({
    queryKey: ["learningStreak", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("learning_streaks" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveFocusSession = useMutation({
    mutationFn: async ({
      durationMinutes,
      stepId,
      xpEarned,
    }: {
      durationMinutes: number;
      stepId?: string;
      xpEarned: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Insert session
      const { error: sessionError } = await supabase.from("focus_sessions" as any).insert({
        user_id: user.id,
        roadmap_id: roadmapId || null,
        step_id: stepId || null,
        duration_minutes: durationMinutes,
        xp_earned: xpEarned,
        ended_at: new Date().toISOString(),
      });
      if (sessionError) throw sessionError;

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      if (streak) {
        const lastActive = streak.last_active_date;
        let newStreak = streak.current_streak;

        if (lastActive === yesterday) {
          newStreak += 1;
        } else if (lastActive !== today) {
          newStreak = 1;
        }
        // If lastActive === today, keep same streak

        const longestStreak = Math.max(streak.longest_streak, newStreak);

        const { error: streakError } = await supabase
          .from("learning_streaks" as any)
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            total_xp: streak.total_xp + xpEarned,
            last_active_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
        if (streakError) throw streakError;
      } else {
        const { error: streakError } = await supabase.from("learning_streaks" as any).insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          total_xp: xpEarned,
          last_active_date: today,
        });
        if (streakError) throw streakError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focusSessions"] });
      queryClient.invalidateQueries({ queryKey: ["learningStreak"] });
    },
  });

  // Aggregate sessions by date for heatmap
  const heatmapData = sessions.reduce((acc: Record<string, { minutes: number; sessions: number }>, session: any) => {
    const date = session.started_at?.split("T")[0];
    if (!date) return acc;
    if (!acc[date]) acc[date] = { minutes: 0, sessions: 0 };
    acc[date].minutes += session.duration_minutes || 0;
    acc[date].sessions += 1;
    return acc;
  }, {});

  // Total stats
  const totalMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration_minutes || 0), 0);
  const totalSessions = sessions.length;

  return {
    sessions,
    streak,
    heatmapData,
    totalMinutes,
    totalSessions,
    saveFocusSession,
    isLoading: isLoadingSessions || isLoadingStreak,
  };
}
