import { Bell, CheckCheck, Loader2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import { Link, useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, isLoading, markAllAsRead, markAsRead, deleteNotification, createTestNotification } = useNotifications();
  const { pendingRequests } = useFollowRequests();
  const navigate = useNavigate();
  
  const totalUnread = unreadCount + pendingRequests.length;

  const getNotificationLink = (notification: any) => {
    if (notification.data?.roadmap_id) {
      return `/roadmaps/${notification.data.roadmap_id}`;
    }
    if (notification.data?.post_id) {
      // Assuming a route structure for posts
      return `/posts/${notification.data.post_id}`;
    }
    if (notification.data?.follower_id) {
      return `/profile/${notification.data.follower_id}`;
    }
    return '#';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 py-0 h-4 min-w-[16px] text-[10px] leading-4" variant="destructive">{totalUnread}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-3 py-2 flex items-center justify-between border-b">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="gap-1 text-xs h-7 px-2">
              <CheckCheck className="h-3 w-3" /> Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-auto">
          {/* Follow Requests Section */}
          {pendingRequests.length > 0 && (
            <>
              <DropdownMenuItem asChild className="border-b bg-accent/50">
                <Link to="/follow-requests" className="flex items-center gap-2 w-full">
                  <UserPlus className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Follow Requests</div>
                    <div className="text-xs text-muted-foreground">
                      {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <Badge variant="secondary">{pendingRequests.length}</Badge>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              You're all caught up.
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => createTestNotification()}>Create test notification</Button>
              </div>
            </div>
          ) : (
            <>
              {notifications.slice(0, 5).map((n) => (
                <DropdownMenuItem key={n.id} asChild className={`border-b last:border-b-0 ${!n.read_at ? 'bg-accent/40' : ''}`}>
                  <Link to={getNotificationLink(n)} className="block w-full">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{n.title}</div>
                        {n.body && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</div>}
                        <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!n.read_at && (
                          <Button size="icon" variant="ghost" onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(n.id); }} aria-label="Mark as read" className="h-7 w-7">
                            <CheckCheck className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(n.id); }} aria-label="Delete" className="h-7 w-7">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              {notifications.length > 5 && (
                <div className="p-2 border-t bg-muted/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => navigate('/notifications')}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;


