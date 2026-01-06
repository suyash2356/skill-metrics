-- First, clear existing resources to add fresh comprehensive data
DELETE FROM public.resources;

-- Insert comprehensive resources organized by domain/category
-- Each category has: courses, books, youtube channels, websites, communities

-- ============= AI/ML Resources =============
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, provider, rating, related_skills, icon, color, is_featured, is_active) VALUES
-- AI/ML Courses
('Machine Learning Specialization', 'The definitive ML course by Andrew Ng. Covers supervised/unsupervised learning, neural networks, and best practices.', 'https://www.coursera.org/specializations/machine-learning-introduction', 'AI/ML', 'beginner', false, 'Coursera - Stanford', 4.9, ARRAY['Python', 'Machine Learning', 'Neural Networks', 'TensorFlow'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
('Fast.ai Practical Deep Learning', 'Top-down approach to deep learning. Build real models from day one using PyTorch.', 'https://course.fast.ai/', 'AI/ML', 'intermediate', true, 'Fast.ai', 4.9, ARRAY['PyTorch', 'Deep Learning', 'Computer Vision', 'NLP'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
('Google ML Crash Course', 'Fast-paced intro to ML with TensorFlow. Includes exercises and real-world case studies.', 'https://developers.google.com/machine-learning/crash-course', 'AI/ML', 'beginner', true, 'Google', 4.7, ARRAY['TensorFlow', 'Machine Learning', 'Python'], 'Brain', 'from-purple-500 to-indigo-600', false, true),
('Deep Learning Specialization', 'Master deep learning fundamentals and build neural networks with Andrew Ng.', 'https://www.coursera.org/specializations/deep-learning', 'AI/ML', 'intermediate', false, 'Coursera - DeepLearning.AI', 4.9, ARRAY['Deep Learning', 'Neural Networks', 'TensorFlow', 'Keras'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
-- AI/ML Books
('Hands-On Machine Learning with Scikit-Learn and TensorFlow', 'The most practical ML book covering end-to-end projects with code.', 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/', 'AI/ML', 'intermediate', false, 'O''Reilly - Aurélien Géron', 4.9, ARRAY['Scikit-Learn', 'TensorFlow', 'Keras', 'Python'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
('Neural Networks and Deep Learning', 'Free online book explaining neural networks intuitively with interactive visualizations.', 'http://neuralnetworksanddeeplearning.com/', 'AI/ML', 'beginner', true, 'Michael Nielsen', 4.8, ARRAY['Neural Networks', 'Deep Learning', 'Mathematics'], 'Brain', 'from-purple-500 to-indigo-600', false, true),
-- AI/ML YouTube
('3Blue1Brown Neural Networks', 'Stunning visual explanations of neural networks and deep learning fundamentals.', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', 'AI/ML', 'beginner', true, 'YouTube - 3Blue1Brown', 5.0, ARRAY['Neural Networks', 'Mathematics', 'Deep Learning'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
('StatQuest ML Explained', 'Statistics and ML concepts explained clearly with humor. Essential for understanding fundamentals.', 'https://www.youtube.com/c/joshstarmer', 'AI/ML', 'beginner', true, 'YouTube - StatQuest', 4.9, ARRAY['Statistics', 'Machine Learning', 'Data Science'], 'Brain', 'from-purple-500 to-indigo-600', false, true),
-- AI/ML Websites
('Kaggle', 'Data science competitions, datasets, notebooks, and courses. Learn by doing.', 'https://www.kaggle.com/', 'AI/ML', 'intermediate', true, 'Kaggle', 4.8, ARRAY['Machine Learning', 'Data Science', 'Python', 'Competitions'], 'Brain', 'from-purple-500 to-indigo-600', true, true),
('Papers With Code', 'Machine learning papers with code implementations and benchmarks.', 'https://paperswithcode.com/', 'AI/ML', 'advanced', true, 'Papers With Code', 4.7, ARRAY['Research', 'Deep Learning', 'State-of-the-Art'], 'Brain', 'from-purple-500 to-indigo-600', false, true),

-- ============= Data Science Resources =============
('Google Data Analytics Certificate', 'Comprehensive data analytics professional certificate by Google.', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Data Science', 'beginner', false, 'Coursera - Google', 4.8, ARRAY['SQL', 'Tableau', 'R', 'Data Analysis'], 'Database', 'from-blue-500 to-cyan-500', true, true),
('IBM Data Science Professional', 'Learn data science from scratch with Python, SQL, and machine learning.', 'https://www.coursera.org/professional-certificates/ibm-data-science', 'Data Science', 'beginner', false, 'Coursera - IBM', 4.6, ARRAY['Python', 'SQL', 'Machine Learning', 'Data Visualization'], 'Database', 'from-blue-500 to-cyan-500', true, true),
('Python for Data Science Handbook', 'Essential tools for working with data in Python - NumPy, Pandas, Matplotlib.', 'https://jakevdp.github.io/PythonDataScienceHandbook/', 'Data Science', 'intermediate', true, 'Jake VanderPlas', 4.8, ARRAY['Python', 'NumPy', 'Pandas', 'Matplotlib'], 'Database', 'from-blue-500 to-cyan-500', false, true),
('DataCamp', 'Interactive data science courses with hands-on coding exercises.', 'https://www.datacamp.com/', 'Data Science', 'beginner', false, 'DataCamp', 4.5, ARRAY['Python', 'R', 'SQL', 'Data Analysis'], 'Database', 'from-blue-500 to-cyan-500', false, true),
('Mode SQL Tutorial', 'Free comprehensive SQL tutorial for data analysis.', 'https://mode.com/sql-tutorial/', 'Data Science', 'beginner', true, 'Mode Analytics', 4.7, ARRAY['SQL', 'Data Analysis', 'Databases'], 'Database', 'from-blue-500 to-cyan-500', false, true),
('Towards Data Science', 'Medium publication with thousands of data science articles and tutorials.', 'https://towardsdatascience.com/', 'Data Science', 'intermediate', true, 'Medium', 4.6, ARRAY['Data Science', 'Machine Learning', 'Python'], 'Database', 'from-blue-500 to-cyan-500', false, true),

-- ============= Web Development Resources =============
('The Odin Project', 'Full-stack curriculum that is completely free and open source.', 'https://www.theodinproject.com/', 'Web Development', 'beginner', true, 'The Odin Project', 4.9, ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], 'Globe', 'from-orange-500 to-red-500', true, true),
('freeCodeCamp', 'Learn to code for free with interactive challenges and projects.', 'https://www.freecodecamp.org/', 'Web Development', 'beginner', true, 'freeCodeCamp', 4.8, ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], 'Globe', 'from-orange-500 to-red-500', true, true),
('Full Stack Open', 'Deep dive into modern web development with React, Node.js, and GraphQL.', 'https://fullstackopen.com/', 'Web Development', 'intermediate', true, 'University of Helsinki', 4.9, ARRAY['React', 'Node.js', 'GraphQL', 'TypeScript'], 'Globe', 'from-orange-500 to-red-500', true, true),
('JavaScript.info', 'The modern JavaScript tutorial - from basics to advanced topics.', 'https://javascript.info/', 'Web Development', 'beginner', true, 'JavaScript.info', 4.8, ARRAY['JavaScript', 'DOM', 'Async Programming'], 'Globe', 'from-orange-500 to-red-500', false, true),
('MDN Web Docs', 'Comprehensive documentation for web technologies by Mozilla.', 'https://developer.mozilla.org/', 'Web Development', 'beginner', true, 'Mozilla', 4.9, ARRAY['HTML', 'CSS', 'JavaScript', 'Web APIs'], 'Globe', 'from-orange-500 to-red-500', true, true),
('React Official Docs', 'Official React documentation with interactive examples.', 'https://react.dev/', 'Web Development', 'intermediate', true, 'Meta', 4.9, ARRAY['React', 'JavaScript', 'Hooks', 'Components'], 'Globe', 'from-orange-500 to-red-500', true, true),
('CSS Tricks', 'Tips, tricks, and techniques on using CSS.', 'https://css-tricks.com/', 'Web Development', 'intermediate', true, 'CSS-Tricks', 4.7, ARRAY['CSS', 'Flexbox', 'Grid', 'Animation'], 'Globe', 'from-orange-500 to-red-500', false, true),
('Traversy Media', 'Practical web development tutorials covering latest technologies.', 'https://www.youtube.com/c/TraversyMedia', 'Web Development', 'beginner', true, 'YouTube - Brad Traversy', 4.8, ARRAY['JavaScript', 'React', 'Node.js', 'CSS'], 'Globe', 'from-orange-500 to-red-500', false, true),

-- ============= Cybersecurity Resources =============
('TryHackMe', 'Learn cybersecurity through hands-on virtual labs and challenges.', 'https://tryhackme.com/', 'Cybersecurity', 'beginner', false, 'TryHackMe', 4.8, ARRAY['Ethical Hacking', 'Penetration Testing', 'Linux', 'Networking'], 'Shield', 'from-red-500 to-pink-500', true, true),
('Hack The Box', 'Advanced penetration testing labs and challenges.', 'https://www.hackthebox.com/', 'Cybersecurity', 'intermediate', false, 'Hack The Box', 4.7, ARRAY['Penetration Testing', 'CTF', 'Exploitation', 'Privilege Escalation'], 'Shield', 'from-red-500 to-pink-500', true, true),
('Cybrary', 'Free cybersecurity training courses and certifications.', 'https://www.cybrary.it/', 'Cybersecurity', 'beginner', false, 'Cybrary', 4.5, ARRAY['Security+', 'Network Security', 'Incident Response'], 'Shield', 'from-red-500 to-pink-500', false, true),
('OWASP', 'Open Web Application Security Project - security best practices.', 'https://owasp.org/', 'Cybersecurity', 'intermediate', true, 'OWASP Foundation', 4.8, ARRAY['Web Security', 'OWASP Top 10', 'Secure Coding'], 'Shield', 'from-red-500 to-pink-500', true, true),
('PortSwigger Web Security Academy', 'Free online web security training from the creators of Burp Suite.', 'https://portswigger.net/web-security', 'Cybersecurity', 'intermediate', true, 'PortSwigger', 4.9, ARRAY['Web Security', 'SQL Injection', 'XSS', 'CSRF'], 'Shield', 'from-red-500 to-pink-500', true, true),
('The Cyber Mentor', 'Practical ethical hacking tutorials and courses.', 'https://www.youtube.com/c/TheCyberMentor', 'Cybersecurity', 'beginner', true, 'YouTube - Heath Adams', 4.8, ARRAY['Ethical Hacking', 'Penetration Testing', 'Bug Bounty'], 'Shield', 'from-red-500 to-pink-500', false, true),

-- ============= Cloud Computing Resources =============
('AWS Cloud Practitioner', 'Foundational AWS certification training and resources.', 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', 'Cloud Computing', 'beginner', true, 'AWS', 4.7, ARRAY['AWS', 'Cloud Fundamentals', 'S3', 'EC2'], 'Cloud', 'from-yellow-500 to-orange-500', true, true),
('Azure Fundamentals', 'Microsoft Azure fundamentals learning path.', 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/', 'Cloud Computing', 'beginner', true, 'Microsoft', 4.6, ARRAY['Azure', 'Cloud Services', 'Virtual Machines'], 'Cloud', 'from-yellow-500 to-orange-500', true, true),
('Google Cloud Skills Boost', 'Hands-on labs and courses for Google Cloud Platform.', 'https://www.cloudskillsboost.google/', 'Cloud Computing', 'beginner', false, 'Google Cloud', 4.7, ARRAY['GCP', 'Kubernetes', 'BigQuery', 'Cloud Functions'], 'Cloud', 'from-yellow-500 to-orange-500', false, true),
('A Cloud Guru', 'Cloud certification training for AWS, Azure, and GCP.', 'https://acloudguru.com/', 'Cloud Computing', 'intermediate', false, 'A Cloud Guru', 4.6, ARRAY['AWS', 'Azure', 'GCP', 'Certification'], 'Cloud', 'from-yellow-500 to-orange-500', true, true),
('Kubernetes Official Docs', 'Official Kubernetes documentation and tutorials.', 'https://kubernetes.io/docs/home/', 'Cloud Computing', 'advanced', true, 'CNCF', 4.8, ARRAY['Kubernetes', 'Containers', 'Orchestration', 'DevOps'], 'Cloud', 'from-yellow-500 to-orange-500', false, true),

-- ============= DevOps Resources =============
('DevOps Roadmap', 'Complete roadmap to becoming a DevOps engineer.', 'https://roadmap.sh/devops', 'DevOps', 'beginner', true, 'Roadmap.sh', 4.8, ARRAY['CI/CD', 'Docker', 'Kubernetes', 'Linux'], 'Layers', 'from-green-500 to-teal-500', true, true),
('Docker Official Tutorial', 'Learn Docker from the official getting started guide.', 'https://docs.docker.com/get-started/', 'DevOps', 'beginner', true, 'Docker', 4.7, ARRAY['Docker', 'Containers', 'Images', 'Compose'], 'Layers', 'from-green-500 to-teal-500', true, true),
('Linux Journey', 'Learn Linux fundamentals interactively for free.', 'https://linuxjourney.com/', 'DevOps', 'beginner', true, 'Linux Journey', 4.6, ARRAY['Linux', 'Command Line', 'System Administration'], 'Layers', 'from-green-500 to-teal-500', false, true),
('GitHub Actions Documentation', 'Automate your workflow with GitHub Actions.', 'https://docs.github.com/en/actions', 'DevOps', 'intermediate', true, 'GitHub', 4.7, ARRAY['CI/CD', 'Automation', 'GitHub', 'Workflows'], 'Layers', 'from-green-500 to-teal-500', false, true),
('TechWorld with Nana', 'DevOps tutorials covering Docker, Kubernetes, and more.', 'https://www.youtube.com/c/TechWorldwithNana', 'DevOps', 'beginner', true, 'YouTube - Nana Janashia', 4.9, ARRAY['DevOps', 'Docker', 'Kubernetes', 'CI/CD'], 'Layers', 'from-green-500 to-teal-500', true, true),
('Terraform Learn', 'Official Terraform tutorials for infrastructure as code.', 'https://learn.hashicorp.com/terraform', 'DevOps', 'intermediate', true, 'HashiCorp', 4.7, ARRAY['Terraform', 'IaC', 'AWS', 'Azure'], 'Layers', 'from-green-500 to-teal-500', false, true),

-- ============= Blockchain Resources =============
('CryptoZombies', 'Learn to code smart contracts in Solidity by building games.', 'https://cryptozombies.io/', 'Blockchain', 'beginner', true, 'CryptoZombies', 4.8, ARRAY['Solidity', 'Ethereum', 'Smart Contracts', 'DApps'], 'Zap', 'from-violet-500 to-purple-600', true, true),
('Ethereum Official Docs', 'Official Ethereum development documentation.', 'https://ethereum.org/developers/', 'Blockchain', 'intermediate', true, 'Ethereum Foundation', 4.7, ARRAY['Ethereum', 'Solidity', 'Web3', 'DeFi'], 'Zap', 'from-violet-500 to-purple-600', true, true),
('Buildspace', 'Learn Web3 development by building projects.', 'https://buildspace.so/', 'Blockchain', 'beginner', true, 'Buildspace', 4.8, ARRAY['Web3', 'NFTs', 'Smart Contracts', 'DApps'], 'Zap', 'from-violet-500 to-purple-600', true, true),
('Alchemy University', 'Free Web3 development bootcamp.', 'https://university.alchemy.com/', 'Blockchain', 'beginner', true, 'Alchemy', 4.7, ARRAY['Ethereum', 'Solidity', 'Web3', 'JavaScript'], 'Zap', 'from-violet-500 to-purple-600', false, true),

-- ============= Python Resources =============
('Python Official Tutorial', 'Official Python tutorial from Python.org.', 'https://docs.python.org/3/tutorial/', 'Python', 'beginner', true, 'Python.org', 4.7, ARRAY['Python', 'Programming Basics', 'Data Structures'], 'Code', 'from-yellow-400 to-blue-500', true, true),
('Automate the Boring Stuff', 'Practical programming for total beginners with Python.', 'https://automatetheboringstuff.com/', 'Python', 'beginner', true, 'Al Sweigart', 4.9, ARRAY['Python', 'Automation', 'Scripting', 'Web Scraping'], 'Code', 'from-yellow-400 to-blue-500', true, true),
('Real Python', 'Python tutorials for developers of all skill levels.', 'https://realpython.com/', 'Python', 'intermediate', false, 'Real Python', 4.8, ARRAY['Python', 'Django', 'Flask', 'Data Science'], 'Code', 'from-yellow-400 to-blue-500', true, true),
('Corey Schafer Python Tutorials', 'In-depth Python tutorials covering all aspects.', 'https://www.youtube.com/c/Coreyms', 'Python', 'beginner', true, 'YouTube - Corey Schafer', 4.9, ARRAY['Python', 'OOP', 'Web Development', 'Automation'], 'Code', 'from-yellow-400 to-blue-500', false, true),
('100 Days of Code Python', 'Complete Python bootcamp by Angela Yu.', 'https://www.udemy.com/course/100-days-of-code/', 'Python', 'beginner', false, 'Udemy - Angela Yu', 4.8, ARRAY['Python', 'Web Development', 'Automation', 'Games'], 'Code', 'from-yellow-400 to-blue-500', true, true),

-- ============= Mobile Development Resources =============
('React Native Docs', 'Official React Native documentation and tutorials.', 'https://reactnative.dev/docs/getting-started', 'Mobile Development', 'intermediate', true, 'Meta', 4.7, ARRAY['React Native', 'JavaScript', 'iOS', 'Android'], 'Laptop', 'from-cyan-500 to-blue-600', true, true),
('Flutter Official', 'Official Flutter SDK documentation and codelabs.', 'https://flutter.dev/docs', 'Mobile Development', 'intermediate', true, 'Google', 4.8, ARRAY['Flutter', 'Dart', 'iOS', 'Android'], 'Laptop', 'from-cyan-500 to-blue-600', true, true),
('Swift Playgrounds', 'Learn Swift coding interactively on iPad and Mac.', 'https://www.apple.com/swift/playgrounds/', 'Mobile Development', 'beginner', true, 'Apple', 4.6, ARRAY['Swift', 'iOS', 'App Development'], 'Laptop', 'from-cyan-500 to-blue-600', false, true),
('Android Developers', 'Official Android development resources and courses.', 'https://developer.android.com/courses', 'Mobile Development', 'intermediate', true, 'Google', 4.7, ARRAY['Android', 'Kotlin', 'Java', 'Jetpack'], 'Laptop', 'from-cyan-500 to-blue-600', true, true),

-- ============= UI/UX Design Resources =============
('Google UX Design Certificate', 'Professional UX design certificate program.', 'https://www.coursera.org/professional-certificates/google-ux-design', 'UI/UX Design', 'beginner', false, 'Coursera - Google', 4.8, ARRAY['UX Design', 'User Research', 'Figma', 'Prototyping'], 'PenTool', 'from-pink-500 to-rose-500', true, true),
('Figma Tutorials', 'Official Figma learning resources and tutorials.', 'https://www.figma.com/resources/learn-design/', 'UI/UX Design', 'beginner', true, 'Figma', 4.8, ARRAY['Figma', 'UI Design', 'Prototyping', 'Collaboration'], 'PenTool', 'from-pink-500 to-rose-500', true, true),
('Laws of UX', 'Collection of best practices for UX designers.', 'https://lawsofux.com/', 'UI/UX Design', 'intermediate', true, 'Jon Yablonski', 4.7, ARRAY['UX Principles', 'Psychology', 'Design Patterns'], 'PenTool', 'from-pink-500 to-rose-500', false, true),
('Refactoring UI', 'Design tips and tactics for developers.', 'https://www.refactoringui.com/', 'UI/UX Design', 'intermediate', false, 'Steve Schoger & Adam Wathan', 4.9, ARRAY['UI Design', 'CSS', 'Visual Design'], 'PenTool', 'from-pink-500 to-rose-500', true, true),

-- ============= Exam Prep - JEE =============
('JEE Main & Advanced Complete Course', 'Comprehensive JEE preparation with video lectures.', 'https://www.khanacademy.org/science/in-in-class11th-physics', 'Exam Prep - JEE', 'intermediate', true, 'Khan Academy', 4.7, ARRAY['Physics', 'Chemistry', 'Mathematics'], 'GraduationCap', 'from-amber-500 to-orange-600', true, true),
('Physics Wallah JEE', 'Popular JEE preparation channel with free lectures.', 'https://www.youtube.com/c/PhysicsWallah', 'Exam Prep - JEE', 'intermediate', true, 'YouTube - Physics Wallah', 4.9, ARRAY['Physics', 'Chemistry', 'JEE Main', 'JEE Advanced'], 'GraduationCap', 'from-amber-500 to-orange-600', true, true),
('Unacademy JEE', 'JEE coaching platform with top educators.', 'https://unacademy.com/goal/jee-main-and-advanced-preparation/TMUVD', 'Exam Prep - JEE', 'intermediate', false, 'Unacademy', 4.5, ARRAY['JEE Main', 'JEE Advanced', 'IIT', 'NIT'], 'GraduationCap', 'from-amber-500 to-orange-600', false, true),

-- ============= Exam Prep - NEET =============
('NEET Complete Biology', 'Comprehensive NEET biology preparation.', 'https://www.youtube.com/playlist?list=PL0bVVJlQe2vgEYT8C3_jn0Y1hE9TnYPjf', 'Exam Prep - NEET', 'intermediate', true, 'YouTube - NEET Lectures', 4.6, ARRAY['Biology', 'Zoology', 'Botany', 'Human Physiology'], 'GraduationCap', 'from-green-500 to-emerald-600', true, true),
('NCERT Solutions for NEET', 'NCERT based NEET preparation resources.', 'https://byjus.com/ncert-solutions/', 'Exam Prep - NEET', 'beginner', true, 'Byjus', 4.4, ARRAY['Physics', 'Chemistry', 'Biology', 'NCERT'], 'GraduationCap', 'from-green-500 to-emerald-600', false, true),
('Physics Wallah NEET', 'Free NEET preparation lectures.', 'https://www.youtube.com/c/PhysicsWallah', 'Exam Prep - NEET', 'intermediate', true, 'YouTube - Physics Wallah', 4.9, ARRAY['Physics', 'Chemistry', 'Biology', 'NEET'], 'GraduationCap', 'from-green-500 to-emerald-600', true, true),

-- ============= Exam Prep - GATE =============
('GATE CS Preparation', 'Complete GATE CS preparation course.', 'https://www.geeksforgeeks.org/gate-cs-notes-gq/', 'Exam Prep - GATE', 'advanced', true, 'GeeksforGeeks', 4.7, ARRAY['Algorithms', 'Data Structures', 'Operating Systems', 'DBMS'], 'GraduationCap', 'from-indigo-500 to-purple-600', true, true),
('NPTEL GATE Courses', 'IIT faculty lectures for GATE preparation.', 'https://nptel.ac.in/', 'Exam Prep - GATE', 'advanced', true, 'NPTEL', 4.8, ARRAY['Engineering', 'Computer Science', 'Electronics', 'GATE'], 'GraduationCap', 'from-indigo-500 to-purple-600', true, true),
('GATE Overflow', 'Previous year questions and discussions for GATE.', 'https://gateoverflow.in/', 'Exam Prep - GATE', 'advanced', true, 'GATE Overflow', 4.8, ARRAY['GATE CS', 'Previous Papers', 'Solutions'], 'GraduationCap', 'from-indigo-500 to-purple-600', true, true),

-- ============= Exam Prep - CAT =============
('CAT Preparation by IMS', 'Comprehensive CAT preparation resources.', 'https://www.imsindia.com/cat-preparation/', 'Exam Prep - CAT', 'advanced', false, 'IMS', 4.6, ARRAY['Quantitative Aptitude', 'Verbal Ability', 'DILR'], 'GraduationCap', 'from-blue-500 to-indigo-600', true, true),
('Unacademy CAT', 'CAT preparation with top MBA educators.', 'https://unacademy.com/goal/cat-and-mba-entrance/TLIQS', 'Exam Prep - CAT', 'advanced', false, 'Unacademy', 4.5, ARRAY['CAT', 'MBA', 'IIM', 'Aptitude'], 'GraduationCap', 'from-blue-500 to-indigo-600', false, true),
('Cracku CAT Free Resources', 'Free CAT preparation material and mock tests.', 'https://cracku.in/cat-preparation', 'Exam Prep - CAT', 'intermediate', true, 'Cracku', 4.6, ARRAY['CAT', 'Mock Tests', 'Practice Questions'], 'GraduationCap', 'from-blue-500 to-indigo-600', false, true),

-- ============= Exam Prep - GRE =============
('Magoosh GRE Prep', 'Comprehensive GRE preparation with practice tests.', 'https://gre.magoosh.com/', 'Exam Prep - GRE', 'intermediate', false, 'Magoosh', 4.7, ARRAY['Verbal', 'Quantitative', 'AWA', 'Vocabulary'], 'GraduationCap', 'from-teal-500 to-cyan-600', true, true),
('ETS GRE Official', 'Official GRE resources from the test makers.', 'https://www.ets.org/gre/test-takers/general-test/prepare.html', 'Exam Prep - GRE', 'intermediate', true, 'ETS', 4.8, ARRAY['GRE', 'Official Prep', 'PowerPrep'], 'GraduationCap', 'from-teal-500 to-cyan-600', true, true),
('GregMAT', 'Affordable and effective GRE preparation.', 'https://www.gregmat.com/', 'Exam Prep - GRE', 'intermediate', false, 'GregMAT', 4.9, ARRAY['GRE', 'Verbal', 'AWA', 'Strategy'], 'GraduationCap', 'from-teal-500 to-cyan-600', true, true),

-- ============= Exam Prep - UPSC =============
('UPSC Pathshala', 'Complete UPSC preparation resources and guidance.', 'https://www.youtube.com/c/UPSCPathshala', 'Exam Prep - UPSC', 'advanced', true, 'YouTube - UPSC Pathshala', 4.6, ARRAY['Polity', 'History', 'Geography', 'Current Affairs'], 'GraduationCap', 'from-rose-500 to-red-600', true, true),
('Vision IAS', 'Premium UPSC preparation material and tests.', 'https://visionias.in/', 'Exam Prep - UPSC', 'advanced', false, 'Vision IAS', 4.7, ARRAY['IAS', 'IPS', 'Civil Services', 'UPSC'], 'GraduationCap', 'from-rose-500 to-red-600', true, true),
('BYJU''s IAS', 'Comprehensive IAS preparation by BYJU''s.', 'https://byjus.com/ias/', 'Exam Prep - UPSC', 'advanced', false, 'BYJU''S', 4.4, ARRAY['UPSC', 'Prelims', 'Mains', 'Interview'], 'GraduationCap', 'from-rose-500 to-red-600', false, true),

-- ============= Project Management =============
('PMI Project Management', 'Official PMP certification resources.', 'https://www.pmi.org/learning', 'Project Management', 'intermediate', false, 'PMI', 4.6, ARRAY['PMP', 'Agile', 'Scrum', 'Project Management'], 'Layers', 'from-slate-500 to-gray-600', true, true),
('Google Project Management Certificate', 'Professional project management certification.', 'https://www.coursera.org/professional-certificates/google-project-management', 'Project Management', 'beginner', false, 'Coursera - Google', 4.8, ARRAY['Agile', 'Scrum', 'Project Planning', 'Risk Management'], 'Layers', 'from-slate-500 to-gray-600', true, true),
('Scrum.org', 'Official Scrum resources and certifications.', 'https://www.scrum.org/resources', 'Project Management', 'intermediate', true, 'Scrum.org', 4.7, ARRAY['Scrum', 'Agile', 'Product Owner', 'Scrum Master'], 'Layers', 'from-slate-500 to-gray-600', false, true),

-- ============= Digital Marketing =============
('Google Digital Garage', 'Free digital marketing courses from Google.', 'https://learndigital.withgoogle.com/digitalgarage', 'Digital Marketing', 'beginner', true, 'Google', 4.7, ARRAY['SEO', 'SEM', 'Social Media', 'Analytics'], 'TrendingUp', 'from-pink-500 to-fuchsia-500', true, true),
('HubSpot Academy', 'Free inbound marketing and sales courses.', 'https://academy.hubspot.com/', 'Digital Marketing', 'beginner', true, 'HubSpot', 4.8, ARRAY['Inbound Marketing', 'Content Marketing', 'Email Marketing'], 'TrendingUp', 'from-pink-500 to-fuchsia-500', true, true),
('Meta Blueprint', 'Official Facebook and Instagram advertising courses.', 'https://www.facebookblueprint.com/', 'Digital Marketing', 'intermediate', true, 'Meta', 4.5, ARRAY['Facebook Ads', 'Instagram', 'Social Media Marketing'], 'TrendingUp', 'from-pink-500 to-fuchsia-500', false, true),

-- ============= Finance & Business =============
('Investopedia', 'Financial education and market analysis.', 'https://www.investopedia.com/', 'Finance', 'beginner', true, 'Investopedia', 4.7, ARRAY['Finance', 'Investing', 'Stock Market', 'Economics'], 'TrendingUp', 'from-emerald-500 to-green-600', true, true),
('CFA Institute', 'Chartered Financial Analyst preparation resources.', 'https://www.cfainstitute.org/', 'Finance', 'advanced', false, 'CFA Institute', 4.8, ARRAY['CFA', 'Investment', 'Portfolio Management'], 'TrendingUp', 'from-emerald-500 to-green-600', true, true),
('Khan Academy Finance', 'Free finance and capital markets courses.', 'https://www.khanacademy.org/economics-finance-domain', 'Finance', 'beginner', true, 'Khan Academy', 4.8, ARRAY['Finance', 'Economics', 'Accounting', 'Investing'], 'TrendingUp', 'from-emerald-500 to-green-600', false, true);
