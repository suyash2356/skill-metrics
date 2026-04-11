
-- PART 1: SKILL NODES

INSERT INTO skill_nodes (name, domain, content_type, difficulty_level, estimated_hours, display_order, description, learning_outcomes) VALUES
-- AWS
('AWS Cloud Fundamentals', 'AWS', 'exam', 'beginner', 15, 1, 'Core cloud computing concepts', ARRAY['Cloud models','AWS console','Core services']),
('AWS Solutions Architect Basics', 'AWS', 'exam', 'intermediate', 30, 3, 'Well-Architected Framework', ARRAY['HA architectures','Well-Architected pillars','Disaster recovery']),
('AWS Security & Identity', 'AWS', 'exam', 'intermediate', 20, 4, 'IAM and security', ARRAY['IAM policies','Encryption','CloudTrail']),
('AWS Serverless & Advanced', 'AWS', 'exam', 'advanced', 35, 5, 'Lambda, DynamoDB, CloudFormation', ARRAY['Serverless apps','IaC','CI/CD']),
('AWS Certification Mastery', 'AWS', 'exam', 'advanced', 25, 6, 'Exam prep', ARRAY['Pass certs','Best practices','Complex scenarios']),
-- CompTIA
('CompTIA IT Basics', 'CompTIA', 'exam', 'beginner', 20, 1, 'Basic IT concepts', ARRAY['Components','OS','Troubleshooting']),
('CompTIA A+ Certification', 'CompTIA', 'exam', 'beginner', 30, 2, 'Hardware and networking', ARRAY['Hardware','Networks','Mobile devices']),
('CompTIA Network+ Prep', 'CompTIA', 'exam', 'intermediate', 35, 3, 'Network infrastructure', ARRAY['Topologies','Routing','Troubleshooting']),
('CompTIA Security+ Prep', 'CompTIA', 'exam', 'intermediate', 35, 4, 'Cybersecurity basics', ARRAY['Threats','Controls','Risk mgmt']),
('CompTIA Advanced Certs', 'CompTIA', 'exam', 'advanced', 25, 5, 'Advanced cert prep', ARRAY['Pass certs','Security','Readiness']),
-- GMAT
('GMAT Quantitative Basics', 'GMAT', 'exam', 'beginner', 25, 1, 'Arithmetic and algebra', ARRAY['Arithmetic','Algebra','Data sufficiency']),
('GMAT Verbal Reasoning', 'GMAT', 'exam', 'beginner', 25, 2, 'Reading and reasoning', ARRAY['Reading','Arguments','Grammar']),
('GMAT Integrated Reasoning', 'GMAT', 'exam', 'intermediate', 20, 3, 'Multi-source reasoning', ARRAY['Charts','Analysis','Two-part']),
('GMAT Advanced Quantitative', 'GMAT', 'exam', 'intermediate', 30, 4, 'Advanced problem solving', ARRAY['Algebra','Geometry','Data sufficiency']),
('GMAT Exam Strategy', 'GMAT', 'exam', 'advanced', 20, 5, 'Test strategy', ARRAY['Timing','Practice tests','Score improvement']),
-- IELTS
('IELTS Listening Mastery', 'IELTS', 'exam', 'beginner', 20, 1, 'Listening comprehension', ARRAY['Accents','Note-taking','Prediction']),
('IELTS Reading Mastery', 'IELTS', 'exam', 'beginner', 20, 2, 'Academic reading', ARRAY['Skim/scan','Main ideas','Headings']),
('IELTS Writing Mastery', 'IELTS', 'exam', 'intermediate', 25, 3, 'Task 1 and 2', ARRAY['Charts','Essays','Paragraphs']),
('IELTS Speaking Mastery', 'IELTS', 'exam', 'intermediate', 20, 4, 'Speaking test', ARRAY['Fluency','Coherence','Pronunciation']),
('IELTS Full Test Prep', 'IELTS', 'exam', 'advanced', 15, 5, 'Complete practice', ARRAY['Mock tests','Band score','Time mgmt']),
-- LSAT
('LSAT Logical Reasoning', 'LSAT', 'exam', 'beginner', 30, 1, 'Argument analysis', ARRAY['Structure','Strengthen/weaken','Assumptions']),
('LSAT Analytical Reasoning', 'LSAT', 'exam', 'intermediate', 30, 2, 'Logic games', ARRAY['Diagrams','Ordering','Grouping']),
('LSAT Reading Comprehension', 'LSAT', 'exam', 'intermediate', 25, 3, 'Passage analysis', ARRAY['Structure','Viewpoint','Comparative']),
('LSAT Exam Strategy', 'LSAT', 'exam', 'advanced', 20, 4, 'Strategy and practice', ARRAY['Time mgmt','Score prediction','Practice tests']),
-- MCAT
('MCAT Biology & Biochem', 'MCAT', 'exam', 'beginner', 40, 1, 'Biology and biochem', ARRAY['Cell bio','Genetics','Enzymes']),
('MCAT Chem & Physics', 'MCAT', 'exam', 'intermediate', 40, 2, 'Chemistry and physics', ARRAY['Reactions','Organic','Mechanics']),
('MCAT Psych & Sociology', 'MCAT', 'exam', 'intermediate', 25, 3, 'Behavioral sciences', ARRAY['Psychology','Sociology','Research']),
('MCAT Critical Analysis', 'MCAT', 'exam', 'advanced', 25, 4, 'CARS section', ARRAY['Passage analysis','Inference','Argumentation']),
('MCAT Full Practice', 'MCAT', 'exam', 'advanced', 30, 5, 'Full-length tests', ARRAY['Timed practice','Score analysis','Review']),
-- SAT
('SAT Math Foundations', 'SAT', 'exam', 'beginner', 25, 1, 'Algebra and data', ARRAY['Linear equations','Ratios','Data interpretation']),
('SAT Advanced Mathematics', 'SAT', 'exam', 'intermediate', 25, 2, 'Advanced algebra/geometry', ARRAY['Quadratics','Trigonometry','Complex problems']),
('SAT Reading & Writing', 'SAT', 'exam', 'beginner', 25, 3, 'Evidence-based R&W', ARRAY['Passage analysis','Grammar','Evidence']),
('SAT Digital Test Prep', 'SAT', 'exam', 'intermediate', 15, 4, 'Digital SAT strategies', ARRAY['Adaptive strategies','Time mgmt','Practice']),
-- TOEFL
('TOEFL Reading Skills', 'TOEFL', 'exam', 'beginner', 20, 1, 'Academic reading', ARRAY['Vocabulary','Inference','Summary']),
('TOEFL Listening Skills', 'TOEFL', 'exam', 'beginner', 20, 2, 'Academic listening', ARRAY['Lectures','Conversations','Notes']),
('TOEFL Speaking Skills', 'TOEFL', 'exam', 'intermediate', 20, 3, 'Speaking practice', ARRAY['Responses','Vocabulary','Pronunciation']),
('TOEFL Writing Skills', 'TOEFL', 'exam', 'intermediate', 20, 4, 'Academic writing', ARRAY['Essay structure','Academic style','Summarization']),
('TOEFL Complete Prep', 'TOEFL', 'exam', 'advanced', 15, 5, 'Full test practice', ARRAY['Mock tests','Score optimization','Time mgmt']),
-- Animation
('Animation Principles', 'Animation', 'non-tech', 'beginner', 20, 1, '12 principles', ARRAY['Principles','Timing','Keyframes']),
('2D Digital Animation', 'Animation', 'non-tech', 'beginner', 30, 2, 'Digital 2D', ARRAY['Frame-by-frame','Digital drawing','Character']),
('3D Animation Intro', 'Animation', 'non-tech', 'intermediate', 35, 3, '3D modeling/animation', ARRAY['Modeling','Rigging','3D animation']),
('Motion Graphics Design', 'Animation', 'non-tech', 'intermediate', 25, 4, 'Motion graphics', ARRAY['After Effects','Typography','Compositing']),
('Advanced Character Animation', 'Animation', 'non-tech', 'advanced', 40, 5, 'Character animation', ARRAY['Acting','Lip sync','Storyboarding']),
-- Architecture
('Architectural Design Fundamentals', 'Architecture', 'non-tech', 'beginner', 20, 1, 'Design principles', ARRAY['Design','History','Spatial awareness']),
('Architectural Drafting & CAD', 'Architecture', 'non-tech', 'beginner', 30, 2, 'Technical drawing', ARRAY['AutoCAD','Drawing','Blueprints']),
('Building Systems Engineering', 'Architecture', 'non-tech', 'intermediate', 25, 3, 'Structural systems', ARRAY['Structural','HVAC','Building codes']),
('Sustainable Architecture', 'Architecture', 'non-tech', 'intermediate', 20, 4, 'Green building', ARRAY['LEED','Energy efficiency','Sustainable materials']),
('Advanced Architectural Design', 'Architecture', 'non-tech', 'advanced', 30, 5, 'Complex projects', ARRAY['Complex design','Presentation','Portfolio']),
-- Business
('Business Basics', 'Business', 'non-tech', 'beginner', 15, 1, 'Core concepts', ARRAY['Business models','Market analysis','Entrepreneurship']),
('Marketing & Sales Fundamentals', 'Business', 'non-tech', 'beginner', 20, 2, 'Marketing and sales', ARRAY['Marketing mix','Segmentation','Sales']),
('Business Finance', 'Business', 'non-tech', 'intermediate', 25, 3, 'Finance and accounting', ARRAY['Financials','Budgeting','Cash flow']),
('Operations & Strategy', 'Business', 'non-tech', 'intermediate', 25, 4, 'Operations', ARRAY['Supply chain','Strategy','Process optimization']),
('Business Leadership', 'Business', 'non-tech', 'advanced', 20, 5, 'Leadership', ARRAY['Team leadership','Scaling','Change mgmt']),
-- Communication
('Communication Fundamentals', 'Communication', 'non-tech', 'beginner', 15, 1, 'Verbal and written', ARRAY['Writing','Listening','Presentations']),
('Public Speaking Skills', 'Communication', 'non-tech', 'beginner', 20, 2, 'Speech delivery', ARRAY['Speech structure','Body language','Audience']),
('Professional Communication Skills', 'Communication', 'non-tech', 'intermediate', 20, 3, 'Business writing', ARRAY['Business writing','Email','Reports']),
('Media & Digital Communication', 'Communication', 'non-tech', 'intermediate', 20, 4, 'Digital media', ARRAY['Social media','Content strategy','Crisis comms']),
('Advanced Communication & Leadership', 'Communication', 'non-tech', 'advanced', 20, 5, 'Negotiation', ARRAY['Negotiation','Persuasion','Cross-cultural']),
-- Creative Writing
('Writing Craft Fundamentals', 'Creative Writing', 'non-tech', 'beginner', 15, 1, 'Grammar and storytelling', ARRAY['Grammar','Narrative','Voice']),
('Fiction Writing Craft', 'Creative Writing', 'non-tech', 'beginner', 25, 2, 'Short stories', ARRAY['Characters','Dialogue','Plot']),
('Poetry & Creative Non-Fiction', 'Creative Writing', 'non-tech', 'intermediate', 20, 3, 'Poetry and non-fiction', ARRAY['Poetry','Essays','Memoir']),
('Screenwriting & Drama', 'Creative Writing', 'non-tech', 'intermediate', 25, 4, 'Screen/stage writing', ARRAY['Screenplay','Dramatic structure','Visual storytelling']),
('Publishing & Writing Career', 'Creative Writing', 'non-tech', 'advanced', 20, 5, 'Getting published', ARRAY['Manuscript','Query letters','Portfolio']),
-- Fashion Design
('Fashion Design Basics', 'Fashion Design', 'non-tech', 'beginner', 15, 1, 'Fashion history/textiles', ARRAY['History','Textiles','Color theory']),
('Fashion Sketching', 'Fashion Design', 'non-tech', 'beginner', 25, 2, 'Fashion illustration', ARRAY['Figure drawing','Flat sketching','Digital']),
('Pattern Making & Construction', 'Fashion Design', 'non-tech', 'intermediate', 30, 3, 'Pattern drafting', ARRAY['Patterns','Draping','Manipulation']),
('Fashion Technology & CAD', 'Fashion Design', 'non-tech', 'intermediate', 25, 4, 'Digital fashion', ARRAY['CAD','3D simulation','Prototyping']),
('Fashion Collection Development', 'Fashion Design', 'non-tech', 'advanced', 25, 5, 'Collection/portfolio', ARRAY['Collection','Portfolio','Business']),
-- Film & Video
('Filmmaking Fundamentals', 'Film & Video', 'non-tech', 'beginner', 15, 1, 'Camera and storytelling', ARRAY['Camera','Composition','Storytelling']),
('Video Production Workflow', 'Film & Video', 'non-tech', 'beginner', 25, 2, 'Lighting/audio/production', ARRAY['Lighting','Audio','Planning']),
('Video Editing & Post', 'Film & Video', 'non-tech', 'intermediate', 30, 3, 'Non-linear editing', ARRAY['Premiere/DaVinci','Editing','Color grading']),
('Advanced Cinematography', 'Film & Video', 'non-tech', 'intermediate', 25, 4, 'Advanced camera', ARRAY['Camera movement','VFX','Drone']),
('Film Portfolio & Career', 'Film & Video', 'non-tech', 'advanced', 20, 5, 'Film projects', ARRAY['Short film','Documentary','Showreel']),
-- Marketing
('Marketing Principles', 'Marketing', 'non-tech', 'beginner', 15, 1, 'Core marketing', ARRAY['Marketing mix','Consumer psychology','Brand']),
('Content Marketing Strategy', 'Marketing', 'non-tech', 'beginner', 20, 2, 'Content creation', ARRAY['Content planning','Blog writing','Distribution']),
('Social Media & Paid Ads', 'Marketing', 'non-tech', 'intermediate', 20, 3, 'Social media', ARRAY['Platforms','Paid ads','Community']),
('SEO & Marketing Analytics', 'Marketing', 'non-tech', 'intermediate', 25, 4, 'Search/analytics', ARRAY['Keywords','Analytics','SEO']),
('Growth Marketing Strategy', 'Marketing', 'non-tech', 'advanced', 20, 5, 'Growth hacking', ARRAY['Growth','A/B testing','Conversion']),
-- Management
('Management Principles', 'Management', 'non-tech', 'beginner', 15, 1, 'Management basics', ARRAY['Theories','Structures','Dynamics']),
('Project Management Fundamentals', 'Management', 'non-tech', 'beginner', 25, 2, 'Project planning', ARRAY['Lifecycle','Agile','Risk']),
('Leadership & Team Management', 'Management', 'non-tech', 'intermediate', 20, 3, 'Leadership', ARRAY['Leadership styles','Conflict','Performance']),
('Strategic Management', 'Management', 'non-tech', 'intermediate', 25, 4, 'Strategic planning', ARRAY['SWOT','Competition','Change']),
('Executive Leadership', 'Management', 'non-tech', 'advanced', 20, 5, 'C-suite skills', ARRAY['Decisions','Stakeholders','Governance']),
-- Performing Arts
('Performing Arts Introduction', 'Performing Arts', 'non-tech', 'beginner', 15, 1, 'Theatre basics', ARRAY['Theatre history','Performance','Stage presence']),
('Acting Techniques', 'Performing Arts', 'non-tech', 'beginner', 25, 2, 'Acting and character', ARRAY['Method acting','Character','Scene work']),
('Dance & Physical Theatre', 'Performing Arts', 'non-tech', 'intermediate', 30, 3, 'Dance/movement', ARRAY['Dance styles','Choreography','Physical theatre']),
('Advanced Performance & Directing', 'Performing Arts', 'non-tech', 'advanced', 25, 4, 'Directing/production', ARRAY['Directing','Production design','Auditions']),
-- Psychology
('Psychology Foundations', 'Psychology', 'non-tech', 'beginner', 20, 1, 'Intro to psychology', ARRAY['Theories','Research methods','Cognitive']),
('Developmental & Social Psychology', 'Psychology', 'non-tech', 'intermediate', 25, 2, 'Human development', ARRAY['Child dev','Adolescent','Social']),
('Clinical & Counseling Psychology', 'Psychology', 'non-tech', 'intermediate', 25, 3, 'Clinical approaches', ARRAY['Therapy','Assessment','Counseling']),
('Advanced Psychology Research', 'Psychology', 'non-tech', 'advanced', 20, 4, 'Research and specializations', ARRAY['Research design','Neuro','Forensic']),
-- Law
('Legal System Fundamentals', 'Law', 'non-tech', 'beginner', 20, 1, 'Legal system', ARRAY['Legal structure','Constitutional','Reasoning']),
('Contract & Property Law', 'Law', 'non-tech', 'intermediate', 25, 2, 'Contract/property', ARRAY['Contracts','Property','Legal writing']),
('Criminal & Civil Procedure', 'Law', 'non-tech', 'intermediate', 25, 3, 'Criminal/civil law', ARRAY['Criminal','Tort','Civil procedure']),
('Advanced Legal Practice', 'Law', 'non-tech', 'advanced', 20, 4, 'Corporate/IP law', ARRAY['Corporate','IP','Ethics']),
-- Journalism
('Journalism Fundamentals', 'Journalism', 'non-tech', 'beginner', 15, 1, 'News writing', ARRAY['News writing','Reporting','Ethics']),
('Digital & Multimedia Journalism', 'Journalism', 'non-tech', 'intermediate', 20, 2, 'Online journalism', ARRAY['Digital storytelling','Multimedia','Social media']),
('Investigative & Feature Journalism', 'Journalism', 'non-tech', 'advanced', 25, 3, 'Investigative reporting', ARRAY['Investigation','Data journalism','Features']),
-- DSA
('Basic Data Structures', 'DSA', 'tech', 'beginner', 20, 1, 'Arrays, lists, stacks, queues', ARRAY['Arrays','Linked lists','Stacks/queues']),
('Trees & Graph Structures', 'DSA', 'tech', 'intermediate', 25, 2, 'Binary trees, BST, graphs', ARRAY['Tree traversals','Graphs','BST']),
('Sorting & Searching Algorithms', 'DSA', 'tech', 'intermediate', 20, 3, 'Sorting and search', ARRAY['Sorting','Binary search','Complexity']),
('Dynamic Programming Mastery', 'DSA', 'tech', 'advanced', 30, 4, 'DP patterns', ARRAY['DP patterns','Greedy','Backtracking']),
('Advanced Algorithm Design', 'DSA', 'tech', 'advanced', 25, 5, 'Advanced algorithms', ARRAY['Shortest path','String matching','Contests']),
-- Programming
('Programming Foundations', 'Programming', 'tech', 'beginner', 20, 1, 'Variables, control flow', ARRAY['Basic programs','Data types','Control flow']),
('Object-Oriented Programming', 'Programming', 'tech', 'intermediate', 25, 2, 'OOP concepts', ARRAY['Classes','Inheritance','Polymorphism']),
('Functional & Advanced Paradigms', 'Programming', 'tech', 'intermediate', 20, 3, 'Functional programming', ARRAY['Higher-order functions','Immutability','Patterns']),
('Software Engineering Practices', 'Programming', 'tech', 'advanced', 30, 4, 'Design patterns/testing', ARRAY['Design patterns','Unit tests','Code review']),
-- Python
('Python Language Basics', 'Python', 'tech', 'beginner', 15, 1, 'Python syntax', ARRAY['Scripts','Data types','Exceptions']),
('Python Data Structures', 'Python', 'tech', 'beginner', 20, 2, 'Lists, dicts', ARRAY['Comprehensions','Dictionaries','File I/O']),
('Python OOP & Packages', 'Python', 'tech', 'intermediate', 25, 3, 'OOP Python', ARRAY['Classes','Pip/venv','Packages']),
('Python for Data & Web Apps', 'Python', 'tech', 'intermediate', 30, 4, 'NumPy, Pandas, Flask', ARRAY['Pandas','Web APIs','Visualization']),
('Advanced Python Techniques', 'Python', 'tech', 'advanced', 25, 5, 'Decorators, async', ARRAY['Decorators','Async','Performance']),
-- JavaScript
('JS Core Fundamentals', 'JavaScript', 'tech', 'beginner', 15, 1, 'Variables, DOM', ARRAY['JavaScript','DOM','Events']),
('ES6+ Modern JavaScript', 'JavaScript', 'tech', 'beginner', 20, 2, 'Modern JS', ARRAY['Arrow functions','Promises','Destructuring']),
('JavaScript Frameworks', 'JavaScript', 'tech', 'intermediate', 30, 3, 'React/Vue/Angular', ARRAY['SPA','State mgmt','Components']),
('Node.js & Server-Side JS', 'JavaScript', 'tech', 'intermediate', 25, 4, 'Server-side JS', ARRAY['REST APIs','Database','Auth']),
('Advanced JS & TypeScript', 'JavaScript', 'tech', 'advanced', 25, 5, 'TypeScript/testing', ARRAY['TypeScript','Testing','Performance']),
-- System Design
('System Design Foundations', 'System Design', 'tech', 'beginner', 15, 1, 'Client-server, HTTP', ARRAY['Client-server','HTTP','DNS/CDN']),
('Database Design Patterns', 'System Design', 'tech', 'intermediate', 25, 2, 'SQL vs NoSQL', ARRAY['Databases','Schemas','Caching']),
('Distributed Systems Design', 'System Design', 'tech', 'intermediate', 30, 3, 'CAP theorem', ARRAY['CAP','Consensus','Message queues']),
('System Design Interview Prep', 'System Design', 'tech', 'advanced', 25, 4, 'Design real systems', ARRAY['URL shortener','Social feed','Chat']),
('Advanced System Architecture', 'System Design', 'tech', 'advanced', 20, 5, 'Microservices', ARRAY['Microservices','Event sourcing','Service mesh']),
-- Full Stack
('Full Stack Frontend Basics', 'Full Stack Development', 'tech', 'beginner', 20, 1, 'HTML/CSS/JS', ARRAY['Responsive','CSS layouts','JS DOM']),
('Full Stack Frontend Frameworks', 'Full Stack Development', 'tech', 'intermediate', 30, 2, 'React/Vue/Angular', ARRAY['SPA','State mgmt','API integration']),
('Full Stack Backend Dev', 'Full Stack Development', 'tech', 'intermediate', 30, 3, 'Server-side/APIs', ARRAY['REST APIs','Auth','Database']),
('Full Stack DevOps', 'Full Stack Development', 'tech', 'intermediate', 20, 4, 'CI/CD/deployment', ARRAY['Docker','CI/CD','Cloud']),
('Full Stack Capstone Projects', 'Full Stack Development', 'tech', 'advanced', 40, 5, 'End-to-end apps', ARRAY['Full stack','Architecture','Production']),
-- Computer Science
('CS Core Fundamentals', 'Computer Science', 'tech', 'beginner', 20, 1, 'Computing basics', ARRAY['Binary/hex','Boolean logic','Algorithms']),
('CS Data Structures', 'Computer Science', 'tech', 'intermediate', 25, 2, 'Core data structures', ARRAY['Arrays/lists','Trees/graphs','Complexity']),
('Operating Systems & Networking', 'Computer Science', 'tech', 'intermediate', 30, 3, 'OS and networks', ARRAY['Processes','Memory','Protocols']),
('Theory of Computation', 'Computer Science', 'tech', 'advanced', 25, 4, 'Automata/computability', ARRAY['Automata','CFG','Turing machines']),
-- Database
('Database Essentials', 'Database', 'tech', 'beginner', 15, 1, 'Relational model/SQL', ARRAY['SQL','Relations','Normalization']),
('Advanced SQL Mastery', 'Database', 'tech', 'intermediate', 20, 2, 'Joins, windows', ARRAY['Joins','Window functions','Stored procedures']),
('NoSQL & Modern Databases', 'Database', 'tech', 'intermediate', 20, 3, 'MongoDB/Redis', ARRAY['Document DBs','Key-value','When NoSQL']),
('Database Administration & Tuning', 'Database', 'tech', 'advanced', 25, 4, 'Performance/security', ARRAY['Query optimization','Replication','Security'])
ON CONFLICT (name) DO NOTHING;

-- PART 2: DEPENDENCIES
DO $$
DECLARE
  domains text[] := ARRAY[
    'AWS','CompTIA','GMAT','IELTS','LSAT','MCAT','SAT','TOEFL',
    'Animation','Architecture','Business','Communication','Creative Writing',
    'Fashion Design','Film & Video','Marketing','Management','Performing Arts',
    'Psychology','Law','Journalism',
    'DSA','Programming','Python','JavaScript','System Design',
    'Full Stack Development','Computer Science','Database'
  ];
  d text;
  prev_id uuid;
  curr_id uuid;
  node_rec RECORD;
BEGIN
  FOREACH d IN ARRAY domains LOOP
    prev_id := NULL;
    FOR node_rec IN 
      SELECT id FROM skill_nodes 
      WHERE domain = d AND is_active = true 
      ORDER BY display_order ASC
    LOOP
      curr_id := node_rec.id;
      IF prev_id IS NOT NULL THEN
        INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
        VALUES (curr_id, prev_id, 'required')
        ON CONFLICT DO NOTHING;
      END IF;
      prev_id := curr_id;
    END LOOP;
  END LOOP;
END;
$$;

-- PART 3: GAME DEVELOPMENT RESOURCES
INSERT INTO resources (title, description, link, category, section_type, resource_type, difficulty, is_free, icon, color)
VALUES
('Unity Learn Platform', 'Official Unity tutorials from beginner to advanced', 'https://learn.unity.com/', 'Game Development', 'domain', 'course', 'beginner', true, '🎮', '#000000'),
('Unreal Engine Learning', 'Epic Games official learning for Unreal Engine', 'https://dev.epicgames.com/community/unreal-engine/learning', 'Game Development', 'domain', 'course', 'intermediate', true, '🎮', '#0073e6'),
('CS50 Game Development', 'Harvard intro to game dev with Lua and C#', 'https://cs50.harvard.edu/games/', 'Game Development', 'domain', 'course', 'beginner', true, '🎓', '#A51C30'),
('Game Programming Patterns', 'Essential design patterns for games by Robert Nystrom', 'https://gameprogrammingpatterns.com/', 'Game Development', 'domain', 'book', 'intermediate', true, '📚', '#4CAF50'),
('Brackeys Tutorials', 'Popular Unity game dev tutorials on YouTube', 'https://www.youtube.com/@Brackeys', 'Game Development', 'domain', 'video', 'beginner', true, '▶️', '#FF0000'),
('Godot Engine Documentation', 'Official docs for Godot open-source engine', 'https://docs.godotengine.org/', 'Game Development', 'domain', 'documentation', 'beginner', true, '📖', '#478CBF'),
('Shadertoy Interactive Shaders', 'Learn shader programming interactively', 'https://www.shadertoy.com/', 'Game Development', 'domain', 'practice', 'advanced', true, '🔮', '#000000'),
('itch.io Game Jams', 'Participate in game jams for portfolio', 'https://itch.io/jams', 'Game Development', 'domain', 'practice', 'intermediate', true, '🏆', '#FA5C5C'),
('Coursera Game Design Specialization', 'Michigan State game design and development', 'https://www.coursera.org/specializations/game-design', 'Game Development', 'domain', 'course', 'intermediate', false, '🎓', '#0056D2'),
('GameMaker Studio Tutorials', 'Official GameMaker tutorials', 'https://gamemaker.io/en/tutorials', 'Game Development', 'domain', 'tutorial', 'beginner', true, '🎮', '#71c837'),
('Multiplayer Networking Guide', 'Gabriel Gambetta multiplayer architecture', 'https://www.gabrielgambetta.com/client-server-game-architecture.html', 'Game Development', 'domain', 'tutorial', 'advanced', true, '🌐', '#607D8B'),
('Game Developer Magazine', 'Industry articles and postmortems', 'https://www.gamedeveloper.com/', 'Game Development', 'domain', 'blog', 'intermediate', true, '📰', '#1a1a2e'),
('Real-Time Rendering Book', 'Advanced rendering for games', 'https://www.realtimerendering.com/', 'Game Development', 'domain', 'book', 'advanced', false, '📚', '#333333'),
('Udemy Complete Unity Developer', 'Comprehensive Unity and C# course', 'https://www.udemy.com/course/unitycourse/', 'Game Development', 'domain', 'course', 'beginner', false, '🎓', '#A435F0'),
('Game AI Pro', 'Game AI techniques and wisdom', 'http://www.gameaipro.com/', 'Game Development', 'domain', 'book', 'advanced', true, '🤖', '#FF5722')
ON CONFLICT ON CONSTRAINT resources_unique_title_link_category DO NOTHING;

-- PART 4: LINK ALL UNLINKED RESOURCES
DO $$
DECLARE
  cat text;
  diff text;
  node_id uuid;
  categories text[] := ARRAY[
    'AWS','CompTIA','GMAT','IELTS','LSAT','MCAT','SAT','TOEFL',
    'Animation','Architecture','Business','Communication','Creative Writing',
    'Fashion Design','Film & Video','Marketing','Management','Performing Arts',
    'Psychology','Law','Journalism',
    'DSA','Programming','Python','JavaScript','System Design',
    'Full Stack Development','Computer Science','Database','Game Development',
    'AI/ML','Artificial Intelligence','Blockchain','Cloud Computing','Cybersecurity',
    'Data Science','DevOps','Machine Learning','Mobile Development','Web Development',
    'UI/UX Design','Digital Marketing','Finance','Fine Arts','Graphic Design',
    'Music','Photography',
    'CAT','GATE','GRE','JEE','NEET','UPSC',
    'Design','Education','Environmental Science','Health & Fitness',
    'Interior Design','Investment','Accounting','Culinary Arts',
    'Project Management','Networking','General','Development',
    'Computer Applications','Business Administration','Business & Management'
  ];
  domain_map jsonb := '{
    "AI/ML": "Machine Learning",
    "Artificial Intelligence": "Machine Learning",
    "Design": "Graphic Design",
    "Investment": "Finance",
    "Accounting": "Finance",
    "Education": "Communication",
    "Environmental Science": "Data Science",
    "Health & Fitness": "Psychology",
    "Interior Design": "Architecture",
    "Culinary Arts": "Creative Writing",
    "Project Management": "Management",
    "Networking": "Computer Science",
    "General": "Programming",
    "Development": "Web Development",
    "Computer Applications": "Computer Science",
    "Business Administration": "Business",
    "Business & Management": "Management"
  }'::jsonb;
  mapped_domain text;
BEGIN
  FOREACH cat IN ARRAY categories LOOP
    IF domain_map ? cat THEN
      mapped_domain := domain_map ->> cat;
    ELSE
      mapped_domain := cat;
    END IF;

    FOR diff IN SELECT unnest(ARRAY['beginner','intermediate','advanced','expert']) LOOP
      SELECT sn.id INTO node_id
      FROM skill_nodes sn
      WHERE sn.domain = mapped_domain AND sn.is_active = true
        AND sn.difficulty_level = (CASE WHEN diff = 'expert' THEN 'advanced' ELSE diff END)
      ORDER BY sn.display_order ASC
      LIMIT 1;

      IF node_id IS NULL THEN
        SELECT sn.id INTO node_id
        FROM skill_nodes sn
        WHERE sn.domain = mapped_domain AND sn.is_active = true
        ORDER BY sn.display_order ASC
        LIMIT 1;
      END IF;

      IF node_id IS NOT NULL THEN
        UPDATE resources
        SET skill_node_id = node_id
        WHERE category = cat
          AND difficulty = diff
          AND skill_node_id IS NULL
          AND is_active = true;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;
