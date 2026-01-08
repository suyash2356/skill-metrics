import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Resource } from '@/hooks/useAdmin';
import { GraduationCap, ChevronRight, Package, Globe } from 'lucide-react';

interface ExamListProps {
  resources: Resource[];
  onExamClick: (exam: string) => void;
}

const EXAM_COLORS: Record<string, string> = {
  'GRE': 'from-indigo-500 to-blue-500',
  'GMAT': 'from-green-500 to-emerald-500',
  'CAT': 'from-rose-500 to-red-500',
  'JEE': 'from-yellow-500 to-amber-500',
  'NEET': 'from-pink-500 to-purple-500',
  'TOEFL': 'from-blue-500 to-cyan-500',
  'IELTS': 'from-green-500 to-teal-500',
  'SAT': 'from-purple-500 to-pink-500',
  'GATE': 'from-orange-500 to-red-500',
  'UPSC': 'from-red-500 to-pink-600',
  'LSAT': 'from-indigo-500 to-purple-500',
  'MCAT': 'from-teal-500 to-blue-500',
};

const EXAM_DESCRIPTIONS: Record<string, string> = {
  'GRE': 'Graduate Record Examinations',
  'GMAT': 'Graduate Management Admission Test',
  'CAT': 'Common Admission Test',
  'JEE': 'Joint Entrance Examination',
  'NEET': 'National Eligibility cum Entrance Test',
  'TOEFL': 'Test of English as a Foreign Language',
  'IELTS': 'International English Language Testing System',
  'SAT': 'Scholastic Assessment Test',
  'GATE': 'Graduate Aptitude Test in Engineering',
  'UPSC': 'Union Public Service Commission',
  'LSAT': 'Law School Admission Test',
  'MCAT': 'Medical College Admission Test',
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

const ExamList = ({ resources, onExamClick }: ExamListProps) => {
  // Filter only exam resources
  const examResources = useMemo(() => 
    resources.filter(r => r.section_type === 'exam'),
    [resources]
  );

  // Group resources by exam/category
  const examStats = useMemo(() => {
    const stats: Record<string, {
      total: number;
      free: number;
      featured: number;
      active: number;
      types: Set<string>;
      difficulties: Record<string, number>;
      countries: Set<string>;
    }> = {};

    examResources.forEach(resource => {
      const exam = resource.category;
      if (!stats[exam]) {
        stats[exam] = {
          total: 0,
          free: 0,
          featured: 0,
          active: 0,
          types: new Set(),
          difficulties: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 },
          countries: new Set(),
        };
      }
      stats[exam].total++;
      if (resource.is_free) stats[exam].free++;
      if (resource.is_featured) stats[exam].featured++;
      if (resource.is_active) stats[exam].active++;
      if (resource.resource_type) stats[exam].types.add(resource.resource_type);
      if (resource.difficulty) {
        stats[exam].difficulties[resource.difficulty] = 
          (stats[exam].difficulties[resource.difficulty] || 0) + 1;
      }
      if (resource.target_countries) {
        resource.target_countries.forEach((c: string) => stats[exam].countries.add(c));
      }
    });

    return Object.entries(stats)
      .map(([exam, data]) => ({
        exam,
        ...data,
        types: Array.from(data.types),
        countries: Array.from(data.countries),
      }))
      .sort((a, b) => b.total - a.total);
  }, [examResources]);

  if (examStats.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Exams Yet</h3>
        <p className="text-muted-foreground">Add exam prep resources to see exams listed here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {examStats.map(({ exam, total, free, featured, active, types, difficulties, countries }) => {
        const gradient = EXAM_COLORS[exam] || 'from-gray-500 to-gray-600';
        const description = EXAM_DESCRIPTIONS[exam] || 'Exam Preparation';
        const freePercentage = total > 0 ? (free / total) * 100 : 0;

        return (
          <Card 
            key={exam}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group overflow-hidden"
            onClick={() => onExamClick(exam)}
          >
            <CardHeader className={`bg-gradient-to-r ${gradient} text-white pb-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{exam}</CardTitle>
                    <p className="text-xs text-white/80">{description}</p>
                  </div>
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

              {/* Target Countries */}
              {countries.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Target Countries
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {countries.slice(0, 4).map(country => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                    {countries.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{countries.length - 4}</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Resource Types */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-2">Resource Types</div>
                <div className="flex flex-wrap gap-1">
                  {types.length > 0 ? types.slice(0, 4).map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {RESOURCE_TYPE_EMOJI[type] || '📚'} {type}
                    </Badge>
                  )) : (
                    <Badge variant="outline" className="text-xs">No types specified</Badge>
                  )}
                  {types.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{types.length - 4}</Badge>
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

export default ExamList;