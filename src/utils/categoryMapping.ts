export interface CategoryMap {
  domain: string;
  subdomain: string;
}

/**
 * Canonical Category → Domain → Subdomain mapping.
 *
 * Domains in use (kept consistent with existing DB rows and Explore tabs):
 *   - Technology
 *   - AI & Data
 *   - Business & Finance
 *   - Arts & Design
 *   - Humanities & Social Sciences
 *   - Health & Lifestyle
 *   - General Studies
 *   - Exam Prep
 *
 * IMPORTANT: When adding a category, keep the domain string identical to
 * one of the values above. Recommendation/explore filters perform ilike
 * comparisons on `resources.domain` and inconsistent values silently
 * fragment results.
 */
export const CATEGORY_MAPPING: Record<string, CategoryMap> = {
  // ---------- Technology ----------
  'Web Development': { domain: 'Technology', subdomain: 'Web Development' },
  'Full Stack Development': { domain: 'Technology', subdomain: 'Web Development' },
  'Mobile Development': { domain: 'Technology', subdomain: 'Mobile Development' },
  'JavaScript': { domain: 'Technology', subdomain: 'JavaScript' },
  'Python': { domain: 'Technology', subdomain: 'Python' },
  'Programming': { domain: 'Technology', subdomain: 'Programming' },
  'Development': { domain: 'Technology', subdomain: 'Programming' },
  'Computer Applications': { domain: 'Technology', subdomain: 'Computer Applications' },
  'Computer Science': { domain: 'Technology', subdomain: 'Computer Science' },
  'DSA': { domain: 'Technology', subdomain: 'DSA' },
  'System Design': { domain: 'Technology', subdomain: 'System Design' },
  'Game Development': { domain: 'Technology', subdomain: 'Game Development' },
  'Blockchain': { domain: 'Technology', subdomain: 'Blockchain' },
  'Cloud Computing': { domain: 'Technology', subdomain: 'Cloud Computing' },
  'AWS': { domain: 'Technology', subdomain: 'Cloud Computing' },
  'DevOps': { domain: 'Technology', subdomain: 'DevOps' },
  'Networking': { domain: 'Technology', subdomain: 'Networking' },
  'Cybersecurity': { domain: 'Technology', subdomain: 'Cybersecurity' },
  'Database': { domain: 'Technology', subdomain: 'Database' },
  'General': { domain: 'Technology', subdomain: 'General' },

  // ---------- AI & Data ----------
  'Machine Learning': { domain: 'AI & Data', subdomain: 'Machine Learning' },
  'AI/ML': { domain: 'AI & Data', subdomain: 'AI/ML' },
  'Artificial Intelligence': { domain: 'AI & Data', subdomain: 'Artificial Intelligence' },
  'Data Science': { domain: 'AI & Data', subdomain: 'Data Science' },

  // ---------- Business & Finance ----------
  'Business & Management': { domain: 'Business & Finance', subdomain: 'Management' },
  'Business Administration': { domain: 'Business & Finance', subdomain: 'Management' },
  'Management': { domain: 'Business & Finance', subdomain: 'Management' },
  'Project Management': { domain: 'Business & Finance', subdomain: 'Project Management' },
  'Business': { domain: 'Business & Finance', subdomain: 'Business' },
  'Supply Chain & Procurement': { domain: 'Business & Finance', subdomain: 'Operations' },
  'Event Management': { domain: 'Business & Finance', subdomain: 'Operations' },
  'Human Resources': { domain: 'Business & Finance', subdomain: 'Human Resources' },
  'Marketing': { domain: 'Business & Finance', subdomain: 'Marketing' },
  'Digital Marketing': { domain: 'Business & Finance', subdomain: 'Digital Marketing' },
  'Content Marketing': { domain: 'Business & Finance', subdomain: 'Marketing' },
  'Social Media Marketing': { domain: 'Business & Finance', subdomain: 'Marketing' },
  'Public Relations & Communications': { domain: 'Business & Finance', subdomain: 'Marketing' },
  'Communication': { domain: 'Business & Finance', subdomain: 'Communication' },
  'Finance': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Finance & Accounting': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Accounting & Finance': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Accounting': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Investment': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Finance & Investment': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Financial Planning': { domain: 'Business & Finance', subdomain: 'Finance' },
  'Economics': { domain: 'Business & Finance', subdomain: 'Economics' },

  // ---------- Arts & Design ----------
  'Design': { domain: 'Arts & Design', subdomain: 'Design' },
  'UI/UX Design': { domain: 'Arts & Design', subdomain: 'UI/UX Design' },
  'Graphic Design': { domain: 'Arts & Design', subdomain: 'Graphic Design' },
  'Interior Design': { domain: 'Arts & Design', subdomain: 'Design' },
  'Fashion Design': { domain: 'Arts & Design', subdomain: 'Fashion' },
  'Fashion Styling': { domain: 'Arts & Design', subdomain: 'Fashion' },
  'Architecture': { domain: 'Arts & Design', subdomain: 'Architecture' },
  'Fine Arts': { domain: 'Arts & Design', subdomain: 'Arts' },
  'Arts & Painting': { domain: 'Arts & Design', subdomain: 'Arts' },
  'Music': { domain: 'Arts & Design', subdomain: 'Music' },
  'Performing Arts': { domain: 'Arts & Design', subdomain: 'Performing Arts' },
  'Dance': { domain: 'Arts & Design', subdomain: 'Performing Arts' },
  'Film & Cinema': { domain: 'Arts & Design', subdomain: 'Film & Video' },
  'Film & Video': { domain: 'Arts & Design', subdomain: 'Film & Video' },
  'Animation': { domain: 'Arts & Design', subdomain: 'Animation' },
  'Animation & VFX': { domain: 'Arts & Design', subdomain: 'Animation' },
  'Photography': { domain: 'Arts & Design', subdomain: 'Photography' },
  'Creative Writing': { domain: 'Arts & Design', subdomain: 'Writing' },
  'Culinary Arts': { domain: 'Arts & Design', subdomain: 'Culinary Arts' },

  // ---------- Humanities & Social Sciences ----------
  'Psychology': { domain: 'Humanities & Social Sciences', subdomain: 'Psychology' },
  'Journalism & Media': { domain: 'Humanities & Social Sciences', subdomain: 'Journalism' },
  'Journalism': { domain: 'Humanities & Social Sciences', subdomain: 'Journalism' },
  'International Relations': { domain: 'Humanities & Social Sciences', subdomain: 'Political Science' },
  'Political Science': { domain: 'Humanities & Social Sciences', subdomain: 'Political Science' },
  'Social Work': { domain: 'Humanities & Social Sciences', subdomain: 'Sociology' },
  'Museum & Heritage Studies': { domain: 'Humanities & Social Sciences', subdomain: 'History' },
  'Philosophy': { domain: 'Humanities & Social Sciences', subdomain: 'Philosophy' },
  'Law': { domain: 'Humanities & Social Sciences', subdomain: 'Law' },
  'Law & Legal Studies': { domain: 'Humanities & Social Sciences', subdomain: 'Law' },
  'Education': { domain: 'Humanities & Social Sciences', subdomain: 'Education' },
  'Education & Teaching': { domain: 'Humanities & Social Sciences', subdomain: 'Education' },

  // ---------- Health & Lifestyle ----------
  'Health & Fitness': { domain: 'Health & Lifestyle', subdomain: 'Health & Fitness' },
  'Nutrition & Health': { domain: 'Health & Lifestyle', subdomain: 'Nutrition' },
  'Hospitality & Food & Beverage': { domain: 'Health & Lifestyle', subdomain: 'Food & Beverage' },

  // ---------- General Studies ----------
  'Environmental Science': { domain: 'General Studies', subdomain: 'Environmental Science' },

  // ---------- Exam Prep ----------
  'GRE': { domain: 'Exam Prep', subdomain: 'GRE' },
  'Exam Prep - GRE': { domain: 'Exam Prep', subdomain: 'GRE' },
  'CAT': { domain: 'Exam Prep', subdomain: 'CAT' },
  'Exam Prep - CAT': { domain: 'Exam Prep', subdomain: 'CAT' },
  'GATE': { domain: 'Exam Prep', subdomain: 'GATE' },
  'Exam Prep - GATE': { domain: 'Exam Prep', subdomain: 'GATE' },
  'UPSC': { domain: 'Exam Prep', subdomain: 'UPSC' },
  'Exam Prep - UPSC': { domain: 'Exam Prep', subdomain: 'UPSC' },
  'NEET': { domain: 'Exam Prep', subdomain: 'NEET' },
  'Exam Prep - NEET': { domain: 'Exam Prep', subdomain: 'NEET' },
  'JEE': { domain: 'Exam Prep', subdomain: 'JEE' },
  'Exam Prep - JEE': { domain: 'Exam Prep', subdomain: 'JEE' },
  'TOEFL': { domain: 'Exam Prep', subdomain: 'TOEFL' },
  'IELTS': { domain: 'Exam Prep', subdomain: 'IELTS' },
  'SAT': { domain: 'Exam Prep', subdomain: 'SAT' },
  'LSAT': { domain: 'Exam Prep', subdomain: 'LSAT' },
  'GMAT': { domain: 'Exam Prep', subdomain: 'GMAT' },
  'MCAT': { domain: 'Exam Prep', subdomain: 'MCAT' },
  'CompTIA': { domain: 'Exam Prep', subdomain: 'CompTIA' },
};

/**
 * Resolve mapping with case-insensitive fallback. Returns null if unknown.
 */
export function resolveCategoryMapping(category: string | null | undefined): CategoryMap | null {
  if (!category) return null;
  if (CATEGORY_MAPPING[category]) return CATEGORY_MAPPING[category];
  const lower = category.toLowerCase().trim();
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (key.toLowerCase() === lower) return value;
  }
  return null;
}
