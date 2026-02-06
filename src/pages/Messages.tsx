import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useConversations } from '@/hooks/useConversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

export default function Messages() {
  const { conversations, isLoading } = useConversations();
  const [searchFilter, setSearchFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const filtered = conversations.filter(c =>
    (c.other_user.full_name || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getLastMessagePreview = (conv: typeof conversations[0]) => {
    if (!conv.last_message) return 'No messages yet';
    if (conv.last_message.is_deleted) return 'Message deleted';
    if (conv.last_message.message_type === 'post_share') return '📎 Shared a post';
    if (conv.last_message.message_type === 'resource_share') return '📚 Shared a resource';
    const prefix = conv.last_message.sender_id === user?.id ? 'You: ' : '';
    return prefix + (conv.last_message.content || '').slice(0, 50);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" /> End-to-end private conversations
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Conversation List */}
        <div className="space-y-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No conversations yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start a conversation by visiting someone's profile and clicking the Message button. 
                You need to be mutual followers to chat.
              </p>
            </div>
          ) : (
            filtered.map(conv => (
              <button
                key={conv.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors text-left group"
                onClick={() => navigate(`/messages/${conv.id}`)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.other_user.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {(conv.other_user.full_name || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {conv.unread_count > 9 ? '9+' : conv.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm truncate ${conv.unread_count > 0 ? 'text-foreground' : ''}`}>
                      {conv.other_user.full_name || 'Unknown'}
                    </span>
                    {conv.last_message && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {getLastMessagePreview(conv)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
