// Shared video data for NewVideos page and Home page top videos section

export type VideoData = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  category: string;
  channel: string;
  channel_avatar: string;
  views: string;
  upload_time: string;
};

export const videos: VideoData[] = [
  {
    id: "2",
    title: "Python Full Course for Beginners",
    youtubeId: "rfscVS0vtbw",
    thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg",
    duration: "4h 26m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "45M views",
    upload_time: "5 years ago",
  },
  {
    id: "3",
    title: "JavaScript Full Course (2024)",
    youtubeId: "PkZNo7MFNFg",
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg",
    duration: "3h 26m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "36M views",
    upload_time: "6 years ago",
  },
  {
    id: "20",
    title: "What If The Universe is a Simulation",
    youtubeId: "tlTKTTt47WE",
    thumbnail: "https://img.youtube.com/vi/tlTKTTt47WE/hqdefault.jpg",
    duration: "12m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "45M views",
    upload_time: "7 years ago",
  },
  {
    id: "21",
    title: "What is Life - The Biggest Question in Science",
    youtubeId: "QImCld9YubE",
    thumbnail: "https://img.youtube.com/vi/QImCld9YubE/hqdefault.jpg",
    duration: "10m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "32M views",
    upload_time: "6 years ago",
  },
  {
    id: "17",
    title: "Psychology - Introduction to Psychology",
    youtubeId: "vo4pMVb0R6M",
    thumbnail: "https://img.youtube.com/vi/vo4pMVb0R6M/hqdefault.jpg",
    duration: "15h 0m",
    category: "Psychology",
    channel: "Yale Courses",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "25M views",
    upload_time: "8 years ago",
  },
  {
    id: "23",
    title: "The Power of Belief - Mindset & Success",
    youtubeId: "0tqq66zwa7g",
    thumbnail: "https://img.youtube.com/vi/0tqq66zwa7g/hqdefault.jpg",
    duration: "15m",
    category: "Motivation",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "22M views",
    upload_time: "4 years ago",
  },
];

// Utility function to parse view count string (e.g., "45M views" -> 45000000)
export function parseViewCount(viewsStr: string): number {
  const match = viewsStr.match(/^([\d.]+)([KMB]?)\s*views?$/i);
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  const unit = match[2]?.toUpperCase();
  
  switch (unit) {
    case 'K': return num * 1000;
    case 'M': return num * 1000000;
    case 'B': return num * 1000000000;
    default: return num;
  }
}

// Get top N videos by view count
export function getTopVideosByViews(count: number = 4): VideoData[] {
  return [...videos]
    .sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views))
    .slice(0, count);
}
