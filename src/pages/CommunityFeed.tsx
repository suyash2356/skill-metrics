import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Send,
  Crown,
  Shield,
  Trash2,
  Paperclip,
  Award,
} from "lucide-react";
import { format } from "date-fns";

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

/* ---------- Feed Tab (Real-time Messages) ---------- */
const FeedTab: React.FC<TabProps> = ({ communityId, isMember, toggleMembership }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["community-messages", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_messages")
        .select("*, profiles!community_messages_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId && isMember,
  });

  // Real-time subscription
  useEffect(() => {
    if (!communityId || !isMember) return;

    const channel = supabase
      .channel(`community-messages-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["community-messages", communityId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId, isMember, queryClient]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("community_messages")
        .insert({ community_id: communityId, user_id: user?.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
    },
    onError: (error: any) => {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("community_messages")
        .delete()
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Message deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting message", description: error.message, variant: "destructive" });
    },
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)]">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
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
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20"
      >
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
            <p>No messages yet. Start the conversation! 👋</p>
          </div>
        )}

        {messages?.map((msg: any) => {
          const isMe = user?.id && msg.user_id === user.id;
          return (
            <div key={msg.id} className={`flex items-start gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{msg.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                {!isMe && <p className="text-xs text-muted-foreground mb-1 px-1">{msg.profiles?.full_name || "Unknown"}</p>}
                <div className="group relative">
                  <div className={`px-4 py-2 rounded-2xl break-words ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                  {isMe && (
                    <button
                      onClick={() => deleteMessageMutation.mutate(msg.id)}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                      aria-label="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className={`text-[10px] mt-0.5 px-1 text-muted-foreground ${isMe ? "text-right" : "text-left"}`}>
                  {format(new Date(msg.created_at), "HH:mm")}
                </div>
              </div>

              {isMe && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{msg.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <textarea
            className="flex-1 resize-none rounded-2xl border bg-background px-4 py-3 text-sm min-h-[44px] max-h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-11 w-11 rounded-full flex-shrink-0"
            disabled={!newMessage.trim()}
          >
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
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState("");

  const { data: questions, isLoading } = useQuery({
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

  const askMutation = useMutation({
    mutationFn: async (questionText: string) => {
      const { error } = await supabase.from("community_questions").insert({
        community_id: communityId,
        user_id: user?.id,
        question: questionText,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setQuestion("");
      toast({ title: "Question posted" });
      queryClient.invalidateQueries({ queryKey: ["community-questions", communityId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase
        .from("community_questions")
        .delete()
        .eq("id", questionId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Question deleted" });
      queryClient.invalidateQueries({ queryKey: ["community-questions", communityId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleAsk = () => {
    if (!question.trim()) return;
    askMutation.mutate(question.trim());
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
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <Button onClick={handleAsk} disabled={!question.trim()}>Ask</Button>
          </div>
        </CardContent>
      </Card>

      {questions && questions.length ? (
        questions.map((q: any) => (
          <Card key={q.id} className="group">
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
                    {format(new Date(q.created_at), "MMM d, yyyy 'at' HH:mm")}
                  </span>
                </div>
                {user?.id === q.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteMutation.mutate(q.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
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
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase
        .from("community_resources")
        .delete()
        .eq("id", resourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Resource deleted" });
      queryClient.invalidateQueries({ queryKey: ["community-resources", communityId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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
          <Card key={r.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium break-words"
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
                      Shared by {r.profiles?.full_name || "Unknown"} • {format(new Date(r.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                {user?.id === r.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => deleteMutation.mutate(r.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
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
                    Joined {format(new Date(m.assigned_at), "MMM d, yyyy")}
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");

  const { isMember, isLoadingMembershipStatus, toggleMembership } = useCommunityMembership(communityId || "");
  const { data: userRole } = useCommunityRole(communityId);
  const { data: stats } = useCommunityStats(communityId);

  const isAdmin = userRole === "admin";
  const isModerator = userRole === "moderator";

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
              <Button onClick={toggleMembership} size="lg">Join Community</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr_280px] gap-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              {community?.banner && (
                <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${community.banner})` }} />
              )}
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-background">
                    <AvatarImage src={community?.logo || community?.image || undefined} />
                    <AvatarFallback className="text-lg">{community?.name?.[0] || "C"}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-bold text-lg">{community?.name}</h2>
                  <Badge variant="secondary" className="text-xs mt-1">{community?.category}</Badge>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-4">{community?.description}</p>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{stats?.memberCount || 0}</span>
                    <span className="text-muted-foreground">members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{stats?.recentPosts || 0}</span>
                    <span className="text-muted-foreground">resources this week</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    created {format(new Date(community?.created_at || Date.now()), "MMMM d, yyyy")}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {isMember ? (
                    <Button variant="destructive" className="w-full" onClick={handleLeaveCommunity} size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      LEAVE
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={toggleMembership} size="sm">
                      Join Community
                    </Button>
                  )}
                  {(isAdmin || isModerator) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/communities/${communityId}/settings`)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="feed" className="text-xs sm:text-sm">Feed</TabsTrigger>
                <TabsTrigger value="questions" className="text-xs sm:text-sm">Q&A</TabsTrigger>
                <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
                <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-0">
                <FeedTab communityId={communityId || ""} isMember={isMember} toggleMembership={toggleMembership} isAdmin={isAdmin} />
              </TabsContent>

              <TabsContent value="questions" className="mt-0">
                <QuestionsTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <ResourcesTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <MembersTab communityId={communityId || ""} isMember={isMember} isAdmin={isAdmin} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Leaderboard */}
          <div className="hidden xl:block space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Leader Board
                </h3>

                {stats?.topContributors && stats.topContributors.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topContributors.map((contributor: any, idx: number) => (
                      <div key={contributor.userId} className="flex items-center gap-2">
                        <span className={`text-sm font-bold w-6 ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-700" : "text-muted-foreground"}`}>
                          #{idx + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contributor.avatar || undefined} />
                          <AvatarFallback className="text-xs">{contributor.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">{contributor.postCount} contributions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No activity yet</p>
                )}

                <Separator className="my-4" />

                <div>
                  <h4 className="font-semibold text-sm mb-3">Contributions:</h4>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${100 - (i * 30)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityFeed;
