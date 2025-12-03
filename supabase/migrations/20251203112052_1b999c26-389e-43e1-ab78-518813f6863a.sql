-- Insert seed posts with real, useful content for the learning platform
INSERT INTO public.posts (user_id, title, content, category, tags) VALUES
-- Tech tutorials
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 
 'Getting Started with React Hooks - A Beginner''s Guide',
 'React Hooks revolutionized how we write React components. Here''s what you need to know:

**useState** - Manage component state
```javascript
const [count, setCount] = useState(0);
```

**useEffect** - Handle side effects like API calls
```javascript
useEffect(() => {
  fetchData();
}, [dependency]);
```

**useContext** - Access context values without prop drilling

Start with useState and useEffect - they cover 90% of use cases. Practice building small projects like a todo app or counter to get comfortable with the syntax.',
 'Technology',
 ARRAY['react', 'javascript', 'web-development', 'frontend', 'hooks']),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Python for Data Science - Essential Libraries You Must Learn',
 'Starting your data science journey? Here are the libraries you absolutely need:

📊 **Pandas** - Data manipulation and analysis
📈 **NumPy** - Numerical computing
📉 **Matplotlib & Seaborn** - Data visualization
🤖 **Scikit-learn** - Machine learning basics
🧠 **TensorFlow/PyTorch** - Deep learning

**Learning Path:**
1. Master Python basics first
2. Learn Pandas for data cleaning
3. Practice visualization with real datasets
4. Move to ML algorithms

Free resources: Kaggle courses, Google Colab notebooks, and the official documentation are gold!',
 'Technology',
 ARRAY['python', 'data-science', 'machine-learning', 'pandas', 'programming']),

-- Career advice
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'How I Cracked My First Tech Interview - Tips That Actually Work',
 'After 3 months of preparation, I finally landed my first software developer role. Here''s what worked:

✅ **DSA Practice** - Solved 150+ LeetCode problems (focus on Easy/Medium)
✅ **Projects** - Built 3 full-stack projects with proper documentation
✅ **System Design** - Learned basics from Grokking System Design
✅ **Mock Interviews** - Did 10+ mock interviews with friends

**Key Insight:** Don''t just solve problems - understand the patterns. Most interview questions are variations of common patterns like Two Pointers, Sliding Window, BFS/DFS.

Companies I interviewed with: TCS, Infosys, Wipro, and 2 startups. Got offers from 3!

Happy to answer questions in comments 👇',
 'Career',
 ARRAY['interview', 'job-search', 'dsa', 'leetcode', 'career-advice']),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Remote Work Tips for Developers - Boost Your Productivity',
 'Been working remotely for 2 years now. Here''s what keeps me productive:

🏠 **Dedicated Workspace** - Even if it''s just a corner, make it yours
⏰ **Fixed Schedule** - Start and end work at the same time daily
🍅 **Pomodoro Technique** - 25 min focus, 5 min break
📵 **Notification Management** - Silent mode during deep work
🤝 **Overcommunicate** - Document everything, update team regularly

**Tools I use:**
- Notion for documentation
- Slack for communication
- Toggl for time tracking
- VS Code with focus mode

Remote work is a skill - it takes time to master. Be patient with yourself!',
 'Career',
 ARRAY['remote-work', 'productivity', 'work-from-home', 'developer-life']),

-- Learning resources
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Free Resources That Helped Me Learn Web Development in 6 Months',
 'You don''t need expensive bootcamps! Here are completely FREE resources:

**HTML/CSS:**
- freeCodeCamp (start here!)
- CSS Tricks
- Kevin Powell YouTube

**JavaScript:**
- JavaScript.info (best documentation)
- Traversy Media YouTube
- Eloquent JavaScript (free book)

**React:**
- Official React docs (amazing now!)
- Scrimba React course
- Net Ninja YouTube

**Backend:**
- Node.js official docs
- The Odin Project
- FullStackOpen (by University of Helsinki)

**Practice:**
- Frontend Mentor (real projects)
- CodePen challenges
- 100 Days of Code challenge

Consistency > intensity. 1-2 hours daily beats 10 hours on weekends.',
 'Resources',
 ARRAY['web-development', 'free-resources', 'learning', 'html', 'css', 'javascript']),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'Best YouTube Channels for Learning Programming in 2024',
 'Curated list of YouTube channels that actually teach well:

🎯 **For Beginners:**
- Programming with Mosh
- Bro Code
- Apna College (Hindi)

🚀 **Intermediate/Advanced:**
- Fireship (quick, fun content)
- ThePrimeagen
- Web Dev Simplified

📊 **Data Science/ML:**
- Krish Naik
- Sentdex
- StatQuest

💼 **Career/Interview:**
- NeetCode
- TechLead
- Clément Mihailescu

🎨 **UI/UX:**
- DesignCourse
- Flux
- Kevin Powell (CSS master)

Pro tip: Watch at 1.5x speed and take notes. Passive watching doesn''t help!',
 'Resources',
 ARRAY['youtube', 'learning', 'programming', 'free-resources', 'tutorial']),

-- News/Updates
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'AI Tools Every Student Should Know About in 2024',
 'AI is changing how we learn and work. Here are tools you should explore:

📝 **Writing & Research:**
- ChatGPT - Explain concepts, debug code
- Claude - Long document analysis
- Perplexity - Research with citations

💻 **Coding:**
- GitHub Copilot - AI pair programming
- Cursor - AI-first code editor
- Replit AI - Learn by building

🎨 **Design:**
- Midjourney - Image generation
- Canva AI - Quick designs
- Figma AI - UI suggestions

📚 **Study:**
- Notion AI - Notes summarization
- Quizlet AI - Flashcard generation
- Otter.ai - Lecture transcription

**Important:** Use AI as a learning aid, not a replacement for understanding. Always verify and learn the underlying concepts!',
 'News',
 ARRAY['ai', 'tools', 'productivity', 'chatgpt', 'student-life']),

-- Discussion/Question
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'What Programming Language Should I Learn First? My Honest Take',
 'This is the most common question I get. Here''s my honest opinion:

**For Web Development:** JavaScript
- Runs everywhere (frontend, backend, mobile)
- Huge job market
- Easy to see results immediately

**For Data Science/AI:** Python
- Simplest syntax to learn
- Best libraries for ML/AI
- Great for automation

**For Competitive Programming:** C++
- Fast execution
- Teaches you memory management
- Standard in competitions

**My recommendation for absolute beginners:** Python
- Readable syntax
- Versatile
- Gentle learning curve

But honestly? The BEST language is the one that keeps you motivated. Pick something that lets you build what excites you.

What was your first language? Drop it in the comments! 👇',
 'Discussion',
 ARRAY['programming', 'beginner', 'python', 'javascript', 'career-advice']),

-- Project showcase
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'I Built a Full-Stack E-commerce App - Here''s What I Learned',
 'Just completed my biggest project yet - a full-stack e-commerce platform!

**Tech Stack:**
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT + bcrypt
- Payments: Stripe integration

**Features:**
✅ User authentication
✅ Product catalog with search/filter
✅ Shopping cart
✅ Checkout with Stripe
✅ Order history
✅ Admin dashboard

**Biggest Challenges:**
1. State management (ended up using Redux Toolkit)
2. Handling payment edge cases
3. Image optimization

**Time taken:** 6 weeks (part-time, ~3 hours/day)

GitHub link in my profile. Feedback welcome!

Building projects > watching tutorials. Start building, you''ll figure it out!',
 'Projects',
 ARRAY['react', 'nodejs', 'ecommerce', 'full-stack', 'portfolio']),

-- Exam prep
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d',
 'GATE CS Preparation Strategy - From 0 to AIR Under 500',
 'Sharing my GATE preparation strategy that helped me score well:

📅 **Timeline (6 months):**
- Months 1-3: Complete syllabus
- Months 4-5: Revision + PYQs
- Month 6: Mock tests + weak areas

📚 **Best Resources:**
- NPTEL lectures (free & official)
- Gate Smashers (YouTube)
- Made Easy/ACE notes
- GateOverflow (must for PYQs)

🎯 **Subject Priority (by weightage):**
1. DSA & Programming (high)
2. DBMS (medium-high)
3. OS & CN (medium)
4. TOC & Compiler Design (medium)
5. Digital Logic & COA (low-medium)

💡 **Key Tips:**
- Solve GATE PYQs religiously (last 15 years)
- Take at least 20 full-length mocks
- Focus on accuracy over speed initially
- Join study groups for motivation

Remember: GATE tests understanding, not rote learning. Focus on concepts!',
 'Exam Prep',
 ARRAY['gate', 'computer-science', 'exam-preparation', 'study-tips']);

-- Add some likes to make posts look engaged
INSERT INTO public.likes (post_id, user_id)
SELECT p.id, '76983e1e-10b3-45ba-bc0f-fa1c19e19f6d'
FROM public.posts p
WHERE p.user_id = '76983e1e-10b3-45ba-bc0f-fa1c19e19f6d'
LIMIT 5;