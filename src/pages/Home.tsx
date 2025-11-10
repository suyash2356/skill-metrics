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
import { Plus, TrendingUp, Users, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const feed = useMemo(() => data?.pages.flatMap(page => page.posts) || [], [data]);

  const likeMutation = useMutation({
    mutationFn: async ({ postId, hasLiked }: { postId: string, hasLiked: boolean }) => {
      if (!user) throw new Error("User not authenticated");
      if (hasLiked) {
        await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
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

  // My Communities (left sidebar)
  const { data: myCommunities = [], isLoading: isLoadingMyCommunities } = useQuery({
    queryKey: ['myCommunities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('community_members')
        .select('communities(id, name, image)')
        .eq('user_id', user.id)
        .limit(5);
      if (error) throw error;
      // Be defensive: some selects return { communities: { ... } }, others may return the joined row directly
      return (data || []).map((m: any) => m.communities || m.community || m);
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

  // New videos (right sidebar)
  const { data: newVideos = [], isLoading: isLoadingNewVideos } = useQuery({
    queryKey: ['newVideos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, thumbnail, channel, channel_avatar, views, upload_time')
        .order('upload_time', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });


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
                  {isLoadingMyCommunities ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : myCommunities.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Not a member of any communities yet</div>
                  ) : (
                    myCommunities.map((c: any) => (
                      <Link key={c.id} to={`/communities/${c.id}/feed`} className="flex items-center gap-3 text-sm hover:text-primary">
                        <Avatar className="h-8 w-8"><AvatarImage src={c.image || c.avatar_url || '/placeholder.svg'} /><AvatarFallback>{(c.name || 'C')[0]}</AvatarFallback></Avatar>
                        <span>{c.name}</span>
                      </Link>
                    ))
                  )}
                </div>
                <Link to="/communities">
                  <Button variant="outline" className="w-full mt-4" size="sm"><Users className="h-4 w-4 mr-2" />Explore Communities</Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Main Feed - Full width on mobile, centered on desktop */}
          <main className="w-full lg:col-span-6 px-0">
            {isLoadingPosts ? (
              <div className="text-center text-muted-foreground py-8">Loading feed...</div>
            ) : feed.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
                <Link to="/create-post">
                  <Button>Create Your First Post</Button>
                </Link>
              </div>
            ) : (
              <>
                {feed.map((post) => (
                  <InstagramPost
                    key={post.id}
                    post={post}
                    isLiked={likedPosts.has(post.id)}
                    isBookmarked={bookmarkedPosts.has(post.id)}
                    onLike={() => likeMutation.mutate({ postId: post.id, hasLiked: likedPosts.has(post.id) })}
                    onBookmark={() => bookmarkMutation.mutate(post.id)}
                    onComment={() => setCommentDialogOpen({ open: true, postId: post.id })}
                    onShare={() => setShareDialogOpen({ open: true, post })}
                  />
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
                  {isLoadingNewVideos ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : newVideos.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No videos found</div>
                  ) : (
                    newVideos.map((video: any) => (
                      <Link key={video.id} to={`/videos/${video.id}`} className="flex items-start gap-3 group">
                        <div className="relative flex-shrink-0">
                          <img src={video.thumbnail || '/placeholder.svg'} alt={video.title} className="w-24 h-14 rounded-md object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-snug group-hover:text-primary line-clamp-2">{video.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{video.channel || 'Channel'}</p>
                        </div>
                      </Link>
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