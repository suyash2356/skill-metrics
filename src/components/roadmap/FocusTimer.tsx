import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Play, Pause, RotateCcw, Zap, Flame, Trophy, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusSessions } from "@/hooks/useFocusSessions";
import { useToast } from "@/hooks/use-toast";

interface FocusTimerProps {
  roadmapId: string;
  steps?: any[];
  isOwner: boolean;
}

const TIMER_PRESETS = [
  { label: "25 min", value: 25, xp: 25 },
  { label: "45 min", value: 45, xp: 50 },
  { label: "60 min", value: 60, xp: 75 },
  { label: "90 min", value: 90, xp: 120 },
];

export function FocusTimer({ roadmapId, steps, isOwner }: FocusTimerProps) {
  const { streak, saveFocusSession, totalMinutes, totalSessions } = useFocusSessions(roadmapId);
  const { toast } = useToast();

  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = TIMER_PRESETS.find((p) => p.value === duration) || TIMER_PRESETS[0];

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [duration]);

  useEffect(() => {
    resetTimer();
  }, [duration, resetTimer]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Session complete
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleSessionComplete = () => {
    const xp = preset.xp;
    setEarnedXP(xp);
    setShowXPAnimation(true);
    setTimeout(() => setShowXPAnimation(false), 3000);

    saveFocusSession.mutate(
      { durationMinutes: duration, stepId: selectedStep && selectedStep !== "none" ? selectedStep : undefined, xpEarned: xp },
      {
        onSuccess: () => {
          toast({
            title: `🎉 +${xp} XP Earned!`,
            description: `You completed a ${duration}-minute focus session. Keep it up!`,
          });
        },
      }
    );

    if (soundEnabled) {
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkYyIg3x1c3V9g4mLi4iFgHt3d3x+g4eIiIaCfnt5eXx+gYOFhYSDgX9+fX1+f4GCgoKBgH9+fn5+f4CAgICAgH9/fn5+fn9/f39/f39/f39/f39/f39/f4CAgICAgICAgICAgIB/f39/f39/f39/f39/f39/f38=");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
    }
  };

  const toggleTimer = () => {
    if (!isOwner) return;
    setIsRunning((prev) => !prev);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / (duration * 60);

  if (!isOwner) return null;

  return (
    <Card className="overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-primary/10">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            Focus Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="relative flex flex-col items-center py-4">
          {/* Circular progress */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-muted" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="stroke-primary"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-mono font-bold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                +{preset.xp} XP on completion
              </span>
            </div>
          </div>

          {/* XP Animation */}
          <AnimatePresence>
            {showXPAnimation && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: 1.2 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.5 }}
                className="absolute top-4 text-2xl font-bold text-primary"
              >
                +{earnedXP} XP ⚡
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="icon" onClick={resetTimer} disabled={isRunning && timeLeft === duration * 60}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`px-8 ${isRunning ? "bg-orange-500 hover:bg-orange-600" : ""}`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" /> {timeLeft < duration * 60 ? "Resume" : "Start Focus"}
              </>
            )}
          </Button>
        </div>

        {/* Duration & Step Selection */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))} disabled={isRunning}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMER_PRESETS.map((p) => (
                <SelectItem key={p.value} value={String(p.value)}>
                  {p.label} ({p.xp} XP)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {steps && steps.length > 0 && (
            <Select value={selectedStep} onValueChange={setSelectedStep}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Link to step..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific step</SelectItem>
                {steps.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title.slice(0, 30)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Streak & Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center p-2 rounded-lg bg-orange-500/10">
            <div className="flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold text-orange-600">{streak?.current_streak || 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Day Streak</span>
          </div>
          <div className="text-center p-2 rounded-lg bg-primary/10">
            <div className="flex items-center justify-center gap-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-primary">{streak?.total_xp || 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Total XP</span>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-500/10">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold text-green-600">{streak?.longest_streak || 0}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Best Streak</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>
            {totalSessions} sessions · {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total
          </span>
          <Badge variant="outline" className="text-[10px]">
            {streak?.last_active_date === new Date().toISOString().split("T")[0]
              ? "✅ Active today"
              : "⏳ Not yet today"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
