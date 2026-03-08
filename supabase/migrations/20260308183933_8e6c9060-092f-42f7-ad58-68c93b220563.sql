
-- Seed diverse non-tech posts for feed diversity
INSERT INTO posts (user_id, title, content, category, tags, created_at)
VALUES
-- Arts posts
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', '10 Essential Drawing Exercises Every Beginner Should Practice Daily', 'If you''re just starting your drawing journey, consistency matters more than talent. Here are 10 exercises I do every morning that transformed my skills in just 3 months:

1. **Gesture Drawing (5 min)** - Quick 30-second poses from reference photos. Focus on capturing movement, not detail.
2. **Contour Drawing** - Draw the outline of an object without looking at your paper. Builds hand-eye coordination.
3. **Shading Spheres** - Draw circles and shade them with different techniques (hatching, cross-hatching, stippling).
4. **Perspective Boxes** - Draw cubes in 1-point and 2-point perspective. Architecture starts here.
5. **Negative Space Drawing** - Instead of drawing the object, draw the space around it.
6. **Blind Portraits** - Draw someone''s face without looking at your paper. Hilariously bad but incredibly useful.
7. **Texture Studies** - Draw different textures: wood grain, fabric, water, metal.
8. **Value Scales** - Create a gradient from pure white to darkest black in 10 steps.
9. **Master Copies** - Reproduce a section of a painting by Da Vinci, Rembrandt, or your favorite artist.
10. **Daily Sketch Journal** - Draw anything from your day. Coffee cup, your cat, the view from your window.

The key is doing these EVERY DAY for at least 20 minutes. Your brain forms new neural pathways for spatial reasoning and hand coordination. After 30 days, you''ll be shocked at the improvement.

Resources I recommend: Proko on YouTube, Drawabox.com (free), and "Keys to Drawing" by Bert Dodson.

What exercises helped you the most? Share below! 🎨', 'Arts', ARRAY['drawing', 'beginner', 'art', 'practice', 'sketching'], now() - interval '2 days'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'How I Built a Photography Portfolio That Landed Me 5 Clients in One Month', 'Six months ago I was shooting photos for fun. Today photography is my side hustle earning $2K/month. Here''s exactly what I did:

**The Portfolio Strategy:**
- Curated just 20 of my BEST photos (quality over quantity)
- Organized into 3 categories: portraits, street, and food
- Used a clean, minimal website (Squarespace Photography template)
- Added brief stories behind each photo

**The Marketing:**
- Posted consistently on Instagram with location tags
- Reached out to 10 local restaurants offering a free food photography session
- 3 said yes, and the photos were so good they referred me to others
- Created a Google Business Profile for local SEO

**Pricing:**
- Started at $150/session for portraits
- $300 for restaurant/food photography packages
- Now charging $500+ as demand grew

**Gear:** You don''t need expensive equipment to start. I shot my first paid gig with a Canon EOS M50 and a 50mm f/1.8 lens (total: ~$700).

The biggest lesson? Stop waiting until you''re "good enough." Your current skill level is someone''s dream photographer. Start sharing your work NOW.

Anyone else making money from creative skills? Would love to hear your stories! 📷', 'Photography', ARRAY['photography', 'freelance', 'portfolio', 'business', 'creative'], now() - interval '1 day'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'Understanding Color Theory: The Secret Weapon Most Designers Ignore', 'Color theory isn''t just for painters — it''s the foundation of EVERY visual discipline. Here''s a breakdown that changed how I approach design:

**The Basics:**
- **Primary colors** (Red, Blue, Yellow) can''t be mixed from other colors
- **Complementary colors** (opposite on the wheel) create maximum contrast
- **Analogous colors** (neighbors on the wheel) create harmony

**The Psychology:**
- 🔴 Red: urgency, passion, appetite (used by food brands)
- 🔵 Blue: trust, calm, professionalism (used by banks & tech)
- 🟢 Green: growth, health, nature (used by eco brands)
- 🟡 Yellow: optimism, warmth, caution
- 🟣 Purple: luxury, creativity, wisdom

**Pro Tips:**
1. Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent
2. Always check contrast ratios for accessibility (WCAG AA minimum)
3. Test your palette in grayscale — if it works without color, it''ll work with color
4. Limit your palette to 3-5 colors maximum

**Tools I Use:**
- Coolors.co for palette generation
- Adobe Color for exploring harmonies
- Contrast Checker by WebAIM

This applies to graphic design, interior design, fashion, photography — literally everything visual. Master color and you master visual communication.

What''s your go-to color palette tool? 🎨', 'Design', ARRAY['color theory', 'design', 'graphic design', 'visual arts', 'tips'], now() - interval '3 days'),

-- Finance posts
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'Beginner''s Guide to Investing: What I Wish I Knew at 20', 'I started investing at 25 and wish I''d started at 20. Here''s the straightforward guide nobody gave me:

**Step 1: Emergency Fund First**
Before investing a single rupee/dollar, save 3-6 months of expenses. This prevents you from panic-selling investments during tough times.

**Step 2: Understand the Options**
- **Index Funds/ETFs**: The easiest way to start. You buy a slice of the entire market. S&P 500 has averaged ~10% annual returns over decades.
- **Fixed Deposits/Bonds**: Lower risk, lower return. Good for short-term goals.
- **Individual Stocks**: Higher risk, requires research. Don''t start here.
- **Mutual Funds**: Professionally managed, but higher fees than index funds.

**Step 3: The Power of Compounding**
If you invest ₹5,000/month starting at age 20 with 12% annual returns:
- At 30: ₹11.6 lakhs
- At 40: ₹49.9 lakhs  
- At 50: ₹1.76 crores
- At 60: ₹5.9 crores

Starting 5 years earlier literally DOUBLES your wealth by retirement.

**Step 4: Avoid Common Mistakes**
❌ Trying to time the market
❌ Investing money you''ll need in < 5 years
❌ Following social media "gurus" blindly
❌ Putting all eggs in one basket

**Resources:**
- "The Psychology of Money" by Morgan Housel
- Zerodha Varsity (free, excellent for Indian markets)
- Khan Academy Finance section

Start small, stay consistent, and let time do the heavy lifting. 📈', 'Finance', ARRAY['investing', 'finance', 'beginner', 'personal finance', 'stocks'], now() - interval '4 days'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'CFA vs CPA vs FRM: Which Finance Certification Should You Pursue?', 'Confused about finance certifications? Here''s an honest comparison based on my research and conversations with professionals:

**CFA (Chartered Financial Analyst)**
- Best for: Investment management, equity research, portfolio management
- Difficulty: 3 levels, ~300 hours study per level
- Pass rate: ~45% Level 1, ~45% Level 2, ~52% Level 3
- Cost: ~$3,000-5,000 total
- Salary boost: $50K-80K more than non-CFA peers
- Time: 2.5-5 years typically

**CPA (Certified Public Accountant)**
- Best for: Accounting, auditing, tax, corporate finance
- Difficulty: 4 sections, ~400 hours total study
- Pass rate: ~50% per section
- Cost: ~$2,000-4,000
- Salary boost: 10-15% premium
- Required for: Public accounting firms (Big 4)

**FRM (Financial Risk Manager)**
- Best for: Risk management, banking, insurance
- Difficulty: 2 parts, ~200 hours per part
- Pass rate: ~45% Part 1, ~60% Part 2
- Cost: ~$1,500-2,500
- Growing demand: Post-2008 regulations increased need

**My Recommendation:**
- Want to manage money? → CFA
- Want to be an accountant/auditor? → CPA
- Want to work in risk at a bank? → FRM
- Not sure? → Start with CFA Level 1, it opens the most doors

Has anyone here cleared any of these? Share your experience! 📊', 'Finance', ARRAY['cfa', 'cpa', 'frm', 'certification', 'finance career'], now() - interval '5 days'),

-- Music posts
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'How I Learned Guitar in 6 Months Using YouTube and a Structured Practice Routine', 'January: I couldn''t play a single chord. July: I was playing full songs at an open mic. Here''s my exact roadmap:

**Month 1-2: Foundation**
- Learned 8 basic open chords (G, C, D, Em, Am, E, A, Dm)
- Practiced chord transitions 15 min/day
- Used Justin Guitar (free YouTube channel) as primary resource
- Focused on strumming patterns with a metronome

**Month 3: First Songs**
- "Wonderwall" (Am, Em, G, D - simple strumming)
- "Stand By Me" (A, F#m, D, E)
- "Horse With No Name" (just Em and D!)
- Practiced 30 min/day

**Month 4: Barre Chords & Theory**
- F and Bm barre chords (hardest part of the journey)
- Basic music theory: keys, scales, chord progressions
- Started learning the pentatonic scale for soloing

**Month 5: Finger Picking & More Songs**
- Travis picking pattern
- "Blackbird" by Beatles
- "Dust in the Wind" by Kansas
- 45 min/day practice

**Month 6: Performing**
- Could play 15+ songs confidently
- Signed up for an open mic night
- Terrifying but incredibly rewarding

**Resources Used (all free):**
- Justin Guitar (YouTube)
- Ultimate Guitar (tabs & chords)
- Songsterr (interactive tabs)
- Metronome Beats app

The #1 tip: Practice EVERY DAY even if it''s just 10 minutes. Consistency beats marathon sessions. 🎸', 'Music', ARRAY['guitar', 'music', 'beginner', 'self-learning', 'practice'], now() - interval '6 days'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'Music Production on a Budget: My Home Studio Setup Under $500', 'You don''t need a $10,000 studio to make professional-sounding music. Here''s my complete setup:

**Hardware ($350):**
- Audio Interface: Focusrite Scarlett Solo ($120) - Clean preamp, reliable
- Microphone: Audio-Technica AT2020 ($100) - Great condenser mic for vocals
- Headphones: Audio-Technica ATH-M50x ($130) - Industry standard for mixing
- Pop filter + mic stand ($20-30)

**Software (Free!):**
- DAW: Reaper ($60 license, free trial forever) or GarageBand (Mac, free)
- Plugins: Vital synth (free), OTT compressor (free), TDR Nova EQ (free)
- Samples: Splice has a free trial, or use Freesound.org
- Mixing reference: LANDR''s free mastering for demos

**Acoustic Treatment ($50-100):**
- Moving blankets on walls behind your mic
- DIY bass traps from Rockwool insulation
- Record in a closet full of clothes (seriously, it works!)

**Learning Resources:**
- "In The Mix" YouTube channel (mixing tutorials)
- "You Suck at Producing" (production techniques)
- Coursera Berklee Music Production specialization

The truth is: your ears and creativity matter 100x more than gear. Some of the biggest hits were recorded on worse equipment than what you probably already have.

What DAW do you use? 🎵', 'Music', ARRAY['music production', 'home studio', 'budget', 'audio', 'daw'], now() - interval '7 days'),

-- Writing & Creative posts
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'The Daily Writing Habit That Helped Me Finish My First Novel', 'After years of "wanting to write a novel," I finally finished a 75,000-word manuscript in 5 months. The secret wasn''t inspiration — it was a system.

**The 500-Word Minimum Rule:**
Every single day, no exceptions, I wrote at least 500 words. That''s roughly one page. On good days I''d write 2,000+. On bad days, exactly 500 painful words. But I NEVER skipped a day.

**My Daily Routine:**
- 6:00 AM: Coffee, no phone
- 6:15 AM: Re-read last paragraph from yesterday
- 6:20 AM: Write for 45-60 minutes
- 7:15 AM: Log word count in spreadsheet
- Done. Regular day begins.

**Tools I Used:**
- Scrivener for manuscript organization ($50, worth every penny)
- Google Docs for mobile writing sessions
- Freedom app to block social media during writing time
- Story structure: Save the Cat! Writes a Novel by Jessica Brody

**What I Learned:**
1. Your first draft WILL be terrible. That''s the point. You can''t edit a blank page.
2. Plot > Prose in the first draft. Get the story down, pretty it up later.
3. Outline loosely but leave room for surprises
4. Read in your genre while you write. It keeps you sharp.
5. Join a writing community — I used r/writing and a local writing group

**The Math:**
500 words/day × 150 days = 75,000 words (a full novel)

That''s it. No muse required. Just consistency and a refusal to let yourself off the hook.

Currently editing draft 2. It''s painful but exciting! Who else is working on a book? ✍️', 'Writing', ARRAY['writing', 'novel', 'creative writing', 'productivity', 'habits'], now() - interval '8 days'),

-- Health & Culinary
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'Meal Prep Sunday: How I Eat Healthy All Week in 2 Hours', 'Eating healthy isn''t about willpower — it''s about preparation. Here''s my Sunday meal prep system that saves me 10+ hours and ₹3000+ per week:

**The Prep (2 hours):**

**Proteins (30 min):**
- Bake 1kg chicken breast with spices (20 min prep, 25 min bake)
- Cook a pot of lentils/dal (15 min prep, 20 min cook)
- Hard boil 12 eggs

**Carbs (20 min):**
- Cook a large batch of brown rice or quinoa
- Bake sweet potatoes

**Vegetables (30 min):**
- Roast a tray of mixed vegetables (broccoli, bell peppers, zucchini)
- Prep a large salad jar (5 jars for the week)
- Chop fruits for snacks

**Assembly (20 min):**
- Divide into 10 containers (5 lunch + 5 dinner)
- Label with day and meal

**Sample Day:**
- Breakfast: Overnight oats with fruits (prepped in jars)
- Lunch: Chicken + brown rice + roasted veggies
- Snack: Hard boiled egg + fruit
- Dinner: Lentil curry + sweet potato

**Cost Breakdown:**
- Chicken: ₹400
- Lentils + rice: ₹200
- Vegetables + fruits: ₹500
- Eggs + oats: ₹200
- Total: ~₹1,300/week for ALL meals

Compared to ordering food daily: ₹4,000-6,000/week easy.

**Containers I Use:** Glass meal prep containers from Amazon (set of 10 for ₹800). 

The game-changer was making it a non-negotiable Sunday ritual. Like brushing teeth — you just do it.

Share your meal prep tips! 🍳', 'Health', ARRAY['meal prep', 'healthy eating', 'cooking', 'nutrition', 'budget'], now() - interval '9 days'),

('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'Why Every Student Should Learn Basic Accounting (Even Non-Commerce Students)', 'I''m a computer science graduate. The most useful course I ever took? An elective in basic accounting. Here''s why:

**Real Life Uses:**
1. **Personal budgeting**: Understanding income vs expenses, assets vs liabilities
2. **Freelancing**: Tracking invoices, managing taxes, knowing your actual profit
3. **Startup world**: Reading financial statements of potential employers
4. **Investing**: Understanding P/E ratios, balance sheets, cash flow statements
5. **Negotiating salary**: Knowing your market value and total compensation

**The Basics You Need (Just 10 Concepts):**
- Revenue vs Profit
- Assets vs Liabilities  
- Cash Flow Statement
- Balance Sheet
- Income Statement
- Depreciation
- Tax Deductions
- ROI calculation
- Compound Interest
- Break-even Analysis

**Free Resources:**
- Khan Academy Accounting (completely free, excellent)
- Accounting Coach (free basics)
- "Accounting Made Simple" by Mike Piper (book, ~₹500)

**The "Aha" Moment:**
When I started freelancing, I realized I was losing 30% of my income to poor tax planning. Basic accounting knowledge helped me:
- Set up proper invoicing
- Track deductible expenses
- Save ₹40,000/year in taxes legally

You don''t need to become a CA. Just understanding the fundamentals gives you a massive advantage in life. Start with Khan Academy — it''ll take just 10-15 hours.

What non-obvious skill has helped you the most? 📊', 'Finance', ARRAY['accounting', 'personal finance', 'education', 'life skills', 'career'], now() - interval '10 days'),

-- Film
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', 'How to Make a Short Film With Just Your Phone: A Complete Guide', 'You don''t need a RED camera or a Hollywood budget. Some award-winning short films were shot entirely on smartphones. Here''s how:

**Pre-Production (Most Important!):**
- Write a simple script (2-5 pages = 2-5 min film)
- Create a shot list (every single camera angle planned)
- Storyboard key scenes (stick figures are fine!)
- Scout locations (natural light is your best friend)
- Rehearse with actors (even friends count)

**Shooting:**
- Use your phone''s highest resolution (4K if available)
- Shoot in landscape mode ALWAYS
- Use a cheap tripod/gimbal (₹1,000-2,000)
- Film during golden hour (sunrise/sunset) for cinematic look
- Record audio separately using a ₹500 lapel mic

**Editing (Free Tools):**
- DaVinci Resolve (free, professional-grade)
- CapCut (mobile, surprisingly powerful)
- Add royalty-free music from Artlist or YouTube Audio Library

**The 3 Rules of Smartphone Filmmaking:**
1. **Stable shots** — Shaky footage = amateur footage. Use a tripod.
2. **Good audio** — Bad audio ruins good visuals. Invest in a mic.
3. **Natural lighting** — Shoot near windows or outdoors. Avoid harsh overhead lights.

**Distribution:**
- Film festivals: FilmFreeway has festivals accepting smartphone films
- YouTube/Vimeo for building an audience
- Instagram Reels for shorter pieces

I made my first short film for ₹2,000 total (lapel mic + tripod). It got 50,000 views on YouTube and opened doors to paid video work.

The best camera is the one you have with you. START. 🎬', 'Film', ARRAY['filmmaking', 'short film', 'smartphone', 'creative', 'video'], now() - interval '11 days'),

-- Psychology
('76983e1e-10b3-45ba-bc0f-fa1c19e19f6d', '5 Psychology Books That Changed How I Understand People', 'As a psychology student, these 5 books fundamentally changed how I see human behavior. Each is accessible to non-psychology readers:

**1. "Thinking, Fast and Slow" - Daniel Kahneman**
Your brain has two systems: fast (intuitive) and slow (analytical). Most of our decisions are made by the fast system, which is full of cognitive biases. Understanding this changed how I make decisions.
⭐ Key insight: We''re not as rational as we think.

**2. "The Body Keeps the Score" - Bessel van der Kolk**
How trauma physically changes the brain and body. Essential reading for understanding anxiety, PTSD, and why "just get over it" doesn''t work.
⭐ Key insight: Trauma isn''t just in your head — it''s in your body.

**3. "Influence" - Robert Cialdini**
The 6 principles of persuasion used in marketing, politics, and daily life. Once you learn them, you see them everywhere.
⭐ Key insight: Reciprocity, commitment, social proof, authority, liking, scarcity.

**4. "Atomic Habits" - James Clear**
The psychology of habit formation. Small changes compound into remarkable results. The most practical psychology book I''ve read.
⭐ Key insight: You don''t rise to the level of your goals; you fall to the level of your systems.

**5. "Man''s Search for Meaning" - Viktor Frankl**
A Holocaust survivor and psychiatrist explores how meaning sustains us through suffering. Short but life-changing.
⭐ Key insight: Those who have a ''why'' can bear almost any ''how.''

**Honorable mentions:**
- "Stumbling on Happiness" by Daniel Gilbert
- "The Social Animal" by Elliot Aronson
- "Flow" by Mihaly Csikszentmihalyi

What psychology books impacted you the most? 🧠', 'Psychology', ARRAY['psychology', 'books', 'reading', 'self improvement', 'mental health'], now() - interval '12 days')

ON CONFLICT DO NOTHING;
