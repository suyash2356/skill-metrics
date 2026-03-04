import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUniversalSearch, UniversalSearchResults } from "@/api/searchAPI";
import {
  Search, Star, Users, BookOpen, Globe, Youtube, GraduationCap, Award,
  ExternalLink, ArrowLeft, Layers, FileText, PackagePlus, Eye,
} from "lucide-react";

function StarDisplay({ rating, count }: { rating: number | null; count?: number | null }) {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-1 text-sm">
      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
      <span className="font-medium">{Number(rating).toFixed(1)}</span>
      {count != null && <span className="text-muted-foreground">({count})</span>}
    </span>
  );
}

function resourceTypeIcon(type: string) {
  switch (type) {
    case "course": return <Layers className="h-4 w-4" />;
    case "video": return <Youtube className="h-4 w-4" />;
    case "book": return <BookOpen className="h-4 w-4" />;
    case "certification": return <Award className="h-4 w-4" />;
    case "degree": return <GraduationCap className="h-4 w-4" />;
    case "blog": case "paper": return <FileText className="h-4 w-4" />;
    default: return <Globe className="h-4 w-4" />;
  }
}

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<UniversalSearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = params.get("q") || "";
    setQuery(q);
    if (q) runSearch(q);
  }, [location.search]);

  async function runSearch(q: string) {
    setLoading(true);
    try {
      const res = await fetchUniversalSearch(q, 40);
      setResults(res);
    } catch {
      setResults({ resources: [], communityResources: [], people: [] });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&scope=all`);
    }
  }

  const totalResults =
    (results?.resources.length || 0) +
    (results?.communityResources.length || 0) +
    (results?.people.length || 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back + Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources, skills, people..."
              className="pl-12 pr-28 h-12 rounded-xl border-2 border-border/50 bg-background focus-visible:ring-primary/30"
            />
            <Button type="submit" className="absolute right-2 h-8 px-5 rounded-lg text-sm">
              Search
            </Button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}><CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent></Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results && (
          <div className="space-y-8">
            {totalResults === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-muted-foreground">Try different keywords like "machine learning", "python", or "web development"</p>
              </div>
            )}

            {/* Resources Section */}
            {results.resources.length > 0 && (
              <section>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Resources
                  <Badge variant="secondary" className="ml-1">{results.resources.length}</Badge>
                </h2>
                <div className="space-y-3">
                  {results.resources.map((r) => (
                    <Card
                      key={r.id}
                      className="group cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => navigate(`/resources/${r.id}?source=resources`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                            {resourceTypeIcon(r.resource_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{r.title}</h3>
                              <Badge variant="outline" className="text-[10px] capitalize">{r.resource_type}</Badge>
                              {r.difficulty && <Badge variant="secondary" className="text-[10px] capitalize">{r.difficulty}</Badge>}
                              {r.is_free === false && <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20">Paid</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {r.provider && <span>{r.provider}</span>}
                              <StarDisplay rating={r.avg_rating || r.weighted_rating} count={r.total_ratings} />
                              {r.duration && <span>{r.duration}</span>}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0" onClick={(e) => { e.stopPropagation(); window.open(r.link, '_blank'); }}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Community Resources Section */}
            {results.communityResources.length > 0 && (
              <section>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <PackagePlus className="h-5 w-5 text-emerald-500" />
                  Community Resources
                  <Badge variant="secondary" className="ml-1">{results.communityResources.length}</Badge>
                </h2>
                <div className="space-y-3">
                  {results.communityResources.map((r) => (
                    <Card
                      key={r.id}
                      className="group cursor-pointer hover:border-emerald-500/30 transition-colors"
                      onClick={() => navigate(`/resources/${r.id}?source=user_resources`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                            {resourceTypeIcon(r.resource_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold group-hover:text-emerald-500 transition-colors line-clamp-1">{r.title}</h3>
                              <Badge variant="outline" className="text-[10px] capitalize">{r.resource_type}</Badge>
                              <Badge variant="secondary" className="text-[10px] capitalize">{r.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <StarDisplay rating={r.avg_rating} count={r.total_ratings} />
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {r.view_count}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* People Section */}
            {results.people.length > 0 && (
              <section>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-blue-500" />
                  People
                  <Badge variant="secondary" className="ml-1">{results.people.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.people.map((p) => (
                    p.kind === 'user' && (
                      <Card
                        key={p.id}
                        className="group cursor-pointer hover:border-blue-500/30 transition-colors"
                        onClick={() => navigate(`/profile/${p.id}`)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden shrink-0">
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <Users className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <span className="font-medium group-hover:text-blue-500 transition-colors">{p.name}</span>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
