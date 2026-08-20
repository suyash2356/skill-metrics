import { useState, useEffect, useCallback, useMemo } from "react";
import { VideoData, parseDurationMinutes } from "@/lib/videosData";
import { CustomVideo, buildCustomVideo } from "@/lib/customVideos";

export interface WatchQueueGoal {
  id: string;
  title: string;
  category: string;
  targetDays: number;
  createdAt: number;
  videoIds: string[];
  completedIds: string[];
}

const QUEUE_KEY = "watch_queue";
const GOALS_KEY = "watch_goals";
const HISTORY_KEY = "watch_history";
const LIKES_KEY = "watch_likes";
const CUSTOM_KEY = "watch_custom_videos";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function useWatchQueue(baseVideos: VideoData[]) {
  const [queue, setQueue] = useState<string[]>(() => load(QUEUE_KEY, []));
  const [goals, setGoals] = useState<WatchQueueGoal[]>(() => load(GOALS_KEY, []));
  const [history, setHistory] = useState<Record<string, number>>(() => load(HISTORY_KEY, {}));
  const [likes, setLikes] = useState<string[]>(() => load(LIKES_KEY, []));
  const [customVideos, setCustomVideos] = useState<CustomVideo[]>(() => load(CUSTOM_KEY, []));

  useEffect(() => save(QUEUE_KEY, queue), [queue]);
  useEffect(() => save(GOALS_KEY, goals), [goals]);
  useEffect(() => save(HISTORY_KEY, history), [history]);
  useEffect(() => save(LIKES_KEY, likes), [likes]);
  useEffect(() => save(CUSTOM_KEY, customVideos), [customVideos]);

  // Custom videos participate everywhere alongside curated ones
  const allVideos = useMemo<VideoData[]>(() => [...baseVideos, ...customVideos], [baseVideos, customVideos]);

  const addToQueue = useCallback((videoId: string) => {
    setQueue(q => q.includes(videoId) ? q : [...q, videoId]);
  }, []);

  const removeFromQueue = useCallback((videoId: string) => {
    setQueue(q => q.filter(id => id !== videoId));
  }, []);

  const isInQueue = useCallback((videoId: string) => queue.includes(videoId), [queue]);

  const toggleLike = useCallback((videoId: string) => {
    setLikes(l => l.includes(videoId) ? l.filter(id => id !== videoId) : [...l, videoId]);
  }, []);

  const isLiked = useCallback((videoId: string) => likes.includes(videoId), [likes]);

  const markWatched = useCallback((videoId: string) => {
    setHistory(h => ({ ...h, [videoId]: Date.now() }));
    // Also mark in goals
    setGoals(gs => gs.map(g =>
      g.videoIds.includes(videoId) && !g.completedIds.includes(videoId)
        ? { ...g, completedIds: [...g.completedIds, videoId] }
        : g
    ));
  }, []);

  const isWatched = useCallback((videoId: string) => !!history[videoId], [history]);

  const createGoal = useCallback((
    title: string,
    category: string,
    targetDays: number,
    extraLinks: { url: string; title?: string; durationMinutes?: number }[] = []
  ) => {
    const goalId = Date.now().toString();

    const customForGoal = extraLinks.map(l =>
      buildCustomVideo({ url: l.url, title: l.title, category, durationMinutes: l.durationMinutes, goalId })
    );
    if (customForGoal.length > 0) setCustomVideos(cv => [...cv, ...customForGoal]);

    const categoryVideos = baseVideos
      .filter(v => v.category === category)
      .map(v => v.id);

    const videoIds = [...customForGoal.map(v => v.id), ...categoryVideos];

    const goal: WatchQueueGoal = {
      id: goalId,
      title,
      category,
      targetDays,
      createdAt: Date.now(),
      videoIds,
      completedIds: videoIds.filter(id => !!history[id]),
    };
    setGoals(g => [...g, goal]);
    setQueue(q => [...q, ...videoIds.filter(id => !q.includes(id))]);
    return goal;
  }, [baseVideos, history]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(g => g.filter(gl => gl.id !== goalId));
  }, []);

  /** Add an external video link (optionally attached to a goal) */
  const addCustomVideo = useCallback((input: {
    url: string;
    title?: string;
    category: string;
    durationMinutes?: number;
    goalId?: string;
  }) => {
    const video = buildCustomVideo(input);
    setCustomVideos(cv => [...cv, video]);
    setQueue(q => q.includes(video.id) ? q : [...q, video.id]);
    if (input.goalId) {
      setGoals(gs => gs.map(g =>
        g.id === input.goalId ? { ...g, videoIds: [video.id, ...g.videoIds] } : g
      ));
    }
    return video;
  }, []);

  const updateCustomVideo = useCallback((videoId: string, patch: { title?: string; category?: string; durationMinutes?: number }) => {
    setCustomVideos(cv => cv.map(v => {
      if (v.id !== videoId) return v;
      return {
        ...v,
        title: patch.title?.trim() || v.title,
        category: patch.category || v.category,
        duration: patch.durationMinutes && patch.durationMinutes > 0
          ? (patch.durationMinutes < 60
            ? `${patch.durationMinutes}m`
            : `${Math.floor(patch.durationMinutes / 60)}h ${patch.durationMinutes % 60}m`)
          : v.duration,
      };
    }));
  }, []);

  const removeCustomVideo = useCallback((videoId: string) => {
    setCustomVideos(cv => cv.filter(v => v.id !== videoId));
    setQueue(q => q.filter(id => id !== videoId));
    setGoals(gs => gs.map(g => ({
      ...g,
      videoIds: g.videoIds.filter(id => id !== videoId),
      completedIds: g.completedIds.filter(id => id !== videoId),
    })));
  }, []);

  const queueVideos = queue.map(id => allVideos.find(v => v.id === id)).filter(Boolean) as VideoData[];

  const totalQueueMinutes = queueVideos.reduce((sum, v) => sum + parseDurationMinutes(v.duration), 0);

  const watchedCount = Object.keys(history).length;

  // Calculate daily target for a goal
  const getGoalDailyMinutes = useCallback((goal: WatchQueueGoal) => {
    const remaining = goal.videoIds.filter(id => !goal.completedIds.includes(id));
    const remainingMinutes = remaining.reduce((sum, id) => {
      const v = allVideos.find(vi => vi.id === id);
      return sum + (v ? parseDurationMinutes(v.duration) : 0);
    }, 0);
    const daysElapsed = Math.floor((Date.now() - goal.createdAt) / 86400000);
    const daysLeft = Math.max(1, goal.targetDays - daysElapsed);
    return Math.ceil(remainingMinutes / daysLeft);
  }, [allVideos]);

  const clearQueue = useCallback(() => setQueue([]), []);

  const getVideoById = useCallback((id: string) => allVideos.find(v => v.id === id), [allVideos]);

  return {
    queue,
    queueVideos,
    totalQueueMinutes,
    goals,
    history,
    watchedCount,
    likes,
    customVideos,
    allVideos,
    getVideoById,
    addToQueue,
    removeFromQueue,
    isInQueue,
    toggleLike,
    isLiked,
    markWatched,
    isWatched,
    createGoal,
    deleteGoal,
    addCustomVideo,
    updateCustomVideo,
    removeCustomVideo,
    getGoalDailyMinutes,
    clearQueue,
  };
}
