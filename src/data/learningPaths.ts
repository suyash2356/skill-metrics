export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relevantBackgrounds: ('student' | 'professional' | 'self-learner')[];
  educationLevels: ('high-school' | 'bachelors' | 'masters' | 'phd')[];
  relatedSkills: string[];
  targetRole: string;
  prerequisites: string[];
  roadmap: {
    phase: string;
    duration: string;
    topics: string[];
    resources: string[];
  }[];
}

export const learningPaths: LearningPath[] = [
  {
    title: "Full-Stack Web Developer",
    description: "Master both frontend and backend development to build complete web applications.",
    duration: "6-12 months",
    difficulty: "beginner",
    relevantBackgrounds: ["student", "self-learner", "professional"],
    educationLevels: ["high-school", "bachelors"],
    relatedSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    targetRole: "Full-Stack Developer",
    prerequisites: ["Basic programming knowledge"],
    roadmap: [
      {
        phase: "Month 1-2: Frontend Basics",
        duration: "2 months",
        topics: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"],
        resources: ["freeCodeCamp", "MDN Web Docs", "CSS Tricks"],
      },
      {
        phase: "Month 3-4: Frontend Frameworks",
        duration: "2 months",
        topics: ["React", "State Management", "React Router", "Component Design"],
        resources: ["React Documentation", "Scrimba React Course", "Frontend Masters"],
      },
      {
        phase: "Month 5-6: Backend Development",
        duration: "2 months",
        topics: ["Node.js", "Express", "REST APIs", "Authentication"],
        resources: ["Node.js Documentation", "The Odin Project", "Udemy"],
      },
      {
        phase: "Month 7-8: Databases",
        duration: "2 months",
        topics: ["MongoDB", "PostgreSQL", "Database Design", "ORMs"],
        resources: ["MongoDB University", "PostgreSQL Tutorial", "Prisma Docs"],
      },
      {
        phase: "Month 9-12: Advanced & Projects",
        duration: "4 months",
        topics: ["Deployment", "CI/CD", "Testing", "Portfolio Projects"],
        resources: ["Vercel", "GitHub Actions", "Jest", "Real-world projects"],
      },
    ],
  },
  {
    title: "Data Scientist",
    description: "Learn to analyze data, build ML models, and extract actionable insights.",
    duration: "8-12 months",
    difficulty: "intermediate",
    relevantBackgrounds: ["student", "professional"],
    educationLevels: ["bachelors", "masters"],
    relatedSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
    targetRole: "Data Scientist",
    prerequisites: ["Basic programming", "Math fundamentals"],
    roadmap: [
      {
        phase: "Month 1-2: Python & Statistics",
        duration: "2 months",
        topics: ["Python", "NumPy", "Pandas", "Statistics", "Probability"],
        resources: ["Python for Everybody", "Khan Academy Statistics", "DataCamp"],
      },
      {
        phase: "Month 3-4: Data Analysis",
        duration: "2 months",
        topics: ["SQL", "Data Cleaning", "Exploratory Analysis", "Visualization"],
        resources: ["Mode Analytics SQL", "Kaggle", "Matplotlib & Seaborn"],
      },
      {
        phase: "Month 5-7: Machine Learning",
        duration: "3 months",
        topics: ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Evaluation"],
        resources: ["Andrew Ng's ML Course", "Scikit-learn Docs", "Kaggle Competitions"],
      },
      {
        phase: "Month 8-10: Deep Learning",
        duration: "3 months",
        topics: ["Neural Networks", "TensorFlow/PyTorch", "CNNs", "RNNs"],
        resources: ["Fast.ai", "Deep Learning Specialization", "Papers with Code"],
      },
      {
        phase: "Month 11-12: Specialization & Portfolio",
        duration: "2 months",
        topics: ["NLP or Computer Vision", "MLOps", "Portfolio Projects"],
        resources: ["Hugging Face", "MLflow", "GitHub Projects"],
      },
    ],
  },
  {
    title: "Cloud DevOps Engineer",
    description: "Automate infrastructure, implement CI/CD, and manage cloud-native applications.",
    duration: "6-10 months",
    difficulty: "intermediate",
    relevantBackgrounds: ["professional", "student"],
    educationLevels: ["bachelors", "masters"],
    relatedSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform"],
    targetRole: "DevOps Engineer",
    prerequisites: ["Basic Linux", "Networking knowledge"],
    roadmap: [
      {
        phase: "Month 1-2: Linux & Scripting",
        duration: "2 months",
        topics: ["Linux Administration", "Bash Scripting", "Git", "Networking"],
        resources: ["Linux Journey", "OverTheWire", "Git Documentation"],
      },
      {
        phase: "Month 3-4: Cloud Fundamentals",
        duration: "2 months",
        topics: ["AWS Basics", "EC2", "S3", "VPC", "IAM"],
        resources: ["AWS Free Tier", "A Cloud Guru", "AWS Documentation"],
      },
      {
        phase: "Month 5-6: Containerization",
        duration: "2 months",
        topics: ["Docker", "Container Orchestration", "Kubernetes", "Helm"],
        resources: ["Docker Documentation", "Kubernetes.io", "KodeKloud"],
      },
      {
        phase: "Month 7-8: CI/CD & IaC",
        duration: "2 months",
        topics: ["Jenkins", "GitHub Actions", "Terraform", "Ansible"],
        resources: ["Jenkins Documentation", "Terraform Tutorials", "Ansible Docs"],
      },
      {
        phase: "Month 9-10: Advanced & Monitoring",
        duration: "2 months",
        topics: ["Monitoring", "Logging", "Security", "Production Projects"],
        resources: ["Prometheus", "Grafana", "ELK Stack", "Real-world scenarios"],
      },
    ],
  },
  {
    title: "Cybersecurity Analyst",
    description: "Protect systems and networks by identifying vulnerabilities and threats.",
    duration: "8-12 months",
    difficulty: "advanced",
    relevantBackgrounds: ["professional", "student"],
    educationLevels: ["bachelors", "masters"],
    relatedSkills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response"],
    targetRole: "Cybersecurity Analyst",
    prerequisites: ["Networking fundamentals", "Linux basics"],
    roadmap: [
      {
        phase: "Month 1-2: Networking & Security Basics",
        duration: "2 months",
        topics: ["TCP/IP", "OSI Model", "Firewalls", "VPNs"],
        resources: ["CompTIA Network+", "Cybrary", "TryHackMe"],
      },
      {
        phase: "Month 3-4: Operating Systems Security",
        duration: "2 months",
        topics: ["Windows Security", "Linux Hardening", "Active Directory"],
        resources: ["Microsoft Learn", "Linux Security", "HackTheBox"],
      },
      {
        phase: "Month 5-7: Ethical Hacking",
        duration: "3 months",
        topics: ["Penetration Testing", "Vulnerability Assessment", "Exploitation"],
        resources: ["OSCP Prep", "Metasploit", "Burp Suite"],
      },
      {
        phase: "Month 8-10: Security Tools & Frameworks",
        duration: "3 months",
        topics: ["SIEM", "IDS/IPS", "Threat Intelligence", "Security Frameworks"],
        resources: ["Splunk", "Snort", "MITRE ATT&CK", "NIST Framework"],
      },
      {
        phase: "Month 11-12: Certifications & Projects",
        duration: "2 months",
        topics: ["Security+", "CEH", "Portfolio Projects", "CTF Challenges"],
        resources: ["CompTIA", "EC-Council", "CTFtime", "Bug Bounty"],
      },
    ],
  },
  {
    title: "AI/ML Engineer",
    description: "Build and deploy production-ready machine learning and AI systems.",
    duration: "10-14 months",
    difficulty: "advanced",
    relevantBackgrounds: ["professional", "student"],
    educationLevels: ["bachelors", "masters", "phd"],
    relatedSkills: ["Python", "Deep Learning", "TensorFlow", "PyTorch", "MLOps"],
    targetRole: "AI/ML Engineer",
    prerequisites: ["Strong programming", "Linear algebra", "Calculus"],
    roadmap: [
      {
        phase: "Month 1-3: ML Foundations",
        duration: "3 months",
        topics: ["Python", "Math for ML", "Classical ML Algorithms", "Feature Engineering"],
        resources: ["Andrew Ng ML", "Mathematics for ML", "Kaggle Learn"],
      },
      {
        phase: "Month 4-6: Deep Learning",
        duration: "3 months",
        topics: ["Neural Networks", "CNNs", "RNNs", "Transformers"],
        resources: ["Deep Learning Specialization", "Fast.ai", "Stanford CS231n"],
      },
      {
        phase: "Month 7-9: Advanced AI",
        duration: "3 months",
        topics: ["NLP", "Computer Vision", "Reinforcement Learning", "GANs"],
        resources: ["Hugging Face", "OpenCV", "Spinning Up in RL", "Papers"],
      },
      {
        phase: "Month 10-12: MLOps & Production",
        duration: "3 months",
        topics: ["Model Deployment", "MLflow", "Docker", "Cloud ML Services"],
        resources: ["MLOps Course", "AWS SageMaker", "Google AI Platform"],
      },
      {
        phase: "Month 13-14: Research & Portfolio",
        duration: "2 months",
        topics: ["Research Papers", "Open Source Contributions", "Advanced Projects"],
        resources: ["ArXiv", "GitHub", "Kaggle Competitions", "Personal Projects"],
      },
    ],
  },
  {
    title: "UI/UX Designer",
    description: "Create intuitive and beautiful user experiences for digital products.",
    duration: "5-8 months",
    difficulty: "beginner",
    relevantBackgrounds: ["student", "self-learner", "professional"],
    educationLevels: ["high-school", "bachelors"],
    relatedSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    targetRole: "UI/UX Designer",
    prerequisites: ["Basic design sense", "Creativity"],
    roadmap: [
      {
        phase: "Month 1-2: Design Fundamentals",
        duration: "2 months",
        topics: ["Design Principles", "Typography", "Color Theory", "Layout"],
        resources: ["Design Course", "Refactoring UI", "Laws of UX"],
      },
      {
        phase: "Month 3-4: UX Research",
        duration: "2 months",
        topics: ["User Research", "Personas", "User Journeys", "Information Architecture"],
        resources: ["NNGroup", "UX Research Methods", "Usability Testing"],
      },
      {
        phase: "Month 5-6: Design Tools",
        duration: "2 months",
        topics: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
        resources: ["Figma Learn", "Design Systems Handbook", "UI Kits"],
      },
      {
        phase: "Month 7-8: Portfolio & Practice",
        duration: "2 months",
        topics: ["Case Studies", "Portfolio Projects", "Design Critique", "Freelancing"],
        resources: ["Behance", "Dribbble", "Daily UI", "Client Projects"],
      },
    ],
  },
];
