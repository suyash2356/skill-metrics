// Domain-based skills and topics mapping
export const DOMAIN_SKILLS: Record<string, string[]> = {
  'AI/ML': [
    'Python Programming',
    'Mathematics (Linear Algebra, Calculus, Statistics)',
    'Machine Learning Fundamentals',
    'Deep Learning',
    'Neural Networks',
    'TensorFlow/PyTorch',
    'Natural Language Processing (NLP)',
    'Computer Vision',
    'Data Preprocessing',
    'Model Deployment'
  ],
  'Web Development': [
    'HTML5',
    'CSS3',
    'JavaScript',
    'React.js',
    'Node.js',
    'RESTful APIs',
    'Database Management',
    'Version Control (Git)',
    'Responsive Design',
    'TypeScript'
  ],
  'Data Science': [
    'Python/R Programming',
    'Statistics & Probability',
    'Data Visualization',
    'SQL & Databases',
    'Pandas & NumPy',
    'Data Cleaning',
    'Machine Learning',
    'Big Data Technologies',
    'Data Analysis',
    'Excel & Tableau'
  ],
  'Mobile Development': [
    'React Native/Flutter',
    'iOS Development (Swift)',
    'Android Development (Kotlin)',
    'Mobile UI/UX',
    'API Integration',
    'Mobile Database',
    'App Deployment',
    'Push Notifications',
    'Mobile Security',
    'Performance Optimization'
  ],
  'DevOps': [
    'Linux Administration',
    'Docker & Containers',
    'Kubernetes',
    'CI/CD Pipelines',
    'AWS/Azure/GCP',
    'Infrastructure as Code',
    'Monitoring & Logging',
    'Security Best Practices',
    'Automation Scripts',
    'Version Control'
  ],
  'Cybersecurity': [
    'Network Security',
    'Cryptography',
    'Ethical Hacking',
    'Security Protocols',
    'Vulnerability Assessment',
    'Incident Response',
    'Security Tools (Wireshark, Metasploit)',
    'OWASP Top 10',
    'Penetration Testing',
    'Security Compliance'
  ],
  'Cloud Computing': [
    'AWS/Azure/GCP Fundamentals',
    'Cloud Architecture',
    'Virtual Machines',
    'Cloud Storage',
    'Serverless Computing',
    'Cloud Security',
    'Load Balancing',
    'Auto-scaling',
    'Cloud Networking',
    'Cost Optimization'
  ],
  'Blockchain': [
    'Blockchain Fundamentals',
    'Cryptocurrency Basics',
    'Smart Contracts',
    'Solidity Programming',
    'Ethereum Development',
    'Web3.js',
    'Consensus Mechanisms',
    'DeFi Concepts',
    'NFTs',
    'Blockchain Security'
  ],
  'Game Development': [
    'Unity/Unreal Engine',
    'C# or C++ Programming',
    'Game Design Principles',
    '3D Modeling',
    'Physics Engine',
    'Animation',
    'Game AI',
    'Multiplayer Networking',
    'UI/UX for Games',
    'Performance Optimization'
  ],
  'UI/UX Design': [
    'Design Principles',
    'Figma/Adobe XD',
    'User Research',
    'Wireframing',
    'Prototyping',
    'Color Theory',
    'Typography',
    'Interaction Design',
    'Usability Testing',
    'Accessibility Standards'
  ],
  'Exam Prep - JEE': [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Mechanics',
    'Thermodynamics',
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Calculus',
    'Algebra',
    'Coordinate Geometry'
  ],
  'Exam Prep - NEET': [
    'Physics',
    'Chemistry',
    'Biology',
    'Zoology',
    'Botany',
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Physical Chemistry',
    'Mechanics',
    'Human Physiology'
  ],
  'Exam Prep - GATE': [
    'Engineering Mathematics',
    'Digital Logic',
    'Computer Organization',
    'Data Structures',
    'Algorithms',
    'Operating Systems',
    'Database Management',
    'Computer Networks',
    'Theory of Computation',
    'Compiler Design'
  ],
  'Exam Prep - CAT': [
    'Quantitative Aptitude',
    'Verbal Ability',
    'Data Interpretation',
    'Logical Reasoning',
    'Reading Comprehension',
    'Time Management',
    'Mock Tests',
    'Mental Math',
    'Grammar & Vocabulary',
    'Problem Solving'
  ],
  'Exam Prep - GRE': [
    'Verbal Reasoning',
    'Quantitative Reasoning',
    'Analytical Writing',
    'Vocabulary Building',
    'Reading Comprehension',
    'Math Concepts',
    'Critical Thinking',
    'Essay Writing',
    'Test-taking Strategies',
    'Practice Tests'
  ],
  'Exam Prep - UPSC': [
    'History',
    'Geography',
    'Polity',
    'Economy',
    'Environment & Ecology',
    'Science & Technology',
    'Current Affairs',
    'Ethics & Integrity',
    'Optional Subject',
    'Essay Writing'
  ]
};

// Get skills based on category/domain
export const getSkillsForDomain = (category?: string | null): string[] => {
  if (!category) return [];
  
  // Check for exact match
  if (DOMAIN_SKILLS[category]) {
    return DOMAIN_SKILLS[category];
  }
  
  // Check for partial match or exam prep
  for (const [key, skills] of Object.entries(DOMAIN_SKILLS)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(category.toLowerCase())) {
      return skills;
    }
  }
  
  // Default skills for generic learning
  return [
    'Core Concepts',
    'Practical Application',
    'Advanced Topics',
    'Industry Tools',
    'Best Practices',
    'Project Development',
    'Problem Solving',
    'Documentation',
    'Testing & Debugging',
    'Continuous Learning'
  ];
};
