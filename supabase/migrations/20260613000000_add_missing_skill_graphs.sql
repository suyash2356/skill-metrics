-- ============================================================
-- Add Missing Skill Graphs for Explore Page Domains
-- 12 domains: Computer Applications, Networking (tech)
--             Economics, Human Resources, Education,
--             Environmental Science, Health & Fitness,
--             Culinary Arts, Interior Design, Philosophy,
--             Political Science, Social Work (non-tech)
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- PART 1: SKILL NODES
-- ═══════════════════════════════════════════════════════════

-- ─── TECH: Computer Applications (general IT literacy, 5 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Computer Fundamentals', 'Computer Applications', 'Fundamentals', 'beginner', 'tech', 1, 15,
 'Core hardware and software concepts — how computers work, operating systems, file management, and digital literacy essentials.',
 ARRAY['Identify hardware components and their functions', 'Navigate Windows/macOS/Linux operating systems', 'Manage files, folders, and storage effectively', 'Understand binary, memory, and processing basics']),

('Office Productivity Suite', 'Computer Applications', 'Productivity', 'beginner', 'tech', 2, 20,
 'Master word processing, spreadsheets, and presentations — the backbone of every office job.',
 ARRAY['Create professional documents in Word/Google Docs', 'Build formulas, charts, and pivot tables in Excel/Sheets', 'Design effective presentations in PowerPoint/Slides', 'Use templates and mail merge for productivity']),

('Internet & Digital Collaboration', 'Computer Applications', 'Digital Tools', 'intermediate', 'tech', 3, 15,
 'Navigate the web effectively, use cloud tools, and collaborate digitally across teams.',
 ARRAY['Use web browsers, search engines, and bookmarks efficiently', 'Set up and manage email and calendar systems', 'Collaborate via Google Workspace, Microsoft 365, or Notion', 'Understand cloud storage, sharing permissions, and version control']),

('Database & Information Systems', 'Computer Applications', 'Data Management', 'intermediate', 'tech', 4, 20,
 'Understand how data is organized, stored, and retrieved — from simple databases to information systems.',
 ARRAY['Design simple relational databases', 'Write basic SQL queries (SELECT, INSERT, JOIN)', 'Use Microsoft Access or Google Forms for data collection', 'Understand data integrity, normalization, and backups']),

('IT Support & Troubleshooting', 'Computer Applications', 'Support', 'advanced', 'tech', 5, 20,
 'Diagnose common hardware/software issues, set up systems, and provide basic technical support.',
 ARRAY['Troubleshoot OS, network, and peripheral issues', 'Install and configure software and drivers', 'Perform system maintenance, updates, and security scans', 'Provide help desk support and document solutions'])
ON CONFLICT (name) DO NOTHING;

-- ─── TECH: Networking (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Networking Concepts & OSI Model', 'Networking', 'Fundamentals', 'beginner', 'tech', 1, 15,
 'Understand how networks communicate — the OSI and TCP/IP models, IP addressing, and basic terminology.',
 ARRAY['Explain the 7 layers of the OSI model', 'Understand TCP/IP protocol stack', 'Calculate and assign IP addresses and subnets', 'Differentiate between LAN, WAN, MAN, and PAN']),

('Network Devices & Cabling', 'Networking', 'Infrastructure', 'beginner', 'tech', 2, 15,
 'Learn about routers, switches, access points, cabling standards, and physical network design.',
 ARRAY['Identify routers, switches, hubs, and access points', 'Understand Ethernet cabling standards (Cat5e, Cat6, fiber)', 'Design basic network topologies (star, mesh, bus)', 'Configure basic switch and router settings']),

('Network Protocols & Services', 'Networking', 'Protocols', 'intermediate', 'tech', 3, 25,
 'Deep dive into DNS, DHCP, HTTP/S, FTP, SSH, and how these protocols power the internet.',
 ARRAY['Configure DNS and DHCP services', 'Understand HTTP/HTTPS request-response cycle', 'Use SSH and FTP for remote access and file transfer', 'Analyze network traffic with Wireshark']),

('Network Security Essentials', 'Networking', 'Security', 'intermediate', 'tech', 4, 20,
 'Protect networks with firewalls, VPNs, encryption, access control, and security best practices.',
 ARRAY['Configure firewall rules and ACLs', 'Set up VPN tunnels for secure remote access', 'Implement WPA3 and 802.1X authentication', 'Understand common attack vectors and mitigation']),

('Wireless & Cloud Networking', 'Networking', 'Modern', 'intermediate', 'tech', 5, 20,
 'Master Wi-Fi standards, cloud networking concepts, SDN, and modern network architectures.',
 ARRAY['Configure enterprise Wi-Fi (802.11ax/Wi-Fi 6)', 'Understand cloud VPC, subnets, and security groups', 'Grasp SDN and network function virtualization (NFV)', 'Design hybrid on-prem + cloud network architectures']),

('Network Administration & Monitoring', 'Networking', 'Operations', 'advanced', 'tech', 6, 25,
 'Monitor, diagnose, and optimize network performance using professional tools and methodologies.',
 ARRAY['Use SNMP, NetFlow, and monitoring dashboards', 'Diagnose latency, packet loss, and bottlenecks', 'Implement QoS policies and traffic shaping', 'Create network documentation and disaster recovery plans']),

('Network Certification Prep (CCNA/Network+)', 'Networking', 'Certification', 'advanced', 'tech', 7, 30,
 'Prepare for industry-recognized certifications — Cisco CCNA or CompTIA Network+ — with exam strategies and practice.',
 ARRAY['Master all CCNA/Network+ exam objectives', 'Complete hands-on labs with Packet Tracer or GNS3', 'Pass timed practice exams with 85%+ accuracy', 'Build a professional networking portfolio'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Economics (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Microeconomics Foundations', 'Economics', 'Microeconomics', 'beginner', 'non-tech', 1, 20,
 'How individuals and firms make decisions — supply, demand, market structures, and price mechanisms.',
 ARRAY['Analyze supply and demand curves and equilibrium', 'Calculate price elasticity of demand and supply', 'Compare perfect competition, monopoly, and oligopoly', 'Understand consumer and producer surplus']),

('Macroeconomics Essentials', 'Economics', 'Macroeconomics', 'beginner', 'non-tech', 2, 25,
 'The big picture — GDP, inflation, unemployment, monetary and fiscal policy, and economic growth.',
 ARRAY['Measure GDP using expenditure, income, and production methods', 'Explain the causes and effects of inflation and deflation', 'Analyze monetary policy tools (interest rates, open market operations)', 'Understand fiscal policy, government budgets, and national debt']),

('International Trade & Finance', 'Economics', 'International', 'intermediate', 'non-tech', 3, 20,
 'Global economics — trade theory, exchange rates, balance of payments, and international institutions.',
 ARRAY['Apply comparative advantage and trade models', 'Analyze exchange rate determination and currency markets', 'Interpret balance of payments accounts', 'Evaluate roles of WTO, IMF, and World Bank']),

('Econometrics & Data Analysis', 'Economics', 'Quantitative', 'intermediate', 'non-tech', 4, 25,
 'Apply statistical and mathematical tools to economic data — regression, forecasting, and hypothesis testing.',
 ARRAY['Run linear and multiple regression analyses', 'Test hypotheses using t-tests and F-tests', 'Build time-series models for economic forecasting', 'Use Excel, R, or Stata for economic data analysis']),

('Indian Economy & Current Affairs', 'Economics', 'Applied', 'intermediate', 'non-tech', 5, 20,
 'Understand the Indian economic landscape — planning, reforms, sectors, and current economic developments.',
 ARRAY['Trace India economic reforms from 1991 to present', 'Analyze agriculture, industry, and services sectors', 'Understand GST, demonetization, and recent policy changes', 'Connect global economic trends to Indian markets']),

('Development & Behavioral Economics', 'Economics', 'Advanced', 'advanced', 'non-tech', 6, 20,
 'Advanced topics — growth theory, poverty analysis, behavioral biases, nudge theory, and policy evaluation.',
 ARRAY['Apply Solow and endogenous growth models', 'Evaluate poverty and inequality using Gini and HDI', 'Understand behavioral biases (anchoring, framing, loss aversion)', 'Design and evaluate policy interventions using RCTs']),

('Economics Career & Research', 'Economics', 'Professional', 'advanced', 'non-tech', 7, 15,
 'Prepare for careers in economics — research methodology, paper writing, and professional pathways.',
 ARRAY['Write a research proposal with literature review', 'Present economic analysis with data visualizations', 'Explore career paths: policy analyst, economist, consultant', 'Build a portfolio of economic analysis projects'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Human Resources (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('HR Fundamentals', 'Human Resources', 'Core', 'beginner', 'non-tech', 1, 15,
 'The building blocks of HR — functions, organizational structure, employment law, and the employee lifecycle.',
 ARRAY['Define core HR functions and responsibilities', 'Understand employment law basics (contracts, compliance)', 'Map the employee lifecycle from hire to exit', 'Navigate organizational structures and reporting lines']),

('Talent Acquisition & Recruitment', 'Human Resources', 'Recruitment', 'beginner', 'non-tech', 2, 20,
 'Source, screen, interview, and onboard the right candidates — the most visible HR function.',
 ARRAY['Write effective job descriptions and person specifications', 'Source candidates via job boards, LinkedIn, and referrals', 'Conduct structured behavioral and competency interviews', 'Design onboarding programs that improve retention']),

('Learning & Development', 'Human Resources', 'L&D', 'intermediate', 'non-tech', 3, 20,
 'Design training programs, manage performance, and support employee career growth.',
 ARRAY['Conduct training needs analysis (TNA)', 'Design learning programs using ADDIE or SAM models', 'Set SMART goals and manage performance review cycles', 'Create individual development plans (IDPs)']),

('Compensation & Benefits', 'Human Resources', 'Comp & Ben', 'intermediate', 'non-tech', 4, 20,
 'Structure salaries, administer benefits, and ensure pay equity across the organization.',
 ARRAY['Design salary structures and pay bands', 'Administer health insurance, retirement, and perks', 'Conduct market compensation benchmarking', 'Ensure pay equity and legal compliance']),

('Employee Relations & Labor Law', 'Human Resources', 'ER', 'intermediate', 'non-tech', 5, 20,
 'Handle grievances, disciplinary processes, union relations, and workplace conflict resolution.',
 ARRAY['Manage grievance and disciplinary procedures', 'Understand labor laws and employee rights', 'Mediate workplace conflicts professionally', 'Maintain compliance with POSH, PF, and ESI regulations']),

('HR Analytics & Technology', 'Human Resources', 'Analytics', 'advanced', 'non-tech', 6, 20,
 'Use data and HR technology to drive workforce decisions — metrics, dashboards, and HRIS platforms.',
 ARRAY['Calculate key HR metrics (turnover, time-to-fill, eNPS)', 'Build HR dashboards for executive reporting', 'Implement and manage HRIS platforms (Workday, BambooHR)', 'Use predictive analytics for workforce planning']),

('HR Strategy & Leadership', 'Human Resources', 'Strategic', 'advanced', 'non-tech', 7, 15,
 'Align HR with business strategy — CHRO-level thinking, organizational design, and change management.',
 ARRAY['Develop HR strategy aligned with business goals', 'Lead organizational design and restructuring', 'Drive change management using Kotter or ADKAR models', 'Build employer brand and culture strategy'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Education (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Foundations of Education', 'Education', 'Foundations', 'beginner', 'non-tech', 1, 15,
 'Education philosophy, learning theories (Piaget, Vygotsky, Bloom), and the history of modern education.',
 ARRAY['Compare major learning theories and their classroom impact', 'Understand Bloom''s taxonomy and its application', 'Trace the evolution of education systems globally', 'Articulate a personal teaching philosophy']),

('Instructional Design & Pedagogy', 'Education', 'Pedagogy', 'beginner', 'non-tech', 2, 20,
 'Plan effective lessons, design assessments, and apply evidence-based teaching strategies.',
 ARRAY['Write learning objectives using Bloom''s taxonomy', 'Design lesson plans with engage-explore-explain flow', 'Create formative and summative assessments', 'Apply differentiated instruction for diverse learners']),

('Classroom Management', 'Education', 'Management', 'intermediate', 'non-tech', 3, 20,
 'Establish routines, manage behavior, build positive classroom culture, and handle challenging situations.',
 ARRAY['Establish classroom rules and routines', 'Apply positive behavior reinforcement strategies', 'Handle disruptive behavior with de-escalation techniques', 'Create an inclusive and safe learning environment']),

('Educational Technology', 'Education', 'EdTech', 'intermediate', 'non-tech', 4, 20,
 'Integrate technology into teaching — LMS platforms, interactive tools, blended learning, and digital assessment.',
 ARRAY['Use LMS platforms (Google Classroom, Canvas, Moodle)', 'Create interactive lessons with Kahoot, Nearpod, Padlet', 'Design blended and flipped classroom experiences', 'Assess student learning with digital rubrics and analytics']),

('Curriculum Development', 'Education', 'Curriculum', 'intermediate', 'non-tech', 5, 25,
 'Design, align, and evaluate curricula — standards mapping, scope and sequence, and backward design.',
 ARRAY['Apply backward design (Understanding by Design framework)', 'Align curriculum to national and state standards', 'Create scope and sequence documents', 'Evaluate and revise curriculum based on student outcomes']),

('Special Education & Inclusive Practices', 'Education', 'Inclusion', 'advanced', 'non-tech', 6, 20,
 'Support diverse learners — IEPs, accommodations, universal design for learning, and inclusive pedagogy.',
 ARRAY['Develop Individualized Education Programs (IEPs)', 'Apply Universal Design for Learning (UDL) principles', 'Implement accommodations for students with disabilities', 'Collaborate with parents, specialists, and support staff']),

('Educational Leadership & Research', 'Education', 'Leadership', 'advanced', 'non-tech', 7, 20,
 'Lead schools, conduct action research, analyze education policy, and drive institutional improvement.',
 ARRAY['Conduct action research in educational settings', 'Analyze education policy and its classroom impact', 'Lead professional development for teaching staff', 'Develop school improvement plans with data-driven goals'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Environmental Science (semi-career, 6 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Earth Systems & Ecology', 'Environmental Science', 'Ecology', 'beginner', 'non-tech', 1, 20,
 'Understand ecosystems, biogeochemical cycles, biodiversity, and the interconnectedness of Earth''s systems.',
 ARRAY['Describe major biomes and ecosystem types', 'Explain carbon, nitrogen, and water cycles', 'Analyze food webs, trophic levels, and energy flow', 'Assess biodiversity and its importance to ecosystem health']),

('Environmental Chemistry & Pollution', 'Environmental Science', 'Chemistry', 'beginner', 'non-tech', 2, 20,
 'Study air, water, and soil quality — pollutants, their sources, health impacts, and remediation methods.',
 ARRAY['Identify major air, water, and soil pollutants', 'Understand chemical processes behind acid rain and ozone depletion', 'Evaluate water treatment and waste management methods', 'Assess toxicology basics and human health impacts']),

('Climate Change & Energy', 'Environmental Science', 'Climate', 'intermediate', 'non-tech', 3, 25,
 'The science of climate change — greenhouse effect, carbon footprint, renewable energy, and mitigation strategies.',
 ARRAY['Explain greenhouse gas mechanisms and global warming', 'Calculate personal and organizational carbon footprints', 'Compare renewable energy sources (solar, wind, hydro, nuclear)', 'Evaluate climate change mitigation and adaptation strategies']),

('Conservation & Resource Management', 'Environmental Science', 'Conservation', 'intermediate', 'non-tech', 4, 20,
 'Manage natural resources sustainably — wildlife conservation, forestry, water resources, and sustainable agriculture.',
 ARRAY['Design wildlife conservation and habitat restoration plans', 'Apply sustainable agriculture and forestry practices', 'Manage water resources and watershed planning', 'Understand protected area management and biodiversity hotspots']),

('Environmental Policy & Impact Assessment', 'Environmental Science', 'Policy', 'advanced', 'non-tech', 5, 20,
 'Navigate environmental law, conduct EIAs, write sustainability reports, and advocate for policy change.',
 ARRAY['Conduct Environmental Impact Assessments (EIA)', 'Understand key environmental legislation (EPA, Paris Agreement)', 'Write sustainability and ESG reports', 'Evaluate environmental policy effectiveness and advocate for change']),

('Environmental Research & Careers', 'Environmental Science', 'Professional', 'advanced', 'non-tech', 6, 15,
 'Apply research methods to environmental problems and explore career pathways in the environmental sector.',
 ARRAY['Design and conduct field and lab environmental research', 'Use GIS and remote sensing for environmental analysis', 'Explore careers: environmental consultant, conservation officer, ESG analyst', 'Present environmental research findings professionally'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Health & Fitness (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Anatomy & Physiology Basics', 'Health & Fitness', 'Foundations', 'beginner', 'non-tech', 1, 20,
 'Understand the human body — musculoskeletal, cardiovascular, respiratory, and nervous systems.',
 ARRAY['Identify major muscles, bones, and joints', 'Explain cardiovascular and respiratory physiology', 'Understand nervous system basics and muscle contraction', 'Relate anatomy to movement and exercise']),

('Nutrition Science', 'Health & Fitness', 'Nutrition', 'beginner', 'non-tech', 2, 20,
 'Master macronutrients, micronutrients, meal planning, dietary guidelines, and sports nutrition basics.',
 ARRAY['Calculate macronutrient ratios for different goals', 'Design balanced meal plans for weight loss, gain, and maintenance', 'Understand vitamins, minerals, and hydration needs', 'Evaluate popular diets with evidence-based thinking']),

('Exercise Science & Training Principles', 'Health & Fitness', 'Training', 'intermediate', 'non-tech', 3, 25,
 'The science behind training — progressive overload, periodization, energy systems, and biomechanics.',
 ARRAY['Apply progressive overload and training volume principles', 'Design periodized training programs (linear, undulating)', 'Understand energy systems (ATP-PC, glycolytic, oxidative)', 'Analyze movement patterns and biomechanics']),

('Strength & Conditioning Programming', 'Health & Fitness', 'Programming', 'intermediate', 'non-tech', 4, 25,
 'Build real training programs — resistance training, cardio programming, flexibility, and recovery protocols.',
 ARRAY['Design resistance training programs for different goals', 'Create cardiovascular training plans (HIIT, LISS, zone training)', 'Implement flexibility, mobility, and recovery protocols', 'Program for special populations (seniors, beginners, athletes)']),

('Mental Health & Wellness', 'Health & Fitness', 'Wellness', 'intermediate', 'non-tech', 5, 20,
 'Understand stress management, mindfulness, sleep science, and the mind-body connection.',
 ARRAY['Apply stress management and relaxation techniques', 'Understand sleep science and hygiene practices', 'Practice mindfulness and meditation fundamentals', 'Recognize signs of burnout, anxiety, and depression']),

('Fitness Assessment & Coaching', 'Health & Fitness', 'Coaching', 'advanced', 'non-tech', 6, 25,
 'Assess clients professionally — body composition, movement screens, fitness tests, and coaching communication.',
 ARRAY['Conduct body composition and fitness assessments', 'Perform movement screens (FMS) and corrective exercise', 'Apply motivational interviewing and behavior change techniques', 'Set SMART goals and track client progress']),

('Fitness Certification & Business', 'Health & Fitness', 'Professional', 'advanced', 'non-tech', 7, 20,
 'Prepare for industry certifications (ACE, NASM, ISSA) and build a fitness coaching business.',
 ARRAY['Master certification exam content (ACE/NASM/ISSA)', 'Build a personal training business and client base', 'Create online coaching programs and content', 'Understand liability, insurance, and professional ethics'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Culinary Arts (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Kitchen Fundamentals', 'Culinary Arts', 'Basics', 'beginner', 'non-tech', 1, 15,
 'The foundation of every chef — knife skills, mise en place, kitchen safety, hygiene, and equipment mastery.',
 ARRAY['Master essential knife cuts (brunoise, julienne, chiffonade)', 'Practice mise en place and kitchen organization', 'Follow food safety and HACCP hygiene standards', 'Identify and use professional kitchen equipment']),

('Cooking Techniques & Methods', 'Culinary Arts', 'Techniques', 'beginner', 'non-tech', 2, 25,
 'Master core cooking methods — sauteing, braising, roasting, grilling, steaming, and sauce making.',
 ARRAY['Execute dry-heat methods (roast, grill, saute, fry)', 'Execute moist-heat methods (braise, steam, poach, simmer)', 'Prepare the five French mother sauces', 'Control heat, timing, and seasoning for consistent results']),

('World Cuisines & Flavor Profiles', 'Culinary Arts', 'Cuisines', 'intermediate', 'non-tech', 3, 25,
 'Explore global culinary traditions — Indian, Italian, Japanese, Mexican, Thai, and Middle Eastern cuisines.',
 ARRAY['Identify signature ingredients and techniques of major cuisines', 'Understand spice blending and flavor pairing principles', 'Prepare dishes from at least 5 different global traditions', 'Adapt traditional recipes with modern techniques']),

('Baking & Pastry Arts', 'Culinary Arts', 'Baking', 'intermediate', 'non-tech', 4, 25,
 'The science and art of baking — bread, pastry, desserts, chocolate work, and sugar craft.',
 ARRAY['Understand gluten development, fermentation, and leavening', 'Bake artisan breads, croissants, and laminated doughs', 'Create plated desserts, tarts, and chocolate work', 'Apply baker''s percentages and formula scaling']),

('Advanced Culinary Techniques', 'Culinary Arts', 'Advanced', 'intermediate', 'non-tech', 5, 20,
 'Elevate your cooking — molecular gastronomy, sous vide, fermentation, and plating aesthetics.',
 ARRAY['Apply sous vide cooking for precision results', 'Understand basic molecular gastronomy (spherification, gelification)', 'Create fermented foods (kimchi, sourdough, kombucha)', 'Design restaurant-quality plating and presentation']),

('Menu Design & Food Costing', 'Culinary Arts', 'Business', 'advanced', 'non-tech', 6, 20,
 'Design profitable menus, calculate food costs, manage inventory, and understand restaurant economics.',
 ARRAY['Calculate food cost percentages and recipe costing', 'Design menus using engineering and psychology principles', 'Manage inventory, ordering, and waste reduction', 'Understand pricing strategies and profit margins']),

('Culinary Career & Restaurant Management', 'Culinary Arts', 'Professional', 'advanced', 'non-tech', 7, 15,
 'Launch your culinary career — kitchen brigade, restaurant operations, food entrepreneurship, and portfolio building.',
 ARRAY['Understand the kitchen brigade system and career ladder', 'Manage front-of-house and back-of-house operations', 'Develop a food business plan or personal chef brand', 'Build a culinary portfolio with photos and recipes'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Interior Design (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Design Principles & Space Planning', 'Interior Design', 'Fundamentals', 'beginner', 'non-tech', 1, 15,
 'Core design elements — balance, proportion, scale, spatial relationships, and functional planning.',
 ARRAY['Apply elements of design (line, form, texture, color)', 'Understand principles of balance, rhythm, and emphasis', 'Create functional space plans with proper circulation', 'Measure and draw room layouts to scale']),

('Color Theory & Materials', 'Interior Design', 'Materials', 'beginner', 'non-tech', 2, 20,
 'Master color psychology, fabric selection, finishes, and sustainable material choices.',
 ARRAY['Create harmonious color palettes for interiors', 'Select textiles, wall coverings, and flooring materials', 'Understand sustainable and eco-friendly material options', 'Build material boards and finish schedules']),

('Interior Drafting & CAD', 'Interior Design', 'Technical', 'intermediate', 'non-tech', 3, 25,
 'Technical drawing skills — AutoCAD, SketchUp, hand drafting, and 3D visualization.',
 ARRAY['Create floor plans, elevations, and sections in AutoCAD', 'Build 3D models using SketchUp or Revit', 'Render photorealistic visualizations', 'Produce professional drawing sets with annotations']),

('Residential Interior Design', 'Interior Design', 'Residential', 'intermediate', 'non-tech', 4, 25,
 'Design complete residential spaces — living rooms, bedrooms, kitchens, and bathrooms.',
 ARRAY['Design functional kitchen and bathroom layouts', 'Select furniture, fixtures, and lighting for residential spaces', 'Create mood boards and concept presentations', 'Coordinate with contractors and vendors']),

('Commercial & Hospitality Design', 'Interior Design', 'Commercial', 'intermediate', 'non-tech', 5, 25,
 'Design offices, retail spaces, restaurants, and hotels — understanding commercial codes and client needs.',
 ARRAY['Design office layouts for productivity and collaboration', 'Create retail spaces that drive customer engagement', 'Understand ADA accessibility and building code requirements', 'Design hospitality spaces (restaurants, hotels, lobbies)']),

('Lighting & Furniture Design', 'Interior Design', 'Specialization', 'advanced', 'non-tech', 6, 20,
 'Specialize in lighting design and custom furniture — the details that transform spaces.',
 ARRAY['Design layered lighting plans (ambient, task, accent)', 'Specify lighting fixtures and understand lumen/kelvin ratings', 'Design or customize furniture pieces', 'Create detailed specifications and procurement lists']),

('Interior Design Practice & Portfolio', 'Interior Design', 'Professional', 'advanced', 'non-tech', 7, 20,
 'Launch your design practice — client management, project management, pricing, and professional portfolio.',
 ARRAY['Build a professional design portfolio with case studies', 'Manage client relationships and design presentations', 'Create project timelines, budgets, and billing structures', 'Understand business licensing and professional certifications'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Philosophy (general knowledge, 5 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Introduction to Philosophy', 'Philosophy', 'Overview', 'beginner', 'non-tech', 1, 15,
 'The big questions — major branches, key thinkers (Socrates, Plato, Aristotle, Descartes), and philosophical method.',
 ARRAY['Identify major branches of philosophy (epistemology, ethics, metaphysics)', 'Understand key arguments from Socrates, Plato, and Aristotle', 'Apply the Socratic method of questioning', 'Read and analyze philosophical texts critically']),

('Ethics & Moral Philosophy', 'Philosophy', 'Ethics', 'beginner', 'non-tech', 2, 20,
 'What is right and wrong? Explore utilitarianism, deontology, virtue ethics, and applied moral dilemmas.',
 ARRAY['Compare utilitarian, deontological, and virtue ethics frameworks', 'Analyze real-world moral dilemmas using ethical theories', 'Understand applied ethics (bioethics, business ethics, environmental ethics)', 'Construct and defend moral arguments']),

('Logic & Critical Thinking', 'Philosophy', 'Logic', 'intermediate', 'non-tech', 3, 20,
 'Sharpen reasoning — formal logic, informal fallacies, argument structure, and analytical thinking.',
 ARRAY['Identify valid and invalid argument forms', 'Detect common logical fallacies in everyday reasoning', 'Construct truth tables and symbolic logic proofs', 'Apply critical thinking to evaluate claims and evidence']),

('Political & Social Philosophy', 'Philosophy', 'Political', 'intermediate', 'non-tech', 4, 20,
 'Justice, rights, freedom, and the social contract — from Hobbes and Locke to Rawls and Nozick.',
 ARRAY['Understand social contract theories (Hobbes, Locke, Rousseau)', 'Analyze Rawls theory of justice and the veil of ignorance', 'Debate concepts of liberty, equality, and authority', 'Apply political philosophy to contemporary social issues']),

('Philosophy of Mind & Metaphysics', 'Philosophy', 'Metaphysics', 'advanced', 'non-tech', 5, 20,
 'Deep topics — consciousness, free will, personal identity, the nature of reality, and existence.',
 ARRAY['Explore the mind-body problem and consciousness theories', 'Analyze arguments for and against free will', 'Understand personal identity and what makes you "you"', 'Engage with metaphysical questions about existence and reality'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Political Science (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Political Theory Foundations', 'Political Science', 'Theory', 'beginner', 'non-tech', 1, 15,
 'Core political concepts — democracy, political ideologies, governance structures, and the state.',
 ARRAY['Define and compare political ideologies (liberalism, conservatism, socialism)', 'Understand forms of government (democracy, authoritarianism, monarchy)', 'Analyze the concept of sovereignty and the nation-state', 'Read foundational political texts (The Republic, Leviathan, The Prince)']),

('Comparative Politics', 'Political Science', 'Comparative', 'beginner', 'non-tech', 2, 20,
 'Compare political systems across the world — institutions, elections, parties, and regime types.',
 ARRAY['Compare parliamentary, presidential, and semi-presidential systems', 'Analyze electoral systems (FPTP, PR, mixed)', 'Understand political party systems and coalition dynamics', 'Evaluate democratic backsliding and regime change patterns']),

('Indian Political System', 'Political Science', 'Indian Politics', 'intermediate', 'non-tech', 3, 25,
 'Deep dive into Indian democracy — Constitution, Parliament, federalism, judiciary, and elections.',
 ARRAY['Understand the Indian Constitution and its key features', 'Analyze the structure of Parliament and legislative process', 'Evaluate Indian federalism and center-state relations', 'Examine the role of the Election Commission and judiciary']),

('International Relations', 'Political Science', 'IR', 'intermediate', 'non-tech', 4, 25,
 'Global politics — IR theories, diplomacy, international organizations, security studies, and geopolitics.',
 ARRAY['Apply IR theories (realism, liberalism, constructivism)', 'Analyze the role of UN, NATO, EU, and other international bodies', 'Understand nuclear deterrence and security dilemmas', 'Evaluate India''s foreign policy and geopolitical positioning']),

('Public Policy & Administration', 'Political Science', 'Policy', 'intermediate', 'non-tech', 5, 20,
 'How policy is made, implemented, and evaluated — the policy cycle, bureaucracy, and governance.',
 ARRAY['Map the policy cycle (agenda setting, formulation, implementation, evaluation)', 'Analyze bureaucratic structures and public management reforms', 'Evaluate policy outcomes using cost-benefit and impact analysis', 'Understand e-governance and digital public infrastructure']),

('Political Research Methods', 'Political Science', 'Research', 'advanced', 'non-tech', 6, 20,
 'Research design for political science — surveys, case studies, content analysis, and quantitative methods.',
 ARRAY['Design surveys and questionnaires for political research', 'Conduct qualitative case studies and process tracing', 'Apply quantitative methods and statistical analysis', 'Write research papers following political science conventions']),

('Political Science Careers & Competitive Exams', 'Political Science', 'Professional', 'advanced', 'non-tech', 7, 15,
 'Career pathways — civil services (UPSC), think tanks, policy research, journalism, and international organizations.',
 ARRAY['Prepare Political Science optional for UPSC', 'Explore careers in policy research, think tanks, and NGOs', 'Build a research portfolio and publication record', 'Network in political science and international affairs communities'])
ON CONFLICT (name) DO NOTHING;

-- ─── NON-TECH: Social Work (career path, 7 nodes) ───
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Social Work Foundations', 'Social Work', 'Core', 'beginner', 'non-tech', 1, 15,
 'Values, ethics, and history of social work — understanding the profession and its commitment to social justice.',
 ARRAY['Understand social work values and the NASW Code of Ethics', 'Trace the history and evolution of social work as a profession', 'Define key concepts: social justice, empowerment, advocacy', 'Identify settings where social workers practice']),

('Human Behavior & Development', 'Social Work', 'HBSE', 'beginner', 'non-tech', 2, 20,
 'Understand human behavior across the life span — developmental stages, family systems, and cultural context.',
 ARRAY['Apply developmental theories (Erikson, Piaget, Bronfenbrenner)', 'Understand family systems and their impact on individuals', 'Practice cultural humility and anti-oppressive approaches', 'Assess the person-in-environment framework']),

('Social Welfare Policy', 'Social Work', 'Policy', 'intermediate', 'non-tech', 3, 20,
 'Analyze social welfare policies, understand advocacy processes, and evaluate programs for social justice.',
 ARRAY['Analyze key social welfare policies and legislation', 'Evaluate social programs using policy analysis frameworks', 'Understand the legislative advocacy process', 'Connect policy analysis to marginalized communities'' needs']),

('Casework & Counseling Skills', 'Social Work', 'Practice', 'intermediate', 'non-tech', 4, 25,
 'Individual and family practice — assessment, interviewing, intervention, case management, and documentation.',
 ARRAY['Conduct biopsychosocial assessments', 'Apply motivational interviewing and solution-focused techniques', 'Develop case plans and manage caseloads', 'Write professional case notes and documentation']),

('Group Work & Community Practice', 'Social Work', 'Community', 'intermediate', 'non-tech', 5, 20,
 'Work with groups and communities — group facilitation, community organizing, program development.',
 ARRAY['Facilitate therapeutic and task groups', 'Apply community organizing and development models', 'Design and implement community-based programs', 'Conduct needs assessments and asset mapping']),

('Clinical Social Work', 'Social Work', 'Clinical', 'advanced', 'non-tech', 6, 25,
 'Advanced clinical practice — mental health assessment, evidence-based therapies (CBT, DBT), and trauma-informed care.',
 ARRAY['Apply CBT, DBT, and trauma-informed approaches', 'Conduct mental health assessments using DSM-5', 'Develop treatment plans for individuals and families', 'Understand psychopharmacology basics and referral processes']),

('Social Work Leadership & Supervision', 'Social Work', 'Leadership', 'advanced', 'non-tech', 7, 15,
 'Lead teams, supervise fieldwork, evaluate programs, and advance in social work careers.',
 ARRAY['Provide clinical supervision to social work students', 'Evaluate program effectiveness using logic models', 'Lead and manage social service teams', 'Prepare for licensure (LCSW/LMSW) and career advancement'])
ON CONFLICT (name) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- PART 2: SKILL DEPENDENCIES
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
  -- Sequential chain domains (each node depends on the previous)
  seq_domains text[] := ARRAY[
    'Computer Applications',
    'Networking',
    'Economics',
    'Human Resources',
    'Education',
    'Environmental Science',
    'Health & Fitness',
    'Culinary Arts',
    'Interior Design',
    'Philosophy',
    'Political Science',
    'Social Work'
  ];
  d text;
  prev_id uuid;
  curr_id uuid;
  node_rec RECORD;
BEGIN
  -- Simple sequential dependencies for all domains
  FOREACH d IN ARRAY seq_domains LOOP
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

-- Add some branching dependencies for richer graphs

-- Economics: Macro can be taken alongside Micro (both are beginner)
-- International Trade requires both Micro and Macro
DO $$
DECLARE
  micro_id uuid;
  macro_id uuid;
  trade_id uuid;
BEGIN
  SELECT id INTO micro_id FROM skill_nodes WHERE domain='Economics' AND display_order=1 LIMIT 1;
  SELECT id INTO macro_id FROM skill_nodes WHERE domain='Economics' AND display_order=2 LIMIT 1;
  SELECT id INTO trade_id FROM skill_nodes WHERE domain='Economics' AND display_order=3 LIMIT 1;
  IF micro_id IS NOT NULL AND trade_id IS NOT NULL THEN
    -- Trade requires both micro and macro
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
    VALUES (trade_id, micro_id, 'required')
    ON CONFLICT DO NOTHING;
    -- Remove the sequential macro->trade since we added micro->trade directly
    -- (macro->trade already exists from sequential loop)
  END IF;
END;
$$;

-- Health & Fitness: Nutrition (2) doesn't require Anatomy (1) as hard prerequisite
-- Both Anatomy and Nutrition feed into Exercise Science (3)
DO $$
DECLARE
  n1 uuid; n2 uuid; n3 uuid;
BEGIN
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Health & Fitness' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Health & Fitness' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Health & Fitness' AND display_order=3 LIMIT 1;
  IF n1 IS NOT NULL AND n3 IS NOT NULL THEN
    -- Update: Nutrition recommended (not required) from Anatomy
    UPDATE skill_dependencies SET dependency_type = 'recommended'
    WHERE skill_id = n2 AND prerequisite_id = n1;
    -- Exercise Science requires Anatomy
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
    VALUES (n3, n1, 'required')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- Interior Design: Color Theory (2) can be taken alongside Space Planning (1)
-- CAD (3) requires Space Planning but Color Theory is recommended
DO $$
DECLARE
  n1 uuid; n2 uuid; n3 uuid;
BEGIN
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Interior Design' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Interior Design' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Interior Design' AND display_order=3 LIMIT 1;
  IF n1 IS NOT NULL AND n3 IS NOT NULL THEN
    -- Color Theory is recommended (not required) from Space Planning
    UPDATE skill_dependencies SET dependency_type = 'recommended'
    WHERE skill_id = n2 AND prerequisite_id = n1;
    -- CAD requires Space Planning
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
    VALUES (n3, n1, 'required')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- Political Science: Indian Political System (3) and International Relations (4)
-- both require Comparative Politics (2), but can be taken in parallel
DO $$
DECLARE
  n2 uuid; n3 uuid; n4 uuid;
BEGIN
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Political Science' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Political Science' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Political Science' AND display_order=4 LIMIT 1;
  IF n2 IS NOT NULL AND n4 IS NOT NULL THEN
    -- IR requires Comparative Politics (not Indian system)
    -- Remove the sequential n3->n4 and add n2->n4
    DELETE FROM skill_dependencies WHERE skill_id = n4 AND prerequisite_id = n3;
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
    VALUES (n4, n2, 'required')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- Social Work: Case Work (4) and Group Work (5) can be taken in parallel
-- Both require Social Welfare Policy (3)
DO $$
DECLARE
  n3 uuid; n4 uuid; n5 uuid;
BEGIN
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Social Work' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Social Work' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Social Work' AND display_order=5 LIMIT 1;
  IF n3 IS NOT NULL AND n5 IS NOT NULL THEN
    -- Group Work requires Policy (not Casework)
    DELETE FROM skill_dependencies WHERE skill_id = n5 AND prerequisite_id = n4;
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type)
    VALUES (n5, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- ═══════════════════════════════════════════════════════════
-- PART 3: LINK EXISTING RESOURCES TO SKILL NODES
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
  cat text;
  diff text;
  node_id uuid;
  categories text[] := ARRAY[
    'Computer Applications',
    'Networking',
    'Economics',
    'Human Resources',
    'Education', 'Education & Teaching',
    'Environmental Science',
    'Health & Fitness', 'Nutrition & Health',
    'Culinary Arts',
    'Interior Design',
    'Philosophy',
    'Political Science', 'International Relations',
    'Social Work'
  ];
  domain_map jsonb := '{
    "Education & Teaching": "Education",
    "Nutrition & Health": "Health & Fitness",
    "International Relations": "Political Science"
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
