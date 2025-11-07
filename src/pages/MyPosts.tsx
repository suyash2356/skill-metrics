import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Trash2, Loader2, Image as ImageIcon, Video, FileText, Newspaper, Edit3 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Post = Database['public']['Tables']['posts']['Row'];

const MyPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "", tags: [] as string[] });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['myPosts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    enabled: !!user,
  });

  const updatePostMutation = useMutation({
    mutationFn: async (post: { id: string; title: string; content: string; category: string; tags: string[] }) => {
      const { error } = await supabase
        .from('posts')
        .update({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
        })
        .eq('id', post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPosts', user?.id] });
      toast({ title: 'Post updated' });
      setEditingPost(null);
    },
    onError: () => {
      toast({ title: 'Failed to update post', variant: 'destructive' });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPosts', user?.id] });
      toast({ title: 'Post deleted' });
      setSelectedPost(null);
    },
    onError: () => {
      toast({ title: 'Failed to delete post', variant: 'destructive' });
    }
  });

  const getMediaInfo = (content: string | null) => {
    if (!content) return { type: 'text', url: null };
    
    // Check for video
    const videoRegex = /(https?:\/\/[^\s]+\.(mp4|webm|ogg))/gi;
    const videoMatch = content.match(videoRegex);
    if (videoMatch) return { type: 'video', url: videoMatch[0] };
    
    // Check for base64 image
    const base64Regex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/;
    const base64Match = content.match(base64Regex);
    if (base64Match) return { type: 'image', url: base64Match[1] };
    
    // Check for image URL
    const imgRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/;
    const imgMatch = content.match(imgRegex);
    if (imgMatch) return { type: 'image', url: imgMatch[1] };
    
    // Check if starts with data:image
    if (content.startsWith('data:image')) return { type: 'image', url: content };
    
    return { type: 'text', url: null };
  };

  const categorizePost = (post: Post) => {
    const media = getMediaInfo(post.content);
    const category = post.category?.toLowerCase() || '';
    
    if (media.type === 'image') return 'image';
    if (media.type === 'video') return 'video';
    if (category.includes('news') || category.includes('article')) return 'news';
    if (category.includes('resource') || category.includes('tutorial') || category.includes('guide')) return 'resources';
    
    return 'text';
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => categorizePost(post) === selectedCategory);
  }, [posts, selectedCategory]);

  const parseMedia = (content: string | null) => {
    if (!content) return { text: "", media: [] };

    const media: Array<{ type: "image" | "video"; url: string }> = [];
    let text = content;

    // Extract base64 images
    const base64Regex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/g;
    const base64Matches = content.matchAll(base64Regex);
    for (const match of base64Matches) {
      media.push({ type: "image", url: match[1] });
      text = text.replace(match[0], "");
    }

    // Extract regular image URLs
    const imgRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/g;
    const imgMatches = content.matchAll(imgRegex);
    for (const match of imgMatches) {
      media.push({ type: "image", url: match[1] });
      text = text.replace(match[0], "");
    }

    // Extract video URLs
    const videoRegex = /(https?:\/\/[^\s]+\.(mp4|webm|ogg))/gi;
    const videoMatches = content.matchAll(videoRegex);
    for (const match of videoMatches) {
      media.push({ type: "video", url: match[0] });
      text = text.replace(match[0], "");
    }

    return { text: text.trim(), media };
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      content: post.content || "",
      category: post.category || "",
      tags: post.tags || [],
    });
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    updatePostMutation.mutate({
      id: editingPost.id,
      ...editForm,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Posts</h1>
          <Link to="/create-post">
            <Button>Create Post</Button>
          </Link>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <h3 className="text-lg font-semibold">No posts yet</h3>
                <p>Start creating posts to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {filteredPosts.map((post) => {
                  const media = getMediaInfo(post.content);
                  return (
                    <div
                      key={post.id}
                      className="relative group cursor-pointer aspect-square overflow-hidden bg-muted"
                      onClick={() => setSelectedPost(post)}
                    >
                      {media.url ? (
                        media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Video className="h-12 w-12 text-white" />
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                          <p className="text-sm font-medium text-center line-clamp-4">
                            {post.title}
                          </p>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this post?')) {
                              deletePostMutation.mutate(post.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Post Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                
                {(() => {
                  const { media, text } = parseMedia(selectedPost.content);
                  return (
                    <>
                      {media.length > 0 && (
                        <div className="space-y-4">
                          {media.map((item, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden bg-black">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={`Media ${idx + 1}`}
                                  className="w-full h-auto object-contain"
                                />
                              ) : (
                                <video
                                  src={item.url}
                                  controls
                                  className="w-full h-auto"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {text && (
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap">{text}</p>
                        </div>
                      )}
                      
                      {selectedPost.tags && selectedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.tags.map((tag, idx) => (
                            <span key={idx} className="text-sm text-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  placeholder="e.g., Tutorial, News, Resource"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Post content"
                  rows={10}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                <Input
                  value={editForm.tags.join(', ')}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="e.g., javascript, react, tutorial"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={updatePostMutation.isPending}>
                  {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MyPosts;
