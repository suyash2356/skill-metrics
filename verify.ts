import { PersonalizationEngine } from './src/lib/personalization';

// Mock Resources
const resources = [
  {
    id: '1',
    title: 'Advanced Deep Learning with PyTorch',
    description: 'Learn neural networks and machine learning.',
    relatedSkills: ['Machine Learning', 'Python'],
    difficulty: 'advanced',
    weighted_rating: 4.8,
    total_ratings: 150
  },
  {
    id: '2',
    title: 'UI/UX Design Principles in Figma',
    description: 'Master the art of user interfaces and user experience.',
    relatedSkills: ['UI/UX Design', 'Figma'],
    difficulty: 'beginner',
    weighted_rating: 4.6,
    total_ratings: 80
  },
  {
    id: '3',
    title: 'Fullstack Web Development Bootcamp',
    description: 'React, Node, Express, MongoDB.',
    relatedSkills: ['Web Development', 'React'],
    difficulty: 'intermediate',
    weighted_rating: 4.9,
    total_ratings: 200
  }
];

// User 1: AI & Data enthusiast
const aiUserProfile = {
  id: 'u1',
  user_id: 'u1',
  experience_level: 'advanced',
  interested_domains: ['AI & Data'],
  interested_subdomains: ['Machine Learning'],
  social_links: [],
  skills: [],
  achievements: [],
  learning_path: [],
  total_posts: 0,
  total_roadmaps: 0,
  total_likes_received: 0,
  total_comments_received: 0
} as any;

// User 2: Design enthusiast (Cold Start)
const designUserProfile = {
  id: 'u2',
  user_id: 'u2',
  experience_level: 'beginner',
  interested_domains: ['Design & Arts'],
  interested_subdomains: ['UI/UX Design'],
  social_links: [],
  skills: [],
  achievements: [],
  learning_path: [],
  total_posts: 0,
  total_roadmaps: 0,
  total_likes_received: 0,
  total_comments_received: 0
} as any;

const aiEngine = new PersonalizationEngine({ profileDetails: aiUserProfile, preferences: null, recentActivity: [] });
const designEngine = new PersonalizationEngine({ profileDetails: designUserProfile, preferences: null, recentActivity: [] });

console.log("========== USER 1: AI & DATA (Advanced) ==========");
const aiResults = aiEngine.scoreAndSort(resources);
aiResults.forEach(r => console.log(`Score: ${r.score} | Item: ${r.item.title} | Reasons: ${r.reasons.join(', ')}`));

console.log("\n========== USER 2: DESIGN & ARTS (Beginner) ==========");
const designResults = designEngine.scoreAndSort(resources);
designResults.forEach(r => console.log(`Score: ${r.score} | Item: ${r.item.title} | Reasons: ${r.reasons.join(', ')}`));
