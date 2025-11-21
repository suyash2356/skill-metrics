import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface RecommendedPost {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  profiles: {
    full_name: string;
  };
  score: number;
  recommendation_reason: string;
}

interface RecommendedRoadmap {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  technologies: string[] | null;
  estimated_time: string | null;
  score: number;
  recommendation_reason: string;
}

interface PersonalizedFeedData {
  posts: RecommendedPost[];
  roadmaps: RecommendedRoadmap[];
  userProfile: {
    experienceLevel: string;
    skills: any[];
    learningGoals: string;
  };
}

export const usePersonalizedFeed = () => {
  const { user } = useAuth();

  return useQuery<PersonalizedFeedData>({
    queryKey: ["personalizedFeed", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("recommend-content", {
        body: {},
      });

      if (error) {
        console.error("Recommendation error:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};
