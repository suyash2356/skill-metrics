import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Users, Search, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useNavigate } from 'react-router-dom';

interface FollowUser {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function CreateGroupDialog({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  const { createGroup, isCreating } = useGroupChat();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'members' | 'details'>('members');
  const [search, setSearch] = useState('');
  const [mutualFollowers, setMutualFollowers] = useState<FollowUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  // Fetch mutual followers
  useEffect(() => {
    if (!open || !user) return;
    (async () => {
      setLoadingFollowers(true);
      try {
        // Get users I follow
        const { data: following } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', user.id)
          .eq('status', 'accepted');

        // Get users that follow me
        const { data: followers } = await supabase
          .from('followers')
          .select('follower_id')
          .eq('following_id', user.id)
          .eq('status', 'accepted');

        const followingSet = new Set((following || []).map(f => f.following_id));
        const followerSet = new Set((followers || []).map(f => f.follower_id));
        const mutualIds = [...followingSet].filter(id => followerSet.has(id));

        if (mutualIds.length === 0) {
          setMutualFollowers([]);
          setLoadingFollowers(false);
          return;
        }

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', mutualIds);

        setMutualFollowers(profiles || []);
      } catch (err) {
        console.error('Error fetching followers:', err);
      } finally {
        setLoadingFollowers(false);
      }
    })();
  }, [open, user]);

  const filteredFollowers = mutualFollowers.filter(f =>
    (f.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (userId: string) => {
    setSelectedIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedIds.length === 0) return;
    const convId = await createGroup(groupName.trim(), selectedIds, groupDescription.trim() || undefined);
    if (convId) {
      setOpen(false);
      resetState();
      navigate(`/messages/${convId}`);
    }
  };

  const resetState = () => {
    setStep('members');
    setSearch('');
    setSelectedIds([]);
    setGroupName('');
    setGroupDescription('');
  };

  const selectedProfiles = mutualFollowers.filter(f => selectedIds.includes(f.user_id));

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetState(); }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" /> New Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'members' ? 'Select Members' : 'Group Details'}
          </DialogTitle>
        </DialogHeader>

        {step === 'members' ? (
          <div className="space-y-4">
            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedProfiles.map(p => (
                  <Badge key={p.user_id} variant="secondary" className="gap-1 pr-1">
                    {p.full_name || 'Unknown'}
                    <button onClick={() => toggleSelect(p.user_id)} className="ml-0.5 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mutual followers..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* User list */}
            <ScrollArea className="h-64">
              {loadingFollowers ? (
                <div className="space-y-3 p-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="h-4 bg-muted rounded w-32" />
                    </div>
                  ))}
                </div>
              ) : filteredFollowers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {search ? 'No matching followers' : 'No mutual followers found. You can add people you mutually follow.'}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredFollowers.map(f => {
                    const isSelected = selectedIds.includes(f.user_id);
                    return (
                      <button
                        key={f.user_id}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        onClick={() => toggleSelect(f.user_id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={f.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {(f.full_name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-left text-sm font-medium truncate">
                          {f.full_name || 'Unknown'}
                        </span>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <DialogFooter>
              <Button
                onClick={() => setStep('details')}
                disabled={selectedIds.length === 0}
                className="w-full"
              >
                Next ({selectedIds.length} selected)
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Group Name *</label>
              <Input
                placeholder="Enter group name..."
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                maxLength={100}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
              <Textarea
                placeholder="What's this group about?"
                value={groupDescription}
                onChange={e => setGroupDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} + you
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep('members')}>Back</Button>
              <Button
                onClick={handleCreate}
                disabled={!groupName.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
