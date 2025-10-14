import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCommunityMembership } from "@/hooks/useCommunityMembership";
import {
  Users,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Settings,
  LogOut,
  Hash,
  Award,
  Paperclip,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ---------- Types ---------- */
type Community = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  created_at: string;
  member_count: number;
};

type TabProps = { communityId: string };

/* ---------- Feed Tab ---------- */
const FeedTab: React.FC<TabProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");

  // Fetch posts
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["community-feed", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId,
  });

  const handlePost = async () => {
    if (!newPost.trim()) return;
    // `posts` table requires a `title` and `user_id` per the typed schema.
    const title = newPost.trim().slice(0, 60) || "Post";
    const { error } = await supabase.from("posts").insert({
      community_id: communityId,
      user_id: user?.id,
      title,
      content: newPost,
    });
    if (error) {
      toast({
        title: "Error posting",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewPost("");
      toast({ title: "Post added!" });
      refetch();
    }
  };

  if (isLoading) return <p>Loading feed...</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Share something..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button onClick={handlePost}>Post</Button>
      </div>

      {posts.length ? (
        posts.map((p: any) => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <p>{p.content}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(p.created_at), {
                  addSuffix: true,
                })}
              </span>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No posts yet.</p>
      )}
    </div>
  );
};

/* ---------- Questions Tab ---------- */
const QuestionsTab: React.FC<TabProps> = ({ communityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");

  const { data: questions, isLoading, refetch } = useQuery({
    queryKey: ["community-questions", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_questions") // id, community_id, user_id, question, created_at
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId,
  });

  const handleAsk = async () => {
    if (!question.trim()) return;
    const { error } = await supabase.from("community_questions").insert({
      community_id: communityId,
      user_id: user?.id,
      question,
    });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setQuestion("");
      toast({ title: "Question posted" });
      refetch();
    }
  };

  if (isLoading) return <p>Loading questions...</p>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button onClick={handleAsk}>Ask</Button>
      </div>

      {questions.length ? (
        questions.map((q: any) => (
          <Card key={q.id}>
            <CardContent className="p-4">
              <p>{q.question}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(q.created_at), {
                  addSuffix: true,
                })}
              </span>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No questions yet.</p>
      )}
    </div>
  );
};

/* ---------- Resources Tab ---------- */
const ResourcesTab: React.FC<TabProps> = ({ communityId }) => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["community-resources", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_resources") // id, community_id, title, link, created_at
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId,
  });

  if (isLoading) return <p>Loading resources...</p>;
  if (!resources.length)
    return <p className="text-muted-foreground">No resources shared yet.</p>;

  return (
    <div className="space-y-2">
      {resources.map((r: any) => (
        <Card key={r.id}>
          <CardContent className="p-4">
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {r.title}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* ---------- Progress Tab (placeholder) ---------- */
const ProgressTab: React.FC<TabProps> = ({ communityId }) => (
  <p className="text-muted-foreground">
    Progress tracking coming soon for {communityId}.
  </p>
);

/* ---------- Members Tab ---------- */
const MembersTab: React.FC<TabProps> = ({ communityId }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["community-members", communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_members") // id, community_id, user_id, joined_at
        .select("user_id, joined_at, profiles(username, avatar_url)")
        .eq("community_id", communityId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!communityId,
  });

  if (isLoading) return <p>Loading members...</p>;

  return (
    <div className="space-y-2">
      {members.map((m: any) => (
        <Card key={m.user_id}>
          <CardContent className="flex items-center gap-3 p-3">
            <Avatar>
              <AvatarImage src={m.profiles?.avatar_url || ""} />
              <AvatarFallback>
                {m.profiles?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{m.profiles?.username}</p>
              <p className="text-xs text-muted-foreground">
                Joined{" "}
                {formatDistanceToNow(new Date(m.joined_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* ---------- Main Component ---------- */
const CommunityFeed: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    isMember,
    isLoadingMembershipStatus: isLoadingMembership,
    toggleMembership,
  } = useCommunityMembership(communityId || "");

  useEffect(() => {
    document.title = "Community • Feed";
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  // Load community info
  const {
    data: community,
    isLoading: loadingCommunity,
    error: communityError,
  } = useQuery<Community, Error>({
    queryKey: ["community", communityId],
    queryFn: async () => {
      if (!communityId) throw new Error("Community ID is required");
      const { data: c, error: cErr } = await supabase
        .from("communities")
        .select("*")
        .eq("id", communityId)
        .single();
      if (cErr) throw cErr;

      const { count, error: mErr } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId);
      if (mErr) throw mErr;

      return { ...c, member_count: count ?? 0 };
    },
    enabled: Boolean(communityId),
  });

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    await toggleMembership();
    toast({ title: "Left the community" });
  };

  if (loadingCommunity || isLoadingMembership)
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">Loading...</div>
      </Layout>
    );

  if (communityError)
    return (
      <Layout>
        <div className="container mx-auto p-4 text-destructive">
          Failed to load community.
        </div>
      </Layout>
    );

  if (!isMember && !loadingCommunity)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Join {community?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join the community to view and participate in posts.
              </p>
              <Button onClick={toggleMembership} disabled={isLoadingMembership}>
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 grid grid-cols-12 gap-6 h-[calc(100vh-4.1rem)]">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 py-6">
          <Card className="sticky top-6">
            <CardHeader className="p-3 flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={community?.image || undefined}
                  alt={community?.name || "Community"}
                />
                <AvatarFallback>
                  {community?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">
                  {community?.name || "Community"}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {community?.category || "General"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {community?.description || "Welcome to the community!"}
            </CardContent>
            <CardContent className="p-4 flex flex-col space-y-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/communities/${communityId}/settings`}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleLeaveCommunity}
              >
                <LogOut className="h-4 w-4" />
                Leave
              </Button>
            </CardContent>
            <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {community?.member_count || 0} members
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {community?.created_at && (
                  <>
                    Created{" "}
                    {formatDistanceToNow(new Date(community.created_at), {
                      addSuffix: true,
                    })}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Top contributors weekly
              </div>
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Share files & resources
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-9 xl:col-span-7 flex flex-col h-full py-6">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <Tabs
              defaultValue="feed"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col"
            >
              <TabsList className="w-full flex flex-wrap">
                <TabsTrigger value="feed">
                  <MessageSquare className="h-4 w-4 mr-1" /> Feed
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <MessageSquare className="h-4 w-4 mr-1" /> Questions
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <BookOpen className="h-4 w-4 mr-1" /> Resources
                </TabsTrigger>
                <TabsTrigger value="progress">
                  <TrendingUp className="h-4 w-4 mr-1" /> Progress
                </TabsTrigger>
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-1" /> Members
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-4">
                <FeedTab communityId={communityId || ""} />
              </TabsContent>
              <TabsContent value="questions" className="mt-4">
                <QuestionsTab communityId={communityId || ""} />
              </TabsContent>
              <TabsContent value="resources" className="mt-4">
                <ResourcesTab communityId={communityId || ""} />
              </TabsContent>
              <TabsContent value="progress" className="mt-4">
                <ProgressTab communityId={communityId || ""} />
              </TabsContent>
              <TabsContent value="members" className="mt-4">
                <MembersTab communityId={communityId || ""} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block xl:col-span-3 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Be respectful, stay on topic, and help others grow.
            </CardContent>
          </Card>
        </aside>
      </div>
    </Layout>
  );
};

export default CommunityFeed;
