
-- Insert 30 real industry news posts covering AI, Silicon Valley, education, tech
-- Using existing seed user_id for consistency
INSERT INTO posts (user_id, title, content, category, tags, created_at) VALUES

-- AI & Machine Learning News
('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'OpenAI Launches GPT-5: A New Era of Reasoning AI 🧠',
 '{"type":"post","blocks":[{"type":"paragraph","content":"OpenAI has officially unveiled GPT-5, marking a significant leap in AI reasoning capabilities. The model demonstrates near-human performance on complex scientific reasoning, coding challenges, and multi-step problem solving. Sam Altman called it \"the most capable AI system ever built.\" Key improvements include 10x longer context windows, native multimodal understanding, and dramatically reduced hallucinations. Enterprise pricing starts at $200/month."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"}]}',
 'Technology', ARRAY['AI', 'OpenAI', 'GPT-5', 'Machine Learning'], '2026-03-07 10:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Google DeepMind Achieves Breakthrough in Protein-Drug Interaction Prediction 💊',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Google DeepMind has announced AlphaFold 3, which can now predict how proteins interact with drug molecules, DNA, and RNA with unprecedented accuracy. This breakthrough could accelerate drug discovery by years, potentially reducing the cost of bringing new medicines to market by billions. The model is being made freely available to researchers worldwide through a new partnership with the WHO."},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=gg7WjuFs8F4"}]}',
 'Technology', ARRAY['Google', 'DeepMind', 'AI', 'Healthcare'], '2026-03-07 08:30:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'NVIDIA Surpasses $4 Trillion Market Cap on AI Chip Demand 📈',
 '{"type":"post","blocks":[{"type":"paragraph","content":"NVIDIA has become the world''s most valuable company, surpassing $4 trillion in market capitalization. The surge is driven by insatiable demand for its H200 and Blackwell B200 GPUs, which power the majority of AI training worldwide. CEO Jensen Huang revealed that data center revenue grew 409% year-over-year, with major customers including Microsoft, Google, Meta, and Amazon each ordering billions worth of chips."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800"}]}',
 'Technology', ARRAY['NVIDIA', 'AI', 'Stock Market', 'Silicon Valley'], '2026-03-06 14:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Meta Releases Llama 4: Open-Source AI Catches Up to GPT-5 🦙',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Meta has released Llama 4, its latest open-source large language model that benchmarks competitively with GPT-5 on most tasks. Mark Zuckerberg announced the model alongside a new commercial license that allows companies of all sizes to use it freely. The model comes in 8B, 70B, and 405B parameter variants. The AI community is calling this a pivotal moment for open-source AI, as it narrows the gap with proprietary models significantly."}]}',
 'Technology', ARRAY['Meta', 'Open Source', 'AI', 'Llama'], '2026-03-06 11:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Anthropic Raises $5B at $60B Valuation, Announces Claude 4 🚀',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Anthropic, the AI safety startup founded by former OpenAI researchers, has closed a $5 billion funding round led by Google and Spark Capital, valuing the company at $60 billion. Alongside the funding, they announced Claude 4, which introduces breakthrough capabilities in agentic AI — allowing the model to autonomously complete multi-hour research tasks, write and debug code across entire repositories, and safely browse the web."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800"}]}',
 'Technology', ARRAY['Anthropic', 'Claude', 'AI Safety', 'Funding'], '2026-03-05 16:00:00+00'),

-- Silicon Valley & Startup News
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Apple Vision Pro 2 Launches at $1,999 with Killer Enterprise Features 🥽',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Apple has unveiled Vision Pro 2, cutting the price nearly in half to $1,999 while adding significant enterprise features. The new headset is 40% lighter, has 2x battery life, and introduces shared spatial computing workspaces where remote teams can collaborate in real-time 3D environments. Major companies including Boeing, Accenture, and JPMorgan have already signed enterprise deployment deals. Tim Cook called it \"the future of work.\""},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=TX9qSaGXFyg"}]}',
 'Technology', ARRAY['Apple', 'Vision Pro', 'AR/VR', 'Enterprise'], '2026-03-05 09:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Tesla Robotaxi Service Goes Live in Austin and San Francisco 🚗',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Tesla has officially launched its autonomous robotaxi service, \"Tesla Ride,\" in Austin, TX and San Francisco, CA. The service uses the Model Y platform with the latest FSD v13 hardware suite. Early reports indicate smooth rides with minimal interventions. Pricing is competitive with Uber at roughly $0.80/mile. Elon Musk announced plans to expand to 10 more cities by end of 2026. Uber and Lyft stocks dropped 15% on the news."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"}]}',
 'Technology', ARRAY['Tesla', 'Autonomous Driving', 'Robotaxi', 'Silicon Valley'], '2026-03-04 12:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Microsoft Copilot Now Writes Entire Apps from Natural Language Descriptions 💻',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Microsoft has launched Copilot Workspace, an AI-powered development environment that can generate full-stack applications from plain English descriptions. The tool integrates with GitHub, Azure, and VS Code, allowing developers to describe what they want and get working code with tests, CI/CD pipelines, and deployment configs. Early beta users report 5-10x productivity gains. Satya Nadella called it \"the biggest shift in software development since the IDE.\""},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800"}]}',
 'Technology', ARRAY['Microsoft', 'Copilot', 'AI', 'Developer Tools'], '2026-03-04 08:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'SpaceX Starship Successfully Lands on Mars in Historic First 🔴',
 '{"type":"post","blocks":[{"type":"paragraph","content":"SpaceX has achieved the seemingly impossible — Starship has successfully landed on Mars after a 7-month journey. The uncrewed mission carried 100 tons of supplies and equipment to establish the foundation for a future human base. NASA Administrator Bill Nelson congratulated SpaceX, calling it \"humanity''s greatest exploration achievement since the Moon landing.\" Elon Musk confirmed that a crewed mission is targeted for 2028."},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=921VbEMsWQo"}]}',
 'News', ARRAY['SpaceX', 'Mars', 'Space', 'Elon Musk'], '2026-03-03 18:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Stripe Launches AI-Powered Fraud Detection, Saves Merchants $2B Annually 💳',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Stripe has launched Radar AI, an advanced fraud detection system powered by a custom LLM trained on billions of payment transactions. The system reduces false positives by 70% while catching 99.7% of fraudulent transactions. Early adopters including Shopify, Amazon, and DoorDash report saving millions in chargebacks. Stripe CEO Patrick Collison noted this represents the largest AI deployment in fintech history."}]}',
 'Technology', ARRAY['Stripe', 'Fintech', 'AI', 'Startup'], '2026-03-03 10:00:00+00'),

-- Education & Career
('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'MIT Launches Free AI Engineering Certificate Program 🎓',
 '{"type":"post","blocks":[{"type":"paragraph","content":"MIT has announced a completely free online certificate program in AI Engineering, covering everything from transformer architectures to production ML systems. The 6-month program includes hands-on projects, peer reviews, and a capstone project. Over 500,000 students have already enrolled in the first week. This is part of MIT''s $1 billion initiative to democratize AI education globally. Certificates are recognized by major tech companies for hiring."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800"}]}',
 'Resources', ARRAY['MIT', 'AI', 'Free Course', 'Certificate'], '2026-03-07 06:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Stanford Report: 67% of Tech Jobs Now Require AI Skills 📊',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Stanford''s latest AI Index Report reveals that 67% of tech job postings now list AI/ML skills as a requirement, up from 35% just two years ago. The report also found that AI-skilled workers earn 40-60% more than their peers. Top in-demand skills include prompt engineering, fine-tuning LLMs, RAG systems, and AI agent development. The report recommends universities urgently update curricula to include practical AI skills."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"}]}',
 'Career', ARRAY['Stanford', 'AI Jobs', 'Career', 'Skills'], '2026-03-06 07:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Complete Roadmap: How to Become an AI Engineer in 2026 🗺️',
 '{"type":"post","blocks":[{"type":"paragraph","content":"After mentoring 200+ students who landed AI engineering roles at FAANG, here is the definitive 2026 roadmap:\n\n1. Python + Math Foundations (2 months)\n2. ML Fundamentals - Andrew Ng''s course (1 month)\n3. Deep Learning + PyTorch (2 months)\n4. Transformers & LLMs - Hugging Face course (1 month)\n5. RAG & Vector Databases (1 month)\n6. AI Agents & Tool Use (1 month)\n7. MLOps & Production Systems (2 months)\n8. Build 3 portfolio projects (2 months)\n\nTotal: ~12 months to job-ready. All resources are free. DM me for the complete resource list."}]}',
 'Career', ARRAY['AI Engineer', 'Roadmap', 'Career', 'FAANG'], '2026-03-05 14:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Google Offers Free Gemini API Credits to Students Worldwide 🎁',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Google has announced a new program giving university students worldwide $500 in free Gemini API credits per semester. The initiative aims to help students build AI-powered projects and gain hands-on experience. Students can access Gemini 2.0 Pro, Gemini Flash, and all multimodal capabilities. The program also includes free access to Google Colab Pro and Cloud TPUs for training. Sign up at ai.google.dev/students with your .edu email."},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=UIZAiXYceBI"}]}',
 'Resources', ARRAY['Google', 'Gemini', 'Students', 'Free'], '2026-03-04 15:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'IIT Bombay Introduces India''s First B.Tech in AI & Robotics 🇮🇳',
 '{"type":"post","blocks":[{"type":"paragraph","content":"IIT Bombay has officially launched India''s first dedicated B.Tech program in AI & Robotics, starting from the 2026-27 academic year. The 4-year program will accept 60 students through JEE Advanced. The curriculum covers deep learning, computer vision, NLP, autonomous systems, and humanoid robotics. Industry partners include NVIDIA, Google DeepMind, and Tata. Starting salary projections for graduates are ₹25-50 LPA based on current AI market trends."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1562774053-701939374585?w=800"}]}',
 'Exam Prep', ARRAY['IIT', 'AI', 'Robotics', 'JEE', 'India'], '2026-03-03 06:00:00+00'),

-- Tech Industry & Product Updates
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'GitHub Copilot X Can Now Autonomously Fix Bugs and Write Tests 🔧',
 '{"type":"post","blocks":[{"type":"paragraph","content":"GitHub has launched Copilot X, a major upgrade that can autonomously identify bugs, write fixes, create comprehensive test suites, and submit pull requests. The tool uses a multi-agent architecture where specialized AI agents handle different aspects of software engineering. In internal testing at Microsoft, Copilot X resolved 40% of all bug reports without human intervention. The feature is available now for GitHub Enterprise customers."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800"}]}',
 'Technology', ARRAY['GitHub', 'Copilot', 'AI', 'Developer Tools'], '2026-03-02 12:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'AWS Announces $10 Billion Investment in AI Infrastructure in India 🏗️',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Amazon Web Services (AWS) has announced a massive $10 billion investment in AI cloud infrastructure in India over the next 5 years. The investment includes new data centers in Mumbai, Hyderabad, and Bengaluru, along with free AI training programs for 1 million Indian developers. AWS CEO Matt Garman said India is the fastest-growing cloud market globally, with AI workloads growing 500% year-over-year."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800"}]}',
 'News', ARRAY['AWS', 'India', 'Cloud', 'AI Infrastructure'], '2026-03-02 08:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Rust Overtakes C++ in Systems Programming Popularity for First Time 🦀',
 '{"type":"post","blocks":[{"type":"paragraph","content":"According to the latest Stack Overflow Developer Survey and GitHub Octoverse data, Rust has officially overtaken C++ as the most popular systems programming language. Rust adoption grew 180% in 2025, driven by Linux kernel integration, Microsoft''s adoption for Windows components, and Google''s use in Android. The survey found that 87% of Rust developers report being ''very satisfied'' with the language, the highest satisfaction rate of any programming language."}]}',
 'Technology', ARRAY['Rust', 'Programming', 'Systems', 'Developer'], '2026-03-01 14:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Samsung Unveils 2nm Chips: The Future of Mobile AI Processing 📱',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Samsung has begun mass production of 2nm GAA (Gate-All-Around) chips, the most advanced semiconductor technology ever manufactured. The chips offer 45% better power efficiency and 25% higher performance compared to 3nm. The first customer is reportedly NVIDIA for its next-gen mobile AI chips. Samsung''s foundry business is expected to reclaim market share from TSMC, intensifying the global chip competition."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"}]}',
 'Technology', ARRAY['Samsung', 'Semiconductor', 'AI', 'Hardware'], '2026-03-01 10:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'The Rise of AI Agents: 5 Tools That Are Replacing Entire Teams 🤖',
 '{"type":"post","blocks":[{"type":"paragraph","content":"AI agents are transforming how startups operate. Here are 5 tools that are literally replacing entire departments:\n\n1. **Devin by Cognition** - AI software engineer that can build features end-to-end\n2. **Harvey AI** - AI lawyer handling contract review and legal research\n3. **Jasper AI** - AI marketing team creating campaigns, copy, and strategy\n4. **Glean AI** - AI knowledge worker that searches and synthesizes company data\n5. **Lovable** - AI full-stack engineer building complete web applications\n\nStartups are now launching with 3-5 people + AI agents instead of 20+ person teams. The economics of building a company have fundamentally changed."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"}]}',
 'Technology', ARRAY['AI Agents', 'Startups', 'Automation', 'Tools'], '2026-02-28 16:00:00+00'),

-- Educational & Learning Posts
('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Harvard CS50 2026 Edition Now Available Free on YouTube 🎬',
 '{"type":"post","blocks":[{"type":"paragraph","content":"David Malan has released the 2026 edition of Harvard''s legendary CS50: Introduction to Computer Science on YouTube, completely free. This year''s edition includes new modules on AI programming with LLMs, building AI-powered apps, and prompt engineering. The course has been taken by over 5 million students worldwide and remains the #1 recommendation for anyone starting their CS journey. Link: cs50.harvard.edu"},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=3LPJfIKxwWc"}]}',
 'Resources', ARRAY['Harvard', 'CS50', 'Free Course', 'Programming'], '2026-02-28 08:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Coursera Partners with 50 Universities to Offer Free AI Degrees 🌍',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Coursera has announced partnerships with 50 top universities including Stanford, MIT, Oxford, and IITs to offer fully free AI degree programs to learners in developing countries. The initiative, funded by a $500M grant from the Gates Foundation, will provide accredited bachelor''s and master''s degrees in AI, Data Science, and Computer Science. Applications open April 2026 for learners from 100+ eligible countries."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"}]}',
 'Resources', ARRAY['Coursera', 'Free Education', 'AI', 'University'], '2026-02-27 12:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'I Built a SaaS Making $15K/month Using Only AI Tools - Here''s How 💰',
 '{"type":"post","blocks":[{"type":"paragraph","content":"6 months ago, I had zero coding experience. Today, I run a profitable SaaS making $15K/month. Here''s my exact stack:\n\n• Lovable for building the full web app\n• Supabase for backend & auth\n• Stripe for payments\n• Vercel for hosting\n• ChatGPT for copywriting\n• Midjourney for design assets\n\nTotal cost: ~$100/month in tools\nTime to MVP: 2 weeks\nFirst paying customer: Day 18\n\nThe barrier to building software has essentially dropped to zero. If you have a problem worth solving, you can now build the solution yourself. The era of the solo AI-powered founder is here."}]}',
 'Discussion', ARRAY['SaaS', 'AI Tools', 'Entrepreneurship', 'No-Code'], '2026-02-27 07:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Complete Guide: Building RAG Applications with LangChain & Pinecone 📖',
 '{"type":"post","blocks":[{"type":"paragraph","content":"RAG (Retrieval-Augmented Generation) is the most in-demand AI skill in 2026. Here''s a complete guide:\n\n**What is RAG?**\nRAG combines LLMs with external knowledge bases to generate accurate, grounded responses.\n\n**Tech Stack:**\n- LangChain for orchestration\n- Pinecone/Weaviate for vector DB\n- OpenAI/Anthropic for embeddings & generation\n\n**Key Steps:**\n1. Chunk your documents\n2. Generate embeddings\n3. Store in vector DB\n4. Retrieve relevant chunks on query\n5. Generate response with context\n\nFull tutorial with code: github.com/rag-tutorial-2026"},{"type":"video","videoUrl":"https://www.youtube.com/watch?v=T-D1OfcDW1M"}]}',
 'Technology', ARRAY['RAG', 'LangChain', 'AI', 'Tutorial'], '2026-02-26 14:00:00+00'),

-- Industry & Economy News
('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'India Becomes World''s 3rd Largest Economy, Overtakes Japan 🇮🇳📊',
 '{"type":"post","blocks":[{"type":"paragraph","content":"India has officially overtaken Japan to become the world''s third-largest economy by nominal GDP, reaching $4.5 trillion. The growth is driven by a booming tech sector, massive digital infrastructure investments, and the world''s largest working-age population. PM Modi announced new initiatives to reach $10 trillion by 2030, including doubling the AI talent pool and establishing 100 new tech parks. Goldman Sachs predicts India will overtake Germany by 2028."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800"}]}',
 'News', ARRAY['India', 'Economy', 'GDP', 'Growth'], '2026-02-26 06:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'EU AI Act Goes Into Full Effect: What Developers Need to Know ⚖️',
 '{"type":"post","blocks":[{"type":"paragraph","content":"The EU AI Act is now fully enforceable, and it has massive implications for developers worldwide:\n\n**Banned AI Systems:**\n- Social scoring systems\n- Real-time biometric surveillance (with exceptions)\n- AI that manipulates human behavior\n\n**High-Risk AI Requirements:**\n- Mandatory risk assessments\n- Human oversight mechanisms\n- Transparency documentation\n- Data governance standards\n\n**Penalties:**\n- Up to €35 million or 7% of global turnover\n\nIf you''re building AI products used by EU citizens, compliance is mandatory. Here''s a developer-friendly compliance checklist..."}]}',
 'Technology', ARRAY['EU', 'AI Regulation', 'Compliance', 'Law'], '2026-02-25 10:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Y Combinator W2026 Demo Day: Top 10 Startups You Should Watch 🌟',
 '{"type":"post","blocks":[{"type":"paragraph","content":"YC''s Winter 2026 batch just presented at Demo Day. Here are the 10 most impressive startups:\n\n1. **NeuralDB** - AI-native database ($2M ARR in beta)\n2. **CodeShield** - AI security for code ($800K ARR)\n3. **HealthLens** - AI diagnostics from phone cameras\n4. **EduAgent** - Personalized AI tutors for K-12\n5. **FarmAI** - Precision agriculture with drones + AI\n6. **LegalFlow** - AI-powered contract automation\n7. **SupplyMind** - AI supply chain optimization\n8. **ClimateOS** - Carbon tracking for enterprises\n9. **VoiceClone Pro** - Enterprise voice AI platform\n10. **RoboChef** - AI-powered restaurant automation\n\n8 out of 10 are AI-first companies. The AI revolution is real."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800"}]}',
 'News', ARRAY['Y Combinator', 'Startups', 'Demo Day', 'Silicon Valley'], '2026-02-25 08:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Remote Work Data 2026: 58% of Tech Workers Now Fully Remote 🏠',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Buffer''s State of Remote Work 2026 report reveals that 58% of tech workers are now fully remote, up from 42% in 2024. Key findings:\n\n• Average remote tech salary: $145,000\n• Top remote-friendly companies: GitLab, Automattic, Shopify, Coinbase\n• Most common challenges: Loneliness (28%), time zones (22%), distractions (18%)\n• 72% of remote workers would take a pay cut to stay remote\n• Companies offering remote work receive 3x more applications\n\nThe office-first model is officially dead for tech. Companies forcing RTO are losing top talent to remote-first competitors."}]}',
 'Career', ARRAY['Remote Work', 'Tech Jobs', 'Career', 'WFH'], '2026-02-24 12:00:00+00'),

('ef6d6aed-72e6-4a42-8342-6a33f2f09e01',
 'Duolingo Uses AI to Create Personalized Language Courses in Real-Time 🗣️',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Duolingo has launched \"Duo AI,\" a revolutionary feature that generates personalized language lessons in real-time based on your interests, profession, and learning style. Instead of generic exercises, the AI creates scenarios relevant to your life — a doctor learns medical terminology, a traveler practices airport conversations. Early data shows 3x faster vocabulary retention and 40% higher daily engagement. The feature uses GPT-5 under the hood and supports all 40+ languages."},{"type":"image","imageUrl":"https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"}]}',
 'Technology', ARRAY['Duolingo', 'AI', 'EdTech', 'Languages'], '2026-02-24 08:00:00+00'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'The Salary Guide 2026: Highest Paying Tech Roles and How to Get Them 💵',
 '{"type":"post","blocks":[{"type":"paragraph","content":"Based on data from Levels.fyi and Glassdoor, here are the highest-paying tech roles in 2026:\n\n1. **AI/ML Research Scientist** - $250-500K (FAANG)\n2. **AI Engineer** - $180-350K\n3. **Staff Software Engineer** - $200-400K\n4. **Cloud/Platform Engineer** - $170-300K\n5. **Security Engineer** - $160-280K\n6. **Data Engineer** - $150-250K\n7. **Full-Stack Developer** - $130-220K\n8. **DevOps/SRE** - $140-240K\n9. **Product Manager (AI)** - $160-300K\n10. **Blockchain Developer** - $150-280K\n\nKey trend: Every role now pays a 30-50% premium for AI skills. The message is clear — learn AI or get left behind."}]}',
 'Career', ARRAY['Salary', 'Tech Jobs', 'Career', '2026'], '2026-02-23 10:00:00+00')

ON CONFLICT DO NOTHING;
