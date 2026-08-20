import { VideoData } from "@/lib/videosData";

export type CustomVideo = VideoData & {
  isCustom: true;
  externalUrl: string;
  goalId?: string;
  addedAt: number;
};

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i.test(url);
}

export function isValidVideoLink(url: string): boolean {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    new URL(trimmed);
  } catch {
    return false;
  }
  return !!extractYouTubeId(trimmed) || isDirectVideoUrl(trimmed) || /vimeo\.com|dailymotion\.com|drive\.google\.com/i.test(trimmed);
}

export function describeLinkError(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return "Paste a video link first";
  if (!/^https?:\/\//i.test(trimmed)) return "Link must start with http:// or https://";
  if (!isValidVideoLink(trimmed))
    return "Unsupported link. Use a YouTube, Vimeo, Dailymotion, Google Drive or direct video file URL.";
  return null;
}

export function normalizeMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External";
  }
}

export function buildCustomVideo(input: {
  url: string;
  title?: string;
  category: string;
  durationMinutes?: number;
  goalId?: string;
}): CustomVideo {
  const url = input.url.trim();
  const ytId = extractYouTubeId(url);
  const minutes = input.durationMinutes && input.durationMinutes > 0 ? input.durationMinutes : 20;

  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title?.trim() || (ytId ? `YouTube video ${ytId}` : `Video from ${hostLabel(url)}`),
    youtubeId: ytId || "",
    thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "",
    duration: normalizeMinutes(minutes),
    category: input.category,
    channel: ytId ? "YouTube" : hostLabel(url),
    channel_avatar: "",
    views: "Added by you",
    upload_time: "Custom",
    isCustom: true,
    externalUrl: url,
    goalId: input.goalId,
    addedAt: Date.now(),
  };
}
