import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Star, Clock, Globe, Zap, Award, ExternalLink, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cardVariants, CardGridSkeleton, EmptyState } from "./ExploreShared";
import type { PersonalizedExploreData } from "@/hooks/usePersonalizedExplore";

interface DegreesTabProps {
  personalizedData: PersonalizedExploreData;
}

export function DegreesTab({ personalizedData }: DegreesTabProps) {
  const [selectedDegree, setSelectedDegree] = useState<any | null>(null);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredDegrees = personalizedData.degrees.filter((scoredDeg) => {
    const deg = scoredDeg.item;
    if (modeFilter !== "all" && !deg.mode.toLowerCase().includes(modeFilter)) return false;
    if (difficultyFilter !== "all" && deg.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10">
            <GraduationCap className="h-6 w-6 text-sky-500" />
          </div>
          Top Degrees
        </h2>
        <p className="text-muted-foreground mt-2">
          Explore top university degrees (online & offline) — compare fees, duration, rating and what you'll learn.
        </p>
      </div>

      {/* Filters */}
      {!personalizedData.isLoading && personalizedData.degrees.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          {(modeFilter !== "all" || difficultyFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => { setModeFilter("all"); setDifficultyFilter("all"); }}>
              Clear filters
            </Button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filteredDegrees.length} results</span>
        </div>
      )}

      {personalizedData.isLoading ? (
        <CardGridSkeleton count={8} height="h-[160px]" />
      ) : personalizedData.degrees.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No degrees available" description="We're curating top university degrees. Check back soon!" />
      ) : filteredDegrees.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No matches" description="Try adjusting your filters to see more results." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDegrees.map((scoredDeg, i) => {
            const deg = scoredDeg.item;
            return (
              <motion.div
                key={`deg-${i}`}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  onClick={() => setSelectedDegree(deg)}
                  className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-sky-500/30 shadow-sm hover:shadow-lg transition-all h-[160px] flex flex-col"
                >
                  <CardHeader className="flex flex-row items-start gap-3 p-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${deg.mode.toLowerCase().includes("online") ? "from-teal-400 to-cyan-500" : "from-sky-500 to-indigo-500"} text-white shadow-md flex-shrink-0`}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{deg.title}</CardTitle>
                      <div className="text-xs text-muted-foreground mt-1 truncate">{deg.university}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{deg.mode}</Badge>
                        {scoredDeg.reasons[0] && (
                          <Badge className="text-[10px] bg-sky-500/10 text-sky-600 border-0 hover:bg-sky-500/20">{scoredDeg.reasons[0]}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Degree Modal */}
      <AnimatePresence>
        {selectedDegree && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedDegree(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedDegree.mode.toLowerCase().includes("online") ? "from-teal-400 to-cyan-500" : "from-sky-500 to-indigo-500"} text-white shadow-md flex-shrink-0`}>
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedDegree.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedDegree.university} • {selectedDegree.mode}
                        </p>
                      </div>
                    </div>
                    {selectedDegree.rating && (
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 rounded-lg">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">{selectedDegree.rating}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {selectedDegree.about && (
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm leading-relaxed">{selectedDegree.about}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="text-sm font-medium mt-0.5">{selectedDegree.duration || "N/A"}</div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <Globe className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-xs text-muted-foreground">Mode</div>
                      <div className="text-sm font-medium capitalize mt-0.5">{selectedDegree.mode}</div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <Zap className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-xs text-muted-foreground">Fees</div>
                      <div className="text-sm font-medium mt-0.5">{selectedDegree.fees}</div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 text-center">
                      <Award className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-xs text-muted-foreground">Admission</div>
                      <div className="text-sm font-medium mt-0.5 truncate">{selectedDegree.exam || "Direct"}</div>
                    </div>
                  </div>

                  {Array.isArray(selectedDegree.timeline) && selectedDegree.timeline.length > 0 && (
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-muted/30 px-4 py-2 text-sm font-medium">Curriculum Timeline</div>
                      <div className="p-4 space-y-4">
                        {selectedDegree.timeline.map((yr: any, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              {idx < selectedDegree.timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-1" />}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="font-medium text-sm">{yr.label}</div>
                              <ul className="mt-2 space-y-1">
                                {yr.items.map((it: string, i2: number) => (
                                  <li key={i2} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    {it}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      Source: {Array.isArray(selectedDegree.sources) ? selectedDegree.sources.join(", ") : "Official site"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setSelectedDegree(null)}>Close</Button>
                      <Button onClick={() => window.open(selectedDegree.link, "_blank")}>
                        Visit Website <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
