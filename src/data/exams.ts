export interface Exam {
  title: string;
  icon: string;
  color: string;
  description: string;
  link: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: ('student' | 'professional' | 'self-learner')[];
  educationLevels: ('high-school' | 'bachelors' | 'masters' | 'phd')[];
  targetCountries: string[];
  category: 'graduate' | 'undergraduate' | 'professional';
}

export const exams: Exam[] = [
  {
    title: "GRE",
    icon: "GraduationCap",
    color: "from-indigo-500 to-blue-500",
    description: "Graduate record examinations prep.",
    link: "https://www.in.ets.org/gre/test-takers/general-test/about.html",
    difficulty: "intermediate",
    relevantBackgrounds: ["student"],
    educationLevels: ["bachelors"],
    targetCountries: ["USA", "UK", "Canada", "Australia"],
    category: "graduate",
  },
  {
    title: "GMAT",
    icon: "GraduationCap",
    color: "from-green-500 to-emerald-500",
    description: "Business school entrance test prep.",
    link: "https://www.mba.com/exams/gmat-exam",
    difficulty: "advanced",
    relevantBackgrounds: ["student", "professional"],
    educationLevels: ["bachelors", "masters"],
    targetCountries: ["USA", "UK", "Canada", "Europe"],
    category: "graduate",
  },
  {
    title: "CAT",
    icon: "GraduationCap",
    color: "from-rose-500 to-red-500",
    description: "Management entrance exam prep.",
    link: "https://iimcat.ac.in",
    difficulty: "advanced",
    relevantBackgrounds: ["student", "professional"],
    educationLevels: ["bachelors"],
    targetCountries: ["India"],
    category: "graduate",
  },
  {
    title: "JEE",
    icon: "GraduationCap",
    color: "from-yellow-500 to-amber-500",
    description: "Engineering entrance exam prep.",
    link: "https://jeemain.nta.nic.in",
    difficulty: "advanced",
    relevantBackgrounds: ["student"],
    educationLevels: ["high-school"],
    targetCountries: ["India"],
    category: "undergraduate",
  },
  {
    title: "NEET",
    icon: "GraduationCap",
    color: "from-pink-500 to-purple-500",
    description: "Medical entrance exam prep.",
    link: "https://neet.nta.nic.in",
    difficulty: "advanced",
    relevantBackgrounds: ["student"],
    educationLevels: ["high-school"],
    targetCountries: ["India"],
    category: "undergraduate",
  },
];
