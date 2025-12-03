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
import { Plus, TrendingUp, Users, Play, Eye, Sparkles, Zap } from "lucide-react";
import { AddCommunityLinkDialog } from "@/components/AddCommunityLinkDialog";
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

    // First get posts (exclude community posts)
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .is("community_id", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error("Failed to load posts: " + error.message);
    if (!postsData || postsData.length === 0) {
      return { posts: [], nextPage: undefined };
    }

    // Get unique user IDs
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    
    // Fetch profiles separately
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name, title, avatar_url")
      .in("user_id", userIds);

    // Create a map of profiles
    const profilesMap = (profilesData || []).reduce((acc, profile) => {
      acc[profile.user_id] = profile;
      return acc;
    }, {} as Record<string, any>);
    
    const posts: PostWithProfile[] = postsData.map((post: any) => ({
      ...post,
      profiles: profilesMap[post.user_id] ? {
        full_name: profilesMap[post.user_id].full_name,
        title: profilesMap[post.user_id].title,
        avatar_url: profilesMap[post.user_id].avatar_url,
      } : { full_name: 'Anonymous', title: 'User', avatar_url: null },
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
  const { data: myCommunityLinks = [], isLoading: isLoadingMyCommunityLinks } = useQuery({
    queryKey: ['externalCommunityLinks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('external_community_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

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
  const topVideos = useMemo(() => getTopVideosByViews(4), []);

  // Show personalized feed if available, otherwise show default feed
  const displayFeed = useMemo(() => {
    if (personalizedData && personalizedData.posts.length > 0) {
      return personalizedData.posts;
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
                    myCommunityLinks.map((c: any) => (
                      <a key={c.id} href={c.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary">
                        <Avatar className="h-8 w-8"><AvatarFallback>{(c.name || 'C')[0]}</AvatarFallback></Avatar>
                        <span className="truncate">{c.name}</span>
                      </a>
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
            {/* AI Personalization Banner */}
            {personalizedData && personalizedData.posts.length > 0 && (
              <Alert className="mb-6 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <AlertDescription className="text-sm">
                    <span className="font-semibold text-primary block mb-1">✨ AI-Personalized Feed</span>
                    <span className="text-muted-foreground">
                      Content tailored for: <span className="text-foreground font-medium">{personalizedData.userProfile.skills.slice(0, 3).map((s: any) => s.name || s).join(", ")}</span> • <span className="text-foreground font-medium">{personalizedData.userProfile.experienceLevel}</span>
                    </span>
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {isLoadingPosts || isLoadingPersonalized ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">
                  {isLoadingPersonalized ? "🤖 Personalizing your feed with AI..." : "Loading feed..."}
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
                    {post.score && post.score > 70 && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        <Zap className="h-3 w-3" />
                        Recommended
                      </div>
                    )}
                    <InstagramPost
                      post={post}
                      isLiked={likedPosts.has(post.id)}
                      isBookmarked={bookmarkedPosts.has(post.id)}
                      onLike={() => likeMutation.mutate({ postId: post.id, hasLiked: likedPosts.has(post.id), postOwnerId: post.user_id, postTitle: post.title })}
                      onBookmark={() => bookmarkMutation.mutate(post.id)}
                      onComment={() => setCommentDialogOpen({ open: true, postId: post.id })}
                      onShare={() => setShareDialogOpen({ open: true, post })}
                      onHide={() => setHiddenPosts(prev => new Set(prev).add(post.id))}
                    />
                    {post.recommendation_reason && post.score > 60 && (
                      <div className="px-4 pb-3 text-xs text-muted-foreground italic">
                        💡 {post.recommendation_reason}
                      </div>
                    )}
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
                <div className="space-y-4">
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