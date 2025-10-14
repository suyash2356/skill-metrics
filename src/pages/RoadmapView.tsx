import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Clock, Target, CheckCircle, Edit3, Save, X, Plus, Link as LinkIcon, Menu, Calendar,
  BookOpen, Brain, Rocket, FlaskConical, Trophy, GraduationCap, Hourglass, ListChecks,
  Book, MonitorPlay, Youtube, Globe, Codepen, Users, Mail, Award, FolderOpen, ClipboardCheck, PenLine, CalendarCheck, Lightbulb, MessageCircle, Share2, Trash2, Eye, EyeOff
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUserFollows } from "@/hooks/useUserFollows";
import { CommentDialog } from "@/components/CommentDialog";
import { ShareLinkDialog } from "@/components/ShareLinkDialog";
import { useRoadmapTemplates } from "@/hooks/useRoadmapTemplates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/integrations/supabase/types";
import { getSkillsForDomain } from "@/lib/roadmapSkills";

type RoadmapWithUser = Database['public']['Tables']['roadmaps']['Row'] & {
  user?: { id: string; full_name?: string | null; avatar_url?: string | null } | null;
};

type CommentWithProfile = Database['public']['Tables']['comments']['Row'] & {
  profile?: { user_id: string; full_name?: string | null; avatar_url?: string | null } | null;
};

// Type guard for roadmap.user
function isProfileUser(user: any): user is { id: string; full_name?: string; avatar_url?: string } {
  return !!user && typeof user === 'object' && 'id' in user;
}

const getFavicon = (url?: string | null) => {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return null;
  }
};

const RoadmapView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: roadmap, isLoading: isLoadingRoadmap } = useQuery<RoadmapWithUser | null>({
    queryKey: ['roadmap', id],
    queryFn: async () => {
      if (!id) return null;
      const { data: roadmapData, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      
      // Fetch user profile separately
      if (roadmapData && roadmapData.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('user_id', roadmapData.user_id)
          .single();
        
        return { ...roadmapData, user: profileData ? {id: profileData.id, full_name: profileData.full_name, avatar_url: profileData.avatar_url} : null };
      }
      
      return roadmapData;
    },
    enabled: !!id,
  });

  const { data: steps, isLoading: isLoadingSteps } = useQuery({
    queryKey: ['roadmapSteps', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('roadmap_steps')
        .select('*')
        .eq('roadmap_id', id)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: resourcesByStep, isLoading: isLoadingResources } = useQuery({
    queryKey: ['roadmapResources', id],
    queryFn: async () => {
      if (!steps || steps.length === 0) return {};
      const stepIds = steps.map(s => s.id);
      const { data, error } = await supabase
        .from('roadmap_step_resources')
        .select('*')
        .in('step_id', stepIds);
      if (error) throw error;
      return data.reduce((acc, resource) => {
        if (!acc[resource.step_id]) {
          acc[resource.step_id] = [];
        }
        acc[resource.step_id].push(resource);
        return acc;
      }, {} as Record<string, any[]>);
    },
    enabled: !!steps && steps.length > 0,
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery<CommentWithProfile[]>({
    queryKey: ['roadmapComments', id],
    queryFn: async () => {
      if (!id) return [];
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('roadmap_id', id)
        .order('created_at', { ascending: false});
      if (error) throw error;
      
      // Fetch profiles for all comments
      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', userIds);
        
        const profileMap = (profiles || []).reduce((acc: any, p: any) => {
          acc[p.user_id] = p;
          return acc;
        }, {});
        
        return commentsData.map(c => ({
          ...c,
          profile: profileMap[c.user_id] || null
        }));
      }
      
      return commentsData.map(c => ({...c, profile: null}));
    },
    enabled: !!id,
  });

  const { data: roadmapSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['roadmapSkills', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('roadmap_skills')
        .select('*')
        .eq('roadmap_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { templates, createTemplate, isLoading: isLoadingTemplate } = useRoadmapTemplates(id);
  const [templateData, setTemplateData] = useState<any>({
    goals: '',
    timeline: '',
    resources: '',
    notes: '',
    milestones: [],
    weeklyPlan: '',
    challenges: '',
    progress: '',
  });
  const { isFollowing, toggleFollow } = useUserFollows(roadmap?.user_id);

  const updateRoadmapMutation = useMutation({
    mutationFn: async (updates: Partial<any>) => {
      if (!id) throw new Error("Roadmap ID not found");
      const { data, error } = await supabase.from('roadmaps').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['roadmap', id], data);
      toast({ title: "Roadmap updated!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update roadmap", description: error.message, variant: "destructive" });
    }
  });

  const updateStepMutation = useMutation({
    mutationFn: async (updates: Partial<any> & { id: string }) => {
      const { id: stepId, ...rest } = updates;
      const { data, error } = await supabase.from('roadmap_steps').update(rest).eq('id', stepId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['roadmapSteps', id], (old: any[] | undefined) => old?.map(s => s.id === data.id ? data : s));
      if (editingStep === data.id) setEditingStep(null);
      toast({ title: "Step updated!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update step", description: error.message, variant: "destructive" });
    }
  });

  const toggleStepCompletion = (stepId: string, completed: boolean) => {
    updateStepMutation.mutate({ id: stepId, completed: completed });
    // Optimistically update progress
    const total = steps?.length || 0;
    const done = (steps || []).filter(s => (s.id === stepId ? completed : s.completed)).length;
    const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
    if (roadmap && roadmap.progress !== newProgress) {
        updateRoadmapMutation.mutate({ progress: newProgress, status: newProgress === 100 ? 'completed' : 'in-progress' });
    }
  };

  const addResourceMutation = useMutation({
    mutationFn: async ({ stepId, title, url, type }: { stepId: string, title: string, url?: string, type?: string }) => {
      const { data, error } = await supabase.from('roadmap_step_resources').insert({ step_id: stepId, title, url, type }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['roadmapResources', id], (old: Record<string, any[]> | undefined) => {
        const newRes = { ...(old || {}) };
        if (!newRes[data.step_id]) newRes[data.step_id] = [];
        newRes[data.step_id].push(data);
        return newRes;
      });
    }
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async ({ stepId, resourceId }: { stepId: string, resourceId: string }) => {
      const { error } = await supabase.from('roadmap_step_resources').delete().eq('id', resourceId);
      if (error) throw error;
      return { stepId, resourceId };
    },
    onSuccess: ({ stepId, resourceId }) => {
      queryClient.setQueryData(['roadmapResources', id], (old: Record<string, any[]> | undefined) => {
        const newRes = { ...(old || {}) };
        if (newRes[stepId]) {
          newRes[stepId] = newRes[stepId].filter(r => r.id !== resourceId);
        }
        return newRes;
      });
    }
  });

  const deleteRoadmapMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Roadmap ID not found");
      // This should ideally be a single RPC call on the backend to ensure atomicity
      const { error } = await supabase.from('roadmaps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Roadmap deleted successfully" });
      navigate('/my-roadmaps');
      queryClient.invalidateQueries({ queryKey: ['myRoadmaps'] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete roadmap", description: error.message, variant: "destructive" });
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id || !id) throw new Error("User or roadmap not specified");
      const existingTemplate = templates?.[0];
      
      if (existingTemplate) {
        const { error } = await supabase
          .from('roadmap_templates')
          .update({ template_data: data })
          .eq('id', existingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('roadmap_templates')
          .insert({
            user_id: user.id,
            roadmap_id: id,
            name: 'My Learning Template',
            template_data: data,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapTemplates', user?.id, id] });
      toast({ title: "Template saved successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to save template", description: error.message, variant: "destructive" });
    },
  });

  const handleTemplateUpdate = useCallback((field: string, value: any) => {
    setTemplateData((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const saveTemplate = useCallback(() => {
    updateTemplateMutation.mutate(templateData);
  }, [templateData, updateTemplateMutation]);

  // Load template data when available
useEffect(() => {
  if (templates && templates.length > 0) {
    const template = templates[0];
    if (template.template_data && typeof template.template_data === "object") {
      setTemplateData(template.template_data);
    }
  }
}, [templates]);

const isLoading =
  isLoadingRoadmap ||
  isLoadingSteps ||
  isLoadingResources ||
  isLoadingComments ||
  isLoadingTemplate ||
  isLoadingSkills;

const isOwner = user?.id === roadmap?.user_id;

// Initialize skills if they don't exist
useEffect(() => {
  const initializeSkills = async () => {
    if (!roadmap || !user || !isOwner) return;
    if (roadmapSkills && roadmapSkills.length > 0) return;

    const defaultSkills = getSkillsForDomain(roadmap.category);
    if (defaultSkills.length === 0) return;

    const skillsToInsert = defaultSkills.map((skill) => ({
      roadmap_id: id!,
      skill_name: skill,
      is_checked: false,
    }));

    await supabase.from("roadmap_skills").insert(skillsToInsert);
    queryClient.invalidateQueries({ queryKey: ["roadmapSkills", id] });
  };

  initializeSkills();
}, [roadmap, roadmapSkills, user, isOwner, id, queryClient]);

const toggleSkillMutation = useMutation({
  mutationFn: async ({
    skillId,
    isChecked,
  }: {
    skillId: string;
    isChecked: boolean;
  }) => {
    const { error } = await supabase
      .from("roadmap_skills")
      .update({ is_checked: isChecked })
      .eq("id", skillId);
    if (error) throw error;
    return { skillId, isChecked };
  },
  onSuccess: ({ skillId, isChecked }) => {
    queryClient.setQueryData(["roadmapSkills", id], (old: any[] | undefined) =>
      old?.map((s) =>
        s.id === skillId ? { ...s, is_checked: isChecked } : s
      )
    );
  },
});

// ✅ Return JSX after all hooks are declared
if (isLoading) {
  return (
    <Layout>
      <div>Loading roadmap...</div>
    </Layout>
  );
}

if (!roadmap) {
  return (
    <Layout>
      <div>Roadmap not found.</div>
    </Layout>
  );
}


  const groupedSteps = (steps || []).reduce((acc, step) => {
    let phase = 'General';
    if (step.title.includes('Introduction')) phase = 'Introduction';
    else if (step.title.includes('Milestone')) phase = 'Milestone';
    else if (step.title.includes('Final Outcome')) phase = 'Final Outcome';
    else if (step.order_index < (steps?.length || 0) / 3) phase = 'Beginner';
    else if (step.order_index < ((steps?.length || 0) * 2) / 3) phase = 'Intermediate';
    else phase = 'Advanced';

    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(step);
    return acc;
  }, {} as Record<string, any[]>);

  const phaseOrder = ['Introduction', 'Beginner', 'Intermediate', 'Advanced', 'Milestone', 'Final Outcome', 'General'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => updateRoadmapMutation.mutate({ is_public: !roadmap.is_public })}>
                {roadmap.is_public ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {roadmap.is_public ? 'Make Private' : 'Make Public'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteRoadmapMutation.mutate()}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          )}
        </div>

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" className="mb-2">{roadmap.category || 'Learning'}</Badge>
                <CardTitle className="text-3xl font-bold">{roadmap.title}</CardTitle>
                <p className="text-muted-foreground mt-2">{roadmap.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isProfileUser(roadmap.user) ? (
                  <Link to={`/profile/${roadmap.user.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={roadmap.user.avatar_url} />
                      <AvatarFallback>{roadmap.user.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{roadmap.user.full_name}</span>
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Unknown User</span>
                )}
                {!isOwner && user && roadmap.user && (
                  <Button size="sm" variant={isFollowing ? "outline" : "default"} onClick={() => toggleFollow()}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {roadmap.estimated_time}</span>
                <span className="flex items-center gap-1"><Target className="h-4 w-4" /> {roadmap.difficulty}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Created on {new Date(roadmap.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={roadmap.progress} className="w-full" />
              <span className="font-bold text-lg">{roadmap.progress}%</span>
            </div>
          </CardContent>
        </Card>

        {roadmapSkills && roadmapSkills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                {roadmap.category?.toLowerCase().includes('exam') ? 'Subjects/Topics to Learn' : 'Skills to Master'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Track the key {roadmap.category?.toLowerCase().includes('exam') ? 'topics' : 'skills'} you need to learn for this roadmap
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roadmapSkills.map((skill: any) => (
                  <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <Checkbox
                      checked={skill.is_checked}
                      onCheckedChange={(checked) => {
                        if (isOwner) {
                          toggleSkillMutation.mutate({ skillId: skill.id, isChecked: !!checked });
                        }
                      }}
                      disabled={!isOwner}
                    />
                    <span className={`flex-1 ${skill.is_checked ? 'line-through text-muted-foreground' : ''}`}>
                      {skill.skill_name}
                    </span>
                    {skill.is_checked && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Checking these {roadmap.category?.toLowerCase().includes('exam') ? 'topics' : 'skills'} doesn't affect your overall roadmap progress
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="steps" className="space-y-6">
          <TabsList>
            <TabsTrigger value="steps">Roadmap Steps</TabsTrigger>
            <TabsTrigger value="template">My Template</TabsTrigger>
          </TabsList>
          <TabsContent value="steps">
            {phaseOrder.map(phase => (
              groupedSteps[phase] && (
                <div key={phase} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{phase}</h2>
                  <Accordion type="single" collapsible className="w-full" defaultValue={phase === 'Introduction' ? `item-${groupedSteps[phase][0].id}` : undefined}>
                    {(groupedSteps[phase] || []).map((step: any) => (
                      <AccordionItem value={`item-${step.id}`} key={step.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-4 w-full">
                            {isOwner && <Checkbox checked={step.completed} onCheckedChange={(checked) => toggleStepCompletion(step.id, !!checked)} onClick={(e) => e.stopPropagation()} />}
                            <span className={`flex-1 text-left ${step.completed ? 'line-through text-muted-foreground' : ''}`}>{step.title}</span>
                            <Badge variant="outline">{step.duration}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/40 rounded-md">
                          {editingStep === step.id ? (
                            <div className="space-y-4">
                              <Input defaultValue={step.title} onBlur={(e) => updateStepMutation.mutate({ id: step.id, title: e.target.value })} />
                              <Textarea defaultValue={step.description} onBlur={(e) => updateStepMutation.mutate({ id: step.id, description: e.target.value })} />
                              {/* Add more editable fields here */}
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setEditingStep(null)}><Save className="h-4 w-4 mr-2" />Done</Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="mb-4">{step.description}</p>
                              {step.task && <p className="mb-4 p-2 bg-background rounded"><b>Task:</b> {step.task}</p>}
                              {step.topics && step.topics.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="font-semibold mb-2">Topics to cover:</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {step.topics.map((topic: string, i: number) => <li key={i}>{topic}</li>)}
                                  </ul>
                                </div>
                              )}
                              <div className="mb-4">
                                <h4 className="font-semibold mb-2">Resources:</h4>
                                <div className="space-y-2">
                                  {(resourcesByStep?.[step.id] || []).map((res: any) => (
                                    <div key={res.id} className="flex items-center justify-between gap-2 p-2 bg-background rounded">
                                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                                        <img src={getFavicon(res.url)} alt="" className="h-4 w-4" />
                                        <span>{res.title}</span>
                                        <Badge variant="secondary">{res.type}</Badge>
                                      </a>
                                      {isOwner && <Button size="icon" variant="ghost" onClick={() => deleteResourceMutation.mutate({ stepId: step.id, resourceId: res.id })}><Trash2 className="h-4 w-4" /></Button>}
                                    </div>
                                  ))}
                                  {isOwner && (
                                    <Button size="sm" variant="outline" onClick={() => {
                                      const title = prompt("Resource title:");
                                      if (title) {
                                        const url = prompt("Resource URL (optional):") || undefined;
                                        const type = prompt("Resource type (e.g., video, article):") || undefined;
                                        addResourceMutation.mutate({ stepId: step.id, title, url, type });
                                      }
                                    }}><Plus className="h-4 w-4 mr-2" />Add Resource</Button>
                                  )}
                                </div>
                              </div>
                              {isOwner && <Button size="sm" variant="ghost" onClick={() => setEditingStep(step.id)}><Edit3 className="h-4 w-4 mr-2" />Edit Step</Button>}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )
            ))}
          </TabsContent>
          <TabsContent value="template" className="max-w-4xl mx-auto">
            {/* Notion-style Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">AI/ML Learning Roadmap</h1>
              </div>
              {isOwner && (
                <div className="flex justify-end">
                  <Button onClick={saveTemplate} disabled={updateTemplateMutation.isPending} variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {updateTemplateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            {/* Notion-style Accordion Sections */}
            <Accordion type="multiple" defaultValue={["overview", "goals", "schedule", "resources"]} className="space-y-4">
              {/* Overview Section */}
              <AccordionItem value="overview" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Rocket className="h-5 w-5 text-primary" />
                    <span>📋 Overview</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">About this roadmap</Label>
                      <Textarea
                        placeholder="Describe your learning journey, what you want to achieve, and why..."
                        value={templateData.goals}
                        onChange={(e) => handleTemplateUpdate('goals', e.target.value)}
                        disabled={!isOwner}
                        rows={5}
                        className="mt-2 resize-none border-0 bg-muted/50 focus-visible:ring-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Learning Goals Section */}
              <AccordionItem value="goals" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span>🎯 Learning Goals</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground">What I want to achieve</Label>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                        <Checkbox disabled={!isOwner} className="mt-1" />
                        <Input
                          placeholder="Goal 1: Master fundamental concepts..."
                          disabled={!isOwner}
                          className="border-0 bg-transparent focus-visible:ring-0 p-0"
                        />
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                        <Checkbox disabled={!isOwner} className="mt-1" />
                        <Input
                          placeholder="Goal 2: Build real-world projects..."
                          disabled={!isOwner}
                          className="border-0 bg-transparent focus-visible:ring-0 p-0"
                        />
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                        <Checkbox disabled={!isOwner} className="mt-1" />
                        <Input
                          placeholder="Goal 3: Contribute to open source..."
                          disabled={!isOwner}
                          className="border-0 bg-transparent focus-visible:ring-0 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Study Schedule Section */}
              <AccordionItem value="schedule" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>📅 Study Schedule</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground mb-2 block">Timeline</Label>
                      <Textarea
                        placeholder="Week 1-2: Python Basics & Data Structures&#10;Week 3-4: Machine Learning Fundamentals&#10;Week 5-6: Deep Learning Introduction..."
                        value={templateData.timeline}
                        onChange={(e) => handleTemplateUpdate('timeline', e.target.value)}
                        disabled={!isOwner}
                        rows={8}
                        className="resize-none border-0 bg-muted/50 focus-visible:ring-1 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground mb-2 block">Weekly Plan</Label>
                      <Textarea
                        placeholder="Monday: Theory (2 hours)&#10;Tuesday: Coding Practice (3 hours)&#10;Wednesday: Projects (2 hours)&#10;Thursday: Review & Notes (1 hour)&#10;Friday: Hands-on Labs (3 hours)..."
                        value={templateData.weeklyPlan}
                        onChange={(e) => handleTemplateUpdate('weeklyPlan', e.target.value)}
                        disabled={!isOwner}
                        rows={6}
                        className="resize-none border-0 bg-muted/50 focus-visible:ring-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Resources Section */}
              <AccordionItem value="resources" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>📚 Resources & Materials</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4">
                    {/* Books */}
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Book className="h-4 w-4" />
                        <h4 className="font-semibold">Books</h4>
                      </div>
                      <Textarea
                        placeholder="• Deep Learning by Ian Goodfellow&#10;• Hands-On Machine Learning by Aurélien Géron&#10;• Pattern Recognition and Machine Learning by Christopher Bishop"
                        value={templateData.resources}
                        onChange={(e) => handleTemplateUpdate('resources', e.target.value)}
                        disabled={!isOwner}
                        rows={4}
                        className="resize-none border-0 bg-background focus-visible:ring-1 text-sm"
                      />
                    </div>

                    {/* Online Courses */}
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <MonitorPlay className="h-4 w-4" />
                        <h4 className="font-semibold">Online Courses</h4>
                      </div>
                      <Textarea
                        placeholder="• Andrew Ng - Machine Learning (Coursera)&#10;• Fast.ai - Practical Deep Learning&#10;• MIT 6.S191 - Introduction to Deep Learning"
                        disabled={!isOwner}
                        rows={4}
                        className="resize-none border-0 bg-background focus-visible:ring-1 text-sm"
                      />
                    </div>

                    {/* Documentation & Links */}
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-4 w-4" />
                        <h4 className="font-semibold">Documentation & Links</h4>
                      </div>
                      <Textarea
                        placeholder="• TensorFlow Documentation&#10;• PyTorch Tutorials&#10;• Scikit-learn User Guide&#10;• Papers with Code"
                        disabled={!isOwner}
                        rows={4}
                        className="resize-none border-0 bg-background focus-visible:ring-1 text-sm"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Progress Tracker Section */}
              <AccordionItem value="progress" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>✅ Progress Tracker</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-muted-foreground">Daily/Weekly Progress Log</Label>
                    <Textarea
                      placeholder="📅 Week 1 - Day 1&#10;✅ Completed Python basics review&#10;✅ Finished NumPy tutorial&#10;🔄 Working on Pandas exercises&#10;&#10;💡 Key Insights:&#10;- NumPy broadcasting is powerful for vectorized operations&#10;- Need more practice with data manipulation&#10;&#10;🎯 Next Steps:&#10;- Complete Pandas practice problems&#10;- Start linear algebra review"
                      value={templateData.progress}
                      onChange={(e) => handleTemplateUpdate('progress', e.target.value)}
                      disabled={!isOwner}
                      rows={12}
                      className="resize-none border-0 bg-muted/50 focus-visible:ring-1 font-mono text-sm"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Projects Section */}
              <AccordionItem value="projects" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Codepen className="h-5 w-5 text-primary" />
                    <span>🚀 Projects & Practice</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-muted/50">
                      <div className="flex items-start gap-3">
                        <Checkbox disabled={!isOwner} className="mt-1" />
                        <div className="flex-1">
                          <Input
                            placeholder="Project 1: Build a sentiment analysis model"
                            disabled={!isOwner}
                            className="font-semibold border-0 bg-transparent focus-visible:ring-0 p-0 mb-2"
                          />
                          <Textarea
                            placeholder="Description: Create a model to classify movie reviews...&#10;Status: In Progress&#10;Tech Stack: Python, TensorFlow, NLTK"
                            disabled={!isOwner}
                            rows={3}
                            className="resize-none border-0 bg-transparent focus-visible:ring-0 text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border-l-4 border-l-green-500 bg-muted/50">
                      <div className="flex items-start gap-3">
                        <Checkbox disabled={!isOwner} className="mt-1" />
                        <div className="flex-1">
                          <Input
                            placeholder="Project 2: Image classification with CNNs"
                            disabled={!isOwner}
                            className="font-semibold border-0 bg-transparent focus-visible:ring-0 p-0 mb-2"
                          />
                          <Textarea
                            placeholder="Description: Train a CNN to classify images...&#10;Status: Not Started&#10;Tech Stack: PyTorch, OpenCV"
                            disabled={!isOwner}
                            rows={3}
                            className="resize-none border-0 bg-transparent focus-visible:ring-0 text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Challenges & Solutions Section */}
              <AccordionItem value="challenges" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span>💡 Challenges & Solutions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <Textarea
                    placeholder="🔴 Challenge 1: Understanding backpropagation&#10;✅ Solution: Watched 3Blue1Brown videos, implemented from scratch&#10;&#10;🔴 Challenge 2: Overfitting in my model&#10;✅ Solution: Added dropout layers and data augmentation&#10;&#10;🔴 Challenge 3: Slow training times&#10;🔄 Working on: Optimizing batch size and using GPU acceleration"
                    value={templateData.challenges}
                    onChange={(e) => handleTemplateUpdate('challenges', e.target.value)}
                    disabled={!isOwner}
                    rows={10}
                    className="resize-none border-0 bg-muted/50 focus-visible:ring-1 font-mono text-sm"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Notes & Insights Section */}
              <AccordionItem value="notes" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <PenLine className="h-5 w-5 text-primary" />
                    <span>📝 Notes & Insights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <Textarea
                    placeholder="Key Takeaways:&#10;• Neural networks are essentially function approximators&#10;• The learning rate is one of the most important hyperparameters&#10;• Data quality > Model complexity&#10;&#10;Important Concepts:&#10;1. Gradient Descent&#10;2. Regularization Techniques&#10;3. Batch Normalization&#10;&#10;Resources to Revisit:&#10;- Chapter 5 of Deep Learning book&#10;- Stanford CS231n lectures"
                    value={templateData.notes}
                    onChange={(e) => handleTemplateUpdate('notes', e.target.value)}
                    disabled={!isOwner}
                    rows={12}
                    className="resize-none border-0 bg-muted/50 focus-visible:ring-1 font-mono text-sm"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Bottom Save Button */}
            {isOwner && (
              <div className="mt-8 flex justify-center">
                <Button onClick={saveTemplate} disabled={updateTemplateMutation.isPending} size="lg" className="min-w-[200px]">
                  <Save className="h-4 w-4 mr-2" />
                  {updateTemplateMutation.isPending ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <CommentDialog
        isOpen={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        roadmapId={id!}
        comments={comments?.map(c => ({
          id: c.id,
          author: (c.profile as any)?.full_name || 'Anonymous',
          avatar: (c.profile as any)?.avatar_url,
          content: c.content,
          timestamp: new Date(c.created_at).toISOString(),
          likes: 0, // You might need to fetch likes separately if needed
        })) || []}
      />
      <ShareLinkDialog
        roadmapId={roadmap?.id}
        isPublic={roadmap?.is_public ?? false}
        roadmapTitle={roadmap?.title ?? ''}
        onPublicToggle={async (isPublic) => {
          if (!roadmap?.id) return;
          await supabase.from('roadmaps').update({ is_public: isPublic }).eq('id', roadmap.id);
        }}
      />
    </Layout>
  );
};

export default RoadmapView;

