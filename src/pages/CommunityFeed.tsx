import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCommunityMembership } from "@/hooks/useCommunityMembership";
import { useCommunityRole } from "@/hooks/useCommunityRole";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import {
  MessageSquare,
  BookOpen,
  Settings,
  Send,
  Trash2,
  Paperclip,
  Award,
  FolderKanban,
  HelpCircle,
  Users,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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

export default function CommunityFeed() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ["community", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Community;
    },
    enabled: !!id,
  });

  const { isMember, isLoadingMembershipStatus: loadingMembership } = useCommunityMembership(id);
  const { data: userRole } = useCommunityRole(id);
  const { data: stats } = useCommunityStats(id);

  const isAdmin = userRole === "admin" || userRole === "moderator";

  const joinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("community_members")
        .insert({ community_id: id!, user_id: user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-membership", id] });
      queryClient.invalidateQueries({ queryKey: ["communityStats", id] });
      toast({ title: "Joined community!" });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", id!)
        .eq("user_id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-membership", id] });
      queryClient.invalidateQueries({ queryKey: ["communityStats", id] });
      toast({ title: "Left community" });
    },
  });

  if (loadingCommunity || loadingMembership) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg">Loading community...</div>
        </div>
      </Layout>
    );
  }

  if (!community) {
    return (
      <Layout>
        <div className="text-center py-12">Community not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="flex gap-0 h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Community Info */}
          <div className="w-72 bg-card border-r flex flex-col">
            <div className="p-6 flex flex-col items-center border-b">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={community.logo || community.image || ""} />
                  <AvatarFallback className="text-2xl">{community.name[0]}</AvatarFallback>
                </Avatar>
                {isAdmin && (
                  <Link
                    to={`/communities/${id}/settings`}
                    className="absolute -top-1 -right-1 p-1.5 rounded-full bg-muted hover:bg-muted/80 border"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <h2 className="font-bold text-xl mt-3">{community.name}</h2>
              <p className="text-sm text-muted-foreground mt-1 text-center px-2">
                {community.description}
              </p>
            </div>

            <div className="p-6 space-y-3 text-center border-b">
              <div>
                <div className="text-2xl font-bold">{stats?.memberCount || 0}</div>
                <div className="text-xs text-muted-foreground">members</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.recentPosts || 0}</div>
                <div className="text-xs text-muted-foreground">resources this week</div>
              </div>
              <div className="text-xs text-muted-foreground">
                created {formatDistanceToNow(new Date(community.created_at))} ago
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="p-4 border-t">
              {isMember ? (
                <Button
                  onClick={() => leaveMutation.mutate()}
                  variant="destructive"
                  className="w-full"
                  disabled={leaveMutation.isPending}
                >
                  LEAVE
                </Button>
              ) : (
                <Button
                  onClick={() => joinMutation.mutate()}
                  className="w-full"
                  disabled={joinMutation.isPending}
                >
                  JOIN
                </Button>
              )}
            </div>
          </div>

          {/* Center - Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-card border-b px-6 py-3">
              <div className="flex gap-2">
                <TabButton
                  active={activeTab === "feed"}
                  onClick={() => setActiveTab("feed")}
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Feed"
                />
                <TabButton
                  active={activeTab === "qa"}
                  onClick={() => setActiveTab("qa")}
                  icon={<HelpCircle className="h-4 w-4" />}
                  label="Q&A"
                />
                <TabButton
                  active={activeTab === "project"}
                  onClick={() => setActiveTab("project")}
                  icon={<FolderKanban className="h-4 w-4" />}
                  label="Project"
                />
                <TabButton
                  active={activeTab === "resources"}
                  onClick={() => setActiveTab("resources")}
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Resources"
                />
                <TabButton
                  active={activeTab === "members"}
                  onClick={() => setActiveTab("members")}
                  icon={<Users className="h-4 w-4" />}
                  label="Members"
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "feed" && <FeedTab communityId={id!} isMember={isMember} />}
              {activeTab === "qa" && <QATab communityId={id!} isMember={isMember} />}
              {activeTab === "project" && <ProjectTab communityId={id!} isMember={isMember} />}
              {activeTab === "resources" && <ResourcesTab communityId={id!} isMember={isMember} />}
              {activeTab === "members" && <MembersTab communityId={id!} isMember={isMember} isAdmin={isAdmin} />}
            </div>
          </div>

          {/* Right Sidebar - Leaderboard */}
          <div className="w-80 bg-card border-l p-6">
            <h3 className="font-bold text-xl mb-6">Leader Board</h3>
            <LeaderboardSection communityId={id!} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Feed Tab - WhatsApp-like Chat
function FeedTab({ communityId, isMember }: { communityId: string; isMember: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get community members for mentions
  const { data: members } = useQuery({
    queryKey: ["community-members-for-mentions", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_member_roles")
        .select("user_id, profiles!community_member_roles_user_id_fkey(full_name)")
        .eq("community_id", communityId);
      if (error) throw error;
      return data?.map((m: any) => ({
        id: m.user_id,
        name: m.profiles?.full_name || "Unknown",
      })) || [];
    },
    enabled: isMember,
  });

  const { data: messages } = useQuery({
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
    enabled: isMember,
  });

  // Real-time subscription
  useEffect(() => {
    if (!isMember) return;

    const channel = supabase
      .channel(`messages-${communityId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_messages", filter: `community_id=eq.${communityId}` },
        () => queryClient.invalidateQueries({ queryKey: ["community-messages", communityId] })
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

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      // Validate message length
      if (content.length > 2000) {
        throw new Error("Message too long (max 2000 characters)");
      }

      // Insert message
      const { data: newMessage, error } = await supabase
        .from("community_messages")
        .insert({ community_id: communityId, user_id: user?.id, content })
        .select()
        .single();
      
      if (error) throw error;

      // Extract mentions from message
      const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
      const mentions: string[] = [];
      let match;
      
      while ((match = mentionRegex.exec(content)) !== null) {
        const userId = match[2];
        if (userId && userId !== user?.id) {
          mentions.push(userId);
        }
      }

      // Send notifications to mentioned users
      if (mentions.length > 0) {
        const notifications = mentions.map((mentionedUserId) => ({
          user_id: mentionedUserId,
          title: "You were mentioned",
          body: `${user?.user_metadata?.full_name || "Someone"} mentioned you in ${communityId}`,
          type: "mention",
        }));

        await supabase.from("notifications").insert(notifications);
      }
    },
    onSuccess: () => {
      setMessage("");
      setShowMentions(false);
      setMentionSearch("");
    },
    onError: (error: any) => {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (msgId: string) => {
      const { error } = await supabase.from("community_messages").delete().eq("id", msgId);
      if (error) throw error;
    },
    onSuccess: () => toast({ title: "Message deleted" }),
  });

  // Handle message input changes for @mentions
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Check for @ symbol to trigger mentions
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Only show mentions if there's no space after @
      if (!textAfterAt.includes(" ") && textAfterAt.length >= 0) {
        setMentionSearch(textAfterAt.toLowerCase());
        setShowMentions(true);
        
        // Calculate position for mention dropdown
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setMentionPosition({ top: rect.top - 200, left: rect.left });
        }
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Insert mention into message
  const insertMention = (member: { id: string; name: string }) => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    const textBeforeCursor = message.substring(0, cursorPos);
    const textAfterCursor = message.substring(cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const beforeAt = message.substring(0, lastAtIndex);
      const mention = `@[${member.name}](${member.id})`;
      const newMessage = beforeAt + mention + " " + textAfterCursor;
      
      setMessage(newMessage);
      setShowMentions(false);
      setMentionSearch("");
      
      // Focus back on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Filter members based on search
  const filteredMembers = members?.filter((m) =>
    m.name.toLowerCase().includes(mentionSearch) && m.id !== user?.id
  ).slice(0, 5) || [];

  // Render message with highlighted mentions
  const renderMessageContent = (content: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // Add highlighted mention
      const mentionName = match[1];
      const mentionId = match[2];
      parts.push(
        <span
          key={match.index}
          className="bg-primary/20 text-primary font-medium px-1 rounded"
        >
          @{mentionName}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Join the community to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {!messages?.length ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMe = user?.id === msg.user_id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={msg.profiles?.avatar_url} />
                  <AvatarFallback>{msg.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                  <div className="group relative">
                    <div
                      className={`px-4 py-2.5 rounded-2xl break-words ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm border"
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                    {isMe && (
                      <button
                        onClick={() => deleteMutation.mutate(msg.id)}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(msg.created_at), "HH:mm")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background relative">
        {/* Mention Suggestions Dropdown */}
        {showMentions && filteredMembers.length > 0 && (
          <div
            className="absolute bottom-full mb-2 left-4 right-4 bg-card border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-2 py-1">Mention someone</div>
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => insertMention(member)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {member.name[0]}
                  </div>
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0 rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message... (use @ to mention)"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showMentions && message.trim()) {
                sendMutation.mutate(message.trim());
              }
              if (e.key === "Escape") {
                setShowMentions(false);
              }
            }}
            maxLength={2000}
            className="flex-1 bg-transparent outline-none"
          />
          <Button
            size="icon"
            className="flex-shrink-0 rounded-full"
            onClick={() => message.trim() && sendMutation.mutate(message.trim())}
            disabled={!message.trim() || sendMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Q&A Tab
function QATab({ communityId, isMember }: { communityId: string; isMember: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState("");

  const { data: questions } = useQuery({
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
    enabled: isMember,
  });

  const askMutation = useMutation({
    mutationFn: async (q: string) => {
      const { error } = await supabase.from("community_questions").insert({
        community_id: communityId,
        user_id: user?.id,
        question: q,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setQuestion("");
      queryClient.invalidateQueries({ queryKey: ["community-questions", communityId] });
      toast({ title: "Question posted" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (qId: string) => {
      const { error } = await supabase.from("community_questions").delete().eq("id", qId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-questions", communityId] });
      toast({ title: "Question deleted" });
    },
  });

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Join to ask questions</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Ask Question */}
        <div className="bg-card border rounded-lg p-4">
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && question.trim() && askMutation.mutate(question.trim())}
            className="w-full bg-background border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={() => question.trim() && askMutation.mutate(question.trim())} className="mt-2 w-full" disabled={!question.trim()}>
            Ask Question
          </Button>
        </div>

        {/* Questions List */}
        {questions?.map((q: any) => (
          <div key={q.id} className="bg-card border rounded-lg p-4 group">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={q.profiles?.avatar_url} />
                <AvatarFallback>{q.profiles?.full_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{q.profiles?.full_name}</p>
                <p className="mt-1">{q.question}</p>
                <span className="text-xs text-muted-foreground mt-2 inline-block">
                  {formatDistanceToNow(new Date(q.created_at))} ago
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
          </div>
        ))}

        {!questions?.length && (
          <p className="text-center text-muted-foreground py-12">No questions yet. Be the first to ask!</p>
        )}
      </div>
    </div>
  );
}

// Project Tab
function ProjectTab({ communityId, isMember }: { communityId: string; isMember: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const { data: projects } = useQuery({
    queryKey: ["community-projects", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_projects")
        .select("*, profiles!community_projects_created_by_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isMember,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("community_projects").insert({
        community_id: communityId,
        created_by: user?.id,
        name: projectName,
        description: projectDesc,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setProjectName("");
      setProjectDesc("");
      queryClient.invalidateQueries({ queryKey: ["community-projects", communityId] });
      toast({ title: "Project created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.from("community_projects").delete().eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-projects", communityId] });
      toast({ title: "Project deleted" });
    },
  });

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Join to view projects</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Create Project */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Create New Project</h3>
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-background border rounded-lg px-4 py-2 mb-2 outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            placeholder="Project description"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            className="w-full bg-background border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3}
          />
          <Button onClick={() => createMutation.mutate()} className="mt-2 w-full" disabled={!projectName.trim()}>
            Create Project
          </Button>
        </div>

        {/* Projects List */}
        {projects?.map((p: any) => (
          <div key={p.id} className="bg-card border rounded-lg p-4 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={p.profiles?.avatar_url} />
                    <AvatarFallback>{p.profiles?.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Created by {p.profiles?.full_name} • {formatDistanceToNow(new Date(p.created_at))} ago
                  </span>
                </div>
              </div>
              {user?.id === p.created_by && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate(p.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {!projects?.length && (
          <p className="text-center text-muted-foreground py-12">No projects yet. Start one!</p>
        )}
      </div>
    </div>
  );
}

// Resources Tab
function ResourcesTab({ communityId, isMember }: { communityId: string; isMember: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const { data: resources } = useQuery({
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
    enabled: isMember,
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("community_resources").insert({
        community_id: communityId,
        user_id: user?.id,
        title,
        link,
        description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setLink("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["community-resources", communityId] });
      queryClient.invalidateQueries({ queryKey: ["communityStats", communityId] });
      toast({ title: "Resource shared" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase.from("community_resources").delete().eq("id", resourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-resources", communityId] });
      queryClient.invalidateQueries({ queryKey: ["communityStats", communityId] });
      toast({ title: "Resource deleted" });
    },
  });

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Join to access resources</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Share Resource */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Share a Resource</h3>
          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border rounded-lg px-4 py-2 mb-2 outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="url"
            placeholder="Resource link (URL)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-background border rounded-lg px-4 py-2 mb-2 outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-background border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={2}
          />
          <Button onClick={() => shareMutation.mutate()} className="mt-2 w-full" disabled={!title.trim() || !link.trim()}>
            Share Resource
          </Button>
        </div>

        {/* Resources List */}
        {resources?.map((r: any) => (
          <div key={r.id} className="bg-card border rounded-lg p-4 group hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline break-words">
                  {r.title}
                </a>
                {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={r.profiles?.avatar_url} />
                    <AvatarFallback className="text-[10px]">{r.profiles?.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {r.profiles?.full_name} • {formatDistanceToNow(new Date(r.created_at))} ago
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
          </div>
        ))}

        {!resources?.length && (
          <p className="text-center text-muted-foreground py-12">No resources shared yet.</p>
        )}
      </div>
    </div>
  );
}

// Members Tab
function MembersTab({ communityId, isMember, isAdmin }: { communityId: string; isMember: boolean; isAdmin: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["community-members-roles", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_member_roles")
        .select("user_id, role, profiles!community_member_roles_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("role", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: isMember,
  });

  const removeMutation = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.from("community_members").delete().eq("community_id", communityId).eq("user_id", userId);
      await supabase.from("community_member_roles").delete().eq("community_id", communityId).eq("user_id", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members-roles", communityId] });
      queryClient.invalidateQueries({ queryKey: ["communityStats", communityId] });
      toast({ title: "Member removed" });
    },
  });

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Join to see members</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-3">
        <h3 className="font-semibold text-lg mb-4">Members ({members?.length || 0})</h3>
        {members?.map((m: any) => (
          <div key={m.user_id} className="bg-card border rounded-lg p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={m.profiles?.avatar_url} />
                <AvatarFallback>{m.profiles?.full_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{m.profiles?.full_name || "Unknown"}</p>
                <Badge variant={m.role === "admin" ? "default" : m.role === "moderator" ? "secondary" : "outline"} className="text-xs">
                  {m.role}
                </Badge>
              </div>
            </div>
            {isAdmin && m.role !== "admin" && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={() => removeMutation.mutate(m.user_id)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Leaderboard Section
function LeaderboardSection({ communityId }: { communityId: string }) {
  const { data: leaderboard } = useQuery({
    queryKey: ["community-leaderboard", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_leaderboard")
        .select("user_id, points, profiles!community_leaderboard_user_id_fkey(full_name, avatar_url)")
        .eq("community_id", communityId)
        .order("points", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-3">Top Contributors</h4>
        <div className="space-y-3">
          {leaderboard?.slice(0, 3).map((item: any, index) => (
            <div key={item.user_id} className="flex items-center gap-3">
              <div className="text-2xl font-bold text-muted-foreground w-6">#{index + 1}</div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={item.profiles?.avatar_url} />
                <AvatarFallback>{item.profiles?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.profiles?.full_name}</p>
                <p className="text-xs text-muted-foreground">{item.points} points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Contributions:</h4>
        <div className="space-y-2">
          {leaderboard?.slice(3, 6).map((item: any) => (
            <div key={item.user_id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.profiles?.avatar_url} />
                  <AvatarFallback className="text-xs">{item.profiles?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.profiles?.full_name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.points}pts</span>
            </div>
          ))}
        </div>
      </div>

      {(!leaderboard || leaderboard.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
      )}
    </div>
  );
}
