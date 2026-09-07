import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Pencil,
  Plus,
  Rocket,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/integrations/supabase/types";

type RoadmapStep = Database["public"]["Tables"]["roadmap_steps"]["Row"];

type RoadmapResource = {
  id: string;
  title: string;
  url?: string | null;
  type?: string | null;
  duration?: string | null;
  difficulty?: string | null;
};

interface RoadmapJourneyProps {
  steps: RoadmapStep[];
  resourcesByStep: Record<string, RoadmapResource[]>;
  isOwner: boolean;
  activeStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onToggleStep: (stepId: string, completed: boolean) => void;
  onEditStep: (stepId: string) => void;
  onAddResource: (stepId: string) => void;
  onDeleteResource: (stepId: string, resourceId: string) => void;
  getFavicon: (url?: string | null) => string | null;
}

const asStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

const asObjectArray = (value: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
};

const getText = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const getMonthNumber = (step: RoadmapStep, index: number) => {
  const match = step.title.match(/month\s*(\d+)/i);
  return match ? Number(match[1]) : index + 1;
};

const getStepDescription = (description: string | null) => {
  if (!description) return "A focused month of deliberate learning, practice, and reflection.";
  return description.split(/\n\nWhy this matters:/i)[0].trim();
};

const getWhy = (description: string | null) => {
  if (!description) return "This month creates the foundation for the next stage of the journey.";
  const match = description.match(/Why this matters:\s*([\s\S]*)$/i);
  return match?.[1]?.trim() || "This month creates the foundation for the next stage of the journey.";
};

const getDomainLabel = (title: string) => title.replace(/^month\s*\d+\s*:\s*/i, "").trim();

export function RoadmapJourney({
  steps,
  resourcesByStep,
  isOwner,
  activeStepId,
  onSelectStep,
  onToggleStep,
  onEditStep,
  onAddResource,
  onDeleteResource,
  getFavicon,
}: RoadmapJourneyProps) {
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStepId));
  const activeStep = steps[activeIndex];

  const roadmapProgress = useMemo(() => {
    const completed = steps.filter((step) => step.completed).length;
    return steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
  }, [steps]);

  if (!activeStep) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Your learning journey is being prepared</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Once the first monthly step is available, this space will become your week-by-week plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const topics = asStringArray(activeStep.topics);
  const objectives = asStringArray(activeStep.learning_objectives);
  const milestones = asObjectArray(activeStep.milestones);
  const tasks = asObjectArray(activeStep.tasks);
  const studyRoutine = tasks.find((task) => getText(task.title).toLowerCase().includes("how to learn"));
  const practiceTasks = tasks.filter((task) => task !== studyRoutine);
  const pitfalls = asStringArray(activeStep.common_pitfalls);
  const assessmentCriteria = asStringArray(activeStep.assessment_criteria);
  const resources = resourcesByStep[activeStep.id] || [];
  const monthNumber = getMonthNumber(activeStep, activeIndex);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-elevated">
        <CardContent className="p-5 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {steps.length}-month journey
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  {roadmapProgress}% complete
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your learning route</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Follow the sequence, not the mood.</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Each month has a clear outcome, weekly checkpoints, deliberate practice, and a mastery gate before you move forward.
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-2 lg:min-w-[240px]">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Journey progress</span>
                <span className="font-semibold text-foreground">{steps.filter((step) => step.completed).length}/{steps.length} months</span>
              </div>
              <Progress value={roadmapProgress} className="h-2.5" />
              <p className="text-xs text-muted-foreground">Finish the current month before unlocking momentum for the next.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.65fr)]">
        <Card className="h-fit xl:sticky xl:top-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Roadmap map</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Move through the months in order.</p>
              </div>
              <Badge variant="outline">{steps.length} phases</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {steps.map((step, index) => {
              const isActive = step.id === activeStep.id;
              const stepMonth = getMonthNumber(step, index);
              const isLocked = !step.completed && index > 0 && !steps[index - 1]?.completed;
              return (
                <div key={step.id} className="relative">
                  {index < steps.length - 1 && <div className="absolute left-[19px] top-11 h-[calc(100%+8px)] w-px bg-border" />}
                  <motion.button
                    type="button"
                    onClick={() => onSelectStep(step.id)}
                    whileHover={{ x: 3 }}
                    className={`relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      isActive ? "border-primary/40 bg-primary/10 shadow-sm" : "border-transparent hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-bold ${
                      step.completed ? "border-primary text-primary" : isActive ? "border-primary text-primary" : "border-border text-muted-foreground"
                    }`}>
                      {step.completed ? <CheckCircle2 className="h-5 w-5" /> : stepMonth}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                          Month {stepMonth}
                        </span>
                        {index === activeIndex && <Badge className="px-1.5 py-0 text-[10px]">Now</Badge>}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{getDomainLabel(step.title)}</span>
                      <span className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock3 className="h-3 w-3" /> {step.estimated_hours || 0}h planned
                        {isLocked && <span className="text-primary">• Up next</span>}
                      </span>
                    </span>
                    <ArrowRight className={`mt-2 h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
                  </motion.button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/20 shadow-elevated">
          <CardHeader className="border-b bg-muted/20 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Month {monthNumber}</Badge>
                  {activeStep.completed && <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10"><CheckCircle2 className="h-3.5 w-3.5" /> Complete</Badge>}
                  {!activeStep.completed && activeIndex === steps.findIndex((step) => !step.completed) && <Badge variant="outline">Current focus</Badge>}
                </div>
                <CardTitle className="text-2xl md:text-3xl">{getDomainLabel(activeStep.title)}</CardTitle>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{getStepDescription(activeStep.description)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {isOwner && (
                  <Button
                    size="sm"
                    variant={activeStep.completed ? "outline" : "default"}
                    onClick={() => onToggleStep(activeStep.id, !activeStep.completed)}
                  >
                    {activeStep.completed ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
                    {activeStep.completed ? "Completed" : "Mark complete"}
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border bg-background/70 p-3"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Timebox</p><p className="mt-1 text-sm font-semibold">{activeStep.duration || "1 month"}</p></div>
              <div className="rounded-lg border bg-background/70 p-3"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Effort</p><p className="mt-1 text-sm font-semibold">{activeStep.estimated_hours || "—"} hours</p></div>
              <div className="rounded-lg border bg-background/70 p-3"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Checkpoints</p><p className="mt-1 text-sm font-semibold">{milestones.length || "—"} weekly</p></div>
              <div className="rounded-lg border bg-background/70 p-3"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Resources</p><p className="mt-1 text-sm font-semibold">{resources.length} curated</p></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-7 p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h3 className="flex items-center gap-2 font-semibold"><Rocket className="h-4 w-4 text-primary" /> Why this month matters</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{getWhy(activeStep.description)}</p>
              </div>
              {activeStep.prerequisites && asStringArray(activeStep.prerequisites).length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="flex items-center gap-2 font-semibold"><FlaskConical className="h-4 w-4 text-muted-foreground" /> Before you start</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {asStringArray(activeStep.prerequisites).map((item, index) => <li key={index} className="flex gap-2"><span className="text-primary">•</span>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {studyRoutine && (
              <section>
                <SectionHeading icon={<Lightbulb className="h-4 w-4" />} title="How to learn this month" />
                <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">{getText(studyRoutine.description)}</div>
              </section>
            )}

            {topics.length > 0 && (
              <section>
                <SectionHeading icon={<BookOpen className="h-4 w-4" />} title="What to learn" subtitle="The concepts that move you forward this month." />
                <div className="grid gap-2 sm:grid-cols-2">
                  {topics.map((topic, index) => <div key={index} className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span><span>{topic}</span></div>)}
                </div>
              </section>
            )}

            <section>
              <SectionHeading icon={<CalendarDays className="h-4 w-4" />} title="Weekly checkpoints" subtitle="Use these as your weekly finish lines, not just reading topics." />
              <div className="grid gap-3 md:grid-cols-2">
                {(milestones.length > 0 ? milestones : [{ title: "Weekly practice", description: "Study the current concepts, retrieve them without notes, and record one concrete output.", estimatedHours: activeStep.estimated_hours ? Math.round(activeStep.estimated_hours / 4) : null }]).map((milestone, index) => (
                  <div key={index} className="rounded-lg border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span><h4 className="text-sm font-semibold">{getText(milestone.title, `Week ${index + 1}`)}</h4></div>{typeof milestone.estimatedHours === "number" && <Badge variant="outline" className="shrink-0 text-[10px]"><Clock3 className="mr-1 h-3 w-3" />{milestone.estimatedHours}h</Badge>}</div>
                    <p className="mt-3 pl-10 text-sm leading-6 text-muted-foreground">{getText(milestone.description)}</p>
                  </div>
                ))}
              </div>
            </section>

            {practiceTasks.length > 0 && (
              <section>
                <SectionHeading icon={<Target className="h-4 w-4" />} title="Build and practice" subtitle="Produce evidence that you can use the skill, not only recognize it." />
                <div className="space-y-3">
                  {practiceTasks.map((task, index) => <div key={index} className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-4"><div className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary"><Rocket className="h-4 w-4" /></div><div className="min-w-0"><h4 className="text-sm font-semibold">{getText(task.title, `Practice task ${index + 1}`)}</h4><p className="mt-1 text-sm leading-6 text-muted-foreground">{getText(task.description)}</p></div></div>)}
                </div>
              </section>
            )}

            {objectives.length > 0 && (
              <section>
                <SectionHeading icon={<ListChecks className="h-4 w-4" />} title="Monthly outcome" subtitle="You should be able to demonstrate these outcomes before moving on." />
                <div className="grid gap-2 sm:grid-cols-2">{objectives.map((objective, index) => <div key={index} className="flex items-start gap-2 rounded-lg border bg-muted/20 p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{objective}</div>)}</div>
              </section>
            )}

            <section>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading icon={<BookOpen className="h-4 w-4" />} title="Admin-curated resources" subtitle="Only resources matched from the Skill-Metrics catalog appear here." />
                {isOwner && <Button size="sm" variant="outline" onClick={() => onAddResource(activeStep.id)}><Plus className="mr-2 h-4 w-4" />Add resource</Button>}
              </div>
              <div className="mt-3 space-y-2">
                {resources.length > 0 ? resources.map((resource) => (
                  <div key={resource.id} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-muted/30">
                    {getFavicon(resource.url) ? <img src={getFavicon(resource.url) || undefined} alt="" className="h-6 w-6 shrink-0 rounded" /> : <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary"><BookOpen className="h-3.5 w-3.5" /></div>}
                    <div className="min-w-0 flex-1"><a href={resource.url || undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold hover:text-primary hover:underline">{resource.title}<ExternalLink className="h-3 w-3" /></a><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{resource.type && <Badge variant="outline" className="text-[10px]">{resource.type}</Badge>}{resource.duration && <span>{resource.duration}</span>}{resource.difficulty && <Badge variant="secondary" className="text-[10px]">{resource.difficulty}</Badge>}</div></div>
                    {isOwner && <Button size="icon" variant="ghost" onClick={() => onDeleteResource(activeStep.id, resource.id)} aria-label={`Remove ${resource.title}`}><Trash2 className="h-4 w-4" /></Button>}
                  </div>
                )) : <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No catalog match was attached to this month yet. Keep the plan focused and add a resource only when it supports this exact step.</div>}
              </div>
            </section>

            {(assessmentCriteria.length > 0 || pitfalls.length > 0) && <div className="grid gap-4 md:grid-cols-2">
              {assessmentCriteria.length > 0 && <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><h3 className="flex items-center gap-2 font-semibold"><Trophy className="h-4 w-4 text-primary" />Mastery gate</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{assessmentCriteria.map((item, index) => <li key={index} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></div>}
              {pitfalls.length > 0 && <div className="rounded-lg border border-border bg-muted/20 p-4"><h3 className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4 text-muted-foreground" />Watch for these traps</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{pitfalls.map((item, index) => <li key={index} className="flex items-start gap-2"><span className="text-primary">•</span>{item}</li>)}</ul></div>}
            </div>}

            {isOwner && <div className="flex justify-end border-t pt-4"><Button size="sm" variant="ghost" onClick={() => onEditStep(activeStep.id)}><Pencil className="mr-2 h-4 w-4" />Edit month details</Button></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return <div className="mb-3"><h3 className="flex items-center gap-2 font-semibold">{icon}{title}</h3>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>;
}