import { UserProfileDetails } from "@/hooks/useUserProfileDetails";
import { UserPreferences } from "@/hooks/useUserPreferences";

interface PersonalizationContext {
  profileDetails: UserProfileDetails | null;
  preferences: UserPreferences | null;
}

export interface ScoredItem<T> {
  item: T;
  score: number;
  reasons: string[];
}

/**
 * Core personalization engine that scores and filters content based on user profile
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
   * Get user's learning goals from bio or profile
   */
  private getLearningGoals(): string[] {
    const bio = this.context.profileDetails?.bio || '';
    const jobTitle = this.context.profileDetails?.job_title || '';
    
    // Extract keywords that might indicate learning goals
    const keywords = [...bio.toLowerCase().split(/\s+/), ...jobTitle.toLowerCase().split(/\s+/)];
    return keywords;
  }

  /**
   * Determine user's background (student/professional/self-learner)
   */
  private getUserBackground(): 'student' | 'professional' | 'self-learner' {
    const jobTitle = this.context.profileDetails?.job_title?.toLowerCase() || '';
    const company = this.context.profileDetails?.company?.toLowerCase() || '';
    
    if (jobTitle.includes('student') || company.includes('university') || company.includes('college')) {
      return 'student';
    }
    if (jobTitle && company) {
      return 'professional';
    }
    return 'self-learner';
  }

  /**
   * Score an item based on difficulty match
   */
  private scoreDifficulty(itemDifficulty: string): { score: number; reason?: string } {
    const userLevel = this.getExperienceLevel();
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const userLevelNum = difficultyMap[userLevel];
    const itemLevelNum = difficultyMap[itemDifficulty as keyof typeof difficultyMap];

    if (userLevelNum === itemLevelNum) {
      return { score: 10, reason: `Perfect match for ${userLevel} level` };
    }
    if (Math.abs(userLevelNum - itemLevelNum) === 1) {
      return { score: 7, reason: `Good match for your level` };
    }
    if (itemLevelNum < userLevelNum) {
      return { score: 3, reason: `Might be too basic` };
    }
    return { score: 2, reason: `Might be too advanced` };
  }

  /**
   * Score an item based on skill match
   */
  private scoreSkillMatch(itemSkills: string[]): { score: number; reason?: string } {
    const userSkills = this.getUserSkills();
    if (userSkills.length === 0) return { score: 5 }; // neutral if no skills set

    const matchingSkills = itemSkills.filter(skill => 
      userSkills.some(userSkill => skill.toLowerCase().includes(userSkill) || userSkill.includes(skill.toLowerCase()))
    );

    if (matchingSkills.length >= 3) {
      return { score: 10, reason: `Matches your skills: ${matchingSkills.slice(0, 2).join(', ')}` };
    }
    if (matchingSkills.length >= 1) {
      return { score: 7, reason: `Related to ${matchingSkills[0]}` };
    }
    return { score: 4 };
  }

  /**
   * Score an item based on background match
   */
  private scoreBackgroundMatch(itemBackgrounds: string[]): { score: number; reason?: string } {
    const userBackground = this.getUserBackground();
    if (itemBackgrounds.includes(userBackground)) {
      return { score: 8, reason: `Perfect for ${userBackground}s` };
    }
    return { score: 5 };
  }

  /**
   * Score an item based on learning path alignment
   */
  private scoreLearningPathAlignment(itemTitle: string, itemDescription: string): { score: number; reason?: string } {
    const goals = this.getLearningGoals();
    const searchText = `${itemTitle} ${itemDescription}`.toLowerCase();
    
    const matchingGoals = goals.filter(goal => 
      goal.length > 3 && searchText.includes(goal)
    );

    if (matchingGoals.length > 2) {
      return { score: 8, reason: 'Aligns with your goals' };
    }
    return { score: 5 };
  }

  /**
   * Generic scoring function for any item with common properties
   */
  public scoreItem<T extends {
    difficulty?: string;
    relatedSkills?: string[];
    relevantBackgrounds?: string[];
    title?: string;
    name?: string;
    description?: string;
  }>(item: T): ScoredItem<T> {
    let totalScore = 0;
    const reasons: string[] = [];

    // Score difficulty
    if (item.difficulty) {
      const { score, reason } = this.scoreDifficulty(item.difficulty);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // Score skill match
    if (item.relatedSkills && item.relatedSkills.length > 0) {
      const { score, reason } = this.scoreSkillMatch(item.relatedSkills);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // Score background match
    if (item.relevantBackgrounds && item.relevantBackgrounds.length > 0) {
      const { score, reason } = this.scoreBackgroundMatch(item.relevantBackgrounds);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    // Score learning path alignment
    const title = item.title || item.name || '';
    const description = item.description || '';
    if (title || description) {
      const { score, reason } = this.scoreLearningPathAlignment(title, description);
      totalScore += score;
      if (reason) reasons.push(reason);
    }

    return {
      item,
      score: totalScore,
      reasons: reasons.length > 0 ? reasons : ['Recommended for you'],
    };
  }

  /**
   * Score and sort an array of items
   */
  public scoreAndSort<T extends {
    difficulty?: string;
    relatedSkills?: string[];
    relevantBackgrounds?: string[];
    title?: string;
    name?: string;
    description?: string;
  }>(items: T[]): ScoredItem<T>[] {
    return items
      .map(item => this.scoreItem(item))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Filter and sort items, returning top N
   */
  public getTopItems<T extends {
    difficulty?: string;
    relatedSkills?: string[];
    relevantBackgrounds?: string[];
    title?: string;
    name?: string;
    description?: string;
  }>(items: T[], limit?: number): ScoredItem<T>[] {
    const scored = this.scoreAndSort(items);
    return limit ? scored.slice(0, limit) : scored;
  }
}

/**
 * Create a personalization engine instance
 */
export function createPersonalizationEngine(
  profileDetails: UserProfileDetails | null,
  preferences: UserPreferences | null
): PersonalizationEngine {
  return new PersonalizationEngine({ profileDetails, preferences });
}
