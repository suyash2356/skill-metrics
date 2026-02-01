import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";
import { Book, Layers, Youtube, Globe, Brain, Star, Map, Library, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react";
import { useUserProfileDetails } from "@/hooks/useUserProfileDetails";
import { getPersonalizedResources } from "@/lib/resourceMatcher";
import { getSkillRoadmap, generateGenericRoadmap } from "@/lib/skillRoadmaps";
import { SkillRoadmapSection } from "@/components/SkillRoadmapSection";
import { ResourceRatingCard } from "@/components/ResourceRatingCard";
import { useResourceRatings } from "@/hooks/useResourceRatings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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
                      <ResourceCard key={`${t.key}-${i}`} recommendation={r} typeIcon={typeIcon} />
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

// Enhanced Resource Card with Rating Integration
interface ResourceCardProps {
  recommendation: Recommendation;
  typeIcon: (t: Recommendation["type"]) => React.ReactNode;
}

function ResourceCard({ recommendation: r, typeIcon }: ResourceCardProps) {
  const { user } = useAuth();
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [showRatingCard, setShowRatingCard] = useState(false);
  
  // Try to find matching resource in database by title
  useEffect(() => {
    async function findResource() {
      const { data } = await supabase
        .from('resources')
        .select('id, avg_rating, total_ratings, recommend_percent, total_votes')
        .ilike('title', r.title)
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setResourceId(data.id);
      }
    }
    findResource();
  }, [r.title]);

  const {
    stats,
    userVote,
    hasEnoughRatings,
    formatRatingCount,
    submitVote,
    isAuthenticated,
  } = useResourceRatings(resourceId || undefined);

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    if (!resourceId) {
      toast.error('Resource not found in database');
      return;
    }
    submitVote(voteType);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted border-0 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex items-center gap-3 pb-2">
        <div className="p-2 rounded bg-white/5">
          {typeIcon(r.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{r.title}</h3>
            <div className="text-sm text-muted-foreground">{r.provider || r.type}</div>
          </div>
          {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Rating Display */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            {resourceId && stats ? (
              hasEnoughRatings ? (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{stats.avg_rating?.toFixed(1)}</span>
                    <span className="text-muted-foreground">({formatRatingCount(stats.total_ratings)})</span>
                  </div>
                  {stats.recommend_percent !== null && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>{stats.recommend_percent}%</span>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground text-xs">
                  {stats.total_ratings}/10 ratings needed
                </span>
              )
            ) : (
              // Fallback to API rating
              r.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{r.rating.toFixed(1)}</span>
                </div>
              )
            )}
            {r.duration && <span className="text-muted-foreground">{r.duration}</span>}
            {r.difficulty && <Badge variant="outline" className="text-xs capitalize">{r.difficulty}</Badge>}
          </div>
        </div>

        {/* Vote Buttons (compact) */}
        {resourceId && (
          <div className="flex items-center gap-2">
            <Button
              variant={userVote?.vote_type === 'up' ? 'default' : 'outline'}
              size="sm"
              className="h-7 px-2 gap-1 text-xs"
              onClick={() => handleVote('up')}
            >
              <ThumbsUp className={`w-3 h-3 ${userVote?.vote_type === 'up' ? 'fill-current' : ''}`} />
              Recommend
            </Button>
            <Button
              variant={userVote?.vote_type === 'down' ? 'destructive' : 'outline'}
              size="sm"
              className="h-7 px-2 gap-1 text-xs"
              onClick={() => handleVote('down')}
            >
              <ThumbsDown className={`w-3 h-3 ${userVote?.vote_type === 'down' ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-xs ml-auto"
              onClick={() => setShowRatingCard(!showRatingCard)}
            >
              <MessageSquare className="w-3 h-3" />
              Rate & Review
            </Button>
          </div>
        )}

        {/* Expandable Rating Card */}
        {showRatingCard && resourceId && (
          <div className="pt-2 border-t">
            <ResourceRatingCard
              resourceId={resourceId}
              resourceTitle={r.title}
            />
          </div>
        )}

        {/* Open Resource Link */}
        <div className="flex items-center justify-between pt-2 border-t">
          <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
            Open resource →
          </a>
          {r.views && <span className="text-xs text-muted-foreground">{r.views}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
