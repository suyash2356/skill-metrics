
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

import {
  MapPin,
  Calendar,
  ExternalLink,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Target,
  X,
  Plus,
  Upload,
  Edit,
  Save,
  Trophy,
  MessageCircle,
  Lock,
  Globe
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import { useUserFollows } from "@/hooks/useUserFollows";
import { useUserProfileDetails, SocialLink, Skill, Achievement, LearningPathItem } from "@/hooks/useUserProfileDetails";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const targetUserId = userId || currentUser?.id;
  const { toast } = useToast();

  const { isFollowing, toggleFollow, followerCount, followingCount, isLoadingFollowStatus, getFollowButtonState } = useUserFollows(targetUserId);
  const { profileDetails, isLoading: isLoadingProfile, updateProfileDetails, isUpdating } = useUserProfileDetails(targetUserId);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [previewPost, setPreviewPost] = useState<any | null>(null);

  const { data: publicUserData, isLoading: isLoadingPublicUser } = useQuery({
    queryKey: ['publicProfile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', targetUserId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!targetUserId,
  });

  // Check if profile is private and if viewer has access
  const { data: privacySettings } = useQuery({
    queryKey: ['userPrivacy', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('user_preferences')
        .select('profile_visibility')
        .eq('user_id', targetUserId)
        .single();
      if (error && error.code !== 'PGRST116') return { profile_visibility: 'public' };
      return data || { profile_visibility: 'public' };
    },
    enabled: !!targetUserId,
  });

  const isOwnProfile = currentUser?.id === targetUserId;
  const isPrivateAccount = privacySettings?.profile_visibility === 'private';
  const canViewProfile = isOwnProfile || !isPrivateAccount || isFollowing;

  useEffect(() => {
    if (profileDetails && publicUserData) {
      setFormData({
        name: publicUserData.full_name || '',
        title: profileDetails.job_title || '',
        location: profileDetails.location || '',
        joinDate: profileDetails.join_date || '',
        avatar: publicUserData.avatar_url || '',
        bio: profileDetails.bio || '',
        portfolioUrl: profileDetails.portfolio_url || '',
        // socialLinks is an array of { title?: string, platform?: string, url: string }
        socialLinks: (profileDetails.social_links || []).map((s: any) => ({ title: s.title || s.platform || s.url, platform: s.platform, url: s.url })) || [],
        skills: profileDetails.skills || [],
        achievements: profileDetails.achievements || [],
        learningPath: profileDetails.learning_path || [],
      });
    }
  }, [profileDetails, publicUserData, editMode]);

  // Close preview on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewPost(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['profileStats', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase.rpc('get_profile_stats' as any, { target_user_id: targetUserId });
      if (error) throw error;
      return data as { post_count: number; roadmap_count: number; follower_count: number; following_count: number };
    },
    enabled: !!targetUserId,
  });

  const { data: userRoadmaps, isLoading: isLoadingRoadmaps } = useQuery({
    queryKey: ['userRoadmaps', targetUserId, currentUser?.id],
    queryFn: async () => {
      if (!targetUserId) return [];
      const isOwnProfile = currentUser?.id === targetUserId;
      let query = supabase
        .from('roadmaps')
        .select('id, title, description, progress, status, created_at, is_public')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (!isOwnProfile) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId && canViewProfile,
  });

  const { data: userActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['userActivity', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId && canViewProfile,
  });

  const { data: userPosts, isLoading: isLoadingUserPosts } = useQuery({
    queryKey: ['userPosts', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId && canViewProfile,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !targetUserId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${targetUserId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', targetUserId);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar: publicUrl });
      toast({ title: "Avatar updated successfully!" });
    } catch (error: any) {
      toast({ title: "Failed to upload avatar", description: error.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!targetUserId) return;
    try {
      // Build social_links array from explicit fields if provided
      // Normalize and dedupe links by URL
      const rawLinks = (formData.socialLinks || []).filter((l: any) => l && l.url).slice();
      const seen = new Set<string>();
      const socialLinks: any[] = [];
      for (const l of rawLinks) {
        try {
          const url = (l.url || '').trim();
          if (!url) continue;
          if (seen.has(url)) continue;
          seen.add(url);
          socialLinks.push({ title: l.title || undefined, platform: undefined, url });
        } catch (e) { continue; }
      }

      await updateProfileDetails({
        user_id: targetUserId,
        job_title: formData.title,
        location: formData.location,
        join_date: formData.joinDate,
        bio: formData.bio,
        portfolio_url: formData.portfolioUrl,
        social_links: socialLinks,
        skills: formData.skills,
        achievements: formData.achievements,
        learning_path: formData.learningPath,
      });

      const { error: userUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          avatar_url: formData.avatar,
        })
        .eq('user_id', targetUserId);

      if (userUpdateError) throw userUpdateError;

      toast({ title: "Profile updated successfully!" });
      setEditMode(false);
    } catch (error: any) {
      toast({ title: "Failed to update profile", description: error.message, variant: "destructive" });
    }
  };

  const initials = (publicUserData?.full_name || 'U').split(' ').map(n => n[0]).join('');

  if (isLoadingProfile || isLoadingPublicUser) {
    return <Layout><div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading profile...</p></div></Layout>;
  }



  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative text-center">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mx-auto">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="text-3xl sm:text-4xl">{initials}</AvatarFallback>
                </Avatar>
                {currentUser?.id === targetUserId && editMode && (
                  <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                      <Upload className="h-4 w-4" />
                    </div>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                  {editMode ? (
                    <div className="space-y-2">
                      <Input placeholder="Your Name" className="text-2xl font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      <Input placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><Input placeholder="Joined date, e.g. 2023" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} /></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold">{publicUserData?.full_name || 'Your Name'}</h1>
                        <Badge variant={isPrivateAccount ? "secondary" : "outline"} className="flex items-center gap-1">
                          {isPrivateAccount ? (
                            <><Lock className="h-3 w-3" /> Private</>
                          ) : (
                            <><Globe className="h-3 w-3" /> Public</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-md sm:text-lg text-muted-foreground">{profileDetails?.job_title || 'Your Title'}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{profileDetails?.location || 'Location'}</span></div>
                        <div className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>Joined {profileDetails?.join_date || '-'}</span></div>
                      </div>
                    </>
                  )}
                </div>

                {editMode ? (
                  <Textarea placeholder="Short bio..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
                ) : (
                  <p className="text-foreground max-w-2xl mx-auto sm:mx-0 break-words">{profileDetails?.bio || 'No bio provided.'}</p>
                )}

                {editMode ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Portfolio URL (optional)</Label>
                        <Input placeholder="https://your-portfolio.example" value={formData.portfolioUrl || ''} onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })} />
                      </div>
                      <div />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Links (title + URL)</Label>
                        <Button size="sm" onClick={() => setFormData({ ...formData, socialLinks: [...(formData.socialLinks || []), { title: '', url: '' }] })}><Plus className="h-4 w-4 mr-1" /> Add Link</Button>
                      </div>
                      <div className="space-y-2">
                        {(formData.socialLinks || []).map((s: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input placeholder="Title (e.g., GitHub)" value={s.title || ''} onChange={(e) => {
                              const newLinks = [...(formData.socialLinks || [])]; newLinks[idx].title = e.target.value; setFormData({ ...formData, socialLinks: newLinks });
                            }} />
                            <Input placeholder="https://" value={s.url || ''} onChange={(e) => {
                              const newLinks = [...(formData.socialLinks || [])]; newLinks[idx].url = e.target.value; setFormData({ ...formData, socialLinks: newLinks });
                            }} />
                            <Button variant="ghost" size="icon" onClick={() => { const newLinks = (formData.socialLinks || []).filter((_: any, i: number) => i !== idx); setFormData({ ...formData, socialLinks: newLinks }); }}><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                        {(formData.socialLinks || []).length === 0 && <p className="text-sm text-muted-foreground">No links added yet.</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                    {(profileDetails?.social_links || []).map((link: SocialLink, index: number) => (
                      <a key={index} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" /> <span>{link.title || link.platform || link.url}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                {currentUser?.id === targetUserId ? (
                  editMode ? (
                    <div className="flex gap-2 w-full">
                      <Button className="flex-1" onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save</>}</Button>
                      <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setEditMode(true)}><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
                  )
                ) : (
                  <div className="flex gap-2 w-full">
                    {isFollowing ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoadingFollowStatus}
                            variant={getFollowButtonState().variant}
                            className="flex-1"
                          >
                            {getFollowButtonState().text}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Unfollow {publicUserData?.full_name || 'User'}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to unfollow this user? You will stop seeing their posts and updates in your feed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={toggleFollow}>Unfollow</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        onClick={toggleFollow}
                        disabled={isLoadingFollowStatus}
                        variant={getFollowButtonState().variant}
                        className="flex-1"
                      >
                        {getFollowButtonState().text}
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" /> Message
                    </Button>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  {profileDetails?.portfolio_url ?
                    <a href={profileDetails.portfolio_url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-2" />Portfolio</a> :
                    <span><ExternalLink className="h-4 w-4 mr-2" />Portfolio</span>}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-6 pt-6 border-t">
              <div><div className="text-xl sm:text-2xl font-bold text-primary">{stats?.follower_count ?? followerCount ?? 0}</div><div className="text-xs text-muted-foreground">Followers</div></div>
              <div><div className="text-xl sm:text-2xl font-bold text-primary">{stats?.following_count ?? followingCount ?? 0}</div><div className="text-xs text-muted-foreground">Following</div></div>
              <div><div className="text-xl sm:text-2xl font-bold text-primary">{stats?.post_count ?? 0}</div><div className="text-xs text-muted-foreground">Posts</div></div>
              <div><div className="text-xl sm:text-2xl font-bold text-primary">{stats?.roadmap_count ?? 0}</div><div className="text-xs text-muted-foreground">Roadmaps</div></div>
            </div>
          </CardContent>
        </Card>

        {(!canViewProfile && isPrivateAccount) ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">This account is private</h2>
                  <p className="text-muted-foreground">Follow to see their posts, roadmaps, and activity.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="roadmaps" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
              <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="roadmaps">
              <Card>
                <CardHeader><CardTitle>My Roadmaps</CardTitle></CardHeader>
                <CardContent>
                  {isLoadingRoadmaps ? <p>Loading roadmaps...</p> : (userRoadmaps || []).length === 0 ? <p>No roadmaps created yet.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(userRoadmaps || []).map((roadmap: any) => (
                        <Link to={`/roadmaps/${roadmap.id}`} key={roadmap.id} className="block">
                          <Card className="hover:border-primary transition-colors">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-1">{roadmap.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{roadmap.description}</p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progress: {roadmap.progress}%</span>
                                <Badge variant="secondary">{roadmap.status}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Skills</CardTitle>
                    {editMode && <Button size="sm" onClick={() => setFormData({ ...formData, skills: [...(formData.skills || []), { name: '', category: '', level: 0 }] })}><Plus className="h-4 w-4 mr-1" /> Add</Button>}
                  </div>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <div className="space-y-4">
                      {(formData.skills || []).map((skill: Skill, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1 space-y-2">
                            <Input placeholder="Skill name (e.g., React)" value={skill.name} onChange={(e) => {
                              const newSkills = [...formData.skills]; newSkills[index].name = e.target.value; setFormData({ ...formData, skills: newSkills });
                            }} />
                            <Input placeholder="Category (e.g., Frontend)" value={skill.category} onChange={(e) => {
                              const newSkills = [...formData.skills]; newSkills[index].category = e.target.value; setFormData({ ...formData, skills: newSkills });
                            }} />
                            <div className="flex items-center gap-2"><Label className="text-sm">Level:</Label><Input type="range" min="0" max="100" value={skill.level} onChange={(e) => {
                              const newSkills = [...formData.skills]; newSkills[index].level = parseInt(e.target.value) || 0; setFormData({ ...formData, skills: newSkills });
                            }} className="w-full" /><span className="text-sm font-medium">{skill.level}%</span></div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) })}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      {(formData.skills || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No skills added yet.</p>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(profileDetails?.skills || []).map((skill: Skill, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2"><h4 className="font-semibold">{skill.name}</h4><Badge variant="secondary">{skill.category}</Badge></div>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">Proficiency</span><span className="font-medium">{skill.level}%</span></div>
                              <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${skill.level}%` }} /></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {(profileDetails?.skills || []).length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No skills to show.</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between"><CardTitle>Achievements</CardTitle>
                    {editMode && <Button size="sm" onClick={() => setFormData({ ...formData, achievements: [...(formData.achievements || []), { name: '', description: '', icon: '🏆', date: new Date().toISOString().split('T')[0] }] })}><Plus className="h-4 w-4 mr-1" /> Add</Button>}
                  </div>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <div className="space-y-4">
                      {(formData.achievements || []).map((achievement: Achievement, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Input placeholder="Icon" value={achievement.icon} onChange={(e) => { const newA = [...formData.achievements]; newA[index].icon = e.target.value; setFormData({ ...formData, achievements: newA }); }} className="w-20" />
                              <Input placeholder="Achievement name" value={achievement.name} onChange={(e) => { const newA = [...formData.achievements]; newA[index].name = e.target.value; setFormData({ ...formData, achievements: newA }); }} className="flex-1" />
                            </div>
                            <Textarea placeholder="Description" value={achievement.description} onChange={(e) => { const newA = [...formData.achievements]; newA[index].description = e.target.value; setFormData({ ...formData, achievements: newA }); }} rows={2} />
                            <Input type="date" value={achievement.date} onChange={(e) => { const newA = [...formData.achievements]; newA[index].date = e.target.value; setFormData({ ...formData, achievements: newA }); }} />
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFormData({ ...formData, achievements: formData.achievements.filter((_: any, i: number) => i !== index) })}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      {(formData.achievements || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No achievements added yet.</p>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(profileDetails?.achievements || []).map((achievement: Achievement, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4 flex items-start space-x-4">
                            <div className="text-2xl mt-1">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <p className="text-xs text-muted-foreground mt-2"><Calendar className="h-3 w-3 inline mr-1" />{new Date(achievement.date).toLocaleDateString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {(profileDetails?.achievements || []).length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No achievements to show.</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader><CardTitle>Learning Activity</CardTitle></CardHeader>
                <CardContent>
                  {isLoadingActivity ? <p>Loading activity...</p> : (userActivity || []).length === 0 ? null : (
                    <div className="space-y-3">
                      {(userActivity || []).map((activity: any) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                          <div className="mt-1">
                            {activity.activity_type === 'post_created' && <BookOpen className="h-5 w-5 text-blue-500" />}
                            {activity.activity_type === 'roadmap_created' && <Target className="h-5 w-5 text-green-500" />}
                            {activity.activity_type === 'comment_created' && <Users className="h-5 w-5 text-purple-500" />}
                            {activity.activity_type === 'like' && <Star className="h-5 w-5 text-yellow-500" />}
                            {!['post_created', 'roadmap_created', 'comment_created', 'like'].includes(activity.activity_type) && <TrendingUp className="h-5 w-5 text-gray-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm"><span className="font-medium">{activity.activity_type.replace(/_/g, ' ')}</span>
                              {activity.metadata?.title && <span className="text-muted-foreground">: {activity.metadata.title}</span>}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* User posts section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Posts</h3>
                    {isLoadingUserPosts ? (
                      <p>Loading posts...</p>
                    ) : (userPosts || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No posts yet.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
                        {(userPosts || []).map((p: any) => {
                          // Extract thumbnail from markdown images or video tags
                          const imgMatch = (p.content || "").match(/!\[[^\]]*\]\(([^)]+)\)/);
                          const videoMatch = (p.content || "").match(/<video[^>]+src="([^"]+)"/);
                          const thumb = imgMatch?.[1] || videoMatch?.[1] || null;

                          return (
                            <div
                              key={p.id}
                              className="aspect-square rounded overflow-hidden shadow-sm hover:shadow-md transition-all group relative cursor-pointer bg-muted"
                              onClick={() => setPreviewPost(p)}
                            >
                              {thumb ? (
                                <div className="w-full h-full overflow-hidden">
                                  <img
                                    src={thumb}
                                    alt={p.title || "Post"}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                                  <span className="line-clamp-3">{p.title}</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        )}
      </div>

      {/* Post preview modal */}
      {previewPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPreviewPost(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-none shadow-xl">
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{previewPost.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewPost(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-6">
                {(() => {
                  // Extract images
                  const imgMatches = Array.from((previewPost.content || "").matchAll(/!\[[^\]]*\]\(([^)]+)\)/g));
                  const videoMatches = Array.from((previewPost.content || "").matchAll(/<video[^>]+src="([^"]+)"/g));

                  // Show media if present
                  if (imgMatches.length > 0 || videoMatches.length > 0) {
                    return (
                      <div className="mb-6 space-y-4">
                        {imgMatches.map((match, idx) => (
                          <div key={`img-${idx}`} className="w-full max-h-96 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={match[1]}
                              alt={`Post image ${idx + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                        {videoMatches.map((match, idx) => (
                          <div key={`video-${idx}`} className="w-full rounded-lg overflow-hidden bg-black">
                            <video
                              src={match[1]}
                              controls
                              className="w-full h-auto"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="prose prose-sm max-w-none break-words">
                  {(previewPost.content || "")
                    .split('\n')
                    .filter(line => !line.match(/!\[[^\]]*\]\([^)]+\)/) && !line.match(/<video[^>]*>/))
                    .map((line, idx) => (
                      <p key={idx} className="mb-2">{line}</p>
                    ))
                  }
                </div>

                <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                  <p>Posted on {new Date(previewPost.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

    </Layout>
  );
};

export default Profile;
