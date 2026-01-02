import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
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
  const [showAiPopup, setShowAiPopup] = useState(() => {
    // Show popup once per session
    const shown = sessionStorage.getItem('aiPopupShown');
    return !shown;
  });

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

  // Show personalized feed if available, otherwise show default feed
  const displayFeed = useMemo(() => {
    if (personalizedData && personalizedData.posts.length > 0) {
      // Add default values for counts if not present
      return personalizedData.posts.map(post => ({
        ...post,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        profiles: post.profiles || { full_name: 'Anonymous', avatar_url: null, title: null },
      }));
    }
    return feed;
  }, [personalizedData, feed]);


  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 self-start">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">My Roadmaps</h3>
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
                <h3 className="font-semibold mb-4">My Communities</h3>
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
            {/* AI Personalization Popup */}
            {showAiPopup && personalizedData && personalizedData.posts.length > 0 && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] animate-in fade-in slide-in-from-top-2 duration-300">
                <Alert className="border-primary/30 bg-card shadow-lg">
                  <button
                    onClick={() => {
                      setShowAiPopup(false);
                      sessionStorage.setItem('aiPopupShown', 'true');
                    }}
                    className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3 pr-6">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <AlertDescription className="text-sm">
                      <span className="font-semibold text-primary block mb-1">AI-Personalized Feed Active</span>
                      <span className="text-muted-foreground text-xs">
                        Content tailored for your skills & goals
                      </span>
                    </AlertDescription>
                  </div>
                </Alert>
              </div>
            )}

            {isLoadingPersonalized && !personalizedData && (
              <div className="flex items-center justify-center p-2 mb-4 bg-muted/30 rounded-lg animate-pulse">
                <Sparkles className="h-4 w-4 text-primary mr-2 animate-spin" />
                <span className="text-xs text-muted-foreground">Personalizing your experience...</span>
              </div>
            )}

            {isLoadingPosts && (!displayFeed || displayFeed.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">
                  Loading feed...
                </p>
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
                {displayFeed.map((post: any) => (
                  <div key={post.id} className="relative">
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
                ))}
                {hasNextPage && (
                  <div className="flex justify-center py-6 px-4">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      className="w-full max-w-md"
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
                    </Button>
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
                    <h3 className="font-semibold">Recommended for You</h3>
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
                <h3 className="font-semibold mb-4">Trending Topics</h3>
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
                <h3 className="font-semibold mb-4">New Videos</h3>
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