import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap, PlayCircle, FileText, Wrench, Rocket,
  Star, CheckCircle, Lock, ArrowRight, AlertTriangle, Zap, Clock,
  Target, Flame, Trophy, Sparkles, ExternalLink, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useUserProfileDetails } from "@/hooks/useUserProfileDetails";
import { useAuth } from "@/hooks/useAuth";
import {
  useSkillNodes, useSkillDependencies, useUserSkillProgress, useUpdateSkillProgress,
} from "@/hooks/useSkillGraph";
import {
  buildLearningPath, matchDomainToSkillGraph,
  type SkillRecommendation, type LearningPathResult,
} from "@/lib/skillGraphEngine";
import { useStepResources, type StepResource } from "@/hooks/useStepResources";
import { useFocusSessions } from "@/hooks/useFocusSessions";
import { cn } from "@/lib/utils";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ────────────────────────────────────────────────────────────
 *  PAGE
 * ──────────────────────────────────────────────────────────── */
export default function SkillRecommendations() {
  const { skill } = useParams<{ skill: string }>();
  const query = useQuery();
  const q = (skill || query.get("q") || query.get("skill") || "").trim();
  const decoded = q ? decodeURIComponent(q) : "Skill";

  const { profileDetails } = useUserProfileDetails();
  const { user } = useAuth();

  const graphDomain = useMemo(() => matchDomainToSkillGraph(decoded), [decoded]);
  const { data: skillNodes = [], isLoading: nodesLoading } = useSkillNodes(graphDomain || undefined);
  const skillNodeIds = useMemo(() => skillNodes.map(n => n.id), [skillNodes]);
  const { data: dependencies = [] } = useSkillDependencies(skillNodeIds);
  const { data: userProgress = [] } = useUserSkillProgress();
  const updateProgress = useUpdateSkillProgress();
  const { streak } = useFocusSessions();

  const learningPath = useMemo<LearningPathResult | null>(() => {
    if (!skillNodes.length) return null;
    const userProfile = profileDetails ? {
      experienceLevel: profileDetails.experience_level || "beginner",
      skills: (profileDetails.skills || []).map((s: any) => typeof s === "string" ? s : s.name || ""),
      learningGoals: (profileDetails.learning_path as any)?.goals || "",
      background: (profileDetails.learning_path as any)?.background || "",
    } : undefined;
    return buildLearningPath(skillNodes, dependencies, userProgress, userProfile);
  }, [skillNodes, dependencies, userProgress, profileDetails]);

  const [selectedSkill, setSelectedSkill] = useState<SkillRecommendation | null>(null);

  useEffect(() => {
    if (!learningPath) return;
    const next = learningPath.nextSkill || learningPath.orderedSkills[0] || null;
    setSelectedSkill(prev => prev ?? next);
  }, [learningPath]);

  const handleStatus = (id: string, status: "not_started" | "in_progress" | "completed" | "skipped") => {
    updateProgress.mutate({ skillNodeId: id, status }, {
      onSuccess: () => toast.success("Progress saved"),
      onError: () => toast.error("Could not update progress"),
    });
  };

  const completedCount = learningPath?.completedCount ?? 0;
  const totalCount = learningPath?.totalCount ?? 0;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const hoursLeft = learningPath
    ? learningPath.orderedSkills
        .filter(s => s.status !== "completed" && s.status !== "skipped")
        .reduce((sum, s) => sum + (s.node.estimated_hours || 0), 0)
    : 0;
  const milestones = learningPath
    ? Math.floor((completedCount / Math.max(totalCount, 1)) * 4)
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* HERO HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Learning Journey
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{decoded}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {profileDetails?.experience_level ? `Tailored for ${profileDetails.experience_level} learners` : "A curated path to mastery"}
              </p>
            </div>

            {/* Journey Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <StatTile icon={<Target className="w-3.5 h-3.5" />} label="Progress" value={`${progressPct}%`} accent="from-primary/20 to-primary/5" />
              <StatTile icon={<Clock className="w-3.5 h-3.5" />} label="Remaining" value={`${hoursLeft}h`} accent="from-blue-500/20 to-blue-500/5" />
              <StatTile icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={`${streak?.current_streak ?? 0}d`} accent="from-orange-500/20 to-orange-500/5" />
              <StatTile icon={<Trophy className="w-3.5 h-3.5" />} label="Milestones" value={`${milestones}/4`} accent="from-amber-500/20 to-amber-500/5" />
            </div>
          </div>

          {totalCount > 0 && (
            <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-primary/70"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </motion.header>

        {/* WORKSPACE */}
        {nodesLoading ? (
          <WorkspaceSkeleton />
        ) : !learningPath || learningPath.orderedSkills.length === 0 ? (
          <EmptyState query={decoded} />
        ) : (
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            <JourneyRail
              skills={learningPath.orderedSkills}
              selected={selectedSkill}
              onSelect={setSelectedSkill}
              nextSkillId={learningPath.nextSkill?.node.id}
            />
            <AnimatePresence mode="wait">
              {selectedSkill && (
                <motion.div
                  key={selectedSkill.node.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <ActiveSkillWorkspace
                    skill={selectedSkill}
                    onStatusChange={handleStatus}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ────────────────────────────────────────────────────────────
 *  STAT TILE
 * ──────────────────────────────────────────────────────────── */
function StatTile({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-gradient-to-br p-3 min-w-[100px]",
      accent
    )}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-lg font-black mt-0.5">{value}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 *  LEFT: JOURNEY RAIL
 * ──────────────────────────────────────────────────────────── */
interface JourneyRailProps {
  skills: SkillRecommendation[];
  selected: SkillRecommendation | null;
  onSelect: (s: SkillRecommendation) => void;
  nextSkillId?: string;
}

function JourneyRail({ skills, selected, onSelect, nextSkillId }: JourneyRailProps) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)]">
      <Card className="overflow-hidden border-border/60">
        <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Journey</div>
          <Badge variant="secondary" className="text-[10px]">{skills.length} skills</Badge>
        </div>
        <div className="lg:max-h-[calc(100vh-9rem)] overflow-y-auto p-2 space-y-1">
          {skills.map((s, i) => {
            const isSelected = selected?.node.id === s.node.id;
            const isNext = s.node.id === nextSkillId;
            return (
              <button
                key={s.node.id}
                onClick={() => onSelect(s)}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isSelected
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-muted/60"
                )}
              >
                <StatusDot status={s.status} index={i + 1} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-sm font-semibold truncate",
                      s.status === "locked" && "text-muted-foreground",
                      isSelected && "text-primary"
                    )}>
                      {s.node.name}
                    </span>
                    {isNext && !isSelected && (
                      <Sparkles className="w-3 h-3 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span className="capitalize">{s.node.difficulty_level}</span>
                    <span>•</span>
                    <span>{s.node.estimated_hours}h</span>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground/40 transition-transform",
                  isSelected && "text-primary translate-x-0.5"
                )} />
              </button>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}

function StatusDot({ status, index }: { status: SkillRecommendation["status"]; index: number }) {
  const base = "relative w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border-2";
  switch (status) {
    case "completed":
      return <div className={cn(base, "bg-green-500/15 border-green-500/40 text-green-600")}><CheckCircle className="w-4 h-4" /></div>;
    case "in_progress":
      return <div className={cn(base, "bg-blue-500/15 border-blue-500/40 text-blue-600")}><Zap className="w-4 h-4 animate-pulse" /></div>;
    case "locked":
      return <div className={cn(base, "bg-muted border-border text-muted-foreground/60")}><Lock className="w-3.5 h-3.5" /></div>;
    case "skipped":
      return <div className={cn(base, "bg-amber-500/10 border-amber-500/30 text-amber-600")}><AlertTriangle className="w-3.5 h-3.5" /></div>;
    case "ready":
    default:
      return <div className={cn(base, "bg-primary/10 border-primary/40 text-primary")}>{index}</div>;
  }
}

/* ────────────────────────────────────────────────────────────
 *  RIGHT: ACTIVE SKILL WORKSPACE
 * ──────────────────────────────────────────────────────────── */
interface ActiveSkillWorkspaceProps {
  skill: SkillRecommendation;
  onStatusChange: (id: string, status: "not_started" | "in_progress" | "completed" | "skipped") => void;
}

const BEST_OF_CATEGORIES = [
  { key: "course", label: "Best Course", icon: GraduationCap, types: ["course", "degree"], gradient: "from-violet-500/20 via-violet-500/10 to-transparent", iconBg: "bg-violet-500/15 text-violet-600" },
  { key: "video", label: "Best Video", icon: PlayCircle, types: ["video", "youtube"], gradient: "from-red-500/20 via-red-500/10 to-transparent", iconBg: "bg-red-500/15 text-red-600" },
  { key: "article", label: "Best Article", icon: FileText, types: ["blog", "paper", "research_paper", "documentation", "website", "book"], gradient: "from-blue-500/20 via-blue-500/10 to-transparent", iconBg: "bg-blue-500/15 text-blue-600" },
  { key: "practice", label: "Best Practice", icon: Wrench, types: ["tool", "exam_prep", "certification"], gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", iconBg: "bg-emerald-500/15 text-emerald-600" },
  { key: "project", label: "Best Project", icon: Rocket, types: ["project", "learning_path"], gradient: "from-amber-500/20 via-amber-500/10 to-transparent", iconBg: "bg-amber-500/15 text-amber-600" },
] as const;

function pickBest(resources: StepResource[], types: readonly string[]): StepResource | undefined {
  const matches = resources.filter(r => types.includes((r.resource_type || "").toLowerCase()));
  if (!matches.length) return undefined;
  return [...matches].sort((a, b) =>
    (b.weighted_rating ?? b.avg_rating ?? b.rating ?? 0) -
    (a.weighted_rating ?? a.avg_rating ?? a.rating ?? 0)
  )[0];
}

function ActiveSkillWorkspace({ skill, onStatusChange }: ActiveSkillWorkspaceProps) {
  const { data: resources = [], isLoading } = useStepResources(skill.node);
  const isLocked = skill.status === "locked";
  const isStarted = skill.status === "in_progress" || skill.status === "completed";

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="overflow-hidden border-border/60 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-3 mb-3">
            <Badge variant="outline" className="capitalize text-[10px]">{skill.node.difficulty_level}</Badge>
            {skill.node.subdomain && (
              <Badge variant="secondary" className="text-[10px]">{skill.node.subdomain}</Badge>
            )}
            <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{skill.node.estimated_hours}h
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{skill.node.name}</h2>
          {skill.node.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              {skill.node.description}
            </p>
          )}

          {/* Confidence Bar */}
          {skill.confidenceLevel > 0 && (
            <div className="mb-4 max-w-sm">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                <span>Mastery</span>
                <span>{skill.confidenceLevel}%</span>
              </div>
              <Progress value={skill.confidenceLevel} className="h-1.5" />
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            {!isLocked && skill.status !== "completed" && (
              <Button
                size="lg"
                onClick={() => onStatusChange(skill.node.id, "in_progress")}
                className="gap-2 h-12 px-6 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <Zap className="w-5 h-5" />
                {isStarted ? "Continue Learning" : "Start Learning"}
              </Button>
            )}
            {skill.status === "completed" && (
              <Button size="lg" variant="outline" className="gap-2 h-12 px-6 border-green-500/40 text-green-600">
                <CheckCircle className="w-5 h-5" /> Completed
              </Button>
            )}
            {isLocked && (
              <Button size="lg" disabled className="gap-2 h-12 px-6">
                <Lock className="w-5 h-5" /> Complete prerequisites first
              </Button>
            )}
            {!isLocked && skill.status !== "completed" && (
              <Button variant="ghost" onClick={() => onStatusChange(skill.node.id, "completed")} className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </Button>
            )}
          </div>

          {/* Prereq warning */}
          {isLocked && skill.missingPrerequisites.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="text-xs font-semibold text-amber-600 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Prerequisites required
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skill.missingPrerequisites.map(p => (
                  <Badge key={p.id} variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      {skill.node.learning_outcomes?.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Target className="w-3.5 h-3.5 text-primary" /> What you'll learn
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {skill.node.learning_outcomes.map((o, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Of Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-black tracking-tight">Top picks for this skill</h3>
            <p className="text-xs text-muted-foreground">The single best resource in each format — curated, not exhaustive.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {BEST_OF_CATEGORIES.map(cat => {
            const best = pickBest(resources, cat.types);
            return (
              <BestOfCard
                key={cat.key}
                label={cat.label}
                icon={cat.icon}
                gradient={cat.gradient}
                iconBg={cat.iconBg}
                resource={best}
                loading={isLoading}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 *  BEST OF CARD
 * ──────────────────────────────────────────────────────────── */
interface BestOfCardProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  resource?: StepResource;
  loading: boolean;
}

function BestOfCard({ label, icon: Icon, gradient, iconBg, resource, loading }: BestOfCardProps) {
  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!resource) {
    return (
      <Card className={cn("border-dashed border-border/60 bg-gradient-to-br", gradient)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
          </div>
          <p className="text-xs text-muted-foreground">No top pick yet — check back soon.</p>
        </CardContent>
      </Card>
    );
  }

  const rating = resource.weighted_rating ?? resource.avg_rating ?? resource.rating ?? 0;

  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group block rounded-xl border bg-gradient-to-br p-4 transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40",
        gradient
      )}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        {rating > 0 && (
          <div className="ml-auto flex items-center gap-0.5 text-xs font-semibold">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {resource.title}
      </h4>

      {resource.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{resource.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {resource.provider && <span className="font-medium">{resource.provider}</span>}
          {resource.is_free && (
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
              Free
            </Badge>
          )}
        </div>
        <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 opacity-70 group-hover:opacity-100">
          Open <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

/* ────────────────────────────────────────────────────────────
 *  STATES
 * ──────────────────────────────────────────────────────────── */
function WorkspaceSkeleton() {
  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-xl" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-12 text-center">
        <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
        <h3 className="font-bold text-lg mb-1">No journey available for "{query}" yet</h3>
        <p className="text-sm text-muted-foreground">We're building structured paths for more skills. Try exploring related domains.</p>
      </CardContent>
    </Card>
  );
}
