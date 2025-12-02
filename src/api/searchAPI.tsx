// api/searchAPI.ts
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";
import { resourceData } from "@/data/resourceData";

// ------------------------------
// 🔹 Types
// ------------------------------
export type Recommendation = {
  type: "youtube" | "book" | "course" | "website" | "reddit" | "discord" | "blog";
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  duration?: string;
  rating?: number;
  url: string;
  views?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isPaid?: boolean;
};

export const allowedTopics = [
  "ai",
  "machine learning",
  "data science",
  "data analyst",
  "cyber security",
  "cloud computing",
  "blockchain",
  "software development",
  "full stack development",
  "devops",
  "iot",
  "ar/vr",
  "communication",
  "project management",
  "digital marketing",
  "financial management",
  "emotional intelligence",
  "design",
  "education",
];

// ------------------------------
// 🔹 Local Resource Data (Example: AI)
// ------------------------------
const localResources: Record<string, Recommendation[]> = {
  ai: [
    {
      type: "course",
      title: "AI for Everyone – Andrew Ng (Coursera)",
      description: "A non-technical introduction to artificial intelligence.",
      provider: "Coursera",
      url: "https://www.coursera.org/learn/ai-for-everyone",
      rating: 4.9,
      views: "2.4M learners",
      difficulty: "beginner",
      isPaid: false,
    },
    {
      type: "youtube",
      title: "Learn AI in 10 Minutes",
      description: "Quick overview of how artificial intelligence works.",
      provider: "YouTube",
      url: "https://www.youtube.com/watch?v=JMUxmLyrhSk",
      views: "4.8M",
      rating: 4.8,
      isPaid: false,
      difficulty: "beginner",
    },
    {
      type: "book",
      title: "Artificial Intelligence: A Modern Approach",
      description: "The most popular AI textbook by Stuart Russell and Peter Norvig.",
      provider: "Pearson",
      url: "https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003578/9780134610993",
      rating: 4.7,
      views: "120K+ readers",
      isPaid: true,
      difficulty: "advanced",
    },
  ],
};

// ------------------------------
// 🔹 Search Suggestions
// ------------------------------
export type Suggestion =
  | { kind: "user"; id: string; name: string; avatar?: string }
  | { kind: "skill"; name: string; description?: string; link?: string }
  | { kind: "explore"; name: string; subtype?: "certification" | "category" | "path" | "resource" | "degree"; description?: string; link?: string };

const suggestionCache: Record<string, Suggestion[]> = {};

export async function fetchPeopleCommunitySuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];
  if (suggestionCache[`people:${q}`]) return suggestionCache[`people:${q}`];

  const prefix = `${q}%`;
  const contains = `%${q}%`;

  const profilesRes = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url")
    .or(`full_name.ilike.${prefix},full_name.ilike.${contains}`)
    .limit(limit);

  const suggestions: Suggestion[] = [];

  if (profilesRes.data) {
    profilesRes.data.forEach((p) => {
      suggestions.push({
        kind: "user",
        id: p.user_id,
        name: p.full_name || p.user_id,
        avatar: p.avatar_url,
      });
    });
  }

  const all = suggestions.slice(0, limit);
  suggestionCache[`people:${q}`] = all;
  return all;
}

// Suggestions for Explore: skills and static explore items (categories, certifications, paths, resources)
export async function fetchExploreSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const q = query.trim();
  if (!q) return [];

  const perKind = Math.max(3, Math.floor(limit / 3));

  // skills
  const skills: Suggestion[] = allowedTopics
    .filter((s) => s.toLowerCase().includes(q.toLowerCase()))
    .slice(0, perKind)
    .map((s) => ({ kind: "skill", name: s }));

  // a small static set of explore items (mirrors Explore page content)
  const certifications = [
    { name: "AWS Certified Solutions Architect", link: "https://aws.amazon.com/certification/", desc: "AWS foundational to advanced architect skills" },
    { name: "Google Data Analytics", link: "https://www.coursera.org/professional-certificates/google-data-analytics", desc: "Data analysis and visualization" },
    { name: "Certified Ethical Hacker (CEH)", link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/", desc: "Ethical hacking and pen testing" },
    { name: "TensorFlow Developer Certificate", link: "https://www.tensorflow.org/certificate", desc: "TensorFlow and deep learning" },
    { name: "PMI Project Management Professional", link: "https://www.pmi.org/certifications", desc: "Project management best practices" },
    { name: "Microsoft Azure Fundamentals", link: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", desc: "Azure cloud fundamentals" },
  ];

  const paths = [
    { name: "Become a Data Scientist", link: "", desc: "End-to-end data science skills" },
    { name: "AI Engineer Roadmap", link: "", desc: "AI model development & deployment" },
    { name: "Full-Stack Developer", link: "", desc: "Frontend and backend development" },
    { name: "Cybersecurity Expert", link: "", desc: "Defensive and offensive security" },
    { name: "Cloud & DevOps Engineer", link: "", desc: "Cloud infra and automation" },
    { name: "Product Manager", link: "", desc: "Product strategy and execution" },
  ];

  const categories = [
    { name: "Artificial Intelligence", link: "", desc: "AI topics: ML, DL, NLP" },
    { name: "Data Science", link: "", desc: "Statistics, ML, visualization" },
    { name: "Cloud Computing", link: "", desc: "AWS, Azure, GCP" },
    { name: "Cybersecurity", link: "", desc: "Security operations and tools" },
    { name: "Blockchain", link: "", desc: "Smart contracts and web3" },
    { name: "DevOps", link: "", desc: "CI/CD, infra as code" },
    { name: "Software Development", link: "", desc: "Programming and architectures" },
    { name: "Product Management", link: "", desc: "Roadmaps and user research" },
  ];

  // Degrees (make them discoverable in suggestions)
  const degrees = [
    { title: "MSc in Computer Science", university: "Stanford University", link: "https://cs.stanford.edu/", desc: "Algorithms, systems, AI & software engineering" },
    { title: "Online MSc in Data Science", university: "University of London", link: "https://london.ac.uk/courses/data-science", desc: "Statistics, ML, viz, big data" },
    { title: "BSc in Cybersecurity", university: "Carnegie Mellon University", link: "https://www.cmu.edu/cybersecurity/", desc: "Network security, cryptography" },
    { title: "Online MBA (Technology)", university: "MIT xPRO", link: "https://xpro.mit.edu/", desc: "Product strategy & tech leadership" },
  ];

  // Trending / popular resources that should appear in suggestions with links
  const popularResources = [
    { title: "Deep Learning Specialization — Coursera", link: "https://www.coursera.org/specializations/deep-learning", desc: "Andrew Ng's DL series" },
    { title: "FreeCodeCamp — Machine Learning", link: "https://www.freecodecamp.org/learn/", desc: "Hands-on ML tutorials" },
    { title: "MIT OpenCourseWare", link: "https://ocw.mit.edu/", desc: "Free courses from MIT" },
  ];

  const exploreItems: Suggestion[] = [
    // certifications
    ...certifications
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, perKind)
      .map((c) => ({ kind: "explore", name: c.name, subtype: "certification", link: c.link, description: c.desc }) as Suggestion),
    // paths
    ...paths
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, perKind)
      .map((p) => ({ kind: "explore", name: p.name, subtype: "path", link: p.link, description: p.desc }) as Suggestion),
    // categories
    ...categories
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, perKind)
      .map((c) => ({ kind: "explore", name: c.name, subtype: "category", link: c.link, description: c.desc }) as Suggestion),
    // degrees
    ...degrees
      .filter((d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.university.toLowerCase().includes(q.toLowerCase()))
      .slice(0, perKind)
      .map((d) => ({ kind: "explore", name: d.title, subtype: "degree", link: d.link, description: `${d.university} — ${d.desc}` }) as Suggestion),
    // popular resources
    ...popularResources
      .filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, perKind)
      .map((r) => ({ kind: "explore", name: r.title, subtype: "resource", link: r.link, description: r.desc }) as Suggestion),
  ];

  const all: Suggestion[] = [...skills, ...exploreItems].slice(0, limit);
  return all;
}

// Backwards-compatible default: combined suggestions (profiles, skills)
export async function fetchSearchSuggestions(query: string, limit = 10): Promise<Suggestion[]> {
  const people = await fetchPeopleCommunitySuggestions(query, Math.max(3, Math.floor(limit / 2)));
  const explore = await fetchExploreSuggestions(query, Math.max(3, Math.floor(limit / 2)));
  const combined = [...people, ...explore].slice(0, limit);
  return combined;
}

// ------------------------------
// 🔹 Recommendations (YouTube, Books, + Local Resources)
// ------------------------------
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export async function fetchRecommendations(query: string): Promise<Recommendation[]> {
  const lowerQuery = query.toLowerCase();
  let recommendations: Recommendation[] = [];

  // Add local resources first (e.g., AI)
  if (resourceData[lowerQuery]) {
    recommendations = [...recommendations, ...resourceData[lowerQuery]];
  } else if (localResources[lowerQuery]) {
    recommendations = [...recommendations, ...localResources[lowerQuery]];
  }

  try {
    const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        type: "channel",
        maxResults: 5,
      },
    });
    ytRes.data.items.forEach((item: any) => {
      recommendations.push({
        type: "youtube",
        title: item.snippet.title,
        description: item.snippet.description,
        provider: "YouTube",
        url: `https://www.youtube.com/channel/${item.id.channelId}`,
        views: `${Math.floor(Math.random() * 1000)}K+`, // mock views
        rating: 4 + Math.random(),
        isPaid: false,
      });
    });
  } catch (e) {
    console.error("YouTube API Error:", e);
  }

  try {
    const booksRes = await axios.get(GOOGLE_BOOKS_API, { params: { q: query, maxResults: 5 } });
    booksRes.data.items?.forEach((item: any) => {
      recommendations.push({
        type: "book",
        title: item.volumeInfo.title,
        description: item.volumeInfo.description,
        author: item.volumeInfo.authors?.join(", "),
        provider: "Google Books",
        url: item.volumeInfo.infoLink,
        rating: 4 + Math.random(),
        isPaid: Math.random() > 0.7,
        views: `${Math.floor(Math.random() * 50)}K+ readers`,
      });
    });
  } catch (e) {
    console.error("Books API Error:", e);
  }

  return recommendations;
}