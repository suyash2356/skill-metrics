import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Resource, ResourceInsert, useCreateResource, useUpdateResource } from '@/hooks/useAdmin';
import { Loader2, X, Plus } from 'lucide-react';

interface ResourceFormProps {
  resource?: Resource | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Python',
  'JavaScript',
  'Cloud Computing',
  'DevOps',
  'Cyber Security',
  'Mobile Development',
  'System Design',
  'DSA',
  'Database',
  'AI',
  'Blockchain',
  'Other'
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];

const BACKGROUNDS = ['student', 'professional', 'self-learner'];

const COLORS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
];

const ResourceForm = ({ resource, onSuccess, onCancel }: ResourceFormProps) => {
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();

  const [formData, setFormData] = useState<ResourceInsert>({
    title: '',
    description: '',
    link: '',
    category: 'Web Development',
    difficulty: 'beginner',
    is_free: true,
    icon: '📚',
    color: 'blue',
    related_skills: [],
    relevant_backgrounds: [],
    provider: '',
    duration: '',
    rating: null,
    is_featured: false,
    is_active: true,
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        link: resource.link,
        category: resource.category,
        difficulty: resource.difficulty,
        is_free: resource.is_free,
        icon: resource.icon,
        color: resource.color,
        related_skills: resource.related_skills || [],
        relevant_backgrounds: resource.relevant_backgrounds || [],
        provider: resource.provider || '',
        duration: resource.duration || '',
        rating: resource.rating,
        is_featured: resource.is_featured,
        is_active: resource.is_active,
      });
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      provider: formData.provider || null,
      duration: formData.duration || null,
    };

    if (resource) {
      updateResource.mutate(
        { id: resource.id, updates: dataToSubmit },
        { onSuccess }
      );
    } else {
      createResource.mutate(dataToSubmit, { onSuccess });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.related_skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        related_skills: [...prev.related_skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      related_skills: prev.related_skills.filter(s => s !== skill)
    }));
  };

  const toggleBackground = (bg: string) => {
    setFormData(prev => ({
      ...prev,
      relevant_backgrounds: prev.relevant_backgrounds.includes(bg)
        ? prev.relevant_backgrounds.filter(b => b !== bg)
        : [...prev.relevant_backgrounds, bg]
    }));
  };

  const isLoading = createResource.isPending || updateResource.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., freeCodeCamp Web Development"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the resource..."
            rows={3}
            required
          />
        </div>

        {/* Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="link">Link *</Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
            placeholder="https://..."
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty *</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map(diff => (
                <SelectItem key={diff} value={diff} className="capitalize">{diff}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider */}
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={formData.provider || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
            placeholder="e.g., Coursera, Udemy"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="e.g., 4 weeks, 10 hours"
          />
        </div>

        {/* Icon & Color */}
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (Emoji)</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="📚"
            maxLength={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <Select
            value={formData.color}
            onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${color.class}`} />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Related Skills */}
        <div className="space-y-2 md:col-span-2">
          <Label>Related Skills</Label>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.related_skills.map(skill => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2 md:col-span-2">
          <Label>Target Audience</Label>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map(bg => (
              <Badge
                key={bg}
                variant={formData.relevant_backgrounds.includes(bg) ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => toggleBackground(bg)}
              >
                {bg}
              </Badge>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="is_free">Free Resource</Label>
            <p className="text-xs text-muted-foreground">Is this resource free to access?</p>
          </div>
          <Switch
            id="is_free"
            checked={formData.is_free}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="is_featured">Featured</Label>
            <p className="text-xs text-muted-foreground">Show in featured section</p>
          </div>
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
          <div>
            <Label htmlFor="is_active">Active</Label>
            <p className="text-xs text-muted-foreground">Inactive resources won't be shown to users</p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {resource ? 'Update Resource' : 'Create Resource'}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
