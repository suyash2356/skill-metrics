import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Award, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { iconMap, cardVariants, CardGridSkeleton, EmptyState } from "./ExploreShared";
import type { PersonalizedExploreData } from "@/hooks/usePersonalizedExplore";

interface CertificationsTabProps {
  personalizedData: PersonalizedExploreData;
}

export function CertificationsTab({ personalizedData }: CertificationsTabProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [costFilter, setCostFilter] = useState<string>("all");

  const filteredCerts = personalizedData.certifications.filter((scoredCert) => {
    const cert = scoredCert.item;
    if (difficultyFilter !== "all" && cert.difficulty !== difficultyFilter) return false;
    if (costFilter !== "all" && cert.cost !== costFilter) return false;
    return true;
  });

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          Top Certifications
        </h2>
        <p className="text-muted-foreground mt-2">Industry-recognized certifications to boost your career</p>
      </div>

      {/* Filters */}
      {!personalizedData.isLoading && personalizedData.certifications.length > 0 && (
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
          <Select value={costFilter} onValueChange={setCostFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Cost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          {(difficultyFilter !== "all" || costFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => { setDifficultyFilter("all"); setCostFilter("all"); }}>
              Clear filters
            </Button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filteredCerts.length} results</span>
        </div>
      )}

      {personalizedData.isLoading ? (
        <CardGridSkeleton count={6} height="h-[180px]" />
      ) : personalizedData.certifications.length === 0 ? (
        <EmptyState icon={Award} title="No certifications available" description="Industry certifications will appear here once curated." />
      ) : filteredCerts.length === 0 ? (
        <EmptyState icon={Award} title="No matches" description="Try adjusting your filters to see more results." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((scoredCert, i) => {
            const cert = scoredCert.item;
            const IconComponent = iconMap[cert.icon] || Award;
            return (
              <motion.div
                key={i}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  onClick={() => window.open(cert.link, "_blank")}
                  className="cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-amber-500/30 shadow-sm hover:shadow-lg transition-all h-[180px] flex flex-col"
                >
                  <CardHeader className="flex flex-row items-start gap-3 p-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cert.color} text-white shadow-md flex-shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{cert.name}</CardTitle>
                      {scoredCert.reasons[0] && (
                        <Badge className="mt-1 text-[10px] bg-amber-500/10 text-amber-600 border-0">{scoredCert.reasons[0]}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                    <div>
                      <p className="text-sm text-muted-foreground">by {cert.provider}</p>
                      {cert.estimatedTime && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {cert.estimatedTime}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end mt-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
