import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserMinus, Loader2 } from "lucide-react";

interface FollowersFollowingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialTab?: "followers" | "following";
}

interface FollowUser {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  relationship_id: string;
}

export function FollowersFollowingDialog({
  open,
  onOpenChange,
  userId,
  initialTab = "followers",
}: FollowersFollowingDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialTab);
  const isOwnProfile = user?.id === userId;

  // Reset tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Fetch followers list
  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followersList", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get all users who follow this user
      const { data: followerRelations, error: relError } = await supabase
        .from("followers")
        .select("id, follower_id")
        .eq("following_id", userId);

      if (relError) throw relError;
      if (!followerRelations || followerRelations.length === 0) return [];

      // Get profile info for each follower
      const followerIds = followerRelations.map((f) => f.follower_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", followerIds);

      if (profileError) throw profileError;

      return followerRelations.map((rel) => {
        const profile = profiles?.find((p) => p.user_id === rel.follower_id);
        return {
          id: rel.follower_id,
          user_id: rel.follower_id,
          full_name: profile?.full_name || "Anonymous",
          avatar_url: profile?.avatar_url || null,
          relationship_id: rel.id,
        } as FollowUser;
      });
    },
    enabled: open && !!userId && isOwnProfile,
  });

  // Fetch following list
  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["followingList", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get all users this user follows
      const { data: followingRelations, error: relError } = await supabase
        .from("followers")
        .select("id, following_id")
        .eq("follower_id", userId);

      if (relError) throw relError;
      if (!followingRelations || followingRelations.length === 0) return [];

      // Get profile info for each following
      const followingIds = followingRelations.map((f) => f.following_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", followingIds);

      if (profileError) throw profileError;

      return followingRelations.map((rel) => {
        const profile = profiles?.find((p) => p.user_id === rel.following_id);
        return {
          id: rel.following_id,
          user_id: rel.following_id,
          full_name: profile?.full_name || "Anonymous",
          avatar_url: profile?.avatar_url || null,
          relationship_id: rel.id,
        } as FollowUser;
      });
    },
    enabled: open && !!userId && isOwnProfile,
  });

  // Remove follower (for own profile)
  const removeFollower = async (relationshipId: string, followerName: string) => {
    try {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("id", relationshipId);

      if (error) throw error;

      toast({ title: `Removed ${followerName} from followers` });
      
      // Invalidate all related queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ["followersList", userId] });
      queryClient.invalidateQueries({ queryKey: ["followerCount", userId] });
      queryClient.invalidateQueries({ queryKey: ["profileStats", userId] });
    } catch (error: any) {
      toast({
        title: "Failed to remove follower",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Unfollow user
  const unfollowUser = async (followingId: string, relationshipId: string, userName: string) => {
    try {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("id", relationshipId);

      if (error) throw error;

      toast({ title: `Unfollowed ${userName}` });
      
      // Invalidate all related queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ["followingList", userId] });
      queryClient.invalidateQueries({ queryKey: ["followingCount", userId] });
      queryClient.invalidateQueries({ queryKey: ["followerCount", followingId] });
      queryClient.invalidateQueries({ queryKey: ["profileStats", userId] });
      queryClient.invalidateQueries({ queryKey: ["isFollowing", userId, followingId] });
    } catch (error: any) {
      toast({
        title: "Failed to unfollow",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderUserList = (
    users: FollowUser[] | undefined,
    isLoading: boolean,
    type: "followers" | "following"
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {type === "followers"
            ? "No followers yet"
            : "Not following anyone yet"}
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Link
                to={`/profile/${user.user_id}`}
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => onOpenChange(false)}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">
                  {user.full_name || "Anonymous"}
                </span>
              </Link>

              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => {
                    if (type === "followers") {
                      removeFollower(user.relationship_id, user.full_name || "user");
                    } else {
                      unfollowUser(user.user_id, user.relationship_id, user.full_name || "user");
                    }
                  }}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  // Only allow viewing if it's own profile
  if (!isOwnProfile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "followers" | "following")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers ({followers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="following">
              Following ({following?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="mt-4">
            {renderUserList(followers, isLoadingFollowers, "followers")}
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            {renderUserList(following, isLoadingFollowing, "following")}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}