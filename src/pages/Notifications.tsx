import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { Heart, MessageCircle, UserPlus, BookOpen, Trash2, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read_at);
  const readNotifications = notifications.filter(n => n.read_at);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="h-5 w-5 text-primary" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'roadmap':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      default:
        return <Heart className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationLink = (notification: any) => {
    if (notification.data?.roadmap_id) {
      return `/roadmaps/${notification.data.roadmap_id}`;
    }
    if (notification.data?.post_id) {
      return `/home?post=${notification.data.post_id}`;
    }
    if (notification.data?.follower_id) {
      return `/profile/${notification.data.follower_id}`;
    }
    return '#';
  };

  const NotificationItem = ({ notification, isUnread }: { notification: any; isUnread: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={getNotificationLink(notification)}
        onClick={() => isUnread && markAsRead(notification.id)}
        className="block"
      >
        <Card className={`mb-3 border-l-4 transition-all hover:shadow-md hover:border-l-primary ${
          isUnread ? 'border-l-primary bg-primary/5 shadow-sm' : 'border-l-transparent'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">{notification.title}</p>
                    {notification.body && (
                      <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isUnread && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          markAsRead(notification.id);
                        }}
                        className="h-8 w-8"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteNotification(notification.id);
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-semibold mb-2">No notifications yet</p>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      When someone likes your posts, comments, or follows you, you'll see it here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {unreadNotifications.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        New
                      </h2>
                      {unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          isUnread={true}
                        />
                      ))}
                    </div>
                  )}
                  
                  {readNotifications.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Earlier
                      </h2>
                      {readNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          isUnread={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <AnimatePresence mode="popLayout">
              {unreadNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
                      <CheckCheck className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-semibold mb-2">You're all caught up!</p>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      You have no unread notifications at the moment.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isUnread={true}
                  />
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
