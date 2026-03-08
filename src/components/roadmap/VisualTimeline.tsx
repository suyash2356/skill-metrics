import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Circle, Clock, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  completed: boolean;
  order_index: number;
  estimated_hours?: number;
  topics?: string[];
}

interface VisualTimelineProps {
  steps: TimelineStep[];
  groupedSteps: Record<string, TimelineStep[]>;
  phaseOrder: string[];
  isOwner: boolean;
  onToggleStep: (stepId: string, completed: boolean) => void;
  onSelectStep: (stepId: string) => void;
  activeStepId?: string;
}

const phaseColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  Introduction: { bg: "bg-sky-500/10", border: "border-sky-500/30", dot: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
  Beginner: { bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  Intermediate: { bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  Advanced: { bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  Milestone: { bg: "bg-purple-500/10", border: "border-purple-500/30", dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
  "Final Outcome": { bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary", text: "text-primary" },
  General: { bg: "bg-muted", border: "border-border", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

export function VisualTimeline({
  steps,
  groupedSteps,
  phaseOrder,
  isOwner,
  onToggleStep,
  onSelectStep,
  activeStepId,
}: VisualTimelineProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    // Auto-expand the first incomplete phase
    for (const phase of phaseOrder) {
      if (groupedSteps[phase]) {
        const hasIncomplete = groupedSteps[phase].some((s) => !s.completed);
        initial[phase] = hasIncomplete;
        if (hasIncomplete) break;
      }
    }
    return initial;
  });

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  // Calculate phase completion
  const getPhaseCompletion = (phaseSteps: TimelineStep[]) => {
    const done = phaseSteps.filter((s) => s.completed).length;
    return { done, total: phaseSteps.length, percent: Math.round((done / phaseSteps.length) * 100) };
  };

  // Find current step (first incomplete)
  const currentStepId = steps.find((s) => !s.completed)?.id;

  return (
    <div className="space-y-1">
      {phaseOrder.map((phase, phaseIdx) => {
        const phaseSteps = groupedSteps[phase];
        if (!phaseSteps) return null;

        const colors = phaseColors[phase] || phaseColors.General;
        const completion = getPhaseCompletion(phaseSteps);
        const isExpanded = expandedPhases[phase] ?? false;
        const isPhaseComplete = completion.percent === 100;

        return (
          <div key={phase} className="relative">
            {/* Phase connector line */}
            {phaseIdx < phaseOrder.filter((p) => groupedSteps[p]).length - 1 && (
              <div className={`absolute left-[19px] top-[48px] w-0.5 ${isPhaseComplete ? "bg-green-400" : "bg-border"} transition-colors`}
                style={{ height: isExpanded ? "100%" : "16px" }} />
            )}

            {/* Phase header */}
            <motion.button
              onClick={() => togglePhase(phase)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl ${colors.bg} border ${colors.border} hover:shadow-md transition-all mb-1`}
              whileHover={{ x: 4 }}
            >
              {/* Phase dot */}
              <div className="relative">
                <div className={`w-[10px] h-[10px] rounded-full ${isPhaseComplete ? "bg-green-500" : colors.dot} ring-4 ring-background`} />
                {isPhaseComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 fill-green-500" />
                  </motion.div>
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${colors.text}`}>{phase}</span>
                  <Badge variant="outline" className="text-[10px] tabular-nums">
                    {completion.done}/{completion.total}
                  </Badge>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1 bg-background/50 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    className={`h-full ${isPhaseComplete ? "bg-green-500" : colors.dot} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${completion.percent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </motion.button>

            {/* Steps */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 pl-5 border-l-2 border-dashed border-border/50 space-y-1 py-1">
                    {phaseSteps.map((step, stepIdx) => {
                      const isCurrent = step.id === currentStepId;
                      const isActive = step.id === activeStepId;

                      return (
                        <motion.div
                          key={step.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: stepIdx * 0.03 }}
                          className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                            ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"}
                            ${step.completed ? "opacity-75" : ""}`}
                          onClick={() => onSelectStep(step.id)}
                        >
                          {/* Step dot */}
                          <div className="relative flex-shrink-0 mt-0.5">
                            {/* Connector to border */}
                            <div className="absolute -left-[25px] top-1/2 w-[20px] h-[1px] bg-border/50" />

                            {step.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : isCurrent ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                <Circle className="h-5 w-5 text-primary fill-primary/20" />
                              </motion.div>
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/40" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                                {step.title}
                              </span>
                              {isCurrent && (
                                <Badge className="text-[9px] bg-primary/20 text-primary border-0 animate-pulse">
                                  Current
                                </Badge>
                              )}
                            </div>
                            {step.duration && (
                              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {step.duration}
                                {step.estimated_hours && <span>· ~{step.estimated_hours}h</span>}
                              </div>
                            )}
                          </div>

                          {isOwner && (
                            <Checkbox
                              checked={step.completed}
                              onCheckedChange={(checked) => {
                                onToggleStep(step.id, !!checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
