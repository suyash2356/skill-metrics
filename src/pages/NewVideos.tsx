import { useState, useCallback, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play, Clock, Eye, Heart, Search, Plus, Check, X,
  ListVideo, Target, Flame, TrendingUp, Timer, Trash2,
  ChevronRight, Sparkles, GripVertical, CheckCircle2
} from "lucide-react";
import { videos, VideoData, parseViewCount, parseDurationMinutes } from "@/lib/videosData";
import { useWatchQueue } from "@/hooks/useWatchQueue";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "All", "Programming", "AI/ML", "Design", "Data Science", "Finance",
  "Psychology", "Science", "Motivation", "Career", "Productivity",
  "Wellbeing", "Exam Prep", "Education", "Business", "Technology"
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "shortest", label: "Shortest First" },
  { value: "longest", label: "Longest First" },
];

const NewVideos = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Programming");
  const [goalDays, setGoalDays] = useState("30");
  const [activeTab, setActiveTab] = useState("browse");

  const wq = useWatchQueue(videos);

  const filteredVideos = useMemo(() => {
    let list = activeCategory === "All" ? videos : videos.filter(v => v.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "popular": return [...list].sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views));
      case "newest": return list;
      case "shortest": return [...list].sort((a, b) => parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration));
      case "longest": return [...list].sort((a, b) => parseDurationMinutes(b.duration) - parseDurationMinutes(a.duration));
      default: return list;
    }
  }, [activeCategory, searchQuery, sortBy]);

  const handleCreateGoal = () => {
    if (!goalTitle.trim()) return;
    wq.createGoal(goalTitle, goalCategory, parseInt(goalDays));
    setShowGoalDialog(false);
    setGoalTitle("");
    setActiveTab("queue");
  };

  const formatMinutes = (m: number) => {
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Video Learning Hub</h1>
          <p className="text-muted-foreground mt-1">
            Set goals, build watch queues, and learn at your pace
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Flame className="h-4 w-4" />} label="Videos Available" value={videos.length.toString()} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Watched" value={wq.watchedCount.toString()} />
          <StatCard icon={<ListVideo className="h-4 w-4" />} label="In Queue" value={wq.queue.length.toString()} />
          <StatCard icon={<Timer className="h-4 w-4" />} label="Queue Time" value={formatMinutes(wq.totalQueueMinutes)} />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="browse" className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Browse
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-1.5">
              <ListVideo className="h-3.5 w-3.5" /> My Queue
              {wq.queue.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-[10px]">
                  {wq.queue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> Goals
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="mt-0">
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos, channels..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Pills */}
            <ScrollArea className="w-full mb-6">
              <div className="flex space-x-2 pb-2">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={cat === activeCategory ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground whitespace-nowrap transition-colors"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </ScrollArea>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
            </p>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <VideoCard
                      video={video}
                      isInQueue={wq.isInQueue(video.id)}
                      isLiked={wq.isLiked(video.id)}
                      isWatched={wq.isWatched(video.id)}
                      onToggleQueue={() => wq.isInQueue(video.id) ? wq.removeFromQueue(video.id) : wq.addToQueue(video.id)}
                      onToggleLike={() => wq.toggleLike(video.id)}
                      onPlay={() => setActiveVideo(video)}
                      onMarkWatched={() => wq.markWatched(video.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-lg font-medium">No videos found</p>
                <p className="text-sm text-muted-foreground">Try a different search or category</p>
              </div>
            )}
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="mt-0">
            {wq.queueVideos.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-muted/20">
                <ListVideo className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-lg font-medium">Your queue is empty</p>
                <p className="text-sm text-muted-foreground mb-4">Add videos from the Browse tab or create a learning goal</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("browse")}>Browse Videos</Button>
                  <Button onClick={() => setShowGoalDialog(true)}>
                    <Target className="h-4 w-4 mr-2" /> Set a Goal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {wq.queue.length} videos · {formatMinutes(wq.totalQueueMinutes)} total
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setActiveVideo(wq.queueVideos[0])}>
                      <Play className="h-4 w-4 mr-1" /> Play Next
                    </Button>
                    <Button size="sm" variant="ghost" onClick={wq.clearQueue}>
                      <Trash2 className="h-4 w-4 mr-1" /> Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {wq.queueVideos.map((video, i) => (
                    <motion.div
                      key={video.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <QueueItem
                        video={video}
                        index={i + 1}
                        isWatched={wq.isWatched(video.id)}
                        onPlay={() => setActiveVideo(video)}
                        onRemove={() => wq.removeFromQueue(video.id)}
                        onMarkWatched={() => wq.markWatched(video.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Learning Goals</h2>
              <Button onClick={() => setShowGoalDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" /> New Goal
              </Button>
            </div>

            {wq.goals.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-muted/20">
                <Target className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-lg font-medium">No goals yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Set a learning goal like "Learn Python in 30 days" and we'll build your watch queue automatically
                </p>
                <Button onClick={() => setShowGoalDialog(true)}>
                  <Sparkles className="h-4 w-4 mr-2" /> Create Your First Goal
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {wq.goals.map(goal => {
                  const progress = goal.videoIds.length > 0
                    ? Math.round((goal.completedIds.length / goal.videoIds.length) * 100)
                    : 0;
                  const dailyMin = wq.getGoalDailyMinutes(goal);
                  const daysElapsed = Math.floor((Date.now() - goal.createdAt) / 86400000);
                  const daysLeft = Math.max(0, goal.targetDays - daysElapsed);

                  return (
                    <Card key={goal.id} className="overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{goal.title}</h3>
                            <Badge variant="outline" className="mt-1">{goal.category}</Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => wq.deleteGoal(goal.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{goal.completedIds.length}/{goal.videoIds.length} videos</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/40 rounded-lg p-2 text-center">
                            <p className="text-muted-foreground">Days Left</p>
                            <p className="text-lg font-bold">{daysLeft}</p>
                          </div>
                          <div className="bg-muted/40 rounded-lg p-2 text-center">
                            <p className="text-muted-foreground">Daily Target</p>
                            <p className="text-lg font-bold">{formatMinutes(dailyMin)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Video Player Modal */}
        <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {activeVideo && (
              <div>
                <div className="aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold leading-tight">{activeVideo.title}</h2>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={activeVideo.channel_avatar} />
                        <AvatarFallback>{activeVideo.channel[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{activeVideo.channel}</span>
                      <Badge variant="outline">{activeVideo.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={wq.isWatched(activeVideo.id) ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => wq.markWatched(activeVideo.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {wq.isWatched(activeVideo.id) ? "Watched" : "Mark Watched"}
                      </Button>
                      <Button
                        variant={wq.isInQueue(activeVideo.id) ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => wq.isInQueue(activeVideo.id) ? wq.removeFromQueue(activeVideo.id) : wq.addToQueue(activeVideo.id)}
                      >
                        {wq.isInQueue(activeVideo.id) ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                        Queue
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => wq.toggleLike(activeVideo.id)}
                      >
                        <Heart className={`h-4 w-4 ${wq.isLiked(activeVideo.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Goal Dialog */}
        <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Create Learning Goal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Goal Name</label>
                <Input
                  placeholder="e.g., Master Python Basics"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={goalCategory} onValueChange={setGoalCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map(c => (
                      <SelectItem key={c} value={c}>{c} ({videos.filter(v => v.category === c).length} videos)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Complete in (days)</label>
                <Select value={goalDays} onValueChange={setGoalDays}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreateGoal} disabled={!goalTitle.trim()}>
                <Target className="h-4 w-4 mr-2" /> Create Goal & Build Queue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// --- Sub-components ---

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-3 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

function VideoCard({
  video, isInQueue, isLiked, isWatched, onToggleQueue, onToggleLike, onPlay, onMarkWatched
}: {
  video: VideoData;
  isInQueue: boolean;
  isLiked: boolean;
  isWatched: boolean;
  onToggleQueue: () => void;
  onToggleLike: () => void;
  onPlay: () => void;
  onMarkWatched: () => void;
}) {
  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-lg ${isWatched ? "opacity-70" : ""}`}>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative cursor-pointer" onClick={onPlay}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3">
              <Play className="h-5 w-5 fill-current" />
            </div>
          </div>
          <Badge className="absolute top-2 left-2 text-[10px]" variant="secondary">{video.category}</Badge>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-1.5 py-0.5 rounded text-[11px] font-medium">
            {video.duration}
          </div>
          {isWatched && (
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="h-5 w-5 text-green-400 drop-shadow" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-medium text-sm mb-2 leading-snug line-clamp-2 cursor-pointer" onClick={onPlay}>
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={video.channel_avatar} />
              <AvatarFallback className="text-[9px]">{video.channel[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{video.channel}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{video.views.replace(" views", "")}</span>
              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{video.upload_time}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleLike}>
                <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${isInQueue ? "text-primary" : ""}`}
                onClick={onToggleQueue}
              >
                {isInQueue ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueItem({
  video, index, isWatched, onPlay, onRemove, onMarkWatched
}: {
  video: VideoData;
  index: number;
  isWatched: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onMarkWatched: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors group ${isWatched ? "opacity-60" : ""}`}>
      <span className="text-sm font-medium text-muted-foreground w-6 text-center shrink-0">{index}</span>
      <img
        src={video.thumbnail}
        alt={video.title}
        className="h-16 w-28 rounded object-cover shrink-0 cursor-pointer"
        onClick={onPlay}
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate cursor-pointer" onClick={onPlay}>{video.title}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{video.channel}</span>
          <span>·</span>
          <span>{video.duration}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onMarkWatched} title="Mark watched">
          <CheckCircle2 className={`h-4 w-4 ${isWatched ? "text-green-500" : ""}`} />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onRemove} title="Remove">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default NewVideos;
