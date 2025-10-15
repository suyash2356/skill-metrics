import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Align with app-wide 100MB maximum for uploads
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for resources (videos)

const CommunityResourceNew = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: `Max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`, variant: 'destructive' });
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file || !communityId || !user) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${communityId}_${user.id}_${Date.now()}.${fileExt}`;

    try {
      // upload with progress
      const upload = await supabase.storage.from('uploads').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upload.error) throw upload.error;

      const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(upload.data.path);
      const publicUrl = publicData.publicUrl;

      // insert into community_resources
      const { error } = await supabase.from('community_resources').insert({
        community_id: communityId,
        user_id: user.id,
        title,
        link: publicUrl,
        description,
      });

      if (error) throw error;

      toast({ title: 'Resource shared' });
      navigate(`/communities/${communityId}/feed`);
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Share Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label>File (video, image, pdf)</Label>
                <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" onChange={handleFile} />
                {file && (
                  <div className="mt-2 text-sm">Selected: {file.name} ({Math.round(file.size / (1024 * 1024))} MB)</div>
                )}
              </div>
              {progress > 0 && (
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className="bg-primary h-2" style={{ width: `${progress}%` }} />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button onClick={handleUpload}>Share</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommunityResourceNew;
