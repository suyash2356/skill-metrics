import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages, Message } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useChatEncryption } from '@/context/ChatEncryptionContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Send, Smile, MoreVertical, Reply, Pencil, Trash2,
  Check, CheckCheck, Shield, X, Lock
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { SharedPostPreview } from '@/components/chat/SharedPostPreview';
import { ChatEncryptionGate } from '@/components/chat/ChatEncryptionGate';

const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥', '👏', '🙏'];

function ChatContent() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { privateKey, publicKey, getUserPublicKey } = useChatEncryption();

  const {
    messages, isLoading, isSending,
    sendMessage, editMessage, deleteMessage, toggleReaction
  } = useMessages(conversationId || null, { privateKey, userId: user?.id });

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [otherUser, setOtherUser] = useState<{ full_name: string | null; avatar_url: string | null; user_id: string } | null>(null);
  const [recipientPublicKey, setRecipientPublicKey] = useState<JsonWebKey | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch other participant info + their public key
  useEffect(() => {
    if (!conversationId || !user) return;
    (async () => {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', user.id);

      if (participants?.[0]) {
        const otherUserId = participants[0].user_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .eq('user_id', otherUserId)
          .maybeSingle();
        if (profile) setOtherUser(profile);

        // Fetch recipient's public key
        const pubKey = await getUserPublicKey(otherUserId);
        setRecipientPublicKey(pubKey);
      }
    })();
  }, [conversationId, user, getUserPublicKey]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getEncryptionKeys = () => {
    if (!publicKey || !recipientPublicKey || !user || !otherUser) return undefined;
    return {
      senderPublicKey: publicKey,
      recipientPublicKey: recipientPublicKey,
      senderId: user.id,
      recipientId: otherUser.user_id,
    };
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      await sendMessage(text, 'text', undefined, undefined, replyTo?.id, getEncryptionKeys());
      setInput('');
      setReplyTo(null);
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editText.trim()) return;
    try {
      await editMessage(editingId, editText.trim(), getEncryptionKeys());
      setEditingId(null);
      setEditText('');
      toast.success('Message edited');
    } catch {
      toast.error('Failed to edit');
    }
  };

  const handleDelete = async (msgId: string) => {
    try {
      await deleteMessage(msgId);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.content || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; messages: Message[] }[]>((groups, msg) => {
    const d = new Date(msg.created_at);
    let label: string;
    if (isToday(d)) label = 'Today';
    else if (isYesterday(d)) label = 'Yesterday';
    else label = format(d, 'MMM d, yyyy');

    const last = groups[groups.length - 1];
    if (last && last.date === label) {
      last.messages.push(msg);
    } else {
      groups.push({ date: label, messages: [msg] });
    }
    return groups;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {otherUser && (
          <button
            className="flex items-center gap-3 flex-1 min-w-0"
            onClick={() => navigate(`/profile/${otherUser.user_id}`)}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={otherUser.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {(otherUser.full_name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left min-w-0">
              <p className="font-semibold text-sm truncate">{otherUser.full_name || 'Unknown'}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <Shield className="h-3 w-3" />
                End-to-end encrypted
              </p>
            </div>
          </button>
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* E2EE notice */}
        <div className="flex justify-center">
          <div className="bg-muted/50 text-muted-foreground text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            Messages are end-to-end encrypted. Only you and {otherUser?.full_name || 'the recipient'} can read them.
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Shield className="h-12 w-12 text-primary/30 mb-4" />
            <p className="text-muted-foreground text-sm">
              Start your encrypted conversation!
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center my-4">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {group.date}
                </span>
              </div>
              <div className="space-y-1">
                {group.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender_id === user?.id}
                    onReply={() => { setReplyTo(msg); inputRef.current?.focus(); }}
                    onEdit={() => startEdit(msg)}
                    onDelete={() => handleDelete(msg.id)}
                    onReaction={(emoji) => toggleReaction(msg.id, emoji)}
                    currentUserId={user?.id}
                    editingId={editingId}
                    editText={editText}
                    onEditChange={setEditText}
                    onEditSave={handleEdit}
                    onEditCancel={cancelEdit}
                  />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar */}
      {replyTo && (
        <div className="border-t bg-muted/50 px-4 py-2 flex items-center gap-2">
          <Reply className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium">
              Replying to {replyTo.sender_id === user?.id ? 'yourself' : otherUser?.full_name || 'them'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {replyTo.is_deleted ? 'Deleted message' : replyTo.content}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyTo(null)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-card px-4 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1"
            disabled={isSending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="rounded-full h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- MessageBubble Component ----

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (emoji: string) => void;
  currentUserId?: string;
  editingId: string | null;
  editText: string;
  onEditChange: (text: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
}

function MessageBubble({
  message, isOwn, onReply, onEdit, onDelete, onReaction,
  currentUserId, editingId, editText, onEditChange, onEditSave, onEditCancel
}: MessageBubbleProps) {
  const isEditing = editingId === message.id;

  if (message.is_deleted) {
    return (
      <div className={cn('flex mb-1', isOwn ? 'justify-end' : 'justify-start')}>
        <div className="px-4 py-2 rounded-2xl bg-muted/50 italic text-muted-foreground text-sm max-w-[75%]">
          This message was deleted
        </div>
      </div>
    );
  }

  const reactionGroups = (message.reactions || []).reduce<Record<string, { count: number; hasOwn: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, hasOwn: false };
    acc[r.emoji].count++;
    if (r.user_id === currentUserId) acc[r.emoji].hasOwn = true;
    return acc;
  }, {});

  return (
    <div className={cn('flex gap-2 mb-1 group', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[75%] relative', isOwn ? 'order-1' : 'order-1')}>
        {/* Reply preview */}
        {message.reply_to && (
          <div className={cn(
            'text-xs px-3 py-1.5 rounded-t-xl mb-0.5',
            isOwn ? 'bg-primary/20 text-primary-foreground/70' : 'bg-muted text-muted-foreground'
          )}>
            <span className="font-medium">
              {message.reply_to.sender_id === currentUserId ? 'You' : 'Them'}
            </span>
            <p className="truncate">{message.reply_to.is_deleted ? 'Deleted' : message.reply_to.content}</p>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md',
          message.message_type === 'post_share' && 'bg-transparent p-0 shadow-none',
          message.decryption_failed && 'opacity-60'
        )}>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editText}
                onChange={e => onEditChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onEditSave(); if (e.key === 'Escape') onEditCancel(); }}
                className="h-7 text-sm bg-background/50"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onEditSave}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onEditCancel}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : message.message_type === 'post_share' && message.shared_post_id ? (
            <SharedPostPreview postId={message.shared_post_id} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {/* Time & status */}
          <div className={cn(
            'flex items-center gap-1 mt-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}>
            <span className={cn('text-[10px]', isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
              {format(new Date(message.created_at), 'h:mm a')}
            </span>
            {message.is_edited && (
              <span className={cn('text-[10px]', isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                · edited
              </span>
            )}
            {isOwn && <CheckCheck className="h-3 w-3 text-primary-foreground/60" />}
          </div>
        </div>

        {/* Reactions display */}
        {Object.keys(reactionGroups).length > 0 && (
          <div className={cn('flex flex-wrap gap-1 mt-1', isOwn ? 'justify-end' : 'justify-start')}>
            {Object.entries(reactionGroups).map(([emoji, { count, hasOwn }]) => (
              <button
                key={emoji}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full border transition-colors',
                  hasOwn ? 'bg-primary/10 border-primary/30' : 'bg-muted border-border'
                )}
                onClick={() => onReaction(emoji)}
              >
                {emoji} {count > 1 && count}
              </button>
            ))}
          </div>
        )}

        {/* Actions (visible on hover) */}
        <div className={cn(
          'absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border rounded-lg shadow-sm p-0.5',
          isOwn ? '-left-2 -translate-x-full' : '-right-2 translate-x-full'
        )}>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smile className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side="top">
              <div className="flex gap-1">
                {QUICK_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    className="text-lg hover:scale-125 transition-transform p-1"
                    onClick={() => onReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReply}>
            <Reply className="h-3.5 w-3.5" />
          </Button>

          {isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <ChatEncryptionGate>
      <ChatContent />
    </ChatEncryptionGate>
  );
}
