import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3, CalendarClock, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useFocusSessions } from "@/hooks/useFocusSessions";

interface Step {
  id: string;
  title: string;
  completed: boolean;
  estimated_hours?: number;
  order_index: number;
  duration?: string;
  created_at: string;
}

interface DifficultyHeatmapETAProps {
  steps: Step[];
  roadmapId: string;
  createdAt: string;
}

// Parse duration strings like "2 weeks", "1 month", "3-4 hours"
function estimateHours(step: Step): number {
  if (step.estimated_hours) return step.estimated_hours;
  const d = (step.duration || "").toLowerCase();
  if (d.includes("month")) {
    const n = parseInt(d) || 1;
    return n * 40; // ~40 hours per month
  }
  if (d.includes("week")) {
    const n = parseInt(d) || 1;
    return n * 10;
  }
  if (d.includes("hour")) {
    const n = parseInt(d) || 2;
    return n;
  }
  if (d.includes("day")) {
    const n = parseInt(d) || 1;
    return n * 2;
  }
  return 8; // default
}

function getDifficultyLevel(hours: number, maxHours: number): number {
  if (maxHours === 0) return 0;
  const ratio = hours / maxHours;
  if (ratio > 0.8) return 4;
  if (ratio > 0.6) return 3;
  if (ratio > 0.35) return 2;
  if (ratio > 0.1) return 1;
  return 0;
}

const difficultyColors = [
  "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200",
  "bg-green-400 dark:bg-green-700 text-green-900 dark:text-green-100",
  "bg-amber-300 dark:bg-amber-700 text-amber-900 dark:text-amber-100",
  "bg-orange-400 dark:bg-orange-600 text-orange-900 dark:text-orange-100",
  "bg-red-500 dark:bg-red-500 text-white",
];

const difficultyLabels = ["Easy", "Moderate", "Challenging", "Hard", "Intense"];

export function DifficultyHeatmapETA({ steps, roadmapId, createdAt }: DifficultyHeatmapETAProps) {
  const { totalMinutes, totalSessions } = useFocusSessions(roadmapId);

  // Calculate difficulty per step
  const stepsWithHours = steps.map((s) => ({
    ...s,
    hours: estimateHours(s),
  }));

  const maxHours = Math.max(...stepsWithHours.map((s) => s.hours), 1);
  const totalEstimatedHours = stepsWithHours.reduce((sum, s) => sum + s.hours, 0);
  const completedHours = stepsWithHours.filter((s) => s.completed).reduce((sum, s) => sum + s.hours, 0);
  const remainingHours = totalEstimatedHours - completedHours;

  // Calculate ETA based on pace
  const completedSteps = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const createdDate = new Date(createdAt);
  const daysSinceStart = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / 86400000));

  // Pace: hours completed per day
  const hoursPerDay = completedSteps > 0 ? completedHours / daysSinceStart : (totalMinutes > 0 ? totalMinutes / 60 / daysSinceStart : 1);
  const estimatedDaysRemaining = hoursPerDay > 0 ? Math.ceil(remainingHours / hoursPerDay) : null;

  const etaDate = estimatedDaysRemaining
    ? new Date(Date.now() + estimatedDaysRemaining * 86400000)
    : null;

  // Weekly pace (sessions per week)
  const weeksElapsed = Math.max(1, daysSinceStart / 7);
  const sessionsPerWeek = Math.round(totalSessions / weeksElapsed * 10) / 10;

  return (
    <div className="space-y-4">
      {/* ETA Card */}
      <Card className="overflow-hidden border-2 border-amber-500/10 bg-gradient-to-br from-background to-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <CalendarClock className="h-5 w-5 text-amber-500" />
            </div>
            Estimated Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* ETA */}
            <div className="text-center p-4 rounded-xl bg-muted/50">
              {etaDate && completedSteps > 0 ? (
                <>
                  <div className="text-2xl font-bold">
                    {etaDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ~{estimatedDaysRemaining} days from now
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-muted-foreground">—</div>
                  <div className="text-xs text-muted-foreground mt-1">Complete a step to see ETA</div>
                </>
              )}
            </div>

            {/* Remaining */}
            <div className="text-center p-4 rounded-xl bg-muted/50">
              <div className="text-2xl font-bold">{Math.round(remainingHours)}h</div>
              <div className="text-xs text-muted-foreground mt-1">
                of {Math.round(totalEstimatedHours)}h remaining
              </div>
            </div>
          </div>

          {/* Pace stats */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Pace: ~{Math.round(hoursPerDay * 10) / 10}h/day</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>{sessionsPerWeek} sessions/week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Heatmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-orange-500/10">
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
            Difficulty Map
          </CardTitle>
          <p className="text-xs text-muted-foreground">Visualize easy vs hard sections at a glance</p>
        </CardHeader>
        <CardContent>
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-wrap gap-1.5">
              {stepsWithHours.map((step, i) => {
                const level = getDifficultyLevel(step.hours, maxHours);
                return (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`relative w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold cursor-default transition-transform hover:scale-110 ${difficultyColors[level]} ${step.completed ? "ring-2 ring-green-500 ring-offset-1 ring-offset-background" : ""}`}
                      >
                        {i + 1}
                        {step.completed && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-[6px] text-white">✓</span>
                          </div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-[200px]">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-muted-foreground">
                        ~{step.hours}h · {difficultyLabels[level]}
                        {step.completed && " · ✅ Done"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>Easy</span>
              {difficultyColors.map((color, i) => (
                <div key={i} className={`w-4 h-4 rounded-sm ${color}`} />
              ))}
              <span>Intense</span>
              <span className="ml-2">|</span>
              <span className="ml-2 flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm bg-muted ring-2 ring-green-500 ring-offset-1" />
                Done
              </span>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
