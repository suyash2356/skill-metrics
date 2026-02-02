import { UserProfileDetails, LearningPathItem } from "@/hooks/useUserProfileDetails";
import { UserPreferences } from "@/hooks/useUserPreferences";

interface PersonalizationContext {
  profileDetails: UserProfileDetails | null;
  preferences: UserPreferences | null;
  recentActivity?: RecentActivity[];
}

export interface RecentActivity {
  activity_type: string;
  metadata?: Record<string, any>;
  created_at: string;
  post_id?: string;
  roadmap_id?: string;
}

export interface ScoredItem<T> {
  item: T;
  score: number;
  reasons: string[];
}

// Rating-enhanced item interface
interface RatableItem {
  difficulty?: string;
  relatedSkills?: string[];
  relevantBackgrounds?: string[];
  title?: string;
  name?: string;
  description?: string;
  // Rating fields from database
  avg_rating?: number | null;
  weighted_rating?: number | null;
  total_ratings?: number | null;
  recommend_percent?: number | null;
  total_votes?: number | null;
  rating?: number | null;
}

/**
 * Core personalization engine that scores and filters content based on user profile,
 * learning path progress, recent activity, AND community ratings/recommendations
 */
export class PersonalizationEngine {
  private context: PersonalizationContext;

  constructor(context: PersonalizationContext) {
    this.context = context;
  }

  /**
   * Get user's experience level from profile
   */
  private getExperienceLevel(): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    return this.context.profileDetails?.experience_level || 'beginner';
  }

  /**
   * Get user's current skills
   */
  private getUserSkills(): string[] {
    const skills = this.context.profileDetails?.skills || [];
    return skills.map(s => s.name.toLowerCase());
  }

  /**
   * Safely get learning path as array
   */
  private getLearningPathArray(): LearningPathItem[] {
    const learningPath = this.context.profileDetails?.learning_path;
    if (!learningPath || !Array.isArray(learningPath)) return [];
    return learningPath;
  }

  /**
   * Get user's learning goals from bio, job title, and learning path
   */
  private getLearningGoals(): string[] {
    const bio = this.context.profileDetails?.bio || '';
    const jobTitle = this.context.profileDetails?.job_title || '';
    const learningPath = this.getLearningPathArray();
    
    const bioKeywords = bio.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const titleKeywords = jobTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const learningPathSkills = learningPath
      .filter(item => item && typeof item.skill === 'string')
      .map(item => item.skill.toLowerCase());
    
    return [...new Set([...bioKeywords, ...titleKeywords, ...learningPathSkills])];
  }

  /**
   * Get user's active learning path items (in progress)
   */
  private getActiveLearningPath(): LearningPathItem[] {
    const learningPath = this.getLearningPathArray();
    return learningPath.filter(item => 
      item && 
      typeof item.progress === 'number' && 
      item.progress > 0 && 
      item.progress < 100
    );
  }

  /**
   * Get recently viewed/interacted topics from activity
   */
  private getRecentTopics(): string[] {
    const activity = this.context.recentActivity || [];
    const topics: string[] = [];
    
    activity.forEach(act => {
      if (act.metadata) {
        if (act.metadata.category) topics.push(act.metadata.category.toLowerCase());
        if (act.metadata.tags && Array.isArray(act.metadata.tags)) {
          topics.push(...act.metadata.tags.map((t: string) => t.toLowerCase()));
        }
        if (act.metadata.skill) topics.push(act.metadata.skill.toLowerCase());
        if (act.metadata.title) {
          const titleWords = act.metadata.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          topics.push(...titleWords.slice(0, 3));
        }
      }
    });
    
    return [...new Set(topics)];
  }

  /**
   * Determine user's background
   */
  private getUserBackground(): 'student' | 'professional' | 'self-learner' {
    const jobTitle = this.context.profileDetails?.job_title?.toLowerCase() || '';
    const company = this.context.profileDetails?.company?.toLowerCase() || '';
    
    if (jobTitle.includes('student') || company.includes('university') || company.includes('college') || company.includes('school')) {
      return 'student';
    }
    if (jobTitle && company) {
      return 'professional';
    }
    return 'self-learner';
  }

  /**
   * Score based on difficulty match
   */
  private scoreDifficulty(itemDifficulty: string): { score: number; reason?: string } {
    const userLevel = this.getExperienceLevel();
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const userLevelNum = difficultyMap[userLevel];
    const itemLevelNum = difficultyMap[itemDifficulty as keyof typeof difficultyMap];

    if (!itemLevelNum) return { score: 5 };

    if (userLevelNum === itemLevelNum) {
      return { score: 15, reason: `Perfect for ${userLevel} level` };
    }
    if (Math.abs(userLevelNum - itemLevelNum) === 1) {
      return { score: 10, reason: `Good match for your level` };
    }
    if (itemLevelNum < userLevelNum) {
      return { score: 3, reason: `Might be too basic` };
    }
    return { score: 2, reason: `Might be challenging` };
  }

  /**
   * Score based on skill match
   */
  private scoreSkillMatch(itemSkills: string[]): { score: number; reason?: string } {
    const userSkills = this.getUserSkills();
    if (userSkills.length === 0) return { score: 5 };

    const matchingSkills = itemSkills.filter(skill => 
      userSkills.some(userSkill => 
        skill.toLowerCase().includes(userSkill) || 
        userSkill.includes(skill.toLowerCase())
      )
    );

    if (matchingSkills.length >= 3) {
      return { score: 15, reason: `Matches your skills: ${matchingSkills.slice(0, 2).join(', ')}` };
    }
    if (matchingSkills.length >= 1) {
      return { score: 10, reason: `Related to ${matchingSkills[0]}` };
    }
    return { score: 3 };
  }

  /**
   * Score based on background match
   */
  private scoreBackgroundMatch(itemBackgrounds: string[]): { score: number; reason?: string } {
    const userBackground = this.getUserBackground();
    if (itemBackgrounds.map(b => b.toLowerCase()).includes(userBackground)) {
      return { score: 10, reason: `Perfect for ${userBackground}s` };
    }
    return { score: 5 };
  }

  /**
   * Score based on learning path alignment
   */
  private scoreLearningPathAlignment(itemTitle: string, itemDescription: string): { score: number; reason?: string } {
    const activeLearningPath = this.getActiveLearningPath();
    const searchText = `${itemTitle} ${itemDescription}`.toLowerCase();
    
    for (const pathItem of activeLearningPath) {
      if (searchText.includes(pathItem.skill.toLowerCase())) {
        return { score: 15, reason: `Continues your ${pathItem.skill} learning` };
      }
    }

    const goals = this.getLearningGoals();
    const matchingGoals = goals.filter(goal => 
      goal.length > 3 && searchText.includes(goal)
    );

    if (matchingGoals.length > 2) {
      return { score: 10, reason: 'Aligns with your goals' };
    }
    return { score: 5 };
  }

  /**
   * Score based on recent activity
   */
  private scoreRecentActivityMatch(itemTitle: string, itemDescription: string, itemSkills?: string[]): { score: number; reason?: string } {
    const recentTopics = this.getRecentTopics();
    if (recentTopics.length === 0) return { score: 5 };

    const searchText = `${itemTitle} ${itemDescription}`.toLowerCase();
    const allItemTerms = [...(itemSkills?.map(s => s.toLowerCase()) || [])];
    
    let matchCount = 0;
    for (const topic of recentTopics) {
      if (searchText.includes(topic) || allItemTerms.includes(topic)) {
        matchCount++;
      }
    }

    if (matchCount >= 3) {
      return { score: 12, reason: 'Based on your recent activity' };
    }
    if (matchCount >= 1) {
      return { score: 8, reason: 'Similar to what you viewed' };
    }
    return { score: 5 };
  }

  /**
   * NEW: Score based on community ratings and recommendations (IMDb/YouTube style)
   * This is the core of the enhanced recommendation system
   */
  private scoreRatings(item: RatableItem): { score: number; reason?: string } {
    // Weighted rating takes precedence (IMDb formula already applied)
    const weightedRating = item.weighted_rating;
    const avgRating = item.avg_rating || item.rating;
    const totalRatings = item.total_ratings || 0;
    const recommendPercent = item.recommend_percent;
    const totalVotes = item.total_votes || 0;

    let ratingScore = 0;
    let reason: string | undefined;

    // Score based on weighted rating (most important - prevents gaming)
    if (weightedRating !== null && weightedRating !== undefined) {
      // Weighted rating is 0-5, scale to 0-25 points
      ratingScore = Math.round(weightedRating * 5);
      
      if (weightedRating >= 4.5) {
        reason = '⭐ Highly rated by community';
      } else if (weightedRating >= 4.0) {
        reason = '⭐ Well-reviewed resource';
      }
    } else if (avgRating !== null && avgRating !== undefined && totalRatings >= 10) {
      // Fallback to avg rating only if we have enough votes (trust threshold)
      ratingScore = Math.round(avgRating * 4);
      if (avgRating >= 4.5) {
        reason = '⭐ Top rated';
      }
    }

    // Bonus for high recommendation percentage (Rotten Tomatoes style)
    if (recommendPercent !== null && recommendPercent !== undefined && totalVotes >= 5) {
      if (recommendPercent >= 90) {
        ratingScore += 10;
        if (!reason) reason = '✅ 90%+ users recommend';
      } else if (recommendPercent >= 80) {
        ratingScore += 7;
        if (!reason) reason = '✅ 80%+ recommend this';
      } else if (recommendPercent >= 70) {
        ratingScore += 4;
      }
    }

    // Popularity bonus for high engagement (like YouTube)
    if (totalRatings >= 100) {
      ratingScore += 8;
      if (!reason) reason = '🔥 Popular with learners';
    } else if (totalRatings >= 50) {
      ratingScore += 5;
    } else if (totalRatings >= 20) {
      ratingScore += 3;
    }

    return { score: ratingScore, reason };
  }

  /**
   * Generic scoring function for any item
   */
  public scoreItem<T extends RatableItem>(item: T): ScoredItem<T> {
    let totalScore = 0;
    const reasons: string[] = [];

    // 1. Rating score (weight: HIGH - community trust is key)
    const { score: ratingScore, reason: ratingReason } = this.scoreRatings(item);
    totalScore += ratingScore;
    if (ratingReason) reasons.push(ratingReason);

    // 2. Difficulty match (weight: high)
    if (item.difficulty) {
      const { score, reason } = this.scoreDifficulty(item.difficulty);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // 3. Skill match (weight: high)
    if (item.relatedSkills && item.relatedSkills.length > 0) {
      const { score, reason } = this.scoreSkillMatch(item.relatedSkills);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // 4. Background match (weight: medium)
    if (item.relevantBackgrounds && item.relevantBackgrounds.length > 0) {
      const { score, reason } = this.scoreBackgroundMatch(item.relevantBackgrounds);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // 5. Learning path alignment (weight: high)
    const title = item.title || item.name || '';
    const description = item.description || '';
    if (title || description) {
      const { score, reason } = this.scoreLearningPathAlignment(title, description);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // 6. Recent activity match (weight: medium)
    const { score: activityScore, reason: activityReason } = this.scoreRecentActivityMatch(
      title, 
      description, 
      item.relatedSkills
    );
    totalScore += activityScore;
    if (activityReason && activityScore > 5) reasons.push(activityReason);

    return {
      item,
      score: totalScore,
      reasons: reasons.length > 0 ? reasons : ['Recommended for you'],
    };
  }

  /**
   * Score and sort an array of items
   */
  public scoreAndSort<T extends RatableItem>(items: T[]): ScoredItem<T>[] {
    return items
      .map(item => this.scoreItem(item))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Filter and sort items, returning top N
   */
  public getTopItems<T extends RatableItem>(items: T[], limit?: number): ScoredItem<T>[] {
    const scored = this.scoreAndSort(items);
    return limit ? scored.slice(0, limit) : scored;
  }
}

/**
 * Create a personalization engine instance
 */
export function createPersonalizationEngine(
  profileDetails: UserProfileDetails | null,
  preferences: UserPreferences | null,
  recentActivity?: RecentActivity[]
): PersonalizationEngine {
  return new PersonalizationEngine({ profileDetails, preferences, recentActivity });
}
