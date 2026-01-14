import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Category, CategoryInsert, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const ICONS = [
  'Brain', 'Database', 'Cloud', 'Shield', 'Layers', 'Zap', 'Laptop', 'Rocket',
  'PenTool', 'Map', 'BookOpen', 'TrendingUp', 'Globe', 'MessageSquare', 'GraduationCap',
  'Code', 'Server', 'Terminal', 'Cpu', 'Smartphone', 'Monitor', 'Briefcase'
];

const COLORS = [
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo-Purple' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue-Cyan' },
  { value: 'from-sky-500 to-indigo-500', label: 'Sky-Indigo' },
  { value: 'from-rose-500 to-red-500', label: 'Rose-Red' },
  { value: 'from-amber-500 to-orange-500', label: 'Amber-Orange' },
  { value: 'from-green-500 to-emerald-500', label: 'Green-Emerald' },
  { value: 'from-purple-600 to-pink-500', label: 'Purple-Pink' },
  { value: 'from-teal-500 to-cyan-500', label: 'Teal-Cyan' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink-Rose' },
  { value: 'from-yellow-500 to-green-500', label: 'Yellow-Green' },
  { value: 'from-orange-500 to-red-500', label: 'Orange-Red' },
  { value: 'from-violet-500 to-purple-600', label: 'Violet-Purple' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  type: z.enum(['domain', 'exam']),
  description: z.string().max(500, 'Description is too long').optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  is_active: z.boolean(),
  display_order: z.number().min(0),
});

interface CategoryFormProps {
  category?: Category | null;
  defaultType?: 'domain' | 'exam';
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm = ({ category, defaultType = 'domain', onSuccess, onCancel }: CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = !!category?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      type: category?.type || defaultType,
      description: category?.description || '',
      icon: category?.icon || '',
      color: category?.color || '',
      is_active: category?.is_active ?? true,
      display_order: category?.display_order ?? 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const categoryData: CategoryInsert = {
      name: values.name,
      type: values.type,
      description: values.description || null,
      icon: values.icon || null,
      color: values.color || null,
      is_active: values.is_active,
      display_order: values.display_order,
    };

    if (isEditing && category?.id) {
      await updateCategory.mutateAsync({ id: category.id, updates: categoryData });
    } else {
      await createCategory.mutateAsync(categoryData);
    }
    onSuccess();
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Data Science, GRE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this category..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional description for this category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ICONS.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Gradient</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COLORS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${value}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Lower numbers appear first</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Show this category publicly</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
