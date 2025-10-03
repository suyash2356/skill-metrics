import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  ImageIcon, 
  Video, 
  Link, 
  FileText, 
  BookOpen,
  Plus,
  X,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// Validation schema
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().max(50000, "Content must be less than 50,000 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1,000 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string().max(50, "Tag must be less than 50 characters")).max(10, "Maximum 10 tags allowed"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [postType, setPostType] = useState("article");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [category, setCategory] = useState("");
  const [communityId, setCommunityId] = useState<string | null>(null); // New state for community selection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    "Programming", "Design", "Data Science", "AI/ML", "DevOps", 
    "Cybersecurity", "Mobile Development", "Web Development", 
    "Cloud Computing", "Blockchain", "UI/UX", "Product Management"
  ];

  const { data: communities } = useQuery({
    queryKey: ['userCommunities', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id, communities(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(member => member.communities);
    },
    enabled: !!user?.id,
  });

  const postTypes = [
    { id: "article", name: "Article", icon: FileText, description: "Share knowledge and insights" },
    { id: "resource", name: "Resource", icon: BookOpen, description: "Curate learning materials" },
    { id: "video", name: "Video", icon: Video, description: "Educational video content" },
    { id: "link", name: "Link", icon: Link, description: "Share external resources" }
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  const handleUploadClick = () => fileInputRef.current?.click();
  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validate file sizes
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        });
        return;
      }
    }
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setContent(prev => `${prev}\n\n![image](${dataUrl})`);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
    content: z.string().max(50000, "Content must be 50,000 characters or less"),
    category: z.string().min(1, "Please select a category"),
    tags: z.array(z.string().max(50)).max(10, "Maximum 10 tags allowed"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = postSchema.safeParse({
      title,
      description,
      content,
      category,
      tags,
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    if (!user) return;
    setIsSubmitting(true);

    const postPayload: any = {
      user_id: user.id,
      title,
      content: description + (content ? "\n\n" + content : ""),
      category,
      tags,
    };
    if (communityId) {
      postPayload.community_id = communityId;
    }

    const { data: newPost, error } = await supabase.from('posts').insert(postPayload).select('id, title').single();

    if (error) {
      toast({ title: 'Failed to publish post', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    toast({ title: 'Post published' });

    // If post is in a community, notify all members
    if (communityId && newPost) {
      const { data: members, error: membersError } = await supabase
        .from('community_members')
        .select('user_id')
        .eq('community_id', communityId);

      if (membersError) {
        console.error("Error fetching community members for notification:", membersError);
      } else if (members) {
        const notificationRecipients = members
          .map(member => member.user_id)
          .filter(memberId => memberId !== user.id); // Exclude the post author

        for (const recipientId of notificationRecipients) {
          // The useNotifications hook does not export a createNotification function.
          // This needs to be implemented or sourced from elsewhere.
          // For now, we will log the intent to create a notification.
          console.log(`Intending to create notification for user ${recipientId}`);
          
          // Example of what the call might look like if available:
          // await createNotification({
          //   user_id: recipientId,
          //   type: 'community_post',
          //   title: `New post in your community: "${title}"`,
          //   body: `Check out the latest post by ${user.user_metadata.full_name || 'a member'}.`,
          //   data: { post_id: newPost.id, community_id: communityId, post_title: newPost.title },
          // });
        }
      }
    }

    navigate('/home');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your knowledge and help others learn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Post Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        postType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPostType(type.id)}
                    >
                      <Icon className="h-6 w-6 mb-2 mx-auto" />
                      <h3 className="font-medium text-center mb-1">{type.name}</h3>
                      <p className="text-xs text-muted-foreground text-center">
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your post..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="community">Community (Optional)</Label>
                <Select value={communityId || "none"} onValueChange={(value) => setCommunityId(value === "none" ? null : value)}>
                  <SelectTrigger id="community" className="w-full">
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Community</SelectItem>
                    {(communities || []).map((community: any) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Add Media</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  multiple
                  className="hidden"
                  onChange={onFilesSelected}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images/Videos
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports: Images (JPEG, PNG, GIF), Videos (MP4, WebM), PDFs (max 50MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;