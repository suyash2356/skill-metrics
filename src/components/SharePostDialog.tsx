import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Check, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SharePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
}

type Target =
    | {
        kind: "user";
        id: string; // user_id
        name: string;
        avatar_url: string | null;
    }
    | {
        kind: "group";
        id: string; // conversation_id
        name: string;
        avatar_url: string | null;
        memberCount: number;
    };

export const SharePostDialog = ({ open, onOpenChange, postId }: SharePostDialogProps) => {
    const [query, setQuery] = useState("");
    const [targets, setTargets] = useState<Target[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set()); // key = `${kind}:${id}`
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (open && user) {
            fetchTargets();
        } else {
            setQuery("");
            setSelected(new Set());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user]);

    const fetchTargets = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // ---- Mutual followers (1:1 targets) ----
            const { data: following } = await supabase
                .from("followers")
                .select("following_id")
                .eq("follower_id", user.id);
            const followingIds = (following || []).map((f) => f.following_id);

            let mutualProfiles: { user_id: string; full_name: string | null; avatar_url: string | null }[] = [];
            if (followingIds.length > 0) {
                const { data: mutuals } = await supabase
                    .from("followers")
                    .select("follower_id")
                    .eq("following_id", user.id)
                    .in("follower_id", followingIds);
                const mutualIds = (mutuals || []).map((m) => m.follower_id);
                if (mutualIds.length > 0) {
                    const { data: profiles } = await supabase
                        .from("profiles")
                        .select("user_id, full_name, avatar_url")
                        .in("user_id", mutualIds);
                    mutualProfiles = profiles || [];
                }
            }

            // ---- Group conversations the user is in ----
            const { data: myParts } = await supabase
                .from("conversation_participants")
                .select("conversation_id")
                .eq("user_id", user.id);
            const convIds = (myParts || []).map((p) => p.conversation_id);

            let groups: Target[] = [];
            if (convIds.length > 0) {
                const { data: convs } = await supabase
                    .from("conversations")
                    .select("id, is_group, group_name, group_avatar_url")
                    .in("id", convIds)
                    .eq("is_group", true);

                const groupIds = (convs || []).map((c) => c.id);
                const countMap: Record<string, number> = {};
                if (groupIds.length > 0) {
                    const { data: allParts } = await supabase
                        .from("conversation_participants")
                        .select("conversation_id")
                        .in("conversation_id", groupIds);
                    (allParts || []).forEach((p) => {
                        countMap[p.conversation_id] = (countMap[p.conversation_id] || 0) + 1;
                    });
                }

                groups = (convs || []).map((c) => ({
                    kind: "group" as const,
                    id: c.id,
                    name: c.group_name || "Group",
                    avatar_url: c.group_avatar_url,
                    memberCount: countMap[c.id] || 0,
                }));
            }

            const users: Target[] = mutualProfiles.map((p) => ({
                kind: "user" as const,
                id: p.user_id,
                name: p.full_name || "Unknown",
                avatar_url: p.avatar_url,
            }));

            // Groups first, then mutuals
            setTargets([...groups, ...users]);
        } catch (error) {
            console.error("Error fetching share targets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const keyOf = (t: Target) => `${t.kind}:${t.id}`;

    const handleSelect = (t: Target) => {
        const k = keyOf(t);
        const next = new Set(selected);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        setSelected(next);
    };

    const handleSend = async () => {
        if (!user || selected.size === 0) return;
        setIsSending(true);

        try {
            const chosen = targets.filter((t) => selected.has(keyOf(t)));

            await Promise.all(
                chosen.map(async (t) => {
                    let conversationId: string;

                    if (t.kind === "group") {
                        conversationId = t.id;
                    } else {
                        const { data: convId, error: convError } = await supabase.rpc(
                            "find_or_create_conversation",
                            { _user1: user.id, _user2: t.id }
                        );
                        if (convError) throw convError;
                        conversationId = convId as string;
                    }

                    const { error: msgError } = await supabase.from("messages").insert({
                        conversation_id: conversationId,
                        sender_id: user.id,
                        content: "",
                        message_type: "post_share",
                        shared_post_id: postId,
                    });
                    if (msgError) throw msgError;
                })
            );

            toast({
                title: "Sent!",
                description: `Post shared with ${selected.size} chat${selected.size > 1 ? "s" : ""}`,
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error sharing post:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to share post. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const filtered = targets.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background">
                <DialogHeader className="px-4 py-3 border-b">
                    <DialogTitle className="text-center font-semibold text-lg">Share</DialogTitle>
                </DialogHeader>

                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search people or groups"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto px-2 py-2">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading chats...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                            <p className="text-sm">No chats found.</p>
                            <p className="text-xs opacity-70 mt-1">Follow mutuals or join a group to share.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map((t) => {
                                const k = keyOf(t);
                                const isSelected = selected.has(k);
                                return (
                                    <div
                                        key={k}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => handleSelect(t)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={t.avatar_url || undefined} />
                                                <AvatarFallback className={t.kind === "group" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}>
                                                    {t.kind === "group" ? <Users className="h-5 w-5" /> : t.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm flex items-center gap-1.5">
                                                    {t.name}
                                                    {t.kind === "group" && <Users className="h-3 w-3 text-muted-foreground" />}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {t.kind === "group"
                                                        ? `${t.memberCount} member${t.memberCount === 1 ? "" : "s"}`
                                                        : `@${t.name.replace(/\s/g, "").toLowerCase()}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                                            {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-muted/20">
                    <Button
                        className="w-full"
                        disabled={selected.size === 0 || isSending}
                        onClick={handleSend}
                    >
                        {isSending ? (
                            "Sending..."
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send {selected.size > 0 ? `(${selected.size})` : ""}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
