/**
 * Skill Graph Recommendation Engine
 * 
 * Analyzes skill dependencies, user progress, and profile to determine:
 * 1. Which skill the user should learn next
 * 2. Which prerequisites are missing
 * 3. Personalized resource recommendations per skill
 */

import type { SkillNode, SkillDependency, UserSkillProgress } from '@/hooks/useSkillGraph';

export interface SkillRecommendation {
  node: SkillNode;
  status: 'completed' | 'in_progress' | 'ready' | 'locked' | 'skipped';
  missingPrerequisites: SkillNode[];
  confidenceLevel: number;
  isRecommended: boolean;
  recommendationReason?: string;
  estimatedPosition: number; // position in the learning path
}

export interface LearningPathResult {
  domain: string;
  contentType: string;
  orderedSkills: SkillRecommendation[];
  nextSkill: SkillRecommendation | null;
  completedCount: number;
  totalCount: number;
  totalEstimatedHours: number;
  completedHours: number;
}

interface UserProfile {
  experienceLevel?: string;
  skills?: string[];
  learningGoals?: string;
  background?: string;
}

/**
 * Build a topologically sorted learning path from skill nodes and dependencies
 */
export function buildLearningPath(
  nodes: SkillNode[],
  dependencies: SkillDependency[],
  userProgress: UserSkillProgress[],
  userProfile?: UserProfile
): LearningPathResult {
  if (!nodes.length) {
    return {
      domain: '',
      contentType: 'tech',
      orderedSkills: [],
      nextSkill: null,
      completedCount: 0,
      totalCount: 0,
      totalEstimatedHours: 0,
      completedHours: 0,
    };
  }

  const progressMap = new Map<string, UserSkillProgress>();
  userProgress.forEach(p => progressMap.set(p.skill_node_id, p));

  // Build adjacency list for topological sort
  const prereqMap = new Map<string, Set<string>>(); // skill -> set of prerequisite IDs
  const nodeMap = new Map<string, SkillNode>();
  nodes.forEach(n => {
    nodeMap.set(n.id, n);
    prereqMap.set(n.id, new Set());
  });

  dependencies.forEach(d => {
    if (d.dependency_type === 'required' || d.dependency_type === 'recommended') {
      prereqMap.get(d.skill_id)?.add(d.prerequisite_id);
    }
  });

  // Topological sort (Kahn's algorithm)
  const inDegree = new Map<string, number>();
  nodes.forEach(n => inDegree.set(n.id, 0));
  dependencies.forEach(d => {
    if (nodeMap.has(d.skill_id) && nodeMap.has(d.prerequisite_id)) {
      inDegree.set(d.skill_id, (inDegree.get(d.skill_id) || 0) + 1);
    }
  });

  const queue: string[] = [];
  nodes.forEach(n => {
    if ((inDegree.get(n.id) || 0) === 0) queue.push(n.id);
  });

  const sorted: string[] = [];
  while (queue.length > 0) {
    // Sort by display_order for deterministic ordering among same-level nodes
    queue.sort((a, b) => (nodeMap.get(a)?.display_order || 0) - (nodeMap.get(b)?.display_order || 0));
    const current = queue.shift()!;
    sorted.push(current);

    dependencies.forEach(d => {
      if (d.prerequisite_id === current && nodeMap.has(d.skill_id)) {
        const newDegree = (inDegree.get(d.skill_id) || 1) - 1;
        inDegree.set(d.skill_id, newDegree);
        if (newDegree === 0) queue.push(d.skill_id);
      }
    });
  }

  // Add any remaining nodes not in sorted (disconnected)
  nodes.forEach(n => {
    if (!sorted.includes(n.id)) sorted.push(n.id);
  });

  // Determine status for each skill
  const orderedSkills: SkillRecommendation[] = sorted.map((nodeId, index) => {
    const node = nodeMap.get(nodeId)!;
    const progress = progressMap.get(nodeId);
    const prereqs = prereqMap.get(nodeId) || new Set();

    // Find missing prerequisites
    const missingPrereqs: SkillNode[] = [];
    prereqs.forEach(prereqId => {
      const prereqProgress = progressMap.get(prereqId);
      if (!prereqProgress || prereqProgress.status !== 'completed') {
        const prereqNode = nodeMap.get(prereqId);
        if (prereqNode) missingPrereqs.push(prereqNode);
      }
    });

    let status: SkillRecommendation['status'] = 'locked';
    if (progress?.status === 'completed') {
      status = 'completed';
    } else if (progress?.status === 'skipped') {
      status = 'skipped';
    } else if (progress?.status === 'in_progress') {
      status = 'in_progress';
    } else if (missingPrereqs.length === 0) {
      status = 'ready';
    }

    // Skip detection: if user profile indicates they already know this skill
    const userKnowsSkill = userProfile?.skills?.some(
      s => s.toLowerCase().includes(node.name.toLowerCase()) || 
           node.name.toLowerCase().includes(s.toLowerCase())
    );

    // Determine recommendation
    let isRecommended = false;
    let recommendationReason = '';

    if (status === 'ready' && !userKnowsSkill) {
      isRecommended = true;
      recommendationReason = missingPrereqs.length === 0
        ? 'All prerequisites met - ready to start!'
        : 'Recommended based on your progress';
    }

    // Level matching
    if (userProfile?.experienceLevel) {
      const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
      const userLevel = levelMap[userProfile.experienceLevel] || 1;
      const skillLevel = levelMap[node.difficulty_level] || 1;

      if (skillLevel > userLevel + 1) {
        recommendationReason = `This is ${node.difficulty_level} level - consider building prerequisites first`;
      }
    }

    return {
      node,
      status,
      missingPrerequisites: missingPrereqs,
      confidenceLevel: progress?.confidence_level || (userKnowsSkill ? 80 : 0),
      isRecommended,
      recommendationReason,
      estimatedPosition: index + 1,
    };
  });

  // Find next recommended skill
  const nextSkill = orderedSkills.find(s => s.isRecommended && s.status === 'ready') ||
                    orderedSkills.find(s => s.status === 'in_progress') ||
                    orderedSkills.find(s => s.status === 'ready') ||
                    null;

  if (nextSkill && !nextSkill.isRecommended) {
    nextSkill.isRecommended = true;
    nextSkill.recommendationReason = 'Next step in your learning path';
  }

  const completedCount = orderedSkills.filter(s => s.status === 'completed').length;
  const completedHours = orderedSkills
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.node.estimated_hours, 0);

  return {
    domain: nodes[0]?.domain || '',
    contentType: nodes[0]?.content_type || 'tech',
    orderedSkills,
    nextSkill,
    completedCount,
    totalCount: orderedSkills.length,
    totalEstimatedHours: orderedSkills.reduce((sum, s) => sum + s.node.estimated_hours, 0),
    completedHours,
  };
}

/**
 * Match domain name from URL to skill graph domain
 */
export function matchDomainToSkillGraph(skillName: string): string | null {
  const domainMappings: Record<string, string[]> = {
    'Machine Learning': ['ai', 'ai/ml', 'machine learning', 'ml', 'artificial intelligence', 'deep learning', 'neural networks'],
    'Web Development': ['web development', 'web dev', 'frontend', 'backend', 'full stack', 'fullstack', 'react', 'javascript', 'html', 'css', 'node.js', 'nodejs'],
    'Data Science': ['data science', 'data analysis', 'data analytics', 'data engineering', 'big data'],
    'Cybersecurity': ['cybersecurity', 'cyber security', 'information security', 'ethical hacking', 'penetration testing', 'infosec'],
    'Cloud Computing': ['cloud computing', 'aws', 'azure', 'gcp', 'devops', 'cloud'],
    'GATE': ['gate', 'gate exam'],
    'CAT': ['cat', 'cat exam', 'mba entrance'],
    'GRE': ['gre', 'gre exam', 'graduate record'],
    'JEE': ['jee', 'jee main', 'jee advanced', 'iit jee'],
    'NEET': ['neet', 'neet exam', 'medical entrance'],
    'Finance': ['finance', 'financial', 'accounting', 'investment', 'stock market'],
    'Fine Arts': ['fine arts', 'painting', 'sculpture', 'drawing', 'visual arts'],
    'Music': ['music', 'music production', 'music theory', 'songwriting'],
    'Photography': ['photography', 'photo editing', 'camera'],
    'Graphic Design': ['graphic design', 'ui/ux', 'ui design', 'ux design', 'visual design'],
  };

  const normalized = skillName.toLowerCase().trim();

  for (const [domain, keywords] of Object.entries(domainMappings)) {
    if (keywords.some(k => normalized === k || normalized.includes(k) || k.includes(normalized))) {
      return domain;
    }
  }

  return null;
}

/**
 * Filter resources by skill node relevance
 */
export function filterResourcesBySkill(
  resources: any[],
  skillNode: SkillNode,
  userLevel: string = 'beginner'
): any[] {
  const skillKeywords = [
    skillNode.name.toLowerCase(),
    skillNode.domain.toLowerCase(),
    ...(skillNode.subdomain ? [skillNode.subdomain.toLowerCase()] : []),
    ...(skillNode.learning_outcomes || []).map(o => o.toLowerCase()),
  ];

  return resources
    .map(resource => {
      const title = (resource.title || '').toLowerCase();
      const description = (resource.description || '').toLowerCase();
      const category = (resource.category || '').toLowerCase();
      const skills = (resource.related_skills || []).map((s: string) => s.toLowerCase());

      // Calculate relevance score
      let relevance = 0;
      skillKeywords.forEach(keyword => {
        if (title.includes(keyword)) relevance += 3;
        if (description.includes(keyword)) relevance += 1;
        if (category.includes(keyword)) relevance += 2;
        if (skills.some((s: string) => s.includes(keyword))) relevance += 2;
      });

      // Difficulty matching bonus
      const difficultyMatch = resource.difficulty?.toLowerCase() === skillNode.difficulty_level;
      if (difficultyMatch) relevance += 2;

      return { ...resource, _relevance: relevance };
    })
    .filter(r => r._relevance > 0)
    .sort((a, b) => {
      // Primary: relevance score
      if (b._relevance !== a._relevance) return b._relevance - a._relevance;
      // Secondary: weighted rating
      return (b.weighted_rating || 0) - (a.weighted_rating || 0);
    });
}
