 import { useState, useRef } from "react";
 import { Layout } from "@/components/Layout";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Badge } from "@/components/ui/badge";
 import { Label } from "@/components/ui/label";
 import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
 import {
   Plus,
   X,
   Image,
   FileVideo,
   Paperclip,
   ArrowLeft
 } from "lucide-react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 import { z } from "zod";
 
 // Validation schema
 const postSchema = z.object({
   title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
   content: z.string().max(1000000, "Content must be less than 1,000,000 characters"),
   description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1,000 characters"),
   category: z.string().min(1, "Category is required"),
   tags: z.array(z.string().max(50, "Tag must be less than 50 characters")).max(10, "Maximum 10 tags allowed"),
 });
 
 // Allow up to 100MB uploads for posts
 const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
 
 const CreatePost = () => {
   const navigate = useNavigate();
   const { user } = useAuth();
   const { toast } = useToast();
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [content, setContent] = useState("");
   const [tags, setTags] = useState<string[]>([]);
   const [newTag, setNewTag] = useState("");
   const [category, setCategory] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [uploadedMedia, setUploadedMedia] = useState<Array<{type: string; url: string; name: string}>>([]);
   const [isUploading, setIsUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
 
   const categories = [
     "Programming", "Design", "Data Science", "AI/ML", "DevOps",
     "Cybersecurity", "Mobile Development", "Web Development",
     "Cloud Computing", "Blockchain", "UI/UX", "Product Management"
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
 
   const handleUploadClick = () => fileInputRef.current?.click();
 
   const removeMedia = (index: number) => {
     setUploadedMedia(prev => prev.filter((_, i) => i !== index));
   };
 
   const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
     const files = e.target.files;
     if (!files || files.length === 0) return;
 
     setIsUploading(true);
 
     for (const file of Array.from(files)) {
       if (file.size > MAX_FILE_SIZE) {
         toast({
           title: "File too large",
           description: `${file.name} exceeds ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB limit`,
           variant: "destructive",
         });
         setIsUploading(false);
         return;
       }
 
       try {
         const fileExt = file.name.split('.').pop();
         const fileName = `${user?.id || 'anon'}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
         const { data: uploadData, error: uploadError } = await supabase.storage
           .from('post-media')
           .upload(fileName, file, { cacheControl: '3600', upsert: false });
 
         if (uploadError) throw uploadError;
 
         const { data: publicData } = supabase.storage.from('post-media').getPublicUrl(uploadData.path);
         const publicUrl = publicData.publicUrl;
 
         if (file.type.startsWith('image/')) {
           setUploadedMedia(prev => [...prev, { type: 'image', url: publicUrl, name: file.name }]);
         } else if (file.type.startsWith('video/')) {
           setUploadedMedia(prev => [...prev, { type: 'video', url: publicUrl, name: file.name }]);
         } else {
           setUploadedMedia(prev => [...prev, { type: 'document', url: publicUrl, name: file.name }]);
         }
 
         toast({ title: `${file.name} uploaded successfully` });
       } catch (err: any) {
         toast({ title: 'Upload failed', description: err?.message || 'Unknown error', variant: 'destructive' });
       }
     }
 
     setIsUploading(false);
     if (fileInputRef.current) fileInputRef.current.value = "";
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
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
 
     // Build structured content
     const blocks: Array<{type: string; content?: string; imageUrl?: string; videoUrl?: string; documentUrl?: string; documentName?: string}> = [];
 
     if (description) {
       blocks.push({ type: 'paragraph', content: description });
     }
 
     if (content) {
       blocks.push({ type: 'paragraph', content: content });
     }
 
     for (const media of uploadedMedia) {
       if (media.type === 'image') {
         blocks.push({ type: 'image', imageUrl: media.url });
       } else if (media.type === 'video') {
         blocks.push({ type: 'video', videoUrl: media.url });
       } else {
         blocks.push({ type: 'document', documentUrl: media.url, documentName: media.name });
       }
     }
 
     const structuredContent = JSON.stringify({ type: 'post', blocks });
 
     const postPayload = {
       user_id: user.id,
       title,
       content: structuredContent,
       category,
       tags,
     };
 
     const { error } = await supabase.from('posts').insert(postPayload).select('id, title').single();
 
     if (error) {
       toast({ title: 'Failed to publish post', variant: 'destructive' });
       setIsSubmitting(false);
       return;
     }
 
     toast({ title: 'Post published' });
     navigate('/home');
   };
 
   return (
     <Layout>
       <div className="container mx-auto px-4 py-4 max-w-2xl">
         {/* Header */}
         <div className="flex items-center gap-3 mb-6">
           <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <h1 className="text-xl font-semibold">Create Post</h1>
         </div>
 
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Main Content Card */}
           <Card className="shadow-sm">
             <CardContent className="p-4 space-y-4">
               {/* Title */}
               <div className="space-y-2">
                 <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                 <Input
                   id="title"
                   placeholder="What's your post about?"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   required
                   className="text-base"
                 />
               </div>
 
               {/* Description */}
               <div className="space-y-2">
                 <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                 <Textarea
                   id="description"
                   placeholder="Write something..."
                   rows={4}
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   required
                   className="resize-none"
                 />
               </div>
 
               {/* Category */}
               <div className="space-y-2">
                 <Label htmlFor="category" className="text-sm font-medium">Category</Label>
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
 
               {/* Tags */}
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Tags (optional)</Label>
                 {tags.length > 0 && (
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
                 )}
                 <div className="flex gap-2">
                   <Input
                     placeholder="Add a tag..."
                     value={newTag}
                     onChange={(e) => setNewTag(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                     className="flex-1"
                   />
                   <Button type="button" variant="outline" size="icon" onClick={addTag}>
                     <Plus className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
 
           {/* Media Upload Section */}
           <Card className="shadow-sm">
             <CardContent className="p-4 space-y-4">
               {/* Uploaded Media Preview */}
               {uploadedMedia.length > 0 && (
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {uploadedMedia.map((media, index) => (
                     <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                       {media.type === 'image' ? (
                         <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                       ) : media.type === 'video' ? (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                           <FileVideo className="h-8 w-8 text-muted-foreground" />
                           <span className="text-xs text-muted-foreground mt-2 px-2 text-center truncate w-full">{media.name}</span>
                         </div>
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2">
                           <Paperclip className="h-8 w-8 text-muted-foreground mb-1" />
                           <span className="text-xs text-muted-foreground text-center truncate w-full">{media.name}</span>
                         </div>
                       )}
                       <Button
                         type="button"
                         variant="destructive"
                         size="icon"
                         className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                         onClick={() => removeMedia(index)}
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   ))}
                 </div>
               )}
 
               {/* Upload Buttons */}
               <div>
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                   multiple
                   className="hidden"
                   onChange={onFilesSelected}
                 />
                 <div className="flex items-center gap-2">
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handleUploadClick}
                     disabled={isUploading}
                     className="flex-1 sm:flex-none"
                   >
                     <Image className="h-4 w-4 mr-2" />
                     Photo
                   </Button>
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handleUploadClick}
                     disabled={isUploading}
                     className="flex-1 sm:flex-none"
                   >
                     <FileVideo className="h-4 w-4 mr-2" />
                     Video
                   </Button>
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handleUploadClick}
                     disabled={isUploading}
                     className="flex-1 sm:flex-none"
                   >
                     <Paperclip className="h-4 w-4 mr-2" />
                     File
                   </Button>
                 </div>
                 {isUploading && (
                   <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                 )}
                 <p className="text-xs text-muted-foreground mt-2">
                   Supports images, videos, PDFs, and documents up to 100MB
                 </p>
               </div>
             </CardContent>
           </Card>
 
           {/* Additional Content (Optional) */}
           <Card className="shadow-sm">
             <CardContent className="p-4">
               <div className="space-y-2">
                 <Label htmlFor="content" className="text-sm font-medium">Additional Details (optional)</Label>
                 <Textarea
                   id="content"
                   placeholder="Add more details, links, or context..."
                   rows={3}
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   className="resize-none"
                 />
               </div>
             </CardContent>
           </Card>
 
           {/* Submit Buttons */}
           <div className="flex gap-3 pb-6">
             <Button
               type="button"
               variant="outline"
               onClick={() => navigate(-1)}
               disabled={isSubmitting}
               className="flex-1"
             >
               Cancel
             </Button>
             <Button type="submit" disabled={isSubmitting} className="flex-1">
               {isSubmitting ? "Publishing..." : "Publish Post"}
             </Button>
           </div>
         </form>
       </div>
     </Layout>
   );
 };
 
 export default CreatePost;