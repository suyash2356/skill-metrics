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
  // Programming
  {
    id: "1",
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
    id: "2",
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
    id: "3",
    title: "React JS Full Course for Beginners",
    youtubeId: "bMknfKXIFA8",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg",
    duration: "12h 0m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "10M views",
    upload_time: "3 years ago",
  },
  {
    id: "4",
    title: "C++ Full Course for Beginners",
    youtubeId: "vLnPwxZdW4Y",
    thumbnail: "https://img.youtube.com/vi/vLnPwxZdW4Y/hqdefault.jpg",
    duration: "4h 1m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "14M views",
    upload_time: "4 years ago",
  },
  {
    id: "5",
    title: "Git and GitHub for Beginners - Crash Course",
    youtubeId: "RGOj5yH7evk",
    thumbnail: "https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg",
    duration: "1h 8m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "5M views",
    upload_time: "4 years ago",
  },

  // AI/ML
  {
    id: "6",
    title: "Machine Learning Full Course - 12 Hours",
    youtubeId: "GwIo3gDZCVQ",
    thumbnail: "https://img.youtube.com/vi/GwIo3gDZCVQ/hqdefault.jpg",
    duration: "11h 30m",
    category: "AI/ML",
    channel: "Edureka",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "5 years ago",
  },
  {
    id: "7",
    title: "But what is a neural network? | Chapter 1",
    youtubeId: "aircAruvnKk",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
    duration: "19m",
    category: "AI/ML",
    channel: "3Blue1Brown",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "18M views",
    upload_time: "7 years ago",
  },
  {
    id: "8",
    title: "ChatGPT Tutorial - A Crash Course on Chat GPT",
    youtubeId: "JTxsNm9IdYU",
    thumbnail: "https://img.youtube.com/vi/JTxsNm9IdYU/hqdefault.jpg",
    duration: "36m",
    category: "AI/ML",
    channel: "Adrian Twarog",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "6M views",
    upload_time: "2 years ago",
  },

  // Data Science
  {
    id: "9",
    title: "Data Science Full Course for Beginners",
    youtubeId: "ua-CiDNNj30",
    thumbnail: "https://img.youtube.com/vi/ua-CiDNNj30/hqdefault.jpg",
    duration: "6h 4m",
    category: "Data Science",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "5M views",
    upload_time: "4 years ago",
  },
  {
    id: "10",
    title: "Statistics Fundamentals - StatQuest",
    youtubeId: "qBigTkBLU6g",
    thumbnail: "https://img.youtube.com/vi/qBigTkBLU6g/hqdefault.jpg",
    duration: "33m",
    category: "Data Science",
    channel: "StatQuest",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "3M views",
    upload_time: "5 years ago",
  },
  {
    id: "11",
    title: "SQL Full Course - Learn SQL in 4 Hours",
    youtubeId: "HXV3zeQKqGY",
    thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg",
    duration: "4h 20m",
    category: "Data Science",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "12M views",
    upload_time: "5 years ago",
  },

  // Design
  {
    id: "12",
    title: "UI/UX Design Tutorial for Beginners",
    youtubeId: "c9Wg6Cb_YlU",
    thumbnail: "https://img.youtube.com/vi/c9Wg6Cb_YlU/hqdefault.jpg",
    duration: "2h 13m",
    category: "Design",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "3M views",
    upload_time: "3 years ago",
  },
  {
    id: "13",
    title: "Figma Tutorial for Beginners",
    youtubeId: "HZuk6Wkx_Eg",
    thumbnail: "https://img.youtube.com/vi/HZuk6Wkx_Eg/hqdefault.jpg",
    duration: "24m",
    category: "Design",
    channel: "DesignCourse",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "2M views",
    upload_time: "2 years ago",
  },
  {
    id: "14",
    title: "Web Design for Beginners - HTML & CSS",
    youtubeId: "B-ytMSuwbf8",
    thumbnail: "https://img.youtube.com/vi/B-ytMSuwbf8/hqdefault.jpg",
    duration: "4h 17m",
    category: "Design",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "1.5M views",
    upload_time: "2 years ago",
  },

  // Finance
  {
    id: "15",
    title: "Stock Market for Beginners - Full Guide",
    youtubeId: "p7HKvqRI_Bo",
    thumbnail: "https://img.youtube.com/vi/p7HKvqRI_Bo/hqdefault.jpg",
    duration: "32m",
    category: "Finance",
    channel: "Graham Stephan",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "3 years ago",
  },
  {
    id: "16",
    title: "Personal Finance for Beginners",
    youtubeId: "HQzoZfc3GwQ",
    thumbnail: "https://img.youtube.com/vi/HQzoZfc3GwQ/hqdefault.jpg",
    duration: "21m",
    category: "Finance",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "4M views",
    upload_time: "2 years ago",
  },
  {
    id: "17",
    title: "How the Economic Machine Works",
    youtubeId: "PHe0bXAIuk0",
    thumbnail: "https://img.youtube.com/vi/PHe0bXAIuk0/hqdefault.jpg",
    duration: "31m",
    category: "Finance",
    channel: "Principles by Ray Dalio",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "40M views",
    upload_time: "12 years ago",
  },

  // Psychology
  {
    id: "18",
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
    id: "19",
    title: "The Psychology of Self Motivation",
    youtubeId: "7sxpKhIbr0E",
    thumbnail: "https://img.youtube.com/vi/7sxpKhIbr0E/hqdefault.jpg",
    duration: "15m",
    category: "Psychology",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "12M views",
    upload_time: "5 years ago",
  },
  {
    id: "20",
    title: "How to Read People Like a Book",
    youtubeId: "1RPwfGiJ9r4",
    thumbnail: "https://img.youtube.com/vi/1RPwfGiJ9r4/hqdefault.jpg",
    duration: "16m",
    category: "Psychology",
    channel: "Psych2Go",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "7M views",
    upload_time: "3 years ago",
  },

  // Science
  {
    id: "21",
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
    id: "22",
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
    id: "23",
    title: "The Entire History of the Universe in 10 Minutes",
    youtubeId: "5TbUxGZtwGI",
    thumbnail: "https://img.youtube.com/vi/5TbUxGZtwGI/hqdefault.jpg",
    duration: "10m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "20M views",
    upload_time: "5 years ago",
  },

  // Motivation
  {
    id: "24",
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
  {
    id: "25",
    title: "How to Stop Being Lazy and Get Things Done",
    youtubeId: "W9GcMFT-KwE",
    thumbnail: "https://img.youtube.com/vi/W9GcMFT-KwE/hqdefault.jpg",
    duration: "11m",
    category: "Motivation",
    channel: "Better Ideas",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "3 years ago",
  },
  {
    id: "26",
    title: "Why You Should Never Stop Learning",
    youtubeId: "5MgBikgcWnY",
    thumbnail: "https://img.youtube.com/vi/5MgBikgcWnY/hqdefault.jpg",
    duration: "14m",
    category: "Motivation",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "5M views",
    upload_time: "4 years ago",
  },

  // Career
  {
    id: "27",
    title: "How to Get a Job in Tech - Full Guide",
    youtubeId: "Xg9ihH15Uto",
    thumbnail: "https://img.youtube.com/vi/Xg9ihH15Uto/hqdefault.jpg",
    duration: "20m",
    category: "Career",
    channel: "Forrest Knight",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "3M views",
    upload_time: "3 years ago",
  },
  {
    id: "28",
    title: "Resume Tips - How to Write a Resume",
    youtubeId: "Tt08KmFfIYQ",
    thumbnail: "https://img.youtube.com/vi/Tt08KmFfIYQ/hqdefault.jpg",
    duration: "13m",
    category: "Career",
    channel: "Jeff Su",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "6M views",
    upload_time: "2 years ago",
  },
  {
    id: "29",
    title: "How to Ace Any Interview - Tips from HR",
    youtubeId: "HG68Ymazo18",
    thumbnail: "https://img.youtube.com/vi/HG68Ymazo18/hqdefault.jpg",
    duration: "17m",
    category: "Career",
    channel: "Jeff Su",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "4M views",
    upload_time: "2 years ago",
  },

  // Productivity
  {
    id: "30",
    title: "How I Manage My Time - 10 Tips for Productivity",
    youtubeId: "iONDebHX9qk",
    thumbnail: "https://img.youtube.com/vi/iONDebHX9qk/hqdefault.jpg",
    duration: "18m",
    category: "Productivity",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "9M views",
    upload_time: "3 years ago",
  },
  {
    id: "31",
    title: "The Pomodoro Technique Explained",
    youtubeId: "VFW3Ld7JO0w",
    thumbnail: "https://img.youtube.com/vi/VFW3Ld7JO0w/hqdefault.jpg",
    duration: "5m",
    category: "Productivity",
    channel: "Thomas Frank",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "3M views",
    upload_time: "4 years ago",
  },
  {
    id: "32",
    title: "Atomic Habits - James Clear - Summary",
    youtubeId: "YT7tQzmGRLA",
    thumbnail: "https://img.youtube.com/vi/YT7tQzmGRLA/hqdefault.jpg",
    duration: "10m",
    category: "Productivity",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "6M views",
    upload_time: "3 years ago",
  },

  // Wellbeing
  {
    id: "33",
    title: "How to Deal with Anxiety - 7 Simple Tips",
    youtubeId: "WWloIAQpMcQ",
    thumbnail: "https://img.youtube.com/vi/WWloIAQpMcQ/hqdefault.jpg",
    duration: "14m",
    category: "Wellbeing",
    channel: "Therapy in a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "7M views",
    upload_time: "3 years ago",
  },
  {
    id: "34",
    title: "10 Minute Meditation for Beginners",
    youtubeId: "U9YKY7fdwyg",
    thumbnail: "https://img.youtube.com/vi/U9YKY7fdwyg/hqdefault.jpg",
    duration: "10m",
    category: "Wellbeing",
    channel: "Goodful",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "15M views",
    upload_time: "5 years ago",
  },

  // Exam Prep
  {
    id: "35",
    title: "How to Study Effectively for Exams",
    youtubeId: "ukLnPbIffxE",
    thumbnail: "https://img.youtube.com/vi/ukLnPbIffxE/hqdefault.jpg",
    duration: "12m",
    category: "Exam Prep",
    channel: "Thomas Frank",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "10M views",
    upload_time: "4 years ago",
  },
  {
    id: "36",
    title: "Active Recall - The Best Study Method",
    youtubeId: "fDbxPVn02VU",
    thumbnail: "https://img.youtube.com/vi/fDbxPVn02VU/hqdefault.jpg",
    duration: "8m",
    category: "Exam Prep",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "5M views",
    upload_time: "4 years ago",
  },

  // Education
  {
    id: "37",
    title: "How to Learn Anything Fast - Feynman Technique",
    youtubeId: "MlJdMr3O5J4",
    thumbnail: "https://img.youtube.com/vi/MlJdMr3O5J4/hqdefault.jpg",
    duration: "6m",
    category: "Education",
    channel: "Thomas Frank",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "5 years ago",
  },
  {
    id: "38",
    title: "The Science of Learning - How Your Brain Works",
    youtubeId: "O96fE1E-rf8",
    thumbnail: "https://img.youtube.com/vi/O96fE1E-rf8/hqdefault.jpg",
    duration: "14m",
    category: "Education",
    channel: "CrashCourse",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "4M views",
    upload_time: "6 years ago",
  },

  // Business
  {
    id: "39",
    title: "How to Start a Business - Step by Step",
    youtubeId: "0162VF_bEKM",
    thumbnail: "https://img.youtube.com/vi/0162VF_bEKM/hqdefault.jpg",
    duration: "22m",
    category: "Business",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "5M views",
    upload_time: "2 years ago",
  },
  {
    id: "40",
    title: "Marketing 101 - Fundamentals of Marketing",
    youtubeId: "nU-IIXBWlS4",
    thumbnail: "https://img.youtube.com/vi/nU-IIXBWlS4/hqdefault.jpg",
    duration: "47m",
    category: "Business",
    channel: "Professor Wolters",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "2M views",
    upload_time: "3 years ago",
  },
  {
    id: "41",
    title: "Elon Musk on Starting a Business",
    youtubeId: "3Rge4PH48FY",
    thumbnail: "https://img.youtube.com/vi/3Rge4PH48FY/hqdefault.jpg",
    duration: "9m",
    category: "Business",
    channel: "Business Casual",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "7M views",
    upload_time: "4 years ago",
  },

  // Technology
  {
    id: "42",
    title: "How Does the Internet Work?",
    youtubeId: "zN8YNNHcaZs",
    thumbnail: "https://img.youtube.com/vi/zN8YNNHcaZs/hqdefault.jpg",
    duration: "5m",
    category: "Technology",
    channel: "Lesics",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "15M views",
    upload_time: "6 years ago",
  },
  {
    id: "43",
    title: "Blockchain Explained Simply",
    youtubeId: "SSo_EIwHSd4",
    thumbnail: "https://img.youtube.com/vi/SSo_EIwHSd4/hqdefault.jpg",
    duration: "26m",
    category: "Technology",
    channel: "Simply Explained",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "6M views",
    upload_time: "5 years ago",
  },
  {
    id: "44",
    title: "Cloud Computing Explained in 10 Minutes",
    youtubeId: "M988_fsOSWo",
    thumbnail: "https://img.youtube.com/vi/M988_fsOSWo/hqdefault.jpg",
    duration: "10m",
    category: "Technology",
    channel: "Fireship",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "4M views",
    upload_time: "3 years ago",
  },
  {
    id: "45",
    title: "Cybersecurity Full Course - Network Security",
    youtubeId: "PlHnamdwGmw",
    thumbnail: "https://img.youtube.com/vi/PlHnamdwGmw/hqdefault.jpg",
    duration: "1h 30m",
    category: "Technology",
    channel: "Edureka",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "3M views",
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

// Parse duration string to minutes (e.g., "4h 26m" -> 266)
export function parseDurationMinutes(dur: string): number {
  let total = 0;
  const hours = dur.match(/(\d+)h/);
  const mins = dur.match(/(\d+)m/);
  if (hours) total += parseInt(hours[1]) * 60;
  if (mins) total += parseInt(mins[1]);
  return total;
}

// Get top N videos by view count
export function getTopVideosByViews(count: number = 4): VideoData[] {
  return [...videos]
    .sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views))
    .slice(0, count);
}
