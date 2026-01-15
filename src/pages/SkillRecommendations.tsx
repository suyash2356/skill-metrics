import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";
import { Book, Layers, Youtube, Globe, Brain, Star, Map, Library } from "lucide-react";
import { useUserProfileDetails } from "@/hooks/useUserProfileDetails";
import { getPersonalizedResources } from "@/lib/resourceMatcher";
import { getSkillRoadmap, generateGenericRoadmap } from "@/lib/skillRoadmaps";
import { SkillRoadmapSection } from "@/components/SkillRoadmapSection";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SkillRecommendations() {
  const { skill } = useParams<{ skill: string }>();
  const query = useQuery();
  const q = (skill || query.get("q") || query.get("skill") || "").trim();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'resources'>('roadmap');
  const { profileDetails } = useUserProfileDetails();

  // Get skill roadmap
  const skillRoadmap = useMemo(() => {
    if (!q) return null;
    return getSkillRoadmap(q) || generateGenericRoadmap(q);
  }, [q]);

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

  // Personalize recommendations based on user profile
  const personalizedRecommendations = useMemo(() => {
    if (!profileDetails || recommendations.length === 0) return recommendations;
    
    const userProfile = {
      experienceLevel: profileDetails.experience_level || 'beginner',
      skills: (profileDetails.skills || []).map((s: any) => s.name),
      learningGoals: profileDetails.bio?.toLowerCase().split(/\s+/) || [],
      prefersFree: !profileDetails.company,
    };

    return getPersonalizedResources(recommendations, userProfile);
  }, [recommendations, profileDetails]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    personalizedRecommendations.forEach((r) => { map[r.type] = (map[r.type] || 0) + 1; });
    return map;
  }, [personalizedRecommendations]);

  const resourceTabs = [
    { key: "all", label: "All" },
    { key: "youtube", label: `Videos (${counts.youtube || 0})` },
    { key: "book", label: `Books (${counts.book || 0})` },
    { key: "course", label: `Courses (${counts.course || 0})` },
    { key: "website", label: `Websites (${counts.website || 0})` },
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
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold">{q || "Skill"}</h1>
              {profileDetails && (
                <Badge variant="secondary" className="mt-2">
                  Personalized for {profileDetails.experience_level || 'your'} level
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'roadmap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('roadmap')}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Learning Path
              </Button>
              <Button
                variant={activeTab === 'resources' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('resources')}
                className="gap-2"
              >
                <Library className="w-4 h-4" />
                Resources ({recommendations.length})
              </Button>
            </div>
          </div>
        </header>

        <main>
          {/* Learning Path Tab */}
          {activeTab === 'roadmap' && skillRoadmap && (
            <SkillRoadmapSection roadmap={skillRoadmap} />
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="flex flex-wrap gap-2">
                {resourceTabs.map((t) => (
                  <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
                ))}
              </TabsList>

              {resourceTabs.map((t) => (
                <TabsContent key={t.key} value={t.key}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {loading && <div className="text-sm text-muted-foreground">Loading recommendations…</div>}
                    {!loading && personalizedRecommendations.filter((r) => t.key === 'all' ? true : (r.type === t.key)).length === 0 && (
                      <div className="text-sm text-muted-foreground">No recommendations found for this category.</div>
                    )}

                    {!loading && personalizedRecommendations.filter((r) => t.key === 'all' ? true : (r.type === t.key)).map((r, i) => (
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
          )}
        </main>
      </div>
    </Layout>
  );
}
