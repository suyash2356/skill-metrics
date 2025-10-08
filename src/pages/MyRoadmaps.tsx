import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  Plus, 
  Calendar, 
  Clock, 
  Star, 
  Play,
  CheckCircle,
  Circle,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TypedSupabaseClient } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

const rawSupabase = supabase;
const supabaseTyped = rawSupabase as TypedSupabaseClient;

const getTypedTable = <T extends keyof Database['public']['Tables']>(tableName: T) => {
  return supabaseTyped.from(tableName as any);
};

const MyRoadmaps = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('roadmaps')
        .select('id,title,description,category,difficulty,status,progress,estimated_time,technologies,created_at,updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast({ title: 'Failed to load roadmaps', variant: 'destructive' });
      } else {
        setRoadmaps(data || []);
      }
      setIsLoading(false);
    };
    load();
  }, [user, toast]);

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
      try {
        const { error } = await getTypedTable('roadmaps')
          .delete()
          .eq('id', roadmapId);

        if (error) throw error;

        setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
        toast({
          title: 'Roadmap Deleted!',
          description: 'The roadmap and all its associated steps and resources have been removed.',
        });
      } catch (e: any) {
        console.error('deleteRoadmap error', e);
        toast({ title: 'Failed to delete roadmap', description: e?.message || '', variant: 'destructive' });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterRoadmaps = (status: string) => {
    if (status === 'all') return roadmaps;
    return roadmaps.filter(roadmap => roadmap.status === status);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Learning Roadmaps</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track your progress and manage your learning journey
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/create-roadmap">
              <Plus className="h-4 w-4 mr-2" />
              Create New Roadmap
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{roadmaps.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {roadmaps.filter(r => r.status === 'in-progress').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {roadmaps.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {roadmaps.length > 0 ? Math.round(roadmaps.reduce((acc, r) => acc + r.progress, 0) / roadmaps.length) : 0}%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmaps */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
            <TabsTrigger value="all">All ({roadmaps.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({roadmaps.filter(r => r.status === 'in-progress').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({roadmaps.filter(r => r.status === 'completed').length})
            </TabsTrigger>
            <TabsTrigger value="not-started">
              Not Started ({roadmaps.filter(r => r.status === 'not-started').length})
            </TabsTrigger>
          </TabsList>

          {['all', 'in-progress', 'completed', 'not-started'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterRoadmaps(status).map((roadmap) => (
                  <Card key={roadmap.id} className="shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1 pr-2">
                          <CardTitle className="text-base sm:text-lg leading-tight">
                            <Link to={`/roadmaps/${roadmap.id}`} className="hover:underline">
                              {roadmap.title}
                            </Link>
                          </CardTitle>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {roadmap.category || 'General'}
                            </Badge>
                            <Badge className={`${getStatusColor(roadmap.status)} text-xs`}>
                              {roadmap.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={`${getDifficultyColor(roadmap.difficulty)} text-xs`}>
                              {roadmap.difficulty || 'Beginner'}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuItem asChild>
                              <Link to={`/roadmaps/${roadmap.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteRoadmap(roadmap.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {roadmap.description}
                      </p>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{roadmap.progress || 0}%</span>
                        </div>
                        <Progress value={roadmap.progress || 0} className="h-2" />
                      </div>

                      {/* Technologies */}
                      {(roadmap.technologies || []).length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-muted-foreground">Technologies</div>
                          <div className="flex flex-wrap gap-1">
                            {(roadmap.technologies || []).map((tech: string) => (
                              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                     <div className="p-4 pt-0">
                        <Button 
                          className="w-full"
                          asChild
                          variant={roadmap.status === 'completed' ? 'secondary' : 'default'}
                        >
                          <Link to={`/roadmaps/${roadmap.id}`}>
                          {roadmap.status === 'completed' ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Review
                            </>
                          ) : roadmap.status === 'not-started' ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Learning
                            </>
                          ) : (
                            <>
                              <Circle className="h-4 w-4 mr-2 animate-pulse" />
                              Continue
                            </>
                          )}
                          </Link>
                        </Button>
                      </div>
                  </Card>
                ))}
              </div>
              
              {filterRoadmaps(status).length === 0 && (
                <div className="text-center py-12">
                  <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No roadmaps found</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {status === 'all' 
                      ? "Create your first learning roadmap to get started"
                      : `No ${status.replace('-', ' ')} roadmaps found`
                    }
                  </p>
                  {status === 'all' && (
                    <Button asChild>
                      <Link to="/create-roadmap">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Roadmap
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyRoadmaps;