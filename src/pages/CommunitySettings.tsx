import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Crown, Shield, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CommunitySettings = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    is_private: false,
  });

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ["userRole", communityId, user?.id],
    queryFn: async () => {
      if (!user || !communityId) return null;
      const { data } = await supabase
        .from("community_member_roles")
        .select("role")
        .eq("community_id", communityId)
        .eq("user_id", user.id)
        .single();
      return data?.role || null;
    },
    enabled: !!user && !!communityId,
  });

  const isAdmin = userRole === "admin";

  // Fetch community data
  const { data: community, isLoading } = useQuery({
    queryKey: ["community", communityId],
    queryFn: async () => {
      if (!communityId) throw new Error("Community ID required");
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", communityId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!communityId,
  });

  // Fetch members with roles
  const { data: members } = useQuery({
    queryKey: ["communityMembersWithRoles", communityId],
    queryFn: async () => {
      if (!communityId) return [];
      const { data, error } = await supabase
        .from("community_member_roles")
        .select(`
          user_id,
          role,
          assigned_at,
          profiles!community_member_roles_user_id_fkey(full_name, avatar_url)
        `)
        .eq("community_id", communityId)
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!communityId && isAdmin,
  });

  useEffect(() => {
    if (community) {
      setFormData({
        name: community.name || "",
        description: community.description || "",
        category: community.category || "",
        is_private: community.is_private || false,
      });
    }
  }, [community]);

  useEffect(() => {
    if (!isLoading && !isAdmin && userRole !== null) {
      toast({ title: "Access denied", description: "Only admins can access settings", variant: "destructive" });
      navigate(`/communities/${communityId}/feed`);
    }
  }, [isAdmin, userRole, isLoading, navigate, communityId, toast]);

  const updateCommunityMutation = useMutation({
    mutationFn: async () => {
      if (!communityId) throw new Error("Community ID required");
      const { error } = await supabase
        .from("communities")
        .update(formData)
        .eq("id", communityId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Community updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update community", description: error.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: "admin" | "moderator" | "member" }) => {
      if (!communityId) throw new Error("Community ID required");
      const { error } = await supabase
        .from("community_member_roles")
        .update({ role: newRole })
        .eq("community_id", communityId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Role updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["communityMembersWithRoles", communityId] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    },
  });

  const deleteCommunityMutation = useMutation({
    mutationFn: async () => {
      if (!communityId) throw new Error("Community ID required");
      const { error } = await supabase
        .from("communities")
        .delete()
        .eq("id", communityId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Community deleted successfully" });
      navigate("/communities");
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete community", description: error.message, variant: "destructive" });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator": return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(`/communities/${communityId}/feed`)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Community
        </Button>

        <h1 className="text-3xl font-bold mb-6">Community Settings</h1>

        {/* Basic Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="private">Private Community</Label>
              <Switch
                id="private"
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
              />
            </div>
            <Button onClick={() => updateCommunityMutation.mutate()} disabled={updateCommunityMutation.isPending}>
              {updateCommunityMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Member Roles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manage Member Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members?.map((member: any) => (
                <div key={member.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profiles?.avatar_url || ""} />
                      <AvatarFallback>
                        {member.profiles?.full_name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.profiles?.full_name || "Unknown"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleIcon(member.role)}
                        <span className="text-sm text-muted-foreground capitalize">{member.role}</span>
                      </div>
                    </div>
                  </div>
                  {member.user_id !== user?.id && (
                    <Select
                      value={member.role}
                      onValueChange={(value) => updateRoleMutation.mutate({ userId: member.user_id, newRole: value as "admin" | "moderator" | "member" })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Community
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the community and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteCommunityMutation.mutate()}>
                    Delete Community
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommunitySettings;