-- Insert sample blog posts and research papers into resources table
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, resource_type, section_type, is_active, is_featured, provider, related_skills, relevant_backgrounds, education_levels, rating)
VALUES
-- AI & Machine Learning Blogs
('Attention Is All You Need - Transformer Paper', 'The seminal research paper that introduced the Transformer architecture, revolutionizing NLP and leading to models like GPT and BERT.', 'https://arxiv.org/abs/1706.03762', 'Artificial Intelligence', 'advanced', true, 'research_paper', 'content', true, true, 'Google Research', ARRAY['Deep Learning', 'NLP', 'Machine Learning', 'Transformers'], ARRAY['professional', 'student'], ARRAY['masters', 'phd'], 4.9),

('Deep Learning by Ian Goodfellow - Free Book', 'The most comprehensive deep learning textbook, available for free online. Covers fundamentals to advanced topics.', 'https://www.deeplearningbook.org/', 'Artificial Intelligence', 'intermediate', true, 'blog', 'content', true, true, 'MIT Press', ARRAY['Deep Learning', 'Neural Networks', 'Machine Learning'], ARRAY['student', 'professional', 'self-learner'], ARRAY['bachelors', 'masters'], 4.8),

('OpenAI Blog - Latest AI Research', 'Official OpenAI blog featuring cutting-edge AI research, model releases, and safety discussions.', 'https://openai.com/blog', 'Artificial Intelligence', 'intermediate', true, 'blog', 'content', true, true, 'OpenAI', ARRAY['AI', 'Machine Learning', 'GPT', 'ChatGPT'], ARRAY['professional', 'student', 'self-learner'], ARRAY['bachelors', 'masters', 'phd'], 4.7),

('The Illustrated Transformer', 'A visual and intuitive explanation of the Transformer architecture. Perfect for understanding attention mechanisms.', 'https://jalammar.github.io/illustrated-transformer/', 'Artificial Intelligence', 'beginner', true, 'blog', 'content', true, true, 'Jay Alammar', ARRAY['Transformers', 'NLP', 'Deep Learning'], ARRAY['student', 'self-learner'], ARRAY['high-school', 'bachelors'], 4.9),

('ImageNet Classification with Deep CNNs (AlexNet)', 'The breakthrough paper that started the deep learning revolution in computer vision.', 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks', 'Artificial Intelligence', 'advanced', true, 'research_paper', 'content', true, false, 'NIPS', ARRAY['Computer Vision', 'CNN', 'Deep Learning'], ARRAY['professional', 'student'], ARRAY['masters', 'phd'], 4.8),

-- Data Science Blogs & Papers
('Towards Data Science', 'The largest Medium publication for data science, ML, and AI articles from practitioners worldwide.', 'https://towardsdatascience.com/', 'Data Science', 'intermediate', true, 'blog', 'content', true, true, 'Medium', ARRAY['Data Science', 'Machine Learning', 'Python', 'Statistics'], ARRAY['professional', 'student', 'self-learner'], ARRAY['bachelors', 'masters'], 4.6),

('Statistical Learning with Sparsity - Lasso Paper', 'Foundational research on regularization methods essential for modern machine learning.', 'https://web.stanford.edu/~hastie/StatLearnSparsity/', 'Data Science', 'advanced', true, 'research_paper', 'content', true, false, 'Stanford', ARRAY['Statistics', 'Machine Learning', 'Regression'], ARRAY['professional', 'student'], ARRAY['masters', 'phd'], 4.7),

('Python Data Science Handbook', 'Free online book covering NumPy, Pandas, Matplotlib, and Scikit-Learn for data science.', 'https://jakevdp.github.io/PythonDataScienceHandbook/', 'Data Science', 'beginner', true, 'blog', 'content', true, true, 'O''Reilly', ARRAY['Python', 'NumPy', 'Pandas', 'Data Analysis'], ARRAY['student', 'self-learner', 'career-switcher'], ARRAY['high-school', 'bachelors'], 4.8),

-- Web Development Blogs
('MDN Web Docs', 'The definitive resource for web standards documentation - HTML, CSS, JavaScript, and Web APIs.', 'https://developer.mozilla.org/', 'Web Development', 'beginner', true, 'blog', 'content', true, true, 'Mozilla', ARRAY['HTML', 'CSS', 'JavaScript', 'Web APIs'], ARRAY['student', 'self-learner', 'career-switcher'], ARRAY['high-school', 'bachelors', 'bootcamp'], 4.9),

('React Official Blog', 'Official React.js blog with updates, best practices, and deep dives into React features.', 'https://react.dev/blog', 'Web Development', 'intermediate', true, 'blog', 'content', true, true, 'Meta', ARRAY['React', 'JavaScript', 'Frontend'], ARRAY['professional', 'student'], ARRAY['bachelors', 'bootcamp'], 4.8),

('CSS-Tricks', 'A daily resource for web development articles, covering CSS, JavaScript, UX, and more.', 'https://css-tricks.com/', 'Web Development', 'beginner', true, 'blog', 'content', true, false, 'CSS-Tricks', ARRAY['CSS', 'HTML', 'JavaScript', 'Frontend'], ARRAY['student', 'self-learner'], ARRAY['high-school', 'bachelors', 'bootcamp'], 4.7),

-- Cybersecurity Blogs & Papers
('OWASP Top 10 Security Risks', 'The most critical security risks to web applications - essential reading for every developer.', 'https://owasp.org/www-project-top-ten/', 'Cybersecurity', 'intermediate', true, 'blog', 'content', true, true, 'OWASP', ARRAY['Security', 'Web Security', 'Penetration Testing'], ARRAY['professional', 'student'], ARRAY['bachelors', 'masters'], 4.9),

('Krebs on Security', 'In-depth security news and investigation by security journalist Brian Krebs.', 'https://krebsonsecurity.com/', 'Cybersecurity', 'intermediate', true, 'blog', 'content', true, false, 'Brian Krebs', ARRAY['Security', 'Threat Intelligence', 'Hacking'], ARRAY['professional', 'self-learner'], ARRAY['bachelors', 'masters'], 4.6),

('The Hacker News', 'Leading cybersecurity news platform covering data breaches, vulnerabilities, and cyber attacks.', 'https://thehackernews.com/', 'Cybersecurity', 'beginner', true, 'blog', 'content', true, true, 'THN', ARRAY['Security', 'Hacking', 'Vulnerabilities'], ARRAY['student', 'professional', 'self-learner'], ARRAY['high-school', 'bachelors'], 4.5),

-- Cloud Computing Blogs
('AWS Architecture Blog', 'Official AWS blog featuring cloud architecture best practices and case studies.', 'https://aws.amazon.com/blogs/architecture/', 'Cloud Computing', 'intermediate', true, 'blog', 'content', true, true, 'AWS', ARRAY['AWS', 'Cloud', 'Architecture', 'DevOps'], ARRAY['professional'], ARRAY['bachelors', 'masters'], 4.7),

('Google Cloud Blog', 'Latest news, tutorials, and best practices for Google Cloud Platform.', 'https://cloud.google.com/blog', 'Cloud Computing', 'intermediate', true, 'blog', 'content', true, false, 'Google Cloud', ARRAY['GCP', 'Cloud', 'Kubernetes'], ARRAY['professional'], ARRAY['bachelors', 'masters'], 4.6),

('Azure Blog', 'Microsoft Azure official blog with product updates, tutorials, and customer stories.', 'https://azure.microsoft.com/en-us/blog/', 'Cloud Computing', 'intermediate', true, 'blog', 'content', true, false, 'Microsoft', ARRAY['Azure', 'Cloud', 'Microsoft'], ARRAY['professional'], ARRAY['bachelors', 'masters'], 4.6),

-- DevOps Blogs
('DevOps.com', 'Leading DevOps publication featuring news, tutorials, and best practices.', 'https://devops.com/', 'DevOps', 'intermediate', true, 'blog', 'content', true, true, 'DevOps.com', ARRAY['DevOps', 'CI/CD', 'Kubernetes', 'Docker'], ARRAY['professional'], ARRAY['bachelors', 'masters'], 4.5),

('The New Stack', 'Analysis and explanation of cloud native technologies and practices.', 'https://thenewstack.io/', 'DevOps', 'intermediate', true, 'blog', 'content', true, false, 'The New Stack', ARRAY['Cloud Native', 'Kubernetes', 'Microservices'], ARRAY['professional'], ARRAY['bachelors', 'masters'], 4.6),

-- Blockchain & Crypto
('Bitcoin Whitepaper', 'The original Bitcoin whitepaper by Satoshi Nakamoto - the foundation of cryptocurrency.', 'https://bitcoin.org/bitcoin.pdf', 'Blockchain', 'intermediate', true, 'research_paper', 'content', true, true, 'Satoshi Nakamoto', ARRAY['Bitcoin', 'Cryptocurrency', 'Blockchain'], ARRAY['professional', 'student', 'self-learner'], ARRAY['bachelors', 'masters'], 4.9),

('Ethereum Whitepaper', 'Vitalik Buterin''s whitepaper introducing Ethereum and smart contracts.', 'https://ethereum.org/en/whitepaper/', 'Blockchain', 'intermediate', true, 'research_paper', 'content', true, true, 'Ethereum Foundation', ARRAY['Ethereum', 'Smart Contracts', 'Blockchain', 'DeFi'], ARRAY['professional', 'student'], ARRAY['bachelors', 'masters'], 4.8),

-- Business & Marketing
('Harvard Business Review', 'Leading source of ideas and best practices on strategy, leadership, and management.', 'https://hbr.org/', 'Business & Management', 'intermediate', true, 'blog', 'content', true, true, 'Harvard Business Publishing', ARRAY['Business', 'Leadership', 'Strategy', 'Management'], ARRAY['professional'], ARRAY['bachelors', 'masters', 'phd'], 4.8),

('Neil Patel Blog', 'Digital marketing insights from one of the world''s top marketing experts.', 'https://neilpatel.com/blog/', 'Digital Marketing', 'beginner', true, 'blog', 'content', true, true, 'Neil Patel', ARRAY['SEO', 'Content Marketing', 'Digital Marketing'], ARRAY['professional', 'self-learner', 'freelancer'], ARRAY['high-school', 'bachelors'], 4.7),

('Content Marketing Institute', 'Authoritative content marketing resources, research, and training.', 'https://contentmarketinginstitute.com/', 'Digital Marketing', 'intermediate', true, 'blog', 'content', true, false, 'CMI', ARRAY['Content Marketing', 'Marketing Strategy'], ARRAY['professional', 'freelancer'], ARRAY['bachelors'], 4.6),

-- Design & UX
('Nielsen Norman Group', 'World leaders in research-based user experience. Essential UX articles and reports.', 'https://www.nngroup.com/articles/', 'UI/UX Design', 'intermediate', true, 'blog', 'content', true, true, 'NN/g', ARRAY['UX Design', 'User Research', 'Usability'], ARRAY['professional', 'student'], ARRAY['bachelors', 'masters'], 4.9),

('Smashing Magazine', 'Professional resources for web designers and developers - UX, CSS, JavaScript, and more.', 'https://www.smashingmagazine.com/', 'UI/UX Design', 'intermediate', true, 'blog', 'content', true, true, 'Smashing Magazine', ARRAY['Web Design', 'UX', 'CSS', 'JavaScript'], ARRAY['professional', 'student', 'self-learner'], ARRAY['bachelors', 'bootcamp'], 4.8),

('A List Apart', 'Explores the design, development, and meaning of web content.', 'https://alistapart.com/', 'UI/UX Design', 'intermediate', true, 'blog', 'content', true, false, 'A List Apart', ARRAY['Web Design', 'Accessibility', 'UX'], ARRAY['professional'], ARRAY['bachelors'], 4.7),

-- Mobile Development
('Android Developers Blog', 'Official Android development blog with updates, best practices, and tutorials.', 'https://android-developers.googleblog.com/', 'Mobile Development', 'intermediate', true, 'blog', 'content', true, true, 'Google', ARRAY['Android', 'Kotlin', 'Mobile Development'], ARRAY['professional', 'student'], ARRAY['bachelors'], 4.7),

('Swift Blog', 'Official Swift programming language blog from Apple.', 'https://swift.org/blog/', 'Mobile Development', 'intermediate', true, 'blog', 'content', true, true, 'Apple', ARRAY['Swift', 'iOS', 'Apple Development'], ARRAY['professional', 'student'], ARRAY['bachelors'], 4.6),

-- Finance & Economics
('Investopedia', 'The world''s leading source of financial content, education, and tools.', 'https://www.investopedia.com/', 'Finance', 'beginner', true, 'blog', 'content', true, true, 'Investopedia', ARRAY['Finance', 'Investing', 'Economics'], ARRAY['student', 'professional', 'self-learner'], ARRAY['high-school', 'bachelors'], 4.7),

('MIT Sloan Management Review', 'Research-based articles on management, strategy, and leadership.', 'https://sloanreview.mit.edu/', 'Business & Management', 'advanced', true, 'blog', 'content', true, false, 'MIT', ARRAY['Management', 'Strategy', 'Leadership'], ARRAY['professional'], ARRAY['masters', 'phd'], 4.8)

ON CONFLICT DO NOTHING;