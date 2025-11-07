import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkX, Loader2, Image as ImageIcon, Video, FileText, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BookmarkedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  posts: {
    id: string;
    title: string;
    content: string | null;
    category: string | null;
    tags: string[] | null;
    created_at: string;
    user_id: string;
  } | null;
}

const SavedPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BookmarkedPost | null>(null);

  const { data: bookmarkedPosts = [], isLoading } = useQuery({
    queryKey: ['bookmarkedPosts', user?.id],
    queryFn: async (): Promise<BookmarkedPost[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          posts(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const removeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedPosts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['userBookmarks', user?.id] });
      toast({ title: "Removed from saved posts" });
    },
    onError: () => {
      toast({ title: "Failed to remove bookmark", variant: "destructive" });
    },
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

  const categorizePost = (post: BookmarkedPost) => {
    const media = getMediaInfo(post.posts?.content || null);
    const category = post.posts?.category?.toLowerCase() || '';
    
    if (media.type === 'image') return 'image';
    if (media.type === 'video') return 'video';
    if (category.includes('news') || category.includes('article')) return 'news';
    if (category.includes('resource') || category.includes('tutorial') || category.includes('guide')) return 'resources';
    
    return 'text';
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return bookmarkedPosts;
    return bookmarkedPosts.filter(post => categorizePost(post) === selectedCategory);
  }, [bookmarkedPosts, selectedCategory]);

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
        <h1 className="text-2xl font-bold mb-6">Saved Posts</h1>

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
                <h3 className="text-lg font-semibold">No saved posts yet</h3>
                <p>Start exploring and save posts to read later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {filteredPosts.map((bookmark) => {
                  const media = getMediaInfo(bookmark.posts?.content || null);
                  return (
                    <div
                      key={bookmark.id}
                      className="relative group cursor-pointer aspect-square overflow-hidden bg-muted"
                      onClick={() => setSelectedPost(bookmark)}
                    >
                      {media.url ? (
                        media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={bookmark.posts?.title || 'Post'}
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
                            {bookmark.posts?.title}
                          </p>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMutation.mutate(bookmark.post_id);
                        }}
                      >
                        <BookmarkX className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedPost?.posts && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedPost.posts.title}</h2>
                
                {(() => {
                  const { media, text } = parseMedia(selectedPost.posts.content);
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
                      
                      {selectedPost.posts.tags && selectedPost.posts.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.posts.tags.map((tag, idx) => (
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
      </div>
    </Layout>
  );
};

export default SavedPosts;
