import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays } from "lucide-react";
import { useFocusSessions } from "@/hooks/useFocusSessions";

interface LearningHeatmapProps {
  roadmapId?: string;
}

export function LearningHeatmap({ roadmapId }: LearningHeatmapProps) {
  const { heatmapData, isLoading } = useFocusSessions(roadmapId);

  // Generate last 20 weeks of dates (140 days)
  const today = new Date();
  const weeks: Date[][] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 139);
  // Align to start of week (Sunday)
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let current = new Date(startDate);
  while (current <= today) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const getIntensity = (dateStr: string): number => {
    const entry = heatmapData[dateStr];
    if (!entry) return 0;
    if (entry.minutes >= 120) return 4;
    if (entry.minutes >= 60) return 3;
    if (entry.minutes >= 30) return 2;
    return 1;
  };

  const intensityColors = [
    "bg-muted",
    "bg-green-200 dark:bg-green-900",
    "bg-green-400 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
    "bg-green-700 dark:bg-green-300",
  ];

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0].getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: week[0].toLocaleString("default", { month: "short" }),
        col: i,
      });
      lastMonth = month;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[120px] bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-green-500/10">
            <CalendarDays className="h-5 w-5 text-green-500" />
          </div>
          Learning Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto">
            {/* Month labels */}
            <div className="flex mb-1 pl-8">
              {monthLabels.map((m, i) => (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground"
                  style={{ marginLeft: i === 0 ? `${m.col * 14}px` : `${(m.col - (monthLabels[i - 1]?.col ?? 0)) * 14 - 24}px`, width: "24px" }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col mr-1">
                {dayLabels.map((label, i) => (
                  <div key={i} className="h-[12px] text-[9px] text-muted-foreground flex items-center" style={{ marginBottom: "2px" }}>
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-[2px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[2px]">
                    {week.map((day, di) => {
                      const dateStr = day.toISOString().split("T")[0];
                      const isFuture = day > today;
                      const intensity = isFuture ? -1 : getIntensity(dateStr);
                      const entry = heatmapData[dateStr];

                      return (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-[12px] h-[12px] rounded-sm transition-colors ${
                                isFuture ? "bg-transparent" : intensityColors[intensity]
                              }`}
                            />
                          </TooltipTrigger>
                          {!isFuture && (
                            <TooltipContent className="text-xs">
                              <p className="font-medium">{day.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                              {entry ? (
                                <p>{entry.sessions} session{entry.sessions > 1 ? "s" : ""} · {entry.minutes} min</p>
                              ) : (
                                <p className="text-muted-foreground">No activity</p>
                              )}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
              <span>Less</span>
              {intensityColors.map((color, i) => (
                <div key={i} className={`w-[10px] h-[10px] rounded-sm ${color}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
