import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export const InstagramPost = ({
  post,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onComment,
  onShare,
}: InstagramPostProps) => {
  const [imageError, setImageError] = useState(false);

  // Parse media from content
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

    // ✅ Fixed regex: no double-escaping
    const videoRegex = /(https?:\/\/[^\s]+\.(mp4|webm|ogg))/gi;
    const videoMatches = content.matchAll(videoRegex);
    for (const match of videoMatches) {
      media.push({ type: "video", url: match[0] });
      text = text.replace(match[0], "");
    }

    return { text: text.trim(), media };
  };

  const { text, media } = parseMedia(post.content);
  const displayName = post.profiles?.full_name || "Anonymous";
  const userTitle = post.profiles?.title || "";
  const avatarUrl = post.profiles?.avatar_url;

  return (
    <Card className="w-full max-w-[470px] mx-auto border-0 sm:border shadow-none sm:shadow-sm bg-card mb-4 sm:mb-6 rounded-none sm:rounded-lg">
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Save</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>Interested</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EyeOff className="mr-2 h-4 w-4" />
              <span>Not Interested</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Flag className="mr-2 h-4 w-4" />
              <span>Report</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media */}
      {media.length > 0 && (
        <div className="relative bg-black aspect-square">
          {media[0].type === "image" ? (
            <img
              src={media[0].url}
              alt="Post content"
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <video
              src={media[0].url}
              controls
              className="w-full h-full object-contain"
            />
          )}
          {media.length > 1 && (
            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
              1/{media.length}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onLike}
            >
              <Heart
                className={`h-6 w-6 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onComment}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onShare}
            >
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onBookmark}
          >
            <Bookmark
              className={`h-6 w-6 ${isBookmarked ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm">
          {post.likes_count > 0 &&
            `${post.likes_count.toLocaleString()} likes`}
        </div>

        {/* Caption */}
        <div className="text-sm space-y-1">
          <p>
            <Link
              to={`/profile/${post.user_id}`}
              className="font-semibold mr-2"
            >
              {displayName}
            </Link>
            <span className="font-semibold">{post.title}</span>
          </p>
          {text && (
            <p className="text-muted-foreground whitespace-pre-wrap">{text}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <p className="text-primary">
              {post.tags.map((tag) => `#${tag}`).join(" ")}
            </p>
          )}
        </div>

        {/* Comments */}
        {post.comments_count > 0 && (
          <button
            onClick={onComment}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {post.comments_count} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground uppercase">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>
    </Card>
  );
};
