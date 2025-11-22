import { Recommendation } from "@/api/searchAPI";

/**
 * Enhanced resource matching based on user profile and resource metadata
 */

interface UserProfile {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: string[];
  learningGoals: string[];
  prefersFree?: boolean;
}

/**
 * Score a resource based on how well it matches user profile
 */
export function scoreResource(
  resource: Recommendation,
  userProfile: UserProfile
): number {
  let score = 0;

  // Base score for all resources
  score += 5;

  // Check if resource description mentions user's skills
  const descLower = (resource.description || '').toLowerCase();
  const titleLower = (resource.title || '').toLowerCase();
  const combinedText = `${titleLower} ${descLower}`;

  userProfile.skills.forEach(skill => {
    if (combinedText.includes(skill.toLowerCase())) {
      score += 8;
    }
  });

  // Check if resource matches learning goals
  userProfile.learningGoals.forEach(goal => {
    if (goal.length > 3 && combinedText.includes(goal.toLowerCase())) {
      score += 6;
    }
  });

  // Prefer free resources if user is a student or prefers free content
  if (userProfile.prefersFree && descLower.includes('free')) {
    score += 5;
  }

  // Boost YouTube and free courses for beginners
  if (userProfile.experienceLevel === 'beginner') {
    if (resource.type === 'youtube' || descLower.includes('beginner')) {
      score += 7;
    }
  }

  // Boost advanced resources for experts
  if (userProfile.experienceLevel === 'advanced' || userProfile.experienceLevel === 'expert') {
    if (descLower.includes('advanced') || descLower.includes('expert')) {
      score += 7;
    }
  }

  // Boost books for intermediate/advanced learners
  if (
    (userProfile.experienceLevel === 'intermediate' || 
     userProfile.experienceLevel === 'advanced') && 
    resource.type === 'book'
  ) {
    score += 4;
  }

  // Boost courses with certificates for professionals
  if (resource.type === 'course' && descLower.includes('certificate')) {
    score += 6;
  }

  return score;
}

/**
 * Filter and sort resources based on user profile
 */
export function getPersonalizedResources(
  resources: Recommendation[],
  userProfile: UserProfile,
  limit?: number
): Recommendation[] {
  const scored = resources.map(resource => ({
    resource,
    score: scoreResource(resource, userProfile),
  }));

  scored.sort((a, b) => b.score - a.score);

  const sorted = scored.map(s => s.resource);
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Group resources by type after personalization
 */
export function groupPersonalizedResources(
  resources: Recommendation[],
  userProfile: UserProfile
): Record<string, Recommendation[]> {
  const personalized = getPersonalizedResources(resources, userProfile);
  
  const grouped: Record<string, Recommendation[]> = {};
  
  personalized.forEach(resource => {
    const type = resource.type || 'other';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(resource);
  });

  return grouped;
}
