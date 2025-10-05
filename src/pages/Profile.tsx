import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Trophy
} from "lucide-react";
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

  const { isFollowing, toggleFollow, followerCount, followingCount, isLoadingFollowStatus } = useUserFollows(targetUserId);
  const { profileDetails, isLoading: isLoadingProfile, updateProfileDetails, isUpdating } = useUserProfileDetails(targetUserId);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // This query fetches the public user data (name, avatar) which is separate from profile details
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
        socialLinks: profileDetails.social_links || [],
        skills: profileDetails.skills || [],
        achievements: profileDetails.achievements || [],
        learningPath: profileDetails.learning_path || [],
      });
    }
  }, [profileDetails, publicUserData]);

  // Fetch user's roadmaps (filtered by visibility)
  const { data: userRoadmaps, isLoading: isLoadingRoadmaps } = useQuery({
    queryKey: ['userRoadmaps', targetUserId, currentUser?.id],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      // If viewing own profile, show all roadmaps
      // If viewing another user's profile, only show public roadmaps
      const isOwnProfile = currentUser?.id === targetUserId;
      
      let query = supabase
        .from('roadmaps')
        .select('id, title, description, progress, status, created_at, is_public')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
      
      // Filter by visibility if not own profile
      if (!isOwnProfile) {
        query = query.eq('is_public', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
  });

  // Fetch user activity
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
    enabled: !!targetUserId,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !targetUserId) return;

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${targetUserId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
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
      // Update profile details (data in user_profile_details table)
      await updateProfileDetails({
        user_id: targetUserId,
        job_title: formData.title,
        location: formData.location,
        join_date: formData.joinDate,
        bio: formData.bio,
        portfolio_url: formData.portfolioUrl,
        social_links: formData.socialLinks,
        skills: formData.skills,
        achievements: formData.achievements,
        learning_path: formData.learningPath,
      });

      // Update public user data (data in profiles table)
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
    return <Layout><div>Loading profile...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {currentUser?.id === targetUserId && (
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 left-1/2 -translate-x-1/2 cursor-pointer">
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-1" /> Upload
                      </span>
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  {editMode ? (
                    <div className="space-y-2">
                      <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <Input placeholder="Joined (e.g., January 2025)" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">{publicUserData?.full_name || 'Your Name'}</h1>
                      <p className="text-lg text-muted-foreground">{profileDetails?.job_title || 'Your Title'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profileDetails?.location || 'Your Location'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {profileDetails?.join_date || '—'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {editMode ? (
                  <Textarea placeholder="Short bio..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
                ) : (
                  <p className="text-foreground max-w-2xl">{profileDetails?.bio || 'Tell the world about yourself...'}</p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{profileDetails?.total_posts || 0}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{profileDetails?.total_roadmaps || 0}</div>
                      <div className="text-xs text-muted-foreground">Roadmaps</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{followerCount}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{followingCount}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {editMode ? (
                    <div className="space-y-2 w-full">
                      <Label>Social Links</Label>
                      {(formData.socialLinks || []).map((link: SocialLink, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input placeholder="Platform (e.g., LinkedIn)" value={link.platform} onChange={(e) => {
                            const newLinks = [...formData.socialLinks];
                            newLinks[index].platform = e.target.value;
                            setFormData({ ...formData, socialLinks: newLinks });
                          }} />
                          <Input placeholder="URL" value={link.url} onChange={(e) => {
                            const newLinks = [...formData.socialLinks];
                            newLinks[index].url = e.target.value;
                            setFormData({ ...formData, socialLinks: newLinks });
                          }} />
                          <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, socialLinks: formData.socialLinks.filter((_: any, i: number) => i !== index) })}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, socialLinks: [...(formData.socialLinks || []), { platform: '', url: '' }] })}><Plus className="h-4 w-4 mr-1" /> Add Social Link</Button>
                    </div>
                  ) : (
                    (profileDetails?.social_links || []).length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {(profileDetails?.social_links || []).map((link: SocialLink, index: number) => (
                          <a key={index} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                            <ExternalLink className="h-4 w-4" />
                            <span>{link.platform}</span>
                          </a>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {currentUser?.id !== targetUserId && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={toggleFollow}
                    disabled={isLoadingFollowStatus || !currentUser}
                    className="w-full"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                {editMode ? (
                  <>
                    <Button className="w-full" onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save</>}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setEditMode(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    {currentUser?.id === targetUserId && (
                      <Button className="w-full" onClick={() => setEditMode(true)}><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {profileDetails?.portfolio_url ? (
                        <a href={profileDetails.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>
                      ) : 'Portfolio'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Learning */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Current Learning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profileDetails?.learning_path || []).length === 0 && (
                    <div className="text-sm text-muted-foreground">No current learning yet.</div>
                  )}
                  {(profileDetails?.learning_path || []).map((item: LearningPathItem, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="font-medium text-sm">{item.skill}</h4>
                        <span className="text-sm text-muted-foreground">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.currentLesson} of {item.totalLessons} lessons
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">Activity tracking coming soon.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmaps" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Roadmaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingRoadmaps ? (
                  <div className="text-sm text-muted-foreground">Loading roadmaps...</div>
                ) : (userRoadmaps || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No roadmaps created yet.</div>
                ) : (
                  <div className="grid gap-4">
                    {(userRoadmaps || []).map((roadmap: any) => (
                      <Link to={`/roadmaps/${roadmap.id}`} key={roadmap.id} className="block">
                        <Card className="hover:border-primary transition-colors duration-200">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-1">{roadmap.title}</h4>
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

          <TabsContent value="skills" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Skills</span>
                  </CardTitle>
                  {editMode && (
                    <Button size="sm" onClick={() => setFormData({ ...formData, skills: [...(formData.skills || []), { name: '', category: '', level: 0 }] })}>
                      <Plus className="h-4 w-4 mr-1" /> Add Skill
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-4">
                    {(formData.skills || []).map((skill: Skill, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Skill name (e.g., React)"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...formData.skills];
                              newSkills[index].name = e.target.value;
                              setFormData({ ...formData, skills: newSkills });
                            }}
                          />
                          <Input
                            placeholder="Category (e.g., Frontend)"
                            value={skill.category}
                            onChange={(e) => {
                              const newSkills = [...formData.skills];
                              newSkills[index].category = e.target.value;
                              setFormData({ ...formData, skills: newSkills });
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Level:</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0-100"
                              value={skill.level}
                              onChange={(e) => {
                                const newSkills = [...formData.skills];
                                newSkills[index].level = parseInt(e.target.value) || 0;
                                setFormData({ ...formData, skills: newSkills });
                              }}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_: any, i: number) => i !== index) })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(formData.skills || []).length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-8">No skills added yet. Click "Add Skill" to get started.</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profileDetails?.skills || []).map((skill: Skill, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{skill.name}</h4>
                              <Badge variant="secondary">{skill.category}</Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Proficiency</span>
                                <span className="font-medium">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(profileDetails?.skills || []).length === 0 && (
                      <div className="text-sm text-muted-foreground col-span-2 text-center py-8">No skills added yet.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Achievements</span>
                  </CardTitle>
                  {editMode && (
                    <Button size="sm" onClick={() => setFormData({ ...formData, achievements: [...(formData.achievements || []), { name: '', description: '', icon: '🏆', date: new Date().toISOString().split('T')[0] }] })}>
                      <Plus className="h-4 w-4 mr-1" /> Add Achievement
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-4">
                    {(formData.achievements || []).map((achievement: Achievement, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Icon (emoji)"
                              value={achievement.icon}
                              onChange={(e) => {
                                const newAchievements = [...formData.achievements];
                                newAchievements[index].icon = e.target.value;
                                setFormData({ ...formData, achievements: newAchievements });
                              }}
                              className="w-20"
                            />
                            <Input
                              placeholder="Achievement name"
                              value={achievement.name}
                              onChange={(e) => {
                                const newAchievements = [...formData.achievements];
                                newAchievements[index].name = e.target.value;
                                setFormData({ ...formData, achievements: newAchievements });
                              }}
                              className="flex-1"
                            />
                          </div>
                          <Textarea
                            placeholder="Description"
                            value={achievement.description}
                            onChange={(e) => {
                              const newAchievements = [...formData.achievements];
                              newAchievements[index].description = e.target.value;
                              setFormData({ ...formData, achievements: newAchievements });
                            }}
                            rows={2}
                          />
                          <Input
                            type="date"
                            value={achievement.date}
                            onChange={(e) => {
                              const newAchievements = [...formData.achievements];
                              newAchievements[index].date = e.target.value;
                              setFormData({ ...formData, achievements: newAchievements });
                            }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, achievements: formData.achievements.filter((_: any, i: number) => i !== index) })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(formData.achievements || []).length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-8">No achievements added yet. Click "Add Achievement" to get started.</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profileDetails?.achievements || []).map((achievement: Achievement, index: number) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(achievement.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(profileDetails?.achievements || []).length === 0 && (
                      <div className="text-sm text-muted-foreground col-span-2 text-center py-8">No achievements added yet.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingActivity ? (
                  <div className="text-sm text-muted-foreground">Loading activity...</div>
                ) : (userActivity || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">No activity yet.</div>
                ) : (
                  <div className="space-y-4">
                    {(userActivity || []).map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {activity.activity_type === 'post_created' && <BookOpen className="h-5 w-5 text-blue-500" />}
                          {activity.activity_type === 'roadmap_created' && <Target className="h-5 w-5 text-green-500" />}
                          {activity.activity_type === 'comment_created' && <Users className="h-5 w-5 text-purple-500" />}
                          {activity.activity_type === 'like' && <Star className="h-5 w-5 text-yellow-500" />}
                          {!['post_created', 'roadmap_created', 'comment_created', 'like'].includes(activity.activity_type) && 
                            <TrendingUp className="h-5 w-5 text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium capitalize text-sm">
                              {activity.activity_type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.created_at).toLocaleDateString()} at {new Date(activity.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {activity.metadata && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {typeof activity.metadata === 'object' ? JSON.stringify(activity.metadata) : activity.metadata}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;