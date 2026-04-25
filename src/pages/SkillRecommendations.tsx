import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchRecommendations, Recommendation } from "@/api/searchAPI";
import { Book, Layers, Youtube, Globe, Brain, Star, Map, Library, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Lock, ArrowRight, AlertTriangle, Zap, Clock, Target, TrendingUp } from "lucide-react";
import { useUserProfileDetails } from "@/hooks/useUserProfileDetails";
import { getPersonalizedResources } from "@/lib/resourceMatcher";
import { getSkillRoadmap, generateGenericRoadmap } from "@/lib/skillRoadmaps";
import { SkillRoadmapSection } from "@/components/SkillRoadmapSection";
import { ResourceRatingCard } from "@/components/ResourceRatingCard";
import { useResourceRatings } from "@/hooks/useResourceRatings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useSkillNodes, useSkillDependencies, useUserSkillProgress, useUpdateSkillProgress } from "@/hooks/useSkillGraph";
import { buildLearningPath, matchDomainToSkillGraph, filterResourcesBySkill, type SkillRecommendation, type LearningPathResult } from "@/lib/skillGraphEngine";
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState<'graph' | 'roadmap' | 'resources'>('graph');
  const { profileDetails } = useUserProfileDetails();
  const { user } = useAuth();
  
  // Skill Graph data
  const graphDomain = useMemo(() => matchDomainToSkillGraph(decodeURIComponent(q)), [q]);
  const { data: skillNodes = [] } = useSkillNodes(graphDomain || undefined);
  const skillNodeIds = useMemo(() => skillNodes.map(n => n.id), [skillNodes]);
  const { data: dependencies = [] } = useSkillDependencies(skillNodeIds);
  const { data: userProgress = [] } = useUserSkillProgress();
  const updateProgress = useUpdateSkillProgress();

  // Get ML Recommendations strictly for this domain
  const { data: mlRecommendations } = useRecommendations(user?.id, graphDomain || undefined);

  const hasSkillGraph = graphDomain && skillNodes.length > 0;

  // Build learning path
  const learningPath = useMemo<LearningPathResult | null>(() => {
    if (!hasSkillGraph) return null;
    const userProfile = profileDetails ? {
      experienceLevel: profileDetails.experience_level || 'beginner',
      skills: (profileDetails.skills || []).map((s: any) => typeof s === 'string' ? s : s.name || ''),
      learningGoals: (profileDetails.learning_path as any)?.goals || '',
      background: (profileDetails.learning_path as any)?.background || '',
    } : undefined;
    return buildLearningPath(skillNodes, dependencies, userProgress, userProfile);
  }, [hasSkillGraph, skillNodes, dependencies, userProgress, profileDetails]);

  // Get skill roadmap (fallback for domains without graph)
  const skillRoadmap = useMemo(() => {
    if (!q) return null;
    return getSkillRoadmap(q) || generateGenericRoadmap(q);
  }, [q]);

  // Default to 'graph' if we have a skill graph, else 'roadmap'
  useEffect(() => {
    if (hasSkillGraph && activeTab !== 'resources') {
      setActiveTab('graph');
    } else if (!hasSkillGraph && activeTab === 'graph') {
      setActiveTab('roadmap');
    }
  }, [hasSkillGraph]);

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

  const handleSkillStatusChange = (skillNodeId: string, newStatus: 'not_started' | 'in_progress' | 'completed' | 'skipped') => {
    updateProgress.mutate(
      { skillNodeId, status: newStatus },
      {
        onSuccess: () => toast.success(`Skill status updated`),
        onError: () => toast.error('Failed to update progress'),
      }
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold">{q ? decodeURIComponent(q) : "Skill"}</h1>
              {profileDetails && (
                <Badge variant="secondary" className="mt-2">
                  Personalized for {profileDetails.experience_level || 'your'} level
                </Badge>
              )}
              {learningPath && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    <span>{learningPath.completedCount}/{learningPath.totalCount} skills</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>~{learningPath.totalEstimatedHours}h total</span>
                  </div>
                  <Progress 
                    value={(learningPath.completedCount / learningPath.totalCount) * 100} 
                    className="w-32 h-2" 
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasSkillGraph && (
                <Button
                  variant={activeTab === 'graph' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('graph')}
                  className="gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Skill Graph
                </Button>
              )}
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
          {/* Skill Graph Tab */}
          {activeTab === 'graph' && learningPath && (
            <SkillGraphView 
              learningPath={learningPath} 
              onStatusChange={handleSkillStatusChange}
              recommendations={personalizedRecommendations}
              mlRecommendations={mlRecommendations || []}
            />
          )}

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

              {/* Show ML Recommendations at the top of 'all' tab */}
              <TabsContent value="all" className="space-y-6">
                {mlRecommendations && mlRecommendations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      Recommended for You
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mlRecommendations.map((mlRec) => {
                        // Map MLRecommendation to the UI Recommendation type format for ResourceCard
                        const mockRec: Recommendation = {
                          title: mlRec.title,
                          type: 'course', // Default fallback
                          url: '#',
                          description: `Personalized match (Score: ${mlRec.score})`
                        };
                        return <ResourceCard key={`ml-${mlRec.id}`} recommendation={mockRec} typeIcon={typeIcon} />;
                      })}
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-4">All Resources</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {loading && <div className="text-sm text-muted-foreground">Loading resources…</div>}
                  {!loading && personalizedRecommendations.length === 0 && (
                    <div className="text-sm text-muted-foreground">No recommendations found for this category.</div>
                  )}
                  {!loading && personalizedRecommendations.map((r, i) => (
                    <ResourceCard key={`all-${i}`} recommendation={r} typeIcon={typeIcon} />
                  ))}
                </div>
              </TabsContent>

              {/* Other specific resource type tabs */}
              {resourceTabs.filter(t => t.key !== 'all').map((t) => (
                <TabsContent key={t.key} value={t.key}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {loading && <div className="text-sm text-muted-foreground">Loading resources…</div>}
                    {!loading && personalizedRecommendations.filter((r) => r.type === t.key).length === 0 && (
                      <div className="text-sm text-muted-foreground">No resources found for this category.</div>
                    )}
                    {!loading && personalizedRecommendations.filter((r) => r.type === t.key).map((r, i) => (
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

// ═══════════════════════════════════════════
// SKILL GRAPH VIEW
// ═══════════════════════════════════════════

interface SkillGraphViewProps {
  learningPath: LearningPathResult;
  onStatusChange: (skillNodeId: string, status: 'not_started' | 'in_progress' | 'completed' | 'skipped') => void;
  recommendations: Recommendation[];
  mlRecommendations: import('@/hooks/useRecommendations').MLRecommendation[];
}

function SkillGraphView({ learningPath, onStatusChange, recommendations, mlRecommendations }: SkillGraphViewProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillRecommendation | null>(
    learningPath.nextSkill || learningPath.orderedSkills[0] || null
  );

  const getStatusColor = (status: SkillRecommendation['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-green-600';
      case 'in_progress': return 'bg-blue-500 text-white border-blue-600';
      case 'ready': return 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20';
      case 'locked': return 'bg-muted text-muted-foreground border-border opacity-60';
      case 'skipped': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const getStatusIcon = (status: SkillRecommendation['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'ready': return <ArrowRight className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDifficultyBadge = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-500/10 text-green-600',
      intermediate: 'bg-amber-500/10 text-amber-600',
      advanced: 'bg-red-500/10 text-red-600',
    };
    return colors[level] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Next Recommended Skill Banner */}
      {learningPath.nextSkill && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Recommended Next: {learningPath.nextSkill.node.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {learningPath.nextSkill.recommendationReason || learningPath.nextSkill.node.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getDifficultyBadge(learningPath.nextSkill.node.difficulty_level)}>
                    {learningPath.nextSkill.node.difficulty_level}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{learningPath.nextSkill.node.estimated_hours}h
                  </span>
                </div>
              </div>
              <Button onClick={() => {
                setSelectedSkill(learningPath.nextSkill);
                onStatusChange(learningPath.nextSkill!.node.id, 'in_progress');
              }}>
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Graph Visual */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skill Dependency Graph — {learningPath.domain}
          </h3>

          <div className="relative space-y-2">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border hidden md:block" />

            {learningPath.orderedSkills.map((skill, index) => (
              <Card
                key={skill.node.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedSkill?.node.id === skill.node.id && "ring-2 ring-primary/40",
                  skill.isRecommended && skill.status === 'ready' && "border-primary/30 shadow-sm"
                )}
                onClick={() => setSelectedSkill(skill)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status indicator */}
                    <div className={cn(
                      "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all",
                      getStatusColor(skill.status)
                    )}>
                      {getStatusIcon(skill.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{skill.node.name}</h4>
                        {skill.isRecommended && skill.status === 'ready' && (
                          <Badge variant="default" className="text-xs bg-primary/80">
                            ★ Recommended
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn("text-xs", getDifficultyBadge(skill.node.difficulty_level))}>
                          {skill.node.difficulty_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{skill.node.description}</p>
                      
                      {/* Missing prerequisites warning */}
                      {skill.missingPrerequisites.length > 0 && skill.status === 'locked' && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Requires: {skill.missingPrerequisites.map(p => p.name).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Right: estimated time */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {skill.node.estimated_hours}h
                      </span>
                      {skill.confidenceLevel > 0 && skill.status !== 'locked' && (
                        <div className="mt-1">
                          <Progress value={skill.confidenceLevel} className="w-16 h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Detail Sidebar */}
        <div className="space-y-4">
          {selectedSkill && (
            <SkillDetailPanel
              skill={selectedSkill}
              onStatusChange={onStatusChange}
              recommendations={recommendations}
              mlRecommendations={mlRecommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SKILL DETAIL PANEL
// ═══════════════════════════════════════════

interface SkillDetailPanelProps {
  skill: SkillRecommendation;
  onStatusChange: (skillNodeId: string, status: 'not_started' | 'in_progress' | 'completed' | 'skipped') => void;
  recommendations: Recommendation[];
  mlRecommendations: import('@/hooks/useRecommendations').MLRecommendation[];
}

function SkillDetailPanel({ skill, onStatusChange, recommendations, mlRecommendations }: SkillDetailPanelProps) {
  // Filter recommendations relevant to this skill
  const relevantResources = useMemo(() => {
    return filterResourcesBySkill(recommendations, skill.node).slice(0, 5);
  }, [skill, recommendations]);

  // Dynamically ordered ML resources based on this skill
  const dynamicResources = useMemo(() => {
    if (!mlRecommendations.length) return [];
    
    // Map ML recommendations to the standard Recommendation shape for filtering
    const mappedMl = mlRecommendations.map(r => ({
      title: r.title,
      type: 'course',
      url: '#',
      description: '',
      score: r.score
    })) as Recommendation[];
    
    return filterResourcesBySkill(mappedMl, skill.node).slice(0, 5);
  }, [skill, mlRecommendations]);



  return (
    <div className="sticky top-6 space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-xl">{skill.node.name}</h3>
            {skill.node.subdomain && (
              <Badge variant="outline" className="mt-1 text-xs">{skill.node.subdomain}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{skill.node.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Difficulty</span>
              <p className="font-medium capitalize">{skill.node.difficulty_level}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Time</span>
              <p className="font-medium">{skill.node.estimated_hours} hours</p>
            </div>
          </div>

          {/* Learning Outcomes */}
          {skill.node.learning_outcomes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" />
                Learning Outcomes
              </h4>
              <ul className="space-y-1.5">
                {skill.node.learning_outcomes.map((outcome, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Prerequisites */}
          {skill.missingPrerequisites.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <h4 className="text-sm font-semibold text-amber-600 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Missing Prerequisites
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skill.missingPrerequisites.map(p => (
                  <Badge key={p.id} variant="outline" className="text-xs border-amber-500/30 text-amber-600">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {skill.status !== 'completed' && (
              <Button size="sm" onClick={() => onStatusChange(skill.node.id, 'completed')} className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </Button>
            )}
            {skill.status !== 'in_progress' && skill.status !== 'completed' && (
              <Button size="sm" variant="outline" onClick={() => onStatusChange(skill.node.id, 'in_progress')} className="gap-1.5">
                <Zap className="w-4 h-4" /> Start
              </Button>
            )}
            {skill.status !== 'skipped' && skill.status !== 'completed' && (
              <Button size="sm" variant="ghost" onClick={() => onStatusChange(skill.node.id, 'skipped')} className="text-xs">
                Skip
              </Button>
            )}
            {(skill.status === 'completed' || skill.status === 'skipped') && (
              <Button size="sm" variant="ghost" onClick={() => onStatusChange(skill.node.id, 'not_started')} className="text-xs">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Relevant Resources */}
      {(dynamicResources.length > 0 || relevantResources.length > 0) && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-1.5">
              {dynamicResources.length > 0 ? (
                <><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Recommended Resources</>
              ) : (
                <><Library className="w-4 h-4 text-primary" /> Resources for {skill.node.name}</>
              )}
            </h4>
            
            {/* Show Dynamic Resources from ML if available */}
            {dynamicResources.length > 0 ? dynamicResources.map((r, i) => (
              <div
                key={i}
                className="block p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="text-[10px] uppercase tracking-wider bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 shadow-sm">
                    ★ Top Match
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-medium">Score: {r.score}</span>
                </div>
                <h5 className="text-sm font-semibold text-primary">{r.title}</h5>
              </div>
            )) : 
            /* Fallback to normal Relevant Resources */
            relevantResources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <h5 className="text-sm font-medium line-clamp-1">{r.title}</h5>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs capitalize">{r.type}</Badge>
                  {r.difficulty && <span className="capitalize">{r.difficulty}</span>}
                  {r.provider && <span>{r.provider}</span>}
                </div>
              </a>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// RESOURCE CARD (kept from original)
// ═══════════════════════════════════════════

interface ResourceCardProps {
  recommendation: Recommendation;
  typeIcon: (t: Recommendation["type"]) => React.ReactNode;
}

function ResourceCard({ recommendation: r, typeIcon }: ResourceCardProps) {
  const { user } = useAuth();
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [showRatingCard, setShowRatingCard] = useState(false);

  useEffect(() => {
    async function findResource() {
      const { data } = await supabase
        .from('resources')
        .select('id, avg_rating, total_ratings, recommend_percent, total_votes')
        .ilike('title', r.title)
        .limit(1)
        .maybeSingle();
      if (data) setResourceId(data.id);
    }
    findResource();
  }, [r.title]);

  const {
    stats, userVote, hasEnoughRatings, formatRatingCount, submitVote, isAuthenticated,
  } = useResourceRatings(resourceId || undefined);

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isAuthenticated) { toast.error('Please log in to vote'); return; }
    if (!resourceId) { toast.error('Resource not found in database'); return; }
    submitVote(voteType);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted border-0 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex items-center gap-3 pb-2">
        <div className="p-2 rounded bg-white/5">{typeIcon(r.type)}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{r.title}</h3>
            <div className="text-sm text-muted-foreground">{r.provider || r.type}</div>
          </div>
          {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
                <span className="text-muted-foreground text-xs">{stats.total_ratings}/10 ratings needed</span>
              )
            ) : (
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

        {resourceId && (
          <div className="flex items-center gap-2">
            <Button variant={userVote?.vote_type === 'up' ? 'default' : 'outline'} size="sm" className="h-7 px-2 gap-1 text-xs" onClick={() => handleVote('up')}>
              <ThumbsUp className={`w-3 h-3 ${userVote?.vote_type === 'up' ? 'fill-current' : ''}`} /> Recommend
            </Button>
            <Button variant={userVote?.vote_type === 'down' ? 'destructive' : 'outline'} size="sm" className="h-7 px-2 gap-1 text-xs" onClick={() => handleVote('down')}>
              <ThumbsDown className={`w-3 h-3 ${userVote?.vote_type === 'down' ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs ml-auto" onClick={() => setShowRatingCard(!showRatingCard)}>
              <MessageSquare className="w-3 h-3" /> Rate & Review
            </Button>
          </div>
        )}

        {showRatingCard && resourceId && (
          <div className="pt-2 border-t">
            <ResourceRatingCard resourceId={resourceId} resourceTitle={r.title} />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">Open resource →</a>
          {r.views && <span className="text-xs text-muted-foreground">{r.views}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
