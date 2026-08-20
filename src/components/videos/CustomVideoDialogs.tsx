import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Plus, Trash2, Pencil, Check, X, Youtube } from "lucide-react";
import { CustomVideo, describeLinkError, extractYouTubeId } from "@/lib/customVideos";
import type { WatchQueueGoal } from "@/hooks/useWatchQueue";

export interface LinkDraft {
  url: string;
  title: string;
  durationMinutes: string;
}

export const emptyDraft: LinkDraft = { url: "", title: "", durationMinutes: "" };

/** Inline editor used inside the goal-creation dialog to attach external videos */
export function LinkDraftList({
  drafts,
  onChange,
}: {
  drafts: LinkDraft[];
  onChange: (drafts: LinkDraft[]) => void;
}) {
  const update = (i: number, patch: Partial<LinkDraft>) =>
    onChange(drafts.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  return (
    <div className="space-y-3">
      {drafts.map((draft, i) => {
        const error = draft.url.trim() ? describeLinkError(draft.url) : null;
        const ytId = extractYouTubeId(draft.url.trim());
        return (
          <div key={i} className="rounded-lg border p-3 space-y-2 bg-muted/20">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={draft.url}
                onChange={e => update(i, { url: e.target.value })}
                aria-label={`Video link ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                aria-label="Remove link"
                onClick={() => onChange(drafts.filter((_, idx) => idx !== i))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                className="col-span-2"
                placeholder="Title (optional)"
                value={draft.title}
                onChange={e => update(i, { title: e.target.value })}
                aria-label={`Video title ${i + 1}`}
              />
              <Input
                type="number"
                min={1}
                placeholder="Minutes"
                value={draft.durationMinutes}
                onChange={e => update(i, { durationMinutes: e.target.value })}
                aria-label={`Video length in minutes ${i + 1}`}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            {!error && ytId && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Youtube className="h-3.5 w-3.5 text-red-500" /> YouTube video detected
              </div>
            )}
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...drafts, { ...emptyDraft }])}>
        <Plus className="h-4 w-4 mr-1" /> Add video link
      </Button>
    </div>
  );
}

/** Standalone dialog to add one external video to the queue / a goal */
export function AddVideoLinkDialog({
  open,
  onOpenChange,
  categories,
  goals,
  defaultGoalId,
  defaultCategory,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  goals: WatchQueueGoal[];
  defaultGoalId?: string;
  defaultCategory: string;
  onAdd: (input: { url: string; title?: string; category: string; durationMinutes?: number; goalId?: string }) => void;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [goalId, setGoalId] = useState(defaultGoalId ?? "none");

  useEffect(() => {
    if (open) {
      setUrl("");
      setTitle("");
      setMinutes("");
      setCategory(defaultCategory);
      setGoalId(defaultGoalId ?? "none");
    }
  }, [open, defaultGoalId, defaultCategory]);

  const error = url.trim() ? describeLinkError(url) : null;
  const canSubmit = !!url.trim() && !error;

  const submit = () => {
    if (!canSubmit) return;
    onAdd({
      url: url.trim(),
      title: title.trim() || undefined,
      category,
      durationMinutes: minutes ? parseInt(minutes) : undefined,
      goalId: goalId === "none" ? undefined : goalId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" /> Add video by link
          </DialogTitle>
          <DialogDescription>
            Paste a YouTube, Vimeo, Dailymotion, Google Drive or direct video file link to build your own playlist.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="cv-url">Video link</Label>
            <Input
              id="cv-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cv-title">Title (optional)</Label>
            <Input id="cv-title" placeholder="e.g., Linear Algebra Lecture 1" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cv-min">Length (minutes)</Label>
              <Input id="cv-min" type="number" min={1} placeholder="20" value={minutes} onChange={e => setMinutes(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {goals.length > 0 && (
            <div className="space-y-1.5">
              <Label>Attach to goal</Label>
              <Select value={goalId} onValueChange={setGoalId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Queue only</SelectItem>
                  {goals.map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button className="w-full" onClick={submit} disabled={!canSubmit}>
            <Plus className="h-4 w-4 mr-2" /> Add to my playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Manage (rename / recategorize / delete) previously added external videos */
export function ManageCustomVideosDialog({
  open,
  onOpenChange,
  videos,
  categories,
  onUpdate,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videos: CustomVideo[];
  categories: string[];
  onUpdate: (id: string, patch: { title?: string; category?: string; durationMinutes?: number }) => void;
  onRemove: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState(categories[0] ?? "Programming");
  const [editMinutes, setEditMinutes] = useState("");

  const startEdit = (v: CustomVideo) => {
    setEditingId(v.id);
    setEditTitle(v.title);
    setEditCategory(v.category);
    setEditMinutes("");
  };

  const saveEdit = () => {
    if (!editingId) return;
    onUpdate(editingId, {
      title: editTitle,
      category: editCategory,
      durationMinutes: editMinutes ? parseInt(editMinutes) : undefined,
    });
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>My added videos</DialogTitle>
          <DialogDescription>Rename, recategorize or remove the videos you added by link.</DialogDescription>
        </DialogHeader>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">You haven't added any videos by link yet.</p>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {videos.map(v => (
              <div key={v.id} className="rounded-lg border p-3 space-y-2">
                {editingId === v.id ? (
                  <div className="space-y-2">
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} aria-label="Video title" />
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={editCategory} onValueChange={setEditCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={1}
                        placeholder={`Minutes (${v.duration})`}
                        value={editMinutes}
                        onChange={e => setEditMinutes(e.target.value)}
                        aria-label="Video length in minutes"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}><Check className="h-4 w-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.externalUrl}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{v.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">{v.duration}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit video" onClick={() => startEdit(v)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label="Remove video" onClick={() => onRemove(v.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
