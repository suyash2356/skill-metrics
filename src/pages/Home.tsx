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

  const { data: commentsData } = useQuery({
    queryKey: ['postComments', commentDialogOpen.postId],
    queryFn: async () => {
        if (!commentDialogOpen.postId) return [];
    const { data, error } = await supabase
      .from('comments')
      .select('*, profile:profiles!user_id(full_name, avatar_url)')
      .eq('post_id', commentDialogOpen.postId)
      .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },
    enabled: !!commentDialogOpen.postId,
  });

  const pageSize = 10;

  const fetchPosts = async ({ pageParam = 0 }) => {
    const from = pageParam * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(full_name, title, avatar_url)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error("Failed to load posts: " + error.message);
    
    const posts: PostWithProfile[] = (data || []).map((post: any) => ({
      ...post,
      profiles: post.profiles ? {
        full_name: post.profiles.full_name,
        title: post.profiles.title,
        avatar_url: post.profiles.avatar_url,
      } : { full_name: '', title: '', avatar_url: '' },
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


  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 container mx-auto px-4 py-6">
        <aside className="md:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">My Roadmaps</h3>
              <div className="space-y-3">
                <Link to="/my-roadmaps" className="flex items-center justify-between text-sm hover:text-primary">
                  <span>🚀 My Learning Paths</span>
                  <Badge variant="secondary">3</Badge>
                </Link>
                <Link to="/my-roadmaps" className="flex items-center justify-between text-sm hover:text-primary">
                  <span>💡 AI Generated</span>
                  <Badge variant="secondary">1</Badge>
                </Link>
              </div>
              <Link to="/create-roadmap">
                <Button className="w-full mt-4" size="sm"><Plus className="h-4 w-4 mr-2" />Create Roadmap</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">My Communities</h3>
              <div className="space-y-3">
                <Link to="/my-communities" className="flex items-center gap-3 text-sm hover:text-primary">
                  <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>R</AvatarFallback></Avatar>
                  <span>React Developers</span>
                </Link>
                <Link to="/my-communities" className="flex items-center gap-3 text-sm hover:text-primary">
                  <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>V</AvatarFallback></Avatar>
                  <span>Vite Enthusiasts</span>
                </Link>
              </div>
              <Link to="/communities">
                <Button variant="outline" className="w-full mt-4" size="sm"><Users className="h-4 w-4 mr-2" />Explore Communities</Button>
              </Link>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-6">
          <div className="mb-6 flex justify-end">
            <Link to="/create-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>

          {isLoadingPosts ? (
            <div className="text-center text-muted-foreground py-8">Loading feed...</div>
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
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => fetchNextPage()} 
                    disabled={isFetchingNextPage}
                    variant="outline"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <aside className="md:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <Link to="/explore?q=ai" className="flex items-center gap-2 text-sm hover:text-primary"><TrendingUp className="h-4 w-4" /> AI & Machine Learning</Link>
                <Link to="/explore?q=react19" className="flex items-center gap-2 text-sm hover:text-primary"><TrendingUp className="h-4 w-4" /> React 19 Features</Link>
                <Link to="/explore?q=serverless" className="flex items-center gap-2 text-sm hover:text-primary"><TrendingUp className="h-4 w-4" /> Serverless GPUs</Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">New Videos</h3>
              <div className="space-y-4">
                <Link to="/videos/1" className="flex items-start gap-3 group">
                  <div className="relative">
                    <img src="/placeholder.svg" alt="Video thumbnail" className="w-24 h-14 rounded-md object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-snug group-hover:text-primary">Full-stack Next.js 14 Tutorial</p>
                    <p className="text-xs text-muted-foreground mt-1">The Net Ninja</p>
                  </div>
                </Link>
              </div>
              <Link to="/new-videos">
                <Button variant="outline" size="sm" className="w-full mt-4">View All Videos</Button>
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
      {commentDialogOpen.open && commentDialogOpen.postId && (
        <CommentDialog
          isOpen={commentDialogOpen.open}
          onClose={() => setCommentDialogOpen({ open: false, postId: null })}
          roadmapId={commentDialogOpen.postId}
          comments={commentsData?.map(c => ({
            id: c.id,
            author: (c.profile as any)?.full_name || 'Anonymous',
            avatar: (c.profile as any)?.avatar_url,
            content: c.content,
            timestamp: new Date(c.created_at).toISOString(),
            likes: 0, // Placeholder
          })) || []}
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