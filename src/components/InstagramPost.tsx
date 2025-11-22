import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
  EyeOff,
  Flag,
  FileText,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReportPostDialog } from "./ReportPostDialog";

interface InstagramPostProps {
  post: {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    user_id: string;
    category: string | null;
    tags: string[] | null;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
      title: string | null;
    } | null;
    likes_count: number;
    comments_count: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
  onShare: () => void;
  onHide?: () => void;
  connectedAbove?: boolean;
  connectedBelow?: boolean;
}

export const InstagramPost = ({
  post,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onHide,
  connectedAbove = false,
  connectedBelow = false,
}: InstagramPostProps) => {
  const [imageError, setImageError] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const { toast } = useToast();

  // Parse media from content
  const parseMedia = (content: string | null) => {
    if (!content) return { text: "", media: [], attachments: [] };

    const media: Array<{ type: "image" | "video"; url: string }> = [];
    const attachments: Array<{ name: string; url: string; type: string }> = [];
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

    // ✅ Fixed regex: no double-escaping
    const videoRegex = /(https?:\/\/[^\s]+\.(mp4|webm|ogg))/gi;
    const videoMatches = content.matchAll(videoRegex);
    for (const match of videoMatches) {
      media.push({ type: "video", url: match[0] });
      text = text.replace(match[0], "");
    }

    // Extract file attachments
    const attachmentRegex = /\[Attachment: (.*?)\]\((.*?)\)/g;
    const attachmentMatches = content.matchAll(attachmentRegex);
    for (const match of attachmentMatches) {
      const name = match[1];
      const url = match[2];
      const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
      attachments.push({ name, url, type: ext });
      text = text.replace(match[0], "");
    }

    return { text: text.trim(), media, attachments };
  };

  const { text, media, attachments } = parseMedia(post.content);
  // track media natural size to set aspect ratio
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number } | null>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setMediaSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  }, []);

  const onVideoMeta = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const v = e.currentTarget;
    if ((v as any).videoWidth && (v as any).videoHeight) {
      setMediaSize({ width: (v as any).videoWidth, height: (v as any).videoHeight });
    }
  }, []);
  const displayName = post.profiles?.full_name || "Anonymous";
  const userTitle = post.profiles?.title || "";
  const avatarUrl = post.profiles?.avatar_url;

  const handleInterested = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("post_preferences")
        .upsert(
          {
            user_id: user.id,
            post_id: post.id,
            preference_type: "interested",
          },
          { onConflict: "user_id,post_id" }
        );

      if (error) throw error;

      // Also save the post
      await onBookmark();

      toast({
        title: "Marked as interested",
        description: "We'll show you more posts like this.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to mark as interested",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNotInterested = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("post_preferences")
        .upsert(
          {
            user_id: user.id,
            post_id: post.id,
            preference_type: "not_interested",
          },
          { onConflict: "user_id,post_id" }
        );

      if (error) throw error;

      toast({
        title: "Marked as not interested",
        description: "We'll show you fewer posts like this.",
      });

      // Hide the post from feed
      if (onHide) {
        setTimeout(() => onHide(), 500);
      }
    } catch (error: any) {
      toast({
        title: "Failed to mark as not interested",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      {/* Connector visuals */}
      {(connectedAbove || connectedBelow) && (
        <div className="absolute left-4 top-0 bottom-0 w-0 flex items-center" aria-hidden>
          <div className="w-px bg-slate-200 h-full" />
        </div>
      )}
      <Card className="w-full max-w-[470px] mx-auto border-0 sm:border shadow-none sm:shadow-sm bg-card mb-4 sm:mb-6 rounded-none sm:rounded-lg">
        {/* small pointed square to visually connect to the line */}
        {(connectedAbove || connectedBelow) && (
          <div className="absolute left-2 top-3 w-3 h-3 bg-slate-200 rotate-45 transform" style={{ zIndex: 10 }} />
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <Link
            to={`/profile/${post.user_id}`}
            className="flex items-center gap-3 flex-1"
          >
            <Avatar className="h-9 w-9 ring-2 ring-background">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              {userTitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {userTitle}
                </p>
              )}
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover backdrop-blur-sm z-50">
              <DropdownMenuItem onClick={onBookmark} className="cursor-pointer">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>{isBookmarked ? "Unsave" : "Save Post"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleInterested} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>Interested</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer">
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Not Interested</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => setReportDialogOpen(true)}
              >
                <Flag className="mr-2 h-4 w-4" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Media */}
        {media.length > 0 && (
          <div
            className="relative bg-black w-full overflow-hidden"
            style={mediaSize ? { aspectRatio: `${mediaSize.width} / ${mediaSize.height}` } : {}}
          >
            {media[0].type === "image" ? (
              <img
                src={media[0].url}
                alt="Post content"
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
                onLoad={onImageLoad}
              />
            ) : (
              <video
                src={media[0].url}
                controls
                className="w-full h-full object-contain"
                onLoadedMetadata={onVideoMeta}
              />
            )}
            {media.length > 1 && (
              <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                1/{media.length}
              </div>
            )}
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="px-3 pb-2 space-y-2 mt-3">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => window.open(file.url, '_blank')}
              >
                <div className="h-10 w-10 rounded bg-background flex items-center justify-center shadow-sm border">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file.type} • Click to view
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="px-3 pt-2 pb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                onClick={onLike}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:scale-110"
                    }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                onClick={onComment}
              >
                <MessageCircle className="h-5 w-5 hover:scale-110 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                onClick={onShare}
              >
                <Share2 className="h-5 w-5 hover:scale-110 transition-transform" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 transition-colors"
              onClick={onBookmark}
            >
              <Bookmark
                className={`h-5 w-5 transition-all ${isBookmarked ? "fill-current text-primary scale-110" : "hover:scale-110"
                  }`}
              />
            </Button>
          </div>

          {/* Likes and Comments Count */}
          <div className="space-y-0.5">
            {post.likes_count > 0 && (
              <div className="font-semibold text-sm">
                {post.likes_count.toLocaleString()} {post.likes_count === 1 ? 'like' : 'likes'}
              </div>
            )}
            {post.comments_count > 0 && (
              <button
                onClick={onComment}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="text-sm">
            <p className="line-clamp-2">
              <span className="font-semibold">{post.title}</span>
              {text && <span className="text-muted-foreground ml-1">{text}</span>}
            </p>
            {post.tags && post.tags.length > 0 && (
              <p className="text-primary text-xs mt-1">
                {post.tags.map((tag) => `#${tag}`).join(" ")}
              </p>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </Card>
      <ReportPostDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        postId={post.id}
      />
    </div>
  );
};
