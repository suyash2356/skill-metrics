import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BlogOrPaper {
  id: string;
  title: string;
  description: string;
  link: string;
  type: 'blog' | 'research_paper';
  category: string;
  provider: string | null;
  difficulty: string;
  relatedSkills: string[];
  isFeatured: boolean;
}

export function useBlogsAndPapers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blogs-papers', user?.id],
    queryFn: async () => {
      // Fetch user preferences for personalization
      let userSkills: string[] = [];
      let userInterests: string[] = [];

      if (user) {
        // Get user profile details for personalization
        const { data: profileDetails } = await supabase
          .from('user_profile_details')
          .select('skills, learning_path')
          .eq('user_id', user.id)
          .single();

        if (profileDetails) {
          // Extract skills if available
          if (profileDetails.skills) {
            const skillsData = profileDetails.skills as any;
            if (Array.isArray(skillsData)) {
              userSkills = skillsData.map((s: any) => typeof s === 'string' ? s : s.name || '').filter(Boolean);
            }
          }
          
          // Extract interests from learning path
          if (profileDetails.learning_path) {
            const learningPath = profileDetails.learning_path as any;
            if (Array.isArray(learningPath)) {
              userInterests = learningPath.map((p: any) => typeof p === 'string' ? p : p.title || '').filter(Boolean);
            }
          }
        }

        // Also check recent activity for interests
        const { data: recentActivity } = await supabase
          .from('user_activity')
          .select('metadata')
          .eq('user_id', user.id)
          .eq('activity_type', 'resource_view')
          .order('created_at', { ascending: false })
          .limit(20);

        if (recentActivity) {
          recentActivity.forEach((activity: any) => {
            if (activity.metadata?.category) {
              userInterests.push(activity.metadata.category);
            }
            if (activity.metadata?.related_skills) {
              userInterests.push(...activity.metadata.related_skills);
            }
          });
        }
      }

      // Fetch blogs and research papers from resources
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .in('resource_type', ['blog', 'research_paper', 'article', 'paper'])
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Transform and score based on user interests
      const allInterests = [...new Set([...userSkills, ...userInterests])].map(s => s.toLowerCase());
      
      const results: BlogOrPaper[] = (data || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        link: r.link,
        type: r.resource_type === 'research_paper' || r.resource_type === 'paper' ? 'research_paper' : 'blog',
        category: r.category,
        provider: r.provider,
        difficulty: r.difficulty,
        relatedSkills: r.related_skills || [],
        isFeatured: r.is_featured || false,
      }));

      // Score and sort based on user interests
      if (allInterests.length > 0) {
        const scored = results.map(item => {
          let score = item.isFeatured ? 10 : 0;
          
          // Check category match
          if (allInterests.some(i => item.category.toLowerCase().includes(i))) {
            score += 5;
          }
          
          // Check related skills match
          const itemSkills = item.relatedSkills.map(s => s.toLowerCase());
          const matchingSkills = allInterests.filter(i => itemSkills.some(s => s.includes(i)));
          score += matchingSkills.length * 2;
          
          // Check title match
          const titleLower = item.title.toLowerCase();
          if (allInterests.some(i => titleLower.includes(i))) {
            score += 3;
          }
          
          return { item, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.map(s => s.item);
      }

      return results;
    },
    staleTime: 5 * 60 * 1000,
  });
}
