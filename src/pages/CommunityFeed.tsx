import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Send,
  Award,
  Hash,
  LogOut,
  Link as LinkIcon,
  Paperclip,
  Settings
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CommunityFeed = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const { isMember, isLoadingMembershipStatus: isLoadingMembership, toggleMembership } = useCommunityMembership(communityId);

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      if (!communityId) return null;
      const { data, error } = await supabase.from('communities').select('*, community_members(count)').eq('id', communityId).single();
      if (error) throw error;
      return { ...data, member_count: data.community_members?.[0]?.count || 0 };
    },
    enabled: !!communityId,
  });

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    await toggleMembership();
    navigate('/communities');
  };

  if (loadingCommunity || isLoadingMembership) {
    return <Layout><div className="container mx-auto p-4 text-center">Loading...</div></Layout>;
  }

  if (!isMember && !loadingCommunity) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center max-w-md">
          <Card>
            <CardHeader><CardTitle>Join {community?.name}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You must join this community to view and participate in the feed.</p>
              <Button onClick={() => toggleMembership()} disabled={isLoadingMembership}>Join Community</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-4.1rem)]">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 py-6">
            <div className="sticky top-6">
              <Card>
                <CardHeader className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border"><AvatarImage src={community?.image || ''} /><AvatarFallback>{community?.name?.charAt(0)}</AvatarFallback></Avatar>
                      <div>
                        <h2 className="text-lg font-bold">{community?.name}</h2>
                        <Badge variant="secondary" className="text-xs">{community?.category || 'General'}</Badge>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <CommunityNav activeTab={activeTab} setActiveTab={setActiveTab} />
                </CardContent>
              </Card>
              <div className="mt-4">
                <LeaderboardCard communityId={communityId!} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9 xl:col-span-7 flex flex-col h-full py-6">
              <div className="flex-1 overflow-y-auto pr-4 -mr-4" id="feed-container">
                  {activeTab === "feed" && <FeedTab communityId={communityId!} />}
                  {activeTab === "questions" && <QuestionsTab communityId={communityId!} />}
                  {activeTab === "resources" && <ResourcesTab communityId={communityId!} />}
                  {activeTab === "progress" && <ProgressTab communityId={communityId!} />}
                  {activeTab === "members" && <MembersTab communityId={communityId!} />}
              </div>
              <div className="mt-4">
                <PostCreator communityId={communityId!} />
              </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block xl:col-span-3 py-6">
              <div className="sticky top-6 space-y-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">About Community</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{community?.description}</p>
                    <div className="space-y-2 text-sm">
                       <div className="flex items-center text-muted-foreground"><Users className="h-4 w-4 mr-2" /> {community?.member_count} members</div>
                       <div className="flex items-center text-muted-foreground"><Hash className="h-4 w-4 mr-2" /> Created {community?.created_at && formatDistanceToNow(new Date(community.created_at), { addSuffix: true })}</div>
                    </div>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                     <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/>Community Settings</Button>
                     <Button variant="destructive" size="sm" onClick={handleLeaveCommunity}><LogOut className="h-4 w-4 mr-2" />Leave Community</Button>
                  </CardContent>
                </Card>
              </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

const CommunityNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <nav className="space-y-1">
    <Button variant={activeTab === "feed" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("feed")}><MessageSquare className="h-4 w-4 mr-2" />Feed</Button>
    <Button variant={activeTab === "questions" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("questions")}><MessageSquare className="h-4 w-4 mr-2" />Q&A</Button>
    <Button variant={activeTab === "resources" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("resources")}><BookOpen className="h-4 w-4 mr-2" />Resources</Button>
    <Button variant={activeTab === "progress" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("progress")}><TrendingUp className="h-4 w-4 mr-2" />Progress</Button>
    <Button variant={activeTab === "members" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("members")}><Users className="h-4 w-4 mr-2" />Members</Button>
  </nav>
);

const PostCreator = ({ communityId }: { communityId: string }) => {
  const [activeTab, setActiveTab] = useState("post");
  return (
    <div className="bg-card border rounded-lg">
      <Tabs defaultValue="post" onValueChange={setActiveTab} className="relative">
        <div className="px-3 pt-3">
          {activeTab === "post" && <ProgressPostForm communityId={communityId} />}
          {activeTab === "question" && <QuestionPostForm communityId={communityId} />}
          {activeTab === "resource" && <ResourcePostForm communityId={communityId} />}
        </div>
        <div className="flex items-center justify-between px-3 pb-2 pt-2 mt-1">
          <TabsList className="grid grid-cols-3 w-auto h-auto bg-transparent p-0">
            <TabsTrigger value="post" className="text-xs h-8"><MessageSquare className="h-4 w-4 mr-1" />Post</TabsTrigger>
            <TabsTrigger value="question" className="text-xs h-8"><MessageSquare className="h-4 w-4 mr-1" />Ask</TabsTrigger>
            <TabsTrigger value="resource" className="text-xs h-8"><BookOpen className="h-4 w-4 mr-1" />Share</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

const AutoScrollingFeed = ({ queryKey, queryFn, CardComponent, emptyMessage, cardPropName }: {
  queryKey: any[],
  queryFn: () => Promise<any[] | null>,
  CardComponent: React.ComponentType<any>,
  emptyMessage: string,
  cardPropName: string,
}) => {
  const { data, isLoading, isError, error } = useQuery({ queryKey, queryFn });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  if (isLoading) return <Card><CardContent className="p-6 text-center">Loading...</CardContent></Card>;
  if (isError) return <Card><CardContent className="p-6 text-center text-destructive">Error: {error.message}</CardContent></Card>;
  if (!data || data.length === 0) return <Card><CardContent className="p-6 text-center text-muted-foreground">{emptyMessage}</CardContent></Card>;

  return (
    <div className="space-y-4">
      {data.map((item: any) => <CardComponent key={item.id} {...{ [cardPropName]: item }} />)}
    </div>
  );
}

const FeedTab = ({ communityId }: { communityId: string }) => {
  const queryFn = async () => {
    const { data, error } = await supabase.from('progress_updates').select(`*, profiles!progress_updates_user_id_fkey (full_name, avatar_url)`).eq('community_id', communityId).order('created_at', { ascending: true }).limit(100);
    if (error) throw error;
    return data;
  };
  return <AutoScrollingFeed queryKey={['progress_updates', communityId]} queryFn={queryFn} CardComponent={PostCard} emptyMessage="No updates yet. Be the first to share!" cardPropName="post" />;
};

const QuestionsTab = ({ communityId }: { communityId: string }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const { data: questions, isLoading } = useQuery({
    queryKey: ['community_questions', communityId],
    queryFn: async () => {
      const { data, error } = await supabase.from('community_questions').select(`*, profiles!community_questions_user_id_fkey (full_name, avatar_url), community_answers (id, answer, user_id, created_at, profiles!community_answers_user_id_fkey (full_name, avatar_url))`).eq('community_id', communityId).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Card><CardContent className="p-6 text-center">Loading questions...</CardContent></Card>;
  if (!questions || questions.length === 0) return <Card><CardContent className="p-6 text-center text-muted-foreground">No questions yet. Ask the first one!</CardContent></Card>;

  return (
    <div className="space-y-4">
      {questions.map((question: any) => (
        <QuestionCard 
          key={question.id} 
          question={question} 
          isSelected={selectedQuestion === question.id}
          onSelect={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
        />
      ))}
    </div>
  );
};

const ResourcesTab = ({ communityId }: { communityId: string }) => {
  const queryFn = async () => {
    const { data, error } = await supabase.from('community_resources').select(`*, profiles!community_resources_user_id_fkey (full_name, avatar_url)`).eq('community_id', communityId).order('created_at', { ascending: true }).limit(100);
    if (error) throw error;
    return data;
  };
  return <AutoScrollingFeed queryKey={['community_resources', communityId]} queryFn={queryFn} CardComponent={ResourceCard} emptyMessage="No resources yet. Share the first one!" cardPropName="resource" />;
};


const ProgressPostForm = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [updateText, setUpdateText] = useState("");
  const { toast } = useToast();

  const postUpdateMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('progress_updates').insert({ community_id: communityId, user_id: user.id, update_text: text });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress_updates', communityId] });
      setUpdateText("");
      toast({ title: "Update posted!" });
    },
    onError: (error: any) => toast({ title: "Failed to post update", description: error.message, variant: "destructive" }),
  });

  return (
    <div className="relative">
      <Textarea placeholder="Share your progress..." value={updateText} onChange={(e) => setUpdateText(e.target.value)} className="pr-12 min-h-[40px] max-h-48 border-0 ring-0 focus-visible:ring-0" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postUpdateMutation.mutate(updateText); } }} />
      <Button size="icon" className="absolute right-2.5 bottom-2 h-8 w-8" onClick={() => postUpdateMutation.mutate(updateText)} disabled={!updateText.trim() || postUpdateMutation.isPending}><Send className="h-4 w-4" /></Button>
    </div>
  );
};

const QuestionPostForm = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [questionText, setQuestionText] = useState("");
  const { toast } = useToast();

  const postQuestionMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('community_questions').insert({ community_id: communityId, user_id: user.id, question: text });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_questions', communityId] });
      setQuestionText("");
      toast({ title: "Question posted!" });
    },
  });

  return (
    <div className="relative">
      <Textarea placeholder="Ask the community a question..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="pr-12 min-h-[40px] max-h-48 border-0 ring-0 focus-visible:ring-0" />
      <Button size="icon" className="absolute right-2.5 bottom-2 h-8 w-8" onClick={() => postQuestionMutation.mutate(questionText)} disabled={!questionText.trim() || postQuestionMutation.isPending}><Send className="h-4 w-4" /></Button>
    </div>
  );
};

const ResourcePostForm = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const { toast } = useToast();

  const postResourceMutation = useMutation({
    mutationFn: async (data: { title: string, link: string }) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('community_resources').insert({ community_id: communityId, user_id: user.id, ...data });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_resources', communityId] });
      setTitle("");
      setLink("");
      toast({ title: "Resource shared!" });
    },
  });

  return (
    <div className="space-y-2">
      <Input placeholder="Resource title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 bg-transparent border-0 ring-0 focus-visible:ring-0"/>
      <div className="relative">
        <Input type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} className="pr-12 h-9 bg-transparent border-0 ring-0 focus-visible:ring-0" />
        <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => postResourceMutation.mutate({ title, link })} disabled={!title.trim() || !link.trim() || postResourceMutation.isPending}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

const PostCard = ({ post }: { post: any }) => (
  <Card><CardContent className="p-4">
    <div className="flex gap-3">
      <Avatar><AvatarImage src={post.profiles?.avatar_url} /><AvatarFallback>{post.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${post.user_id}`} className="font-semibold hover:underline">{post.profiles?.full_name}</Link>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
        </div>
        <p className="mt-1 text-sm whitespace-pre-wrap">{post.update_text}</p>
      </div>
    </div>
  </CardContent></Card>
);

const QuestionCard = ({ question, isSelected, onSelect }: { question: any, isSelected: boolean, onSelect: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answerText, setAnswerText] = useState("");
  const { toast } = useToast();

  const postAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase.from('community_answers').insert({ question_id: questionId, user_id: user.id, answer });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_questions', question.community_id] });
      setAnswerText("");
      toast({ title: "Answer posted!" });
    },
  });

  return (
    <Card><CardContent className="p-4">
      <div className="flex gap-3">
        <Avatar><AvatarImage src={question.profiles?.avatar_url} /><AvatarFallback>{question.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${question.user_id}`} className="font-semibold hover:underline">{question.profiles?.full_name}</Link>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
          </div>
          <p className="mt-1 font-medium">{question.question}</p>
          {question.community_answers?.length > 0 && (
            <div className="mt-3 space-y-3 pt-3 border-t">
              {question.community_answers.map((answer: any) => (
                <div key={answer.id} className="text-sm flex gap-2">
                  <Avatar className="h-6 w-6"><AvatarImage src={answer.profiles?.avatar_url} /><AvatarFallback>{answer.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <Link to={`/profile/${answer.user_id}`} className="font-semibold hover:underline text-xs">{answer.profiles?.full_name}</Link>
                    <p className="text-sm">{answer.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isSelected ? (
            <div className="mt-3 relative">
              <Textarea placeholder="Your answer..." value={answerText} onChange={(e) => setAnswerText(e.target.value)} className="mb-2 pr-10 min-h-[40px]" />
              <Button size="icon" className="absolute right-2 bottom-3 h-7 w-7" onClick={() => postAnswerMutation.mutate({ questionId: question.id, answer: answerText })} disabled={!answerText.trim() || postAnswerMutation.isPending}><Send className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="mt-2" onClick={onSelect}>Answer</Button>
          )}
        </div>
      </div>
    </CardContent></Card>
  );
};

const ResourceCard = ({ resource }: { resource: any }) => (
    <Card><CardContent className="p-4">
      <div className="flex gap-3">
        <Avatar><AvatarImage src={resource.profiles?.avatar_url} /><AvatarFallback>{resource.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${resource.user_id}`} className="font-semibold hover:underline">{resource.profiles?.full_name}</Link>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
          </div>
          <h3 className="mt-1 font-medium">{resource.title}</h3>
          {resource.description && <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>}
          {resource.link && <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-sm text-primary hover:underline"><LinkIcon className="h-4 w-4 mr-1" />Open Resource</a>}
        </div>
      </div>
    </CardContent></Card>
);

const ProgressTab = ({ communityId }: { communityId: string }) => {
    return <Card><CardHeader><CardTitle>Progress</CardTitle></CardHeader><CardContent><p>Progress tracking is under development.</p></CardContent></Card>;
};

const MembersTab = ({ communityId }: { communityId: string }) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ['community_members', communityId],
    queryFn: async () => {
      const { data, error } = await supabase.from('community_members').select(`*, profiles!community_members_user_id_fkey (full_name, avatar_url, title)`).eq('community_id', communityId).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle>Members</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <p className="text-center text-muted-foreground">Loading...</p> : 
        <div className="space-y-2">{(members || []).map(member => <MemberCard key={member.id} member={member} />)}</div>}
      </CardContent>
    </Card>
  );
};

const MemberCard = ({ member }: { member: any }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
    <Avatar><AvatarImage src={member.profiles?.avatar_url} /><AvatarFallback>{member.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
    <div className="flex-1 min-w-0">
      <Link to={`/profile/${member.user_id}`} className="font-semibold hover:underline truncate block">{member.profiles?.full_name}</Link>
      <div className="text-sm text-muted-foreground truncate">{member.profiles?.title || 'Community Member'}</div>
    </div>
    <Button variant="outline" size="sm" asChild><Link to={`/profile/${member.user_id}`}>View</Link></Button>
  </div>
);

const LeaderboardCard = ({ communityId }: { communityId: string }) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['community_leaderboard', communityId],
    queryFn: async () => {
      const { data, error } = await supabase.from('community_leaderboard').select(`*, profiles!community_leaderboard_user_id_fkey (full_name, avatar_url)`).eq('community_id', communityId).order('points', { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5" />Top Contributors</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-center text-muted-foreground py-4">Loading...</p>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">No rankings yet.</p>
        ) : (
          <div className="space-y-3">
            {(leaderboard || []).map((entry: any, index: number) => (
              <div key={entry.id} className="flex items-center gap-3">
                <span className="font-bold text-sm w-5 text-center text-muted-foreground">{index + 1}</span>
                <Avatar className="h-8 w-8"><AvatarImage src={entry.profiles?.avatar_url} /><AvatarFallback>{entry.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${entry.user_id}`} className="font-medium text-sm truncate hover:underline block">{entry.profiles?.full_name}</Link>
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
