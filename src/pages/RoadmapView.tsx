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
  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const [templateData, setTemplateData] = useState<any>({
    // Basic sections
    intro: '', // Welcome / description
    howToUse: '',
    // Progress table rows (4 rows by default)
    progressRows: [
      { id: genId(), phase: 'Foundations', status: '', timeline: '', notes: '' },
      { id: genId(), phase: 'DSA', status: '', timeline: '', notes: '' },
      { id: genId(), phase: 'Machine Learning', status: '', timeline: '', notes: '' },
      { id: genId(), phase: 'Deep Learning', status: '', timeline: '', notes: '' },
    ],
    // Goals and profile
    experienceLevel: '',
    weeklyTime: '',
    totalMonths: '',
    // Side topics as checklist
    sideTopics: [], // {id, name, checked}
    // Skills checklist
    skills: [], // {id, name, checked}
    // Goals
    goals: [], // {id, text, checked}
    // Resources
    resources: [], // {id, title, url}
    // Additional tools & communities
    practicePlatforms: '',
    communities: '',
    newsletters: '',
    // Achievements & portfolio
    achievements: [], // {id, text}
    certificates: '',
    projectsPortfolio: '',
    contributions: '',
    // Learning journal & quarterly reviews
    learningJournal: '',
    q1Review: '',
    q2Review: '',
    // Next steps & career planning
    skillsToDevelop: '',
    researchInterests: '',
    careerShort: '',
    careerMedium: '',
    careerLong: '',
  });

  // Handlers for dynamic lists
  const addSkill = () => setTemplateData((prev:any) => ({ ...prev, skills: [...(prev.skills||[]), { id: genId(), name: '', checked: false }] }));
  const updateSkill = (id: string, patch: Partial<any>) => setTemplateData((prev:any) => ({ ...prev, skills: (prev.skills||[]).map((s:any)=> s.id===id ? {...s, ...patch} : s) }));
  const removeSkill = (id: string) => setTemplateData((prev:any) => ({ ...prev, skills: (prev.skills||[]).filter((s:any)=> s.id!==id) }));

  const addSideTopic = () => setTemplateData((prev:any) => ({ ...prev, sideTopics: [...(prev.sideTopics||[]), { id: genId(), name: '', checked: false }] }));
  const updateSideTopic = (id: string, patch: Partial<any>) => setTemplateData((prev:any) => ({ ...prev, sideTopics: (prev.sideTopics||[]).map((t:any)=> t.id===id ? {...t, ...patch} : t) }));
  const removeSideTopic = (id: string) => setTemplateData((prev:any) => ({ ...prev, sideTopics: (prev.sideTopics||[]).filter((t:any)=> t.id!==id) }));

  const addResource = () => setTemplateData((prev:any) => ({ ...prev, resources: [...(prev.resources||[]), { id: genId(), title: '', url: '' }] }));
  const updateResource = (id: string, patch: Partial<any>) => setTemplateData((prev:any) => ({ ...prev, resources: (prev.resources||[]).map((r:any)=> r.id===id ? {...r, ...patch} : r) }));
  const removeResource = (id: string) => setTemplateData((prev:any) => ({ ...prev, resources: (prev.resources||[]).filter((r:any)=> r.id!==id) }));

  const addGoal = () => setTemplateData((prev:any) => ({ ...prev, goals: [...(prev.goals||[]), { id: genId(), text: '', checked: false }] }));
  const updateGoal = (id: string, patch: Partial<any>) => setTemplateData((prev:any) => ({ ...prev, goals: (prev.goals||[]).map((g:any)=> g.id===id ? {...g, ...patch} : g) }));
  const removeGoal = (id: string) => setTemplateData((prev:any) => ({ ...prev, goals: (prev.goals||[]).filter((g:any)=> g.id!==id) }));

  const addAchievement = () => setTemplateData((prev:any) => ({ ...prev, achievements: [...(prev.achievements||[]), { id: genId(), text: '' }] }));
  const updateAchievement = (id: string, text: string) => setTemplateData((prev:any) => ({ ...prev, achievements: (prev.achievements||[]).map((a:any)=> a.id===id ? {...a, text} : a) }));
  const removeAchievement = (id: string) => setTemplateData((prev:any) => ({ ...prev, achievements: (prev.achievements||[]).filter((a:any)=> a.id!==id) }));

  const addProgressRow = () => setTemplateData((prev:any) => ({ ...prev, progressRows: [...(prev.progressRows||[]), { id: genId(), phase: '', status: '', timeline: '', notes: '' }] }));
  const removeProgressRow = (id: string) => setTemplateData((prev:any) => ({ ...prev, progressRows: (prev.progressRows||[]).filter((r:any)=> r.id!==id) }));
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
          <TabsContent value="template" className="w-full">
            <div className="max-w-5xl mx-auto bg-white dark:bg-muted rounded-xl shadow-md p-6 md:p-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-700">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{roadmap?.title ?? 'Learning Roadmap'}</h1>
                    <p className="text-sm text-muted-foreground">A structured, editable learning template you can customize.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Award className="h-4 w-4 mr-2" /> Favorite
                  </Button>
                  <Button onClick={saveTemplate} disabled={updateTemplateMutation.isPending} size="sm">
                    <Save className="h-4 w-4 mr-2" /> {updateTemplateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left / Main Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* How to Use */}
                  <Card className="p-4">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">How to use this template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                        <li>Start by filling out your learning goals and experience level.</li>
                        <li>Use the progress tracker to break down phases and timelines.</li>
                        <li>Add resources and projects as you progress; save changes when done.</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Progress Tracker (table) */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Progress Tracker</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={addProgressRow}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] table-fixed border-collapse">
                          <thead>
                            <tr className="text-left text-sm text-muted-foreground">
                              <th className="p-3 w-1/4">Phase</th>
                              <th className="p-3 w-1/6">Status</th>
                              <th className="p-3 w-1/6">Timeline</th>
                              <th className="p-3">Notes</th>
                              <th className="p-3 w-12"> </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(templateData.progressRows || []).map((row: any, idx: number) => (
                              <tr key={row.id} className="border-t">
                                <td className="p-3 align-top">
                                  <Input value={row.phase} placeholder={`Phase ${idx + 1}`} onChange={(e) => setTemplateData((prev:any)=>{
                                    const rows = (prev.progressRows || []).map((r:any)=> r.id===row.id ? {...r, phase: e.target.value} : r);
                                    return {...prev, progressRows: rows};
                                  })} />
                                </td>
                                <td className="p-3 align-top">
                                  <Input value={row.status} placeholder="Not Started" onChange={(e) => setTemplateData((prev:any)=>{
                                    const rows = (prev.progressRows || []).map((r:any)=> r.id===row.id ? {...r, status: e.target.value} : r);
                                    return {...prev, progressRows: rows};
                                  })} />
                                </td>
                                <td className="p-3 align-top">
                                  <Input value={row.timeline} placeholder="2-4 weeks" onChange={(e) => setTemplateData((prev:any)=>{
                                    const rows = (prev.progressRows || []).map((r:any)=> r.id===row.id ? {...r, timeline: e.target.value} : r);
                                    return {...prev, progressRows: rows};
                                  })} />
                                </td>
                                <td className="p-3 align-top">
                                  <Textarea value={row.notes} placeholder="Notes..." rows={2} onChange={(e) => setTemplateData((prev:any)=>{
                                    const rows = (prev.progressRows || []).map((r:any)=> r.id===row.id ? {...r, notes: e.target.value} : r);
                                    return {...prev, progressRows: rows};
                                  })} className="resize-none" />
                                </td>
                                <td className="p-3 align-top">
                                  <Button size="icon" variant="ghost" onClick={() => removeProgressRow(row.id)}><Trash2 className="h-4 w-4" /></Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Learning Goals & Experience */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Learning Goals</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={addGoal}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Top Goals</Label>
                          <div className="space-y-2">
                            {(templateData.goals||[]).map((g:any)=> (
                              <div key={g.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                                <Checkbox checked={g.checked} onCheckedChange={(c)=> updateGoal(g.id, { checked: !!c })} className="mt-1" />
                                <Input placeholder="Goal..." value={g.text} onChange={(e)=> updateGoal(g.id, { text: e.target.value })} className="border-0 bg-transparent" />
                                <Button size="icon" variant="ghost" onClick={()=> removeGoal(g.id)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Experience & Time</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input placeholder="Experience (Beginner/Intermediate)" value={templateData.experienceLevel} onChange={(e)=>handleTemplateUpdate('experienceLevel', e.target.value)} />
                            <Input placeholder="Weekly hrs" value={templateData.weeklyTime} onChange={(e)=>handleTemplateUpdate('weeklyTime', e.target.value)} />
                            <Input placeholder="Total months" value={templateData.totalMonths} onChange={(e)=>handleTemplateUpdate('totalMonths', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projects / Journal */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-primary" /> Journal & Achievements</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={addAchievement}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Label className="text-sm font-medium">Learning Journal</Label>
                      <Textarea value={templateData.learningJournal} onChange={(e)=>handleTemplateUpdate('learningJournal', e.target.value)} rows={6} className="resize-none" placeholder="Daily/weekly notes..." />

                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium">Achievements</Label>
                        {(templateData.achievements||[]).map((a:any)=> (
                          <div key={a.id} className="flex items-center gap-2">
                            <Input placeholder="Achievement" value={a.text} onChange={(e)=> updateAchievement(a.id, e.target.value)} className="flex-1" />
                            <Button size="icon" variant="ghost" onClick={()=> removeAchievement(a.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right / Sidebar */}
                  <aside className="space-y-6">
                  {/* Skills Checklist */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-md font-semibold flex items-center gap-2"><ListChecks className="h-4 w-4" /> Skills</CardTitle>
                        <div>
                          <Button size="sm" variant="ghost" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(templateData.skills||[]).map((s:any)=> (
                          <div key={s.id} className="flex items-center gap-2">
                            <Checkbox checked={s.checked} onCheckedChange={(c)=> updateSkill(s.id, { checked: !!c })} />
                            <Input value={s.name} placeholder="Skill name" onChange={(e)=> updateSkill(s.id, { name: e.target.value })} className="flex-1" />
                            <Button size="icon" variant="ghost" onClick={()=> removeSkill(s.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Side Topics */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-md font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Side Topics</CardTitle>
                        <div>
                          <Button size="sm" variant="ghost" onClick={addSideTopic}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(templateData.sideTopics||[]).map((t:any)=> (
                          <div key={t.id} className="flex items-center gap-2">
                            <Checkbox checked={t.checked} onCheckedChange={(c)=> updateSideTopic(t.id, { checked: !!c })} />
                            <Input value={t.name} placeholder="Topic name" onChange={(e)=> updateSideTopic(t.id, { name: e.target.value })} className="flex-1" />
                            <Button size="icon" variant="ghost" onClick={()=> removeSideTopic(t.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resources Cards */}
                  <Card className="p-4">
                    <CardHeader>
                      <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-md font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4" /> Resources</CardTitle>
                        <div>
                          <Button size="sm" variant="ghost" onClick={addResource}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {(templateData.resources||[]).map((r:any)=> (
                          <div key={r.id} className="p-2 rounded-md border bg-background flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            <div className="flex-1">
                              <Input placeholder="Resource title" value={r.title} onChange={(e)=> updateResource(r.id, { title: e.target.value })} className="border-0 bg-transparent" />
                              <Input placeholder="https://example.com" value={r.url} onChange={(e)=> updateResource(r.id, { url: e.target.value })} className="border-0 bg-transparent text-xs text-muted-foreground mt-1" />
                            </div>
                            <Button size="icon" variant="ghost" onClick={()=> removeResource(r.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </aside>
              </div>

              {/* Bottom save */}
              <div className="mt-6 flex justify-center">
                <Button onClick={saveTemplate} disabled={updateTemplateMutation.isPending} size="lg" className="min-w-[220px]">
                  <Save className="h-4 w-4 mr-2" /> {updateTemplateMutation.isPending ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>
            </div>
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

