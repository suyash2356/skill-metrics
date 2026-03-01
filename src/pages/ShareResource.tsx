import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserResources } from "@/hooks/useUserResources";
import { useNavigate } from "react-router-dom";
import { Upload, Link as LinkIcon, FileText, Video, BookOpen, Image, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

const RESOURCE_TYPES = [
  { value: 'course', label: 'Course Link', icon: BookOpen },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'pdf', label: 'PDF / Document', icon: FileText },
  { value: 'book', label: 'Book', icon: BookOpen },
  { value: 'link', label: 'Website / Link', icon: LinkIcon },
  { value: 'image', label: 'Image', icon: Image },
];

const CATEGORIES = [
  'Programming', 'Web Development', 'Data Science', 'Machine Learning', 'AI',
  'Cloud Computing', 'Cybersecurity', 'DevOps', 'Mobile Development',
  'Database', 'Design', 'Business', 'Marketing', 'Mathematics',
  'Physics', 'Engineering', 'Finance', 'Language Learning', 'Other'
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const ALLOWED_FILE_TYPES = [
  'application/pdf', 'video/mp4', 'video/webm',
  'image/jpeg', 'image/png', 'image/webp',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ShareResource = () => {
  const navigate = useNavigate();
  const { createResource, uploadFile } = useUserResources();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    resource_type: '',
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    link: '',
    file_url: '',
    file_type: '',
    tags: '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('File type not allowed. Please upload PDF, video, image, or document files.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('File too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm(f => ({ ...f, file_url: url, file_type: file.type }));
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    await createResource.mutateAsync({
      title: form.title,
      description: form.description,
      resource_type: form.resource_type,
      category: form.category,
      difficulty: form.difficulty,
      link: form.link || undefined,
      file_url: form.file_url || undefined,
      file_type: form.file_type || undefined,
      tags,
    });
    setSubmitted(true);
  };

  const canProceedStep1 = !!form.resource_type;
  const needsFile = ['video', 'pdf', 'image'].includes(form.resource_type);
  const needsLink = ['course', 'link', 'book'].includes(form.resource_type);
  const canProceedStep2 = needsFile ? !!form.file_url : needsLink ? !!form.link : true;
  const canSubmit = form.title.length >= 3 && form.description.length >= 10 && !!form.category;

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Resource Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your resource has been submitted for review. Once approved by an admin, it will be visible to other users.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/my-posts')}>My Contributions</Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); setForm({ resource_type: '', title: '', description: '', category: '', difficulty: 'beginner', link: '', file_url: '', file_type: '', tags: '' }); }}>Share Another</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <h1 className="text-2xl font-bold mb-6">Share a Resource</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>Choose Resource Type</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RESOURCE_TYPES.map(rt => {
                  const Icon = rt.icon;
                  return (
                    <button
                      key={rt.value}
                      onClick={() => setForm(f => ({ ...f, resource_type: rt.value }))}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${form.resource_type === rt.value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <span className="text-sm font-medium">{rt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>Next</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>{needsFile ? 'Upload File' : 'Add Link'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {needsFile && (
                <div>
                  <label className="block text-sm font-medium mb-2">Upload your file</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {form.file_url ? (
                      <div>
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => setForm(f => ({ ...f, file_url: '', file_type: '' }))}>Replace</Button>
                      </div>
                    ) : uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload (max 50MB)</p>
                        <input type="file" className="hidden" onChange={handleFileUpload} accept={ALLOWED_FILE_TYPES.join(',')} />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {(needsLink || form.resource_type === 'video') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Resource URL</label>
                  <Input
                    placeholder="https://..."
                    value={form.link}
                    onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                  />
                </div>
              )}

              {/* Preview */}
              {form.file_url && form.file_type?.startsWith('video') && (
                <video src={form.file_url} controls className="w-full rounded-lg max-h-64" />
              )}
              {form.file_url && form.file_type === 'application/pdf' && (
                <iframe src={form.file_url} className="w-full h-64 rounded-lg border" title="PDF Preview" />
              )}
              {form.file_url && form.file_type?.startsWith('image') && (
                <img src={form.file_url} className="w-full rounded-lg max-h-64 object-contain" alt="Preview" />
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>Next</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader><CardTitle>Resource Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource title" maxLength={200} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what this resource covers..." rows={4} maxLength={2000} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g., python, machine-learning, beginner" />
              </div>

              {form.tags && (
                <div className="flex flex-wrap gap-1">
                  {form.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                    <Badge key={i} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                ⚠️ Your resource will be reviewed before being visible to others. Only educational, authentic content is allowed.
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || createResource.isPending}>
                  {createResource.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</> : 'Submit Resource'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ShareResource;
