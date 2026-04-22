# 🚀 Skill-Metrics: Your AI-Powered Learning Ecosystem

<p align="center">
  <img src="https://github.com/suyash2356/skill-metrics/blob/main/Screen%20Recording%202025-11-13%20224524.gif" alt="Skill-Metrics Preview" width="850">
</p>

<p align="center">
  <strong>The world's first learning platform that combines AI-driven roadmaps with a social learning feed and smart video scheduling.</strong><br/>
  Stop searching for resources. Start following a path.
</p>

---

## 🎯 The Problem
In the age of information overload, learners face three massive hurdles:
1.  **Resource Overwhelm:** Millions of tutorials, but no way to know which ones are actually good.
2.  **Lack of Structure:** Having resources is one thing; knowing the *order* to learn them is another.
3.  **The "Lone Learner" Syndrome:** Learning in isolation leads to burnout. Most platforms are passive delivery systems, not communities.

## ✨ How Skill-Metrics Solves It
Skill-Metrics bridges the gap between **passive content** and **active mastery**. We don't just give you a list of links; we build you a dynamic, AI-powered ecosystem that adapts to your schedule, tracks your proficiency, and connects you with a community of like-minded builders.

---

## 🌟 Key Features & Highlights

### 🧠 1. AI Roadmap Generator
Simply enter a goal (e.g., "Master Backend in 3 months"), and our AI constructs a multi-phase learning path.
*   **Tailored Phases:** Breaks down complex skills into manageable milestones.
*   **Resource Integration:** Automatically suggests top-rated articles and videos for every step.
*   **Progress Tracking:** Visualize your completion percentage in real-time.

### 🎥 2. First-of-its-Kind: Smart Watch Queue
The ultimate solution for video learners. 
*   **Goal-Based Scheduling:** Set a deadline, and the system auto-calculates how many videos you need to watch daily.
*   **Learning Streaks:** Gamify your education with daily targets and watch history.
*   **Curated Library:** Access 45+ high-quality videos across 16+ skill categories.

### 🏠 3. Social Learning Hub (Feed)
Inspired by Instagram and LinkedIn, our Home Feed allows you to:
*   **Share Insights:** Post your progress, share resources, or celebrate wins.
*   **Discover:** See what others in your community are learning and find trending resources.
*   **Engage:** Like, comment, and save posts to your personal collection.

### 💼 4. Premium Profile Dashboard
A visual representation of your professional growth.
*   **Skill Proficiency:** Visual progress bars for every skill you're mastering.
*   **Achievements & Awards:** Showcase your milestones and certifications.
*   **Mutual Connections:** See who you and your fellow learners have in common.

### 💬 5. Secure Collaborative Spaces
*   **Encrypted Messaging:** Private, secure chat for 1-on-1 collaboration.
*   **Community Groups:** Join specialized learning circles (similar to Discord) to work on projects together.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend/DB** | Supabase (PostgreSQL, Auth, Storage) |
| **AI Layer** | Supabase Edge Functions + AI LLM Models |
| **State/Data** | TanStack Query (React Query), Context API |
| **Real-time** | Supabase Real-time Subscriptions |

---

## ⚙️ How It Works (Under the Hood)

1.  **AI Orchestration:** When you request a roadmap, a **Supabase Edge Function** triggers an AI model that processes your current skill level, time commitment, and goal. It returns a structured JSON object which is then parsed into a multi-table schema (Roadmaps -> Steps -> Resources).
2.  **Social Graph:** We built a custom follower/following system using **PostgreSQL RLS (Row Level Security)** policies, ensuring that private profiles stay private while allowing public discovery.
3.  **Real-Time Sync:** Notifications and messaging use **Supabase Real-time**, providing a seamless "app-like" experience without manual page refreshes.
4.  **Content Curation:** A hybrid model where AI initially suggests resources, but the community "votes" them up or down through likes and shares.

---

## 🚧 Challenges Faced

*   **Complex RLS Architecting:** Designing a secure yet flexible privacy system for profiles (Private vs. Public) required deep-diving into complex SQL policies and mutual-follower logic.
*   **Responsive Dashboard Logic:** Managing a high-density dashboard with video queues, roadmaps, and feeds across mobile and desktop required significant CSS optimization.
*   **AI Consistency:** Ensuring the AI consistently generates valid, high-quality learning steps required rigorous prompt engineering and error-handling on the Edge Function side.

---

## ⚖️ Why Skill-Metrics is Different?

| Feature | Skill-Metrics | Traditional LMS (Coursera/Udemy) |
| :--- | :--- | :--- |
| **Personalization** | **High** (AI-generated for *you*) | **Low** (Fixed curriculum) |
| **Social** | **Integrated Feed & Chat** | **Static Forums** |
| **Video Learning** | **Smart Watch Queue** | **Linear Playlists** |
| **Structure** | **Dynamic Roadmaps** | **Single Courses** |
| **Price** | **100% Free** | **Paid/Subscription** |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Supabase Account

### Local Setup
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/suyash2356/skill-metrics.git
    cd skill-metrics
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file and add your Supabase URL and Anon Key.
4.  **Run Dev Server:**
    ```bash
    npm run dev
    ```

---

<p align="center">
  Built with ❤️ by Suyash and the AI-Education Community.
</p>
