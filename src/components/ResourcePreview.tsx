import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Maximize2, Minimize2, FileText, Globe, Play } from "lucide-react";

interface ResourcePreviewProps {
  link?: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  resourceType?: string;
  title: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url);
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url);
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function isEmbeddableUrl(url: string): boolean {
  // Many sites block iframes; we'll try and show a fallback
  const blocked = /facebook\.com|twitter\.com|x\.com|instagram\.com/i;
  return !blocked.test(url);
}

export function ResourcePreview({ link, fileUrl, fileType, resourceType, title }: ResourcePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const url = fileUrl || link;
  if (!url) return null;

  // Determine content type
  const isFileVideo = fileType?.startsWith("video") || resourceType === "video" || isVideoUrl(url);
  const isFilePdf = fileType === "application/pdf" || resourceType === "pdf" || isPdfUrl(url);
  const isFileImage = fileType?.startsWith("image") || resourceType === "image" || isImageUrl(url);
  const isYT = isYouTubeUrl(url);
  const ytId = isYT ? extractYouTubeId(url) : null;

  const containerHeight = expanded ? "h-[85vh]" : "h-[50vh] sm:h-[60vh]";

  // YouTube embed
  if (isYT && ytId) {
    return (
      <div className="mb-6 space-y-2">
        <div className={`relative rounded-xl overflow-hidden bg-black ${containerHeight} transition-all`}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?rel=0`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <PreviewToolbar url={url} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      </div>
    );
  }

  // Video file
  if (isFileVideo) {
    return (
      <div className="mb-6 space-y-2">
        <div className={`relative rounded-xl overflow-hidden bg-black ${containerHeight} transition-all flex items-center justify-center`}>
          <video src={url} controls className="w-full h-full object-contain" />
        </div>
        <PreviewToolbar url={url} expanded={expanded} onToggle={() => setExpanded(!expanded)} canDownload />
      </div>
    );
  }

  // PDF
  if (isFilePdf) {
    return (
      <div className="mb-6 space-y-2">
        <div className={`relative rounded-xl overflow-hidden border bg-background ${containerHeight} transition-all`}>
          <iframe src={`${url}#toolbar=1`} className="w-full h-full" title={title} />
        </div>
        <PreviewToolbar url={url} expanded={expanded} onToggle={() => setExpanded(!expanded)} canDownload />
      </div>
    );
  }

  // Image
  if (isFileImage) {
    return (
      <div className="mb-6 space-y-2">
        <div className={`relative rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center ${containerHeight} transition-all`}>
          <img src={url} alt={title} className="max-w-full max-h-full object-contain" />
        </div>
        <PreviewToolbar url={url} expanded={expanded} onToggle={() => setExpanded(!expanded)} canDownload />
      </div>
    );
  }

  // Website link - try iframe embed
  if (link && isEmbeddableUrl(link) && !iframeError) {
    return (
      <div className="mb-6 space-y-2">
        <div className={`relative rounded-xl overflow-hidden border bg-background ${containerHeight} transition-all`}>
          <iframe
            src={link}
            className="w-full h-full"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onError={() => setIframeError(true)}
            onLoad={(e) => {
              // Some sites return X-Frame-Options errors silently
              try {
                const iframe = e.target as HTMLIFrameElement;
                // If we can't access contentDocument, it likely blocked
                if (iframe.contentDocument === null && iframe.contentWindow === null) {
                  setIframeError(true);
                }
              } catch {
                // Cross-origin - expected, iframe is working
              }
            }}
          />
        </div>
        <PreviewToolbar url={link} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      </div>
    );
  }

  // Fallback - link card
  if (link) {
    return (
      <div className="mb-6">
        <div className="rounded-xl border bg-muted/20 p-6 flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">This resource can't be previewed inline.</p>
          <Button asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function PreviewToolbar({
  url,
  expanded,
  onToggle,
  canDownload,
}: {
  url: string;
  expanded: boolean;
  onToggle: () => void;
  canDownload?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {expanded ? <Minimize2 className="h-4 w-4 mr-1" /> : <Maximize2 className="h-4 w-4 mr-1" />}
        {expanded ? "Collapse" : "Expand"}
      </Button>
      {canDownload && (
        <Button variant="ghost" size="sm" asChild>
          <a href={url} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-1" /> Download
          </a>
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-1" /> Open
        </a>
      </Button>
    </div>
  );
}
