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
import { Search, Send, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SharePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
}

interface Profile {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
}

export const SharePostDialog = ({ open, onOpenChange, postId }: SharePostDialogProps) => {
    const [query, setQuery] = useState("");
    const [friends, setFriends] = useState<Profile[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (open && user) {
            fetchMutualFriends();
        } else {
            // Reset state when closed
            setQuery("");
            setSelectedUsers(new Set());
        }
    }, [open, user]);

    const fetchMutualFriends = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // 1. Get people I follow
            const { data: following } = await supabase
                .from("followers") // Changed from 'follows'
                .select("following_id")
                .eq("follower_id", user.id);

            const followingIds = (following || []).map((f) => f.following_id);

            if (followingIds.length === 0) {
                setFriends([]);
                return;
            }

            // 2. Get people who follow me back (from the list of people I follow)
            const { data: mutuals } = await supabase
                .from("followers") // Changed from 'follows'
                .select("follower_id")
                .eq("following_id", user.id)
                .in("follower_id", followingIds);

            const mutualIds = (mutuals || []).map((m) => m.follower_id);

            if (mutualIds.length === 0) {
                setFriends([]);
                return;
            }

            // 3. Get profile details
            const { data: profiles } = await supabase
                .from("profiles")
                .select("user_id, full_name, avatar_url")
                .in("user_id", mutualIds);

            setFriends(profiles || []);
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const handleSend = async () => {
        if (!user || selectedUsers.size === 0) return;
        setIsSending(true);

        try {
            const selectedIds = Array.from(selectedUsers);

            // Process each selected user
            const promises = selectedIds.map(async (recipientId) => {
                // 1. Find or create conversation
                const { data: conversationId, error: convError } = await supabase.rpc(
                    'find_or_create_conversation',
                    { _user1: user.id, _user2: recipientId }
                );

                if (convError) throw convError;

                // 2. Send the shared post message
                const { error: msgError } = await supabase.from('messages').insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: '', // Empty content for post share type
                    message_type: 'post_share',
                    shared_post_id: postId,
                });

                if (msgError) throw msgError;
            });

            await Promise.all(promises);

            toast({
                title: "Sent!",
                description: `Post shared with ${selectedUsers.size} friend${selectedUsers.size > 1 ? 's' : ''}`,
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error sharing post:", error);
            toast({
                title: "Error",
                description: "Failed to share post. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const filteredFriends = friends.filter((friend) =>
        (friend.full_name || "").toLowerCase().includes(query.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background">
                <DialogHeader className="px-4 py-3 border-b">
                    <DialogTitle className="text-center font-semibold text-lg">Share</DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="max-h-[300px] overflow-y-auto px-2 py-2">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading friends...</div>
                    ) : filteredFriends.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                            <p className="text-sm">No mutual friends found.</p>
                            <p className="text-xs opacity-70 mt-1">Follow people who follow you back to chat!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredFriends.map((friend) => {
                                const isSelected = selectedUsers.has(friend.user_id);
                                return (
                                    <div
                                        key={friend.user_id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => handleSelect(friend.user_id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={friend.avatar_url || undefined} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {(friend.full_name || "U").charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{friend.full_name || "Unknown"}</span>
                                                <span className="text-xs text-muted-foreground">@{friend.full_name?.replace(/\s/g, '').toLowerCase()}</span>
                                            </div>
                                        </div>

                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                            ? "bg-primary border-primary"
                                            : "border-muted-foreground/30"
                                            }`}>
                                            {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/20">
                    <Button
                        className="w-full"
                        disabled={selectedUsers.size === 0 || isSending}
                        onClick={handleSend}
                    >
                        {isSending ? (
                            "Sending..."
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send {selectedUsers.size > 0 ? `(${selectedUsers.size})` : ''}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
