import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InstagramPost } from "@/components/InstagramPost";

interface SharedPostPreviewProps {
    postId: string;
}

// Fully compatible type for InstagramPost
interface FullPost {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    user_id: string;
    category: string | null;
    tags: string[] | null;
    user_has_liked?: boolean;
    user_has_bookmarked?: boolean;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
        title: string | null;
    } | null;
    likes_count: number;
    comments_count: number;
}

export const SharedPostPreview = ({ postId }: SharedPostPreviewProps) => {
    const [post, setPost] = useState<FullPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // 1. Fetch Post details
                const { data: postData, error: postError } = await supabase
                    .from("posts")
                    .select("id, title, content, created_at, user_id, category, tags")
                    .eq("id", postId)
                    .single();

                if (postError) throw postError;

                // 2. Fetch Profile details
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("full_name, avatar_url")
                    .eq("user_id", postData.user_id)
                    .single();

                if (profileError) {
                    console.log("Could not fetch profile for shared post", profileError);
                }

                // 3. Fetch counts (optional, can be 0 for preview)
                // For now, simpler to default to 0 to avoid many requests, or do a quick count if needed.
                // Let's stick to 0 for specific counts unless critical.

                // 4. Check interaction status (liked/bookmarked)
                // We can skip this or fetch it. Let's assume false for the preview context to be fast.

                setPost({
                    ...postData,
                    profiles: profileData ? {
                        full_name: profileData.full_name,
                        avatar_url: profileData.avatar_url,
                        title: null
                    } : null,
                    likes_count: 0,
                    comments_count: 0
                });
            } catch (err) {
                console.error("Error fetching shared post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg min-w-[200px]">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Loading post...</span>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg min-w-[200px]">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive">Post unavailable</span>
            </div>
        );
    }

    // Extract thumbnail/video for the PREVIEW card
    const imgMatch = (post.content || "").match(/!\[.*?\]\((.*?)\)/);
    const videoMatch = (post.content || "").match(/<video[^>]+src=["']([^"']+)["']/);
    const youtubeMatch = (post.content || "").match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    const thumbnail = imgMatch?.[1];
    const hasVideo = !!videoMatch || !!youtubeMatch;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer block group w-full max-w-sm">
                    <div className="border rounded-lg overflow-hidden bg-background hover:border-primary/50 transition-colors shadow-sm">
                        {/* Header */}
                        <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
                            <img
                                src={post.profiles?.avatar_url || '/placeholder.svg'}
                                className="w-5 h-5 rounded-full object-cover"
                                alt=""
                            />
                            <span className="text-xs font-medium truncate">
                                {post.profiles?.full_name || 'Anonymous'}
                            </span>
                        </div>

                        {/* Content Preview */}
                        <div className="flex gap-2 p-2">
                            {thumbnail ? (
                                <div className="h-16 w-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                                    <img src={thumbnail} className="h-full w-full object-cover" alt="Post thumbnail" />
                                </div>
                            ) : hasVideo ? (
                                <div className="h-16 w-16 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                                    <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-sm font-medium line-clamp-1 mb-0.5">{post.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {post.content?.replace(/!\[.*?\]\(.*?\)/g, '') // remove images
                                        .replace(/<[^>]*>/g, '') // remove html tags
                                        .slice(0, 100) || 'Click to view post'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-none max-h-[90vh] overflow-y-auto">
                {/* Render the full post */}
                {/* Note: We pass dummy handlers for now as the goal is viewing */}
                <div className="p-0">
                    <InstagramPost
                        post={post}
                        isLiked={false}
                        isBookmarked={false}
                        onLike={() => { }}
                        onBookmark={() => { }}
                        onComment={() => { }}
                        onShare={() => { }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
