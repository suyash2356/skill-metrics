import { useMemo } from 'react';
import { useUserProfileDetails } from './useUserProfileDetails';
import { useUserPreferences } from './useUserPreferences';
import { useRecentActivity } from './useRecentActivity';
import { createPersonalizationEngine, ScoredItem } from '@/lib/personalization';
import { techCategories, nonTechCategories, Category } from '@/data/categories';
import { exams, Exam } from '@/data/exams';
import { certifications, Certification } from '@/data/certifications';
import { learningPaths, LearningPath } from '@/data/learningPaths';
import { degrees, Degree } from '@/data/degrees';
import { trendingResources } from '@/data/resourceData';

export interface TrendingResource {
  title: string;
  description: string;
  link: string;
  icon: string;
  color: string;
  difficulty: string;
  relevantBackgrounds: string[];
  relatedSkills: string[];
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
 * learning path progress, and recent activity
 */
export function usePersonalizedExplore(): PersonalizedExploreData {
  const { profileDetails, isLoading: profileLoading } = useUserProfileDetails();
  const { preferences, isLoading: prefsLoading } = useUserPreferences();
  const { recentActivity, isLoading: activityLoading } = useRecentActivity();

  const personalizedData = useMemo(() => {
    // Create engine with profile, preferences, and recent activity
    const engine = createPersonalizationEngine(profileDetails, preferences, recentActivity);

    return {
      techCategories: engine.scoreAndSort(techCategories).slice(0, 8),
      nonTechCategories: engine.scoreAndSort(nonTechCategories).slice(0, 5),
      exams: engine.scoreAndSort(exams).slice(0, 5),
      certifications: engine.scoreAndSort(certifications).slice(0, 10),
      learningPaths: engine.scoreAndSort(learningPaths).slice(0, 6),
      degrees: engine.scoreAndSort(degrees).slice(0, 20),
      trendingResources: engine.scoreAndSort(trendingResources as any as TrendingResource[]).slice(0, 6),
    };
  }, [profileDetails, preferences, recentActivity]);

  return {
    ...personalizedData,
    isLoading: profileLoading || prefsLoading || activityLoading,
  };
}
