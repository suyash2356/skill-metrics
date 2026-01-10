import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsAdmin, useResources, Resource } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield, LogOut, Loader2, BookOpen, Database, Eye, Star,
  Layers, GraduationCap, Download, ArrowLeft
} from 'lucide-react';
import EnhancedResourceForm from '@/components/admin/EnhancedResourceForm';
import ImportExportDialog from '@/components/admin/ImportExportDialog';
import DomainList from '@/components/admin/DomainList';
import ExamList from '@/components/admin/ExamList';
import ResourceTable from '@/components/admin/ResourceTable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: resources = [], isLoading: resourcesLoading } = useResources();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  
  // View state for navigating into domain/exam details
  const [selectedSection, setSelectedSection] = useState<'domain' | 'exam' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('domains');

  // Redirect if not admin
  if (!adminLoading && !isAdmin) {
    navigate('/admin/login');
    return null;
  }

  if (adminLoading || resourcesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: resources.length,
    active: resources.filter(r => r.is_active).length,
    free: resources.filter(r => r.is_free).length,
    featured: resources.filter(r => r.is_featured).length,
    domains: [...new Set(resources.filter(r => r.section_type === 'domain').map(r => r.category))].length,
    exams: [...new Set(resources.filter(r => r.section_type === 'exam').map(r => r.category))].length,
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingResource(null);
  };

  const handleDomainSelect = (domain: string) => {
    setSelectedSection('domain');
    setSelectedCategory(domain);
  };

  const handleExamSelect = (exam: string) => {
    setSelectedSection('exam');
    setSelectedCategory(exam);
  };

  const handleBackToList = () => {
    setSelectedSection(null);
    setSelectedCategory(null);
  };

  const handleAddResourceForCategory = () => {
    // Pre-set the category when adding from within a domain/exam view
    setEditingResource({
      id: '',
      title: '',
      description: '',
      link: '',
      category: selectedCategory || '',
      difficulty: 'beginner',
      is_free: true,
      is_active: true,
      is_featured: false,
      resource_type: 'course',
      section_type: selectedSection || 'domain',
    } as Resource);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportExportOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Import/Export
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.domains}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exams</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.exams}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.free}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {selectedSection && selectedCategory ? (
          // Resource Table View for selected domain/exam
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBackToList}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {selectedSection === 'domain' ? (
                      <Layers className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <GraduationCap className="h-5 w-5 text-purple-500" />
                    )}
                    {selectedCategory}
                  </CardTitle>
                  <CardDescription>
                    {selectedSection === 'domain' ? 'Domain' : 'Exam'} Resources
                  </CardDescription>
                </div>
                <Button onClick={handleAddResourceForCategory}>
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResourceTable
                resources={resources}
                sectionType={selectedSection}
                category={selectedCategory}
                onEdit={handleEdit}
              />
            </CardContent>
          </Card>
        ) : (
          // Main Tabs View
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>
                Organize learning resources by domains and exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="domains" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Domains
                  </TabsTrigger>
                  <TabsTrigger value="exams" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Exams
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="domains">
                  <DomainList 
                    resources={resources} 
                    onDomainSelect={handleDomainSelect}
                    onAddResource={() => {
                      setEditingResource(null);
                      setIsFormOpen(true);
                    }}
                  />
                </TabsContent>

                <TabsContent value="exams">
                  <ExamList 
                    resources={resources} 
                    onExamSelect={handleExamSelect}
                    onAddResource={() => {
                      setEditingResource(null);
                      setIsFormOpen(true);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Resource Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource?.id ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
            <DialogDescription>
              {editingResource?.id ? 'Update the resource details below.' : 'Fill in the details for the new resource.'}
            </DialogDescription>
          </DialogHeader>
          <EnhancedResourceForm 
            resource={editingResource} 
            onSuccess={handleFormClose}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Import/Export Dialog */}
      <ImportExportDialog 
        open={isImportExportOpen}
        onOpenChange={setIsImportExportOpen}
        resources={resources}
      />
    </div>
  );
};

export default AdminDashboard;
