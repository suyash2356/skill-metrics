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
  relevantBackgrounds: string[];
  educationLevels: string[];
  isFeatured: boolean;
  rating: number | null;
  // Rating aggregates
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

interface UserOnboardingData {
  skills: string[];
  background: string;
  education: string;
  experienceLevel: string;
  learningGoals: string;
}

export function useBlogsAndPapers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blogs-papers', user?.id],
    queryFn: async () => {
      // Fetch user onboarding data for personalization
      let userData: UserOnboardingData = {
        skills: [],
        background: '',
        education: '',
        experienceLevel: '',
        learningGoals: ''
      };

      if (user) {
        // Get user profile details (from onboarding)
        const { data: profileDetails } = await supabase
          .from('user_profile_details')
          .select('skills, learning_path, experience_level')
          .eq('user_id', user.id)
          .single();

        if (profileDetails) {
          // Extract skills
          if (profileDetails.skills) {
            const skillsData = profileDetails.skills as any;
            if (Array.isArray(skillsData)) {
              userData.skills = skillsData.map((s: any) => 
                typeof s === 'string' ? s : s.name || ''
              ).filter(Boolean);
            }
          }
          
          // Extract onboarding data from learning_path
          if (profileDetails.learning_path) {
            const learningPath = profileDetails.learning_path as any;
            if (typeof learningPath === 'object') {
              userData.background = learningPath.background || '';
              userData.education = learningPath.education || '';
              userData.learningGoals = learningPath.goals || '';
            }
          }

          userData.experienceLevel = profileDetails.experience_level || '';
        }

        // Also check recent activity for additional interests
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
              userData.skills.push(activity.metadata.category);
            }
            if (activity.metadata?.related_skills) {
              userData.skills.push(...activity.metadata.related_skills);
            }
          });
        }
      }

      // Fetch blogs and research papers from resources - sorted by ratings
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .in('resource_type', ['blog', 'research_paper', 'article', 'paper'])
        .order('weighted_rating', { ascending: false, nullsFirst: false })
        .order('recommend_percent', { ascending: false, nullsFirst: false })
        .order('is_featured', { ascending: false })
        .order('total_ratings', { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) throw error;

      // Transform data
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
        relevantBackgrounds: r.relevant_backgrounds || [],
        educationLevels: r.education_levels || [],
        isFeatured: r.is_featured || false,
        rating: r.rating,
        // Add rating aggregates
        avg_rating: r.avg_rating,
        weighted_rating: r.weighted_rating,
        total_ratings: r.total_ratings,
        recommend_percent: r.recommend_percent,
        total_votes: r.total_votes,
      }));

      // Score and sort based on user's onboarding data
      const allSkills = [...new Set(userData.skills)].map(s => s.toLowerCase());
      const userBackground = userData.background.toLowerCase();
      const userEducation = userData.education.toLowerCase();
      const userLevel = userData.experienceLevel.toLowerCase();
      
      const scored = results.map(item => {
        let score = item.isFeatured ? 10 : 0;
        let matchReasons: string[] = [];
        
        // Match by user's skills/interests
        const itemSkills = item.relatedSkills.map(s => s.toLowerCase());
        const categoryLower = item.category.toLowerCase();
        const titleLower = item.title.toLowerCase();
        
        allSkills.forEach(skill => {
          if (itemSkills.some(s => s.includes(skill) || skill.includes(s))) {
            score += 5;
            matchReasons.push(`Matches your interest: ${skill}`);
          }
          if (categoryLower.includes(skill)) {
            score += 3;
          }
          if (titleLower.includes(skill)) {
            score += 2;
          }
        });
        
        // Match by user's background
        if (userBackground && item.relevantBackgrounds.length > 0) {
          const backgrounds = item.relevantBackgrounds.map(b => b.toLowerCase());
          if (backgrounds.some(b => b.includes(userBackground) || userBackground.includes(b))) {
            score += 4;
            matchReasons.push('Matches your background');
          }
        }
        
        // Match by education level
        if (userEducation && item.educationLevels.length > 0) {
          const levels = item.educationLevels.map(l => l.toLowerCase());
          if (levels.some(l => l.includes(userEducation) || userEducation.includes(l))) {
            score += 3;
            matchReasons.push('Matches your education level');
          }
        }
        
        // Match by experience/difficulty level
        if (userLevel) {
          const difficultyMatch = (
            (userLevel === 'beginner' && item.difficulty === 'beginner') ||
            (userLevel === 'intermediate' && ['beginner', 'intermediate'].includes(item.difficulty)) ||
            (userLevel === 'advanced' && ['intermediate', 'advanced'].includes(item.difficulty)) ||
            (userLevel === 'expert' && ['advanced', 'expert'].includes(item.difficulty))
          );
          if (difficultyMatch) {
            score += 2;
          }
        }
        
        // Boost highly rated content (use weighted rating for trust)
        if (item.weighted_rating && item.weighted_rating >= 4.0) {
          score += 8;
          matchReasons.push('⭐ Highly rated');
        } else if (item.avg_rating && item.avg_rating >= 4.5 && (item.total_ratings || 0) >= 10) {
          score += 6;
        } else if (item.rating && item.rating >= 4.5) {
          score += 2;
        }

        // Boost resources with high recommendation percentage
        if (item.recommend_percent && item.recommend_percent >= 85 && (item.total_votes || 0) >= 5) {
          score += 5;
          if (!matchReasons.some(r => r.includes('rated'))) {
            matchReasons.push('✅ Highly recommended');
          }
        }
        
        return { 
          item, 
          score, 
          matchReason: matchReasons.length > 0 ? matchReasons[0] : null 
        };
      });

      scored.sort((a, b) => b.score - a.score);
      
      return scored.map(s => ({
        ...s.item,
        matchReason: s.matchReason
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
