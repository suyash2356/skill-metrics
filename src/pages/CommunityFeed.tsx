import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Settings,
  Send,
  Plus,
  FileText,
  Target,
  Award,
  ChevronRight,
  CheckCircle2,
  Hash
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommunityFeed = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");

  // Fetch community details
  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, community_members(count)')
        .eq('id', communityId)
        .single();
      if (error) throw error;
      return {
        ...data,
        member_count: data.community_members[0]?.count || 0
      };
    },
    enabled: !!communityId,
  });

  // Check membership
  const { data: isMember } = useQuery({
    queryKey: ['isMember', communityId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .single();
      return !!data;
    },
    enabled: !!user && !!communityId,
  });

  if (loadingCommunity) {
    return <Layout><div className="container mx-auto px-4 py-8 text-center">Loading community...</div></Layout>;
  }

  if (!isMember) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Join Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need to join this community to access its content.
              </p>
              <Button asChild>
                <Link to="/communities">Browse Communities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Community Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={community?.image || ''} />
                  <AvatarFallback>{community?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Hash className="h-6 w-6" />
                    {community?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{community?.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="secondary">{community?.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {community?.member_count} members
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <Button
                      variant={activeTab === "feed" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("feed")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Feed
                    </Button>
                    <Button
                      variant={activeTab === "questions" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("questions")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Q&A
                    </Button>
                    <Button
                      variant={activeTab === "resources" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resources")}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Resources
                    </Button>
                    <Button
                      variant={activeTab === "progress" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("progress")}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Progress
                    </Button>
                    <Button
                      variant={activeTab === "members" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("members")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Members
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-7">
              {activeTab === "feed" && <FeedTab communityId={communityId!} />}
              {activeTab === "questions" && <QuestionsTab communityId={communityId!} />}
              {activeTab === "resources" && <ResourcesTab communityId={communityId!} />}
              {activeTab === "progress" && <ProgressTab communityId={communityId!} />}
              {activeTab === "members" && <MembersTab communityId={communityId!} />}
            </div>

            {/* Right Sidebar - Info */}
            <div className="lg:col-span-3">
              <LeaderboardCard communityId={communityId!} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Feed Tab Component
const FeedTab = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updateText, setUpdateText] = useState("");

  const { data: updates, isLoading } = useQuery({
    queryKey: ['progress_updates', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_updates')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const postUpdateMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from('progress_updates')
        .insert({
          community_id: communityId,
          user_id: user!.id,
          update_text: text,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress_updates', communityId] });
      setUpdateText("");
      toast({ title: "Update posted!" });
    },
    onError: () => {
      toast({ title: "Failed to post update", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What are you working on today?"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={() => postUpdateMutation.mutate(updateText)}
            disabled={!updateText.trim() || postUpdateMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            Post Update
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6 text-center">Loading updates...</CardContent></Card>
        ) : updates?.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No updates yet. Be the first to share!</CardContent></Card>
        ) : (
          updates?.map((update: any) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={update.profiles?.avatar_url} />
                    <AvatarFallback>{update.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{update.profiles?.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{update.update_text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Questions Tab Component
const QuestionsTab = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['community_questions', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_questions')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          community_answers (
            id,
            answer,
            user_id,
            created_at,
            profiles:user_id (full_name, avatar_url)
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const postQuestionMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from('community_questions')
        .insert({
          community_id: communityId,
          user_id: user!.id,
          question: text,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_questions', communityId] });
      setQuestionText("");
      toast({ title: "Question posted!" });
    },
  });

  const postAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      const { error } = await supabase
        .from('community_answers')
        .insert({
          question_id: questionId,
          user_id: user!.id,
          answer,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_questions', communityId] });
      setAnswerText("");
      setSelectedQuestion(null);
      toast({ title: "Answer posted!" });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What would you like to know?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={() => postQuestionMutation.mutate(questionText)}
            disabled={!questionText.trim() || postQuestionMutation.isPending}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Post Question
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6 text-center">Loading questions...</CardContent></Card>
        ) : questions?.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No questions yet. Ask the first one!</CardContent></Card>
        ) : (
          questions?.map((question: any) => (
            <Card key={question.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={question.profiles?.avatar_url} />
                    <AvatarFallback>{question.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{question.profiles?.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{question.question}</p>
                    
                    {/* Answers */}
                    {question.community_answers?.length > 0 && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2">
                        {question.community_answers.map((answer: any) => (
                          <div key={answer.id} className="text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={answer.profiles?.avatar_url} />
                                <AvatarFallback>{answer.profiles?.full_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-semibold">{answer.profiles?.full_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="mt-1 ml-8">{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer Form */}
                    {selectedQuestion === question.id ? (
                      <div className="mt-3">
                        <Textarea
                          placeholder="Your answer..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => postAnswerMutation.mutate({ questionId: question.id, answer: answerText })}
                            disabled={!answerText.trim()}
                          >
                            Post Answer
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Answer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Resources Tab Component
const ResourcesTab = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", link: "" });

  const { data: resources, isLoading } = useQuery({
    queryKey: ['community_resources', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_resources')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addResourceMutation = useMutation({
    mutationFn: async (resource: typeof formData) => {
      const { error } = await supabase
        .from('community_resources')
        .insert({
          community_id: communityId,
          user_id: user!.id,
          ...resource,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_resources', communityId] });
      setFormData({ title: "", description: "", link: "" });
      setShowForm(false);
      toast({ title: "Resource added!" });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Learning Resources</CardTitle>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </CardHeader>
        {showForm && (
          <CardContent className="border-t pt-4">
            <div className="space-y-3">
              <Input
                placeholder="Resource title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Link (optional)"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => addResourceMutation.mutate(formData)}
                  disabled={!formData.title.trim()}
                >
                  Add Resource
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6 text-center">Loading resources...</CardContent></Card>
        ) : resources?.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No resources yet. Add the first one!</CardContent></Card>
        ) : (
          resources?.map((resource: any) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        View Resource <ChevronRight className="h-3 w-3 inline" />
                      </a>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={resource.profiles?.avatar_url} />
                        <AvatarFallback>{resource.profiles?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Added by {resource.profiles?.full_name}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Progress Tab Component
const ProgressTab = ({ communityId }: { communityId: string }) => {
  const { data: progressUpdates, isLoading } = useQuery({
    queryKey: ['all_progress', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_updates')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Community Progress
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6 text-center">Loading progress...</CardContent></Card>
        ) : progressUpdates?.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No progress updates yet.</CardContent></Card>
        ) : (
          progressUpdates?.map((update: any) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={update.profiles?.avatar_url} />
                        <AvatarFallback>{update.profiles?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{update.profiles?.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{update.update_text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Members Tab Component
const MembersTab = ({ communityId }: { communityId: string }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ['community_members_list', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url, title)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading members...</p>
              ) : (
                members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                    <Avatar>
                      <AvatarImage src={member.profiles?.avatar_url} />
                      <AvatarFallback>{member.profiles?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{member.profiles?.full_name}</p>
                      {member.profiles?.title && (
                        <p className="text-sm text-muted-foreground">{member.profiles.title}</p>
                      )}
                    </div>
                    <Badge variant="secondary">Member</Badge>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Leaderboard Card Component
const LeaderboardCard = ({ communityId }: { communityId: string }) => {
  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_leaderboard')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('points', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {leaderboard?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">No rankings yet</p>
            ) : (
              leaderboard?.map((entry: any, index: number) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <div className="font-bold text-lg w-6">#{index + 1}</div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.profiles?.avatar_url} />
                    <AvatarFallback>{entry.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{entry.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{entry.points} points</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommunityFeed;
