import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Eye, Star, Loader2, AlertTriangle, ExternalLink, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserResource {
  id: string;
  user_id: string;
  title: string;
  description: string;
  resource_type: string;
  category: string;
  link: string | null;
  file_url: string | null;
  file_type: string | null;
  difficulty: string;
  tags: string[] | null;
  status: string;
  moderation_note: string | null;
  is_active: boolean;
  view_count: number;
  avg_rating: number | null;
  total_ratings: number;
  created_at: string;
}

const UserResourceModeration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending');
  const [selectedResource, setSelectedResource] = useState<UserResource | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['admin-user-resources', tab],
    queryFn: async () => {
      let query = supabase.from('user_resources').select('*').order('created_at', { ascending: false });
      if (tab !== 'all') {
        query = query.eq('status', tab);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as UserResource[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const { error } = await supabase
        .from('user_resources')
        .update({ status, moderation_note: note || null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-resources'] });
      toast({ title: `Resource ${vars.status}` });
      setSelectedResource(null);
      setModerationNote('');
    },
    onError: () => {
      toast({ title: 'Failed to update', variant: 'destructive' });
    },
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'flagged': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {resources.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No {tab === 'all' ? '' : tab} resources found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(resource => (
            <Card key={resource.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{resource.title}</h3>
                      <Badge variant={statusColor(resource.status)} className="capitalize text-[10px]">{resource.status}</Badge>
                      <Badge variant="outline" className="capitalize text-[10px]">{resource.resource_type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{resource.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Category: {resource.category}</span>
                      <span>Difficulty: {resource.difficulty}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{resource.view_count}</span>
                      {resource.avg_rating && (
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{Number(resource.avg_rating).toFixed(1)}</span>
                      )}
                      <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                    </div>
                    {resource.moderation_note && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />{resource.moderation_note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {resource.link && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedResource(resource); setModerationNote(resource.moderation_note || ''); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {resource.status !== 'approved' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => updateStatus.mutate({ id: resource.id, status: 'approved' })}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {resource.status !== 'rejected' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setSelectedResource(resource); setModerationNote(''); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Moderation Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={(o) => !o && setSelectedResource(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review: {selectedResource?.title}</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedResource.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">{selectedResource.resource_type}</Badge>
                  <Badge variant="outline">{selectedResource.category}</Badge>
                  <Badge variant="outline" className="capitalize">{selectedResource.difficulty}</Badge>
                </div>
                {selectedResource.tags && selectedResource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedResource.tags.map((t, i) => <Badge key={i} variant="secondary" className="text-[10px]">#{t}</Badge>)}
                  </div>
                )}
                {selectedResource.link && (
                  <a href={selectedResource.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline mt-2 block">
                    Open resource link
                  </a>
                )}
                {selectedResource.file_url && (
                  <a href={selectedResource.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline mt-1 block">
                    View uploaded file
                  </a>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Moderation note (optional)</label>
                <Textarea value={moderationNote} onChange={e => setModerationNote(e.target.value)} placeholder="Reason for approval/rejection..." className="mt-1" />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="destructive" onClick={() => updateStatus.mutate({ id: selectedResource.id, status: 'rejected', note: moderationNote })}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button variant="outline" onClick={() => updateStatus.mutate({ id: selectedResource.id, status: 'flagged', note: moderationNote })}>
                  <Flag className="h-4 w-4 mr-1" /> Flag
                </Button>
                <Button onClick={() => updateStatus.mutate({ id: selectedResource.id, status: 'approved', note: moderationNote })}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserResourceModeration;
