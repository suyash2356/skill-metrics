import { useState, useEffect, useCallback } from "react";
import { VideoData, parseDurationMinutes } from "@/lib/videosData";

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

export function useWatchQueue(allVideos: VideoData[]) {
  const [queue, setQueue] = useState<string[]>(() => load(QUEUE_KEY, []));
  const [goals, setGoals] = useState<WatchQueueGoal[]>(() => load(GOALS_KEY, []));
  const [history, setHistory] = useState<Record<string, number>>(() => load(HISTORY_KEY, {}));
  const [likes, setLikes] = useState<string[]>(() => load(LIKES_KEY, []));

  useEffect(() => save(QUEUE_KEY, queue), [queue]);
  useEffect(() => save(GOALS_KEY, goals), [goals]);
  useEffect(() => save(HISTORY_KEY, history), [history]);
  useEffect(() => save(LIKES_KEY, likes), [likes]);

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

  const createGoal = useCallback((title: string, category: string, targetDays: number) => {
    const categoryVideos = allVideos
      .filter(v => v.category === category)
      .map(v => v.id);

    const goal: WatchQueueGoal = {
      id: Date.now().toString(),
      title,
      category,
      targetDays,
      createdAt: Date.now(),
      videoIds: categoryVideos,
      completedIds: categoryVideos.filter(id => !!history[id]),
    };
    setGoals(g => [...g, goal]);
    // Add videos to queue
    setQueue(q => {
      const newIds = categoryVideos.filter(id => !q.includes(id));
      return [...q, ...newIds];
    });
    return goal;
  }, [allVideos, history]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(g => g.filter(gl => gl.id !== goalId));
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

  return {
    queue,
    queueVideos,
    totalQueueMinutes,
    goals,
    history,
    watchedCount,
    likes,
    addToQueue,
    removeFromQueue,
    isInQueue,
    toggleLike,
    isLiked,
    markWatched,
    isWatched,
    createGoal,
    deleteGoal,
    getGoalDailyMinutes,
    clearQueue,
  };
}
