import { useState, useCallback, useRef, useEffect } from "react";
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
  Star,
  ChevronLeft,
  ChevronRight,
  File,
  FileImage,
  FileSpreadsheet,
  Presentation,
  Play,
  Pause,
  Volume2,
  VolumeX,
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
import { useVideoMute } from "@/context/VideoMuteContext";

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
  isRecommended?: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
  onShare: () => void;
  onHide?: () => void;
  connectedAbove?: boolean;
  connectedBelow?: boolean;
}

import { SharePostDialog } from "./SharePostDialog";

export const InstagramPost = ({
  post,
  isLiked,
  isBookmarked,
  isRecommended = false,
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { isMuted, setIsMuted } = useVideoMute();
  const [playCount, setPlayCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Parse media from content
  const parseMedia = (content: string | null) => {
    if (!content) return { text: "", media: [], attachments: [] };

    const media: Array<{ type: "image" | "video" | "youtube"; url: string }> = [];
    const attachments: Array<{ name: string; url: string; type: string }> = [];
    let text = content;

    // Try parsing as JSON block format first
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.type === 'post' && Array.isArray(parsed.blocks)) {
        let extractedText = '';
        for (const block of parsed.blocks) {
          if (block.type === 'paragraph' && block.content) {
            extractedText += block.content + '\n\n';
          } else if (block.type === 'image' && block.imageUrl) {
            media.push({ type: 'image', url: block.imageUrl });
          } else if (block.type === 'video' && block.videoUrl) {
            // Check if it's a direct video file or a YouTube/external link
            const videoUrl = block.videoUrl;
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
              media.push({ type: 'youtube', url: videoUrl });
            } else {
              media.push({ type: 'video', url: videoUrl });
            }
          } else if (block.type === 'document' && block.documentUrl) {
            const name = block.documentName || 'Document';
            const ext = name.split('.').pop()?.toLowerCase() || 'file';
            attachments.push({ name, url: block.documentUrl, type: ext });
          }
        }
        return { text: extractedText.trim(), media, attachments };
      }
    } catch {
      // Not JSON, continue with markdown parsing
    }

    // Extract base64 images
    const base64Regex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/g;
    const base64Matches = content.matchAll(base64Regex);
    for (const match of base64Matches) {
      media.push({ type: "image", url: match[1] });
      text = text.replace(match[0], "");
    }

    // Extract image URLs (including relative paths and full URLs)
    // Updated regex to also match Supabase storage URLs without extensions
    const imgRegex = /!\[.*?\]\(((?:https?:\/\/[^\s)]+(?:\.(?:jpg|jpeg|png|gif|webp|svg))?|\/[^)]+\.(?:jpg|jpeg|png|gif|webp|svg)))\)/gi;
    const imgMatches = content.matchAll(imgRegex);
    for (const match of imgMatches) {
      media.push({ type: "image", url: match[1] });
      text = text.replace(match[0], "");
    }

    // ✅ Fixed regex: no double-escaping
    // Also match video tags embedded in content
    const videoRegex = /(https?:\/\/[^\s<>"]+\.(?:mp4|webm|ogg))/gi;
    const videoMatches = content.matchAll(videoRegex);
    for (const match of videoMatches) {
      media.push({ type: "video", url: match[0] });
      text = text.replace(match[0], "");
    }

    // Check for YouTube links in regular text if not already found in blocks
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;
    const youtubeMatches = Array.from(content.matchAll(youtubeRegex));

    // Only add if we haven't already extracted it (avoid duplicates if using JSON blocks)
    // We only process if no blocks were found or if mixed content. 
    // Simply simplify: if we see a YouTube link in text that wasn't removed, let's treat it as media
    for (const match of youtubeMatches) {
      // Avoid duplicating if it was already part of a block which removed it from 'text'
      // But 'text' here is being cleaned sequentially.
      // We'll just add it to media and remove from text to be safe
      media.push({ type: 'youtube', url: match[0] });
      text = text.replace(match[0], "");
    }


    // Also extract video from <video> tags
    const videoTagRegex = /<video[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const videoTagMatches = content.matchAll(videoTagRegex);
    for (const match of videoTagMatches) {
      media.push({ type: "video", url: match[1] });
      text = text.replace(match[0], "");
    }

    // Extract file attachments
    const attachmentRegex = /\[Attachment: (.*?)\]\((.*?)\)/g;
    const attachmentMatches = content.matchAll(attachmentRegex);
    for (const match of attachmentMatches) {
      const name = match[1];
      const url = match[2];
      const ext = name.split('.').pop()?.toLowerCase() || 'file';
      attachments.push({ name, url, type: ext });
      text = text.replace(match[0], "");
    }

    // Clean up extra newlines and whitespace
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return { text, media, attachments };
  };

  // Get file icon based on extension
  const getFileIcon = (type: string) => {
    const ext = type.toLowerCase();
    if (['pdf'].includes(ext)) return <FileText className="h-6 w-6 text-red-500" />;
    if (['doc', 'docx'].includes(ext)) return <FileText className="h-6 w-6 text-blue-500" />;
    if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    if (['ppt', 'pptx'].includes(ext)) return <Presentation className="h-6 w-6 text-orange-500" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return <FileImage className="h-6 w-6 text-purple-500" />;
    return <File className="h-6 w-6 text-muted-foreground" />;
  };

  // Navigate carousel
  const nextMedia = () => {
    if (media.length > 1) {
      setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    }
  };

  const prevMedia = () => {
    if (media.length > 1) {
      setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    }
  };

  const { text, media, attachments } = parseMedia(post.content);
  const isTextOnlyPost = media.length === 0 && attachments.length === 0;
  const hasLongText = text.length > 200;
  const MAX_REPLAYS = 2;

  // track media natural size to set aspect ratio
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number } | null>(null);

  // Video autoplay with intersection observer - plays when visible, max 2 replays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      const newCount = playCount + 1;
      setPlayCount(newCount);
      if (newCount < MAX_REPLAYS) {
        video.play().catch(() => { });
      } else {
        setIsVideoPlaying(false);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [playCount]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && playCount < MAX_REPLAYS) {
            video.play().then(() => setIsVideoPlaying(true)).catch(() => { });
          } else {
            video.pause();
            setIsVideoPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [currentMediaIndex, playCount]);

  // Handle mouse hover for video play/pause
  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && playCount < MAX_REPLAYS) {
      video.play().then(() => setIsVideoPlaying(true)).catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (playCount >= MAX_REPLAYS) setPlayCount(0); // Reset count on manual play
      video.play().then(() => setIsVideoPlaying(true)).catch(() => { });
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
      <Card className={`w-full max-w-[470px] mx-auto border-0 sm:border shadow-none sm:shadow-sm bg-card mb-4 sm:mb-6 rounded-none sm:rounded-lg ${isTextOnlyPost ? 'min-h-[280px]' : ''}`}>
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
          <div className="flex items-center gap-1">
            {isRecommended && (
              <div className="bg-primary text-primary-foreground p-1.5 rounded-full" title="AI Recommended">
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
            )}
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
        </div>

        {/* Text-only post content area */}
        {isTextOnlyPost && text && (
          <div className="px-4 py-4 flex-1">
            <h3 className="font-semibold text-base mb-2">{post.title}</h3>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
              {hasLongText && !isExpanded ? (
                <>
                  {text.slice(0, 200)}...
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-primary font-medium ml-1 hover:underline"
                  >
                    Read more
                  </button>
                </>
              ) : (
                <>
                  {text}
                  {hasLongText && isExpanded && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-primary font-medium ml-1 hover:underline block mt-2"
                    >
                      Show less
                    </button>
                  )}
                </>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <p className="text-primary text-xs mt-3">
                {post.tags.map((tag) => `#${tag}`).join(" ")}
              </p>
            )}
          </div>
        )}

        {/* Media Carousel - LinkedIn/Instagram Style */}
        {media.length > 0 && (
          <div
            ref={containerRef}
            className="relative bg-muted/30 w-full overflow-hidden"

            onMouseEnter={media[currentMediaIndex].type === "video" ? handleMouseEnter : undefined}
            onMouseLeave={media[currentMediaIndex].type === "video" ? handleMouseLeave : undefined}
          >
            {/* Current Media */}
            {media[currentMediaIndex].type === "image" ? (
              <img
                src={media[currentMediaIndex].url}
                alt={`Post content ${currentMediaIndex + 1}`}
                className="w-full h-auto block"
                onError={() => setImageError(true)}
                onLoad={onImageLoad}
              />
            ) : media[currentMediaIndex].type === "youtube" ? (
              <div className="relative w-full aspect-video group">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${media[currentMediaIndex].url.match(/(?:v=|youtu\.be\/|\/)([a-zA-Z0-9_-]{11})/)?.[1]}?enablejsapi=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <video
                  ref={videoRef}
                  src={media[currentMediaIndex].url}
                  className="w-full h-auto block"
                  onLoadedMetadata={onVideoMeta}
                  muted={isMuted}
                  playsInline
                  loop={false}
                />

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
                  {/* Center Play/Pause Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={togglePlay}
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-7 w-7" />
                    ) : (
                      <Play className="h-7 w-7 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Replay indicator when max plays reached */}
                {playCount >= MAX_REPLAYS && !isVideoPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">Tap to replay</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Arrows - Only show if multiple media */}
            {media.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-md z-10"
                  onClick={prevMedia}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-md z-10"
                  onClick={nextMedia}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Media Counter */}
            {media.length > 1 && (
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium shadow z-10">
                {currentMediaIndex + 1}/{media.length}
              </div>
            )}

            {/* Dots Indicator */}
            {media.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {media.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === currentMediaIndex
                      ? 'w-4 bg-primary'
                      : 'w-1.5 bg-background/70 hover:bg-background'
                      }`}
                    onClick={() => setCurrentMediaIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attachments - LinkedIn Style Document Cards */}
        {attachments.length > 0 && (
          <div className="px-3 py-3 space-y-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-all cursor-pointer group"
                onClick={() => window.open(file.url, '_blank')}
              >
                <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center shadow-sm border">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {file.type.toUpperCase()} Document • Click to open
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.url, '_blank');
                  }}
                >
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
                onClick={() => setShareDialogOpen(true)}
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

          {/* Caption - LinkedIn style for posts with media */}
          {!isTextOnlyPost && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{post.title}</h3>
              {text && (
                <div className="text-sm text-foreground/80 leading-relaxed break-words">
                  {hasLongText && !isExpanded ? (
                    <>
                      <p className="whitespace-pre-wrap">{text.slice(0, 150)}...</p>
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="text-primary font-medium hover:underline mt-1"
                      >
                        see more
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{text}</p>
                      {hasLongText && (
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="text-primary font-medium hover:underline mt-1"
                        >
                          show less
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <p className="text-primary text-xs">
                  {post.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              )}
            </div>
          )}

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
      <SharePostDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        postId={post.id}
      />
    </div>
  );
};
