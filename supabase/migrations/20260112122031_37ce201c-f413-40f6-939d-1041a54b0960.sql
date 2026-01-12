-- Add sample data for Explore page tabs: Popular Exams, Degrees, Certifications, Learning Paths

-- ==================== POPULAR EXAMS ====================
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, is_active, is_featured, icon, color, provider, rating, duration, resource_type, section_type, related_skills, relevant_backgrounds, education_levels, target_countries)
VALUES
-- GATE Exam
('GATE Computer Science', 'Graduate Aptitude Test in Engineering for CS/IT. Premier exam for M.Tech admissions and PSU jobs in India.', 'https://gate.iitk.ac.in/', 'GATE', 'advanced', false, true, true, 'GraduationCap', 'from-blue-500 to-indigo-600', 'IIT', 4.8, '6 months prep', 'exam_prep', 'exam', ARRAY['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'], ARRAY['Engineering', 'Computer Science'], ARRAY['undergraduate', 'graduate'], ARRAY['India']),

-- CAT Exam
('CAT MBA Entrance', 'Common Admission Test for IIMs and top B-schools. Tests quantitative, verbal, and logical reasoning.', 'https://iimcat.ac.in/', 'CAT', 'advanced', false, true, true, 'GraduationCap', 'from-purple-500 to-pink-600', 'IIM', 4.9, '8-12 months prep', 'exam_prep', 'exam', ARRAY['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Data Interpretation'], ARRAY['Any Graduate'], ARRAY['undergraduate', 'graduate'], ARRAY['India']),

-- GRE
('GRE Graduate Exam', 'Graduate Record Examination for MS/PhD admissions worldwide. Tests verbal, quantitative, and analytical writing.', 'https://www.ets.org/gre', 'GRE', 'intermediate', false, true, true, 'GraduationCap', 'from-green-500 to-teal-600', 'ETS', 4.7, '3-6 months prep', 'exam_prep', 'exam', ARRAY['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'], ARRAY['Any Graduate'], ARRAY['undergraduate', 'graduate'], ARRAY['USA', 'Canada', 'UK', 'Australia', 'India']),

-- UPSC
('UPSC Civil Services', 'Union Public Service Commission exam for IAS, IPS, IFS officers. India''s toughest competitive exam.', 'https://upsc.gov.in/', 'UPSC', 'expert', false, true, true, 'Award', 'from-orange-500 to-red-600', 'UPSC', 4.9, '12-24 months prep', 'exam_prep', 'exam', ARRAY['General Studies', 'Current Affairs', 'Essay Writing', 'Ethics'], ARRAY['Any Graduate'], ARRAY['undergraduate', 'graduate'], ARRAY['India']),

-- AWS Certification
('AWS Solutions Architect', 'Amazon Web Services certification for cloud architects. Industry-recognized cloud credential.', 'https://aws.amazon.com/certification/', 'AWS', 'intermediate', false, true, true, 'Cloud', 'from-yellow-500 to-orange-500', 'Amazon', 4.8, '2-3 months prep', 'exam_prep', 'exam', ARRAY['Cloud Computing', 'AWS', 'Networking', 'Security'], ARRAY['IT Professional', 'Developer'], ARRAY['undergraduate', 'graduate', 'professional'], ARRAY['Global']),

-- CompTIA Security+
('CompTIA Security+', 'Entry-level cybersecurity certification. Validates baseline security skills and knowledge.', 'https://www.comptia.org/certifications/security', 'CompTIA', 'beginner', false, true, true, 'Shield', 'from-red-500 to-pink-600', 'CompTIA', 4.6, '2-3 months prep', 'exam_prep', 'exam', ARRAY['Cybersecurity', 'Network Security', 'Risk Management'], ARRAY['IT Professional'], ARRAY['high_school', 'undergraduate'], ARRAY['Global']);

-- ==================== DEGREES ====================
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, is_active, is_featured, icon, color, provider, rating, duration, resource_type, section_type, related_skills, relevant_backgrounds, education_levels)
VALUES
-- Online Degrees
('B.Tech Computer Science - IIT Madras', 'India''s first online B.Tech in Data Science and Programming from IIT Madras. Fully online degree program.', 'https://onlinedegree.iitm.ac.in/', 'Computer Science', 'intermediate', false, true, true, 'GraduationCap', 'from-blue-600 to-indigo-700', 'IIT Madras', 4.9, '4 years (online)', 'degree', 'domain', ARRAY['Python', 'Machine Learning', 'Data Science', 'Statistics'], ARRAY['High School Graduate'], ARRAY['high_school']),

('MS Computer Science - Georgia Tech', 'Online Master''s in Computer Science (OMSCS) from Georgia Tech. Affordable and prestigious online masters.', 'https://omscs.gatech.edu/', 'Computer Science', 'advanced', false, true, true, 'GraduationCap', 'from-yellow-500 to-orange-600', 'Georgia Tech', 4.8, '2-3 years (online)', 'degree', 'domain', ARRAY['Algorithms', 'Machine Learning', 'Computer Systems'], ARRAY['CS Graduate'], ARRAY['undergraduate', 'graduate']),

('MBA - IIM Bangalore', 'Executive MBA program from IIM Bangalore. For working professionals seeking management education.', 'https://www.iimb.ac.in/', 'Business Administration', 'advanced', false, true, true, 'Award', 'from-purple-600 to-pink-600', 'IIM Bangalore', 4.9, '2 years', 'degree', 'domain', ARRAY['Management', 'Finance', 'Marketing', 'Strategy'], ARRAY['Any Graduate with Experience'], ARRAY['graduate', 'professional']),

('B.Sc Data Science - BITS Pilani', 'Online Bachelor''s in Data Science from BITS Pilani. Flexible online learning with industry-aligned curriculum.', 'https://www.bits-pilani.ac.in/', 'Data Science', 'intermediate', false, true, true, 'Database', 'from-cyan-500 to-blue-600', 'BITS Pilani', 4.7, '3-4 years (online)', 'degree', 'domain', ARRAY['Python', 'Statistics', 'Machine Learning', 'SQL'], ARRAY['High School Graduate'], ARRAY['high_school']),

('MCA - IGNOU', 'Master of Computer Applications from IGNOU. Affordable distance learning program for CS aspirants.', 'https://www.ignou.ac.in/', 'Computer Applications', 'intermediate', false, true, true, 'Laptop', 'from-green-500 to-teal-600', 'IGNOU', 4.3, '2-3 years (distance)', 'degree', 'domain', ARRAY['Programming', 'Database', 'Web Development'], ARRAY['BCA Graduate'], ARRAY['undergraduate']),

('MS Artificial Intelligence - Stanford', 'Stanford''s graduate program in AI. World-renowned AI research and education.', 'https://ai.stanford.edu/', 'Artificial Intelligence', 'expert', false, true, true, 'Brain', 'from-red-500 to-orange-600', 'Stanford University', 5.0, '2 years', 'degree', 'domain', ARRAY['Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning'], ARRAY['CS Graduate'], ARRAY['graduate']);

-- ==================== CERTIFICATIONS ====================
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, is_active, is_featured, icon, color, provider, rating, duration, resource_type, section_type, related_skills, relevant_backgrounds, education_levels, estimated_time)
VALUES
('Google Cloud Professional', 'Google Cloud Platform certification for cloud engineers. Validates GCP architecture and engineering skills.', 'https://cloud.google.com/certification', 'Cloud Computing', 'intermediate', false, true, true, 'Cloud', 'from-blue-500 to-cyan-500', 'Google', 4.7, '3-4 months prep', 'certification', 'domain', ARRAY['GCP', 'Cloud Architecture', 'Kubernetes', 'BigQuery'], ARRAY['IT Professional', 'Developer'], ARRAY['undergraduate', 'graduate'], '100 hours'),

('Microsoft Azure Administrator', 'Azure certification for IT professionals. Validates cloud administration and management skills.', 'https://learn.microsoft.com/certifications/', 'Cloud Computing', 'intermediate', false, true, true, 'Cloud', 'from-blue-600 to-indigo-600', 'Microsoft', 4.6, '2-3 months prep', 'certification', 'domain', ARRAY['Azure', 'Cloud Computing', 'PowerShell', 'Networking'], ARRAY['IT Professional'], ARRAY['undergraduate', 'graduate'], '80 hours'),

('Certified Kubernetes Administrator', 'CNCF certification for Kubernetes administrators. Industry-standard container orchestration credential.', 'https://www.cncf.io/certification/cka/', 'DevOps', 'advanced', false, true, true, 'Layers', 'from-purple-500 to-indigo-600', 'CNCF', 4.8, '2-3 months prep', 'certification', 'domain', ARRAY['Kubernetes', 'Docker', 'Linux', 'Networking'], ARRAY['DevOps Engineer', 'SRE'], ARRAY['undergraduate', 'graduate'], '120 hours'),

('Meta Front-End Developer', 'Professional certificate from Meta. Covers React, JavaScript, and modern frontend development.', 'https://www.coursera.org/professional-certificates/meta-front-end-developer', 'Web Development', 'beginner', false, true, true, 'Code', 'from-blue-500 to-indigo-500', 'Meta', 4.7, '7 months', 'certification', 'domain', ARRAY['React', 'JavaScript', 'HTML', 'CSS', 'Git'], ARRAY['Beginner', 'Career Changer'], ARRAY['high_school', 'undergraduate'], '200 hours'),

('Google Data Analytics', 'Entry-level data analytics certification by Google. Perfect for career changers into data field.', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Data Science', 'beginner', false, true, true, 'Database', 'from-green-500 to-teal-500', 'Google', 4.8, '6 months', 'certification', 'domain', ARRAY['SQL', 'Excel', 'Tableau', 'R', 'Data Visualization'], ARRAY['Beginner', 'Career Changer'], ARRAY['high_school', 'undergraduate'], '180 hours'),

('IBM AI Engineering', 'Professional certificate in AI and Machine Learning from IBM. Hands-on projects with real-world datasets.', 'https://www.coursera.org/professional-certificates/ai-engineer', 'Artificial Intelligence', 'intermediate', false, true, true, 'Brain', 'from-blue-600 to-purple-600', 'IBM', 4.6, '8 months', 'certification', 'domain', ARRAY['Python', 'TensorFlow', 'Keras', 'Deep Learning', 'Neural Networks'], ARRAY['Developer', 'Data Scientist'], ARRAY['undergraduate', 'graduate'], '240 hours'),

('PMP Project Management', 'Project Management Professional certification. Gold standard for project managers worldwide.', 'https://www.pmi.org/certifications/project-management-pmp', 'Management', 'advanced', false, true, true, 'Award', 'from-orange-500 to-red-500', 'PMI', 4.9, '3-6 months prep', 'certification', 'domain', ARRAY['Project Management', 'Agile', 'Scrum', 'Risk Management'], ARRAY['Project Manager', 'Team Lead'], ARRAY['graduate', 'professional'], '150 hours'),

('Cisco CCNA', 'Networking fundamentals certification from Cisco. Entry point for network engineering careers.', 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html', 'Networking', 'beginner', false, true, true, 'Globe', 'from-teal-500 to-cyan-600', 'Cisco', 4.7, '3-4 months prep', 'certification', 'domain', ARRAY['Networking', 'TCP/IP', 'Routing', 'Switching', 'Security'], ARRAY['IT Student', 'Network Admin'], ARRAY['high_school', 'undergraduate'], '120 hours');

-- ==================== LEARNING PATHS ====================
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, is_active, is_featured, icon, color, provider, rating, duration, resource_type, section_type, related_skills, relevant_backgrounds, education_levels, prerequisites, estimated_time)
VALUES
('Full-Stack Web Developer', 'Complete path from HTML basics to deploying full-stack applications. Covers frontend, backend, and databases.', 'https://roadmap.sh/full-stack', 'Web Development', 'intermediate', true, true, true, 'Laptop', 'from-pink-500 to-rose-500', 'Roadmap.sh', 4.8, '6-9 months', 'learning_path', 'domain', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB'], ARRAY['Beginner', 'Career Changer'], ARRAY['high_school', 'undergraduate'], ARRAY['Basic computer knowledge'], '500 hours'),

('Data Scientist', 'Comprehensive data science learning path. From Python basics to machine learning and deep learning.', 'https://roadmap.sh/data-science', 'Data Science', 'intermediate', true, true, true, 'Database', 'from-blue-500 to-cyan-500', 'Roadmap.sh', 4.9, '8-12 months', 'learning_path', 'domain', ARRAY['Python', 'Statistics', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'], ARRAY['Any Graduate', 'Career Changer'], ARRAY['undergraduate', 'graduate'], ARRAY['Basic math', 'Basic programming'], '600 hours'),

('AI/ML Engineer', 'Advanced path to become an AI/ML Engineer. Covers deep learning, NLP, computer vision, and MLOps.', 'https://roadmap.sh/ai-engineer', 'Artificial Intelligence', 'advanced', true, true, true, 'Brain', 'from-purple-500 to-indigo-500', 'Roadmap.sh', 4.8, '12-18 months', 'learning_path', 'domain', ARRAY['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps'], ARRAY['Developer', 'Data Scientist'], ARRAY['graduate'], ARRAY['Python', 'Linear Algebra', 'Calculus', 'Probability'], '800 hours'),

('Cloud DevOps Engineer', 'Path to become a DevOps engineer with cloud expertise. Covers CI/CD, containers, and infrastructure as code.', 'https://roadmap.sh/devops', 'DevOps', 'intermediate', true, true, true, 'Cloud', 'from-sky-500 to-indigo-500', 'Roadmap.sh', 4.7, '6-9 months', 'learning_path', 'domain', ARRAY['Linux', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Git'], ARRAY['Developer', 'SysAdmin'], ARRAY['undergraduate', 'graduate'], ARRAY['Linux basics', 'Programming fundamentals'], '450 hours'),

('Cybersecurity Analyst', 'Comprehensive cybersecurity learning path. From security fundamentals to penetration testing and incident response.', 'https://roadmap.sh/cyber-security', 'Cybersecurity', 'intermediate', true, true, true, 'Shield', 'from-red-500 to-orange-500', 'Roadmap.sh', 4.6, '8-12 months', 'learning_path', 'domain', ARRAY['Network Security', 'Ethical Hacking', 'SIEM', 'Cryptography', 'Incident Response'], ARRAY['IT Professional', 'Network Admin'], ARRAY['undergraduate', 'graduate'], ARRAY['Networking basics', 'Linux'], '550 hours'),

('UI/UX Designer', 'Complete UI/UX design learning path. From design principles to prototyping and user research.', 'https://roadmap.sh/ux-design', 'Design', 'beginner', true, true, true, 'PenTool', 'from-indigo-600 to-purple-600', 'Roadmap.sh', 4.7, '4-6 months', 'learning_path', 'domain', ARRAY['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'], ARRAY['Beginner', 'Graphic Designer', 'Career Changer'], ARRAY['high_school', 'undergraduate'], ARRAY['Basic design sense'], '350 hours'),

('Backend Developer', 'Path to becoming a backend developer. Covers server-side programming, APIs, databases, and system design.', 'https://roadmap.sh/backend', 'Web Development', 'intermediate', true, true, true, 'Code', 'from-green-500 to-emerald-500', 'Roadmap.sh', 4.8, '6-9 months', 'learning_path', 'domain', ARRAY['Node.js', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'REST APIs', 'GraphQL'], ARRAY['Frontend Developer', 'Beginner'], ARRAY['undergraduate', 'graduate'], ARRAY['Basic programming'], '480 hours'),

('Mobile App Developer', 'Learn to build mobile apps for iOS and Android. Covers React Native and Flutter for cross-platform development.', 'https://roadmap.sh/react-native', 'Mobile Development', 'intermediate', true, true, true, 'Rocket', 'from-cyan-500 to-blue-500', 'Roadmap.sh', 4.6, '5-7 months', 'learning_path', 'domain', ARRAY['React Native', 'Flutter', 'JavaScript', 'TypeScript', 'Mobile UI'], ARRAY['Web Developer', 'Beginner'], ARRAY['undergraduate', 'graduate'], ARRAY['JavaScript basics'], '400 hours');

-- ==================== TRENDING RESOURCES (Featured) ====================
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, is_active, is_featured, icon, color, provider, rating, resource_type, section_type, related_skills)
VALUES
('FreeCodeCamp', 'Free coding bootcamp with certifications. Comprehensive curriculum covering web development, data science, and more.', 'https://www.freecodecamp.org/', 'Web Development', 'beginner', true, true, true, 'Code', 'from-green-500 to-emerald-500', 'FreeCodeCamp', 4.9, 'course', 'domain', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']),

('LeetCode', 'Practice coding problems and prepare for technical interviews. Used by top tech companies for hiring.', 'https://leetcode.com/', 'Programming', 'intermediate', false, true, true, 'Brain', 'from-orange-500 to-yellow-500', 'LeetCode', 4.8, 'practice', 'domain', ARRAY['Data Structures', 'Algorithms', 'System Design']),

('Kaggle', 'Data science competitions and datasets. Learn ML through hands-on projects and community.', 'https://www.kaggle.com/', 'Data Science', 'intermediate', true, true, true, 'Database', 'from-blue-500 to-cyan-500', 'Google', 4.8, 'practice', 'domain', ARRAY['Python', 'Machine Learning', 'Data Analysis']),

('The Odin Project', 'Free full-stack curriculum. Project-based learning for web development.', 'https://www.theodinproject.com/', 'Web Development', 'beginner', true, true, true, 'Laptop', 'from-indigo-500 to-purple-500', 'The Odin Project', 4.7, 'course', 'domain', ARRAY['HTML', 'CSS', 'JavaScript', 'Ruby', 'React']),

('CS50 Harvard', 'Harvard''s intro to computer science. World-famous CS course available free online.', 'https://cs50.harvard.edu/', 'Computer Science', 'beginner', true, true, true, 'GraduationCap', 'from-red-500 to-pink-500', 'Harvard', 4.9, 'course', 'domain', ARRAY['C', 'Python', 'SQL', 'Algorithms']),

('Coursera', 'Online courses from top universities. Offers degrees, certificates, and free courses.', 'https://www.coursera.org/', 'General', 'beginner', false, true, true, 'BookOpen', 'from-blue-600 to-indigo-600', 'Coursera', 4.7, 'platform', 'domain', ARRAY['Various']),

('Udemy', 'Affordable online courses on any topic. Frequent sales with courses under $20.', 'https://www.udemy.com/', 'General', 'beginner', false, true, true, 'BookOpen', 'from-purple-500 to-pink-500', 'Udemy', 4.5, 'platform', 'domain', ARRAY['Various']),

('GitHub', 'World''s largest code hosting platform. Essential for version control and collaboration.', 'https://github.com/', 'Development', 'beginner', true, true, true, 'Code', 'from-gray-700 to-gray-900', 'Microsoft', 4.9, 'tool', 'domain', ARRAY['Git', 'Version Control', 'Collaboration']);