// Comprehensive skill roadmap data with learning phases and real-world context

export interface LearningPhase {
  id: string;
  title: string;
  duration: string;
  skills: string[];
  description: string;
  projects?: string[];
}

export interface ExamInfo {
  fullName: string;
  conductedBy: string;
  frequency: string;
  eligibility: string[];
  examPattern: string[];
  importantDates?: string;
  officialWebsite?: string;
  registrationFee?: string;
  countries?: string[];
  validityPeriod?: string;
  scoringSystem?: string;
}

export interface NonTechFieldInfo {
  industryOverview: string;
  keySkillAreas: string[];
  portfolioTips?: string[];
  professionalBodies?: string[];
  freelanceOpportunities?: string;
  growthOutlook?: string;
}

export type ContentType = 'tech' | 'exam' | 'non-tech';

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
  contentType?: ContentType;
  examInfo?: ExamInfo;
  nonTechInfo?: NonTechFieldInfo;
}

// ─── EXAM ROADMAPS ───

const EXAM_ROADMAPS: Record<string, SkillRoadmap> = {
  'gate': {
    name: 'GATE',
    tagline: 'Graduate Aptitude Test in Engineering',
    description: 'GATE is a national-level examination that tests comprehensive understanding of undergraduate engineering subjects. It is the gateway to M.Tech/PhD admissions in IITs/NITs and PSU recruitment.',
    realWorldContext: 'A strong GATE score opens doors to M.Tech at IITs, direct PhD admissions, and prestigious PSU jobs at ISRO, BARC, BHEL, NTPC, and ONGC with excellent pay packages.',
    careerPaths: ['M.Tech at IIT/NIT', 'PSU Scientist/Engineer', 'PhD Research', 'ISRO/DRDO Scientist', 'University Professor'],
    averageSalary: '₹8-20 LPA (PSU), ₹6-12 LPA (M.Tech placements)',
    jobDemand: 'High',
    prerequisites: ['B.E./B.Tech Degree', 'Strong Fundamentals in Core Subject', 'Mathematical Aptitude'],
    estimatedTime: '6-12 months preparation',
    difficulty: 'Advanced',
    tools: ['GATE PYQ Papers', 'NPTEL Lectures', 'Made Easy/Ace Academy Notes', 'GATEOverflow', 'TestBook'],
    certifications: ['GATE Qualified Certificate'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Graduate Aptitude Test in Engineering',
      conductedBy: 'IISc Bangalore and 7 IITs (on rotation)',
      frequency: 'Once a year (February)',
      eligibility: [
        'B.E./B.Tech graduates or final year students',
        'B.Arch, B.Sc (Research), M.Sc, MA, MCA holders',
        'No age limit for appearing'
      ],
      examPattern: [
        '3-hour computer-based test (CBT)',
        '65 questions, 100 marks total',
        'General Aptitude (15 marks) + Subject (85 marks)',
        'MCQs and Numerical Answer Type (NAT)',
        'Negative marking: 1/3 for MCQs, no negative for NAT'
      ],
      registrationFee: '₹1,700 (General), ₹850 (SC/ST/PwD/Female)',
      countries: ['India'],
      validityPeriod: '3 years from date of result',
      scoringSystem: 'GATE Score out of 1000 (normalized)',
      officialWebsite: 'https://gate.iitk.ac.in'
    },
    phases: [
      {
        id: 'fundamentals',
        title: 'Core Subject Revision',
        duration: '8-10 weeks',
        description: 'Revise all core subjects from your engineering branch. Build strong conceptual understanding.',
        skills: ['Core Engineering Subjects', 'Engineering Mathematics', 'General Aptitude', 'Verbal & Numerical Ability'],
        projects: ['Complete subject-wise notes', 'Solve NCERT-level problems']
      },
      {
        id: 'deep-study',
        title: 'In-Depth Subject Study',
        duration: '8-10 weeks',
        description: 'Deep dive into each subject with standard textbooks and video lectures.',
        skills: ['Standard Textbook Problems', 'NPTEL Lectures', 'Previous Year Analysis', 'Topic-wise Weightage'],
        projects: ['Subject-wise PYQ analysis', 'Create formula sheets']
      },
      {
        id: 'practice',
        title: 'Problem Practice & Mock Tests',
        duration: '6-8 weeks',
        description: 'Solve previous year questions, take topic tests, and full-length mock tests.',
        skills: ['Previous Year Questions (15+ years)', 'Mock Test Analysis', 'Time Management', 'Error Analysis'],
        projects: ['Daily PYQ practice (50+ questions)', 'Weekly mock tests']
      },
      {
        id: 'revision',
        title: 'Revision & Test Strategy',
        duration: '4-6 weeks',
        description: 'Final revision, identify weak areas, and develop exam-day strategy.',
        skills: ['Quick Revision Techniques', 'Weak Area Focus', 'Speed & Accuracy', 'Exam Day Strategy'],
        projects: ['Full syllabus revision in 2 weeks', 'Take 10+ full mocks']
      }
    ]
  },
  'cat': {
    name: 'CAT',
    tagline: 'Common Admission Test for IIMs',
    description: 'CAT is India\'s most prestigious MBA entrance exam, conducted by IIMs. It tests verbal ability, data interpretation, logical reasoning, and quantitative aptitude.',
    realWorldContext: 'CAT scores are accepted by all 20 IIMs and 1,000+ B-schools. Top percentile scorers get into IIM-A, B, C with average placements of ₹25-35 LPA.',
    careerPaths: ['MBA at IIM', 'Management Consultant', 'Investment Banker', 'Product Manager', 'Business Leader'],
    averageSalary: '₹20-40 LPA (IIM placements)',
    jobDemand: 'High',
    prerequisites: ['Bachelor\'s Degree (any discipline)', 'Minimum 50% marks (45% for SC/ST)', 'Strong analytical skills'],
    estimatedTime: '6-10 months preparation',
    difficulty: 'Advanced',
    tools: ['IMS/TIME Study Material', 'Arun Sharma Books', 'Handa Ka Funda', 'PaGaLGuY Forum', 'CATKing'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Common Admission Test',
      conductedBy: 'Indian Institutes of Management (IIMs) on rotation',
      frequency: 'Once a year (November/December)',
      eligibility: [
        'Bachelor\'s degree with minimum 50% marks (45% for SC/ST/PwD)',
        'Final year graduation students can apply',
        'No age limit',
        'No limit on number of attempts'
      ],
      examPattern: [
        '2-hour computer-based test (CBT)',
        '3 sections: VARC, DILR, QA',
        '66 questions total (22 per section)',
        'MCQs and Non-MCQs (TITA - Type In The Answer)',
        'Negative marking: -1 for wrong MCQ, no negative for TITA',
        'Sectional time limit: 40 minutes per section'
      ],
      registrationFee: '₹2,400 (General), ₹1,200 (SC/ST/PwD)',
      countries: ['India'],
      validityPeriod: '1 year',
      scoringSystem: 'Percentile-based (0-100)',
      officialWebsite: 'https://iimcat.ac.in'
    },
    phases: [
      {
        id: 'basics',
        title: 'Build Fundamentals',
        duration: '6-8 weeks',
        description: 'Strengthen basics of Quant, Verbal, and Logical Reasoning. Focus on speed math and reading habits.',
        skills: ['Arithmetic & Number Systems', 'Reading Comprehension', 'Basic Logical Reasoning', 'Speed Calculation'],
        projects: ['Read 1 newspaper daily', 'Practice 50 quant problems/day']
      },
      {
        id: 'advanced-concepts',
        title: 'Advanced Concepts & Techniques',
        duration: '8-10 weeks',
        description: 'Master advanced quant topics, para jumbles, critical reasoning, and data interpretation sets.',
        skills: ['Algebra & Geometry', 'Para Jumbles & Summary', 'Data Interpretation Sets', 'Logical Puzzles & Arrangements'],
        projects: ['Topic-wise test series', 'Solve 100+ DI/LR sets']
      },
      {
        id: 'mocks',
        title: 'Mock Tests & Analysis',
        duration: '6-8 weeks',
        description: 'Take full-length mocks, analyze mistakes, and develop test-taking strategy.',
        skills: ['Full Mock Test Practice', 'Detailed Error Analysis', 'Time Allocation Strategy', 'Question Selection Strategy'],
        projects: ['Take 30+ full mocks', 'Maintain error log']
      },
      {
        id: 'final-push',
        title: 'Final Revision & Strategy',
        duration: '3-4 weeks',
        description: 'Quick revision, focus on strengths, and fine-tune exam strategy.',
        skills: ['Selective Revision', 'Speed Enhancement', 'Stress Management', 'Day-Before Strategy'],
        projects: ['Revise all formulas', 'Simulate exam conditions daily']
      }
    ]
  },
  'jee': {
    name: 'JEE',
    tagline: 'Joint Entrance Examination for IITs/NITs',
    description: 'JEE (Main + Advanced) is India\'s toughest engineering entrance exam. JEE Main gives admission to NITs/IIITs and JEE Advanced to IITs.',
    realWorldContext: 'JEE Advanced top rankers get into IIT Bombay, Delhi, Madras CS branches with placements exceeding ₹1 Cr. JEE Main qualifiers enter top NITs with ₹15-25 LPA packages.',
    careerPaths: ['B.Tech at IIT/NIT', 'Software Engineer', 'Research Scientist', 'Startup Founder', 'UPSC/Civil Services'],
    averageSalary: '₹15-50 LPA (IIT placements)',
    jobDemand: 'High',
    prerequisites: ['Class 12 PCM (Physics, Chemistry, Math)', 'Age: Born on/after Oct 1, 2000 (for 2025)', 'Max 2 consecutive attempts'],
    estimatedTime: '1-2 years preparation',
    difficulty: 'Advanced',
    tools: ['HC Verma', 'Irodov', 'RD Sharma', 'NCERT', 'Unacademy/PW', 'Allen/FIITJEE Material'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Joint Entrance Examination (Main + Advanced)',
      conductedBy: 'NTA (Main) and IITs (Advanced, on rotation)',
      frequency: 'JEE Main: Twice/year (Jan & Apr), JEE Advanced: Once/year (May/June)',
      eligibility: [
        'Class 12 passed/appearing with PCM',
        'Minimum 75% in Class 12 (65% for SC/ST)',
        'Born on or after Oct 1 of qualifying year',
        'Maximum 3 attempts for JEE Main, 2 for Advanced'
      ],
      examPattern: [
        'JEE Main: 3-hour CBT, 90 questions (Physics 30, Chemistry 30, Math 30)',
        'JEE Main: 300 marks total, +4 for correct, -1 for wrong',
        'JEE Advanced: Two 3-hour papers on same day',
        'JEE Advanced: MCQ, Numerical, Matching type questions',
        'Top 2.5 lakh JEE Main qualifiers eligible for Advanced'
      ],
      registrationFee: '₹1,000 (General), ₹500 (SC/ST/PwD) for Main',
      countries: ['India'],
      validityPeriod: '1 year',
      scoringSystem: 'NTA Score (percentile) for Main, Aggregate marks for Advanced',
      officialWebsite: 'https://jeemain.nta.ac.in'
    },
    phases: [
      {
        id: 'class11',
        title: 'Class 11 Foundation',
        duration: '10-12 months',
        description: 'Build strong foundation in Physics, Chemistry, and Mathematics from Class 11 syllabus.',
        skills: ['Mechanics & Thermodynamics', 'Atomic Structure & Chemical Bonding', 'Trigonometry & Coordinate Geometry', 'NCERT Mastery'],
        projects: ['Complete NCERT thoroughly', 'Solve HC Verma Vol 1']
      },
      {
        id: 'class12',
        title: 'Class 12 + Advanced Topics',
        duration: '10-12 months',
        description: 'Cover Class 12 syllabus alongside JEE Advanced level problems.',
        skills: ['Electrodynamics & Optics', 'Organic Chemistry', 'Calculus & Algebra', 'Problem-Solving Techniques'],
        projects: ['Complete standard reference books', 'Solve previous 20 years papers']
      },
      {
        id: 'revision-mocks',
        title: 'Revision & Mock Tests',
        duration: '3-4 months',
        description: 'Intensive revision, mock tests, and previous year paper practice.',
        skills: ['Full Syllabus Revision', 'Mock Test Analysis', 'Time Management', 'Weak Area Focus'],
        projects: ['Take 50+ full mocks', 'Complete PYQ of last 15 years']
      }
    ]
  },
  'upsc': {
    name: 'UPSC',
    tagline: 'Civil Services Examination',
    description: 'UPSC CSE is India\'s most prestigious exam for recruitment to IAS, IPS, IFS and other All India Services. It tests knowledge, aptitude, and personality.',
    realWorldContext: 'UPSC toppers become District Magistrates, Police Commissioners, Ambassadors, and policy makers who directly impact governance of 1.4 billion people.',
    careerPaths: ['IAS Officer', 'IPS Officer', 'IFS (Foreign Service)', 'IRS Officer', 'IRTS/IDAS/Other Services'],
    averageSalary: '₹10-25 LPA + Government Benefits',
    jobDemand: 'High',
    prerequisites: ['Bachelor\'s Degree (any discipline)', 'Age: 21-32 years (relaxation for OBC/SC/ST)', 'Max 6 attempts (General)'],
    estimatedTime: '12-24 months preparation',
    difficulty: 'Advanced',
    tools: ['NCERT (Class 6-12)', 'Laxmikanth', 'The Hindu/Indian Express', 'Insights IAS', 'Vision IAS', 'Drishti IAS'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Union Public Service Commission - Civil Services Examination',
      conductedBy: 'Union Public Service Commission (UPSC)',
      frequency: 'Once a year (Prelims in June, Mains in Sept-Oct)',
      eligibility: [
        'Indian Citizen (IAS/IPS), relaxed for other services',
        'Bachelor\'s degree from recognized university',
        'Age: 21-32 years for General (relaxation for reserved categories)',
        'Max 6 attempts (General), 9 (OBC), Unlimited (SC/ST till age limit)'
      ],
      examPattern: [
        'Stage 1 - Prelims: 2 papers (GS + CSAT), 400 marks, qualifying',
        'Stage 2 - Mains: 9 papers (7 merit + 2 qualifying), 1750 marks',
        'Stage 3 - Interview/Personality Test: 275 marks',
        'Total merit: Mains (1750) + Interview (275) = 2025 marks'
      ],
      registrationFee: '₹100 (General/OBC), Free (SC/ST/PwD/Female)',
      countries: ['India'],
      validityPeriod: 'Lifetime appointment',
      scoringSystem: 'Merit-based ranking',
      officialWebsite: 'https://upsc.gov.in'
    },
    phases: [
      {
        id: 'ncert',
        title: 'NCERT Foundation',
        duration: '3-4 months',
        description: 'Read all NCERT books (Class 6-12) for History, Geography, Polity, Economy, Science.',
        skills: ['Indian History', 'Geography', 'Indian Polity', 'Economy Basics', 'General Science'],
        projects: ['Complete all NCERTs with notes', 'Build current affairs habit']
      },
      {
        id: 'standard-books',
        title: 'Standard Reference Books',
        duration: '4-6 months',
        description: 'Study Laxmikanth (Polity), Ramesh Singh (Economy), Spectrum (Modern History) and other standard references.',
        skills: ['Advanced Polity & Governance', 'Indian Economy', 'Modern History', 'Art & Culture', 'Environment'],
        projects: ['Complete standard books', 'Make short notes for revision']
      },
      {
        id: 'prelims-prep',
        title: 'Prelims Preparation',
        duration: '3-4 months',
        description: 'Focus on MCQ practice, current affairs compilation, and CSAT preparation.',
        skills: ['MCQ Problem Solving', 'Current Affairs (1 year)', 'CSAT Aptitude', 'Elimination Techniques'],
        projects: ['Take 50+ prelims mocks', 'Daily current affairs compilation']
      },
      {
        id: 'mains-prep',
        title: 'Mains Answer Writing',
        duration: '4-6 months',
        description: 'Master answer writing, essay practice, optional subject preparation, and ethics case studies.',
        skills: ['Answer Writing Practice', 'Essay Writing', 'Optional Subject Mastery', 'Ethics Case Studies', 'GS Paper Analysis'],
        projects: ['Write 100+ practice answers', 'Solve 10+ ethics case studies']
      },
      {
        id: 'interview',
        title: 'Interview Preparation',
        duration: '2-3 months',
        description: 'Prepare for personality test including DAF-based questions, current affairs, and mock interviews.',
        skills: ['DAF Analysis', 'Current Affairs Discussion', 'State/Hobby Knowledge', 'Communication & Body Language'],
        projects: ['Take 10+ mock interviews', 'Research your DAF thoroughly']
      }
    ]
  },
  'neet': {
    name: 'NEET',
    tagline: 'National Eligibility cum Entrance Test',
    description: 'NEET-UG is India\'s single entrance exam for admission to MBBS, BDS, AYUSH, and nursing courses in government and private medical colleges.',
    realWorldContext: 'NEET is the only gateway to become a doctor in India. Top rankers get AIIMS, JIPMER, and government medical college seats with nominal fees.',
    careerPaths: ['MBBS Doctor', 'Surgeon', 'Medical Specialist', 'Medical Researcher', 'Public Health Expert'],
    averageSalary: '₹8-30 LPA (varies by specialization)',
    jobDemand: 'High',
    prerequisites: ['Class 12 with PCB (Physics, Chemistry, Biology)', 'Minimum 50% in PCB (40% for SC/ST/OBC)', 'Age: 17-25 years'],
    estimatedTime: '1-2 years preparation',
    difficulty: 'Advanced',
    tools: ['NCERT Biology', 'DC Pandey Physics', 'VK Jaiswal Chemistry', 'MTG/Allen Material', 'Aakash/PW'],
    contentType: 'exam',
    examInfo: {
      fullName: 'National Eligibility cum Entrance Test - Undergraduate',
      conductedBy: 'National Testing Agency (NTA)',
      frequency: 'Once a year (May)',
      eligibility: [
        'Class 12 passed/appearing with PCB and English',
        'Minimum 50% in PCB (40% for SC/ST/OBC)',
        'Age: 17 years at admission, upper limit varies',
        'No limit on attempts (as per Supreme Court ruling)'
      ],
      examPattern: [
        '3-hour 20-minute pen-and-paper (OMR) exam',
        '200 questions: Physics (50), Chemistry (50), Biology (100)',
        'Each subject: 35 mandatory + 15 optional (attempt any 10)',
        '720 marks total, +4 correct, -1 wrong',
        'Available in 13 languages'
      ],
      registrationFee: '₹1,700 (General), ₹1,000 (OBC), ₹1,000 (SC/ST/PwD)',
      countries: ['India'],
      validityPeriod: '1 year',
      scoringSystem: 'Raw marks out of 720 + All India Rank',
      officialWebsite: 'https://neet.nta.nic.in'
    },
    phases: [
      {
        id: 'ncert-mastery',
        title: 'NCERT Mastery',
        duration: '4-6 months',
        description: 'Master NCERT Biology, Physics, and Chemistry textbooks line by line. NEET is 95% NCERT-based.',
        skills: ['NCERT Biology (Class 11 & 12)', 'NCERT Physics', 'NCERT Chemistry', 'Diagram & Graph Practice'],
        projects: ['Read NCERTs 3 times', 'Highlight and note every line']
      },
      {
        id: 'reference-practice',
        title: 'Reference Books & Practice',
        duration: '4-6 months',
        description: 'Solve standard reference books and practice MCQs topic-wise.',
        skills: ['Biology MCQs (MTG/Trueman)', 'Physics Numericals', 'Organic & Inorganic Chemistry', 'Previous Year Questions'],
        projects: ['Solve 10,000+ MCQs', 'Complete PYQ of last 10 years']
      },
      {
        id: 'mock-revision',
        title: 'Mock Tests & Revision',
        duration: '3-4 months',
        description: 'Take full-length mocks, revise weak areas, and build exam stamina.',
        skills: ['Full Mock Tests', 'OMR Filling Practice', 'Time Management', 'Weak Topic Revision'],
        projects: ['Take 40+ full mocks', 'Achieve consistent 600+ score']
      }
    ]
  },
  'gre': {
    name: 'GRE',
    tagline: 'Graduate Record Examination',
    description: 'GRE is a standardized test for graduate school admissions worldwide. It measures verbal reasoning, quantitative reasoning, and analytical writing.',
    realWorldContext: 'GRE scores are accepted by thousands of graduate programs and business schools worldwide including MIT, Stanford, Harvard, and Oxford.',
    careerPaths: ['MS/PhD Abroad', 'MBA (select schools)', 'Research Programs', 'Academic Career'],
    averageSalary: '$70,000-$120,000 (post-MS in US)',
    jobDemand: 'High',
    prerequisites: ['Bachelor\'s Degree or equivalent', 'English Proficiency', 'Basic Math (up to high school level)'],
    estimatedTime: '2-4 months preparation',
    difficulty: 'Intermediate',
    tools: ['ETS Official Guide', 'Manhattan Prep', 'Magoosh', 'GregMat+', 'Kaplan GRE'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Graduate Record Examination General Test',
      conductedBy: 'Educational Testing Service (ETS)',
      frequency: 'Available year-round at test centers and at-home',
      eligibility: [
        'No specific eligibility criteria',
        'Anyone can take the GRE regardless of age or qualifications',
        'Valid photo ID required',
        'Can retake after 21 days, up to 5 times in 12 months'
      ],
      examPattern: [
        'Approximately 1 hour 58 minutes (shorter format since Sept 2023)',
        'Verbal Reasoning: 2 sections, 27 questions, 41 minutes',
        'Quantitative Reasoning: 2 sections, 27 questions, 47 minutes',
        'Analytical Writing: 1 essay, 30 minutes',
        'No experimental/research section in new format'
      ],
      registrationFee: '$220 worldwide ($228 in India)',
      countries: ['Worldwide (200+ countries)'],
      validityPeriod: '5 years',
      scoringSystem: 'Verbal: 130-170, Quant: 130-170, AWA: 0-6. Total: 260-340',
      officialWebsite: 'https://www.ets.org/gre'
    },
    phases: [
      {
        id: 'diagnostic',
        title: 'Diagnostic & Foundation',
        duration: '2-3 weeks',
        description: 'Take a diagnostic test, assess strengths/weaknesses, and build vocabulary foundation.',
        skills: ['GRE Vocabulary (1000+ words)', 'Basic Quant Review', 'Reading Comprehension Strategy', 'Test Format Familiarity'],
        projects: ['Take ETS free practice test', 'Learn 30 words/day']
      },
      {
        id: 'concept-building',
        title: 'Concept Building',
        duration: '4-6 weeks',
        description: 'Master all quant topics, verbal question types, and AWA templates.',
        skills: ['Algebra & Arithmetic', 'Geometry & Data Analysis', 'Text Completion & Sentence Equivalence', 'AWA Essay Templates'],
        projects: ['Complete Manhattan 5lb book', 'Write 10 practice essays']
      },
      {
        id: 'practice-tests',
        title: 'Practice & Mock Tests',
        duration: '3-4 weeks',
        description: 'Take timed practice sets and full-length mock tests with detailed analysis.',
        skills: ['Timed Practice Sets', 'Full-Length Mock Tests', 'Error Analysis & Improvement', 'Score Prediction'],
        projects: ['Take 8+ full mocks', 'Achieve target score consistently']
      }
    ]
  },
  'gmat': {
    name: 'GMAT',
    tagline: 'Graduate Management Admission Test',
    description: 'GMAT Focus Edition is the premier exam for MBA admissions worldwide, testing data insights, verbal reasoning, and quantitative reasoning.',
    realWorldContext: 'GMAT scores are used by top business schools like Harvard, Wharton, INSEAD, and ISB for MBA admissions with scholarships worth $50K-$100K+.',
    careerPaths: ['MBA Graduate', 'Management Consultant', 'Investment Banker', 'Strategy Lead', 'CEO/Founder'],
    averageSalary: '$120,000-$200,000 (post-MBA in US)',
    jobDemand: 'High',
    prerequisites: ['Bachelor\'s Degree (for MBA admission)', 'English Proficiency', 'Quantitative Aptitude'],
    estimatedTime: '3-6 months preparation',
    difficulty: 'Advanced',
    tools: ['GMAT Official Guide', 'TTP (Target Test Prep)', 'Manhattan Prep', 'e-GMAT', 'GMATClub'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Graduate Management Admission Test - Focus Edition',
      conductedBy: 'Graduate Management Admission Council (GMAC)',
      frequency: 'Available year-round at test centers and online',
      eligibility: [
        'No specific eligibility (age/degree) for the test itself',
        'Must be 18+ years old',
        'Valid passport/government ID required',
        'Can take up to 5 times in 12 months'
      ],
      examPattern: [
        '2 hours 15 minutes total',
        'Quantitative Reasoning: 21 questions, 45 minutes',
        'Verbal Reasoning: 23 questions, 45 minutes',
        'Data Insights: 20 questions, 45 minutes',
        'No AWA essay in Focus Edition',
        'Computer Adaptive by section'
      ],
      registrationFee: '$275 (test center), $300 (online)',
      countries: ['Worldwide (100+ countries)'],
      validityPeriod: '5 years',
      scoringSystem: '205-805 (total), each section 60-90',
      officialWebsite: 'https://www.mba.com/gmat'
    },
    phases: [
      {
        id: 'foundation',
        title: 'Foundation & Diagnostic',
        duration: '3-4 weeks',
        description: 'Take diagnostic test, understand GMAT Focus format, and build quant fundamentals.',
        skills: ['GMAT Format Understanding', 'Quant Fundamentals', 'Verbal Basics', 'Data Insights Introduction'],
        projects: ['Take official practice exam', 'Create study plan based on diagnostic']
      },
      {
        id: 'content-mastery',
        title: 'Content Mastery',
        duration: '6-8 weeks',
        description: 'Master all question types across Quant, Verbal, and Data Insights.',
        skills: ['Advanced Quant (Algebra, Number Properties)', 'Critical Reasoning', 'Reading Comprehension', 'Data Sufficiency & Graphics Interpretation'],
        projects: ['Complete TTP/Manhattan curriculum', 'Solve 1000+ practice questions']
      },
      {
        id: 'mocks-strategy',
        title: 'Mock Tests & Strategy',
        duration: '4-6 weeks',
        description: 'Full-length practice tests, identify weak areas, and optimize timing strategy.',
        skills: ['Full-Length Mock Tests', 'Time Management', 'Question Triage Strategy', 'Score Analysis'],
        projects: ['Take 8+ official mocks', 'Achieve target score range']
      }
    ]
  },
  'sat': {
    name: 'SAT',
    tagline: 'Scholastic Assessment Test',
    description: 'The Digital SAT is a standardized test for US college admissions, testing reading/writing and math skills. It\'s now fully digital and adaptive.',
    realWorldContext: 'SAT scores are used by 4,000+ US colleges and universities. A high SAT score with strong extracurriculars can open doors to Ivy League schools.',
    careerPaths: ['Undergraduate Degree (US/International)', 'Scholarship Opportunities', 'Competitive College Admissions'],
    jobDemand: 'High',
    prerequisites: ['High School Student (Grade 11-12)', 'English Reading Proficiency', 'Algebra & Advanced Math Knowledge'],
    estimatedTime: '2-4 months preparation',
    difficulty: 'Intermediate',
    tools: ['College Board Official Practice', 'Khan Academy SAT Prep', 'Kaplan SAT', 'Princeton Review', 'Bluebook App'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Scholastic Assessment Test (Digital SAT)',
      conductedBy: 'College Board',
      frequency: '7 times per year in US (March-December)',
      eligibility: [
        'No specific eligibility requirements',
        'Typically taken by high school juniors and seniors',
        'No age limit',
        'Can take multiple times (superscoring available)'
      ],
      examPattern: [
        '2 hours 14 minutes total (digital, adaptive)',
        'Reading and Writing: 2 modules, 54 questions, 64 minutes',
        'Math: 2 modules, 44 questions, 70 minutes',
        'Section-adaptive: Module 2 difficulty based on Module 1 performance',
        'Calculator allowed for all math questions'
      ],
      registrationFee: '$60 (US), $60 + international fee',
      countries: ['Worldwide'],
      validityPeriod: '5 years',
      scoringSystem: '400-1600 total (Reading/Writing: 200-800, Math: 200-800)',
      officialWebsite: 'https://satsuite.collegeboard.org'
    },
    phases: [
      {
        id: 'diagnostic',
        title: 'Diagnostic & Basics',
        duration: '2-3 weeks',
        description: 'Take a practice test on Bluebook, understand the digital format, and identify strengths/weaknesses.',
        skills: ['Digital SAT Format', 'Basic Grammar Rules', 'Algebra Review', 'Reading Strategy'],
        projects: ['Take full practice test on Bluebook', 'Create targeted study plan']
      },
      {
        id: 'content-review',
        title: 'Content Review & Practice',
        duration: '4-6 weeks',
        description: 'Master reading strategies, grammar rules, and all math topics with daily practice.',
        skills: ['Evidence-Based Reading', 'Standard English Conventions', 'Problem Solving & Data Analysis', 'Advanced Math'],
        projects: ['Complete Khan Academy SAT course', 'Solve 500+ practice questions']
      },
      {
        id: 'mocks',
        title: 'Practice Tests & Refinement',
        duration: '3-4 weeks',
        description: 'Take weekly full-length tests, refine timing, and focus on weak areas.',
        skills: ['Full Practice Tests', 'Time Management', 'Error Pattern Analysis', 'Score Improvement Strategy'],
        projects: ['Take 6+ full practice tests', 'Achieve target score']
      }
    ]
  },
  'ielts': {
    name: 'IELTS',
    tagline: 'International English Language Testing System',
    description: 'IELTS is the world\'s most popular English language proficiency test for study, work, and migration to English-speaking countries.',
    realWorldContext: 'IELTS is accepted by 11,000+ organizations in 140+ countries. Band 7+ is required for most UK/Australian university admissions and immigration programs.',
    careerPaths: ['Study Abroad', 'Work Visa (UK/Australia/Canada)', 'Permanent Residency', 'Professional Registration'],
    jobDemand: 'High',
    prerequisites: ['Basic English Knowledge', 'Reading Habit', 'Listening Practice'],
    estimatedTime: '1-3 months preparation',
    difficulty: 'Intermediate',
    tools: ['Cambridge IELTS Books', 'British Council Resources', 'IDP Practice Tests', 'IELTS Liz', 'Magoosh IELTS'],
    contentType: 'exam',
    examInfo: {
      fullName: 'International English Language Testing System',
      conductedBy: 'British Council, IDP, and Cambridge Assessment English',
      frequency: 'Available 4 times/month at test centers, on-demand for computer-delivered',
      eligibility: [
        'No specific eligibility criteria',
        'Anyone aged 16+ can take IELTS',
        'Valid passport required',
        'Two types: Academic and General Training'
      ],
      examPattern: [
        'Listening: 30 minutes, 40 questions',
        'Reading: 60 minutes, 40 questions',
        'Writing: 60 minutes, 2 tasks (150 + 250 words)',
        'Speaking: 11-14 minutes, face-to-face interview',
        'Total test time: ~2 hours 45 minutes'
      ],
      registrationFee: '₹16,250 (India), varies by country (~$240-260)',
      countries: ['Worldwide (140+ countries)'],
      validityPeriod: '2 years',
      scoringSystem: 'Band score 0-9 (overall & per section, in 0.5 increments)',
      officialWebsite: 'https://www.ielts.org'
    },
    phases: [
      {
        id: 'assessment',
        title: 'Initial Assessment',
        duration: '1-2 weeks',
        description: 'Take a diagnostic test, understand your current band level, and learn the test format.',
        skills: ['Test Format Understanding', 'Current Level Assessment', 'Goal Setting', 'Study Plan Creation'],
        projects: ['Take Cambridge IELTS practice test', 'Identify target band per section']
      },
      {
        id: 'skill-building',
        title: 'Skill Building',
        duration: '4-6 weeks',
        description: 'Improve reading speed, listening comprehension, writing structures, and speaking fluency.',
        skills: ['Skimming & Scanning', 'Note-taking While Listening', 'Essay Structure (Task 2)', 'Speaking Part 2 Cue Cards'],
        projects: ['Read English newspaper daily', 'Write 20+ essays', 'Record speaking practice']
      },
      {
        id: 'mock-practice',
        title: 'Mock Tests & Refinement',
        duration: '2-3 weeks',
        description: 'Take full mock tests under exam conditions, get writing evaluated, and refine strategies.',
        skills: ['Full Mock Tests', 'Time Management', 'Writing Task 1 Mastery', 'Pronunciation & Fluency'],
        projects: ['Take 6+ full mocks', 'Get writing evaluated by expert']
      }
    ]
  },
  'toefl': {
    name: 'TOEFL',
    tagline: 'Test of English as a Foreign Language',
    description: 'TOEFL iBT is a widely accepted English proficiency test for academic admissions, especially in the US. It tests reading, listening, speaking, and writing.',
    realWorldContext: 'TOEFL is accepted by 12,000+ universities in 160+ countries. A score of 100+ is competitive for top US universities like MIT, Stanford, and Harvard.',
    careerPaths: ['Study in US/Canada', 'Graduate School Admission', 'Professional Licensing', 'Scholarship Applications'],
    jobDemand: 'High',
    prerequisites: ['Basic English Proficiency', 'Academic Reading Exposure', 'Computer Familiarity'],
    estimatedTime: '1-3 months preparation',
    difficulty: 'Intermediate',
    tools: ['ETS Official TOEFL Guide', 'TOEFL Practice Online', 'Magoosh TOEFL', 'Notefull', 'TST Prep'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Test of English as a Foreign Language - Internet-Based Test',
      conductedBy: 'Educational Testing Service (ETS)',
      frequency: 'Available 60+ times per year worldwide',
      eligibility: [
        'No specific eligibility requirements',
        'Anyone can take TOEFL regardless of age',
        'Valid ID required',
        'Can retake after 3 days'
      ],
      examPattern: [
        'Under 2 hours total (since July 2023)',
        'Reading: 35 minutes, 20 questions, 2 passages',
        'Listening: 36 minutes, 28 questions',
        'Speaking: 16 minutes, 4 tasks',
        'Writing: 29 minutes, 2 tasks (including new Writing for an Academic Discussion)'
      ],
      registrationFee: '$185-$245 depending on location',
      countries: ['Worldwide (160+ countries)'],
      validityPeriod: '2 years',
      scoringSystem: '0-120 total (30 per section)',
      officialWebsite: 'https://www.ets.org/toefl'
    },
    phases: [
      {
        id: 'familiarize',
        title: 'Test Familiarization',
        duration: '1-2 weeks',
        description: 'Understand TOEFL format, take a diagnostic test, and build study plan.',
        skills: ['TOEFL Format & Scoring', 'Diagnostic Assessment', 'Note-taking Skills', 'Academic English Basics'],
        projects: ['Take ETS free practice test', 'Set target score per section']
      },
      {
        id: 'section-prep',
        title: 'Section-wise Preparation',
        duration: '4-6 weeks',
        description: 'Focus on each section: improve reading speed, listening note-taking, speaking templates, and writing skills.',
        skills: ['Academic Reading Strategies', 'Lecture Listening & Note-taking', 'Integrated & Independent Speaking', 'Academic Writing & Discussion Task'],
        projects: ['Complete official practice materials', 'Practice speaking with timer daily']
      },
      {
        id: 'full-practice',
        title: 'Full Tests & Strategy',
        duration: '2-3 weeks',
        description: 'Take full-length practice tests, refine timing, and maximize score.',
        skills: ['Full Practice Tests', 'Time Optimization', 'Score Maximization Strategy', 'Test Day Preparation'],
        projects: ['Take 5+ full practice tests', 'Achieve target score']
      }
    ]
  },
  'lsat': {
    name: 'LSAT',
    tagline: 'Law School Admission Test',
    description: 'LSAT is the standardized test for law school admissions, testing logical reasoning, analytical reasoning, and reading comprehension.',
    realWorldContext: 'LSAT scores are crucial for admission to top law schools like Harvard, Yale, Stanford Law. A 170+ score opens doors to T14 schools with full scholarships.',
    careerPaths: ['Lawyer/Attorney', 'Judge', 'Legal Consultant', 'Corporate Counsel', 'Law Professor'],
    averageSalary: '$70,000-$200,000+ (varies by market)',
    jobDemand: 'High',
    prerequisites: ['Bachelor\'s Degree (for law school)', 'Strong Reading Skills', 'Logical Thinking'],
    estimatedTime: '3-6 months preparation',
    difficulty: 'Advanced',
    tools: ['LSAT Official PrepTests', '7Sage', 'PowerScore Bibles', 'Khan Academy LSAT', 'Blueprint LSAT'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Law School Admission Test',
      conductedBy: 'Law School Admission Council (LSAC)',
      frequency: '9 times per year',
      eligibility: [
        'No specific eligibility for taking the test',
        'Law schools require bachelor\'s degree for admission',
        'Valid government-issued ID required',
        'Can take up to 3 times in a testing year, 5 in 5 years, 7 lifetime'
      ],
      examPattern: [
        'Approximately 3 hours (with breaks)',
        'Logical Reasoning: 1 section, 24-26 questions, 35 minutes',
        'Analytical Reasoning (Logic Games): 1 section, 22-24 questions, 35 minutes',
        'Reading Comprehension: 1 section, 26-28 questions, 35 minutes',
        'LSAT Writing: Separate, 35 minutes (taken remotely)'
      ],
      registrationFee: '$200',
      countries: ['Worldwide'],
      validityPeriod: '5 years',
      scoringSystem: '120-180 scale',
      officialWebsite: 'https://www.lsac.org'
    },
    phases: [
      {
        id: 'diagnostic',
        title: 'Diagnostic & Fundamentals',
        duration: '2-3 weeks',
        description: 'Take a diagnostic PrepTest, learn LSAT question types, and build logical reasoning basics.',
        skills: ['LSAT Question Types', 'Argument Structure', 'Formal Logic Basics', 'Game Setup Strategies'],
        projects: ['Take official diagnostic PrepTest', 'Learn conditional logic']
      },
      {
        id: 'section-mastery',
        title: 'Section Mastery',
        duration: '6-8 weeks',
        description: 'Deep dive into each section with focused drills and untimed practice.',
        skills: ['Logical Reasoning Patterns', 'Logic Games Strategies', 'RC Active Reading', 'Diagramming Techniques'],
        projects: ['Drill 100+ LR questions', 'Master all game types', 'Complete 50+ RC passages']
      },
      {
        id: 'timed-practice',
        title: 'Timed Practice & Mock Tests',
        duration: '4-6 weeks',
        description: 'Transition to timed practice, take full PrepTests, and build endurance.',
        skills: ['Timed Section Practice', 'Full PrepTests', 'Error Analysis', 'Stamina Building'],
        projects: ['Take 15+ full PrepTests', 'Achieve target score range']
      }
    ]
  },
  'mcat': {
    name: 'MCAT',
    tagline: 'Medical College Admission Test',
    description: 'MCAT is the standardized exam for US/Canadian medical school admissions, testing natural sciences, critical reasoning, and behavioral sciences.',
    realWorldContext: 'MCAT scores are essential for admission to MD and DO programs. A 515+ score is competitive for top medical schools like Johns Hopkins and Mayo Clinic.',
    careerPaths: ['Physician (MD/DO)', 'Surgeon', 'Medical Researcher', 'Psychiatrist', 'Medical Specialist'],
    averageSalary: '$200,000-$400,000+ (varies by specialty)',
    jobDemand: 'High',
    prerequisites: ['Biology, Chemistry, Physics, Biochemistry courses', 'Psychology/Sociology courses', 'Strong science GPA'],
    estimatedTime: '3-6 months preparation',
    difficulty: 'Advanced',
    tools: ['AAMC Official Materials', 'Kaplan MCAT', 'Princeton Review', 'UWorld', 'Anki Flashcards'],
    contentType: 'exam',
    examInfo: {
      fullName: 'Medical College Admission Test',
      conductedBy: 'Association of American Medical Colleges (AAMC)',
      frequency: 'Available multiple dates from January to September',
      eligibility: [
        'No specific requirements to take the test',
        'Medical schools require bachelor\'s degree + prerequisites',
        'Must have AAMC ID',
        'Can take up to 3 times/year, 4 in 2 years, 7 lifetime'
      ],
      examPattern: [
        '7 hours 30 minutes total (with breaks)',
        'Chemical and Physical Foundations: 59 questions, 95 minutes',
        'Critical Analysis and Reasoning Skills: 53 questions, 90 minutes',
        'Biological and Biochemical Foundations: 59 questions, 95 minutes',
        'Psychological, Social, and Biological Foundations: 59 questions, 95 minutes'
      ],
      registrationFee: '$330',
      countries: ['US, Canada, and select international locations'],
      validityPeriod: '2-3 years (school dependent)',
      scoringSystem: '472-528 total (118-132 per section, 500 median)',
      officialWebsite: 'https://students-residents.aamc.org/mcat'
    },
    phases: [
      {
        id: 'content-review',
        title: 'Content Review',
        duration: '6-8 weeks',
        description: 'Review all science content: biology, chemistry, physics, biochemistry, psychology, and sociology.',
        skills: ['Biology & Biochemistry', 'General & Organic Chemistry', 'Physics', 'Psychology & Sociology'],
        projects: ['Complete content review books', 'Create Anki flashcard deck']
      },
      {
        id: 'passage-practice',
        title: 'Passage-Based Practice',
        duration: '4-6 weeks',
        description: 'Transition from content review to passage-based practice and CARS preparation.',
        skills: ['Passage Analysis', 'CARS Strategy', 'Data Interpretation', 'Experimental Design'],
        projects: ['Practice 500+ passage-based questions', 'Daily CARS practice']
      },
      {
        id: 'full-lengths',
        title: 'Full-Length Tests',
        duration: '4-6 weeks',
        description: 'Take AAMC full-length practice exams and third-party tests for endurance and accuracy.',
        skills: ['Full-Length Exam Stamina', 'Score Analysis', 'Weak Area Review', 'Test Day Strategy'],
        projects: ['Take all 4 AAMC FL exams', 'Take 4+ third-party FLs']
      }
    ]
  },
  'aws': {
    name: 'AWS Certification',
    tagline: 'Amazon Web Services Certifications',
    description: 'AWS certifications validate cloud skills at various levels - from foundational to specialty. They are among the most valued IT certifications globally.',
    realWorldContext: 'AWS certified professionals earn 20-30% more than non-certified peers. Companies like Netflix, Airbnb, and NASA run on AWS infrastructure.',
    careerPaths: ['Cloud Solutions Architect', 'DevOps Engineer', 'Cloud Developer', 'Cloud Security Specialist', 'Data Engineer'],
    averageSalary: '$120,000-$180,000',
    jobDemand: 'High',
    prerequisites: ['Basic IT/Networking Knowledge', 'Linux Familiarity', 'Programming Basics (for Developer track)'],
    estimatedTime: '2-4 months per certification',
    difficulty: 'Intermediate',
    tools: ['AWS Free Tier', 'AWS Skill Builder', 'Stephane Maarek Courses', 'Tutorials Dojo', 'A Cloud Guru'],
    contentType: 'exam',
    examInfo: {
      fullName: 'AWS Certification Exams (Cloud Practitioner → Solutions Architect → Specialty)',
      conductedBy: 'Amazon Web Services (via Pearson VUE/PSI)',
      frequency: 'Available year-round at test centers and online',
      eligibility: [
        'No formal prerequisites for any exam',
        'Recommended experience varies: 6 months (CCP) to 2+ years (Professional)',
        'Valid government-issued ID required',
        'Can retake after 14 days'
      ],
      examPattern: [
        'Cloud Practitioner: 90 minutes, 65 questions, 70% passing',
        'Associate level: 130 minutes, 65 questions, 72% passing',
        'Professional level: 180 minutes, 75 questions, 75% passing',
        'Specialty: 170 minutes, 65 questions, 75% passing',
        'Multiple choice and multiple response questions'
      ],
      registrationFee: '$100 (CCP), $150 (Associate), $300 (Professional/Specialty)',
      countries: ['Worldwide'],
      validityPeriod: '3 years',
      scoringSystem: 'Scaled score 100-1000, passing varies by exam',
      officialWebsite: 'https://aws.amazon.com/certification/'
    },
    phases: [
      {
        id: 'foundations',
        title: 'Cloud Practitioner Foundation',
        duration: '3-4 weeks',
        description: 'Start with AWS Cloud Practitioner to understand AWS services, pricing, and cloud concepts.',
        skills: ['AWS Core Services', 'Cloud Concepts', 'Security & Compliance', 'Billing & Pricing'],
        projects: ['Set up AWS Free Tier', 'Deploy a simple web app']
      },
      {
        id: 'associate',
        title: 'Solutions Architect Associate',
        duration: '6-8 weeks',
        description: 'Deep dive into architecting solutions on AWS with high availability, cost optimization, and security.',
        skills: ['EC2, S3, RDS, VPC', 'High Availability Design', 'Security Best Practices', 'Cost Optimization'],
        projects: ['Design multi-tier architecture', 'Build serverless application']
      },
      {
        id: 'hands-on',
        title: 'Hands-On Labs & Practice',
        duration: '3-4 weeks',
        description: 'Intensive hands-on practice with AWS services and mock exam preparation.',
        skills: ['AWS Console & CLI', 'Infrastructure as Code', 'Mock Exam Practice', 'Exam Strategy'],
        projects: ['Complete 20+ hands-on labs', 'Take 6+ practice exams']
      }
    ]
  },
  'comptia': {
    name: 'CompTIA',
    tagline: 'CompTIA IT Certifications',
    description: 'CompTIA certifications (A+, Network+, Security+) are vendor-neutral IT certifications that validate foundational to advanced IT skills.',
    realWorldContext: 'CompTIA Security+ is DoD-approved and required for many US government IT positions. CompTIA A+ is the industry standard for IT support careers.',
    careerPaths: ['IT Support Specialist', 'Network Administrator', 'Security Analyst', 'Systems Administrator', 'Help Desk Technician'],
    averageSalary: '$55,000-$110,000',
    jobDemand: 'High',
    prerequisites: ['Basic Computer Knowledge', 'Interest in IT', 'Networking Basics (for Network+/Security+)'],
    estimatedTime: '2-3 months per certification',
    difficulty: 'Intermediate',
    tools: ['CompTIA CertMaster', 'Professor Messer', 'Mike Meyers Courses', 'Jason Dion Practice Exams', 'CompTIA Labs'],
    contentType: 'exam',
    examInfo: {
      fullName: 'CompTIA Certifications (A+, Network+, Security+, and more)',
      conductedBy: 'CompTIA (via Pearson VUE)',
      frequency: 'Available year-round at test centers',
      eligibility: [
        'No formal prerequisites required',
        'Recommended experience varies by cert level',
        'Valid government-issued ID required',
        'Can retake after waiting period (varies)'
      ],
      examPattern: [
        'A+: Two exams (Core 1 & 2), 90 questions each, 90 minutes',
        'Network+: 90 questions, 90 minutes, passing 720/900',
        'Security+: 90 questions, 90 minutes, passing 750/900',
        'Mix of multiple choice and performance-based questions (PBQs)'
      ],
      registrationFee: '$358 per exam (US)',
      countries: ['Worldwide'],
      validityPeriod: '3 years (renewable via CE program)',
      scoringSystem: 'Scaled 100-900, passing varies by exam',
      officialWebsite: 'https://www.comptia.org/certifications'
    },
    phases: [
      {
        id: 'fundamentals',
        title: 'IT Fundamentals',
        duration: '3-4 weeks',
        description: 'Build foundational IT knowledge covering hardware, software, networking, and security basics.',
        skills: ['Hardware & Troubleshooting', 'Operating Systems', 'Basic Networking', 'Security Concepts'],
        projects: ['Set up home lab', 'Practice troubleshooting scenarios']
      },
      {
        id: 'deep-dive',
        title: 'Domain Deep Dive',
        duration: '4-6 weeks',
        description: 'Study each exam domain in depth using video courses and study guides.',
        skills: ['All Exam Objectives', 'Hands-on Labs', 'Acronym Mastery', 'Port Numbers & Protocols'],
        projects: ['Complete video course', 'Create domain-wise notes']
      },
      {
        id: 'practice-exams',
        title: 'Practice Exams & PBQs',
        duration: '2-3 weeks',
        description: 'Take practice exams, master PBQs, and review weak areas.',
        skills: ['Practice Exam Mastery', 'PBQ Practice', 'Time Management', 'Exam Strategy'],
        projects: ['Score 85%+ on 5 practice exams', 'Master all PBQ types']
      }
    ]
  }
};

// ─── NON-TECH FIELD ROADMAPS ───

const NON_TECH_ROADMAPS: Record<string, SkillRoadmap> = {
  'fine arts': {
    name: 'Fine Arts',
    tagline: 'Express, create, and inspire through art',
    description: 'Fine Arts encompasses painting, sculpture, drawing, printmaking, and mixed media. It develops creative expression, visual literacy, and critical thinking.',
    realWorldContext: 'Fine artists exhibit in galleries worldwide, create commissioned work for corporations, teach at universities, and influence culture through public art installations.',
    careerPaths: ['Professional Artist', 'Art Director', 'Gallery Curator', 'Art Educator', 'Illustrator', 'Art Therapist'],
    averageSalary: '$35,000-$80,000 (varies widely)',
    jobDemand: 'Growing',
    prerequisites: ['Passion for Visual Expression', 'Basic Drawing Skills', 'Openness to Critique'],
    estimatedTime: '12-24 months self-study',
    difficulty: 'Beginner-Friendly',
    tools: ['Sketchbooks', 'Procreate/Photoshop', 'Oil/Acrylic Paints', 'Clay & Sculpting Tools', 'Portfolio Website'],
    certifications: ['BFA Degree', 'MFA Degree', 'Art Therapy Certification'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'The global art market was valued at $65 billion. Digital art, NFTs, and art therapy are expanding career opportunities beyond traditional gallery models.',
      keySkillAreas: ['Drawing & Sketching', 'Color Theory', 'Composition', 'Art History', 'Digital Art', 'Portfolio Development'],
      portfolioTips: ['Curate 15-20 of your strongest pieces', 'Show range but maintain a cohesive style', 'Include process documentation', 'Get a professional portfolio website'],
      professionalBodies: ['National Art Education Association', 'College Art Association', 'American Art Therapy Association'],
      freelanceOpportunities: 'Commission work, gallery representation, teaching workshops, public art grants, illustration freelancing, art licensing',
      growthOutlook: 'Growing demand for art therapy, digital art, UX design with art background, and public art installations'
    },
    phases: [
      {
        id: 'foundations',
        title: 'Drawing Fundamentals',
        duration: '6-8 weeks',
        description: 'Master the basics of drawing: line, shape, form, value, and perspective.',
        skills: ['Gesture Drawing', 'Perspective Drawing', 'Light & Shadow', 'Proportions', 'Still Life'],
        projects: ['100 gesture drawings', 'Complete still life series']
      },
      {
        id: 'color-medium',
        title: 'Color & Medium Exploration',
        duration: '6-8 weeks',
        description: 'Learn color theory and experiment with different mediums: watercolor, oil, acrylic, charcoal.',
        skills: ['Color Theory', 'Watercolor Techniques', 'Oil Painting Basics', 'Mixed Media', 'Texture Creation'],
        projects: ['Color study series', 'Medium comparison project']
      },
      {
        id: 'style-development',
        title: 'Artistic Style Development',
        duration: '8-12 weeks',
        description: 'Study art history, find your artistic voice, and develop a consistent body of work.',
        skills: ['Art History Study', 'Style Exploration', 'Conceptual Art', 'Series Development', 'Artist Statement Writing'],
        projects: ['Create cohesive series of 10+ works', 'Write artist statement']
      },
      {
        id: 'professional',
        title: 'Professional Art Practice',
        duration: '6-8 weeks',
        description: 'Build your portfolio, learn to price work, apply to galleries, and establish professional presence.',
        skills: ['Portfolio Curation', 'Pricing & Selling Art', 'Gallery Submissions', 'Social Media for Artists', 'Grant Applications'],
        projects: ['Launch portfolio website', 'Submit to 5+ galleries/shows']
      }
    ]
  },
  'music': {
    name: 'Music',
    tagline: 'Create, perform, and produce music',
    description: 'Music encompasses performance, composition, production, and theory. From classical to electronic, music offers diverse career paths in a multi-billion dollar industry.',
    realWorldContext: 'The music industry is worth $26 billion globally. Independent artists on Spotify earn directly, sync licensing places music in films/ads, and live performance is booming post-pandemic.',
    careerPaths: ['Musician/Performer', 'Music Producer', 'Sound Engineer', 'Composer', 'Music Teacher', 'Session Musician'],
    averageSalary: '$35,000-$100,000+',
    jobDemand: 'Growing',
    prerequisites: ['Musical Interest', 'Access to an Instrument', 'Patience & Practice Commitment'],
    estimatedTime: '6-18 months (foundational)',
    difficulty: 'Beginner-Friendly',
    tools: ['DAW (Ableton/Logic/FL Studio)', 'Audio Interface', 'Microphone', 'MIDI Controller', 'Music Theory App'],
    certifications: ['Berklee Online Certificate', 'ABRSM Grades', 'Trinity College Grades'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'Streaming dominates distribution. Independent artists can build careers through social media, sync licensing, live performance, and teaching. Music production skills are in high demand for content creation.',
      keySkillAreas: ['Music Theory', 'Instrument Proficiency', 'Music Production (DAW)', 'Ear Training', 'Performance', 'Songwriting'],
      portfolioTips: ['Record high-quality demos', 'Build presence on SoundCloud/Spotify', 'Create music videos', 'Document your creative process'],
      professionalBodies: ['ASCAP', 'BMI', 'Musicians Union', 'Recording Academy (Grammy)'],
      freelanceOpportunities: 'Session work, composing for media, teaching private lessons, producing for artists, sync licensing, live performance',
      growthOutlook: 'Growing demand for content music (YouTube, podcasts, games), music therapy, and online music education'
    },
    phases: [
      {
        id: 'theory-basics',
        title: 'Music Theory & Basics',
        duration: '4-6 weeks',
        description: 'Learn to read music, understand scales, chords, rhythm, and basic harmony.',
        skills: ['Music Notation', 'Major & Minor Scales', 'Chord Construction', 'Rhythm & Time Signatures', 'Ear Training Basics'],
        projects: ['Learn 10 songs by ear', 'Write chord progressions']
      },
      {
        id: 'instrument-practice',
        title: 'Instrument Proficiency',
        duration: '8-12 weeks',
        description: 'Develop proficiency on your primary instrument with daily focused practice.',
        skills: ['Technique Development', 'Repertoire Building', 'Sight Reading', 'Improvisation Basics', 'Performance Practice'],
        projects: ['Learn 20+ pieces', 'Perform at open mic']
      },
      {
        id: 'production',
        title: 'Music Production',
        duration: '6-8 weeks',
        description: 'Learn DAW basics, recording, mixing, and producing your own tracks.',
        skills: ['DAW Navigation', 'Recording Techniques', 'Mixing Basics', 'MIDI Programming', 'Sound Design'],
        projects: ['Produce 3 original tracks', 'Mix & master a demo']
      },
      {
        id: 'career-building',
        title: 'Career Building',
        duration: '4-6 weeks',
        description: 'Release music, build online presence, and explore monetization strategies.',
        skills: ['Distribution (DistroKid/TuneCore)', 'Social Media Marketing', 'Sync Licensing', 'Live Performance Booking', 'Networking'],
        projects: ['Release on streaming platforms', 'Submit to playlists/blogs']
      }
    ]
  },
  'photography': {
    name: 'Photography',
    tagline: 'Capture moments, tell visual stories',
    description: 'Photography combines technical camera skills with artistic vision. From portraits to landscapes, commercial to editorial, photography is both art and profession.',
    realWorldContext: 'Photographers work for National Geographic, shoot for Vogue, document weddings, create product imagery for e-commerce, and sell prints as fine art.',
    careerPaths: ['Portrait Photographer', 'Commercial/Product Photographer', 'Photojournalist', 'Wedding Photographer', 'Fine Art Photographer'],
    averageSalary: '$35,000-$85,000',
    jobDemand: 'Growing',
    prerequisites: ['Camera (DSLR/Mirrorless/Smartphone)', 'Eye for Composition', 'Willingness to Explore'],
    estimatedTime: '3-8 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Camera + Lenses', 'Adobe Lightroom', 'Adobe Photoshop', 'Capture One', 'Portfolio Website (Squarespace/SmugMug)'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'Photography market is worth $44 billion. E-commerce product photography, content creation, and drone photography are fastest-growing segments.',
      keySkillAreas: ['Camera Settings (Aperture, Shutter, ISO)', 'Composition', 'Lighting', 'Post-Processing', 'Client Management', 'Niche Specialization'],
      portfolioTips: ['Show only your best 20-30 images', 'Organize by genre/project', 'Include before/after editing examples', 'Get a clean, professional website'],
      professionalBodies: ['Professional Photographers of America (PPA)', 'American Society of Media Photographers (ASMP)'],
      freelanceOpportunities: 'Wedding photography, product photography, real estate, stock photography, editorial assignments',
      growthOutlook: 'E-commerce and social media content creation driving massive demand for quality photography'
    },
    phases: [
      {
        id: 'camera-basics',
        title: 'Camera & Exposure Mastery',
        duration: '3-4 weeks',
        description: 'Understand your camera, master the exposure triangle, and learn basic composition rules.',
        skills: ['Aperture, Shutter Speed, ISO', 'Metering Modes', 'Rule of Thirds', 'Leading Lines', 'Shooting in Manual Mode'],
        projects: ['30-day photo challenge', 'Exposure bracketing exercise']
      },
      {
        id: 'lighting',
        title: 'Lighting & Composition',
        duration: '4-6 weeks',
        description: 'Master natural and artificial lighting, advanced composition, and storytelling through images.',
        skills: ['Natural Light Photography', 'Flash/Strobe Basics', 'Golden Hour Shooting', 'Advanced Composition', 'Color Theory in Photography'],
        projects: ['Lighting study series', 'Golden hour portfolio']
      },
      {
        id: 'post-processing',
        title: 'Post-Processing & Editing',
        duration: '3-4 weeks',
        description: 'Learn Lightroom and Photoshop for professional photo editing and workflow.',
        skills: ['Lightroom Workflow', 'RAW Processing', 'Color Grading', 'Retouching', 'Batch Processing'],
        projects: ['Edit 100 photos with consistent style', 'Create editing presets']
      },
      {
        id: 'business',
        title: 'Photography Business',
        duration: '3-4 weeks',
        description: 'Build your photography brand, pricing strategy, and client acquisition system.',
        skills: ['Portfolio Website', 'Pricing Strategy', 'Client Communication', 'Social Media Marketing', 'Copyright & Licensing'],
        projects: ['Launch portfolio website', 'Book 3 paid shoots']
      }
    ]
  },
  'finance': {
    name: 'Finance',
    tagline: 'Master money, markets, and investment',
    description: 'Finance encompasses personal finance, corporate finance, investment management, and financial analysis. Understanding finance is essential for wealth creation and business success.',
    realWorldContext: 'Finance professionals manage trillions in assets at firms like Goldman Sachs, BlackRock, and JP Morgan. Financial literacy is the #1 skill gap globally.',
    careerPaths: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'CFO', 'Financial Planner', 'Risk Analyst'],
    averageSalary: '$65,000-$200,000+',
    jobDemand: 'High',
    prerequisites: ['Basic Math', 'Analytical Thinking', 'Interest in Markets'],
    estimatedTime: '6-12 months',
    difficulty: 'Intermediate',
    tools: ['Excel/Google Sheets', 'Bloomberg Terminal', 'Python for Finance', 'Financial Modeling Templates', 'TradingView'],
    certifications: ['CFA (Chartered Financial Analyst)', 'CPA', 'FRM', 'CFP'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'Global financial services industry is worth $26 trillion. FinTech disruption, ESG investing, and cryptocurrency are reshaping traditional finance.',
      keySkillAreas: ['Financial Statement Analysis', 'Valuation', 'Financial Modeling', 'Risk Management', 'Portfolio Theory', 'Corporate Finance'],
      professionalBodies: ['CFA Institute', 'AICPA', 'GARP (Global Association of Risk Professionals)'],
      freelanceOpportunities: 'Financial consulting, freelance financial modeling, personal finance coaching, content creation',
      growthOutlook: 'FinTech, ESG/sustainable finance, and data-driven investing are creating new career paths'
    },
    phases: [
      {
        id: 'foundations',
        title: 'Financial Fundamentals',
        duration: '4-6 weeks',
        description: 'Learn accounting basics, financial statements, and time value of money concepts.',
        skills: ['Accounting Basics', 'Income Statement, Balance Sheet, Cash Flow', 'Time Value of Money', 'Financial Ratios', 'Excel for Finance'],
        projects: ['Analyze 3 company financial statements', 'Build TVM calculator']
      },
      {
        id: 'corporate-finance',
        title: 'Corporate Finance & Valuation',
        duration: '6-8 weeks',
        description: 'Master NPV, IRR, WACC, and company valuation methods (DCF, Comparables, Precedents).',
        skills: ['Capital Budgeting (NPV, IRR)', 'WACC Calculation', 'DCF Valuation', 'Comparable Analysis', 'LBO Basics'],
        projects: ['Build DCF model for a public company', 'Comp table analysis']
      },
      {
        id: 'investments',
        title: 'Investment & Portfolio Management',
        duration: '6-8 weeks',
        description: 'Learn portfolio theory, asset allocation, risk management, and market analysis.',
        skills: ['Modern Portfolio Theory', 'Asset Classes', 'Risk & Return', 'Technical Analysis', 'Fundamental Analysis'],
        projects: ['Create mock portfolio', 'Backtest investment strategy']
      },
      {
        id: 'certification-prep',
        title: 'Professional Certification Prep',
        duration: '4-6 weeks',
        description: 'Prepare for CFA Level 1 or other finance certifications.',
        skills: ['CFA Ethics', 'Quantitative Methods', 'Economics', 'Financial Reporting', 'Equity & Fixed Income'],
        projects: ['Complete CFA Level 1 study plan', 'Take mock exams']
      }
    ]
  },
  'graphic design': {
    name: 'Graphic Design',
    tagline: 'Design visuals that communicate and inspire',
    description: 'Graphic Design creates visual content for branding, marketing, web, print, and digital media. It combines creativity with communication strategy.',
    realWorldContext: 'Graphic designers shape brand identities (Apple, Nike), create marketing campaigns, design user interfaces, and produce everything from book covers to billboard ads.',
    careerPaths: ['Graphic Designer', 'Brand Designer', 'Marketing Designer', 'Art Director', 'Freelance Designer'],
    averageSalary: '$45,000-$90,000',
    jobDemand: 'High',
    prerequisites: ['Visual Creativity', 'Basic Computer Skills', 'Eye for Aesthetics'],
    estimatedTime: '4-8 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Canva', 'InDesign', 'Procreate'],
    certifications: ['Adobe Certified Professional', 'Google UX Design Certificate'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'The design industry is worth $45 billion. Remote work and content marketing have massively increased demand for skilled designers.',
      keySkillAreas: ['Typography', 'Color Theory', 'Layout & Composition', 'Brand Identity', 'Print Design', 'Digital Design'],
      portfolioTips: ['Show diverse project types', 'Include brand identity projects', 'Show the design process', 'Less is more - quality over quantity'],
      professionalBodies: ['AIGA', 'Graphic Artists Guild', 'Design Council'],
      freelanceOpportunities: 'Brand identity design, social media design, packaging, print collateral, web design, template creation',
      growthOutlook: 'Content marketing explosion is driving unprecedented demand for visual design skills'
    },
    phases: [
      {
        id: 'principles',
        title: 'Design Principles & Theory',
        duration: '3-4 weeks',
        description: 'Learn fundamental design principles, color theory, typography, and visual hierarchy.',
        skills: ['Design Principles', 'Color Theory & Palettes', 'Typography Fundamentals', 'Visual Hierarchy', 'Grid Systems'],
        projects: ['Typography poster series', 'Color palette project']
      },
      {
        id: 'tools-mastery',
        title: 'Tool Mastery',
        duration: '4-6 weeks',
        description: 'Master Adobe Illustrator, Photoshop, and Figma for professional design work.',
        skills: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Vector Graphics', 'Photo Manipulation'],
        projects: ['Create logo designs', 'Design social media templates']
      },
      {
        id: 'brand-identity',
        title: 'Brand Identity Design',
        duration: '4-6 weeks',
        description: 'Learn to create complete brand identities including logos, guidelines, and collateral.',
        skills: ['Logo Design Process', 'Brand Guidelines', 'Business Collateral', 'Style Guides', 'Brand Strategy'],
        projects: ['Complete brand identity for fictional business', 'Rebrand existing brand']
      },
      {
        id: 'portfolio-career',
        title: 'Portfolio & Career Launch',
        duration: '3-4 weeks',
        description: 'Build professional portfolio, establish online presence, and start landing clients.',
        skills: ['Portfolio Curation', 'Behance/Dribbble Profile', 'Client Communication', 'Pricing & Proposals', 'Freelance Platforms'],
        projects: ['Launch portfolio on Behance', 'Land first freelance project']
      }
    ]
  },
  'creative writing': {
    name: 'Creative Writing',
    tagline: 'Craft stories that captivate and move',
    description: 'Creative Writing encompasses fiction, non-fiction, poetry, screenwriting, and content creation. It develops storytelling ability, voice, and written communication.',
    realWorldContext: 'Writers publish bestselling novels, write for TV shows (Netflix, HBO), create viral content, write copy for major brands, and build audiences through blogs and newsletters.',
    careerPaths: ['Author/Novelist', 'Screenwriter', 'Content Writer', 'Copywriter', 'Editor', 'Technical Writer'],
    averageSalary: '$40,000-$100,000+',
    jobDemand: 'Growing',
    prerequisites: ['Love of Reading', 'Basic Writing Skills', 'Imagination & Curiosity'],
    estimatedTime: '6-12 months',
    difficulty: 'Beginner-Friendly',
    tools: ['Scrivener', 'Google Docs', 'Grammarly', 'ProWritingAid', 'Notion', 'Hemingway Editor'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'The publishing industry is worth $26 billion. Self-publishing on Amazon has democratized access. Content writing demand has exploded with digital marketing.',
      keySkillAreas: ['Story Structure', 'Character Development', 'Dialogue', 'World Building', 'Editing & Revision', 'Finding Your Voice'],
      portfolioTips: ['Start a blog or newsletter', 'Submit to literary magazines', 'Build a writing samples page', 'Enter writing contests'],
      professionalBodies: ['PEN International', 'Authors Guild', 'National Writers Union'],
      freelanceOpportunities: 'Content writing, copywriting, ghostwriting, editing, screenwriting, self-publishing',
      growthOutlook: 'Content marketing, AI-augmented writing, newsletter economy, and self-publishing are creating new opportunities'
    },
    phases: [
      {
        id: 'craft-basics',
        title: 'Craft Fundamentals',
        duration: '4-6 weeks',
        description: 'Learn story structure, character development, dialogue, and show-don\'t-tell techniques.',
        skills: ['Story Structure (3-Act, Hero\'s Journey)', 'Character Arc', 'Dialogue Writing', 'Show Don\'t Tell', 'Point of View'],
        projects: ['Write 10 short stories', 'Character development exercises']
      },
      {
        id: 'genre-exploration',
        title: 'Genre & Style Exploration',
        duration: '4-6 weeks',
        description: 'Explore different genres and forms: fiction, non-fiction, poetry, screenwriting.',
        skills: ['Genre Conventions', 'Voice & Style', 'Poetry Forms', 'Flash Fiction', 'Personal Essay'],
        projects: ['Write in 5 different genres', 'Develop unique voice']
      },
      {
        id: 'longer-works',
        title: 'Longer Works & Revision',
        duration: '8-12 weeks',
        description: 'Write a novella or novel draft, learn revision techniques, and develop a writing routine.',
        skills: ['Outlining & Planning', 'First Draft Writing', 'Revision & Editing', 'Beta Reading', 'Writing Routine'],
        projects: ['Complete novel first draft (50K+ words)', 'Revise and edit']
      },
      {
        id: 'publishing',
        title: 'Publishing & Career',
        duration: '4-6 weeks',
        description: 'Learn publishing paths (traditional & self), query letters, and building author platform.',
        skills: ['Query Letter Writing', 'Self-Publishing (KDP)', 'Author Platform', 'Social Media for Writers', 'Writing Community'],
        projects: ['Submit to 10+ literary magazines', 'Build author website']
      }
    ]
  },
  'psychology': {
    name: 'Psychology',
    tagline: 'Understand the human mind and behavior',
    description: 'Psychology studies human behavior, cognition, and emotion. It applies to therapy, organizational behavior, UX research, marketing, and education.',
    realWorldContext: 'Psychologists work in hospitals, schools, corporations (organizational psychology), tech companies (UX research), and private practice. Mental health awareness is driving massive demand.',
    careerPaths: ['Clinical Psychologist', 'Counselor', 'Industrial/Organizational Psychologist', 'UX Researcher', 'School Psychologist', 'Behavioral Analyst'],
    averageSalary: '$55,000-$120,000',
    jobDemand: 'High',
    prerequisites: ['Empathy & Curiosity', 'Scientific Thinking', 'Communication Skills'],
    estimatedTime: '6-12 months (introductory)',
    difficulty: 'Intermediate',
    tools: ['Research Databases (PsycINFO)', 'SPSS/R for Statistics', 'Assessment Tools', 'Therapy Frameworks', 'Online Learning Platforms'],
    certifications: ['Psychology Degree (BA/MA/PhD)', 'Licensed Professional Counselor', 'Board Certified Behavior Analyst'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'Mental health services market is worth $400 billion and growing rapidly. Teletherapy, workplace wellness, and behavioral science applications are expanding career options.',
      keySkillAreas: ['Research Methods', 'Cognitive Psychology', 'Behavioral Psychology', 'Clinical Skills', 'Statistical Analysis', 'Counseling Techniques'],
      professionalBodies: ['American Psychological Association (APA)', 'British Psychological Society', 'Association for Psychological Science'],
      freelanceOpportunities: 'Private practice, consulting (organizational psychology), UX research consulting, coaching, writing',
      growthOutlook: 'Explosive growth in telehealth, workplace mental wellness, behavioral economics, and UX research'
    },
    phases: [
      {
        id: 'intro',
        title: 'Introduction to Psychology',
        duration: '4-6 weeks',
        description: 'Cover major schools of thought, research methods, and foundational concepts.',
        skills: ['History of Psychology', 'Research Methods', 'Biological Psychology', 'Learning & Memory', 'Developmental Psychology'],
        projects: ['Read introductory textbook', 'Write research summaries']
      },
      {
        id: 'core-areas',
        title: 'Core Psychology Areas',
        duration: '6-8 weeks',
        description: 'Deep dive into cognitive, social, clinical, and developmental psychology.',
        skills: ['Cognitive Psychology', 'Social Psychology', 'Abnormal Psychology', 'Personality Theories', 'Statistics for Psychology'],
        projects: ['Case study analysis', 'Design a simple experiment']
      },
      {
        id: 'applied',
        title: 'Applied Psychology',
        duration: '6-8 weeks',
        description: 'Explore practical applications: therapy approaches, organizational behavior, UX research.',
        skills: ['CBT & Therapy Approaches', 'Organizational Psychology', 'Consumer Psychology', 'Positive Psychology', 'Assessment & Testing'],
        projects: ['Therapy approach comparison paper', 'Organizational behavior case study']
      },
      {
        id: 'specialization',
        title: 'Specialization & Career Path',
        duration: '4-6 weeks',
        description: 'Choose a specialization and explore graduate programs, licensing requirements, or alternative career paths.',
        skills: ['Specialization Research', 'Graduate School Prep', 'Licensing Requirements', 'Professional Development', 'Ethics in Psychology'],
        projects: ['Create career roadmap', 'Apply to programs/internships']
      }
    ]
  },
  'law': {
    name: 'Law',
    tagline: 'Understand justice, rights, and legal systems',
    description: 'Law encompasses legal theory, constitutional law, corporate law, criminal law, and more. Legal knowledge is valuable across all industries.',
    realWorldContext: 'Lawyers work in courts, corporate boardrooms, government agencies, and international organizations. Legal tech is creating new career paths for tech-savvy legal professionals.',
    careerPaths: ['Attorney/Lawyer', 'Legal Counsel', 'Judge', 'Legal Analyst', 'Compliance Officer', 'Legal Tech Specialist'],
    averageSalary: '$60,000-$200,000+',
    jobDemand: 'High',
    prerequisites: ['Critical Thinking', 'Strong Reading Skills', 'Argumentative Writing'],
    estimatedTime: '6-12 months (introductory)',
    difficulty: 'Intermediate',
    tools: ['Legal Research Databases (Westlaw, LexisNexis)', 'Case Law Libraries', 'Legal Writing Guides', 'MOOC Platforms'],
    certifications: ['Law Degree (LLB/JD)', 'Bar Examination', 'Paralegal Certificate'],
    contentType: 'non-tech',
    nonTechInfo: {
      industryOverview: 'The global legal services market is worth $900 billion. Legal tech, alternative legal service providers, and AI-assisted legal research are transforming the industry.',
      keySkillAreas: ['Legal Research', 'Legal Writing', 'Case Analysis', 'Argumentation', 'Statutory Interpretation', 'Client Communication'],
      professionalBodies: ['American Bar Association', 'International Bar Association', 'Bar Council (various countries)'],
      freelanceOpportunities: 'Legal consulting, contract review, compliance advisory, legal writing, mediation',
      growthOutlook: 'Legal tech, compliance, data privacy law (GDPR), and international law are growing fastest'
    },
    phases: [
      {
        id: 'foundations',
        title: 'Legal Foundations',
        duration: '4-6 weeks',
        description: 'Understand legal systems, constitutional law basics, and legal terminology.',
        skills: ['Legal Systems Overview', 'Constitutional Law', 'Legal Terminology', 'Sources of Law', 'Legal Reasoning'],
        projects: ['Read landmark case summaries', 'Legal terminology glossary']
      },
      {
        id: 'core-subjects',
        title: 'Core Legal Subjects',
        duration: '8-10 weeks',
        description: 'Study contracts, torts, criminal law, property law, and civil procedure.',
        skills: ['Contract Law', 'Tort Law', 'Criminal Law', 'Property Law', 'Civil Procedure'],
        projects: ['Case brief analysis', 'Moot court preparation']
      },
      {
        id: 'specialization',
        title: 'Specialization Areas',
        duration: '6-8 weeks',
        description: 'Explore corporate law, intellectual property, human rights, environmental law, or tech law.',
        skills: ['Corporate/Commercial Law', 'IP Law', 'Human Rights Law', 'Cyber Law', 'Tax Law Basics'],
        projects: ['Research paper on chosen specialization', 'Legal memo writing']
      },
      {
        id: 'practical',
        title: 'Practical Skills & Career',
        duration: '4-6 weeks',
        description: 'Develop practical legal skills: drafting, negotiation, client interaction, and career planning.',
        skills: ['Legal Drafting', 'Negotiation Skills', 'Client Management', 'Legal Research (Databases)', 'Career Planning'],
        projects: ['Draft a contract', 'Prepare for law school/bar prep']
      }
    ]
  }
};

// ─── TECH ROADMAPS (existing) ───

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
    contentType: 'tech',
    tools: ['Python', 'Jupyter Notebook', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'SQL', 'Git'],
    certifications: ['Google Data Analytics', 'IBM Data Science', 'AWS ML Specialty'],
    phases: [
      { id: 'foundation', title: 'Foundation', duration: '4-6 weeks', description: 'Build your programming and math fundamentals.', skills: ['Python Basics', 'Statistics Fundamentals', 'Probability', 'Basic Math'], projects: ['Calculator App', 'Statistical Analysis of a Dataset'] },
      { id: 'data-manipulation', title: 'Data Wrangling', duration: '4-6 weeks', description: 'Master data manipulation libraries.', skills: ['Pandas', 'NumPy', 'Data Cleaning', 'Data Transformation'], projects: ['Clean a Real-World Dataset', 'Exploratory Data Analysis'] },
      { id: 'visualization', title: 'Data Visualization', duration: '3-4 weeks', description: 'Tell stories with data through visualizations.', skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Creation'], projects: ['Interactive Dashboard', 'Data Story Presentation'] },
      { id: 'sql-databases', title: 'SQL & Databases', duration: '3-4 weeks', description: 'Master SQL for data retrieval.', skills: ['SQL Queries', 'Joins & Aggregations', 'Database Design', 'PostgreSQL/MySQL'], projects: ['Build a Database', 'Complex Query Analysis'] },
      { id: 'machine-learning', title: 'Machine Learning', duration: '6-8 weeks', description: 'Dive into ML algorithms.', skills: ['Regression', 'Classification', 'Clustering', 'Model Evaluation', 'Scikit-learn'], projects: ['Prediction Model', 'Customer Segmentation'] },
      { id: 'advanced', title: 'Advanced & Specialization', duration: '4-6 weeks', description: 'Explore deep learning, NLP, or time series.', skills: ['Deep Learning Basics', 'NLP or Computer Vision', 'Big Data Tools', 'Model Deployment'], projects: ['End-to-End ML Project', 'Portfolio Project'] }
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
    contentType: 'tech',
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'OpenAI API', 'Hugging Face', 'CUDA'],
    certifications: ['DeepLearning.AI Specialization', 'Google ML Engineer', 'AWS AI Practitioner'],
    phases: [
      { id: 'foundation', title: 'Programming & Math', duration: '6-8 weeks', description: 'Master Python and essential mathematics.', skills: ['Python Advanced', 'Linear Algebra', 'Calculus', 'Probability & Statistics', 'NumPy'], projects: ['Math Library Implementation', 'Data Processing Pipeline'] },
      { id: 'ml-fundamentals', title: 'Machine Learning Core', duration: '8-10 weeks', description: 'Learn core ML algorithms from scratch.', skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Optimization'], projects: ['Build ML Algorithms from Scratch', 'Kaggle Competition'] },
      { id: 'deep-learning', title: 'Deep Learning', duration: '8-10 weeks', description: 'Dive into neural networks, CNNs, RNNs, and transformers.', skills: ['Neural Networks', 'CNNs', 'RNNs/LSTMs', 'Transformers', 'TensorFlow/PyTorch'], projects: ['Image Classifier', 'Text Generator'] },
      { id: 'specialization', title: 'Specialization', duration: '8-12 weeks', description: 'Choose NLP, Computer Vision, RL, or Generative AI.', skills: ['NLP/CV/RL', 'Large Language Models', 'GANs', 'Prompt Engineering'], projects: ['Specialized AI Project', 'Research Paper Implementation'] },
      { id: 'deployment', title: 'Production & Ethics', duration: '4-6 weeks', description: 'Deploy AI models and understand AI ethics.', skills: ['Model Deployment', 'MLOps', 'AI Ethics', 'Bias Detection'], projects: ['Deploy AI API', 'Ethical AI Audit'] }
    ]
  },
  'machine learning': {
    name: 'Machine Learning',
    tagline: 'Teach computers to learn from data',
    description: 'Machine Learning enables systems to automatically learn and improve from experience. It\'s the foundation of modern AI applications.',
    realWorldContext: 'ML powers spam filters, product recommendations on Amazon, credit scoring at banks, and predictive maintenance in manufacturing.',
    careerPaths: ['ML Engineer', 'Data Scientist', 'Research Scientist', 'Applied ML Engineer', 'MLOps Engineer'],
    averageSalary: '$110,000 - $180,000',
    jobDemand: 'High',
    prerequisites: ['Python', 'Statistics', 'Linear Algebra'],
    estimatedTime: '8-14 months',
    difficulty: 'Intermediate',
    contentType: 'tech',
    tools: ['Python', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'MLflow', 'Docker'],
    certifications: ['Google ML Engineer', 'AWS ML Specialty', 'Coursera ML Specialization'],
    phases: [
      { id: 'foundation', title: 'Mathematical Foundations', duration: '4-6 weeks', description: 'Build strong math foundations.', skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability', 'Python for ML'], projects: ['Implement Math Operations', 'Statistical Analysis'] },
      { id: 'supervised', title: 'Supervised Learning', duration: '6-8 weeks', description: 'Master regression and classification.', skills: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'KNN'], projects: ['House Price Prediction', 'Customer Churn Prediction'] },
      { id: 'unsupervised', title: 'Unsupervised Learning', duration: '4-6 weeks', description: 'Learn clustering and dimensionality reduction.', skills: ['K-Means', 'Hierarchical Clustering', 'PCA', 'Anomaly Detection'], projects: ['Customer Segmentation', 'Fraud Detection'] },
      { id: 'advanced-ml', title: 'Advanced Techniques', duration: '6-8 weeks', description: 'Explore ensemble methods and model optimization.', skills: ['Gradient Boosting', 'XGBoost', 'Feature Engineering', 'Hyperparameter Tuning'], projects: ['Kaggle Competition', 'Feature Store'] },
      { id: 'production', title: 'Production ML', duration: '4-6 weeks', description: 'Deploy and monitor ML models in production.', skills: ['Model Deployment', 'API Development', 'Model Monitoring', 'MLOps'], projects: ['Deploy ML API', 'Monitoring Dashboard'] }
    ]
  },
  'web development': {
    name: 'Web Development',
    tagline: 'Build the internet, one site at a time',
    description: 'Web Development creates websites and web applications. Skills are in constant demand across all industries.',
    realWorldContext: 'Web developers build everything from e-commerce sites to social platforms like Twitter and streaming services like Netflix.',
    careerPaths: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Web Architect', 'DevOps Engineer'],
    averageSalary: '$70,000 - $140,000',
    jobDemand: 'High',
    prerequisites: ['Basic Computer Skills', 'Problem Solving', 'Creativity'],
    estimatedTime: '6-12 months',
    difficulty: 'Beginner-Friendly',
    contentType: 'tech',
    tools: ['VS Code', 'Git', 'Chrome DevTools', 'Node.js', 'React', 'PostgreSQL', 'Vercel/Netlify'],
    certifications: ['Meta Frontend Developer', 'AWS Developer Associate', 'Google Web Developer'],
    phases: [
      { id: 'html-css', title: 'HTML & CSS Basics', duration: '3-4 weeks', description: 'Structure content with HTML and style with CSS.', skills: ['HTML5 Semantics', 'CSS Fundamentals', 'Flexbox', 'CSS Grid', 'Responsive Design'], projects: ['Personal Portfolio', 'Responsive Landing Page'] },
      { id: 'javascript', title: 'JavaScript Fundamentals', duration: '4-6 weeks', description: 'Add interactivity to websites.', skills: ['JavaScript ES6+', 'DOM Manipulation', 'Events', 'Async/Await', 'Fetch API'], projects: ['Interactive To-Do App', 'Weather App'] },
      { id: 'react', title: 'React & Modern Frontend', duration: '6-8 weeks', description: 'Build dynamic UIs with React.', skills: ['React Components', 'Hooks', 'State Management', 'React Router', 'TypeScript'], projects: ['Full React App', 'E-commerce Frontend'] },
      { id: 'backend', title: 'Backend Development', duration: '6-8 weeks', description: 'Server-side development with Node.js and databases.', skills: ['Node.js', 'Express.js', 'REST APIs', 'SQL/PostgreSQL', 'Authentication'], projects: ['REST API', 'Full Stack App'] },
      { id: 'deployment', title: 'Deployment & DevOps', duration: '3-4 weeks', description: 'Deploy applications and learn DevOps.', skills: ['Git/GitHub', 'CI/CD', 'Docker Basics', 'Cloud Hosting'], projects: ['Deploy Full Stack App', 'CI/CD Pipeline'] }
    ]
  },
  'cyber security': {
    name: 'Cybersecurity',
    tagline: 'Defend the digital frontier',
    description: 'Cybersecurity protects systems, networks, and data from digital attacks. Security professionals are essential for every organization.',
    realWorldContext: 'Security experts prevent data breaches at banks, protect patient data at hospitals, and secure government systems.',
    careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'SOC Analyst', 'CISO'],
    averageSalary: '$85,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Networking Basics', 'Linux', 'Problem Solving'],
    estimatedTime: '8-14 months',
    difficulty: 'Intermediate',
    contentType: 'tech',
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Nmap', 'OWASP ZAP'],
    certifications: ['CompTIA Security+', 'CEH', 'CISSP', 'OSCP'],
    phases: [
      { id: 'foundation', title: 'IT & Networking Basics', duration: '4-6 weeks', description: 'Understand computer systems and networking.', skills: ['Networking Fundamentals', 'TCP/IP', 'Linux Basics', 'Windows Administration'], projects: ['Home Lab Setup', 'Network Diagram'] },
      { id: 'security-fundamentals', title: 'Security Fundamentals', duration: '4-6 weeks', description: 'Learn core security concepts.', skills: ['CIA Triad', 'Threat Modeling', 'Cryptography Basics', 'Authentication'], projects: ['Security Policy Document', 'Risk Assessment'] },
      { id: 'offensive', title: 'Offensive Security', duration: '6-8 weeks', description: 'Learn ethical hacking and penetration testing.', skills: ['Reconnaissance', 'Vulnerability Scanning', 'Exploitation', 'Web App Security'], projects: ['CTF Challenges', 'Penetration Test Report'] },
      { id: 'defensive', title: 'Defensive Security', duration: '6-8 weeks', description: 'Master defense and incident response.', skills: ['SIEM', 'Incident Response', 'Forensics', 'Malware Analysis'], projects: ['Incident Response Plan', 'Security Monitoring Setup'] },
      { id: 'compliance', title: 'Governance & Compliance', duration: '3-4 weeks', description: 'Understand security frameworks.', skills: ['NIST Framework', 'ISO 27001', 'GDPR', 'Security Auditing'], projects: ['Compliance Audit', 'Security Framework Implementation'] }
    ]
  },
  'cloud computing': {
    name: 'Cloud Computing',
    tagline: 'Power the world from anywhere',
    description: 'Cloud Computing delivers computing services over the internet for scalable, flexible IT infrastructure.',
    realWorldContext: 'Cloud engineers power Netflix streaming to 200M+ users and help startups launch without buying servers.',
    careerPaths: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer', 'Cloud Consultant', 'SRE'],
    averageSalary: '$100,000 - $170,000',
    jobDemand: 'High',
    prerequisites: ['Linux Basics', 'Networking', 'Programming Basics'],
    estimatedTime: '6-10 months',
    difficulty: 'Intermediate',
    contentType: 'tech',
    tools: ['AWS/Azure/GCP Console', 'Terraform', 'Docker', 'Kubernetes', 'Ansible'],
    certifications: ['AWS Solutions Architect', 'Azure Administrator', 'GCP Cloud Engineer'],
    phases: [
      { id: 'foundation', title: 'Cloud Fundamentals', duration: '3-4 weeks', description: 'Understand cloud concepts and major providers.', skills: ['IaaS/PaaS/SaaS', 'Cloud Economics', 'AWS/Azure/GCP Overview'], projects: ['Cloud Account Setup', 'Cost Calculator Exercise'] },
      { id: 'compute-storage', title: 'Compute & Storage', duration: '4-6 weeks', description: 'Master VMs, containers, and storage.', skills: ['EC2/VMs', 'S3/Blob Storage', 'Docker Containers', 'Lambda/Functions'], projects: ['Web Server Deployment', 'Static Website Hosting'] },
      { id: 'networking', title: 'Cloud Networking', duration: '3-4 weeks', description: 'Design and secure cloud networks.', skills: ['VPC/VNet', 'Subnets', 'Security Groups', 'CDN', 'DNS'], projects: ['Multi-Tier VPC', 'Hybrid Connectivity'] },
      { id: 'iac', title: 'Infrastructure as Code', duration: '4-6 weeks', description: 'Automate infrastructure with Terraform and CloudFormation.', skills: ['Terraform', 'CloudFormation', 'Ansible', 'CI/CD for Infrastructure'], projects: ['IaC Templates', 'Automated Deployment Pipeline'] },
      { id: 'advanced', title: 'Advanced & Specialization', duration: '4-6 weeks', description: 'Explore Kubernetes, serverless, and security.', skills: ['Kubernetes', 'Serverless Architecture', 'Cloud Security', 'Cost Optimization'], projects: ['Kubernetes Cluster', 'Serverless Application'] }
    ]
  },
  'devops': {
    name: 'DevOps',
    tagline: 'Bridge development and operations',
    description: 'DevOps combines software development and IT operations for faster, more reliable software delivery.',
    realWorldContext: 'DevOps engineers at Amazon deploy code thousands of times per day. At Spotify, 100+ teams ship independently.',
    careerPaths: ['DevOps Engineer', 'SRE', 'Platform Engineer', 'Release Engineer', 'Infrastructure Engineer'],
    averageSalary: '$95,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Linux', 'Programming', 'Networking Basics'],
    estimatedTime: '6-12 months',
    difficulty: 'Intermediate',
    contentType: 'tech',
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Prometheus', 'Grafana'],
    certifications: ['CKA', 'AWS DevOps Professional', 'Docker Certified Associate'],
    phases: [
      { id: 'foundation', title: 'Linux & Scripting', duration: '4-6 weeks', description: 'Master Linux and scripting for automation.', skills: ['Linux Commands', 'Bash Scripting', 'Python Automation', 'Git'], projects: ['Automation Scripts', 'Server Setup'] },
      { id: 'containers', title: 'Containers & Docker', duration: '4-6 weeks', description: 'Learn containerization with Docker.', skills: ['Docker Basics', 'Dockerfile', 'Docker Compose', 'Container Networking'], projects: ['Containerize Application', 'Multi-Container App'] },
      { id: 'cicd', title: 'CI/CD Pipelines', duration: '4-6 weeks', description: 'Build automated pipelines.', skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Pipeline Design'], projects: ['CI/CD Pipeline', 'Automated Testing'] },
      { id: 'kubernetes', title: 'Kubernetes Orchestration', duration: '6-8 weeks', description: 'Master Kubernetes at scale.', skills: ['K8s Architecture', 'Deployments', 'Services', 'Helm Charts'], projects: ['K8s Cluster Setup', 'Deploy Microservices'] },
      { id: 'observability', title: 'Monitoring & Observability', duration: '3-4 weeks', description: 'Implement monitoring and alerting.', skills: ['Prometheus', 'Grafana', 'ELK Stack', 'SLIs/SLOs'], projects: ['Monitoring Stack', 'Dashboard Creation'] }
    ]
  },
  'blockchain': {
    name: 'Blockchain Development',
    tagline: 'Build the decentralized future',
    description: 'Blockchain is a distributed ledger technology enabling secure, transparent, and decentralized applications.',
    realWorldContext: 'Blockchain powers Bitcoin and Ethereum, enables DeFi platforms like Uniswap, and tracks supply chains for Walmart.',
    careerPaths: ['Blockchain Developer', 'Smart Contract Developer', 'Web3 Developer', 'DeFi Engineer'],
    averageSalary: '$100,000 - $180,000',
    jobDemand: 'Growing',
    prerequisites: ['JavaScript/Programming', 'Web Development Basics', 'Cryptography Basics'],
    estimatedTime: '6-10 months',
    difficulty: 'Advanced',
    contentType: 'tech',
    tools: ['Solidity', 'Hardhat', 'Web3.js', 'Ethers.js', 'MetaMask', 'IPFS'],
    certifications: ['Certified Blockchain Developer', 'Ethereum Developer Certification'],
    phases: [
      { id: 'foundation', title: 'Blockchain Fundamentals', duration: '3-4 weeks', description: 'Understand blockchain concepts and cryptography.', skills: ['Distributed Systems', 'Cryptography', 'Consensus Mechanisms', 'Ethereum Basics'], projects: ['Blockchain Simulation', 'Wallet Setup'] },
      { id: 'solidity', title: 'Smart Contract Development', duration: '6-8 weeks', description: 'Learn Solidity for Ethereum smart contracts.', skills: ['Solidity Syntax', 'ERC Standards', 'Security Patterns', 'Testing Contracts'], projects: ['Token Contract', 'Simple DApp'] },
      { id: 'web3', title: 'Web3 Frontend', duration: '4-6 weeks', description: 'Connect web apps to blockchain.', skills: ['Web3.js/Ethers.js', 'Wallet Integration', 'Contract Interaction', 'IPFS'], projects: ['NFT Marketplace Frontend', 'DeFi Dashboard'] },
      { id: 'defi', title: 'DeFi & Advanced', duration: '4-6 weeks', description: 'Explore DeFi protocols and DAOs.', skills: ['DeFi Protocols', 'Liquidity Pools', 'Flash Loans', 'DAO Development'], projects: ['DeFi Protocol', 'DAO Implementation'] },
      { id: 'security', title: 'Security & Auditing', duration: '3-4 weeks', description: 'Learn smart contract security.', skills: ['Common Vulnerabilities', 'Security Auditing', 'Formal Verification'], projects: ['Security Audit', 'Capture the Flag'] }
    ]
  },
  'digital marketing': {
    name: 'Digital Marketing',
    tagline: 'Reach audiences in the digital age',
    description: 'Digital Marketing uses online channels to reach and engage customers through SEO, social media, ads, and content.',
    realWorldContext: 'Digital marketers help startups acquire customers profitably, run viral campaigns, and build personal brands with millions of followers.',
    careerPaths: ['Digital Marketing Manager', 'SEO Specialist', 'Social Media Manager', 'Content Marketer', 'Growth Hacker'],
    averageSalary: '$50,000 - $120,000',
    jobDemand: 'High',
    prerequisites: ['Communication Skills', 'Creativity', 'Basic Analytics'],
    estimatedTime: '4-8 months',
    difficulty: 'Beginner-Friendly',
    contentType: 'non-tech',
    tools: ['Google Analytics', 'Google Ads', 'Meta Ads', 'SEMrush', 'Canva', 'Mailchimp', 'HubSpot'],
    certifications: ['Google Analytics', 'Google Ads', 'Meta Blueprint', 'HubSpot Inbound'],
    phases: [
      { id: 'foundation', title: 'Marketing Fundamentals', duration: '2-3 weeks', description: 'Understand digital marketing landscape.', skills: ['Marketing Funnel', 'Customer Journey', 'Brand Positioning', 'KPIs'], projects: ['Marketing Plan', 'Competitor Analysis'] },
      { id: 'seo', title: 'SEO & Content', duration: '4-6 weeks', description: 'Master search engine optimization.', skills: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Content Strategy'], projects: ['SEO Audit', 'Content Calendar'] },
      { id: 'paid', title: 'Paid Advertising', duration: '4-6 weeks', description: 'Run effective paid campaigns.', skills: ['Google Ads', 'Facebook/Meta Ads', 'Campaign Structure', 'A/B Testing'], projects: ['Ad Campaign', 'Landing Page Optimization'] },
      { id: 'social', title: 'Social Media Marketing', duration: '3-4 weeks', description: 'Build and engage audiences.', skills: ['Platform Strategies', 'Content Creation', 'Community Management', 'Influencer Marketing'], projects: ['Social Media Strategy', 'Viral Content'] },
      { id: 'analytics', title: 'Analytics & Optimization', duration: '3-4 weeks', description: 'Measure and optimize performance.', skills: ['Google Analytics 4', 'Conversion Tracking', 'Attribution Models', 'CRO'], projects: ['Analytics Dashboard', 'Optimization Report'] }
    ]
  },
  'project management': {
    name: 'Project Management',
    tagline: 'Lead projects to successful delivery',
    description: 'Project Management is the practice of initiating, planning, executing, and closing projects to achieve specific goals.',
    realWorldContext: 'Project managers lead product launches, construction projects, software sprints, and global marketing campaigns.',
    careerPaths: ['Project Manager', 'Scrum Master', 'Program Manager', 'Agile Coach', 'PMO Director'],
    averageSalary: '$75,000 - $140,000',
    jobDemand: 'High',
    prerequisites: ['Communication Skills', 'Organization', 'Leadership'],
    estimatedTime: '3-6 months',
    difficulty: 'Beginner-Friendly',
    contentType: 'non-tech',
    tools: ['Jira', 'Asana', 'Monday.com', 'Microsoft Project', 'Confluence', 'Notion'],
    certifications: ['PMP', 'PRINCE2', 'Scrum Master (CSM)', 'Agile Certified Practitioner'],
    phases: [
      { id: 'foundation', title: 'PM Fundamentals', duration: '3-4 weeks', description: 'Understand PM concepts and lifecycle.', skills: ['PM Lifecycle', 'Stakeholder Management', 'Scope Definition', 'WBS'], projects: ['Project Charter', 'Stakeholder Register'] },
      { id: 'agile', title: 'Agile & Scrum', duration: '3-4 weeks', description: 'Master Agile and Scrum.', skills: ['Agile Manifesto', 'Scrum Framework', 'Sprint Planning', 'Retrospectives'], projects: ['Sprint Simulation', 'Agile Transformation Plan'] },
      { id: 'planning', title: 'Planning & Scheduling', duration: '3-4 weeks', description: 'Create project plans and schedules.', skills: ['Gantt Charts', 'Critical Path', 'Resource Planning', 'Budget Management', 'Risk Management'], projects: ['Project Schedule', 'Risk Register'] },
      { id: 'execution', title: 'Execution & Monitoring', duration: '3-4 weeks', description: 'Manage execution and track progress.', skills: ['Progress Tracking', 'Change Management', 'Issue Resolution', 'Team Leadership'], projects: ['Status Reports', 'Change Request Process'] },
      { id: 'tools', title: 'Tools & Certification', duration: '2-3 weeks', description: 'Master PM tools and prepare for certification.', skills: ['Jira/Asana', 'Documentation', 'PMP/CSM Prep', 'Presentation Skills'], projects: ['Tool Implementation', 'Certification Study Plan'] }
    ]
  },
  'full stack development': {
    name: 'Full Stack Development',
    tagline: 'Build complete web applications',
    description: 'Full Stack Development covers both frontend and backend, enabling you to build complete web applications.',
    realWorldContext: 'Full stack developers build products at startups, create MVPs, and work at companies like Airbnb and Stripe.',
    careerPaths: ['Full Stack Developer', 'Software Engineer', 'Tech Lead', 'Startup CTO', 'Freelance Developer'],
    averageSalary: '$85,000 - $160,000',
    jobDemand: 'High',
    prerequisites: ['Basic Programming', 'Problem Solving', 'Web Basics'],
    estimatedTime: '9-15 months',
    difficulty: 'Intermediate',
    contentType: 'tech',
    tools: ['VS Code', 'Git', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS/Vercel'],
    certifications: ['Meta Full Stack', 'AWS Developer', 'MongoDB Developer'],
    phases: [
      { id: 'frontend-basics', title: 'Frontend Foundations', duration: '6-8 weeks', description: 'Master HTML, CSS, JavaScript.', skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git Basics'], projects: ['Portfolio Website', 'Interactive Landing Page'] },
      { id: 'react', title: 'React Development', duration: '6-8 weeks', description: 'Build modern UIs with React.', skills: ['React', 'TypeScript', 'State Management', 'Hooks', 'React Router'], projects: ['React Application', 'Component Library'] },
      { id: 'backend', title: 'Backend Development', duration: '6-8 weeks', description: 'Build APIs with Node.js.', skills: ['Node.js', 'Express', 'REST APIs', 'Authentication', 'Middleware'], projects: ['REST API', 'Auth System'] },
      { id: 'database', title: 'Databases', duration: '4-6 weeks', description: 'Master SQL and NoSQL databases.', skills: ['PostgreSQL', 'MongoDB', 'ORM/ODM', 'Database Design', 'Migrations'], projects: ['Database Schema', 'Data Layer'] },
      { id: 'deployment', title: 'DevOps & Deployment', duration: '4-6 weeks', description: 'Deploy and maintain apps in production.', skills: ['Docker', 'CI/CD', 'Cloud Hosting', 'Monitoring', 'Security'], projects: ['Full Stack App Deployment', 'Production Pipeline'] }
    ]
  }
};

// Merge all roadmaps
const ALL_ROADMAPS: Record<string, SkillRoadmap> = {
  ...SKILL_ROADMAPS,
  ...EXAM_ROADMAPS,
  ...NON_TECH_ROADMAPS,
};

// Function to get roadmap by skill name (case-insensitive fuzzy match)
export function getSkillRoadmap(skillName: string): SkillRoadmap | null {
  const normalizedSkill = skillName.toLowerCase().trim();
  
  // Exact match
  if (ALL_ROADMAPS[normalizedSkill]) {
    return ALL_ROADMAPS[normalizedSkill];
  }
  
  // Fuzzy match
  for (const [key, roadmap] of Object.entries(ALL_ROADMAPS)) {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      return roadmap;
    }
  }
  
  // Check alternate names
  const alternates: Record<string, string> = {
    'ml': 'machine learning',
    'artificial intelligence': 'ai',
    'ai/ml': 'ai',
    'ds': 'data science',
    'frontend': 'web development',
    'backend': 'web development',
    'fullstack': 'full stack development',
    'security': 'cyber security',
    'infosec': 'cyber security',
    'cybersecurity': 'cyber security',
    'aws': 'aws',
    'azure': 'cloud computing',
    'gcp': 'cloud computing',
    'marketing': 'digital marketing',
    'pm': 'project management',
    'crypto': 'blockchain',
    'web3': 'blockchain',
    'defi': 'blockchain',
    'common admission test': 'cat',
    'iim': 'cat',
    'mba entrance': 'cat',
    'engineering entrance': 'jee',
    'iit entrance': 'jee',
    'medical entrance': 'neet',
    'civil services': 'upsc',
    'ias': 'upsc',
    'ips': 'upsc',
    'design': 'graphic design',
    'painting': 'fine arts',
    'drawing': 'fine arts',
    'sculpture': 'fine arts',
    'art': 'fine arts',
    'writing': 'creative writing',
    'investment': 'finance',
    'accounting': 'finance',
    'stock market': 'finance',
    'personal finance': 'finance',
    'mental health': 'psychology',
    'counseling': 'psychology',
  };
  
  if (alternates[normalizedSkill]) {
    return ALL_ROADMAPS[alternates[normalizedSkill]];
  }
  
  return null;
}

// Detect content type from skill name
export function detectContentType(skillName: string): ContentType {
  const examNames = ['gate', 'cat', 'jee', 'upsc', 'neet', 'gre', 'gmat', 'sat', 'ielts', 'toefl', 'lsat', 'mcat', 'aws', 'comptia'];
  const nonTechNames = ['fine arts', 'music', 'photography', 'finance', 'graphic design', 'creative writing', 'psychology', 'law', 'digital marketing', 'project management', 'animation', 'architecture', 'culinary arts', 'fashion design', 'interior design', 'journalism', 'philosophy', 'education', 'performing arts', 'accounting', 'health', 'film'];
  
  const normalized = skillName.toLowerCase().trim();
  
  if (examNames.some(e => normalized === e || normalized.includes(e))) return 'exam';
  if (nonTechNames.some(n => normalized.includes(n) || n.includes(normalized))) return 'non-tech';
  
  return 'tech';
}

// Generate a generic roadmap for unknown skills with proper content type
export function generateGenericRoadmap(skillName: string): SkillRoadmap {
  const contentType = detectContentType(skillName);
  
  if (contentType === 'exam') {
    return generateGenericExamRoadmap(skillName);
  }
  if (contentType === 'non-tech') {
    return generateGenericNonTechRoadmap(skillName);
  }
  return generateGenericTechRoadmap(skillName);
}

function generateGenericTechRoadmap(skillName: string): SkillRoadmap {
  return {
    name: skillName,
    tagline: `Master ${skillName} step by step`,
    description: `A comprehensive learning path to become proficient in ${skillName}. This roadmap covers fundamentals to advanced topics with hands-on projects.`,
    realWorldContext: `${skillName} skills are used across various industries. From startups to enterprises, these skills help professionals create value and advance their careers.`,
    careerPaths: ['Specialist', 'Consultant', 'Team Lead', 'Manager', 'Expert'],
    jobDemand: 'Growing',
    prerequisites: ['Basic Knowledge', 'Learning Mindset', 'Practice Time'],
    estimatedTime: '4-8 months',
    difficulty: 'Beginner-Friendly',
    contentType: 'tech',
    tools: ['Online Resources', 'Practice Platforms', 'Community Forums', 'Documentation'],
    phases: [
      { id: 'foundation', title: 'Foundation', duration: '4-6 weeks', description: 'Build foundational knowledge and core concepts.', skills: ['Core Concepts', 'Terminology', 'Basic Principles', 'Tools Setup'], projects: ['Beginner Project', 'Concept Documentation'] },
      { id: 'intermediate', title: 'Intermediate Skills', duration: '6-8 weeks', description: 'Deepen understanding with real projects.', skills: ['Advanced Concepts', 'Best Practices', 'Problem Solving', 'Real-World Applications'], projects: ['Intermediate Project', 'Case Study'] },
      { id: 'advanced', title: 'Advanced Mastery', duration: '6-8 weeks', description: 'Master advanced topics and specialize.', skills: ['Expert Techniques', 'Optimization', 'Leadership', 'Innovation'], projects: ['Advanced Project', 'Portfolio Piece'] },
      { id: 'professional', title: 'Professional Development', duration: '4-6 weeks', description: 'Apply skills professionally.', skills: ['Industry Standards', 'Networking', 'Continuous Learning', 'Mentorship'], projects: ['Professional Portfolio', 'Community Contribution'] }
    ]
  };
}

function generateGenericExamRoadmap(skillName: string): SkillRoadmap {
  return {
    name: skillName,
    tagline: `Prepare for ${skillName} examination`,
    description: `A structured preparation plan for the ${skillName} exam. Follow this roadmap to systematically cover the syllabus and maximize your score.`,
    realWorldContext: `The ${skillName} exam is a competitive examination. Proper preparation strategy, consistent practice, and mock tests are key to success.`,
    careerPaths: ['Qualified Professional', 'Higher Education', 'Specialized Career'],
    jobDemand: 'High',
    prerequisites: ['Subject Knowledge', 'Dedication', 'Time Management'],
    estimatedTime: '3-12 months preparation',
    difficulty: 'Advanced',
    contentType: 'exam',
    tools: ['Study Material', 'Mock Test Platforms', 'Previous Year Papers', 'Online Coaching'],
    phases: [
      { id: 'syllabus-review', title: 'Syllabus & Strategy', duration: '2-3 weeks', description: 'Understand the complete syllabus, exam pattern, and create a study plan.', skills: ['Syllabus Analysis', 'Exam Pattern Understanding', 'Study Plan Creation', 'Resource Collection'], projects: ['Complete syllabus mapping', 'Create month-wise study schedule'] },
      { id: 'concept-building', title: 'Concept Building', duration: '8-12 weeks', description: 'Study each topic thoroughly using standard references and make detailed notes.', skills: ['Subject Mastery', 'Note Making', 'Concept Clarity', 'Formula Sheets'], projects: ['Complete all subjects with notes', 'Solve chapter-end questions'] },
      { id: 'practice', title: 'Problem Practice', duration: '6-8 weeks', description: 'Solve previous year questions, topic tests, and build speed and accuracy.', skills: ['Previous Year Questions', 'Topic Tests', 'Speed Building', 'Accuracy Improvement'], projects: ['Solve 15+ years PYQs', 'Take 20+ topic tests'] },
      { id: 'mock-revision', title: 'Mocks & Final Revision', duration: '4-6 weeks', description: 'Take full-length mock tests, analyze performance, and do final revision.', skills: ['Full Mock Tests', 'Performance Analysis', 'Weak Area Focus', 'Exam Day Strategy'], projects: ['Take 15+ full mocks', 'Quick revision of entire syllabus'] }
    ]
  };
}

function generateGenericNonTechRoadmap(skillName: string): SkillRoadmap {
  return {
    name: skillName,
    tagline: `Build expertise in ${skillName}`,
    description: `A structured learning path for ${skillName}. Develop foundational skills, build a portfolio, and explore career opportunities in this field.`,
    realWorldContext: `${skillName} professionals work across diverse settings - from freelancing to corporate roles. Building a strong portfolio and network is key to success.`,
    careerPaths: ['Specialist', 'Freelancer', 'Educator', 'Consultant', 'Creative Director'],
    jobDemand: 'Growing',
    prerequisites: ['Passion for the Field', 'Curiosity', 'Dedication to Practice'],
    estimatedTime: '6-12 months',
    difficulty: 'Beginner-Friendly',
    contentType: 'non-tech',
    tools: ['Online Courses', 'Practice Materials', 'Community Forums', 'Portfolio Platform'],
    nonTechInfo: {
      industryOverview: `The ${skillName} field offers diverse career paths from freelancing to corporate roles. Digital transformation is creating new opportunities.`,
      keySkillAreas: ['Foundational Knowledge', 'Practical Skills', 'Portfolio Development', 'Professional Networking'],
      portfolioTips: ['Document your learning journey', 'Build a portfolio website', 'Seek feedback from professionals', 'Enter competitions/contests'],
      freelanceOpportunities: 'Freelancing, consulting, teaching, content creation, and professional services',
      growthOutlook: 'Growing demand driven by digital transformation and increasing appreciation for specialized expertise'
    },
    phases: [
      { id: 'exploration', title: 'Exploration & Fundamentals', duration: '4-6 weeks', description: `Explore the landscape of ${skillName}, understand key concepts, and find your area of interest.`, skills: ['Core Principles', 'History & Context', 'Key Terminology', 'Resource Discovery'], projects: ['Create learning journal', 'Complete introductory course'] },
      { id: 'skill-building', title: 'Core Skill Development', duration: '8-12 weeks', description: 'Build proficiency through structured practice, mentorship, and project work.', skills: ['Technical Proficiency', 'Creative Expression', 'Critical Analysis', 'Peer Learning'], projects: ['Complete 5+ practice projects', 'Get feedback from mentor/community'] },
      { id: 'portfolio', title: 'Portfolio & Specialization', duration: '6-8 weeks', description: 'Develop a professional portfolio and begin specializing in your chosen niche.', skills: ['Portfolio Curation', 'Niche Development', 'Quality Standards', 'Self-Assessment'], projects: ['Build portfolio website', 'Create signature project'] },
      { id: 'professional', title: 'Professional Launch', duration: '4-6 weeks', description: 'Establish your professional presence, network with industry professionals, and pursue opportunities.', skills: ['Professional Networking', 'Personal Branding', 'Client/Employer Relations', 'Continuous Growth'], projects: ['Launch online presence', 'Apply to opportunities/clients'] }
    ]
  };
}
