import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Resource, useCreateResource, useUpdateResource } from '@/hooks/useAdmin';
import { Loader2, X, Plus } from 'lucide-react';

interface EnhancedResourceFormProps {
  resource?: Resource | null;
  defaultSectionType?: 'domain' | 'exam';
  defaultCategory?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Domain categories
const DOMAIN_CATEGORIES = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'DevOps',
  'Web Development',
  'Mobile Development',
  'Software Development',
  'Python',
  'JavaScript',
  'Database',
  'System Design',
  'DSA',
  'UI/UX',
  'Design',
  'Business',
  'Marketing',
  'Management',
  'Finance',
  'Communication',
  'Other'
];

// Exam categories
const EXAM_CATEGORIES = [
  'GRE',
  'GMAT',
  'CAT',
  'JEE',
  'NEET',
  'TOEFL',
  'IELTS',
  'SAT',
  'GATE',
  'UPSC',
  'LSAT',
  'MCAT',
  'Other'
];

const RESOURCE_TYPES = [
  { value: 'course', label: 'Course', emoji: '📚' },
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'book', label: 'Book', emoji: '📖' },
  { value: 'blog', label: 'Blog/Article', emoji: '📝' },
  { value: 'website', label: 'Website', emoji: '🌐' },
  { value: 'certification', label: 'Certification', emoji: '🏆' },
  { value: 'degree', label: 'Degree Program', emoji: '🎓' },
  { value: 'learning_path', label: 'Learning Path', emoji: '🗺️' },
  { value: 'coaching', label: 'Coaching/Tutorial', emoji: '👨‍🏫' },
  { value: 'exam_prep', label: 'Exam Prep', emoji: '📋' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];
const BACKGROUNDS = ['student', 'professional', 'self-learner'];
const EDUCATION_LEVELS = ['high-school', 'bachelors', 'masters', 'phd'];

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'India', 'Germany', 'Singapore', 'Global'];

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

interface FormData {
  title: string;
  description: string;
  link: string;
  category: string;
  difficulty: string;
  is_free: boolean;
  icon: string;
  color: string;
  related_skills: string[];
  relevant_backgrounds: string[];
  provider: string;
  duration: string;
  rating: number | null;
  is_featured: boolean;
  is_active: boolean;
  resource_type: string;
  section_type: string;
  target_countries: string[];
  estimated_time: string;
  prerequisites: string[];
  education_levels: string[];
}

const EnhancedResourceForm = ({ 
  resource, 
  defaultSectionType = 'domain',
  defaultCategory,
  onSuccess, 
  onCancel 
}: EnhancedResourceFormProps) => {
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    link: '',
    category: defaultCategory || (defaultSectionType === 'exam' ? 'GRE' : 'Web Development'),
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
    resource_type: 'course',
    section_type: defaultSectionType,
    target_countries: [],
    estimated_time: '',
    prerequisites: [],
    education_levels: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newPrereq, setNewPrereq] = useState('');

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        link: resource.link,
        category: resource.category,
        difficulty: resource.difficulty,
        is_free: resource.is_free,
        icon: resource.icon || '📚',
        color: resource.color || 'blue',
        related_skills: resource.related_skills || [],
        relevant_backgrounds: resource.relevant_backgrounds || [],
        provider: resource.provider || '',
        duration: resource.duration || '',
        rating: resource.rating,
        is_featured: resource.is_featured ?? false,
        is_active: resource.is_active ?? true,
        resource_type: resource.resource_type || 'course',
        section_type: resource.section_type || 'domain',
        target_countries: resource.target_countries || [],
        estimated_time: resource.estimated_time || '',
        prerequisites: resource.prerequisites || [],
        education_levels: resource.education_levels || [],
      });
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      provider: formData.provider || null,
      duration: formData.duration || null,
      estimated_time: formData.estimated_time || null,
    };

    if (resource) {
      updateResource.mutate(
        { id: resource.id, updates: dataToSubmit },
        { onSuccess }
      );
    } else {
      createResource.mutate(dataToSubmit as any, { onSuccess });
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

  const addPrereq = () => {
    if (newPrereq.trim() && !formData.prerequisites.includes(newPrereq.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrereq.trim()]
      }));
      setNewPrereq('');
    }
  };

  const removePrereq = (prereq: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereq)
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

  const toggleEducationLevel = (level: string) => {
    setFormData(prev => ({
      ...prev,
      education_levels: prev.education_levels.includes(level)
        ? prev.education_levels.filter(l => l !== level)
        : [...prev.education_levels, level]
    }));
  };

  const toggleCountry = (country: string) => {
    setFormData(prev => ({
      ...prev,
      target_countries: prev.target_countries.includes(country)
        ? prev.target_countries.filter(c => c !== country)
        : [...prev.target_countries, country]
    }));
  };

  const isLoading = createResource.isPending || updateResource.isPending;
  const categories = formData.section_type === 'exam' ? EXAM_CATEGORIES : DOMAIN_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 pt-4">
          {/* Section Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Section *</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  section_type: value,
                  category: value === 'exam' ? 'GRE' : 'Web Development'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain">🎯 Domain</SelectItem>
                  <SelectItem value="exam">🎓 Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resource Type *</Label>
              <Select
                value={formData.resource_type}
                onValueChange={(value) => {
                  const type = RESOURCE_TYPES.find(t => t.value === value);
                  setFormData(prev => ({ 
                    ...prev, 
                    resource_type: value,
                    icon: type?.emoji || '📚'
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., freeCodeCamp Web Development Course"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
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
          <div className="space-y-2">
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

          {/* Category & Difficulty */}
          <div className="grid gap-4 md:grid-cols-2">
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
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Provider */}
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                placeholder="e.g., Coursera, Udemy, MIT"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 4 weeks, 10 hours"
              />
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <Label htmlFor="estimated_time">Estimated Completion Time</Label>
              <Input
                id="estimated_time"
                value={formData.estimated_time}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
                placeholder="e.g., 3-6 months"
              />
            </div>

            {/* Icon & Color */}
            <div className="space-y-2">
              <Label>Color Theme</Label>
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
          </div>

          {/* Related Skills */}
          <div className="space-y-2">
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

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <div className="flex gap-2">
              <Input
                value={newPrereq}
                onChange={(e) => setNewPrereq(e.target.value)}
                placeholder="Add a prerequisite..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPrereq();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addPrereq}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.prerequisites.map(prereq => (
                <Badge key={prereq} variant="outline" className="gap-1">
                  {prereq}
                  <button type="button" onClick={() => removePrereq(prereq)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid gap-4 md:grid-cols-2">
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
        </TabsContent>

        {/* Targeting Tab */}
        <TabsContent value="targeting" className="space-y-4 pt-4">
          {/* Target Audience */}
          <div className="space-y-2">
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

          {/* Education Levels */}
          <div className="space-y-2">
            <Label>Education Levels</Label>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_LEVELS.map(level => (
                <Badge
                  key={level}
                  variant={formData.education_levels.includes(level) ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => toggleEducationLevel(level)}
                >
                  {level.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Countries (mainly for exams) */}
          {formData.section_type === 'exam' && (
            <div className="space-y-2">
              <Label>Target Countries</Label>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map(country => (
                  <Badge
                    key={country}
                    variant={formData.target_countries.includes(country) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCountry(country)}
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
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

export default EnhancedResourceForm;