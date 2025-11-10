import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Clock, Eye, Heart, Filter } from "lucide-react";

const NewVideos = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
  "All",
  "Programming",
  "AI/ML",
  "Design",
  "Data Science",
  "Finance",
  "Psychology",
  "Science",
  "Motivation",
  "Career",
  "Productivity",
  "Wellbeing",
  "Exam Prep",
  "Education",
  "Business",
  "Technology"
];


  // Static YouTube video list (replace/add as needed)
  const videos = [
  // 🧠 PROGRAMMING
  {
    id: "1",
    title: "HTML Full Course - Build a Website Tutorial",
    youtubeId: "pQN-pnXPaVg",
    thumbnail: "https://img.youtube.com/vi/pQN-pnXPaVg/hqdefault.jpg",
    duration: "2h 0m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "11M views",
    upload_time: "5 years ago",
  },
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
    id: "4",
    title: "React JS Crash Course 2024",
    youtubeId: "w7ejDZ8SWv8",
    thumbnail: "https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    duration: "1h 48m",
    category: "Programming",
    channel: "Traversy Media",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR4eh9BBzZq4GxXMjJkXnIY9jC_0ZZw4qYzXG6Z=s88-c-k-c0x00ffffff-no-rj",
    views: "4M views",
    upload_time: "2 years ago",
  },
  {
    id: "5",
    title: "Node.js Full Course for Beginners",
    youtubeId: "Oe421EPjeBE",
    thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg",
    duration: "2h 45m",
    category: "Programming",
    channel: "Dave Gray",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLSnX4f6Gg8VnSxsaV3XHe1KakTuAb9mgx1vRQ=s88-c-k-c0x00ffffff-no-rj",
    views: "2.5M views",
    upload_time: "1 year ago",
  },
  {
    id: "6",
    title: "C++ Tutorial for Beginners - Full Course",
    youtubeId: "vLnPwxZdW4Y",
    thumbnail: "https://img.youtube.com/vi/vLnPwxZdW4Y/hqdefault.jpg",
    duration: "4h 0m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "10M views",
    upload_time: "4 years ago",
  },
  {
    id: "7",
    title: "Learn Git and GitHub - Crash Course",
    youtubeId: "RGOj5yH7evk",
    thumbnail: "https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg",
    duration: "1h 20m",
    category: "Programming",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "4.5M views",
    upload_time: "3 years ago",
  },

  // 🤖 AI / ML
  {
    id: "8",
    title: "Machine Learning for Everyone - Full Course",
    youtubeId: "GwIo3gDZCVQ",
    thumbnail: "https://img.youtube.com/vi/GwIo3gDZCVQ/hqdefault.jpg",
    duration: "2h 20m",
    category: "AI/ML",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "3.2M views",
    upload_time: "3 years ago",
  },
  {
    id: "9",
    title: "Neural Networks from Scratch (Python)",
    youtubeId: "aircAruvnKk",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
    duration: "1h 10m",
    category: "AI/ML",
    channel: "3Blue1Brown",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTOMjxAGc3eeBbG1V7KRaRVj-1ynPyU22AS3g=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "6 years ago",
  },
  {
    id: "10",
    title: "Learn ChatGPT & OpenAI API for Beginners",
    youtubeId: "B-c9L0btw0U",
    thumbnail: "https://img.youtube.com/vi/B-c9L0btw0U/hqdefault.jpg",
    duration: "2h 14m",
    category: "AI/ML",
    channel: "Traversy Media",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR4eh9BBzZq4GxXMjJkXnIY9jC_0ZZw4qYzXG6Z=s88-c-k-c0x00ffffff-no-rj",
    views: "1.1M views",
    upload_time: "6 months ago",
  },

  // 🎨 DESIGN
  {
    id: "11",
    title: "Figma UI/UX Design Full Course",
    youtubeId: "jHqU2QhM1ao",
    thumbnail: "https://img.youtube.com/vi/jHqU2QhM1ao/hqdefault.jpg",
    duration: "3h 40m",
    category: "Design",
    channel: "DesignCourse",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR_S7XSmUNZjAKqEAPtT-tV6l4U8RqtFCc-Jg=s88-c-k-c0x00ffffff-no-rj",
    views: "2.3M views",
    upload_time: "2 years ago",
  },
  {
    id: "12",
    title: "Adobe Photoshop Tutorial for Beginners",
    youtubeId: "IyR_uYsRdPs",
    thumbnail: "https://img.youtube.com/vi/IyR_uYsRdPs/hqdefault.jpg",
    duration: "1h 50m",
    category: "Design",
    channel: "Piximperfect",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTmfK9m4ck8FG7A_JHW8S4jcd2dKdr4kz5Y8g=s88-c-k-c0x00ffffff-no-rj",
    views: "3.8M views",
    upload_time: "3 years ago",
  },

  // 📚 EDUCATION / NON-TECH
  {
    id: "13",
    title: "How to Study for Exams – Evidence-Based Masterclass",
    youtubeId: "Lt54CX9DmS4",
    thumbnail: "https://img.youtube.com/vi/Lt54CX9DmS4/hqdefault.jpg",
    duration: "1h 14m",
    category: "Education",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQDFbFjtvXChjboAlNn4Q1IDwS3HnAUp2VtX6hb=s88-c-k-c0x00ffffff-no-rj",
    views: "3.2M views",
    upload_time: "2 years ago",
  },
  {
    id: "14",
    title: "How to Learn Anything Fast - Josh Kaufman",
    youtubeId: "5MgBikgcWnY",
    thumbnail: "https://img.youtube.com/vi/5MgBikgcWnY/hqdefault.jpg",
    duration: "20m",
    category: "Education",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "25M views",
    upload_time: "8 years ago",
  },
  {
    id: "15",
    title: "The Science of Learning: How to Study Effectively",
    youtubeId: "ukLnPbIffxE",
    thumbnail: "https://img.youtube.com/vi/ukLnPbIffxE/hqdefault.jpg",
    duration: "15m",
    category: "Education",
    channel: "AsapSCIENCE",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTZ_KS6Fe3l3WHSx6m-6q7rJeZhbZAhLrbq3Vw=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "6 years ago",
  },

  // 💼 BUSINESS & PRODUCTIVITY
  {
    id: "16",
    title: "How to Start a Business in 2024 - Step by Step",
    youtubeId: "lHJ4i8DsZ6Y",
    thumbnail: "https://img.youtube.com/vi/lHJ4i8DsZ6Y/hqdefault.jpg",
    duration: "40m",
    category: "Business",
    channel: "Slidebean",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR8zoUf2PpDMb0GVLujsqPkPKxY8RHYl45z=s88-c-k-c0x00ffffff-no-rj",
    views: "1.2M views",
    upload_time: "1 year ago",
  },
  {
    id: "17",
    title: "Productivity System for Creators - Ali Abdaal",
    youtubeId: "NDFI56mA8zs",
    thumbnail: "https://img.youtube.com/vi/NDFI56mA8zs/hqdefault.jpg",
    duration: "18m",
    category: "Business",
    channel: "Ali Abdaal",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQDFbFjtvXChjboAlNn4Q1IDwS3HnAUp2VtX6hb=s88-c-k-c0x00ffffff-no-rj",
    views: "2.5M views",
    upload_time: "1 year ago",
  },

  // 🧩 EXAM PREP
  {
    id: "18",
    title: "How to Prepare for CAT Exam - Strategy & Plan",
    youtubeId: "sklA8w5X7fA",
    thumbnail: "https://img.youtube.com/vi/sklA8w5X7fA/hqdefault.jpg",
    duration: "40m",
    category: "Exam Prep",
    channel: "Unacademy CAT",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQyRzrbXZXkCBjMKAtKfy0sKnWjRh0Rw4q70Q=s88-c-k-c0x00ffffff-no-rj",
    views: "500K views",
    upload_time: "2 years ago",
  },
  {
    id: "19",
    title: "UPSC Preparation Strategy 2024 by Roman Saini",
    youtubeId: "Jw1wYqYkK2s",
    thumbnail: "https://img.youtube.com/vi/Jw1wYqYkK2s/hqdefault.jpg",
    duration: "30m",
    category: "Exam Prep",
    channel: "Unacademy UPSC",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQyRzrbXZXkCBjMKAtKfy0sKnWjRh0Rw4q70Q=s88-c-k-c0x00ffffff-no-rj",
    views: "1.2M views",
    upload_time: "3 years ago",
  },
  {
    id: "20",
    title: "How to Score 100% in Board Exams - Study Routine",
    youtubeId: "QQOHzL_CIkA",
    thumbnail: "https://img.youtube.com/vi/QQOHzL_CIkA/hqdefault.jpg",
    duration: "30m",
    category: "Exam Prep",
    channel: "Nehal Baid",
    channel_avatar: "",
    views: "900K views",
    upload_time: "1.5 years ago",
  },
  {
    id: "21",
    title: "How to Prepare for JEE 2025 - Toppers' Tips",
    youtubeId: "UxAkb4e1s8M",
    thumbnail: "https://img.youtube.com/vi/UxAkb4e1s8M/hqdefault.jpg",
    duration: "45m",
    category: "Exam Prep",
    channel: "Vedantu JEE",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLRyTVwqV1Vv1mp7QmVGfq9hiyIgywzj2lWoyvA=s88-c-k-c0x00ffffff-no-rj",
    views: "2M views",
    upload_time: "2 years ago",
  },
  {
    id: "22",
    title: "NEET 2024 Biology Full Syllabus Marathon",
    youtubeId: "cOCbF2O7x7o",
    thumbnail: "https://img.youtube.com/vi/cOCbF2O7x7o/hqdefault.jpg",
    duration: "2h 0m",
    category: "Exam Prep",
    channel: "Vedantu NEET",
    channel_avatar: "",
    views: "1M views",
    upload_time: "1 year ago",
  },
  {
    id: "23",
    title: "Study Motivation: The Secret to Success in Exams",
    youtubeId: "mg3hA6zEImk",
    thumbnail: "https://img.youtube.com/vi/mg3hA6zEImk/hqdefault.jpg",
    duration: "10m",
    category: "Exam Prep",
    channel: "Motivation2Study",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQySgL6PyEXW7yoI0gE-xGyEP1h3z9HqMZgxs=s88-c-k-c0x00ffffff-no-rj",
    views: "12M views",
    upload_time: "4 years ago",
  },
  // Continue videos array
  {
    id: "24",
    title: "The Ultimate Guide to Personal Finance for Beginners",
    youtubeId: "t6xU2zfg6wE",
    thumbnail: "https://img.youtube.com/vi/t6xU2zfg6wE/hqdefault.jpg",
    duration: "1h 12m",
    category: "Finance",
    channel: "Graham Stephan",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQ7xP1uT2JfVrH9LxD8PpA70hTiY3n3lbi1IQ=s88-c-k-c0x00ffffff-no-rj",
    views: "4.8M views",
    upload_time: "3 years ago",
  },
  {
    id: "25",
    title: "Investing for Beginners - Full Course",
    youtubeId: "T71ibcZAX3I",
    thumbnail: "https://img.youtube.com/vi/T71ibcZAX3I/hqdefault.jpg",
    duration: "2h 25m",
    category: "Finance",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "3.1M views",
    upload_time: "2 years ago",
  },
  {
    id: "26",
    title: "Learn Excel in 1 Hour - Full Course for Beginners",
    youtubeId: "Vl0H-qTclOg",
    thumbnail: "https://img.youtube.com/vi/Vl0H-qTclOg/hqdefault.jpg",
    duration: "1h 0m",
    category: "Business",
    channel: "Technology for Teachers and Students",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTEKcG6lX1MzW_G8n4ZlYndHvZJrMPe8vsf9A=s88-c-k-c0x00ffffff-no-rj",
    views: "6.5M views",
    upload_time: "4 years ago",
  },
  {
    id: "27",
    title: "Stock Market for Beginners 2024 - Step by Step",
    youtubeId: "zZAWTH6tZt8",
    thumbnail: "https://img.youtube.com/vi/zZAWTH6tZt8/hqdefault.jpg",
    duration: "45m",
    category: "Finance",
    channel: "Pranjal Kamra",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLRh9YcHGE3Tq3lgsh4pgvKqjBrfxRUIwcPhVw=s88-c-k-c0x00ffffff-no-rj",
    views: "3.2M views",
    upload_time: "1 year ago",
  },
  {
    id: "28",
    title: "Psychology Crash Course - 40 Minutes of Mind Science",
    youtubeId: "vo4pMVb0R6M",
    thumbnail: "https://img.youtube.com/vi/vo4pMVb0R6M/hqdefault.jpg",
    duration: "40m",
    category: "Psychology",
    channel: "CrashCourse",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQBBvjJ4zLqA25Z2cojXzDaF-fF6KM3WzD8Cg=s88-c-k-c0x00ffffff-no-rj",
    views: "6.1M views",
    upload_time: "5 years ago",
  },
  {
    id: "29",
    title: "The Science of Happiness | Yale University Course",
    youtubeId: "92tuvHfrr3Q",
    thumbnail: "https://img.youtube.com/vi/92tuvHfrr3Q/hqdefault.jpg",
    duration: "1h 30m",
    category: "Psychology",
    channel: "Yale Courses",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLRsZk7tl6L9mEqZcXMiUnbA5M0Hu9HOVqpGqA=s88-c-k-c0x00ffffff-no-rj",
    views: "2.4M views",
    upload_time: "3 years ago",
  },
  {
    id: "30",
    title: "Data Science Full Course - Python, Pandas, ML",
    youtubeId: "ua-CiDNNj30",
    thumbnail: "https://img.youtube.com/vi/ua-CiDNNj30/hqdefault.jpg",
    duration: "10h 0m",
    category: "Data Science",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "12M views",
    upload_time: "3 years ago",
  },
  {
    id: "31",
    title: "SQL Full Course for Beginners | MySQL Tutorial",
    youtubeId: "HXV3zeQKqGY",
    thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg",
    duration: "4h 0m",
    category: "Data Science",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "8M views",
    upload_time: "2 years ago",
  },
  {
    id: "32",
    title: "Statistics Crash Course for Data Analysis",
    youtubeId: "xxpc-HPKN28",
    thumbnail: "https://img.youtube.com/vi/xxpc-HPKN28/hqdefault.jpg",
    duration: "1h 30m",
    category: "Data Science",
    channel: "CrashCourse",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQBBvjJ4zLqA25Z2cojXzDaF-fF6KM3WzD8Cg=s88-c-k-c0x00ffffff-no-rj",
    views: "5.2M views",
    upload_time: "4 years ago",
  },
  {
    id: "33",
    title: "Motivational Speech for Students - Study Hard",
    youtubeId: "sP4D3Y1Zb9E",
    thumbnail: "https://img.youtube.com/vi/sP4D3Y1Zb9E/hqdefault.jpg",
    duration: "12m",
    category: "Motivation",
    channel: "Ben Lionel Scott",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLT6dYFj9VJtRqx6pNHskX1bXyEkbYqH2C2F4g=s88-c-k-c0x00ffffff-no-rj",
    views: "22M views",
    upload_time: "4 years ago",
  },
  {
    id: "34",
    title: "Study Motivation for Exams | Best Speech",
    youtubeId: "mg3hA6zEImk",
    thumbnail: "https://img.youtube.com/vi/mg3hA6zEImk/hqdefault.jpg",
    duration: "10m",
    category: "Motivation",
    channel: "Motivation2Study",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQySgL6PyEXW7yoI0gE-xGyEP1h3z9HqMZgxs=s88-c-k-c0x00ffffff-no-rj",
    views: "18M views",
    upload_time: "3 years ago",
  },
  {
    id: "35",
    title: "Top 10 Soft Skills You Need to Succeed",
    youtubeId: "WlG0gXQKgp0",
    thumbnail: "https://img.youtube.com/vi/WlG0gXQKgp0/hqdefault.jpg",
    duration: "22m",
    category: "Career",
    channel: "Practical Psychology",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLT1mco6z5AlVW7CBByCXiFGv2xgU4nU4Yt3bQ=s88-c-k-c0x00ffffff-no-rj",
    views: "5.3M views",
    upload_time: "4 years ago",
  },
  {
    id: "36",
    title: "How to Speak Confidently in Public",
    youtubeId: "Rr8xvw0cgw0",
    thumbnail: "https://img.youtube.com/vi/Rr8xvw0cgw0/hqdefault.jpg",
    duration: "18m",
    category: "Career",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "10M views",
    upload_time: "7 years ago",
  },
  {
    id: "37",
    title: "The Secret to Self-Discipline",
    youtubeId: "bAhuX6A1blc",
    thumbnail: "https://img.youtube.com/vi/bAhuX6A1blc/hqdefault.jpg",
    duration: "14m",
    category: "Motivation",
    channel: "Better Than Yesterday",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLSPAnDkUvY_JAwvZXxY7fHQWvYv2sMSZfA62Q=s88-c-k-c0x00ffffff-no-rj",
    views: "9M views",
    upload_time: "2 years ago",
  },
  {
    id: "38",
    title: "Science Simplified: Quantum Physics in 10 Minutes",
    youtubeId: "Io9XlQrEt2k",
    thumbnail: "https://img.youtube.com/vi/Io9XlQrEt2k/hqdefault.jpg",
    duration: "10m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "13M views",
    upload_time: "4 years ago",
  },
  {
    id: "39",
    title: "Black Holes Explained – From Birth to Death",
    youtubeId: "e-P5IFTqB98",
    thumbnail: "https://img.youtube.com/vi/e-P5IFTqB98/hqdefault.jpg",
    duration: "8m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "45M views",
    upload_time: "7 years ago",
  },
  {
    id: "40",
    title: "The Universe in 4 Minutes",
    youtubeId: "Q1YqgPAtzho",
    thumbnail: "https://img.youtube.com/vi/Q1YqgPAtzho/hqdefault.jpg",
    duration: "4m",
    category: "Science",
    channel: "Kurzgesagt – In a Nutshell",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR7KDk6T9ZtN5W4qQbN9U2Ndu5C9tWohcBbPg=s88-c-k-c0x00ffffff-no-rj",
    views: "32M views",
    upload_time: "6 years ago",
  },
  {
    id: "41",
    title: "How to Build Confidence and Overcome Fear",
    youtubeId: "tShavGuo0_E",
    thumbnail: "https://img.youtube.com/vi/tShavGuo0_E/hqdefault.jpg",
    duration: "17m",
    category: "Motivation",
    channel: "Jay Shetty",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLSpJFt8qPZ1KiU8dV0cXyR9dUqgNs3e4F9V0g=s88-c-k-c0x00ffffff-no-rj",
    views: "15M views",
    upload_time: "3 years ago",
  },
  {
    id: "42",
    title: "Learn Data Visualization with Python",
    youtubeId: "y8Sg_mw8j9I",
    thumbnail: "https://img.youtube.com/vi/y8Sg_mw8j9I/hqdefault.jpg",
    duration: "2h 20m",
    category: "Data Science",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "1.6M views",
    upload_time: "1 year ago",
  },
  {
    id: "43",
    title: "Blockchain Explained Simply",
    youtubeId: "SSo_EIwHSd4",
    thumbnail: "https://img.youtube.com/vi/SSo_EIwHSd4/hqdefault.jpg",
    duration: "11m",
    category: "Technology",
    channel: "Simply Explained",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTKDJmXLOV7n9IFKqK3P7f3uP7TLL6UwHDfHQ=s88-c-k-c0x00ffffff-no-rj",
    views: "6.5M views",
    upload_time: "5 years ago",
  },
  {
    id: "44",
    title: "How Internet Works - Full Explanation",
    youtubeId: "7_LPdttKXPc",
    thumbnail: "https://img.youtube.com/vi/7_LPdttKXPc/hqdefault.jpg",
    duration: "12m",
    category: "Technology",
    channel: "Code.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTm6bRZm1B0qj0eeRrcDtkRZ1VvbkqDKVibmg=s88-c-k-c0x00ffffff-no-rj",
    views: "8.3M views",
    upload_time: "6 years ago",
  },
  {
    id: "45",
    title: "Time Management for Students - 10 Tips",
    youtubeId: "oTugjssqOT0",
    thumbnail: "https://img.youtube.com/vi/oTugjssqOT0/hqdefault.jpg",
    duration: "9m",
    category: "Productivity",
    channel: "Thomas Frank",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQJhd4Z6pYZHWZtAAU8fnC-Z3qkrYqZgYozFg=s88-c-k-c0x00ffffff-no-rj",
    views: "14M views",
    upload_time: "5 years ago",
  },
  {
    id: "46",
    title: "Atomic Habits Summary - Build Better Habits",
    youtubeId: "U_nzqnXWvSo",
    thumbnail: "https://img.youtube.com/vi/U_nzqnXWvSo/hqdefault.jpg",
    duration: "18m",
    category: "Productivity",
    channel: "Productivity Game",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLR4ZQ2b6tF0smqRV-1I6ZPZrGpvhRGkRcZx4A=s88-c-k-c0x00ffffff-no-rj",
    views: "5.8M views",
    upload_time: "3 years ago",
  },
  {
    id: "47",
    title: "Mindfulness for Beginners - Full Course",
    youtubeId: "ZToicYcHIOU",
    thumbnail: "https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg",
    duration: "1h 0m",
    category: "Wellbeing",
    channel: "Jon Kabat-Zinn",
    channel_avatar: "",
    views: "3.3M views",
    upload_time: "4 years ago",
  },
  {
    id: "48",
    title: "Learn How to Learn – Coursera Course Summary",
    youtubeId: "O96fE1E-rf8",
    thumbnail: "https://img.youtube.com/vi/O96fE1E-rf8/hqdefault.jpg",
    duration: "13m",
    category: "Education",
    channel: "TED-Ed",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLRLMbkbCd5-QvxVHR7MJe9Q1Xkm4ozA6P8e2w=s88-c-k-c0x00ffffff-no-rj",
    views: "10M views",
    upload_time: "6 years ago",
  },
  {
    id: "49",
    title: "Cybersecurity Full Course - Network & Ethical Hacking",
    youtubeId: "inWWhr5tnEA",
    thumbnail: "https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg",
    duration: "12h 0m",
    category: "Technology",
    channel: "freeCodeCamp.org",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLQzvDeZHQDpIYbZyX-FRrkw6eKQq__YJbJsvv7R=s88-c-k-c0x00ffffff-no-rj",
    views: "2.2M views",
    upload_time: "1 year ago",
  },
  {
    id: "50",
    title: "Public Speaking Full Course - Speak with Confidence",
    youtubeId: "tShavGuo0_E",
    thumbnail: "https://img.youtube.com/vi/tShavGuo0_E/hqdefault.jpg",
    duration: "50m",
    category: "Career",
    channel: "TEDx Talks",
    channel_avatar: "https://yt3.ggpht.com/ytc/AKedOLTj5TBoQhEClWstnPtnUy8SPkSO7fT_Yv6cwA=s88-c-k-c0x00ffffff-no-rj",
    views: "9.8M views",
    upload_time: "4 years ago",
  },
];



  const filteredVideos = activeCategory === "All"
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">New Videos</h1>
            <p className="text-muted-foreground">
              Helpful and trending educational videos
            </p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === activeCategory ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Embedded YouTube Video */}
                <div className="relative">
                  <iframe
                    className="w-full h-48 rounded-t-lg"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {video.category}
                  </Badge>

                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 leading-tight line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={video.channel_avatar} />
                      <AvatarFallback>
                        {(video.channel || "C")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {video.channel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.views}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.upload_time}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-auto p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More placeholder */}
        <div className="text-center py-8">
          <Button variant="outline" className="w-full max-w-sm">
            Loaded
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewVideos;
