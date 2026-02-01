import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StarRatingInput } from './StarRatingInput';
import { WriteReviewDialog } from './WriteReviewDialog';
import { ResourceReviewsDialog } from './ResourceReviewsDialog';
import { useResourceRatings, ResourceStats, ResourceReview } from '@/hooks/useResourceRatings';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  CheckCircle,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ResourceRatingCardProps {
  resourceId: string;
  resourceTitle: string;
  className?: string;
  compact?: boolean;
}

export function ResourceRatingCard({
  resourceId,
  resourceTitle,
  className,
  compact = false,
}: ResourceRatingCardProps) {
  const { user } = useAuth();
  const {
    stats,
    userRating,
    userVote,
    reviews,
    userReview,
    isLoading,
    isSubmitting,
    submitRating,
    submitVote,
    submitReview,
    markHelpful,
    hasEnoughRatings,
    formatRatingCount,
    isAuthenticated,
    minRatingsRequired,
  } = useResourceRatings(resourceId);

  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }
    submitVote(voteType);
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to write a review');
      return;
    }
    setWriteDialogOpen(true);
  };

  // Get top review (most helpful, verified preferred)
  const topReview = reviews?.length 
    ? reviews.sort((a, b) => {
        if (a.is_verified !== b.is_verified) return a.is_verified ? -1 : 1;
        return b.helpful_count - a.helpful_count;
      })[0]
    : null;

  if (compact) {
    return (
      <CompactRatingDisplay
        stats={stats}
        hasEnoughRatings={hasEnoughRatings}
        formatRatingCount={formatRatingCount}
        minRatingsRequired={minRatingsRequired}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4 space-y-4">
          {/* Rating Display */}
          <div className="flex items-center justify-between">
            <RatingDisplay
              stats={stats}
              hasEnoughRatings={hasEnoughRatings}
              formatRatingCount={formatRatingCount}
              minRatingsRequired={minRatingsRequired}
              isLoading={isLoading}
            />
            
            {/* Recommend Percentage */}
            {stats && hasEnoughRatings && stats.recommend_percent !== null && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{stats.recommend_percent}% Recommend</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.total_votes} votes
                </div>
              </div>
            )}
          </div>

          {/* Recommend Bar */}
          {stats && hasEnoughRatings && stats.recommend_percent !== null && (
            <div className="space-y-1">
              <Progress value={stats.recommend_percent} className="h-2" />
            </div>
          )}

          {/* User's Current Rating */}
          {isAuthenticated && (
            <div className="flex items-center justify-between py-2 border-t border-b">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <StarRatingInput
                value={userRating?.stars || 0}
                onChange={(stars) => {
                  if (stars > 0) submitRating(stars);
                }}
                size="md"
              />
            </div>
          )}

          {/* Vote Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={userVote?.vote_type === 'up' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => handleVote('up')}
              disabled={isSubmitting}
            >
              <ThumbsUp className={cn(
                'w-4 h-4',
                userVote?.vote_type === 'up' && 'fill-current'
              )} />
              Recommend
            </Button>
            <Button
              variant={userVote?.vote_type === 'down' ? 'destructive' : 'outline'}
              size="sm"
              className="flex-1 gap-2"
              onClick={() => handleVote('down')}
              disabled={isSubmitting}
            >
              <ThumbsDown className={cn(
                'w-4 h-4',
                userVote?.vote_type === 'down' && 'fill-current'
              )} />
              Not Recommend
            </Button>
          </div>

          {/* Top Review Preview */}
          {topReview && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>Top Review</span>
                {topReview.is_verified && (
                  <Badge variant="secondary" className="gap-1 text-xs py-0">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm line-clamp-2">"{topReview.review_text}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={handleWriteReview}
            >
              <MessageSquare className="w-4 h-4" />
              {userReview ? 'Edit Review' : 'Write Review'}
            </Button>
            {(stats?.total_reviews || 0) > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setReviewsDialogOpen(true)}
              >
                <Users className="w-4 h-4" />
                All Reviews ({stats?.total_reviews})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={writeDialogOpen}
        onOpenChange={setWriteDialogOpen}
        resourceTitle={resourceTitle}
        currentRating={userRating?.stars || 0}
        currentReview={userReview?.review_text || ''}
        currentIsVerified={userReview?.is_verified || false}
        onSubmitRating={submitRating}
        onSubmitReview={submitReview}
        isSubmitting={isSubmitting}
      />

      {/* Reviews Dialog */}
      <ResourceReviewsDialog
        open={reviewsDialogOpen}
        onOpenChange={setReviewsDialogOpen}
        resourceTitle={resourceTitle}
        reviews={reviews || []}
        isAuthenticated={isAuthenticated}
        onMarkHelpful={markHelpful}
        currentUserId={user?.id}
      />
    </>
  );
}

// Shared rating display component
interface RatingDisplayProps {
  stats: ResourceStats | null | undefined;
  hasEnoughRatings: boolean;
  formatRatingCount: (count: number) => string;
  minRatingsRequired: number;
  isLoading: boolean;
}

function RatingDisplay({ stats, hasEnoughRatings, formatRatingCount, minRatingsRequired, isLoading }: RatingDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-5 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!stats || !hasEnoughRatings) {
    return (
      <div className="text-sm text-muted-foreground">
        <span>Not enough ratings yet</span>
        <span className="block text-xs">
          ({stats?.total_ratings || 0}/{minRatingsRequired} needed)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      <span className="text-lg font-semibold">
        {stats.avg_rating?.toFixed(1) || '0.0'}
      </span>
      <span className="text-sm text-muted-foreground">
        ({formatRatingCount(stats.total_ratings)} ratings)
      </span>
    </div>
  );
}

// Compact display for lists
function CompactRatingDisplay({ stats, hasEnoughRatings, formatRatingCount, minRatingsRequired, isLoading }: RatingDisplayProps) {
  if (isLoading) {
    return <div className="w-16 h-4 bg-muted animate-pulse rounded" />;
  }

  if (!stats || !hasEnoughRatings) {
    return (
      <span className="text-xs text-muted-foreground">
        {stats?.total_ratings || 0}/{minRatingsRequired} ratings
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{stats.avg_rating?.toFixed(1)}</span>
        <span className="text-muted-foreground">({formatRatingCount(stats.total_ratings)})</span>
      </div>
      {stats.recommend_percent !== null && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>{stats.recommend_percent}%</span>
        </div>
      )}
    </div>
  );
}
