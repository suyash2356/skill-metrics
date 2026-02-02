import { useMemo } from 'react';
import { useUserProfileDetails } from './useUserProfileDetails';
import { useUserPreferences } from './useUserPreferences';
import { useRecentActivity } from './useRecentActivity';
import { createPersonalizationEngine, ScoredItem } from '@/lib/personalization';
import { 
  useCategories, 
  useExams, 
  useCertifications, 
  useDegrees, 
  useLearningPaths,
  useTrendingResources,
  Category,
  Exam,
  Certification,
  Degree,
  LearningPath
} from './useExploreData';

export interface TrendingResource {
  id?: string;
  title: string;
  description: string;
  link: string;
  icon: string;
  color: string;
  difficulty: string;
  relevantBackgrounds: string[];
  relatedSkills: string[];
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
}

export interface PersonalizedExploreData {
  techCategories: ScoredItem<Category>[];
  nonTechCategories: ScoredItem<Category>[];
  exams: ScoredItem<Exam>[];
  certifications: ScoredItem<Certification>[];
  learningPaths: ScoredItem<LearningPath>[];
  degrees: ScoredItem<Degree>[];
  trendingResources: ScoredItem<TrendingResource>[];
  isLoading: boolean;
}

/**
 * Hook to get personalized explore page content based on user profile,
 * learning path progress, and recent activity - ALL FROM DATABASE
 */
export function usePersonalizedExplore(): PersonalizedExploreData {
  const { profileDetails, isLoading: profileLoading } = useUserProfileDetails();
  const { preferences, isLoading: prefsLoading } = useUserPreferences();
  const { recentActivity, isLoading: activityLoading } = useRecentActivity();

  // Fetch all data from database
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: exams = [], isLoading: examsLoading } = useExams();
  const { data: certifications = [], isLoading: certificationsLoading } = useCertifications();
  const { data: degrees = [], isLoading: degreesLoading } = useDegrees();
  const { data: learningPaths = [], isLoading: learningPathsLoading } = useLearningPaths();
  const { data: trendingResources = [], isLoading: resourcesLoading } = useTrendingResources();

  const personalizedData = useMemo(() => {
    // Create engine with profile, preferences, and recent activity
    const engine = createPersonalizationEngine(profileDetails, preferences, recentActivity);

    // Split categories into tech and non-tech
    const techCategories = categories.filter(c => c.type === 'tech');
    const nonTechCategories = categories.filter(c => c.type === 'non-tech');

    return {
      techCategories: engine.scoreAndSort(techCategories).slice(0, 8),
      nonTechCategories: engine.scoreAndSort(nonTechCategories).slice(0, 5),
      exams: engine.scoreAndSort(exams).slice(0, 5),
      certifications: engine.scoreAndSort(certifications).slice(0, 10),
      learningPaths: engine.scoreAndSort(learningPaths).slice(0, 6),
      degrees: engine.scoreAndSort(degrees).slice(0, 20),
      trendingResources: engine.scoreAndSort(trendingResources).slice(0, 6),
    };
  }, [profileDetails, preferences, recentActivity, categories, exams, certifications, degrees, learningPaths, trendingResources]);

  return {
    ...personalizedData,
    isLoading: profileLoading || prefsLoading || activityLoading || 
               categoriesLoading || examsLoading || certificationsLoading || 
               degreesLoading || learningPathsLoading || resourcesLoading,
  };
}
