import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { preferences, updatePreferences, isLoading: isLoadingPreferences } = useUserPreferences();

  const [reportSubject, setReportSubject] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const [account, setAccount] = useState({
    displayName: "",
    email: "",
    website: "",
  });

  const [notifications, setNotifications] = useState({
    product_updates: true,
    roadmap_activity: true,
    weekly_digest: false,
    marketing_emails: false,
    push_enabled: false,
  });

  const [privacy, setPrivacy] = useState({
    profile_visibility: "public" as "public" | "private" | "friends",
    show_follower_counts: true,
    show_activity: true,
  });

  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    login_alerts: true,
  });

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setAccount({
        displayName: (user as any)?.user_metadata?.displayName || user.email || '',
        email: user.email || '',
        website: (user as any)?.user_metadata?.website || '',
      });
    }
    if (preferences) {
      setNotifications({
        marketing_emails: !!preferences.marketing_emails,
        push_enabled: !!preferences.push_notifications,
        product_updates: !!preferences.email_notifications,
        roadmap_activity: !!preferences.email_notifications,
        weekly_digest: false,
      });
      setPrivacy({
        profile_visibility: preferences.profile_visibility || 'public',
        show_follower_counts: !!preferences.show_online_status,
        show_activity: !!preferences.show_online_status,
      });
      setSecurity({
        two_factor_enabled: !!preferences.two_factor_enabled,
        login_alerts: !!preferences.login_notifications,
      });
    }
  }, [user, preferences]);

  const saveAccount = async () => {
    try {
      const updates: any = { 
        data: { 
          displayName: account.displayName, 
          website: account.website 
        } 
      };
      
      if (account.email && account.email !== user?.email) {
        updates.email = account.email;
      }
      
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      // Also update display_name in preferences
      await updatePreferences({
        display_name: account.displayName,
        website: account.website,
      });
      
      toast({ title: 'Account settings saved' });
    } catch (e: any) {
      toast({ title: 'Account save failed', description: e?.message || '', variant: 'destructive' });
    }
  };

  const saveNotifications = async () => {
    try {
      await updatePreferences({
        email_notifications: notifications.product_updates || notifications.roadmap_activity || notifications.weekly_digest,
        push_notifications: notifications.push_enabled,
        marketing_emails: notifications.marketing_emails,
      });
      toast({ title: 'Notification preferences saved' });
    } catch (error: any) {
      toast({ title: 'Failed to save notifications', description: error.message, variant: 'destructive' });
    }
  };

  const savePrivacy = async () => {
    try {
      await updatePreferences({
        profile_visibility: privacy.profile_visibility,
        show_online_status: privacy.show_activity,
        allow_follow_requests: true,
      });
      toast({ title: 'Privacy settings saved' });
    } catch (error: any) {
      toast({ title: 'Failed to save privacy settings', description: error.message, variant: 'destructive' });
    }
  };

  const saveSecurity = async () => {
    try {
      await updatePreferences({
        two_factor_enabled: security.two_factor_enabled,
        login_notifications: security.login_alerts,
      });
      toast({ title: 'Security settings saved' });
    } catch (error: any) {
      toast({ title: 'Failed to save security settings', description: error.message, variant: 'destructive' });
    }
  };

  const handlePushToggle = async (value: boolean) => {
    if (value && typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          setNotifications(n => ({ ...n, push_enabled: false }));
          toast({ title: 'Push blocked', description: 'Please allow notifications in your browser settings.' });
          return;
        }
      } catch {}
    }
    setNotifications(n => ({ ...n, push_enabled: value }));
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setNewPassword("");
      toast({ title: 'Password updated successfully' });
    } catch (e: any) {
      toast({ title: 'Password update failed', description: e?.message || '', variant: 'destructive' });
    }
  };

  const deleteAccount = async () => {
    if (!user) { 
      toast({ title: 'Not logged in', variant: 'destructive' }); 
      return; 
    }
    
    if (!confirm('Are you sure you want to permanently delete your account and all data? This cannot be undone.')) return;
    
    const second = prompt('Type DELETE to confirm');
    if ((second || '').trim().toUpperCase() !== 'DELETE') {
      toast({ title: 'Account deletion cancelled' });
      return;
    }
    
    try {
      // Call the database function to delete all user data
      const { error } = await supabase.rpc('delete_user_account', {
        user_id_to_delete: user.id
      });
      
      if (error) throw error;
      
      // Sign out after deletion
      await supabase.auth.signOut();
      toast({ title: 'Account deleted successfully' });
      window.location.href = '/';
    } catch (e: any) {
      toast({ title: 'Failed to delete account', description: e?.message || 'An error occurred.', variant: 'destructive' });
    }
  };

  const sendReport = () => {
    const subject = encodeURIComponent(reportSubject || "Website Issue Report");
    const body = encodeURIComponent(`User: ${user?.email || 'guest'}\n\nDetails:\n${reportDetails}`);
    window.location.href = `mailto:shriharikrishna2356@gmail.com?subject=${subject}&body=${body}`;
    toast({ title: 'Opening email app to send report' });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: 'Signed out' });
      window.location.href = '/';
    } catch (e: any) {
      toast({ title: 'Sign out failed', description: e?.message || '', variant: 'destructive' });
    }
  };

  if (isLoadingPreferences) {
    return <Layout><div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading settings...</p></div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="account" className="space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="flex w-max md:w-full md:grid md:grid-cols-5 gap-2 md:gap-0">
              <TabsTrigger value="account" className="whitespace-nowrap">Account</TabsTrigger>
              <TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
              <TabsTrigger value="privacy" className="whitespace-nowrap">Privacy</TabsTrigger>
              <TabsTrigger value="security" className="whitespace-nowrap">Security</TabsTrigger>
              <TabsTrigger value="danger" className="whitespace-nowrap">Danger Zone</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg md:text-xl">Account Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input 
                      id="display-name"
                      value={account.displayName} 
                      onChange={(e) => setAccount(a => ({ ...a, displayName: e.target.value }))} 
                      placeholder="Your name" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={account.email} 
                      onChange={(e) => setAccount(a => ({ ...a, email: e.target.value }))} 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      value={account.website} 
                      onChange={(e) => setAccount(a => ({ ...a, website: e.target.value }))} 
                      placeholder="https://yourwebsite.com" 
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAccount}>Save Account Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg md:text-xl">Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="product-updates" 
                      checked={notifications.product_updates} 
                      onCheckedChange={(v: boolean) => setNotifications(n => ({ ...n, product_updates: v }))} 
                    />
                    <Label htmlFor="product-updates" className="cursor-pointer">Product updates and announcements</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="roadmap-activity" 
                      checked={notifications.roadmap_activity} 
                      onCheckedChange={(v: boolean) => setNotifications(n => ({ ...n, roadmap_activity: v }))} 
                    />
                    <Label htmlFor="roadmap-activity" className="cursor-pointer">Roadmap activity (comments, mentions)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="weekly-digest" 
                      checked={notifications.weekly_digest} 
                      onCheckedChange={(v: boolean) => setNotifications(n => ({ ...n, weekly_digest: v }))} 
                    />
                    <Label htmlFor="weekly-digest" className="cursor-pointer">Weekly email digest</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="marketing-emails" 
                      checked={notifications.marketing_emails} 
                      onCheckedChange={(v: boolean) => setNotifications(n => ({ ...n, marketing_emails: v }))} 
                    />
                    <Label htmlFor="marketing-emails" className="cursor-pointer">Marketing emails and newsletters</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="push-enabled" 
                      checked={notifications.push_enabled} 
                      onCheckedChange={(v: boolean) => handlePushToggle(v)} 
                    />
                    <Label htmlFor="push-enabled" className="cursor-pointer">Enable push notifications</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveNotifications}>Save Notifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Privacy Settings</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Control who can see your profile, posts, and activity
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Account Privacy</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      When your account is private, only people who follow you can see your profile, posts, and roadmaps.
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors">
                        <input 
                          type="radio" 
                          name="visibility" 
                          checked={privacy.profile_visibility==='public'} 
                          onChange={() => setPrivacy(p => ({ ...p, profile_visibility: 'public' }))} 
                          className="mt-1"
                        /> 
                        <div>
                          <div className="font-medium">Public</div>
                          <div className="text-sm text-muted-foreground">Anyone can see your profile, posts, and roadmaps</div>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors">
                        <input 
                          type="radio" 
                          name="visibility" 
                          checked={privacy.profile_visibility==='private'} 
                          onChange={() => setPrivacy(p => ({ ...p, profile_visibility: 'private' }))} 
                          className="mt-1"
                        /> 
                        <div>
                          <div className="font-medium">Private</div>
                          <div className="text-sm text-muted-foreground">Only your followers can see your profile and content</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="show-followers" 
                      checked={privacy.show_follower_counts} 
                      onCheckedChange={(v: boolean) => setPrivacy(p => ({ ...p, show_follower_counts: v }))} 
                    />
                    <Label htmlFor="show-followers" className="cursor-pointer">Display follower/following numbers on profile</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="show-activity" 
                      checked={privacy.show_activity} 
                      onCheckedChange={(v: boolean) => setPrivacy(p => ({ ...p, show_activity: v }))} 
                    />
                    <Label htmlFor="show-activity" className="cursor-pointer">Allow others to see my recent activity</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={savePrivacy}>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg md:text-xl">Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="two-factor" 
                      checked={security.two_factor_enabled} 
                      onCheckedChange={(v: boolean) => setSecurity(s => ({ ...s, two_factor_enabled: v }))} 
                    />
                    <Label htmlFor="two-factor" className="cursor-pointer">Enable Two-Factor Authentication (via email)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="login-alerts" 
                      checked={security.login_alerts} 
                      onCheckedChange={(v: boolean) => setSecurity(s => ({ ...s, login_alerts: v }))} 
                    />
                    <Label htmlFor="login-alerts" className="cursor-pointer">Send email alerts for new logins</Label>
                  </div>
                </div>
                <Button onClick={saveSecurity}>Save Security Settings</Button>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t mt-4">
                  <div>
                    <Label htmlFor="new-password">Change Password</Label>
                    <Input 
                      id="new-password"
                      type="password" 
                      placeholder="New password (min 6 characters)" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" onClick={updatePassword}>Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg md:text-xl text-destructive">Danger Zone</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-md">
                  <h3 className="font-semibold mb-2">Report a Problem</h3>
                  <p className="text-sm text-muted-foreground mb-3">Found a bug or issue? Let us know and we'll look into it.</p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="report-subject">Subject</Label>
                      <Input 
                        id="report-subject"
                        value={reportSubject} 
                        onChange={(e) => setReportSubject(e.target.value)} 
                        placeholder="Brief summary of the issue" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="report-details">Details</Label>
                      <textarea 
                        id="report-details"
                        className="w-full border border-input rounded-md p-2 bg-background text-foreground" 
                        rows={4} 
                        value={reportDetails} 
                        onChange={(e) => setReportDetails(e.target.value)} 
                        placeholder="Describe the issue, steps to reproduce, screenshots links, etc." 
                      />
                    </div>
                    <Button onClick={sendReport}>Send Report</Button>
                  </div>
                </div>
                
                <div className="p-4 border border-destructive rounded-md bg-destructive/5">
                  <h3 className="font-semibold mb-2 text-destructive">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    This will permanently delete your account and remove all your data including posts, roadmaps, 
                    comments, likes, bookmarks, and all other content. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={deleteAccount}>Delete Account Permanently</Button>
                </div>
                
                <div className="p-4 border border-border rounded-md">
                  <h3 className="font-semibold mb-2">Sign Out</h3>
                  <p className="text-sm text-muted-foreground mb-3">Sign out of your account. You can sign back in anytime.</p>
                  <Button variant="outline" onClick={signOut}>Sign Out</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;