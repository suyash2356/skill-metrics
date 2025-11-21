import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Heart, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { usePostInteractions } from "@/hooks/usePostInteractions";

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  user_id?: string;
}

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId?: string;
  postId?: string;
}

export const CommentDialog = ({ isOpen, onClose, roadmapId, postId }: CommentDialogProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendCommentNotification } = usePostInteractions();

  // Fetch comments directly in the dialog
  const { data: commentsData, isLoading } = useQuery({
    queryKey: postId ? ['postComments', postId] : ['roadmapComments', roadmapId],
    queryFn: async () => {
      if (!postId && !roadmapId) return [];
      
      let commentsQuery = supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postId) {
        commentsQuery = commentsQuery.eq('post_id', postId);
      } else if (roadmapId) {
        commentsQuery = commentsQuery.eq('roadmap_id', roadmapId);
      }
      
      const { data: comments, error: commentsError } = await commentsQuery;
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        throw commentsError;
      }

      if (!comments || comments.length === 0) {
        return [];
      }

      // Fetch profiles for all comment authors
      const userIds = [...new Set(comments.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      // Map profiles by user_id
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Merge comments with profile data
      return comments.map(comment => ({
        ...comment,
        profile: profileMap.get(comment.user_id) || null,
      }));
    },
    enabled: isOpen && (!!postId || !!roadmapId),
  });

  const comments: Comment[] = commentsData?.map(c => ({
    id: c.id,
    author: c.profile?.full_name || 'Anonymous',
    avatar: c.profile?.avatar_url,
    content: c.content,
    timestamp: new Date(c.created_at).toISOString(),
    likes: 0,
    user_id: c.user_id,
  })) || [];

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // Determine which ID to use and set the appropriate field
      const commentData: any = {
        user_id: user.id,
        content,
      };
      
      if (postId) {
        commentData.post_id = postId;
        commentData.roadmap_id = null;
        
        // Fetch post details to send notification
        const { data: post } = await supabase
          .from('posts')
          .select('user_id, title')
          .eq('id', postId)
          .single();
        
        if (post) {
          await sendCommentNotification(postId, post.user_id, post.title, content);
        }
      } else if (roadmapId) {
        commentData.roadmap_id = roadmapId;
        commentData.post_id = null;
      } else {
        throw new Error("Either postId or roadmapId must be provided");
      }
      
      const { data, error } = await supabase
        .from("comments")
        .insert(commentData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      } else if (roadmapId) {
        queryClient.invalidateQueries({ queryKey: ['roadmapComments', roadmapId] });
      }
      setNewComment("");
      toast({ title: "Comment added!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add comment", description: error.message, variant: "destructive" });
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { error } = await supabase
        .from("comments")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      } else if (roadmapId) {
        queryClient.invalidateQueries({ queryKey: ['roadmapComments', roadmapId] });
      }
      setEditingCommentId(null);
      setEditContent("");
      toast({ title: "Comment updated!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update comment", description: error.message, variant: "destructive" });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      } else if (roadmapId) {
        queryClient.invalidateQueries({ queryKey: ['roadmapComments', roadmapId] });
      }
      toast({ title: "Comment deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete comment", description: error.message, variant: "destructive" });
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim());
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editingCommentId) {
      editCommentMutation.mutate({ commentId: editingCommentId, content: editContent.trim() });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-left">Comments ({comments.length})</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={addCommentMutation.isPending}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} size="sm" disabled={addCommentMutation.isPending}>
                  {addCommentMutation.isPending ? "Posting..." : <><Send className="h-4 w-4 mr-2" />Comment</>}
                </Button>
              </div>
            </div>
          </div>

          {!isLoading && comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}

          {!isLoading && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} size="sm" disabled={editCommentMutation.isPending}>
                          {editCommentMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                          {user?.id === comment.user_id && (
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                onClick={() => handleEditComment(comment)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto p-1 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};