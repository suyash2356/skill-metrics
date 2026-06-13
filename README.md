# 🚀 Skill-Metric: AI-Powered Personalized Learning Recommendation Platform

<p align="center">
  <img src="https://github.com/suyash2356/skill-metrics/blob/main/Screen%20Recording%202025-11-13%20224524.gif" alt="Skill-Metric Preview" width="850">
</p>

<p align="center">
  <strong>A machine learning-driven platform that helps learners discover what to learn next, which resources to use, and how to progress efficiently toward their goals.</strong>
</p>

---

## 🎯 Vision

Most learners spend more time searching for resources than actually learning.

Skill-Metric aims to solve this problem by building a personalized learning recommendation system that can:

- Recommend the best learning resources
- Generate structured learning roadmaps
- Track skill progression
- Suggest the next topic to learn
- Create personalized learning journeys

The long-term goal is to build a **Learning GPS** that guides users from their current skill level to their desired career goal through intelligent recommendations and skill graphs.

---

## ❌ The Problem

Today's learners face three major challenges:

### Information Overload
Millions of resources exist, but finding the right one is difficult.

### Lack of Structured Learning
Learners often know what they want to become but don't know the correct sequence of topics to learn.

### No Personalization
Most platforms provide the same content to everyone regardless of skill level, goals, or interests.

As a result:

```text
50% Learning
50% Searching
```

Skill-Metric aims to make it:

```text
95% Learning
5% Searching
```

---

## 🧠 Machine Learning Focus

Skill-Metric is centered around designing intelligent recommendation systems for educational content.

### 1. Content-Based Recommendation

Recommends resources using:

- Domain
- Skills
- Difficulty
- Tags
- Learning Outcomes

This helps solve cold-start problems and resource discovery.

---

### 2. Collaborative Filtering

Learns from user behavior and interactions.

| Interaction | Weight |
|------------|---------:|
| View | 1 |
| Like | 3 |
| Complete | 5 |
| Skip | -2 |

By analyzing interaction patterns, the system identifies resources that similar learners found useful.

---

### 3. Hybrid Recommendation System

The recommendation engine combines:

```text
Collaborative Filtering (ALS)
+
Content Similarity
+
Resource Quality Scores
+
Domain Preference Matching
```

to generate personalized recommendations.

Final scoring approach:

```text
score(user, resource)
=
α × collaborative_score
+
β × content_similarity
+
γ × quality_score
+
δ × domain_match
```

---

## 📊 Recommendation Infrastructure

Current recommendation dataset:

| Metric | Count |
|---------|--------:|
| Resources | 780+ |
| User Interactions | 2,100+ |
| Domains | 6+ |
| Learning Categories | 60+ |
| Learning Outcomes | 700+ |

The platform captures learning signals such as:

- Views
- Likes
- Saves
- Completions
- Skips
- User Preferences
- Domain Interests

These interactions form the foundation for recommendation model training.

---

## 🔬 Recommendation Pipeline

```text
User Activity
      ↓
Interaction Tracking
      ↓
Feature Engineering
      ↓
Recommendation Engine
      ├── Collaborative Filtering
      ├── Content Similarity
      ├── Quality Ranking
      └── Domain Matching
      ↓
Personalized Recommendations
```

---

## 🚀 Current ML Work

### Completed

✅ Interaction tracking system

✅ Recommendation data pipeline

✅ User-resource interaction modeling

✅ Resource ranking architecture

✅ Content-based recommendation design

✅ Collaborative filtering pipeline

✅ Hybrid recommendation architecture

✅ Personalized recommendation APIs

✅ Cold-start recommendation support

---

### Currently Building

#### Sequential Learning Engine

The long-term goal is not only recommending resources but recommending the next best topic to learn.

Example:

```text
Python
 ↓
NumPy
 ↓
Pandas
 ↓
Statistics
 ↓
Machine Learning
 ↓
Deep Learning
```

This system will use:

- Skill Graphs
- Prerequisite Relationships
- User Progress
- Learning History

to create adaptive learning journeys.

---

## 🌟 Platform Features

### 🧠 AI Roadmap Generator

Generate personalized learning roadmaps based on:

- Goal
- Current Skill Level
- Learning Timeline

---

### 📚 Personalized Resource Recommendations

Discover learning resources tailored to your interests and goals.

---

### 🕸️ Skill Graphs

Visualize:

- Skills
- Dependencies
- Learning Paths
- Progression Routes

---

### 📈 Progress Tracking

Track:

- Completed Resources
- Skill Progress
- Learning Milestones

---

### 🔍 Explore Platform

Browse:

- Trending Resources
- Domain-Specific Content
- Community Recommendations

---

### 🏠 Social Learning Feed

A community-driven learning feed where users can:

- Share insights
- Post resources
- Discuss technologies
- Showcase projects

---

### 👥 Learning Communities

Join domain-specific communities to:

- Collaborate
- Ask questions
- Share notes
- Learn together

---

## 🏗️ System Architecture

```text
                    User
                      │
                      ▼
             Interaction Layer
                      │
                      ▼
                PostgreSQL
                  (Supabase)
                      │
                      ▼
            Recommendation Engine
         ┌─────────┬─────────┬─────────┐
         │         │         │
         ▼         ▼         ▼
      Content     ALS      Ranking
      Model      Model      Layer
         │         │         │
         └─────────┴─────────┘
                   │
                   ▼
       Personalized Recommendations
                   │
                   ▼
                Frontend
```

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React, TypeScript, Vite |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| ML Models | Implicit ALS, Sentence Transformers |
| Vector Search | FAISS |
| APIs | Supabase Edge Functions |
| Deployment | Vercel |

---

## 🎯 Future ML Roadmap

### Resource Recommendation Model
Improve personalization using hybrid recommendation techniques.

### Sequential Learning Engine
Predict the most effective next skill or topic.

### Explore Recommendation System
Recommend resources similar to Spotify's personalized discovery.

### Feed Ranking Model
Rank posts based on:

- Interests
- Engagement
- Skill Domains
- Learning Goals

### Roadmap Optimization Model
Continuously improve generated learning paths using user outcomes and completion data.

### Learning State Model
Understand a learner's current knowledge level and dynamically adjust recommendations.

---

## ⚡ Why Skill-Metric is Different

Most platforms recommend content.

Skill-Metric aims to recommend the entire learning journey.

Instead of asking:

> "Which course should I take?"

Users can simply ask:

> "I want to become an ML Engineer."

And Skill-Metric helps determine:

```text
Current Skill Level
        ↓
Skills Required
        ↓
Learning Roadmap
        ↓
Best Resources
        ↓
Next Topic To Learn
        ↓
Progress Tracking
        ↓
Goal Achievement
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/suyash2356/skill-metrics.git
cd skill-metrics
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Run Development Server

```bash
npm run dev
```

---

## 👨‍💻 Author

**Suyash**

Building intelligent recommendation systems and personalized learning experiences through Machine Learning and AI.

---

<p align="center">
  Built with ❤️ to make learning more personalized, structured, and effective.
</p>
