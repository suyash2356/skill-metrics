import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FocusSession {
  id: string;
  user_id: string;
  roadmap_id: string | null;
  step_id: string | null;
  duration_minutes: number;
  xp_earned: number;
  started_at: string;
  ended_at: string | null;
}

interface LearningStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  last_active_date: string | null;
}

// Bypass Supabase type inference for new tables not yet in generated types
const fromTable = (name: string) => (supabase as any).from(name);

export function useFocusSessions(roadmapId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery<FocusSession[]>({
    queryKey: ["focusSessions", user?.id, roadmapId],
    queryFn: async () => {
      if (!user) return [];
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      let query = fromTable("focus_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("started_at", oneYearAgo.toISOString())
        .order("started_at", { ascending: false });

      if (roadmapId) {
        query = query.eq("roadmap_id", roadmapId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as FocusSession[];
    },
    enabled: !!user,
  });

  const { data: streak, isLoading: isLoadingStreak } = useQuery<LearningStreak | null>({
    queryKey: ["learningStreak", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await fromTable("learning_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as LearningStreak | null;
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

      const { error: sessionError } = await fromTable("focus_sessions").insert({
        user_id: user.id,
        roadmap_id: roadmapId || null,
        step_id: stepId || null,
        duration_minutes: durationMinutes,
        xp_earned: xpEarned,
        ended_at: new Date().toISOString(),
      });
      if (sessionError) throw sessionError;

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

        const longestStreak = Math.max(streak.longest_streak, newStreak);

        const { error: streakError } = await fromTable("learning_streaks")
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
        const { error: streakError } = await fromTable("learning_streaks").insert({
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

  const heatmapData = sessions.reduce((acc: Record<string, { minutes: number; sessions: number }>, session) => {
    const date = session.started_at?.split("T")[0];
    if (!date) return acc;
    if (!acc[date]) acc[date] = { minutes: 0, sessions: 0 };
    acc[date].minutes += session.duration_minutes || 0;
    acc[date].sessions += 1;
    return acc;
  }, {});

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
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
