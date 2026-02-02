import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DBResource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  difficulty: string;
  is_free: boolean;
  is_active: boolean;
  is_featured: boolean;
  icon: string | null;
  color: string | null;
  provider: string | null;
  rating: number | null;
  duration: string | null;
  resource_type: string;
  section_type: string;
  related_skills: string[] | null;
  relevant_backgrounds: string[] | null;
  education_levels: string[] | null;
  target_countries: string[] | null;
  estimated_time: string | null;
  prerequisites: string[] | null;
  // Rating fields for recommendation sorting
  avg_rating: number | null;
  weighted_rating: number | null;
  total_ratings: number | null;
  recommend_percent: number | null;
  total_votes: number | null;
  total_reviews: number | null;
}

export interface Category {
  id?: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  link?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: string[];
  educationLevels: string[];
  relatedSkills: string[];
  type: 'tech' | 'non-tech';
  // Rating fields
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

export interface Exam {
  id?: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  link: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: string[];
  educationLevels: string[];
  targetCountries: string[];
  category: string;
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

export interface Certification {
  id?: string;
  name: string;
  provider: string;
  description?: string;
  link: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: string[];
  educationLevels: string[];
  relatedSkills: string[];
  domain: string;
  estimatedTime?: string;
  cost?: 'free' | 'paid';
  icon: string;
  color: string;
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

export interface Degree {
  id?: string;
  title: string;
  university: string;
  mode: string;
  fees: string;
  ratingDisplay: string;
  duration: string;
  link: string;
  exam: string;
  about: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: string[];
  educationLevels: string[];
  relatedSkills: string[];
  field: string;
  rating?: number | null;
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: string[];
  educationLevels: string[];
  relatedSkills: string[];
  targetRole: string;
  prerequisites: string[];
}

// Hook to fetch all categories from database
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('section_type', 'domain')
        .order('category');

      if (error) throw error;

      // Group by category to create category objects
      const categoryMap = new Map<string, Category>();
      
      (data || []).forEach((r: DBResource) => {
        if (!categoryMap.has(r.category)) {
          const isTech = ['Artificial Intelligence', 'Data Science', 'Cloud Computing', 
            'Cybersecurity', 'Blockchain', 'DevOps', 'Software Development', 
            'Mobile Development', 'Game Development', 'IoT & Embedded Systems',
            'Quantum Computing', 'Computer Vision', 'Natural Language Processing',
            'Robotics', 'Web Development'].includes(r.category);
          
          categoryMap.set(r.category, {
            title: r.category,
            icon: r.icon || 'Brain',
            color: r.color || 'from-indigo-500 to-purple-500',
            description: r.description,
            link: r.link,
            difficulty: r.difficulty as Category['difficulty'],
            relevantBackgrounds: r.relevant_backgrounds || [],
            educationLevels: r.education_levels || [],
            relatedSkills: r.related_skills || [],
            type: isTech ? 'tech' : 'non-tech',
          });
        }
      });

      return Array.from(categoryMap.values());
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch exams from database
export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('section_type', 'exam')
        .eq('resource_type', 'exam_prep')
        .order('category');

      if (error) throw error;

      // Group by category to create exam objects
      const examMap = new Map<string, Exam>();
      
      (data || []).forEach((r: DBResource) => {
        if (!examMap.has(r.category)) {
          examMap.set(r.category, {
            id: r.id,
            title: r.category,
            icon: r.icon || 'GraduationCap',
            color: r.color || 'from-indigo-500 to-blue-500',
            description: r.description,
            link: r.link,
            difficulty: r.difficulty as Exam['difficulty'],
            relevantBackgrounds: r.relevant_backgrounds || [],
            educationLevels: r.education_levels || [],
            targetCountries: r.target_countries || [],
            category: r.category,
            avg_rating: r.avg_rating,
            weighted_rating: r.weighted_rating,
            total_ratings: r.total_ratings,
            recommend_percent: r.recommend_percent,
            total_votes: r.total_votes,
          });
        }
      });

      return Array.from(examMap.values());
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch certifications from database
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('resource_type', 'certification')
        .order('title');

      if (error) throw error;

      return (data || []).map((r: DBResource) => ({
        id: r.id,
        name: r.title,
        provider: r.provider || '',
        description: r.description,
        link: r.link,
        difficulty: r.difficulty as Certification['difficulty'],
        relevantBackgrounds: r.relevant_backgrounds || [],
        educationLevels: r.education_levels || [],
        relatedSkills: r.related_skills || [],
        domain: r.category,
        estimatedTime: r.estimated_time,
        cost: r.is_free ? 'free' : 'paid',
        icon: r.icon || 'Award',
        color: r.color || 'from-indigo-500 to-purple-500',
        avg_rating: r.avg_rating,
        weighted_rating: r.weighted_rating,
        total_ratings: r.total_ratings,
        recommend_percent: r.recommend_percent,
        total_votes: r.total_votes,
      })) as Certification[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch degrees from database
export function useDegrees() {
  return useQuery({
    queryKey: ['degrees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('resource_type', 'degree')
        .order('title');

      if (error) throw error;

      return (data || []).map((r: DBResource) => ({
        id: r.id,
        title: r.title,
        university: r.provider || '',
        mode: r.duration?.includes('online') ? 'online' : 'offline',
        fees: 'See official page',
        ratingDisplay: r.rating ? `${r.rating}/5` : 'N/A',
        rating: r.rating,
        duration: r.duration || '',
        link: r.link,
        exam: '',
        about: r.description,
        difficulty: r.difficulty as Degree['difficulty'],
        relevantBackgrounds: r.relevant_backgrounds || [],
        educationLevels: r.education_levels || [],
        relatedSkills: r.related_skills || [],
        field: r.category,
        avg_rating: r.avg_rating,
        weighted_rating: r.weighted_rating,
        total_ratings: r.total_ratings,
        recommend_percent: r.recommend_percent,
        total_votes: r.total_votes,
      })) as Degree[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch learning paths from database
export function useLearningPaths() {
  return useQuery({
    queryKey: ['learningPaths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('resource_type', 'learning_path')
        .order('title');

      if (error) throw error;

      return (data || []).map((r: DBResource) => ({
        title: r.title,
        description: r.description,
        duration: r.duration || r.estimated_time || '',
        difficulty: r.difficulty as LearningPath['difficulty'],
        relevantBackgrounds: r.relevant_backgrounds || [],
        educationLevels: r.education_levels || [],
        relatedSkills: r.related_skills || [],
        targetRole: r.category,
        prerequisites: r.prerequisites || [],
      })) as LearningPath[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch trending/featured resources - sorted by ratings
export function useTrendingResources() {
  return useQuery({
    queryKey: ['trendingResources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('weighted_rating', { ascending: false, nullsFirst: false })
        .order('recommend_percent', { ascending: false, nullsFirst: false })
        .order('total_ratings', { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map((r: DBResource) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        link: r.link,
        icon: r.icon || 'BookOpen',
        color: r.color || 'from-indigo-500 to-purple-500',
        difficulty: r.difficulty,
        relevantBackgrounds: r.relevant_backgrounds || [],
        relatedSkills: r.related_skills || [],
        avg_rating: r.avg_rating,
        weighted_rating: r.weighted_rating,
        total_ratings: r.total_ratings,
        recommend_percent: r.recommend_percent,
        total_votes: r.total_votes,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch all resources for a specific category/skill - sorted by ratings
export function useResourcesByCategory(category: string) {
  return useQuery({
    queryKey: ['resources', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_active', true)
        .or(`category.ilike.%${category}%,related_skills.cs.{${category}},title.ilike.%${category}%`)
        .order('weighted_rating', { ascending: false, nullsFirst: false })
        .order('recommend_percent', { ascending: false, nullsFirst: false })
        .order('is_featured', { ascending: false })
        .order('total_ratings', { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}
