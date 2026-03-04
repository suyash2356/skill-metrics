import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRatingInput } from "@/components/StarRatingInput";
import { useUserResources } from "@/hooks/useUserResources";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Flag, Star, Eye, Calendar, User, Loader2, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ResourceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { rateResource, reportResource } = useUserResources();
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc] = useState('');

  // Determine source from query param
  const params = new URLSearchParams(location.search);
  const source = params.get('source') || 'user_resources';

  // Fetch from admin resources table
  const { data: adminResource, isLoading: adminLoading } = useQuery({
    queryKey: ['adminResource', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!id && source === 'resources',
  });

  // Fetch from user_resources table
  const { data: userResource, isLoading: userLoading } = useQuery({
    queryKey: ['userResource', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      // Increment view count
      supabase.from('user_resources').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id).then();
      return data;
    },
    enabled: !!id && source === 'user_resources',
  });

  const isLoading = adminLoading || userLoading;
  const isAdminResource = source === 'resources';
  const resource = isAdminResource ? adminResource : userResource;

  const { data: myRating } = useQuery({
    queryKey: ['userResourceRating', id, user?.id],
    queryFn: async () => {
      if (!id || !user) return null;
      const { data } = await supabase
        .from('user_resource_ratings')
        .select('stars')
        .eq('resource_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      return data?.stars || 0;
    },
    enabled: !!id && !!user && !isAdminResource,
  });

  const { data: authorProfile } = useQuery({
    queryKey: ['resourceAuthor', resource?.user_id],
    queryFn: async () => {
      if (!resource?.user_id) return null;
      const { data } = await supabase.rpc('get_basic_profile_info', { target_user_id: resource.user_id });
      return data as { full_name: string; avatar_url: string | null } | null;
    },
    enabled: !!resource?.user_id && !isAdminResource,
  });

  if (isLoading) {
    return <Layout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;
  }

  if (!resource) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><h2 className="text-xl font-bold">Resource not found</h2></div></Layout>;
  }

  const isVideo = resource.file_type?.startsWith('video') || resource.resource_type === 'video';
  const isPdf = resource.file_type === 'application/pdf' || resource.resource_type === 'pdf';
  const isImage = resource.file_type?.startsWith('image') || resource.resource_type === 'image';
  const linkUrl = isAdminResource ? resource.link : (resource.link || resource.file_url);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* Media viewer (user_resources only) */}
        {!isAdminResource && resource.file_url && isVideo && (
          <div className="rounded-xl overflow-hidden bg-black mb-6">
            <video src={resource.file_url} controls className="w-full max-h-[70vh]" />
          </div>
        )}
        {!isAdminResource && resource.file_url && isPdf && (
          <div className="rounded-xl overflow-hidden border mb-6">
            <iframe src={resource.file_url} className="w-full h-[70vh]" title={resource.title} />
          </div>
        )}
        {!isAdminResource && resource.file_url && isImage && (
          <div className="rounded-xl overflow-hidden bg-black/5 mb-6 flex justify-center">
            <img src={resource.file_url} alt={resource.title} className="max-h-[70vh] object-contain" />
          </div>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{resource.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                  <Badge variant="secondary" className="capitalize">{resource.resource_type}</Badge>
                  <Badge variant="outline" className="capitalize">{resource.difficulty}</Badge>
                  {resource.category && <Badge variant="outline">{resource.category}</Badge>}
                  {isAdminResource && resource.provider && <span>{resource.provider}</span>}
                  {!isAdminResource && (
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {resource.view_count}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(resource.created_at).toLocaleDateString()}
                  </span>
                  {resource.duration && <span>{resource.duration}</span>}
                  {resource.is_free === false && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Paid</Badge>}
                </div>
              </div>
              {linkUrl && (
                <Button asChild>
                  <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Open
                  </a>
                </Button>
              )}
            </div>

            {/* Author (user_resources only) */}
            {!isAdminResource && authorProfile && (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${resource.user_id}`)}>
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{(authorProfile as any).full_name}</span>
              </div>
            )}

            <p className="text-muted-foreground whitespace-pre-wrap">{resource.description}</p>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            )}

            {/* Related skills (admin resources) */}
            {isAdminResource && resource.related_skills && resource.related_skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {resource.related_skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => navigate(`/skills/${encodeURIComponent(skill)}`)}>
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold">
                    {resource.avg_rating ? Number(resource.avg_rating).toFixed(1) : resource.weighted_rating ? Number(resource.weighted_rating).toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-sm text-muted-foreground">({resource.total_ratings || 0} ratings)</span>
                </div>
                {user && !isAdminResource && user.id !== resource.user_id && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rate:</span>
                    <StarRatingInput value={myRating || 0} onChange={(stars) => rateResource.mutate({ resourceId: resource.id, stars })} />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {user && !isAdminResource && user.id !== resource.user_id && (
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => setShowReport(true)}>
                  <Flag className="h-4 w-4 mr-1" /> Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Dialog */}
        <Dialog open={showReport} onOpenChange={setShowReport}>
          <DialogContent>
            <DialogHeader><DialogTitle>Report Resource</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                  <SelectItem value="spam">Spam / Self-promotion</SelectItem>
                  <SelectItem value="copyright">Copyright violation</SelectItem>
                  <SelectItem value="misleading">Misleading / Fake</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="Additional details (optional)" />
              <Button onClick={() => { reportResource.mutate({ resourceId: resource.id, reason: reportReason, description: reportDesc }); setShowReport(false); }} disabled={!reportReason}>Submit Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ResourceView;
