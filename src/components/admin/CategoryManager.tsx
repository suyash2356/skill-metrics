import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Category, useCategories, useDeleteCategory } from '@/hooks/useCategories';
import CategoryForm from './CategoryForm';
import { 
  Brain, Database, Cloud, Shield, Layers, Zap, Laptop, Rocket, 
  PenTool, Map, BookOpen, TrendingUp, Globe, MessageSquare, GraduationCap,
  Code, Server, Terminal, Cpu, Smartphone, Monitor, Briefcase,
  Plus, Edit, Trash2, ChevronRight, Package, Loader2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  'Brain': Brain,
  'Database': Database,
  'Cloud': Cloud,
  'Shield': Shield,
  'Layers': Layers,
  'Zap': Zap,
  'Laptop': Laptop,
  'Rocket': Rocket,
  'PenTool': PenTool,
  'Map': Map,
  'BookOpen': BookOpen,
  'TrendingUp': TrendingUp,
  'Globe': Globe,
  'MessageSquare': MessageSquare,
  'GraduationCap': GraduationCap,
  'Code': Code,
  'Server': Server,
  'Terminal': Terminal,
  'Cpu': Cpu,
  'Smartphone': Smartphone,
  'Monitor': Monitor,
  'Briefcase': Briefcase,
};

interface CategoryManagerProps {
  type: 'domain' | 'exam';
  onCategorySelect: (category: string) => void;
}

const CategoryManager = ({ type, onCategorySelect }: CategoryManagerProps) => {
  const { data: categories = [], isLoading } = useCategories(type);
  const deleteCategory = useDeleteCategory();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      await deleteCategory.mutateAsync(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const typeLabel = type === 'domain' ? 'Domain' : 'Exam';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {categories.length} {typeLabel.toLowerCase()}(s) available
        </p>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add {typeLabel}
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No {typeLabel}s Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first {typeLabel.toLowerCase()} to start organizing resources.
          </p>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add {typeLabel}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const IconComponent = ICON_MAP[category.icon || ''] || (type === 'domain' ? Layers : GraduationCap);
            const gradient = category.color || (type === 'domain' ? 'from-indigo-500 to-purple-500' : 'from-green-500 to-emerald-500');

            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group overflow-hidden"
                onClick={() => onCategorySelect(category.name)}
              >
                <CardHeader className={`bg-gradient-to-r ${gradient} text-white pb-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {!category.is_active && (
                          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Order: {category.display_order}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={(e) => handleEdit(category, e)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(category, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? `Edit ${typeLabel}` : `Add New ${typeLabel}`}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? `Update the ${typeLabel.toLowerCase()} details below.`
                : `Create a new ${typeLabel.toLowerCase()} to organize resources.`}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            defaultType={type}
            onSuccess={handleFormClose}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {typeLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
              Note: Resources associated with this category will not be deleted, but they may need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
