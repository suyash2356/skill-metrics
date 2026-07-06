
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
  Globe,
  Trash2
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
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { useUserFollows } from "@/hooks/useUserFollows";
import { useUserProfileDetails, SocialLink, Skill, Achievement, LearningPathItem } from "@/hooks/useUserProfileDetails";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FollowersFollowingDialog } from "@/components/FollowersFollowingDialog";
import { ProfileResourcesTab } from "@/components/ProfileResourcesTab";
import { ImageCropperDialog } from "@/components/ImageCropperDialog";
import { Camera, ImagePlus } from "lucide-react";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const targetUserId = userId || currentUser?.id;
  const { toast } = useToast();

  const { isFollowing, toggleFollow, followerCount, followingCount, isLoadingFollowStatus, getFollowButtonState, followRequestStatus } = useUserFollows(targetUserId);
  const { profileDetails, isLoading: isLoadingProfile, updateProfileDetails, isUpdating } = useUserProfileDetails(targetUserId);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [previewPost, setPreviewPost] = useState<any | null>(null);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [followersDialogTab, setFollowersDialogTab] = useState<"followers" | "following">("followers");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [cropperState, setCropperState] = useState<{ open: boolean; src: string | null; kind: "avatar" | "banner" }>({
    open: false,
    src: null,
    kind: "avatar",
  });

  // Fetch basic profile info using RPC function (always works, bypasses RLS)
  const { data: basicProfileInfo, isLoading: isLoadingPublicUser } = useQuery({
    queryKey: ['basicProfileInfo', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase.rpc('get_basic_profile_info', {
        target_user_id: targetUserId
      });
      if (error) {
        console.error('Error fetching basic profile info:', error);
        return { full_name: 'Anonymous', avatar_url: null, is_private: false };
      }
      return data as { user_id: string; full_name: string; avatar_url: string | null; is_private: boolean };
    },
    enabled: !!targetUserId,
  });

  // Derive privacy from basic profile info
  const isOwnProfile = currentUser?.id === targetUserId;
  const isPrivateAccount = basicProfileInfo?.is_private ?? false;

  // Check if user has a pending follow request
  const hasPendingRequest = !!followRequestStatus;

  // Can view profile content if: own profile, public account, or following
  const canViewProfile = isOwnProfile || !isPrivateAccount || isFollowing;

  // For backwards compatibility
  const publicUserData = useMemo(() => basicProfileInfo ? {
    full_name: basicProfileInfo.full_name,
    avatar_url: basicProfileInfo.avatar_url
  } : null, [basicProfileInfo]);

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

  // Fetch mutual followers count (people both you and this user follow)
  const { data: mutualFollowers } = useQuery({
    queryKey: ['mutualFollowers', currentUser?.id, targetUserId],
    queryFn: async () => {
      if (!currentUser?.id || !targetUserId || currentUser.id === targetUserId) return { count: 0, users: [] };

      // Get users the current user follows
      const { data: myFollowing, error: myError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', currentUser.id);

      if (myError) throw myError;

      // Get users the target user follows
      const { data: theirFollowing, error: theirError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', targetUserId);

      if (theirError) throw theirError;

      const myFollowingIds = new Set(myFollowing?.map(f => f.following_id) || []);
      const mutualIds = (theirFollowing || [])
        .filter(f => myFollowingIds.has(f.following_id))
        .map(f => f.following_id);

      if (mutualIds.length === 0) return { count: 0, users: [] };

      // Get profile info for first 3 mutual followers
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', mutualIds.slice(0, 3));

      return {
        count: mutualIds.length,
        users: profiles || []
      };
    },
    enabled: !!currentUser?.id && !!targetUserId && currentUser.id !== targetUserId,
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
    queryKey: ['userActivity', targetUserId, currentUser?.id],
    queryFn: async () => {
      if (!targetUserId) return [];
      const isOwn = currentUser?.id === targetUserId;
      if (isOwn) {
        // Owner can query the raw table (RLS allows it)
        const { data, error } = await supabase
          .from('user_activity')
          .select('id, user_id, activity_type, post_id, roadmap_id, community_id, target_user_id, created_at')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        return data;
      } else {
        // Non-owner: use RPC that strips sensitive columns
        const { data, error } = await supabase.rpc('get_visible_user_activity' as any, {
          target_user_id: targetUserId,
        });
        if (error) throw error;
        return (data || []).slice(0, 20);
      }
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

  // Fetch banner_url for target user
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!targetUserId) return;
      const { data } = await (supabase.from('profiles') as any)
        .select('banner_url')
        .eq('user_id', targetUserId)
        .maybeSingle();
      if (active) setBannerUrl((data?.banner_url as string) || null);
    };
    load();
    return () => { active = false; };
  }, [targetUserId]);

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const openCropperForFile = async (event: React.ChangeEvent<HTMLInputElement>, kind: "avatar" | "banner") => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const src = await readFileAsDataURL(file);
      setCropperState({ open: true, src, kind });
    } catch (e: any) {
      toast({ title: "Failed to read image", description: e.message, variant: "destructive" });
    }
  };

  const handleCroppedUpload = async (blob: Blob) => {
    if (!targetUserId) return;
    const kind = cropperState.kind;
    try {
      const fileName = `${targetUserId}/${kind}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true, contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      const updatePayload: any = kind === 'avatar' ? { avatar_url: publicUrl } : { banner_url: publicUrl };
      const { error: updateError } = await (supabase.from('profiles') as any)
        .update(updatePayload)
        .eq('user_id', targetUserId);
      if (updateError) throw updateError;

      if (kind === 'avatar') {
        setFormData((prev: any) => ({ ...prev, avatar: publicUrl }));
        toast({ title: "Profile picture updated!" });
      } else {
        setBannerUrl(publicUrl);
        toast({ title: "Banner updated!" });
      }
    } catch (error: any) {
      toast({ title: `Failed to upload ${kind}`, description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveBanner = async () => {
    if (!targetUserId) return;
    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ banner_url: null })
        .eq('user_id', targetUserId);
      if (error) throw error;
      setBannerUrl(null);
      toast({ title: "Banner removed" });
    } catch (e: any) {
      toast({ title: "Failed to remove banner", description: e.message, variant: "destructive" });
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
      {/* Aesthetic gradient backdrop — sits behind everything but stays in theme */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.25),transparent_55%),radial-gradient(circle_at_85%_15%,hsl(var(--accent)/0.3),transparent_60%),radial-gradient(circle_at_50%_90%,hsl(var(--primary)/0.18),transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--background)))]" />
        </div>

        <div className="container relative mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        <Card className="mb-6 overflow-hidden border-border/60 bg-card/70 backdrop-blur-xl shadow-xl">
          {/* Banner: user-uploaded image or decorative gradient fallback */}
          <div className="relative h-32 sm:h-48 w-full overflow-hidden">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Profile banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(120deg,hsl(var(--primary)/0.9),hsl(var(--accent)/0.85),hsl(var(--primary)/0.7))]">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,white,transparent_45%)]" />
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_45%,white_50%,transparent_55%)]" />
              </div>
            )}
            {isOwnProfile && (
              <div className="absolute top-3 right-3 flex gap-2">
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-xs font-medium hover:bg-background transition-colors shadow-sm"
                  title={bannerUrl ? "Change banner" : "Add banner"}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  {bannerUrl ? "Change banner" : "Add banner"}
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => openCropperForFile(e, "banner")}
                />
                {bannerUrl && (
                  <button
                    onClick={handleRemoveBanner}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-background/80 backdrop-blur-md border border-border/60 hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                    title="Remove banner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          <CardContent className="p-4 sm:p-6 pt-0">
            {/* Avatar overlaps banner; details sit below for full visibility */}
            <div className="flex justify-center sm:justify-start -mt-16 sm:-mt-20 mb-4">
              <div className="relative">
                <div className="rounded-full p-1 bg-gradient-to-tr from-primary via-accent to-primary shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.6)]">
                  <Avatar className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-background">
                    <AvatarImage src={formData.avatar} className="object-cover" />
                    <AvatarFallback className="text-3xl sm:text-4xl bg-muted">{initials}</AvatarFallback>
                  </Avatar>
                </div>
                {isOwnProfile && (
                  <div className="absolute -bottom-1 right-0 flex gap-1">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors shadow-md" title="Upload & crop new photo">
                        <Camera className="h-4 w-4" />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => openCropperForFile(e, "avatar")}
                      />
                    </label>
                    {formData.avatar && editMode && (
                      <button
                        onClick={() => setFormData({ ...formData, avatar: null })}
                        className="p-2 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-md"
                        title="Remove photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">



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
                              const newLinks = [...(formData.socialLinks || [])];
                              newLinks[idx] = { ...newLinks[idx], title: e.target.value };
                              setFormData({ ...formData, socialLinks: newLinks });
                            }} />
                            <Input placeholder="https://" value={s.url || ''} onChange={(e) => {
                              const newLinks = [...(formData.socialLinks || [])];
                              newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                              setFormData({ ...formData, socialLinks: newLinks });
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
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.rpc('find_or_create_conversation', {
                            _user1: currentUser?.id,
                            _user2: targetUserId,
                          });
                          if (error) throw error;
                          navigate(`/messages/${data}`);
                        } catch (err: any) {
                          const msg = err?.message || 'Cannot start conversation';
                          if (msg.includes('mutual followers')) {
                            toast({ title: 'Cannot message', description: 'You must be mutual followers to message this user', variant: 'destructive' });
                          } else {
                            toast({ title: 'Error', description: msg, variant: 'destructive' });
                          }
                        }
                      }}
                    >
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mt-6 pt-6 border-t border-border/50">
              {/* stat tiles wrapped in subtle gradient cards via classes below */}
              <div
                className={`rounded-xl p-3 border border-border/50 bg-gradient-to-br from-primary/10 to-primary/0 transition-all ${isOwnProfile ? 'cursor-pointer hover:from-primary/20 hover:scale-[1.02]' : ''}`}
                onClick={() => {
                  if (isOwnProfile) {
                    setFollowersDialogTab("followers");
                    setShowFollowersDialog(true);
                  }
                }}
              >
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stats?.follower_count ?? followerCount ?? 0}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Followers</div>
              </div>
              <div
                className={`rounded-xl p-3 border border-border/50 bg-gradient-to-br from-accent/10 to-accent/0 transition-all ${isOwnProfile ? 'cursor-pointer hover:from-accent/20 hover:scale-[1.02]' : ''}`}
                onClick={() => {
                  if (isOwnProfile) {
                    setFollowersDialogTab("following");
                    setShowFollowersDialog(true);
                  }
                }}
              >
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stats?.following_count ?? followingCount ?? 0}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Following</div>
              </div>
              <div className="rounded-xl p-3 border border-border/50 bg-gradient-to-br from-primary/10 to-accent/5">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stats?.post_count ?? 0}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Posts</div>
              </div>
              <div className="rounded-xl p-3 border border-border/50 bg-gradient-to-br from-accent/10 to-primary/5">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stats?.roadmap_count ?? 0}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Roadmaps</div>
              </div>
            </div>

            {/* Mutual followers indicator - only show when viewing another user's profile */}
            {!isOwnProfile && mutualFollowers && mutualFollowers.count > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {mutualFollowers.users.slice(0, 3).map((user: any) => (
                    <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {(user.full_name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span>
                  <span className="font-medium text-foreground">{mutualFollowers.count}</span>
                  {' '}mutual {mutualFollowers.count === 1 ? 'connection' : 'connections'}
                  {mutualFollowers.users.length > 0 && (
                    <span> including <span className="font-medium text-foreground">{mutualFollowers.users[0].full_name}</span></span>
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1.5 bg-card/70 backdrop-blur-md border border-border/60 shadow-sm rounded-xl">
              <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
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

            <TabsContent value="resources">
              <ProfileResourcesTab userId={targetUserId} />
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

      {/* Followers/Following Dialog - Only visible to profile owner */}
      {isOwnProfile && targetUserId && (
        <FollowersFollowingDialog
          open={showFollowersDialog}
          onOpenChange={setShowFollowersDialog}
          userId={targetUserId}
          initialTab={followersDialogTab}
        />
      )}

      <ImageCropperDialog
        open={cropperState.open}
        onOpenChange={(open) => setCropperState((s) => ({ ...s, open }))}
        imageSrc={cropperState.src}
        aspect={cropperState.kind === "avatar" ? 1 : 3}
        cropShape={cropperState.kind === "avatar" ? "round" : "rect"}
        title={cropperState.kind === "avatar" ? "Crop your profile picture" : "Crop your banner"}
        outputWidth={cropperState.kind === "avatar" ? 512 : 1500}
        onCropComplete={handleCroppedUpload}
      />

      </div>
    </Layout>
  );
};

export default Profile;
