import { useState, useEffect } from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Users, Info, MoreVertical, Shield, UserMinus, UserPlus,
  LogOut, Settings, Crown, Search
} from 'lucide-react';
import { useGroupChat, GroupInfo, GroupMember } from '@/hooks/useGroupChat';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface GroupInfoSheetProps {
  conversationId: string;
  groupInfo: GroupInfo | null;
  onRefresh: () => void;
  children?: React.ReactNode;
}

export function GroupInfoSheet({ conversationId, groupInfo, onRefresh, children }: GroupInfoSheetProps) {
  const { user } = useAuth();
  const { removeMember, leaveGroup, toggleAdmin, addMember } = useGroupChat();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<GroupMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [addableUsers, setAddableUsers] = useState<{ user_id: string; full_name: string | null; avatar_url: string | null }[]>([]);

  const isAdmin = groupInfo?.currentUserRole === 'admin';
  const memberCount = groupInfo?.members.length || 0;

  // Fetch addable users (mutual followers not in group)
  useEffect(() => {
    if (!showAddMember || !user || !groupInfo) return;
    (async () => {
      const { data: following } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id)
        .eq('status', 'accepted');

      const { data: followers } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', user.id)
        .eq('status', 'accepted');

      const followingSet = new Set((following || []).map(f => f.following_id));
      const followerSet = new Set((followers || []).map(f => f.follower_id));
      const mutualIds = [...followingSet].filter(id => followerSet.has(id));
      const existingMemberIds = new Set(groupInfo.members.map(m => m.user_id));
      const addableIds = mutualIds.filter(id => !existingMemberIds.has(id));

      if (addableIds.length === 0) {
        setAddableUsers([]);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', addableIds);

      setAddableUsers(profiles || []);
    })();
  }, [showAddMember, user, groupInfo]);

  const handleLeave = async () => {
    await leaveGroup(conversationId);
    setLeaveConfirm(false);
    setOpen(false);
    navigate('/messages');
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    await removeMember(conversationId, removeTarget.user_id);
    setRemoveTarget(null);
    onRefresh();
  };

  const handleToggleAdmin = async (memberId: string) => {
    await toggleAdmin(conversationId, memberId);
    onRefresh();
  };

  const handleAddMember = async (userId: string) => {
    await addMember(conversationId, userId);
    setAddableUsers(prev => prev.filter(u => u.user_id !== userId));
    onRefresh();
  };

  const filteredAddable = addableUsers.filter(u =>
    (u.full_name || '').toLowerCase().includes(addSearch.toLowerCase())
  );

  if (!groupInfo) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={groupInfo.group_avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {(groupInfo.group_name || 'G').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <SheetTitle className="text-xl">{groupInfo.group_name}</SheetTitle>
              {groupInfo.description && (
                <p className="text-sm text-muted-foreground text-center">{groupInfo.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                <Users className="h-3 w-3 inline mr-1" />
                {memberCount} member{memberCount !== 1 ? 's' : ''}
              </p>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
            <div className="p-4 space-y-4">
              {/* Admin actions */}
              {isAdmin && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => setShowAddMember(!showAddMember)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Members
                  </Button>

                  {showAddMember && (
                    <div className="border rounded-lg p-3 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          className="pl-8 h-8 text-sm"
                          value={addSearch}
                          onChange={e => setAddSearch(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {filteredAddable.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-2">No users to add</p>
                        ) : (
                          filteredAddable.map(u => (
                            <div key={u.user_id} className="flex items-center gap-2 p-1.5 rounded hover:bg-accent/50">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={u.avatar_url || undefined} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {(u.full_name || 'U').charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex-1 text-sm truncate">{u.full_name}</span>
                              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleAddMember(u.user_id)}>
                                <UserPlus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Members list */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members ({memberCount})
                </h3>
                <div className="space-y-1">
                  {groupInfo.members
                    .sort((a, b) => {
                      if (a.role === 'admin' && b.role !== 'admin') return -1;
                      if (b.role === 'admin' && a.role !== 'admin') return 1;
                      return 0;
                    })
                    .map(member => (
                      <div
                        key={member.user_id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {(member.full_name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium truncate">
                              {member.full_name || 'Unknown'}
                              {member.user_id === user?.id && ' (You)'}
                            </span>
                            {member.role === 'admin' && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                <Crown className="h-2.5 w-2.5" /> Admin
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Admin actions for each member */}
                        {isAdmin && member.user_id !== user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleAdmin(member.user_id)}>
                                <Shield className="h-3.5 w-3.5 mr-2" />
                                {member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setRemoveTarget(member)}
                                className="text-destructive focus:text-destructive"
                              >
                                <UserMinus className="h-3.5 w-3.5 mr-2" />
                                Remove from Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Leave group */}
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => setLeaveConfirm(true)}
              >
                <LogOut className="h-4 w-4" /> Leave Group
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Leave confirmation */}
      <AlertDialog open={leaveConfirm} onOpenChange={setLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave group?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll no longer receive messages from this group. You'll need an admin to add you back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave} className="bg-destructive text-destructive-foreground">
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove confirmation */}
      <AlertDialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removeTarget?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They'll no longer be able to send or receive messages in this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
