import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { useCommunityMembership } from "@/hooks/useCommunityMembership";
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
  Hash,
  LogOut,
  Link as LinkIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommunityFeed = () => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");
  const { isMember, toggleMembership } = useCommunityMembership(communityId);

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

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    
    try {
      await toggleMembership();
      toast({ title: "Left community" });
      navigate('/communities');
    } catch (error: any) {
      toast({ 
        title: "Error leaving community",
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLeaveCommunity}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Leave
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
          profiles!progress_updates_user_id_fkey (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false })
        .limit(50);
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
      queryClient.invalidateQueries({ queryKey: ['community_leaderboard', communityId] });
      setUpdateText("");
      toast({ title: "Update posted! +10 points" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to post update", description: error.message, variant: "destructive" });
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
          profiles!community_questions_user_id_fkey (full_name, avatar_url),
          community_answers (
            id,
            answer,
            user_id,
            created_at,
            profiles!community_answers_user_id_fkey (full_name, avatar_url)
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
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ['community_resources', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_resources')
        .select(`
          *,
          profiles!community_resources_user_id_fkey (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const postResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('community_resources')
        .insert({
          community_id: communityId,
          user_id: user!.id,
          ...data
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_resources', communityId] });
      setResourceTitle("");
      setResourceDescription("");
      setResourceLink("");
      toast({ title: "Resource shared!" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;
    postResourceMutation.mutate({
      title: resourceTitle,
      description: resourceDescription,
      link: resourceLink,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share a Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Resource title"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
            />
            <Input
              type="url"
              placeholder="Link (optional)"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
            />
            <Button type="submit" disabled={!resourceTitle.trim() || postResourceMutation.isPending}>
              <BookOpen className="h-4 w-4 mr-2" />
              Share Resource
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6 text-center">Loading resources...</CardContent></Card>
        ) : resources?.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No resources yet. Share the first one!</CardContent></Card>
        ) : (
          resources?.map((resource: any) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={resource.profiles?.avatar_url} />
                    <AvatarFallback>{resource.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{resource.profiles?.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="mt-1 font-medium">{resource.title}</h3>
                    {resource.description && <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>}
                    {resource.link && (
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        Open Resource
                      </a>
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

// Progress Tab Component
const ProgressTab = ({ communityId }: { communityId: string }) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['community_leaderboard', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_leaderboard')
        .select(`
          *,
          profiles!community_leaderboard_user_id_fkey (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('points', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Loading progress...</div>
          ) : leaderboard?.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No progress tracked yet. Start sharing updates to appear here!
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard?.map((entry: any, index: number) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold w-8 text-center">#{index + 1}</div>
                  <Avatar>
                    <AvatarImage src={entry.profiles?.avatar_url} />
                    <AvatarFallback>{entry.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{entry.profiles?.full_name}</div>
                    <div className="text-sm text-muted-foreground">{entry.points} points</div>
                  </div>
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {entry.streak_days} day streak
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Members Tab Component
const MembersTab = ({ communityId }: { communityId: string }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ['community_members', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          profiles!community_members_user_id_fkey (full_name, avatar_url, title)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">Loading members...</div>
        ) : members?.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No members yet</div>
        ) : (
          <div className="space-y-3">
            {members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar>
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback>{member.profiles?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{member.profiles?.full_name}</div>
                  {member.profiles?.title && (
                    <div className="text-sm text-muted-foreground">{member.profiles.title}</div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Leaderboard Card Component
const LeaderboardCard = ({ communityId }: { communityId: string }) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['community_leaderboard', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_leaderboard')
        .select(`
          *,
          profiles!community_leaderboard_user_id_fkey (full_name, avatar_url)
        `)
        .eq('community_id', communityId)
        .order('points', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : leaderboard?.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No rankings yet
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard?.map((entry: any, index: number) => (
              <div key={entry.id} className="flex items-center gap-2">
                <span className="font-bold text-lg w-6">{index + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.profiles?.avatar_url} />
                  <AvatarFallback>{entry.profiles?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{entry.profiles?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{entry.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityFeed;
