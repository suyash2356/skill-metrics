
-- 1. ADD MISSING SKILL NODES

-- Mobile Development (tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Mobile UI Fundamentals', 'Mobile Development', 'Fundamentals', 'beginner', 'tech', 1, 15, 'Mobile UI/UX principles and platform guidelines', ARRAY['Mobile design patterns', 'Responsive layouts']),
('React Native Basics', 'Mobile Development', 'React Native', 'beginner', 'tech', 2, 25, 'Cross-platform apps with React Native', ARRAY['React Native setup', 'Navigation']),
('Native iOS Development', 'Mobile Development', 'iOS', 'intermediate', 'tech', 3, 30, 'iOS with Swift and SwiftUI', ARRAY['Swift programming', 'iOS APIs']),
('Native Android Development', 'Mobile Development', 'Android', 'intermediate', 'tech', 4, 30, 'Android with Kotlin', ARRAY['Kotlin basics', 'Jetpack Compose']),
('Mobile APIs & Storage', 'Mobile Development', 'Backend', 'intermediate', 'tech', 5, 20, 'API integration and state management', ARRAY['REST APIs', 'Local storage']),
('App Deployment', 'Mobile Development', 'Deployment', 'advanced', 'tech', 6, 15, 'App Store and Play Store publishing', ARRAY['App signing', 'Store submission'])
ON CONFLICT DO NOTHING;

-- DevOps (tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Linux & Shell Scripting', 'DevOps', 'Fundamentals', 'beginner', 'tech', 1, 20, 'Linux administration and scripting', ARRAY['Linux commands', 'Shell scripting']),
('Version Control & Git', 'DevOps', 'Fundamentals', 'beginner', 'tech', 2, 10, 'Git workflows and collaboration', ARRAY['Git branching', 'Pull requests']),
('Docker & Containers', 'DevOps', 'Containers', 'intermediate', 'tech', 3, 25, 'Containerization with Docker', ARRAY['Dockerfile', 'Docker Compose']),
('CI/CD Pipelines', 'DevOps', 'Automation', 'intermediate', 'tech', 4, 20, 'Automated CI/CD pipelines', ARRAY['Pipeline design', 'Automated testing']),
('Kubernetes', 'DevOps', 'Orchestration', 'advanced', 'tech', 5, 35, 'Container orchestration', ARRAY['Pod management', 'Helm charts']),
('Infrastructure as Code', 'DevOps', 'IaC', 'advanced', 'tech', 6, 25, 'Terraform and Ansible', ARRAY['Terraform modules', 'Cloud provisioning'])
ON CONFLICT DO NOTHING;

-- Blockchain (tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Blockchain Fundamentals', 'Blockchain', 'Core', 'beginner', 'tech', 1, 15, 'Distributed ledger and consensus', ARRAY['Blockchain architecture', 'Consensus algorithms']),
('Cryptocurrency & Tokenomics', 'Blockchain', 'Finance', 'beginner', 'tech', 2, 12, 'Bitcoin, Ethereum, tokens', ARRAY['Cryptocurrency mechanics', 'Token standards']),
('Smart Contracts with Solidity', 'Blockchain', 'Development', 'intermediate', 'tech', 3, 30, 'Ethereum smart contracts', ARRAY['Solidity programming', 'Contract deployment']),
('Web3 Development', 'Blockchain', 'Development', 'intermediate', 'tech', 4, 25, 'dApp development', ARRAY['Web3 libraries', 'Wallet integration']),
('DeFi & NFT Development', 'Blockchain', 'Advanced', 'advanced', 'tech', 5, 20, 'DeFi protocols and NFTs', ARRAY['DeFi protocols', 'NFT standards']),
('Blockchain Security', 'Blockchain', 'Security', 'advanced', 'tech', 6, 20, 'Smart contract auditing', ARRAY['Vulnerabilities', 'Audit techniques'])
ON CONFLICT DO NOTHING;

-- UI/UX Design (tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Design Thinking & UX Research', 'UI/UX Design', 'Research', 'beginner', 'tech', 1, 15, 'User research and personas', ARRAY['User interviews', 'Journey mapping']),
('Wireframing & Prototyping', 'UI/UX Design', 'Design', 'beginner', 'tech', 2, 20, 'Wireframes and prototypes', ARRAY['Low-fi wireframes', 'User flows']),
('Visual Design & UI Systems', 'UI/UX Design', 'Visual', 'intermediate', 'tech', 3, 25, 'Typography and design systems', ARRAY['Typography', 'Component libraries']),
('Figma & Design Tools', 'UI/UX Design', 'Tools', 'intermediate', 'tech', 4, 20, 'Professional design tools', ARRAY['Figma components', 'Auto layout']),
('Usability Testing', 'UI/UX Design', 'Testing', 'intermediate', 'tech', 5, 15, 'Usability testing methods', ARRAY['Test planning', 'A/B testing']),
('UX Portfolio & Career', 'UI/UX Design', 'Career', 'advanced', 'tech', 6, 15, 'Professional UX portfolio', ARRAY['Case studies', 'Interview prep'])
ON CONFLICT DO NOTHING;

-- UPSC (exam)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('UPSC Prelims - General Studies', 'UPSC', 'Prelims', 'beginner', 'exam', 1, 200, 'History, Geography, Polity, Economy', ARRAY['Indian History', 'Indian Polity']),
('UPSC Prelims - CSAT', 'UPSC', 'Prelims', 'intermediate', 'exam', 2, 100, 'Comprehension and reasoning', ARRAY['Reading comprehension', 'Logical reasoning']),
('UPSC Mains - Essay & Ethics', 'UPSC', 'Mains', 'intermediate', 'exam', 3, 150, 'Essay and ethics preparation', ARRAY['Essay structuring', 'Ethical frameworks']),
('UPSC Mains - GS Papers', 'UPSC', 'Mains', 'advanced', 'exam', 4, 300, 'General Studies papers I-IV', ARRAY['Answer writing', 'Current affairs']),
('UPSC Optional Subject', 'UPSC', 'Mains', 'advanced', 'exam', 5, 200, 'Optional subject preparation', ARRAY['Subject mastery', 'Answer practice']),
('UPSC Interview Preparation', 'UPSC', 'Interview', 'advanced', 'exam', 6, 50, 'Personality test prep', ARRAY['Communication', 'Current affairs'])
ON CONFLICT DO NOTHING;

-- Digital Marketing (non-tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Digital Marketing Fundamentals', 'Digital Marketing', 'Core', 'beginner', 'non-tech', 1, 15, 'Marketing channels and strategy', ARRAY['Marketing channels', 'KPI tracking']),
('SEO & Content Marketing', 'Digital Marketing', 'Organic', 'beginner', 'non-tech', 2, 20, 'SEO and content strategy', ARRAY['Keyword research', 'On-page SEO']),
('Social Media Marketing', 'Digital Marketing', 'Social', 'intermediate', 'non-tech', 3, 18, 'Social media strategies', ARRAY['Platform strategies', 'Community building']),
('Paid Advertising', 'Digital Marketing', 'Paid', 'intermediate', 'non-tech', 4, 20, 'Google Ads and PPC', ARRAY['PPC campaigns', 'Ad targeting']),
('Email & Automation', 'Digital Marketing', 'Automation', 'intermediate', 'non-tech', 5, 15, 'Email marketing automation', ARRAY['Email campaigns', 'Lead nurturing']),
('Analytics & Growth', 'Digital Marketing', 'Analytics', 'advanced', 'non-tech', 6, 20, 'Advanced analytics and growth', ARRAY['Google Analytics', 'Growth experiments'])
ON CONFLICT DO NOTHING;

-- Game Development (tech)
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Game Design Principles', 'Game Development', 'Design', 'beginner', 'tech', 1, 15, 'Game mechanics and level design', ARRAY['Game mechanics', 'Player motivation']),
('Programming for Games', 'Game Development', 'Programming', 'beginner', 'tech', 2, 25, 'C# or C++ for games', ARRAY['C# basics', 'OOP for games']),
('Unity Engine', 'Game Development', 'Engine', 'intermediate', 'tech', 3, 35, '2D and 3D games with Unity', ARRAY['Unity editor', '2D/3D development']),
('Game Physics & AI', 'Game Development', 'Systems', 'intermediate', 'tech', 4, 25, 'Physics and game AI', ARRAY['Physics simulation', 'AI pathfinding']),
('Multiplayer & Networking', 'Game Development', 'Networking', 'advanced', 'tech', 5, 25, 'Online multiplayer', ARRAY['Client-server', 'Netcode']),
('Game Publishing', 'Game Development', 'Business', 'advanced', 'tech', 6, 15, 'Publishing and monetization', ARRAY['Store publishing', 'Monetization'])
ON CONFLICT DO NOTHING;

-- Expand Web Development
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('TypeScript & Modern JS', 'Web Development', 'Language', 'intermediate', 'tech', 6, 20, 'TypeScript and modern patterns', ARRAY['TypeScript types', 'ES6+ features']),
('Backend Development', 'Web Development', 'Backend', 'intermediate', 'tech', 7, 30, 'Node.js and REST APIs', ARRAY['API design', 'Database integration']),
('Web Security & Performance', 'Web Development', 'Advanced', 'advanced', 'tech', 8, 20, 'Security and performance', ARRAY['OWASP top 10', 'Performance optimization'])
ON CONFLICT DO NOTHING;

-- Expand Data Science
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('Machine Learning for DS', 'Data Science', 'ML', 'intermediate', 'tech', 5, 30, 'Applied ML for data science', ARRAY['Supervised learning', 'Feature engineering']),
('Big Data Technologies', 'Data Science', 'Big Data', 'advanced', 'tech', 6, 25, 'Spark and distributed computing', ARRAY['Spark basics', 'Data pipelines'])
ON CONFLICT DO NOTHING;

-- Expand Machine Learning
INSERT INTO skill_nodes (name, domain, subdomain, difficulty_level, content_type, display_order, estimated_hours, description, learning_outcomes)
VALUES
('MLOps & Deployment', 'Machine Learning', 'Production', 'advanced', 'tech', 8, 20, 'Model deployment and MLOps', ARRAY['Model serving', 'Pipeline automation'])
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. ADD SKILL DEPENDENCIES
-- =============================================

DO $$
DECLARE
  n1 uuid; n2 uuid; n3 uuid; n4 uuid; n5 uuid; n6 uuid; n7 uuid; n8 uuid;
BEGIN

  -- Mobile Development
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Mobile Development' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n1, 'required'), (n4, n1, 'required'),
      (n5, n2, 'required'), (n6, n5, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- DevOps
  SELECT id INTO n1 FROM skill_nodes WHERE domain='DevOps' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='DevOps' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='DevOps' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='DevOps' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='DevOps' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='DevOps' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n1, 'required'), (n3, n2, 'required'), (n4, n2, 'required'),
      (n4, n3, 'required'), (n5, n3, 'required'), (n6, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Blockchain
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Blockchain' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Blockchain' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Blockchain' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Blockchain' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Blockchain' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Blockchain' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n1, 'required'), (n4, n3, 'required'),
      (n5, n3, 'required'), (n6, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- UI/UX Design
  SELECT id INTO n1 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required'), (n4, n2, 'required'),
      (n5, n3, 'required'), (n6, n5, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- UPSC
  SELECT id INTO n1 FROM skill_nodes WHERE domain='UPSC' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='UPSC' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='UPSC' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='UPSC' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='UPSC' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='UPSC' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n1, 'required'), (n3, n2, 'required'), (n4, n1, 'required'),
      (n5, n1, 'required'), (n6, n4, 'required'), (n6, n5, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Digital Marketing
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n1, 'required'), (n4, n1, 'required'),
      (n5, n3, 'recommended'), (n6, n2, 'required'), (n6, n4, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Game Development
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Game Development' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Game Development' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Game Development' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Game Development' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Game Development' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Game Development' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL AND n6 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n2, 'required'), (n4, n3, 'required'), (n5, n3, 'required'), (n6, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Cloud Computing
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required'), (n4, n2, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Cybersecurity
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n1, 'required'), (n3, n2, 'required'), (n4, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Data Science
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Data Science' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Data Science' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Data Science' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Data Science' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Data Science' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Data Science' AND display_order=6 LIMIT 1;
  IF n1 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'recommended'), (n3, n1, 'required'), (n4, n1, 'required')
    ON CONFLICT DO NOTHING;
    IF n5 IS NOT NULL THEN
      INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n5, n4, 'required') ON CONFLICT DO NOTHING;
    END IF;
    IF n6 IS NOT NULL THEN
      INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n6, n5, 'required') ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Finance
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Finance' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Finance' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Finance' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Finance' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n1, 'required'), (n4, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Fine Arts
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Fine Arts' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Fine Arts' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Fine Arts' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Fine Arts' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n2, 'required'), (n4, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Graphic Design
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Graphic Design' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Graphic Design' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Graphic Design' AND display_order=3 LIMIT 1;
  IF n1 IS NOT NULL AND n3 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Music
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Music' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Music' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Music' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Music' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n1, 'required')
    ON CONFLICT DO NOTHING;
    IF n4 IS NOT NULL THEN
      INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n4, n3, 'required') ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Photography
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Photography' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Photography' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Photography' AND display_order=3 LIMIT 1;
  IF n1 IS NOT NULL AND n3 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Web Development
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Web Development' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Web Development' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Web Development' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Web Development' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Web Development' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Web Development' AND display_order=6 LIMIT 1;
  SELECT id INTO n7 FROM skill_nodes WHERE domain='Web Development' AND display_order=7 LIMIT 1;
  SELECT id INTO n8 FROM skill_nodes WHERE domain='Web Development' AND display_order=8 LIMIT 1;
  IF n1 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required'), (n4, n3, 'required'), (n5, n4, 'required')
    ON CONFLICT DO NOTHING;
    IF n6 IS NOT NULL THEN INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n6, n3, 'required') ON CONFLICT DO NOTHING; END IF;
    IF n7 IS NOT NULL THEN INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n7, n6, 'required') ON CONFLICT DO NOTHING; END IF;
    IF n8 IS NOT NULL THEN INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n8, n7, 'required') ON CONFLICT DO NOTHING; END IF;
  END IF;

  -- Machine Learning
  SELECT id INTO n1 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=4 LIMIT 1;
  SELECT id INTO n5 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=5 LIMIT 1;
  SELECT id INTO n6 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=6 LIMIT 1;
  SELECT id INTO n7 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=7 LIMIT 1;
  SELECT id INTO n8 FROM skill_nodes WHERE domain='Machine Learning' AND display_order=8 LIMIT 1;
  IF n1 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required'), (n4, n3, 'required'),
      (n5, n3, 'required'), (n6, n4, 'required'), (n7, n5, 'required')
    ON CONFLICT DO NOTHING;
    IF n8 IS NOT NULL THEN INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES (n8, n6, 'recommended') ON CONFLICT DO NOTHING; END IF;
  END IF;

  -- GATE
  SELECT id INTO n1 FROM skill_nodes WHERE domain='GATE' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='GATE' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='GATE' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='GATE' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n2, n1, 'required'), (n3, n2, 'required'), (n4, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- CAT
  SELECT id INTO n1 FROM skill_nodes WHERE domain='CAT' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='CAT' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='CAT' AND display_order=3 LIMIT 1;
  SELECT id INTO n4 FROM skill_nodes WHERE domain='CAT' AND display_order=4 LIMIT 1;
  IF n1 IS NOT NULL AND n4 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n4, n1, 'required'), (n4, n2, 'required'), (n4, n3, 'required')
    ON CONFLICT DO NOTHING;
  END IF;

  -- GRE
  SELECT id INTO n1 FROM skill_nodes WHERE domain='GRE' AND display_order=1 LIMIT 1;
  SELECT id INTO n2 FROM skill_nodes WHERE domain='GRE' AND display_order=2 LIMIT 1;
  SELECT id INTO n3 FROM skill_nodes WHERE domain='GRE' AND display_order=3 LIMIT 1;
  IF n1 IS NOT NULL AND n3 IS NOT NULL THEN
    INSERT INTO skill_dependencies (skill_id, prerequisite_id, dependency_type) VALUES
      (n3, n1, 'recommended'), (n3, n2, 'recommended')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- =============================================
-- 3. LINK RESOURCES TO SKILL NODES
-- =============================================

-- Web Development
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=1 LIMIT 1)
WHERE category IN ('Web Development') AND difficulty = 'beginner' AND skill_node_id IS NULL
  AND (title ILIKE '%html%' OR title ILIKE '%css%' OR title ILIKE '%web basic%' OR description ILIKE '%html%css%');

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=3 LIMIT 1)
WHERE category IN ('Web Development', 'JavaScript') AND difficulty = 'beginner' AND skill_node_id IS NULL
  AND (title ILIKE '%javascript%' OR title ILIKE '%js %' OR category = 'JavaScript');

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=4 LIMIT 1)
WHERE category IN ('Web Development') AND skill_node_id IS NULL
  AND (title ILIKE '%react%' OR title ILIKE '%vue%' OR title ILIKE '%angular%' OR title ILIKE '%framework%');

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=7 LIMIT 1)
WHERE category IN ('Web Development') AND skill_node_id IS NULL
  AND (title ILIKE '%node%' OR title ILIKE '%express%' OR title ILIKE '%backend%' OR title ILIKE '%api%');

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=6 LIMIT 1)
WHERE category IN ('Web Development') AND skill_node_id IS NULL AND (title ILIKE '%typescript%');

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=2 LIMIT 1)
WHERE category IN ('Web Development') AND skill_node_id IS NULL AND difficulty = 'beginner';

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=5 LIMIT 1)
WHERE category IN ('Web Development') AND skill_node_id IS NULL;

-- AI/ML
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=1 LIMIT 1)
WHERE category IN ('AI/ML', 'Artificial Intelligence') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=3 LIMIT 1)
WHERE category IN ('AI/ML', 'Artificial Intelligence') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=5 LIMIT 1)
WHERE category IN ('AI/ML', 'Artificial Intelligence') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Data Science
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Data Science' AND display_order=1 LIMIT 1)
WHERE category = 'Data Science' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Data Science' AND display_order=3 LIMIT 1)
WHERE category = 'Data Science' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Data Science' AND display_order=5 LIMIT 1)
WHERE category = 'Data Science' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Cloud Computing
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=1 LIMIT 1)
WHERE category IN ('Cloud Computing', 'AWS') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=2 LIMIT 1)
WHERE category IN ('Cloud Computing', 'AWS') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cloud Computing' AND display_order=4 LIMIT 1)
WHERE category IN ('Cloud Computing', 'AWS') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Cybersecurity
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=1 LIMIT 1)
WHERE category IN ('Cybersecurity', 'CompTIA') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=3 LIMIT 1)
WHERE category IN ('Cybersecurity', 'CompTIA') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=4 LIMIT 1)
WHERE category IN ('Cybersecurity', 'CompTIA') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- DevOps
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='DevOps' AND display_order=1 LIMIT 1)
WHERE category = 'DevOps' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='DevOps' AND display_order=3 LIMIT 1)
WHERE category = 'DevOps' AND difficulty = 'intermediate' AND skill_node_id IS NULL AND (title ILIKE '%docker%' OR title ILIKE '%container%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='DevOps' AND display_order=4 LIMIT 1)
WHERE category = 'DevOps' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='DevOps' AND display_order=5 LIMIT 1)
WHERE category = 'DevOps' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Mobile Development
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=1 LIMIT 1)
WHERE category = 'Mobile Development' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=2 LIMIT 1)
WHERE category = 'Mobile Development' AND skill_node_id IS NULL AND (title ILIKE '%react native%' OR title ILIKE '%flutter%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=3 LIMIT 1)
WHERE category = 'Mobile Development' AND skill_node_id IS NULL AND (title ILIKE '%ios%' OR title ILIKE '%swift%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=4 LIMIT 1)
WHERE category = 'Mobile Development' AND skill_node_id IS NULL AND (title ILIKE '%android%' OR title ILIKE '%kotlin%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=5 LIMIT 1)
WHERE category = 'Mobile Development' AND skill_node_id IS NULL AND difficulty = 'intermediate';
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Mobile Development' AND display_order=6 LIMIT 1)
WHERE category = 'Mobile Development' AND skill_node_id IS NULL;

-- Blockchain
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Blockchain' AND display_order=1 LIMIT 1)
WHERE category = 'Blockchain' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Blockchain' AND display_order=3 LIMIT 1)
WHERE category = 'Blockchain' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Blockchain' AND display_order=5 LIMIT 1)
WHERE category = 'Blockchain' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- UI/UX Design
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=1 LIMIT 1)
WHERE category = 'UI/UX Design' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=3 LIMIT 1)
WHERE category = 'UI/UX Design' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UI/UX Design' AND display_order=6 LIMIT 1)
WHERE category = 'UI/UX Design' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Finance
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Finance' AND display_order=1 LIMIT 1)
WHERE category IN ('Finance', 'Investment', 'Accounting') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Finance' AND display_order=2 LIMIT 1)
WHERE category IN ('Finance', 'Investment') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Finance' AND display_order=4 LIMIT 1)
WHERE category IN ('Finance', 'Investment', 'Accounting') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Fine Arts
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=1 LIMIT 1)
WHERE category = 'Fine Arts' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=3 LIMIT 1)
WHERE category = 'Fine Arts' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=4 LIMIT 1)
WHERE category = 'Fine Arts' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Music
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Music' AND display_order=1 LIMIT 1)
WHERE category = 'Music' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Music' AND display_order=2 LIMIT 1)
WHERE category = 'Music' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Music' AND display_order=4 LIMIT 1)
WHERE category = 'Music' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Photography
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Photography' AND display_order=1 LIMIT 1)
WHERE category = 'Photography' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Photography' AND display_order=2 LIMIT 1)
WHERE category = 'Photography' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Photography' AND display_order=3 LIMIT 1)
WHERE category = 'Photography' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Graphic Design
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Graphic Design' AND display_order=1 LIMIT 1)
WHERE category IN ('Graphic Design', 'Design') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Graphic Design' AND display_order=2 LIMIT 1)
WHERE category IN ('Graphic Design', 'Design') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Graphic Design' AND display_order=3 LIMIT 1)
WHERE category IN ('Graphic Design', 'Design') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Digital Marketing
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=1 LIMIT 1)
WHERE category IN ('Digital Marketing', 'Marketing') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=2 LIMIT 1)
WHERE category IN ('Digital Marketing', 'Marketing') AND skill_node_id IS NULL AND (title ILIKE '%seo%' OR title ILIKE '%content%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=3 LIMIT 1)
WHERE category IN ('Digital Marketing', 'Marketing') AND skill_node_id IS NULL AND (title ILIKE '%social%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=4 LIMIT 1)
WHERE category IN ('Digital Marketing', 'Marketing') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Digital Marketing' AND display_order=6 LIMIT 1)
WHERE category IN ('Digital Marketing', 'Marketing') AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- Python
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=1 LIMIT 1)
WHERE category = 'Python' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=2 LIMIT 1)
WHERE category = 'Python' AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Machine Learning' AND display_order=4 LIMIT 1)
WHERE category = 'Python' AND difficulty = 'advanced' AND skill_node_id IS NULL;

-- JavaScript
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=3 LIMIT 1)
WHERE category = 'JavaScript' AND skill_node_id IS NULL;

-- DSA
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=3 LIMIT 1)
WHERE category = 'DSA' AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=5 LIMIT 1)
WHERE category = 'DSA' AND skill_node_id IS NULL;

-- System Design & Database
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=8 LIMIT 1)
WHERE category = 'System Design' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Data Science' AND display_order=2 LIMIT 1)
WHERE category = 'Database' AND skill_node_id IS NULL;

-- Exam categories
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='GRE' AND display_order=1 LIMIT 1)
WHERE category IN ('GRE', 'Exam Prep - GRE') AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='JEE' AND display_order=1 LIMIT 1)
WHERE category IN ('JEE', 'Exam Prep - JEE') AND skill_node_id IS NULL AND (title ILIKE '%physics%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='JEE' AND display_order=2 LIMIT 1)
WHERE category IN ('JEE', 'Exam Prep - JEE') AND skill_node_id IS NULL AND (title ILIKE '%chemistry%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='JEE' AND display_order=3 LIMIT 1)
WHERE category IN ('JEE', 'Exam Prep - JEE') AND skill_node_id IS NULL AND (title ILIKE '%math%');
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='JEE' AND display_order=1 LIMIT 1)
WHERE category IN ('JEE', 'Exam Prep - JEE') AND skill_node_id IS NULL;

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='NEET' AND display_order=1 LIMIT 1)
WHERE category IN ('NEET', 'Exam Prep - NEET') AND skill_node_id IS NULL;

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='GATE' AND display_order=1 LIMIT 1)
WHERE category IN ('GATE', 'Exam Prep - GATE') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='GATE' AND display_order=2 LIMIT 1)
WHERE category IN ('GATE', 'Exam Prep - GATE') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='GATE' AND display_order=3 LIMIT 1)
WHERE category IN ('GATE', 'Exam Prep - GATE') AND skill_node_id IS NULL;

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='CAT' AND display_order=1 LIMIT 1)
WHERE category IN ('CAT', 'Exam Prep - CAT') AND skill_node_id IS NULL;

UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UPSC' AND display_order=1 LIMIT 1)
WHERE category IN ('UPSC', 'Exam Prep - UPSC') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UPSC' AND display_order=3 LIMIT 1)
WHERE category IN ('UPSC', 'Exam Prep - UPSC') AND difficulty = 'intermediate' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='UPSC' AND display_order=4 LIMIT 1)
WHERE category IN ('UPSC', 'Exam Prep - UPSC') AND skill_node_id IS NULL;

-- Other exam categories mapped to closest domain
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='GRE' AND display_order=1 LIMIT 1)
WHERE category IN ('SAT', 'TOEFL', 'IELTS') AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='CAT' AND display_order=4 LIMIT 1)
WHERE category IN ('GMAT', 'LSAT', 'MCAT') AND skill_node_id IS NULL;

-- Business/Management
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Finance' AND display_order=1 LIMIT 1)
WHERE category IN ('Business', 'Business & Management', 'Business Administration', 'Management', 'Project Management') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Finance' AND display_order=3 LIMIT 1)
WHERE category IN ('Business', 'Business & Management', 'Business Administration', 'Management', 'Project Management') AND skill_node_id IS NULL;

-- Creative fields
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=2 LIMIT 1)
WHERE category IN ('Animation', 'Fashion Design', 'Interior Design', 'Film & Video', 'Performing Arts') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=3 LIMIT 1)
WHERE category IN ('Animation', 'Fashion Design', 'Interior Design', 'Film & Video', 'Performing Arts') AND skill_node_id IS NULL;

-- Communication, Writing
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=1 LIMIT 1)
WHERE category IN ('Communication', 'Creative Writing', 'Journalism') AND difficulty = 'beginner' AND skill_node_id IS NULL;
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Fine Arts' AND display_order=3 LIMIT 1)
WHERE category IN ('Communication', 'Creative Writing', 'Journalism') AND skill_node_id IS NULL;

-- Remaining unmapped
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Data Science' AND display_order=1 LIMIT 1)
WHERE category IN ('Psychology', 'Education', 'Environmental Science', 'Philosophy', 'Health & Fitness', 'Culinary Arts', 'Law') AND skill_node_id IS NULL;

-- Networking category
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Cybersecurity' AND display_order=1 LIMIT 1)
WHERE category = 'Networking' AND skill_node_id IS NULL;

-- Programming / Computer Science / Development
UPDATE resources SET skill_node_id = (SELECT id FROM skill_nodes WHERE domain='Web Development' AND display_order=3 LIMIT 1)
WHERE category IN ('Programming', 'Computer Science', 'Development', 'Computer Applications') AND skill_node_id IS NULL;
