import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";
import { Book, Layers, Youtube, Globe, Brain, Star } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const skillDescriptions: Record<string, string> = {
  "ai": "Artificial Intelligence (AI) is the field of building systems that can perform tasks that normally require human intelligence — including perception, reasoning, learning and natural language understanding.",
  "machine learning": "Machine Learning focuses on algorithms that learn patterns from data to make predictions or decisions without being explicitly programmed for each task.",
  "data science": "Data Science combines statistics, data analysis, and domain knowledge to extract insights and drive decisions from data.",
  "cyber security": "Cybersecurity covers protecting networks, systems, and programs from digital attacks and unauthorized access.",
  "cloud computing": "Cloud Computing provides on-demand compute, storage, and services over the internet to build scalable applications.",
  "blockchain": "Blockchain is a distributed ledger technology for decentralized and tamper-resistant record keeping, used in cryptocurrencies and beyond.",
  "software development": "Software Development is the process of designing, building, testing, and maintaining software applications and systems.",
  "design": "Design covers UX, UI, and product design practices to create user-centered, accessible, and delightful experiences.",
  "digital marketing": "Digital Marketing focuses on online channels to reach customers via search, social, email, and content strategies.",
  "finance": "Finance degrees focus on financial analysis, markets, corporate finance, and investment strategies.",
  "education": "Education covers pedagogy, curriculum design and instructional strategies for effective learning experiences.",
};

export default function SkillRecommendations() {
  const query = useQuery();
  const q = (query.get("q") || query.get("skill") || "").trim();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const skillKey = q.toLowerCase();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!q) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRecommendations(q);
        if (!mounted) return;
        setRecommendations(res || []);
      } catch (e: any) {
        console.error(e);
        if (!mounted) return;
        setError("Failed to load recommendations.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [q]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    recommendations.forEach((r) => { map[r.type] = (map[r.type] || 0) + 1; });
    return map;
  }, [recommendations]);

  const tabs = [
    { key: "all", label: "All" },
    { key: "youtube", label: `Videos (${counts.youtube || 0})` },
    { key: "book", label: `Books (${counts.book || 0})` },
    { key: "course", label: `Courses (${counts.course || 0})` },
    { key: "website", label: `Websites (${counts.website || 0})` },
    { key: "other", label: `Other (${recommendations.length - (counts.youtube || 0) - (counts.book || 0) - (counts.course || 0) - (counts.website || 0)})` },
  ];

  function typeIcon(t: Recommendation["type"]) {
    switch (t) {
      case "book": return <Book className="w-4 h-4 text-yellow-400" />;
      case "course": return <Layers className="w-4 h-4 text-blue-400" />;
      case "youtube": return <Youtube className="w-4 h-4 text-red-500" />;
      case "website": return <Globe className="w-4 h-4 text-teal-400" />;
      default: return <Brain className="w-4 h-4 text-gray-400" />;
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{q ? q : "Skill"} Recommendations</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {skillDescriptions[skillKey] || `Curated resources, courses, books and videos to help you learn ${q || 'this skill'} effectively.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <div>Resources: <span className="font-medium text-gray-900">{recommendations.length}</span></div>
                <div className="flex items-center gap-2 mt-1">Top Rating: <Star className="w-4 h-4 text-yellow-400" /> <span className="font-medium">{(recommendations.reduce((s, r) => s + (r.rating || 0), 0) / Math.max(1, recommendations.filter(r => r.rating).length)).toFixed(1)}</span></div>
              </div>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</Button>
            </div>
          </div>
        </header>

        <main>
          <Card className="mb-6">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <h2 className="text-lg font-semibold">About {q}</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {skillDescriptions[skillKey] || `Resources selected to help you build practical knowledge in ${q}. Browse videos, books, courses and websites curated from multiple sources.`}
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <div className="text-sm text-muted-foreground">Estimated time to proficiency</div>
                  <div className="text-xl font-semibold mt-1">{q ? (q.length > 8 ? '3-6 months' : '1-3 months') : 'Varies'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {tabs.map((t) => (
                <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((t) => (
              <TabsContent key={t.key} value={t.key}>
                <div className="grid md:grid-cols-2 gap-4">
                  {loading && <div className="text-sm text-muted-foreground">Loading recommendations…</div>}
                  {!loading && recommendations.filter((r) => t.key === 'all' ? true : (r.type === t.key)).length === 0 && (
                    <div className="text-sm text-muted-foreground">No recommendations found for this category.</div>
                  )}

                  {!loading && recommendations.filter((r) => t.key === 'all' ? true : (r.type === t.key)).map((r, i) => (
                    <Card key={`${t.key}-${i}`} className="bg-gradient-to-br from-background to-muted border-0 shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="flex items-center gap-3">
                        <div className="p-2 rounded bg-white/5">
                          {typeIcon(r.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold">{r.title}</h3>
                            <div className="text-sm text-muted-foreground">{r.provider || r.type}</div>
                          </div>
                          {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {r.rating && <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{r.rating.toFixed(1)}</div>}
                            {r.duration && <div>{r.duration}</div>}
                            {r.difficulty && <div className="capitalize">{r.difficulty}</div>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">Open resource</a>
                          <div className="text-sm text-muted-foreground">{r.views}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </Layout>
  );
}
