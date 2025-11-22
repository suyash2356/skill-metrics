import { useMemo } from 'react';
import { useUserProfileDetails } from './useUserProfileDetails';
import { useUserPreferences } from './useUserPreferences';
import { createPersonalizationEngine, ScoredItem } from '@/lib/personalization';
import { techCategories, nonTechCategories, Category } from '@/data/categories';
import { exams, Exam } from '@/data/exams';
import { certifications, Certification } from '@/data/certifications';
import { learningPaths, LearningPath } from '@/data/learningPaths';
import { degrees, Degree } from '@/data/degrees';

export interface PersonalizedExploreData {
  techCategories: ScoredItem<Category>[];
  nonTechCategories: ScoredItem<Category>[];
  exams: ScoredItem<Exam>[];
  certifications: ScoredItem<Certification>[];
  learningPaths: ScoredItem<LearningPath>[];
  degrees: ScoredItem<Degree>[];
  isLoading: boolean;
}

/**
 * Hook to get personalized explore page content based on user profile
 */
export function usePersonalizedExplore(): PersonalizedExploreData {
  const { profileDetails, isLoading: profileLoading } = useUserProfileDetails();
  const { preferences, isLoading: prefsLoading } = useUserPreferences();

  const personalizedData = useMemo(() => {
    const engine = createPersonalizationEngine(profileDetails, preferences);

    return {
      techCategories: engine.scoreAndSort(techCategories).slice(0, 8),
      nonTechCategories: engine.scoreAndSort(nonTechCategories).slice(0, 5),
      exams: engine.scoreAndSort(exams).slice(0, 5),
      certifications: engine.scoreAndSort(certifications).slice(0, 10),
      learningPaths: engine.scoreAndSort(learningPaths).slice(0, 6),
      degrees: engine.scoreAndSort(degrees).slice(0, 8),
    };
  }, [profileDetails, preferences]);

  return {
    ...personalizedData,
    isLoading: profileLoading || prefsLoading,
  };
}
