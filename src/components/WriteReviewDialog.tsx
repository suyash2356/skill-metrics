import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StarRatingInput } from './StarRatingInput';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceTitle: string;
  currentRating?: number;
  currentReview?: string;
  currentIsVerified?: boolean;
  onSubmitRating: (stars: number) => void;
  onSubmitReview: (reviewText: string, isVerified: boolean) => void;
  isSubmitting?: boolean;
}

const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEW_LENGTH = 2000;

export function WriteReviewDialog({
  open,
  onOpenChange,
  resourceTitle,
  currentRating = 0,
  currentReview = '',
  currentIsVerified = false,
  onSubmitRating,
  onSubmitReview,
  isSubmitting = false,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState(currentRating);
  const [reviewText, setReviewText] = useState(currentReview);
  const [isVerified, setIsVerified] = useState(currentIsVerified);

  useEffect(() => {
    if (open) {
      setRating(currentRating);
      setReviewText(currentReview);
      setIsVerified(currentIsVerified);
    }
  }, [open, currentRating, currentReview, currentIsVerified]);

  const charCount = reviewText.length;
  const isValidLength = charCount >= MIN_REVIEW_LENGTH && charCount <= MAX_REVIEW_LENGTH;
  const canSubmit = rating > 0 && isValidLength && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    onSubmitRating(rating);
    onSubmitReview(reviewText, isVerified);
    onOpenChange(false);
  };

  const handleRatingOnly = () => {
    if (rating > 0) {
      onSubmitRating(rating);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Rate & Review</DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{resourceTitle}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Your Rating *</Label>
            <div className="flex items-center gap-3">
              <StarRatingInput
                value={rating}
                onChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review" className="text-sm font-medium">
              Your Review (Optional)
            </Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this resource. What did you learn? Would you recommend it to others?"
              className="min-h-[120px] resize-none"
              maxLength={MAX_REVIEW_LENGTH}
            />
            <div className="flex items-center justify-between text-xs">
              <span className={charCount > 0 && charCount < MIN_REVIEW_LENGTH ? 'text-destructive' : 'text-muted-foreground'}>
                {charCount > 0 && charCount < MIN_REVIEW_LENGTH && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Minimum {MIN_REVIEW_LENGTH} characters
                  </span>
                )}
              </span>
              <span className={charCount > MAX_REVIEW_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}>
                {charCount}/{MAX_REVIEW_LENGTH}
              </span>
            </div>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Checkbox
              id="verified"
              checked={isVerified}
              onCheckedChange={(checked) => setIsVerified(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="verified" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                <CheckCircle className="w-4 h-4 text-green-500" />
                I completed this resource
              </Label>
              <p className="text-xs text-muted-foreground">
                Your review will be marked as verified, making it more trustworthy to others.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {reviewText.length === 0 && rating > 0 && (
            <Button
              variant="outline"
              onClick={handleRatingOnly}
              disabled={isSubmitting}
            >
              Submit Rating Only
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
