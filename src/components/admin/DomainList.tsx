import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Resource } from '@/hooks/useAdmin';
import { 
  Brain, Database, Cloud, Shield, Layers, Zap, Laptop, Rocket, 
  PenTool, Map, BookOpen, TrendingUp, Globe, MessageSquare,
  ChevronRight, Package
} from 'lucide-react';

interface DomainListProps {
  resources: Resource[];
  onDomainClick: (domain: string) => void;
}

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
};

const DOMAIN_COLORS: Record<string, string> = {
  'Artificial Intelligence': 'from-indigo-500 to-purple-500',
  'Machine Learning': 'from-indigo-500 to-purple-500',
  'AI': 'from-indigo-500 to-purple-500',
  'Data Science': 'from-blue-500 to-cyan-500',
  'Cloud Computing': 'from-sky-500 to-indigo-500',
  'Cybersecurity': 'from-rose-500 to-red-500',
  'Cyber Security': 'from-rose-500 to-red-500',
  'Blockchain': 'from-amber-500 to-orange-500',
  'DevOps': 'from-green-500 to-emerald-500',
  'Web Development': 'from-purple-600 to-pink-500',
  'Software Development': 'from-purple-600 to-pink-500',
  'Mobile Development': 'from-teal-500 to-cyan-500',
  'Design': 'from-pink-500 to-rose-500',
  'UI/UX': 'from-pink-500 to-rose-500',
  'Python': 'from-yellow-500 to-green-500',
  'JavaScript': 'from-yellow-400 to-amber-500',
  'Database': 'from-blue-600 to-indigo-600',
  'DSA': 'from-orange-500 to-red-500',
  'System Design': 'from-violet-500 to-purple-600',
  'Business': 'from-indigo-500 to-sky-500',
  'Marketing': 'from-green-500 to-emerald-500',
  'Management': 'from-indigo-600 to-violet-500',
};

const DOMAIN_ICONS: Record<string, string> = {
  'Artificial Intelligence': 'Brain',
  'Machine Learning': 'Brain',
  'AI': 'Brain',
  'Data Science': 'Database',
  'Cloud Computing': 'Cloud',
  'Cybersecurity': 'Shield',
  'Cyber Security': 'Shield',
  'Blockchain': 'Layers',
  'DevOps': 'Zap',
  'Web Development': 'Laptop',
  'Software Development': 'Laptop',
  'Mobile Development': 'Laptop',
  'Design': 'PenTool',
  'UI/UX': 'PenTool',
  'Python': 'Laptop',
  'JavaScript': 'Laptop',
  'Database': 'Database',
  'DSA': 'Zap',
  'System Design': 'Layers',
  'Business': 'Map',
  'Marketing': 'TrendingUp',
  'Management': 'Rocket',
};

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

const DomainList = ({ resources, onDomainClick }: DomainListProps) => {
  // Filter only domain resources
  const domainResources = useMemo(() => 
    resources.filter(r => r.section_type === 'domain' || !r.section_type),
    [resources]
  );

  // Group resources by domain/category
  const domainStats = useMemo(() => {
    const stats: Record<string, {
      total: number;
      free: number;
      featured: number;
      active: number;
      types: Set<string>;
      difficulties: Record<string, number>;
    }> = {};

    domainResources.forEach(resource => {
      const domain = resource.category;
      if (!stats[domain]) {
        stats[domain] = {
          total: 0,
          free: 0,
          featured: 0,
          active: 0,
          types: new Set(),
          difficulties: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 },
        };
      }
      stats[domain].total++;
      if (resource.is_free) stats[domain].free++;
      if (resource.is_featured) stats[domain].featured++;
      if (resource.is_active) stats[domain].active++;
      if (resource.resource_type) stats[domain].types.add(resource.resource_type);
      if (resource.difficulty) {
        stats[domain].difficulties[resource.difficulty] = 
          (stats[domain].difficulties[resource.difficulty] || 0) + 1;
      }
    });

    return Object.entries(stats)
      .map(([domain, data]) => ({
        domain,
        ...data,
        types: Array.from(data.types),
      }))
      .sort((a, b) => b.total - a.total);
  }, [domainResources]);

  if (domainStats.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Domains Yet</h3>
        <p className="text-muted-foreground">Add resources to see domains listed here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {domainStats.map(({ domain, total, free, featured, active, types, difficulties }) => {
        const iconName = DOMAIN_ICONS[domain] || 'Laptop';
        const IconComponent = ICON_MAP[iconName] || Laptop;
        const gradient = DOMAIN_COLORS[domain] || 'from-gray-500 to-gray-600';
        const freePercentage = total > 0 ? (free / total) * 100 : 0;

        return (
          <Card 
            key={domain}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group overflow-hidden"
            onClick={() => onDomainClick(domain)}
          >
            <CardHeader className={`bg-gradient-to-r ${gradient} text-white pb-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{domain}</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{free}</div>
                  <div className="text-xs text-muted-foreground">Free</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{featured}</div>
                  <div className="text-xs text-muted-foreground">Featured</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{active}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>

              {/* Free Resources Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Free Resources</span>
                  <span>{Math.round(freePercentage)}%</span>
                </div>
                <Progress value={freePercentage} className="h-2" />
              </div>

              {/* Resource Types */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-2">Resource Types</div>
                <div className="flex flex-wrap gap-1">
                  {types.length > 0 ? types.slice(0, 5).map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {RESOURCE_TYPE_EMOJI[type] || '📚'} {type}
                    </Badge>
                  )) : (
                    <Badge variant="outline" className="text-xs">No types specified</Badge>
                  )}
                  {types.length > 5 && (
                    <Badge variant="outline" className="text-xs">+{types.length - 5}</Badge>
                  )}
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">Difficulty Levels</div>
                <div className="flex gap-1">
                  {Object.entries(difficulties).map(([level, count]) => (
                    count > 0 && (
                      <Badge 
                        key={level} 
                        variant="outline" 
                        className={`text-xs ${
                          level === 'beginner' ? 'border-green-500 text-green-600' :
                          level === 'intermediate' ? 'border-yellow-500 text-yellow-600' :
                          level === 'advanced' ? 'border-orange-500 text-orange-600' :
                          'border-red-500 text-red-600'
                        }`}
                      >
                        {level}: {count}
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DomainList;