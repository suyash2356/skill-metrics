import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ResourceRating {
  id: string;
  user_id: string;
  resource_id: string;
  stars: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceVote {
  id: string;
  user_id: string;
  resource_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface ResourceReview {
  id: string;
  user_id: string;
  resource_id: string;
  review_text: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  user_rating?: number;
  user_has_marked_helpful?: boolean;
}

export interface ResourceStats {
  avg_rating: number | null;
  weighted_rating: number | null;
  total_ratings: number;
  recommend_percent: number | null;
  total_votes: number;
  total_reviews: number;
}

const MIN_RATINGS_TO_DISPLAY = 10;

export function useResourceRatings(resourceId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get resource stats (aggregates from resources table)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['resource-stats', resourceId],
    queryFn: async (): Promise<ResourceStats | null> => {
      if (!resourceId) return null;
      
      const { data, error } = await supabase
        .from('resources')
        .select('avg_rating, weighted_rating, total_ratings, recommend_percent, total_votes, total_reviews')
        .eq('id', resourceId)
        .single();
      
      if (error) {
        console.error('Error fetching resource stats:', error);
        return null;
      }
      
      return data as ResourceStats;
    },
    enabled: !!resourceId,
  });

  // Get current user's rating for this resource
  const { data: userRating, isLoading: userRatingLoading } = useQuery({
    queryKey: ['user-rating', resourceId, user?.id],
    queryFn: async (): Promise<ResourceRating | null> => {
      if (!resourceId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('resource_ratings')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user rating:', error);
        return null;
      }
      
      return data as ResourceRating | null;
    },
    enabled: !!resourceId && !!user?.id,
  });

  // Get current user's vote for this resource
  const { data: userVote, isLoading: userVoteLoading } = useQuery({
    queryKey: ['user-vote', resourceId, user?.id],
    queryFn: async (): Promise<ResourceVote | null> => {
      if (!resourceId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('resource_votes')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user vote:', error);
        return null;
      }
      
      return data as ResourceVote | null;
    },
    enabled: !!resourceId && !!user?.id,
  });

  // Get reviews for this resource
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['resource-reviews', resourceId],
    queryFn: async (): Promise<ResourceReview[]> => {
      if (!resourceId) return [];
      
      // Get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('resource_reviews')
        .select('*')
        .eq('resource_id', resourceId)
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        return [];
      }
      
      if (!reviewsData || reviewsData.length === 0) return [];
      
      // Get user profiles for reviewers
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);
      
      // Get ratings for these users on this resource
      const { data: ratings } = await supabase
        .from('resource_ratings')
        .select('user_id, stars')
        .eq('resource_id', resourceId)
        .in('user_id', userIds);
      
      // Get helpful votes from current user
      let userHelpfulVotes: string[] = [];
      if (user?.id) {
        const { data: helpfulData } = await supabase
          .from('resource_review_helpful')
          .select('review_id')
          .eq('user_id', user.id)
          .in('review_id', reviewsData.map(r => r.id));
        
        userHelpfulVotes = helpfulData?.map(h => h.review_id) || [];
      }
      
      // Combine data
      return reviewsData.map(review => ({
        ...review,
        user_profile: profiles?.find(p => p.user_id === review.user_id) || null,
        user_rating: ratings?.find(r => r.user_id === review.user_id)?.stars,
        user_has_marked_helpful: userHelpfulVotes.includes(review.id),
      })) as ResourceReview[];
    },
    enabled: !!resourceId,
  });

  // Get current user's review
  const { data: userReview } = useQuery({
    queryKey: ['user-review', resourceId, user?.id],
    queryFn: async (): Promise<ResourceReview | null> => {
      if (!resourceId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('resource_reviews')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user review:', error);
        return null;
      }
      
      return data as ResourceReview | null;
    },
    enabled: !!resourceId && !!user?.id,
  });

  // Check rate limit
  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    const { data, error } = await supabase.rpc('check_rating_rate_limit', {
      p_user_id: user.id
    });
    
    if (error) {
      console.error('Error checking rate limit:', error);
      return true; // Allow on error
    }
    
    return data as boolean;
  }, [user?.id]);

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async ({ stars }: { stars: number }) => {
      if (!resourceId || !user?.id) throw new Error('Not authenticated');
      
      // Check rate limit
      const canRate = await checkRateLimit();
      if (!canRate) {
        throw new Error('Rate limit exceeded. Maximum 5 ratings per day.');
      }
      
      // Upsert rating
      const { error } = await supabase
        .from('resource_ratings')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          stars,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,resource_id',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-stats', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', resourceId] });
      toast.success('Rating submitted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit rating');
    },
  });

  // Submit vote mutation
  const submitVoteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: 'up' | 'down' }) => {
      if (!resourceId || !user?.id) throw new Error('Not authenticated');
      
      // If user already voted same way, remove vote
      if (userVote?.vote_type === voteType) {
        const { error } = await supabase
          .from('resource_votes')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);
        
        if (error) throw error;
        return;
      }
      
      // Upsert vote
      const { error } = await supabase
        .from('resource_votes')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          vote_type: voteType,
        }, {
          onConflict: 'user_id,resource_id',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-stats', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user-vote', resourceId] });
      toast.success('Vote recorded!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit vote');
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ reviewText, isVerified }: { reviewText: string; isVerified: boolean }) => {
      if (!resourceId || !user?.id) throw new Error('Not authenticated');
      
      if (reviewText.length < 20 || reviewText.length > 2000) {
        throw new Error('Review must be between 20 and 2000 characters');
      }
      
      // Upsert review
      const { error } = await supabase
        .from('resource_reviews')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          review_text: reviewText,
          is_verified: isVerified,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,resource_id',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-stats', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-reviews', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user-review', resourceId] });
      toast.success('Review submitted!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  // Mark review as helpful mutation
  const markHelpfulMutation = useMutation({
    mutationFn: async ({ reviewId, isHelpful }: { reviewId: string; isHelpful: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (isHelpful) {
        // Remove helpful vote
        const { error } = await supabase
          .from('resource_review_helpful')
          .delete()
          .eq('user_id', user.id)
          .eq('review_id', reviewId);
        
        if (error) throw error;
      } else {
        // Add helpful vote
        const { error } = await supabase
          .from('resource_review_helpful')
          .insert({
            user_id: user.id,
            review_id: reviewId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-reviews', resourceId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update helpful status');
    },
  });

  // Delete rating
  const deleteRatingMutation = useMutation({
    mutationFn: async () => {
      if (!resourceId || !user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('resource_ratings')
        .delete()
        .eq('user_id', user.id)
        .eq('resource_id', resourceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-stats', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', resourceId] });
      toast.success('Rating removed');
    },
  });

  // Delete review
  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      if (!resourceId || !user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('resource_reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('resource_id', resourceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-stats', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-reviews', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user-review', resourceId] });
      toast.success('Review removed');
    },
  });

  // Helper functions
  const hasEnoughRatings = stats ? stats.total_ratings >= MIN_RATINGS_TO_DISPLAY : false;
  
  const formatRatingCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return {
    // Data
    stats,
    userRating,
    userVote,
    reviews,
    userReview,
    
    // Loading states
    isLoading: statsLoading || userRatingLoading || userVoteLoading,
    reviewsLoading,
    isSubmitting: submitRatingMutation.isPending || submitVoteMutation.isPending || submitReviewMutation.isPending,
    
    // Actions
    submitRating: (stars: number) => submitRatingMutation.mutate({ stars }),
    submitVote: (voteType: 'up' | 'down') => submitVoteMutation.mutate({ voteType }),
    submitReview: (reviewText: string, isVerified: boolean) => 
      submitReviewMutation.mutate({ reviewText, isVerified }),
    markHelpful: (reviewId: string, isCurrentlyHelpful: boolean) => 
      markHelpfulMutation.mutate({ reviewId, isHelpful: isCurrentlyHelpful }),
    deleteRating: () => deleteRatingMutation.mutate(),
    deleteReview: () => deleteReviewMutation.mutate(),
    
    // Helpers
    hasEnoughRatings,
    formatRatingCount,
    isAuthenticated: !!user,
    minRatingsRequired: MIN_RATINGS_TO_DISPLAY,
  };
}
