import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { iconMap, cardVariants, CardGridSkeleton, EmptyState } from "./ExploreShared";
import type { PersonalizedExploreData } from "@/hooks/usePersonalizedExplore";
import { MLRecommendationsSection } from "@/components/recommendations/MLRecommendationsSection";

interface ResourcesTabProps {
  personalizedData: PersonalizedExploreData;
}

export function ResourcesTab({ personalizedData }: ResourcesTabProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredResources = personalizedData.trendingResources.filter((scoredRes) => {
    if (difficultyFilter !== "all" && scoredRes.item.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <section className="space-y-10">
      <MLRecommendationsSection
        surface="explore"
        limit={6}
        title="Recommended for you"
        subtitle="Personalized via hybrid ML ranking — your activity + interests + community ratings"
        hideIfEmpty
      />

      <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10">
            <BookOpen className="h-6 w-6 text-orange-500" />
          </div>
          Trending Resources
        </h2>
        <p className="text-muted-foreground mt-2">Featured learning resources handpicked for you</p>
      </div>

      {/* Filters */}
      {!personalizedData.isLoading && personalizedData.trendingResources.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
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
          {difficultyFilter !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setDifficultyFilter("all")}>Clear filters</Button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filteredResources.length} results</span>
        </div>
      )}

      {personalizedData.isLoading ? (
        <CardGridSkeleton count={6} height="h-[180px]" />
      ) : personalizedData.trendingResources.length === 0 ? (
        <EmptyState icon={BookOpen} title="No trending resources yet" description="Featured resources will appear here as they're curated." />
      ) : filteredResources.length === 0 ? (
        <EmptyState icon={BookOpen} title="No matches" description="Try adjusting your filters to see more results." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((scoredRes, i) => {
            const res = scoredRes.item;
            const IconComponent = iconMap[res.icon] || BookOpen;
            return (
              <motion.div
                key={i}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  onClick={() => window.open(res.link, "_blank")}
                  className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-orange-500/30 shadow-sm hover:shadow-lg transition-all h-[180px] flex flex-col group"
                >
                  <CardHeader className="flex flex-row items-start gap-3 p-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${res.color} text-white shadow-md flex-shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{res.title}</CardTitle>
                      {scoredRes.reasons[0] && (
                        <Badge className="mt-1 text-[10px] bg-orange-500/10 text-orange-600 border-0">{scoredRes.reasons[0]}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>
                    <div className="flex items-center justify-end mt-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
