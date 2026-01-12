import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Resource, useDeleteResource } from '@/hooks/useAdmin';
import { 
  Search, MoreHorizontal, Pencil, Trash2, Eye, Star, 
  ArrowLeft, Plus, Download, Upload, Filter, ChevronDown
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface ResourceTableProps {
  resources: Resource[];
  sectionType: 'domain' | 'exam';
  category: string;
  onEdit: (resource: Resource) => void;
}

const RESOURCE_TYPE_EMOJI: Record<string, string> = {
  'course': '📚',
  'video': '🎬',
  'book': '📖',
  'blog': '📝',
  'website': '🌐',
  'certification': '🏆',
  'degree': '🎓',
  'learning_path': '🗺️',
  'coaching': '👨‍🏫',
  'exam_prep': '📋',
};

const ResourceTable = ({ 
  resources, 
  sectionType,
  category,
  onEdit
}: ResourceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const deleteResource = useDeleteResource();

  // Get filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesCategory = resource.category === category;
      const matchesSectionType = resource.section_type === sectionType;
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.provider?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || resource.resource_type === typeFilter;
      const matchesDifficulty = difficultyFilter === 'all' || resource.difficulty === difficultyFilter;
      
      return matchesCategory && matchesSectionType && matchesSearch && matchesType && matchesDifficulty;
    });
  }, [resources, category, sectionType, searchTerm, typeFilter, difficultyFilter]);

  // Get available types for this category
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    resources
      .filter(r => r.category === category && r.section_type === sectionType)
      .forEach(r => {
        if (r.resource_type) types.add(r.resource_type);
      });
    return Array.from(types).sort();
  }, [resources, category, sectionType]);

  const handleDelete = (id: string) => {
    deleteResource.mutate(id, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="text-sm text-muted-foreground">
        {filteredResources.length} resources found
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {availableTypes.map(type => (
              <SelectItem key={type} value={type}>
                {RESOURCE_TYPE_EMOJI[type] || '📚'} {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Provider</TableHead>
              <TableHead className="hidden lg:table-cell">Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No resources found for this category
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.id} className={!resource.is_active ? 'opacity-50' : ''}>
                  <TableCell>
                    <span className="text-xl" title={resource.resource_type || 'course'}>
                      {RESOURCE_TYPE_EMOJI[resource.resource_type || 'course'] || '📚'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium line-clamp-1">{resource.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                      {resource.description}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {resource.provider || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge 
                      variant="outline"
                      className={`capitalize ${
                        resource.difficulty === 'beginner' ? 'border-green-500 text-green-600' :
                        resource.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-600' :
                        resource.difficulty === 'advanced' ? 'border-orange-500 text-orange-600' :
                        'border-red-500 text-red-600'
                      }`}
                    >
                      {resource.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.is_free ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Free</Badge>
                      ) : (
                        <Badge variant="secondary">Paid</Badge>
                      )}
                      {resource.is_featured && (
                        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!resource.is_active && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(resource.link, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(resource)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteConfirmId(resource.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteResource.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResourceTable;