import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCommunityMembership } from "@/hooks/useCommunityMembership";
import { useCommunityRole } from "@/hooks/useCommunityRole";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import {
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  Hash,
  Award,
  Send,
  Crown,
  Shield,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Community = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  logo: string | null;
  banner: string | null;
  created_at: string;
  created_by: string | null;
  is_private: boolean;
};

type TabProps = { 
  communityId: string; 
  isMember: boolean; 
  toggleMembership?: () => Promise<void> | void;
  isAdmin: boolean;
};

/* ---------- Feed Tab ---------- */
const FeedTab: React.FC<TabProps> = ({ communityId, isMember, toggleMembership }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["community-feed", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles!posts_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId && isMember,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [posts]);

  const handlePost = async () => {
    if (!newPost.trim() || !communityId || !isMember) return;
    const content = newPost.trim();
    const title = content.slice(0, 60) || "Post";

    setNewPost("");

    const { error } = await supabase
      .from("posts")
      .insert({ community_id: communityId, user_id: user?.id, title, content });

    if (error) {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    } else {
      refetch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Join the community to view and participate in conversations</p>
        <Button onClick={toggleMembership}>Join Community</Button>
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-8">Loading messages...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-background rounded-lg border">
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
        style={{ scrollbarGutter: "stable" }}
      >
        {(!posts || posts.length === 0) && (
          <div className="text-center text-muted-foreground mt-8">
            No messages yet. Start the conversation! 👋
          </div>
        )}

        {posts?.map((p: any) => {
          const isMe = user?.id && p.user_id === user.id;
          return (
            <div key={p.id} className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{p.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}

              <div className="max-w-[70%]">
                {!isMe && <p className="text-xs text-muted-foreground mb-1 ml-1">{p.profiles?.full_name || "Unknown"}</p>}
                <div className={`px-4 py-2 rounded-2xl break-words ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground border rounded-bl-sm"
                }`}>
                  {p.content}
                </div>
                <div className={`text-[10px] mt-1 px-1 text-muted-foreground ${isMe ? "text-right" : "text-left"}`}>
                  {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                </div>
              </div>

              {isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{p.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm min-h-[44px] max-h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Type a message... (Enter to send)"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handlePost} size="icon" className="h-11 w-11" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Questions Tab ---------- */
const QuestionsTab: React.FC<TabProps> = ({ communityId, isMember }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");

  const { data: questions, isLoading, refetch } = useQuery({
    queryKey: ["community-questions", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_questions")
        .select("*, profiles!community_questions_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId && isMember,
  });

  const handleAsk = async () => {
    if (!question.trim()) return;
    const { error } = await supabase.from("community_questions").insert({
      community_id: communityId,
      user_id: user?.id,
      question,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setQuestion("");
      toast({ title: "Question posted" });
      refetch();
    }
  };

  if (!isMember) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Join the community to ask questions
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-8">Loading questions...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button onClick={handleAsk}>Ask</Button>
          </div>
        </CardContent>
      </Card>

      {questions && questions.length ? (
        questions.map((q: any) => (
          <Card key={q.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={q.profiles?.avatar_url || ""} />
                  <AvatarFallback>{q.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{q.profiles?.full_name || "Anonymous"}</p>
                  <p className="mt-1">{q.question}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No questions yet. Be the first to ask!</p>
      )}
    </div>
  );
};

/* ---------- Resources Tab ---------- */
const ResourcesTab: React.FC<TabProps> = ({ communityId, isMember }) => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["community-resources", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_resources")
        .select("*, profiles!community_resources_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId && isMember,
  });

  if (!isMember) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Join the community to access resources
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-8">Loading resources...</div>;

  return (
    <div className="space-y-4">
      {isMember && (
        <Card>
          <CardContent className="p-4">
            <Link to={`/communities/${communityId}/resources/new`}>
              <Button className="w-full">Share a Resource</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {resources && resources.length > 0 ? (
        resources.map((r: any) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {r.title}
                  </a>
                  {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={r.profiles?.avatar_url || ""} />
                      <AvatarFallback className="text-[10px]">{r.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      Shared by {r.profiles?.full_name || "Unknown"} • {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No resources shared yet.</p>
      )}
    </div>
  );
};

/* ---------- Members Tab ---------- */
const MembersTab: React.FC<TabProps> = ({ communityId, isMember }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["community-members-with-roles", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_member_roles")
        .select("user_id, role, assigned_at, profiles!community_member_roles_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("role", { ascending: true })
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId && isMember,
  });

  if (!isMember) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Join the community to see members
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-8">Loading members...</div>;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator": return <Shield className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      {members && members.length > 0 ? (
        members.map((m: any) => (
          <Card key={m.user_id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.profiles?.avatar_url || ""} />
                  <AvatarFallback>{m.profiles?.full_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{m.profiles?.full_name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDistanceToNow(new Date(m.assigned_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getRoleIcon(m.role)}
                <Badge variant={m.role === "admin" ? "default" : m.role === "moderator" ? "secondary" : "outline"}>
                  {m.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No members found</p>
      )}
    </div>
  );
};

/* ---------- Main Component ---------- */
const CommunityFeed: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");

  const { isMember, isLoadingMembershipStatus, toggleMembership } = useCommunityMembership(communityId || "");
  const { data: userRole } = useCommunityRole(communityId);
  const { data: stats } = useCommunityStats(communityId);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    document.title = "Community • Feed";
  }, []);

  const { data: community, isLoading: loadingCommunity, error: communityError } = useQuery<Community, Error>({
    queryKey: ["community", communityId],
    queryFn: async () => {
      if (!communityId) throw new Error("Community ID is required");
      const { data: c, error: cErr } = await supabase
        .from("communities")
        .select("*")
        .eq("id", communityId)
        .single();
      if (cErr) throw cErr;
      return c;
    },
    enabled: Boolean(communityId),
  });

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    await toggleMembership();
    toast({ title: "Left the community" });
  };

  if (loadingCommunity || isLoadingMembershipStatus) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">Loading...</div>
      </Layout>
    );
  }

  if (communityError) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-destructive">Failed to load community.</div>
      </Layout>
    );
  }

  if (!isMember && !loadingCommunity) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={community?.logo || community?.image || undefined} />
                  <AvatarFallback className="text-2xl">{community?.name?.[0] || "C"}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{community?.name}</CardTitle>
              <Badge variant="secondary" className="mt-2">{community?.category}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{community?.description}</p>
              <div className="flex items-center justify-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {stats?.memberCount || 0} members
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {stats?.recentPosts || 0} posts/week
                </div>
              </div>
              <Button onClick={toggleMembership} size="lg" disabled={isLoadingMembershipStatus}>
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {community?.banner && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
            <img src={community.banner} alt={community.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={community?.logo || community?.image || undefined} />
                    <AvatarFallback>{community?.name?.[0] || "C"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-lg">{community?.name}</h2>
                    <Badge variant="secondary" className="text-xs">{community?.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>{community?.description}</p>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{stats?.memberCount || 0}</span> members
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">{stats?.recentPosts || 0}</span> posts this week
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Created {community?.created_at && formatDistanceToNow(new Date(community.created_at), { addSuffix: true })}
                  </div>
                </div>
                
                {stats?.topContributors && stats.topContributors.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">Top Contributors</span>
                      </div>
                      <div className="space-y-2">
                        {stats.topContributors.map((contributor) => (
                          <div key={contributor.userId} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={contributor.avatar || ""} />
                              <AvatarFallback className="text-xs">{contributor.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{contributor.name}</span>
                            <Badge variant="outline" className="ml-auto text-xs">{contributor.postCount}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <div className="space-y-2">
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/communities/${communityId}/settings`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" className="w-full" onClick={handleLeaveCommunity}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="feed">
                  <MessageSquare className="h-4 w-4 mr-2" /> Feed
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <MessageSquare className="h-4 w-4 mr-2" /> Q&A
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <BookOpen className="h-4 w-4 mr-2" /> Resources
                </TabsTrigger>
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" /> Members
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed">
                <FeedTab communityId={communityId || ""} isMember={isMember} toggleMembership={toggleMembership} isAdmin={isAdmin} />
              </TabsContent>
              <TabsContent value="questions">
                <QuestionsTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>
              <TabsContent value="resources">
                <ResourcesTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>
              <TabsContent value="members">
                <MembersTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityFeed;