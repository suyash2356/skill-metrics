// Comprehensive skill roadmap data with learning phases and real-world context

export interface LearningPhase {
  id: string;
  title: string;
  duration: string;
  skills: string[];
  description: string;
  projects?: string[];
}

export interface SkillRoadmap {
  name: string;
  tagline: string;
  description: string;
  realWorldContext: string;
  careerPaths: string[];
  averageSalary?: string;
  jobDemand: 'High' | 'Medium' | 'Growing';
  prerequisites: string[];
  estimatedTime: string;
  difficulty: 'Beginner-Friendly' | 'Intermediate' | 'Advanced';
  phases: LearningPhase[];
  tools: string[];
  certifications?: string[];
}

export const SKILL_ROADMAPS: Record<string, SkillRoadmap> = {
  'data science': {
    name: 'Data Science',
    tagline: 'Turn raw data into actionable insights',
    description: 'Data Science combines statistics, programming, and domain expertise to extract meaningful patterns from data. It powers recommendation systems, fraud detection, medical diagnostics, and business intelligence.',
    realWorldContext: 'Data Scientists at companies like Netflix analyze viewing patterns to recommend shows, at banks they detect fraudulent transactions in real-time, and at healthcare companies they predict disease outbreaks.',
    careerPaths: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Business Intelligence Analyst', 'Research Scientist'],
    averageSalary: '$95,000 - $150,000',
    jobDemand: 'High',
    prerequisites: ['Basic Math', 'Logical Thinking', 'Curiosity'],
    estimatedTime: '6-12 months',
    difficulty: 'Intermediate',
    tools: ['Python', 'Jupyter Notebook', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'SQL', 'Git'],
    certifications: ['Google Data Analytics', 'IBM Data Science', 'AWS ML Specialty'],
    phases: [
      {
        id: 'foundation',
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'Build your programming and math fundamentals. Learn Python basics and refresh statistics concepts.',
        skills: ['Python Basics', 'Variables & Data Types', 'Statistics Fundamentals', 'Probability', 'Basic Math'],
        projects: ['Calculator App', 'Statistical Analysis of a Dataset']
      },
      {
        id: 'data-manipulation',
        title: 'Data Wrangling',
        duration: '4-6 weeks',
        description: 'Master data manipulation libraries. Learn to clean, transform, and prepare data for analysis.',
        skills: ['Pandas', 'NumPy', 'Data Cleaning', 'Data Transformation', 'Handling Missing Data'],
        projects: ['Clean a Real-World Dataset', 'Exploratory Data Analysis']
      },
      {
        id: 'visualization',
        title: 'Data Visualization',
        duration: '3-4 weeks',
        description: 'Learn to tell stories with data through compelling visualizations and dashboards.',
        skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Creation', 'Storytelling with Data'],
        projects: ['Interactive Dashboard', 'Data Story Presentation']
      },
      {
        id: 'sql-databases',
        title: 'SQL & Databases',
        duration: '3-4 weeks',
        description: 'Master SQL for data retrieval and understand database concepts for real-world data access.',
        skills: ['SQL Queries', 'Joins & Aggregations', 'Database Design', 'PostgreSQL/MySQL', 'Data Pipelines'],
        projects: ['Build a Database', 'Complex Query Analysis']
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning',
        duration: '6-8 weeks',
        description: 'Dive into ML algorithms. Learn supervised and unsupervised learning techniques.',
        skills: ['Regression', 'Classification', 'Clustering', 'Model Evaluation', 'Feature Engineering', 'Scikit-learn'],
        projects: ['Prediction Model', 'Customer Segmentation']
      },
      {
        id: 'advanced',
        title: 'Advanced & Specialization',
        duration: '4-6 weeks',
        description: 'Explore advanced topics like deep learning, NLP, or time series based on your interests.',
        skills: ['Deep Learning Basics', 'NLP or Computer Vision', 'Big Data Tools', 'Model Deployment', 'A/B Testing'],
        projects: ['End-to-End ML Project', 'Portfolio Project']
      }
    ]
  },
  'ai': {
    name: 'Artificial Intelligence',
    tagline: 'Build systems that think and learn',
    description: 'AI focuses on creating intelligent systems that can perceive, reason, learn, and act. From virtual assistants to autonomous vehicles, AI is reshaping every industry.',
    realWorldContext: 'AI powers Siri/Alexa voice recognition, Tesla autopilot, ChatGPT conversations, medical image diagnosis, and algorithmic trading systems.',
    careerPaths: ['AI Engineer', 'ML Researcher', 'NLP Specialist', 'Computer Vision Engineer', 'AI Product Manager'],
    averageSalary: '$120,000 - $200,000',
    jobDemand: 'High',
    prerequisites: ['Programming Basics', 'Mathematics', 'Logical Reasoning'],
    estimatedTime: '12-18 months',
    difficulty: 'Advanced',
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenAI API', 'Hugging Face', 'CUDA'],
    certifications: ['DeepLearning.AI Specialization', 'Google ML Engineer', 'AWS AI Practitioner'],
    phases: [
      {
        id: 'foundation',
        title: 'Programming & Math',
        duration: '6-8 weeks',
        description: 'Master Python programming and essential mathematics including linear algebra, calculus, and probability.',
        skills: ['Python Advanced', 'Linear Algebra', 'Calculus', 'Probability & Statistics', 'NumPy'],
        projects: ['Math Library Implementation', 'Data Processing Pipeline']
      },
      {
        id: 'ml-fundamentals',
        title: 'Machine Learning Core',
        duration: '8-10 weeks',
        description: 'Learn core ML algorithms from scratch. Understand the theory behind models.',
        skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Optimization', 'Regularization'],
        projects: ['Build ML Algorithms from Scratch', 'Kaggle Competition']
      },
      {
        id: 'deep-learning',
        title: 'Deep Learning',
        duration: '8-10 weeks',
        description: 'Dive into neural networks, CNNs, RNNs, and transformers.',
        skills: ['Neural Networks', 'CNNs', 'RNNs/LSTMs', 'Transformers', 'Transfer Learning', 'TensorFlow/PyTorch'],
        projects: ['Image Classifier', 'Text Generator']
      },
      {
        id: 'specialization',
        title: 'Specialization',
        duration: '8-12 weeks',
        description: 'Choose NLP, Computer Vision, Reinforcement Learning, or Generative AI.',
        skills: ['NLP/CV/RL', 'Large Language Models', 'GANs', 'Prompt Engineering', 'Fine-tuning'],
        projects: ['Specialized AI Project', 'Research Paper Implementation']
      },
      {
        id: 'deployment',
        title: 'Production & Ethics',
        duration: '4-6 weeks',
        description: 'Learn to deploy AI models and understand AI ethics and responsible AI.',
        skills: ['Model Deployment', 'MLOps', 'AI Ethics', 'Bias Detection', 'API Development'],
        projects: ['Deploy AI API', 'Ethical AI Audit']
      }
    ]
  },
  'machine learning': {
    name: 'Machine Learning',
    tagline: 'Teach computers to learn from data',
    description: 'Machine Learning enables systems to automatically learn and improve from experience without being explicitly programmed. It\'s the foundation of modern AI applications.',
    realWorldContext: 'ML powers spam filters, product recommendations on Amazon, credit scoring at banks, predictive maintenance in manufacturing, and medical diagnosis systems.',
    careerPaths: ['ML Engineer', 'Data Scientist', 'Research Scientist', 'Applied ML Engineer', 'MLOps Engineer'],
    averageSalary: '$110,000 - $180,000',
    jobDemand: 'High',
    prerequisites: ['Python', 'Statistics', 'Linear Algebra'],
    estimatedTime: '8-14 months',
    difficulty: 'Intermediate',
    tools: ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'MLflow', 'Docker'],
    certifications: ['Google ML Engineer', 'AWS ML Specialty', 'Coursera ML Specialization'],
    phases: [
      {
        id: 'foundation',
        title: 'Mathematical Foundations',
        duration: '4-6 weeks',
        description: 'Build strong math foundations: linear algebra, calculus, and statistics.',
        skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability', 'Python for ML'],
        projects: ['Implement Math Operations', 'Statistical Analysis']
      },
      {
        id: 'supervised',
        title: 'Supervised Learning',
        duration: '6-8 weeks',
        description: 'Master regression and classification algorithms with hands-on projects.',
        skills: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'KNN'],
        projects: ['House Price Prediction', 'Customer Churn Prediction']
      },
      {
        id: 'unsupervised',
        title: 'Unsupervised Learning',
        duration: '4-6 weeks',
        description: 'Learn clustering, dimensionality reduction, and anomaly detection.',
        skills: ['K-Means', 'Hierarchical Clustering', 'PCA', 'Anomaly Detection', 'Association Rules'],
        projects: ['Customer Segmentation', 'Fraud Detection']
      },
      {
        id: 'advanced-ml',
        title: 'Advanced Techniques',
        duration: '6-8 weeks',
        description: 'Explore ensemble methods, feature engineering, and model optimization.',
        skills: ['Gradient Boosting', 'XGBoost', 'Feature Engineering', 'Hyperparameter Tuning', 'Cross-Validation'],
        projects: ['Kaggle Competition', 'Feature Store']
      },
      {
        id: 'production',
        title: 'Production ML',
        duration: '4-6 weeks',
        description: 'Learn to deploy and monitor ML models in production environments.',
        skills: ['Model Deployment', 'API Development', 'Model Monitoring', 'MLOps', 'A/B Testing'],
        projects: ['Deploy ML API', 'Monitoring Dashboard']
      }
    ]
  },
  'web development': {
    name: 'Web Development',
    tagline: 'Build the internet, one site at a time',
    description: 'Web Development encompasses creating websites and web applications. From simple landing pages to complex platforms like social networks, web dev skills are in constant demand.',
    realWorldContext: 'Web developers build everything from e-commerce sites like Shopify stores, to social platforms like Twitter, streaming services like Netflix, and productivity tools like Notion.',
    careerPaths: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Web Architect', 'DevOps Engineer'],
    averageSalary: '$70,000 - $140,000',
    jobDemand: 'High',
    prerequisites: ['Basic Computer Skills', 'Problem Solving', 'Creativity'],
    estimatedTime: '6-12 months',
    difficulty: 'Beginner-Friendly',
    tools: ['VS Code', 'Git', 'Chrome DevTools', 'Node.js', 'React', 'PostgreSQL', 'Vercel/Netlify'],
    certifications: ['Meta Frontend Developer', 'AWS Developer Associate', 'Google Web Developer'],
    phases: [
      {
        id: 'html-css',
        title: 'HTML & CSS Basics',
        duration: '3-4 weeks',
        description: 'Learn the building blocks of the web. Structure content with HTML and style with CSS.',
        skills: ['HTML5 Semantics', 'CSS Fundamentals', 'Flexbox', 'CSS Grid', 'Responsive Design'],
        projects: ['Personal Portfolio', 'Responsive Landing Page']
      },
      {
        id: 'javascript',
        title: 'JavaScript Fundamentals',
        duration: '4-6 weeks',
        description: 'Add interactivity to websites. Master JavaScript programming.',
        skills: ['JavaScript ES6+', 'DOM Manipulation', 'Events', 'Async/Await', 'Fetch API'],
        projects: ['Interactive To-Do App', 'Weather App']
      },
      {
        id: 'react',
        title: 'React & Modern Frontend',
        duration: '6-8 weeks',
        description: 'Build dynamic user interfaces with React and modern tooling.',
        skills: ['React Components', 'Hooks', 'State Management', 'React Router', 'TypeScript'],
        projects: ['Full React App', 'E-commerce Frontend']
      },
      {
        id: 'backend',
        title: 'Backend Development',
        duration: '6-8 weeks',
        description: 'Learn server-side development with Node.js and databases.',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'SQL/PostgreSQL', 'Authentication'],
        projects: ['REST API', 'Full Stack App']
      },
      {
        id: 'deployment',
        title: 'Deployment & DevOps',
        duration: '3-4 weeks',
        description: 'Deploy applications and learn essential DevOps practices.',
        skills: ['Git/GitHub', 'CI/CD', 'Docker Basics', 'Cloud Hosting', 'Performance Optimization'],
        projects: ['Deploy Full Stack App', 'CI/CD Pipeline']
      }
    ]
  },
  'cyber security': {
    name: 'Cybersecurity',
    tagline: 'Defend the digital frontier',
    description: 'Cybersecurity protects systems, networks, and data from digital attacks. With increasing cyber threats, security professionals are essential for every organization.',
    realWorldContext: 'Security experts prevent data breaches at banks, protect patient data at hospitals, secure government systems, and help companies like Google protect billions of users.',
    careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'SOC Analyst', 'CISO'],
    averageSalary: '$85,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Networking Basics', 'Linux', 'Problem Solving'],
    estimatedTime: '8-14 months',
    difficulty: 'Intermediate',
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Nmap', 'OWASP ZAP'],
    certifications: ['CompTIA Security+', 'CEH', 'CISSP', 'OSCP'],
    phases: [
      {
        id: 'foundation',
        title: 'IT & Networking Basics',
        duration: '4-6 weeks',
        description: 'Understand computer systems, networking, and operating systems.',
        skills: ['Networking Fundamentals', 'TCP/IP', 'Linux Basics', 'Windows Administration', 'Virtualization'],
        projects: ['Home Lab Setup', 'Network Diagram']
      },
      {
        id: 'security-fundamentals',
        title: 'Security Fundamentals',
        duration: '4-6 weeks',
        description: 'Learn core security concepts, threats, and defense mechanisms.',
        skills: ['CIA Triad', 'Threat Modeling', 'Cryptography Basics', 'Authentication', 'Access Control'],
        projects: ['Security Policy Document', 'Risk Assessment']
      },
      {
        id: 'offensive',
        title: 'Offensive Security',
        duration: '6-8 weeks',
        description: 'Learn ethical hacking and penetration testing techniques.',
        skills: ['Reconnaissance', 'Vulnerability Scanning', 'Exploitation', 'Web App Security', 'Social Engineering'],
        projects: ['CTF Challenges', 'Penetration Test Report']
      },
      {
        id: 'defensive',
        title: 'Defensive Security',
        duration: '6-8 weeks',
        description: 'Master defense techniques, incident response, and monitoring.',
        skills: ['SIEM', 'Incident Response', 'Forensics', 'Malware Analysis', 'Security Monitoring'],
        projects: ['Incident Response Plan', 'Security Monitoring Setup']
      },
      {
        id: 'compliance',
        title: 'Governance & Compliance',
        duration: '3-4 weeks',
        description: 'Understand security frameworks, compliance, and enterprise security.',
        skills: ['NIST Framework', 'ISO 27001', 'GDPR', 'Security Auditing', 'Policy Writing'],
        projects: ['Compliance Audit', 'Security Framework Implementation']
      }
    ]
  },
  'cloud computing': {
    name: 'Cloud Computing',
    tagline: 'Power the world from anywhere',
    description: 'Cloud Computing delivers computing services over the internet. It enables scalable, flexible, and cost-effective IT infrastructure for businesses of all sizes.',
    realWorldContext: 'Cloud engineers power Netflix streaming to 200M+ users, enable Airbnb to scale during peak travel, and help startups launch without buying servers.',
    careerPaths: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer', 'Cloud Consultant', 'SRE'],
    averageSalary: '$100,000 - $170,000',
    jobDemand: 'High',
    prerequisites: ['Linux Basics', 'Networking', 'Programming Basics'],
    estimatedTime: '6-10 months',
    difficulty: 'Intermediate',
    tools: ['AWS/Azure/GCP Console', 'Terraform', 'Docker', 'Kubernetes', 'Ansible', 'CloudFormation'],
    certifications: ['AWS Solutions Architect', 'Azure Administrator', 'GCP Cloud Engineer'],
    phases: [
      {
        id: 'foundation',
        title: 'Cloud Fundamentals',
        duration: '3-4 weeks',
        description: 'Understand cloud concepts, service models, and major providers.',
        skills: ['IaaS/PaaS/SaaS', 'Cloud Economics', 'AWS/Azure/GCP Overview', 'Cloud Console Navigation'],
        projects: ['Cloud Account Setup', 'Cost Calculator Exercise']
      },
      {
        id: 'compute-storage',
        title: 'Compute & Storage',
        duration: '4-6 weeks',
        description: 'Master virtual machines, containers, and storage services.',
        skills: ['EC2/VMs', 'S3/Blob Storage', 'Docker Containers', 'Lambda/Functions', 'Load Balancing'],
        projects: ['Web Server Deployment', 'Static Website Hosting']
      },
      {
        id: 'networking',
        title: 'Cloud Networking',
        duration: '3-4 weeks',
        description: 'Design and secure cloud network architectures.',
        skills: ['VPC/VNet', 'Subnets', 'Security Groups', 'Route Tables', 'CDN', 'DNS'],
        projects: ['Multi-Tier VPC', 'Hybrid Connectivity']
      },
      {
        id: 'iac',
        title: 'Infrastructure as Code',
        duration: '4-6 weeks',
        description: 'Automate infrastructure with code using Terraform and CloudFormation.',
        skills: ['Terraform', 'CloudFormation', 'Ansible', 'CI/CD for Infrastructure', 'GitOps'],
        projects: ['IaC Templates', 'Automated Deployment Pipeline']
      },
      {
        id: 'advanced',
        title: 'Advanced & Specialization',
        duration: '4-6 weeks',
        description: 'Explore Kubernetes, serverless, security, and cost optimization.',
        skills: ['Kubernetes', 'Serverless Architecture', 'Cloud Security', 'Cost Optimization', 'Monitoring'],
        projects: ['Kubernetes Cluster', 'Serverless Application']
      }
    ]
  },
  'devops': {
    name: 'DevOps',
    tagline: 'Bridge development and operations',
    description: 'DevOps combines software development and IT operations to shorten development cycles, increase deployment frequency, and deliver reliable software faster.',
    realWorldContext: 'DevOps engineers at Amazon deploy code thousands of times per day, at Spotify they enable 100+ teams to ship independently, and at banks they ensure zero-downtime releases.',
    careerPaths: ['DevOps Engineer', 'SRE', 'Platform Engineer', 'Release Engineer', 'Infrastructure Engineer'],
    averageSalary: '$95,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Linux', 'Programming', 'Networking Basics'],
    estimatedTime: '6-12 months',
    difficulty: 'Intermediate',
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Prometheus', 'Grafana'],
    certifications: ['CKA', 'AWS DevOps Professional', 'Docker Certified Associate'],
    phases: [
      {
        id: 'foundation',
        title: 'Linux & Scripting',
        duration: '4-6 weeks',
        description: 'Master Linux administration and scripting for automation.',
        skills: ['Linux Commands', 'Bash Scripting', 'Python Automation', 'System Administration', 'Git'],
        projects: ['Automation Scripts', 'Server Setup']
      },
      {
        id: 'containers',
        title: 'Containers & Docker',
        duration: '4-6 weeks',
        description: 'Learn containerization with Docker for consistent deployments.',
        skills: ['Docker Basics', 'Dockerfile', 'Docker Compose', 'Container Networking', 'Image Registries'],
        projects: ['Containerize Application', 'Multi-Container App']
      },
      {
        id: 'cicd',
        title: 'CI/CD Pipelines',
        duration: '4-6 weeks',
        description: 'Build automated pipelines for continuous integration and deployment.',
        skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Pipeline Design', 'Testing Automation'],
        projects: ['CI/CD Pipeline', 'Automated Testing']
      },
      {
        id: 'kubernetes',
        title: 'Kubernetes Orchestration',
        duration: '6-8 weeks',
        description: 'Master Kubernetes for container orchestration at scale.',
        skills: ['K8s Architecture', 'Deployments', 'Services', 'Helm Charts', 'RBAC'],
        projects: ['K8s Cluster Setup', 'Deploy Microservices']
      },
      {
        id: 'observability',
        title: 'Monitoring & Observability',
        duration: '3-4 weeks',
        description: 'Implement monitoring, logging, and alerting systems.',
        skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Alerting', 'SLIs/SLOs'],
        projects: ['Monitoring Stack', 'Dashboard Creation']
      }
    ]
  },
  'blockchain': {
    name: 'Blockchain Development',
    tagline: 'Build the decentralized future',
    description: 'Blockchain is a distributed ledger technology enabling secure, transparent, and decentralized applications from cryptocurrencies to supply chain tracking.',
    realWorldContext: 'Blockchain powers Bitcoin and Ethereum, enables DeFi platforms like Uniswap, supports NFT marketplaces like OpenSea, and tracks supply chains for companies like Walmart.',
    careerPaths: ['Blockchain Developer', 'Smart Contract Developer', 'Web3 Developer', 'DeFi Engineer', 'Blockchain Architect'],
    averageSalary: '$100,000 - $180,000',
    jobDemand: 'Growing',
    prerequisites: ['JavaScript/Programming', 'Web Development Basics', 'Cryptography Basics'],
    estimatedTime: '6-10 months',
    difficulty: 'Advanced',
    tools: ['Solidity', 'Hardhat', 'Web3.js', 'Ethers.js', 'MetaMask', 'IPFS', 'The Graph'],
    certifications: ['Certified Blockchain Developer', 'Ethereum Developer Certification'],
    phases: [
      {
        id: 'foundation',
        title: 'Blockchain Fundamentals',
        duration: '3-4 weeks',
        description: 'Understand blockchain concepts, consensus mechanisms, and cryptography.',
        skills: ['Distributed Systems', 'Cryptography', 'Consensus Mechanisms', 'Bitcoin Basics', 'Ethereum Basics'],
        projects: ['Blockchain Simulation', 'Wallet Setup']
      },
      {
        id: 'solidity',
        title: 'Smart Contract Development',
        duration: '6-8 weeks',
        description: 'Learn Solidity programming for Ethereum smart contracts.',
        skills: ['Solidity Syntax', 'ERC Standards', 'Security Patterns', 'Testing Contracts', 'Gas Optimization'],
        projects: ['Token Contract', 'Simple DApp']
      },
      {
        id: 'web3',
        title: 'Web3 Frontend',
        duration: '4-6 weeks',
        description: 'Connect web applications to blockchain using Web3 libraries.',
        skills: ['Web3.js/Ethers.js', 'Wallet Integration', 'Contract Interaction', 'React + Web3', 'IPFS'],
        projects: ['NFT Marketplace Frontend', 'DeFi Dashboard']
      },
      {
        id: 'defi',
        title: 'DeFi & Advanced',
        duration: '4-6 weeks',
        description: 'Explore DeFi protocols, DAOs, and advanced blockchain concepts.',
        skills: ['DeFi Protocols', 'Liquidity Pools', 'Flash Loans', 'DAO Development', 'Cross-chain'],
        projects: ['DeFi Protocol', 'DAO Implementation']
      },
      {
        id: 'security',
        title: 'Security & Auditing',
        duration: '3-4 weeks',
        description: 'Learn smart contract security and auditing practices.',
        skills: ['Common Vulnerabilities', 'Security Auditing', 'Formal Verification', 'Bug Bounties'],
        projects: ['Security Audit', 'Capture the Flag']
      }
    ]
  },
  'digital marketing': {
    name: 'Digital Marketing',
    tagline: 'Reach audiences in the digital age',
    description: 'Digital Marketing uses online channels to reach and engage customers. It combines creativity with data to drive growth through SEO, social media, ads, and content.',
    realWorldContext: 'Digital marketers help startups acquire customers profitably, run viral campaigns for brands, optimize e-commerce conversions, and build personal brands with millions of followers.',
    careerPaths: ['Digital Marketing Manager', 'SEO Specialist', 'Social Media Manager', 'Content Marketer', 'Growth Hacker'],
    averageSalary: '$50,000 - $120,000',
    jobDemand: 'High',
    prerequisites: ['Communication Skills', 'Creativity', 'Basic Analytics'],
    estimatedTime: '4-8 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Google Analytics', 'Google Ads', 'Meta Ads', 'SEMrush', 'Canva', 'Mailchimp', 'HubSpot'],
    certifications: ['Google Analytics', 'Google Ads', 'Meta Blueprint', 'HubSpot Inbound'],
    phases: [
      {
        id: 'foundation',
        title: 'Marketing Fundamentals',
        duration: '2-3 weeks',
        description: 'Understand digital marketing landscape and core principles.',
        skills: ['Marketing Funnel', 'Customer Journey', 'Brand Positioning', 'Target Audience', 'KPIs'],
        projects: ['Marketing Plan', 'Competitor Analysis']
      },
      {
        id: 'seo',
        title: 'SEO & Content',
        duration: '4-6 weeks',
        description: 'Master search engine optimization and content marketing.',
        skills: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Content Strategy', 'Link Building'],
        projects: ['SEO Audit', 'Content Calendar']
      },
      {
        id: 'paid',
        title: 'Paid Advertising',
        duration: '4-6 weeks',
        description: 'Run effective paid campaigns on Google and social platforms.',
        skills: ['Google Ads', 'Facebook/Meta Ads', 'Campaign Structure', 'A/B Testing', 'Remarketing'],
        projects: ['Ad Campaign', 'Landing Page Optimization']
      },
      {
        id: 'social',
        title: 'Social Media Marketing',
        duration: '3-4 weeks',
        description: 'Build and engage audiences on social platforms.',
        skills: ['Platform Strategies', 'Content Creation', 'Community Management', 'Influencer Marketing', 'Analytics'],
        projects: ['Social Media Strategy', 'Viral Content']
      },
      {
        id: 'analytics',
        title: 'Analytics & Optimization',
        duration: '3-4 weeks',
        description: 'Measure, analyze, and optimize marketing performance.',
        skills: ['Google Analytics 4', 'Conversion Tracking', 'Attribution Models', 'Reporting', 'CRO'],
        projects: ['Analytics Dashboard', 'Optimization Report']
      }
    ]
  },
  'project management': {
    name: 'Project Management',
    tagline: 'Lead projects to successful delivery',
    description: 'Project Management is the practice of initiating, planning, executing, and closing projects to achieve specific goals within constraints of time, budget, and resources.',
    realWorldContext: 'Project managers lead product launches at tech companies, construction projects worth millions, software development sprints, and global marketing campaigns.',
    careerPaths: ['Project Manager', 'Scrum Master', 'Program Manager', 'Agile Coach', 'PMO Director'],
    averageSalary: '$75,000 - $140,000',
    jobDemand: 'High',
    prerequisites: ['Communication Skills', 'Organization', 'Leadership'],
    estimatedTime: '3-6 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Jira', 'Asana', 'Monday.com', 'Microsoft Project', 'Confluence', 'Slack', 'Notion'],
    certifications: ['PMP', 'PRINCE2', 'Scrum Master (CSM)', 'Agile Certified Practitioner'],
    phases: [
      {
        id: 'foundation',
        title: 'PM Fundamentals',
        duration: '3-4 weeks',
        description: 'Understand project management concepts, methodologies, and lifecycle.',
        skills: ['PM Lifecycle', 'Stakeholder Management', 'Scope Definition', 'WBS', 'Project Charter'],
        projects: ['Project Charter', 'Stakeholder Register']
      },
      {
        id: 'agile',
        title: 'Agile & Scrum',
        duration: '3-4 weeks',
        description: 'Master Agile principles and Scrum framework for iterative delivery.',
        skills: ['Agile Manifesto', 'Scrum Framework', 'Sprint Planning', 'Daily Standups', 'Retrospectives'],
        projects: ['Sprint Simulation', 'Agile Transformation Plan']
      },
      {
        id: 'planning',
        title: 'Planning & Scheduling',
        duration: '3-4 weeks',
        description: 'Learn to create project plans, schedules, and resource allocation.',
        skills: ['Gantt Charts', 'Critical Path', 'Resource Planning', 'Budget Management', 'Risk Management'],
        projects: ['Project Schedule', 'Risk Register']
      },
      {
        id: 'execution',
        title: 'Execution & Monitoring',
        duration: '3-4 weeks',
        description: 'Manage project execution, track progress, and handle changes.',
        skills: ['Progress Tracking', 'Change Management', 'Issue Resolution', 'Team Leadership', 'Communication'],
        projects: ['Status Reports', 'Change Request Process']
      },
      {
        id: 'tools',
        title: 'Tools & Certification',
        duration: '2-3 weeks',
        description: 'Master PM tools and prepare for professional certification.',
        skills: ['Jira/Asana', 'Documentation', 'Reporting', 'PMP/CSM Prep', 'Presentation Skills'],
        projects: ['Tool Implementation', 'Certification Study Plan']
      }
    ]
  },
  'full stack development': {
    name: 'Full Stack Development',
    tagline: 'Build complete web applications',
    description: 'Full Stack Development covers both frontend and backend development, enabling you to build complete web applications from user interface to database.',
    realWorldContext: 'Full stack developers build complete products at startups, create MVPs for new ventures, and work as versatile engineers at companies like Airbnb and Stripe.',
    careerPaths: ['Full Stack Developer', 'Software Engineer', 'Tech Lead', 'Startup CTO', 'Freelance Developer'],
    averageSalary: '$85,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Basic Programming', 'Problem Solving', 'Web Basics'],
    estimatedTime: '9-15 months',
    difficulty: 'Intermediate',
    tools: ['VS Code', 'Git', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS/Vercel'],
    certifications: ['Meta Full Stack', 'AWS Developer', 'MongoDB Developer'],
    phases: [
      {
        id: 'frontend-basics',
        title: 'Frontend Foundations',
        duration: '6-8 weeks',
        description: 'Master HTML, CSS, JavaScript, and responsive design.',
        skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git Basics'],
        projects: ['Portfolio Website', 'Interactive Landing Page']
      },
      {
        id: 'react',
        title: 'React Development',
        duration: '6-8 weeks',
        description: 'Build modern UIs with React and TypeScript.',
        skills: ['React', 'TypeScript', 'State Management', 'Hooks', 'React Router'],
        projects: ['React Application', 'Component Library']
      },
      {
        id: 'backend',
        title: 'Backend Development',
        duration: '6-8 weeks',
        description: 'Build APIs and server-side applications with Node.js.',
        skills: ['Node.js', 'Express', 'REST APIs', 'Authentication', 'Middleware'],
        projects: ['REST API', 'Auth System']
      },
      {
        id: 'database',
        title: 'Databases',
        duration: '4-6 weeks',
        description: 'Master SQL and NoSQL databases for data persistence.',
        skills: ['PostgreSQL', 'MongoDB', 'ORM/ODM', 'Database Design', 'Migrations'],
        projects: ['Database Schema', 'Data Layer']
      },
      {
        id: 'deployment',
        title: 'DevOps & Deployment',
        duration: '4-6 weeks',
        description: 'Deploy and maintain applications in production.',
        skills: ['Docker', 'CI/CD', 'Cloud Hosting', 'Monitoring', 'Security'],
        projects: ['Full Stack App Deployment', 'Production Pipeline']
      }
    ]
  }
};

// Function to get roadmap by skill name (case-insensitive fuzzy match)
export function getSkillRoadmap(skillName: string): SkillRoadmap | null {
  const normalizedSkill = skillName.toLowerCase().trim();
  
  // Exact match
  if (SKILL_ROADMAPS[normalizedSkill]) {
    return SKILL_ROADMAPS[normalizedSkill];
  }
  
  // Fuzzy match
  for (const [key, roadmap] of Object.entries(SKILL_ROADMAPS)) {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      return roadmap;
    }
  }
  
  // Check alternate names
  const alternates: Record<string, string> = {
    'ml': 'machine learning',
    'artificial intelligence': 'ai',
    'ds': 'data science',
    'frontend': 'web development',
    'backend': 'web development',
    'fullstack': 'full stack development',
    'security': 'cyber security',
    'infosec': 'cyber security',
    'aws': 'cloud computing',
    'azure': 'cloud computing',
    'gcp': 'cloud computing',
    'marketing': 'digital marketing',
    'pm': 'project management',
    'crypto': 'blockchain',
    'web3': 'blockchain',
    'defi': 'blockchain'
  };
  
  if (alternates[normalizedSkill]) {
    return SKILL_ROADMAPS[alternates[normalizedSkill]];
  }
  
  return null;
}

// Generate a generic roadmap for unknown skills
export function generateGenericRoadmap(skillName: string): SkillRoadmap {
  return {
    name: skillName,
    tagline: `Master ${skillName} step by step`,
    description: `A comprehensive learning path to become proficient in ${skillName}. This roadmap covers fundamentals to advanced topics with hands-on projects.`,
    realWorldContext: `${skillName} skills are used across various industries to solve real problems. From startups to enterprises, these skills help professionals create value and advance their careers.`,
    careerPaths: ['Specialist', 'Consultant', 'Team Lead', 'Manager', 'Expert'],
    jobDemand: 'Growing',
    prerequisites: ['Basic Knowledge', 'Learning Mindset', 'Practice Time'],
    estimatedTime: '4-8 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Online Resources', 'Practice Platforms', 'Community Forums', 'Documentation'],
    phases: [
      {
        id: 'foundation',
        title: 'Foundation',
        duration: '4-6 weeks',
        description: 'Build foundational knowledge and understand core concepts.',
        skills: ['Core Concepts', 'Terminology', 'Basic Principles', 'Tools Setup'],
        projects: ['Beginner Project', 'Concept Documentation']
      },
      {
        id: 'intermediate',
        title: 'Intermediate Skills',
        duration: '6-8 weeks',
        description: 'Deepen your understanding with intermediate topics and real projects.',
        skills: ['Advanced Concepts', 'Best Practices', 'Problem Solving', 'Real-World Applications'],
        projects: ['Intermediate Project', 'Case Study']
      },
      {
        id: 'advanced',
        title: 'Advanced Mastery',
        duration: '6-8 weeks',
        description: 'Master advanced topics and specialize in areas of interest.',
        skills: ['Expert Techniques', 'Optimization', 'Leadership', 'Innovation'],
        projects: ['Advanced Project', 'Portfolio Piece']
      },
      {
        id: 'professional',
        title: 'Professional Development',
        duration: '4-6 weeks',
        description: 'Apply skills professionally and build your reputation.',
        skills: ['Industry Standards', 'Networking', 'Continuous Learning', 'Mentorship'],
        projects: ['Professional Portfolio', 'Community Contribution']
      }
    ]
  };
}
