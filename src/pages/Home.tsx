import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { InstagramPost } from "@/components/InstagramPost";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, TrendingUp, Users, Play, Eye, Sparkles, X } from "lucide-react";
import { AddCommunityLinkDialog } from "@/components/AddCommunityLinkDialog";
import { useExternalCommunityLinks } from "@/hooks/useExternalCommunityLinks";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTopVideosByViews } from "@/lib/videosData";
import { usePersonalizedFeed } from "@/hooks/usePersonalizedFeed";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePostInteractions } from "@/hooks/usePostInteractions";


import type { Database } from '@/integrations/supabase/types';
type Post = Database['public']['Tables']['posts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type PostWithProfile = Post & {
  profiles: Pick<Profile, 'full_name' | 'title' | 'avatar_url'> | null
  likes_count: number;
  comments_count: number;
};

const Home = () => {
  const [commentDialogOpen, setCommentDialogOpen] = useState<{ open: boolean; postId: string | null }>({ open: false, postId: null });
  const [shareDialogOpen, setShareDialogOpen] = useState<{ open: boolean; post: PostWithProfile | null }>({ open: false, post: null });
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set());

  const [initialSeenPosts] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('seenPosts');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1000));

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sendLikeNotification } = usePostInteractions();

  // AI-powered personalized recommendations
  const {
    data: personalizedData,
    isLoading: isLoadingPersonalized,
    error: personalizedError
  } = usePersonalizedFeed();

  const { data: likedPosts = new Set<string>(), } = useQuery({
    queryKey: ['userLikes', user?.id],
    queryFn: async () => {
      if (!user?.id) return new Set<string>();
      const { data, error } = await supabase.from('likes').select('post_id').eq('user_id', user.id);
      if (error) throw error;
      return new Set((data || []).map((r) => r.post_id));
    },
    enabled: !!user,
  });

  const { data: bookmarkedPosts = new Set<string>(), } = useQuery({
    queryKey: ['userBookmarks', user?.id],
    queryFn: async () => {
      if (!user?.id) return new Set<string>();
      const { data, error } = await supabase.from('bookmarks').select('post_id').eq('user_id', user.id);
      if (error) throw error;
      return new Set((data || []).map((r) => r.post_id));
    },
    enabled: !!user,
  });

  // Fetch posts marked as "not interested"
  const { data: notInterestedPosts = new Set<string>() } = useQuery({
    queryKey: ['notInterestedPosts', user?.id],
    queryFn: async () => {
      if (!user?.id) return new Set<string>();
      const { data, error } = await supabase
        .from('post_preferences')
        .select('post_id')
        .eq('user_id', user.id)
        .eq('preference_type', 'not_interested');
      if (error) throw error;
      return new Set((data || []).map((r) => r.post_id));
    },
    enabled: !!user,
  });

  // Fetch users that the current user follows
  const { data: followingIds = new Set<string>() } = useQuery({
    queryKey: ['followingUsers', user?.id],
    queryFn: async () => {
      if (!user?.id) return new Set<string>();
      const { data, error } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);
      if (error) throw error;
      return new Set((data || []).map((r) => r.following_id));
    },
    enabled: !!user,
  });
  const pageSize = 10;

  const fetchPosts = async ({ pageParam = 0 }) => {
    const from = pageParam * pageSize;
    const to = from + pageSize - 1;

    // Fetch posts - RLS will filter based on privacy settings
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error("Failed to load posts: " + error.message);
    if (!postsData || postsData.length === 0) {
      return { posts: [], nextPage: undefined };
    }

    // Get unique user IDs
    const userIds = [...new Set(postsData.map(p => p.user_id))];

    // Fetch author info using the RPC function that respects privacy
    const profilePromises = userIds.map(async (userId) => {
      const { data } = await supabase.rpc('get_post_author_info', {
        _viewer_id: user?.id || null,
        _author_id: userId
      });
      return { userId, profile: data };
    });

    const profileResults = await Promise.all(profilePromises);
    const profilesMap = profileResults.reduce((acc, { userId, profile }) => {
      acc[userId] = profile || { full_name: 'Anonymous', title: null, avatar_url: null };
      return acc;
    }, {} as Record<string, any>);

    const posts: PostWithProfile[] = postsData.map((post: any) => ({
      ...post,
      profiles: {
        full_name: profilesMap[post.user_id]?.full_name || 'Anonymous',
        title: profilesMap[post.user_id]?.title || null,
        avatar_url: profilesMap[post.user_id]?.avatar_url || null,
      },
      likes_count: 0,
      comments_count: 0,
    }));

    const postIds = posts.map(p => p.id);

    const [{ data: likesData }, { data: commentsData }] = await Promise.all([
      supabase.from('likes').select('post_id, user_id').in('post_id', postIds),
      supabase.from('comments').select('post_id, user_id').in('post_id', postIds)
    ]);

    const likesByPost = (likesData || []).reduce((acc, like) => {
      acc[like.post_id] = (acc[like.post_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commentsByPost = (commentsData || []).reduce((acc, comment) => {
      acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const postsWithCounts = posts.map(p => ({
      ...p,
      likes_count: likesByPost[p.id] || 0,
      comments_count: commentsByPost[p.id] || 0,
    }));

    return { posts: postsWithCounts, nextPage: posts.length === pageSize ? pageParam + 1 : undefined };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
  } = useInfiniteQuery({
    queryKey: ['feedPosts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 60 * 1000, // 1 minute
  });

  const feed = useMemo(() => {
    const allPosts = data?.pages.flatMap(page => page.posts) || [];
    // Filter out not interested and hidden posts
    return allPosts.filter(post =>
      !notInterestedPosts.has(post.id) &&
      !hiddenPosts.has(post.id)
    );
  }, [data, notInterestedPosts, hiddenPosts]);

  // Track seen posts in localStorage
  useEffect(() => {
    if (feed.length === 0) return;
    try {
      const stored = localStorage.getItem('seenPosts');
      let seen = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
      feed.forEach(post => seen.add(post.id));
      // keep only last 200 to prevent unbounded growth
      if (seen.size > 200) {
        seen = new Set(Array.from(seen).slice(-200));
      }
      localStorage.setItem('seenPosts', JSON.stringify(Array.from(seen)));
    } catch (e) {
      console.error('Failed to save seen posts', e);
    }
  }, [feed]);

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    }, { rootMargin: '200px' });
    
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const likeMutation = useMutation({
    mutationFn: async ({ postId, hasLiked, postOwnerId, postTitle }: { postId: string, hasLiked: boolean, postOwnerId: string, postTitle: string }) => {
      if (!user) throw new Error("User not authenticated");
      if (hasLiked) {
        await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        // Send notification to post owner
        await sendLikeNotification(postId, postOwnerId, postTitle);
      }
      return { postId, hasLiked };
    },
    onMutate: async ({ postId, hasLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['feedPosts'] });
      const previousFeed = queryClient.getQueryData(['feedPosts']);
      queryClient.setQueryData(['feedPosts'], (oldData: any) => {
        const newData = { ...oldData };
        newData.pages = newData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((p: any) => {
            if (p.id === postId) {
              return { ...p, likes_count: p.likes_count + (hasLiked ? -1 : 1) };
            }
            return p;
          })
        }));
        return newData;
      });
      return { previousFeed };
    },
    onError: (err, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feedPosts'], context.previousFeed);
      }
      toast({ title: "Failed to update like", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userLikes', user?.id] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("User not authenticated");
      const hasBookmarked = bookmarkedPosts.has(postId);
      if (hasBookmarked) {
        await supabase.from('bookmarks').delete().match({ post_id: postId, user_id: user.id });
        toast({ title: "Removed from saved posts" });
      } else {
        await supabase.from('bookmarks').insert({ post_id: postId, user_id: user.id });
        toast({ title: "Added to saved posts" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookmarks', user?.id] });
    },
    onError: () => {
      toast({ title: "Failed to update bookmark", variant: "destructive" });
    },
  });

  // My Roadmaps (left sidebar)
  const { data: myRoadmaps = [], isLoading: isLoadingMyRoadmaps } = useQuery({
    queryKey: ['myRoadmaps', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('roadmaps')
        .select('id, title, progress, status')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // My External Community Links (left sidebar)
  const { links: myCommunityLinks, isLoading: isLoadingMyCommunityLinks, deleteLink } = useExternalCommunityLinks();

  // Trending topics (derive from recent posts' tags)
  const { data: trendingTopics = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingTopics'],
    queryFn: async () => {
      const computeTopics = (rows: any[]) => {
        const freq: Record<string, number> = {};
        (rows || []).forEach((row: any) => {
          const tags: string[] = row.tags || [];
          tags.forEach(t => { if (!t) return; freq[t] = (freq[t] || 0) + 1; });
        });
        return Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([tag]) => tag);
      };

      // Try last 30 days
      const tryWindow = async (days: number) => {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const { data, error } = await supabase
          .from('posts')
          .select('tags')
          .gte('created_at', since.toISOString())
          .limit(500);
        if (error) throw error;
        return computeTopics(data || []);
      };

      let topics = await tryWindow(30);
      if (!topics || topics.length === 0) {
        topics = await tryWindow(90);
      }

      // Final static fallback if still empty
      if (!topics || topics.length === 0) {
        return ['javascript', 'react', 'webdev', 'ai', 'python', 'devops'];
      }

      return topics;
    },
  });

  // New videos (right sidebar) - Top 4 by views from NewVideos page
  const topVideos = useMemo(() => getTopVideosByViews(3), []);

  // NEWS_BOT_USER_ID for high-visibility bot posts
  const NEWS_BOT_USER_ID = "3ddf7a50-1d20-4f8f-90f1-2e923be1820e";

  // Merge recommendation scores into the feed and sort by customized scoring algorithm
  const displayFeed = useMemo(() => {
    const recommendedPostIds = new Map<string, number>();
    if (personalizedData?.posts) {
      personalizedData.posts.forEach(p => {
        recommendedPostIds.set(p.id, p.score || 0);
      });
    }

    const userSkills = new Set(
      (personalizedData?.userProfile?.skills || []).map(s => String(s).toLowerCase())
    );
    const userGoals = (personalizedData?.userProfile?.learningGoals || "").toLowerCase();

    // Simple hash function for deterministic shuffle
    const hashStr = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const scoredPosts = feed.map(post => {
      let score = recommendedPostIds.get(post.id) || 0;
      
      // Mutual Friend / Following Boost
      if (followingIds.has(post.user_id)) {
        score += 30; // High boost for mutual friend / following
      }
      
      // Domain / Tag match boost
      if (post.tags) {
        const hasTech = post.tags.some(t => t.toLowerCase() === 'tech');
        if (hasTech) score += 5;
        
        const hasNews = post.tags.some(t => ['news', 'announcement'].includes(t.toLowerCase()));
        if (hasNews) score += 10;
        
        const hasMatch = post.tags.some(t => userSkills.has(t.toLowerCase()) || userGoals.includes(t.toLowerCase()));
        if (hasMatch) score += 15;
      }
      
      // Shuffle value
      const shuffleVal = (hashStr(post.id) + sessionSeed) % 15;
      score += shuffleVal;
      
      // Seen penalty
      if (initialSeenPosts.has(post.id)) {
        score -= 200; // Drastically reduce score for seen posts to put them at bottom
      }

      return {
        ...post,
        score
      };
    });

    // Sort by computed score descending
    return scoredPosts.sort((a, b) => b.score - a.score);
  }, [personalizedData, feed, followingIds, initialSeenPosts, sessionSeed]);
  return (
    <Layout>
      <PageSEO
        title="Your Learning Feed"
        description="A personalized learning feed with posts, roadmaps, trending topics, and curated videos tailored to your interests on Skill-Metrics."
        path="/home"
      />
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="sr-only">Your Learning Feed</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 self-start">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-base">My Roadmaps</h2>
                <div className="space-y-2">
                  {isLoadingMyRoadmaps ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : myRoadmaps.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No roadmaps yet</div>
                  ) : (
                    myRoadmaps.map((r: any) => (
                      <Link key={r.id} to={`/roadmaps/${r.id}`} className="flex items-center justify-between text-sm hover:text-primary">
                        <span>{r.title}</span>
                        <Badge variant="secondary">{r.progress || 0}%</Badge>
                      </Link>
                    ))
                  )}
                </div>
                <Link to="/create-roadmap">
                  <Button className="w-full mt-4" size="sm"><Plus className="h-4 w-4 mr-2" />Create Roadmap</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-base">My Communities</h2>
                <div className="space-y-2">
                  {isLoadingMyCommunityLinks ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : myCommunityLinks.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No community links added yet</div>
                  ) : (
                    myCommunityLinks.slice(0, 5).map((c: any) => (
                      <div key={c.id} className="flex items-center gap-2 group">
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary flex-1 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0"><AvatarFallback>{(c.name || 'C')[0]}</AvatarFallback></Avatar>
                          <span className="truncate">{c.name}</span>
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={() => deleteLink.mutate(c.id)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4">
                  <AddCommunityLinkDialog />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Feed - Full width on mobile, centered on desktop */}
          <main className="w-full lg:col-span-6 px-0">

            {(isLoadingPosts || (isLoadingPersonalized && (!displayFeed || displayFeed.length === 0))) ? (
              <div className="flex flex-col space-y-6 py-4">
                {/* Instagram-style Skeleton Loaders */}
                {[1, 2, 3].map((skeleton) => (
                  <Card key={skeleton} className="overflow-hidden border-border/40 animate-pulse">
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted/70 rounded"></div>
                      </div>
                    </div>
                    <div className="w-full h-80 bg-muted/60"></div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-muted rounded-full"></div>
                        <div className="w-6 h-6 bg-muted rounded-full"></div>
                        <div className="w-6 h-6 bg-muted rounded-full"></div>
                      </div>
                      <div className="h-4 w-1/4 bg-muted rounded"></div>
                      <div className="h-3 w-full bg-muted/70 rounded"></div>
                      <div className="h-3 w-2/3 bg-muted/70 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : displayFeed.length === 0 ? (
              <Card className="py-16 px-4 text-center border-dashed">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share your knowledge and inspire others!</p>
                  <Link to="/create-post">
                    <Button size="lg" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <>
                {displayFeed.map((post: any, index: number) => {
                  const isLast = index === displayFeed.length - 1;
                  return (
                    <div 
                      key={post.id} 
                      className="relative"
                      ref={isLast ? lastPostElementRef : null}
                    >
                      <InstagramPost
                        post={post}
                        isLiked={likedPosts.has(post.id)}
                        isBookmarked={bookmarkedPosts.has(post.id)}
                        isRecommended={post.score && post.score > 70}
                        onLike={() => likeMutation.mutate({ postId: post.id, hasLiked: likedPosts.has(post.id), postOwnerId: post.user_id, postTitle: post.title })}
                        onBookmark={() => bookmarkMutation.mutate(post.id)}
                        onComment={() => setCommentDialogOpen({ open: true, postId: post.id })}
                        onShare={() => setShareDialogOpen({ open: true, post })}
                        onHide={() => setHiddenPosts(prev => new Set(prev).add(post.id))}
                      />
                    </div>
                  );
                })}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-6 px-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 self-start">


            {/* Recommended Roadmaps */}
            {personalizedData && personalizedData.roadmaps.length > 0 && (
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-base">Recommended for You</h2>
                  </div>
                  <div className="space-y-3">
                    {personalizedData.roadmaps.slice(0, 3).map((roadmap) => (
                      <Link
                        key={roadmap.id}
                        to={`/roadmaps/${roadmap.id}`}
                        className="block p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm line-clamp-1">{roadmap.title}</h4>
                          <Badge variant="secondary" className="text-xs">{roadmap.score}%</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {roadmap.description}
                        </p>
                        {roadmap.recommendation_reason && (
                          <p className="text-xs text-primary italic">
                            💡 {roadmap.recommendation_reason}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-base">Trending Topics</h2>
                <div className="space-y-2">
                  {isLoadingTrending ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : trendingTopics.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No trending topics</div>
                  ) : (
                    trendingTopics.map((t: string) => (
                      <Link key={t} to={`/explore?q=${encodeURIComponent(t)}`} className="flex items-center gap-2 text-sm hover:text-primary"><TrendingUp className="h-4 w-4" /> {t}</Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-base">New Videos</h2>
                <div className="space-y-3">
                  {topVideos.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No videos found</div>
                  ) : (
                    topVideos.map((video: any) => (
                      <a key={video.id} href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                        <div className="relative flex-shrink-0">
                          <img src={video.thumbnail || '/placeholder.svg'} alt={video.title} className="w-24 h-14 rounded-md object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-snug group-hover:text-primary line-clamp-2">{video.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{video.channel || 'Channel'}</p>
                          <p className="text-xs text-muted-foreground"><Eye className="h-3 w-3 inline mr-1" />{video.views}</p>
                        </div>
                      </a>
                    ))
                  )}
                </div>
                <Link to="/new-videos">
                  <Button variant="outline" size="sm" className="w-full mt-4">View All Videos</Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      {commentDialogOpen.open && commentDialogOpen.postId && (
        <CommentDialog
          isOpen={commentDialogOpen.open}
          onClose={() => setCommentDialogOpen({ open: false, postId: null })}
          postId={commentDialogOpen.postId}
        />
      )}
      {shareDialogOpen.open && shareDialogOpen.post && (
        <ShareDialog
          open={shareDialogOpen.open}
          onOpenChange={(open) => setShareDialogOpen({ open, post: open ? shareDialogOpen.post : null })}
          title={shareDialogOpen.post.title}
          url={`${window.location.origin}/posts/${shareDialogOpen.post.id}`}
        />
      )}
    </Layout>
  );
};

export default Home;