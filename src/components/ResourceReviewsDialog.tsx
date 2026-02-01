import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRatingInput } from './StarRatingInput';
import { ThumbsUp, CheckCircle, User } from 'lucide-react';
import { ResourceReview } from '@/hooks/useResourceRatings';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ResourceReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceTitle: string;
  reviews: ResourceReview[];
  isAuthenticated: boolean;
  onMarkHelpful: (reviewId: string, isCurrentlyHelpful: boolean) => void;
  currentUserId?: string;
}

type SortOption = 'recent' | 'helpful' | 'highest' | 'lowest';
type FilterOption = 'all' | 'verified';

export function ResourceReviewsDialog({
  open,
  onOpenChange,
  resourceTitle,
  reviews,
  isAuthenticated,
  onMarkHelpful,
  currentUserId,
}: ResourceReviewsDialogProps) {
  const [sortBy, setSortBy] = useState<SortOption>('helpful');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filterBy === 'verified') {
      result = result.filter(r => r.is_verified);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'helpful':
        result.sort((a, b) => b.helpful_count - a.helpful_count);
        break;
      case 'highest':
        result.sort((a, b) => (b.user_rating || 0) - (a.user_rating || 0));
        break;
      case 'lowest':
        result.sort((a, b) => (a.user_rating || 0) - (b.user_rating || 0));
        break;
    }

    return result;
  }, [reviews, sortBy, filterBy]);

  const verifiedCount = reviews.filter(r => r.is_verified).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">Reviews</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{resourceTitle}</p>
        </DialogHeader>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 py-2 border-b">
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <TabsList className="h-8">
              <TabsTrigger value="helpful" className="text-xs px-2">Most Helpful</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs px-2">Recent</TabsTrigger>
              <TabsTrigger value="highest" className="text-xs px-2">Highest</TabsTrigger>
              <TabsTrigger value="lowest" className="text-xs px-2">Lowest</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant={filterBy === 'verified' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilterBy(filterBy === 'verified' ? 'all' : 'verified')}
            className="gap-1 text-xs h-8"
          >
            <CheckCircle className="w-3 h-3" />
            Verified Only ({verifiedCount})
          </Button>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filterBy === 'verified' 
                ? 'No verified reviews yet' 
                : 'No reviews yet. Be the first to review!'}
            </div>
          ) : (
            filteredAndSortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isAuthenticated={isAuthenticated}
                onMarkHelpful={onMarkHelpful}
                isOwnReview={currentUserId === review.user_id}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewCardProps {
  review: ResourceReview;
  isAuthenticated: boolean;
  onMarkHelpful: (reviewId: string, isCurrentlyHelpful: boolean) => void;
  isOwnReview: boolean;
}

function ReviewCard({ review, isAuthenticated, onMarkHelpful, isOwnReview }: ReviewCardProps) {
  const userName = review.user_profile?.full_name || 'Anonymous';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.user_profile?.avatar_url || undefined} />
          <AvatarFallback>
            {initials || <User className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{userName}</span>
            {review.is_verified && (
              <Badge variant="secondary" className="gap-1 text-xs py-0">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Completed
              </Badge>
            )}
            {isOwnReview && (
              <Badge variant="outline" className="text-xs py-0">You</Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            {review.user_rating && (
              <StarRatingInput value={review.user_rating} readonly size="sm" />
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
            {review.review_text}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2 text-xs gap-1',
                review.user_has_marked_helpful && 'text-primary'
              )}
              disabled={!isAuthenticated || isOwnReview}
              onClick={() => onMarkHelpful(review.id, review.user_has_marked_helpful || false)}
            >
              <ThumbsUp className={cn(
                'w-3 h-3',
                review.user_has_marked_helpful && 'fill-current'
              )} />
              Helpful ({review.helpful_count})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
