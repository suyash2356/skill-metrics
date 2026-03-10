
-- Seed skill nodes for all domains
INSERT INTO skill_nodes (name, domain, subdomain, description, difficulty_level, estimated_hours, content_type, learning_outcomes, display_order) VALUES
-- ═══ TECH: Machine Learning Path ═══
('Math Basics', 'Machine Learning', 'Mathematics', 'Fundamental math concepts including calculus and probability', 'beginner', 20, 'tech', ARRAY['Understand derivatives and integrals', 'Basic probability theory', 'Set theory fundamentals'], 1),
('Linear Algebra', 'Machine Learning', 'Mathematics', 'Vectors, matrices, eigenvalues, and transformations', 'beginner', 30, 'tech', ARRAY['Matrix operations', 'Eigenvalue decomposition', 'Vector spaces'], 2),
('Statistics and Probability', 'Machine Learning', 'Mathematics', 'Statistical inference, distributions, hypothesis testing', 'intermediate', 40, 'tech', ARRAY['Bayesian thinking', 'Hypothesis testing', 'Distribution analysis'], 3),
('Python Programming', 'Machine Learning', 'Programming', 'Python for data science - NumPy, Pandas, Matplotlib', 'beginner', 40, 'tech', ARRAY['Python syntax mastery', 'Data manipulation with Pandas', 'Visualization with Matplotlib'], 4),
('Machine Learning Fundamentals', 'Machine Learning', 'Core ML', 'Supervised and unsupervised learning algorithms', 'intermediate', 60, 'tech', ARRAY['Regression and classification', 'Clustering algorithms', 'Model evaluation metrics'], 5),
('Deep Learning', 'Machine Learning', 'Neural Networks', 'Neural networks, CNNs, RNNs, Transformers', 'advanced', 80, 'tech', ARRAY['Neural network architecture', 'Backpropagation', 'Transfer learning'], 6),
('ML Projects', 'Machine Learning', 'Applied', 'End-to-end ML project development', 'advanced', 60, 'tech', ARRAY['End-to-end ML pipelines', 'Model deployment', 'Portfolio showcase'], 7),
-- ═══ TECH: Web Development Path ═══
('HTML and CSS', 'Web Development', 'Frontend', 'Semantic HTML and modern CSS including Flexbox/Grid', 'beginner', 20, 'tech', ARRAY['Semantic HTML structure', 'CSS Flexbox and Grid', 'Responsive design'], 1),
('JavaScript Fundamentals', 'Web Development', 'Frontend', 'Core JavaScript - ES6+, DOM manipulation, async', 'beginner', 40, 'tech', ARRAY['ES6+ features', 'DOM manipulation', 'Async programming'], 2),
('React Development', 'Web Development', 'Frontend', 'Component-based UI with React hooks and state management', 'intermediate', 50, 'tech', ARRAY['Component architecture', 'Hooks and state management', 'React ecosystem'], 3),
('Node.js Backend', 'Web Development', 'Backend', 'Server-side JavaScript, APIs, databases', 'intermediate', 50, 'tech', ARRAY['REST API design', 'Database integration', 'Authentication'], 4),
('Full Stack Projects', 'Web Development', 'Applied', 'Build and deploy complete web applications', 'advanced', 60, 'tech', ARRAY['Full stack architecture', 'CI/CD deployment', 'Production best practices'], 5),
-- ═══ TECH: Data Science ═══
('Data Analysis Basics', 'Data Science', 'Fundamentals', 'Data cleaning, EDA, and basic visualization', 'beginner', 30, 'tech', ARRAY['Data cleaning techniques', 'Exploratory data analysis', 'Statistical visualization'], 1),
('SQL and Databases', 'Data Science', 'Data Engineering', 'Relational databases, complex queries, optimization', 'beginner', 25, 'tech', ARRAY['Complex SQL queries', 'Database design', 'Query optimization'], 2),
('Data Visualization', 'Data Science', 'Visualization', 'Advanced visualization with tools and storytelling', 'intermediate', 20, 'tech', ARRAY['Dashboard creation', 'Data storytelling', 'Interactive visualizations'], 3),
('Statistical Modeling', 'Data Science', 'Statistics', 'Regression, time series, A/B testing', 'intermediate', 40, 'tech', ARRAY['Regression analysis', 'Time series forecasting', 'A/B test design'], 4),
-- ═══ TECH: Cybersecurity ═══
('Networking Fundamentals', 'Cybersecurity', 'Infrastructure', 'TCP/IP, DNS, firewalls, network protocols', 'beginner', 30, 'tech', ARRAY['TCP/IP stack', 'Network troubleshooting', 'Firewall configuration'], 1),
('Linux Administration', 'Cybersecurity', 'Systems', 'Linux command line, system administration', 'beginner', 25, 'tech', ARRAY['Linux CLI proficiency', 'User management', 'System hardening'], 2),
('Security Fundamentals', 'Cybersecurity', 'Core', 'CIA triad, threat modeling, security frameworks', 'intermediate', 30, 'tech', ARRAY['Security frameworks', 'Risk assessment', 'Compliance understanding'], 3),
('Ethical Hacking', 'Cybersecurity', 'Offensive', 'Penetration testing, vulnerability assessment', 'advanced', 50, 'tech', ARRAY['Penetration testing methodology', 'Vulnerability scanning', 'Exploit development'], 4),
-- ═══ TECH: Cloud Computing ═══
('Cloud Concepts', 'Cloud Computing', 'Fundamentals', 'IaaS, PaaS, SaaS, cloud architecture patterns', 'beginner', 15, 'tech', ARRAY['Cloud service models', 'Cloud architecture', 'Cost optimization'], 1),
('AWS Core Services', 'Cloud Computing', 'AWS', 'EC2, S3, Lambda, VPC, IAM', 'intermediate', 40, 'tech', ARRAY['AWS compute services', 'Storage solutions', 'IAM best practices'], 2),
('DevOps and CI/CD', 'Cloud Computing', 'DevOps', 'Docker, Kubernetes, CI/CD pipelines', 'intermediate', 40, 'tech', ARRAY['Container orchestration', 'CI/CD pipeline design', 'Infrastructure as code'], 3),
('Cloud Architecture', 'Cloud Computing', 'Architecture', 'Scalable, fault-tolerant system design', 'advanced', 50, 'tech', ARRAY['Microservices design', 'Scalability patterns', 'Disaster recovery'], 4),
-- ═══ EXAM: GATE ═══
('GATE Syllabus Mastery', 'GATE', 'Preparation', 'Complete GATE syllabus understanding and planning', 'beginner', 20, 'exam', ARRAY['Syllabus analysis', 'Study plan creation', 'Resource mapping'], 1),
('GATE Core Subjects', 'GATE', 'Subject Study', 'In-depth study of all GATE subjects', 'intermediate', 200, 'exam', ARRAY['Subject mastery', 'Concept clarity', 'Formula compilation'], 2),
('GATE Problem Practice', 'GATE', 'Practice', 'Previous year papers and topic-wise practice', 'advanced', 100, 'exam', ARRAY['Speed and accuracy', 'Problem-solving patterns', 'Time management'], 3),
('GATE Mock Tests', 'GATE', 'Testing', 'Full-length mock tests and performance analysis', 'advanced', 50, 'exam', ARRAY['Exam simulation', 'Performance analysis', 'Weak area identification'], 4),
-- ═══ EXAM: CAT ═══
('CAT Quantitative Aptitude', 'CAT', 'Quant', 'Number systems, algebra, geometry, arithmetic', 'intermediate', 80, 'exam', ARRAY['Quick calculation', 'Problem shortcuts', 'Geometry mastery'], 1),
('CAT Verbal Ability', 'CAT', 'Verbal', 'Reading comprehension, grammar, vocabulary', 'intermediate', 60, 'exam', ARRAY['RC speed reading', 'Grammar accuracy', 'Critical reasoning'], 2),
('CAT Data Interpretation', 'CAT', 'DILR', 'Data interpretation and logical reasoning', 'intermediate', 70, 'exam', ARRAY['Data analysis speed', 'Logical puzzles', 'Caselets'], 3),
('CAT Mock Strategy', 'CAT', 'Strategy', 'Time management, attempt strategy, mock analysis', 'advanced', 40, 'exam', ARRAY['Optimal attempt strategy', 'Time allocation', 'Score maximization'], 4),
-- ═══ EXAM: GRE ═══
('GRE Vocabulary', 'GRE', 'Verbal', 'High-frequency GRE words and usage', 'beginner', 40, 'exam', ARRAY['1000+ GRE words', 'Context-based usage', 'Synonym mastery'], 1),
('GRE Quantitative', 'GRE', 'Quant', 'GRE math concepts and problem solving', 'intermediate', 50, 'exam', ARRAY['Algebra and geometry', 'Data analysis', 'Word problems'], 2),
('GRE Analytical Writing', 'GRE', 'AWA', 'Issue and argument essay writing', 'intermediate', 30, 'exam', ARRAY['Essay structure', 'Critical analysis', 'Persuasive writing'], 3),
-- ═══ EXAM: JEE ═══
('JEE Physics', 'JEE', 'Physics', 'Mechanics, electrodynamics, optics, modern physics', 'intermediate', 100, 'exam', ARRAY['Problem solving speed', 'Conceptual clarity', 'Numerical accuracy'], 1),
('JEE Chemistry', 'JEE', 'Chemistry', 'Physical, organic, and inorganic chemistry', 'intermediate', 80, 'exam', ARRAY['Organic reaction mechanisms', 'Physical chemistry calculations', 'Inorganic memory techniques'], 2),
('JEE Mathematics', 'JEE', 'Mathematics', 'Calculus, algebra, coordinate geometry, trigonometry', 'intermediate', 100, 'exam', ARRAY['Calculus mastery', 'Algebra shortcuts', 'Coordinate geometry'], 3),
-- ═══ EXAM: NEET ═══
('NEET Biology', 'NEET', 'Biology', 'Botany and zoology for NEET', 'intermediate', 120, 'exam', ARRAY['NCERT mastery', 'Diagram-based questions', 'Assertion-reason'], 1),
('NEET Physics', 'NEET', 'Physics', 'Mechanics, thermodynamics, optics for NEET', 'intermediate', 80, 'exam', ARRAY['Conceptual physics', 'Formula application', 'Numericals'], 2),
('NEET Chemistry', 'NEET', 'Chemistry', 'Physical, organic, inorganic for NEET', 'intermediate', 70, 'exam', ARRAY['Organic reactions', 'Periodic table trends', 'Equilibrium problems'], 3),
-- ═══ NON-TECH: Finance ═══
('Financial Literacy', 'Finance', 'Personal', 'Budgeting, saving, basic investing concepts', 'beginner', 15, 'non-tech', ARRAY['Budget creation', 'Emergency fund planning', 'Compound interest'], 1),
('Investment Fundamentals', 'Finance', 'Investing', 'Stocks, bonds, mutual funds, ETFs', 'intermediate', 30, 'non-tech', ARRAY['Asset classes', 'Portfolio theory', 'Risk management'], 2),
('Financial Analysis', 'Finance', 'Corporate', 'Financial statements, ratios, valuation', 'intermediate', 40, 'non-tech', ARRAY['Balance sheet analysis', 'DCF valuation', 'Financial ratios'], 3),
('Advanced Finance', 'Finance', 'Markets', 'Derivatives, portfolio management, fintech', 'advanced', 50, 'non-tech', ARRAY['Options pricing', 'Hedge strategies', 'Algorithmic trading basics'], 4),
-- ═══ NON-TECH: Fine Arts ═══
('Art History and Theory', 'Fine Arts', 'Theory', 'Major art movements, criticism, aesthetics', 'beginner', 20, 'non-tech', ARRAY['Art movement knowledge', 'Critical analysis', 'Aesthetic theory'], 1),
('Drawing Fundamentals', 'Fine Arts', 'Practice', 'Line, form, perspective, shading techniques', 'beginner', 30, 'non-tech', ARRAY['Perspective drawing', 'Shading techniques', 'Proportion and anatomy'], 2),
('Color Theory and Painting', 'Fine Arts', 'Practice', 'Color mixing, composition, painting media', 'intermediate', 40, 'non-tech', ARRAY['Color harmony', 'Composition rules', 'Mixed media techniques'], 3),
('Art Portfolio Development', 'Fine Arts', 'Professional', 'Curating work, exhibition, artist statement', 'advanced', 20, 'non-tech', ARRAY['Portfolio curation', 'Artist branding', 'Exhibition skills'], 4),
-- ═══ NON-TECH: Music ═══
('Music Theory Basics', 'Music', 'Theory', 'Notes, scales, rhythm, time signatures', 'beginner', 20, 'non-tech', ARRAY['Scale construction', 'Rhythm reading', 'Key signatures'], 1),
('Instrument Practice', 'Music', 'Performance', 'Technique development, repertoire building', 'intermediate', 60, 'non-tech', ARRAY['Technical proficiency', 'Repertoire breadth', 'Sight reading'], 2),
('Music Composition', 'Music', 'Creative', 'Harmony, arrangement, songwriting', 'intermediate', 40, 'non-tech', ARRAY['Chord progressions', 'Arrangement techniques', 'Songwriting structure'], 3),
('Music Production', 'Music', 'Technology', 'DAWs, mixing, mastering, sound design', 'advanced', 50, 'non-tech', ARRAY['DAW proficiency', 'Mixing fundamentals', 'Mastering workflow'], 4),
-- ═══ NON-TECH: Photography ═══
('Camera Basics', 'Photography', 'Technical', 'Exposure triangle, camera modes, lens types', 'beginner', 10, 'non-tech', ARRAY['Manual exposure control', 'Lens selection', 'Camera settings'], 1),
('Composition and Lighting', 'Photography', 'Artistic', 'Rule of thirds, leading lines, lighting', 'intermediate', 20, 'non-tech', ARRAY['Composition techniques', 'Light manipulation', 'Visual storytelling'], 2),
('Post-Processing', 'Photography', 'Editing', 'Lightroom, Photoshop, color grading', 'intermediate', 25, 'non-tech', ARRAY['RAW processing', 'Color grading', 'Retouching techniques'], 3),
('Professional Photography', 'Photography', 'Business', 'Portfolio, client work, business operations', 'advanced', 20, 'non-tech', ARRAY['Client management', 'Pricing strategy', 'Portfolio curation'], 4),
-- ═══ NON-TECH: Graphic Design ═══
('Design Principles', 'Graphic Design', 'Fundamentals', 'Balance, contrast, hierarchy, typography basics', 'beginner', 15, 'non-tech', ARRAY['Visual hierarchy', 'Typography pairing', 'Layout principles'], 1),
('Digital Design Tools', 'Graphic Design', 'Tools', 'Figma, Adobe Illustrator, Photoshop', 'intermediate', 40, 'non-tech', ARRAY['Vector illustration', 'Photo manipulation', 'UI design'], 2),
('Brand and Identity Design', 'Graphic Design', 'Specialization', 'Logo design, brand systems, style guides', 'advanced', 30, 'non-tech', ARRAY['Brand strategy', 'Logo construction', 'Design systems'], 3)
ON CONFLICT (name) DO NOTHING;

-- Now insert skill dependencies (prerequisite relationships)
-- ML Path: Math → Linear Algebra → Stats → ML → Deep Learning
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Linear Algebra' AND p.name = 'Math Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Statistics and Probability' AND p.name = 'Linear Algebra'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Machine Learning Fundamentals' AND p.name = 'Statistics and Probability'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Machine Learning Fundamentals' AND p.name = 'Python Programming'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Deep Learning' AND p.name = 'Machine Learning Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'ML Projects' AND p.name = 'Deep Learning'
ON CONFLICT DO NOTHING;

-- Web Dev Path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'JavaScript Fundamentals' AND p.name = 'HTML and CSS'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'React Development' AND p.name = 'JavaScript Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Node.js Backend' AND p.name = 'JavaScript Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Full Stack Projects' AND p.name = 'React Development'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Full Stack Projects' AND p.name = 'Node.js Backend'
ON CONFLICT DO NOTHING;

-- Data Science Path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Data Visualization' AND p.name = 'Data Analysis Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Statistical Modeling' AND p.name = 'Data Analysis Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'recommended' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Statistical Modeling' AND p.name = 'SQL and Databases'
ON CONFLICT DO NOTHING;

-- Cybersecurity Path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Security Fundamentals' AND p.name = 'Networking Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Security Fundamentals' AND p.name = 'Linux Administration'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Ethical Hacking' AND p.name = 'Security Fundamentals'
ON CONFLICT DO NOTHING;

-- Cloud Path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'AWS Core Services' AND p.name = 'Cloud Concepts'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'DevOps and CI/CD' AND p.name = 'AWS Core Services'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Cloud Architecture' AND p.name = 'DevOps and CI/CD'
ON CONFLICT DO NOTHING;

-- GATE exam sequential
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'GATE Core Subjects' AND p.name = 'GATE Syllabus Mastery'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'GATE Problem Practice' AND p.name = 'GATE Core Subjects'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'GATE Mock Tests' AND p.name = 'GATE Problem Practice'
ON CONFLICT DO NOTHING;

-- CAT exam: all sections feed into mock strategy
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'CAT Mock Strategy' AND p.name = 'CAT Quantitative Aptitude'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'CAT Mock Strategy' AND p.name = 'CAT Verbal Ability'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'CAT Mock Strategy' AND p.name = 'CAT Data Interpretation'
ON CONFLICT DO NOTHING;

-- Finance path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Investment Fundamentals' AND p.name = 'Financial Literacy'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Financial Analysis' AND p.name = 'Investment Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Advanced Finance' AND p.name = 'Financial Analysis'
ON CONFLICT DO NOTHING;

-- Fine Arts path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Color Theory and Painting' AND p.name = 'Drawing Fundamentals'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'recommended' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Color Theory and Painting' AND p.name = 'Art History and Theory'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Art Portfolio Development' AND p.name = 'Color Theory and Painting'
ON CONFLICT DO NOTHING;

-- Music path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Instrument Practice' AND p.name = 'Music Theory Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Music Composition' AND p.name = 'Music Theory Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'recommended' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Music Production' AND p.name = 'Music Composition'
ON CONFLICT DO NOTHING;

-- Photography path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Composition and Lighting' AND p.name = 'Camera Basics'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'recommended' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Post-Processing' AND p.name = 'Composition and Lighting'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Professional Photography' AND p.name = 'Post-Processing'
ON CONFLICT DO NOTHING;

-- Graphic Design path
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Digital Design Tools' AND p.name = 'Design Principles'
ON CONFLICT DO NOTHING;
INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
SELECT s.id, p.id, 'required' FROM skill_nodes s, skill_nodes p WHERE s.name = 'Brand and Identity Design' AND p.name = 'Digital Design Tools'
ON CONFLICT DO NOTHING;
