import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Circle,
  ChevronDown,
  ChevronUp,
  Target,
  Wrench,
  Award,
  MapPin,
  DollarSign,
  Zap,
  ArrowRight,
  Lightbulb,
  Users
} from 'lucide-react';
import { SkillRoadmap, LearningPhase } from '@/lib/skillRoadmaps';
import { cn } from '@/lib/utils';

interface SkillRoadmapSectionProps {
  roadmap: SkillRoadmap;
}

export function SkillRoadmapSection({ roadmap }: SkillRoadmapSectionProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(roadmap.phases[0]?.id || null);
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const togglePhaseComplete = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const progressPercent = (completedPhases.size / roadmap.phases.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner-Friendly': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getJobDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'text-green-600';
      case 'Growing': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{roadmap.name}</h2>
                  <p className="text-lg text-primary font-medium mt-1">{roadmap.tagline}</p>
                </div>
                <Badge variant="outline" className={cn("whitespace-nowrap", getDifficultyColor(roadmap.difficulty))}>
                  {roadmap.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">{roadmap.description}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{roadmap.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className={cn("w-4 h-4", getJobDemandColor(roadmap.jobDemand))} />
                  <span className="text-muted-foreground">Demand:</span>
                  <span className={cn("font-medium", getJobDemandColor(roadmap.jobDemand))}>{roadmap.jobDemand}</span>
                </div>
                {roadmap.averageSalary && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-muted-foreground">Salary:</span>
                    <span className="font-medium text-green-600">{roadmap.averageSalary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Progress Card */}
            <div className="lg:w-72 p-4 rounded-xl bg-card border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">{completedPhases.size}/{roadmap.phases.length} phases</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Click phases below to mark as complete and track your journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real World Context */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Real-World Applications</h3>
              <p className="text-muted-foreground leading-relaxed">{roadmap.realWorldContext}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Paths & Prerequisites */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Career Paths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.careerPaths.map((career, i) => (
                <Badge key={i} variant="secondary" className="bg-secondary/50">
                  {career}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Prerequisites</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.prerequisites.map((prereq, i) => (
                <Badge key={i} variant="outline" className="border-dashed">
                  {prereq}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Roadmap Phases */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Learning Roadmap</h3>
          <span className="text-sm text-muted-foreground">Follow this path step by step</span>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border hidden md:block" />

          <div className="space-y-3">
            {roadmap.phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                index={index}
                isExpanded={expandedPhase === phase.id}
                isCompleted={completedPhases.has(phase.id)}
                isLast={index === roadmap.phases.length - 1}
                onToggle={() => togglePhase(phase.id)}
                onComplete={(e) => togglePhaseComplete(phase.id, e)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tools & Certifications */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Essential Tools</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.tools.map((tool, i) => (
                <Badge key={i} variant="secondary" className="bg-muted">
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {roadmap.certifications && roadmap.certifications.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Recommended Certifications</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.certifications.map((cert, i) => (
                  <Badge key={i} variant="outline" className="border-primary/30 text-primary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface PhaseCardProps {
  phase: LearningPhase;
  index: number;
  isExpanded: boolean;
  isCompleted: boolean;
  isLast: boolean;
  onToggle: () => void;
  onComplete: (e: React.MouseEvent) => void;
}

function PhaseCard({ phase, index, isExpanded, isCompleted, isLast, onToggle, onComplete }: PhaseCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        isExpanded && "ring-2 ring-primary/20",
        isCompleted && "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900"
      )}
      onClick={onToggle}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4 md:p-6">
          {/* Phase Number/Status */}
          <div className="relative flex-shrink-0">
            <button
              onClick={onComplete}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                isCompleted 
                  ? "bg-green-500 text-white" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className={cn(
                  "font-semibold text-lg",
                  isCompleted && "text-green-700 dark:text-green-400"
                )}>
                  {phase.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{phase.duration}</span>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>

            <p className="text-muted-foreground mt-2 text-sm md:text-base">{phase.description}</p>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Skills */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Skills to Learn
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {phase.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm"
                      >
                        <Circle className="w-2 h-2 text-primary" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {phase.projects && phase.projects.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Hands-On Projects
                    </h5>
                    <div className="space-y-2">
                      {phase.projects.map((project, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{project}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
