import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useHybridRecommendations,
  useLogImpressions,
  logRecommendationClick,
  MLRecommendation,
} from "@/hooks/useRecommendations";

interface MLRecommendationsSectionProps {
  surface: "home" | "explore" | "search" | "skill";
  domain?: string | null;
  query?: string | null;
  limit?: number;
  title?: string;
  subtitle?: string;
  /** When true, hide the section entirely if no recommendations are returned. */
  hideIfEmpty?: boolean;
}

export function MLRecommendationsSection({
  surface,
  domain = null,
  query = null,
  limit = 6,
  title = "Recommended for you",
  subtitle = "Hybrid ML ranking blending your activity, interests, and community ratings",
  hideIfEmpty = false,
}: MLRecommendationsSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useHybridRecommendations(user?.id, {
    surface,
    domain,
    query,
    limit,
  });

  const items = data?.items ?? [];
  useLogImpressions(user?.id, items, surface);

  if (!user) return null;
  if (!isLoading && items.length === 0 && hideIfEmpty) return null;

  const handleClick = (rec: MLRecommendation, idx: number) => {
    if (user?.id) logRecommendationClick(user.id, rec, idx + 1, surface);
    if (rec.link) window.open(rec.link, "_blank");
    else navigate(`/resources/${rec.id}?source=resources`);
  };

  return (
    <section aria-label="ML recommendations">
      <div className="mb-4 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="text-[10px]">
              {data?.fallback ? "fallback" : "ML"}
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No recommendations yet — interact with a few resources and we'll learn what you like.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                onClick={() => handleClick(rec, i)}
                className="cursor-pointer h-full hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {rec.title}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {rec.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {rec.description}
                    </p>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-primary/5 border-primary/20 text-primary"
                    >
                      {rec.reason}
                    </Badge>
                    {rec.weighted_rating != null && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {Number(rec.weighted_rating).toFixed(1)}
                        {rec.total_ratings != null && (
                          <span>({rec.total_ratings})</span>
                        )}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
