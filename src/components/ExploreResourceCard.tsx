import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, ExternalLink, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, 
  BookOpen, Award, GraduationCap, FileText, Youtube, Globe, Layers, Brain
} from "lucide-react";
import { useResourceRatings } from "@/hooks/useResourceRatings";
import { ResourceRatingCard } from "@/components/ResourceRatingCard";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExploreResourceCardProps {
  resource: {
    id?: string;
    title: string;
    description?: string;
    link?: string;
    provider?: string;
    difficulty?: string;
    icon?: string;
    color?: string;
    avg_rating?: number | null;
    weighted_rating?: number | null;
    total_ratings?: number | null;
    recommend_percent?: number | null;
    total_votes?: number | null;
  };
  reasons?: string[];
  variant?: 'default' | 'compact' | 'blog' | 'certification' | 'degree';
  colorAccent?: string;
  onClick?: () => void;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Award, GraduationCap, FileText, Youtube, Globe, Layers, Brain, Star
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  })
};

export function ExploreResourceCard({ 
  resource, 
  reasons = [], 
  variant = 'default',
  colorAccent = 'primary',
  onClick,
  index = 0
}: ExploreResourceCardProps) {
  const [showRatingPanel, setShowRatingPanel] = useState(false);
  
  const {
    stats,
    userVote,
    hasEnoughRatings,
    formatRatingCount,
    submitVote,
    isAuthenticated,
  } = useResourceRatings(resource.id);

  const handleVote = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    if (!resource.id) {
      toast.info('Rating coming soon for this resource');
      return;
    }
    submitVote(voteType);
  };

  const handleRateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resource.id) {
      toast.info('Rating coming soon for this resource');
      return;
    }
    setShowRatingPanel(!showRatingPanel);
  };

  const IconComponent = resource.icon ? (iconMap[resource.icon] || BookOpen) : BookOpen;
  
  // Use database stats or fallback to resource props
  const displayRating = stats?.avg_rating ?? resource.avg_rating ?? resource.weighted_rating;
  const displayTotalRatings = stats?.total_ratings ?? resource.total_ratings ?? 0;
  const displayRecommendPercent = stats?.recommend_percent ?? resource.recommend_percent;
  const displayTotalVotes = stats?.total_votes ?? resource.total_votes ?? 0;
  const showRatings = resource.id ? hasEnoughRatings : displayTotalRatings >= 10;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={index}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        onClick={onClick || (() => resource.link && window.open(resource.link, "_blank"))}
        className={`cursor-pointer bg-card hover:bg-card/80 border border-border/50 hover:border-${colorAccent}/30 shadow-sm hover:shadow-lg transition-all flex flex-col group ${
          variant === 'compact' ? 'h-[180px]' : 'h-auto min-h-[220px]'
        }`}
      >
        <CardHeader className="flex flex-row items-start gap-3 p-4 pb-2">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${resource.color || 'from-primary to-primary/70'} text-white shadow-md flex-shrink-0`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            {/* Rating Badge Row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {showRatings && displayRating ? (
                <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span className="font-medium">{displayRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({formatRatingCount(displayTotalRatings)})</span>
                </div>
              ) : displayTotalRatings > 0 ? (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {displayTotalRatings}/10 ratings
                </span>
              ) : null}
              
              {showRatings && displayRecommendPercent !== null && displayRecommendPercent !== undefined && displayTotalVotes >= 5 && (
                <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                  <CheckCircle className="h-3 w-3" />
                  <span>{displayRecommendPercent}%</span>
                </div>
              )}

              {resource.difficulty && (
                <Badge variant="outline" className="text-[10px] capitalize">
                  {resource.difficulty}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
              {resource.title}
            </CardTitle>
            
            {reasons[0] && (
              <Badge className={`mt-1 text-[10px] bg-${colorAccent}/10 text-${colorAccent} border-0`}>
                {reasons[0]}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0 space-y-3">
          {resource.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
          )}

          {/* Quick Vote Buttons */}
          {resource.id && (
            <div className="flex items-center gap-1.5 pt-1">
              <Button
                variant={userVote?.vote_type === 'up' ? 'default' : 'outline'}
                size="sm"
                className="h-6 px-2 gap-1 text-[10px]"
                onClick={(e) => handleVote(e, 'up')}
              >
                <ThumbsUp className={`w-3 h-3 ${userVote?.vote_type === 'up' ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Recommend</span>
              </Button>
              <Button
                variant={userVote?.vote_type === 'down' ? 'destructive' : 'outline'}
                size="sm"
                className="h-6 px-2 text-[10px]"
                onClick={(e) => handleVote(e, 'down')}
              >
                <ThumbsDown className={`w-3 h-3 ${userVote?.vote_type === 'down' ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 gap-1 text-[10px] ml-auto"
                onClick={handleRateClick}
              >
                <MessageSquare className="w-3 h-3" />
                <span className="hidden sm:inline">Rate</span>
              </Button>
            </div>
          )}

          {/* Provider and Link */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            {resource.provider && (
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {resource.provider}
              </span>
            )}
            <ExternalLink className={`h-4 w-4 text-muted-foreground group-hover:text-${colorAccent} transition-colors flex-shrink-0`} />
          </div>
        </CardContent>

        {/* Expandable Rating Panel */}
        {showRatingPanel && resource.id && (
          <div className="p-4 pt-0 border-t" onClick={(e) => e.stopPropagation()}>
            <ResourceRatingCard
              resourceId={resource.id}
              resourceTitle={resource.title}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
