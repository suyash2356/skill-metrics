// src/pages/Explore.tsx
import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen, TrendingUp, Award, GraduationCap, Search, FileText,
  ExternalLink, Sparkles, Rocket, Users, Compass, ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchExploreSuggestions } from "@/api/searchAPI";
import { usePersonalizedExplore } from "@/hooks/usePersonalizedExplore";
import { useBlogsAndPapers } from "@/hooks/useBlogsAndPapers";
import { useUserResources } from "@/hooks/useUserResources";

// Tab components
import { PopularTab } from "@/components/explore/PopularTab";
import { DegreesTab } from "@/components/explore/DegreesTab";
import { CertificationsTab } from "@/components/explore/CertificationsTab";
import { BlogsTab } from "@/components/explore/BlogsTab";
import { ResourcesTab } from "@/components/explore/ResourcesTab";
import { CommunityTab } from "@/components/explore/CommunityTab";

// Inline debounce
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const VALID_TABS = ["popular", "categories", "certifications", "blogs", "resources", "community"] as const;

function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-synced tab state
  const tabFromUrl = searchParams.get("tab") || "popular";
  const activeTab = VALID_TABS.includes(tabFromUrl as any) ? tabFromUrl : "popular";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Data hooks
  const personalizedData = usePersonalizedExplore();
  const { data: blogsAndPapers, isLoading: blogsLoading } = useBlogsAndPapers();
  const { approvedResources, isLoadingApproved } = useUserResources();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestionsDebounced = useCallback(
    debounce(async (q: string) => {
      if (!q) return setSuggestions([]);
      try {
        const res = await fetchExploreSuggestions(q, 8);
        setSuggestions(res);
      } catch {
        setSuggestions([]);
      }
    }, 200),
    []
  );

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(q)}&scope=all`);
    }
  };

  const handleExploreClick = (title: string) => {
    navigate(`/skills/${encodeURIComponent(title)}`);
  };

  // Animated rotating words
  const rotatingWords = [
    "AI & Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "Data Science",
    "Software Development",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <section className="text-center mb-12 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Discover Your Learning Path
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                Explore Top Learning Resources
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6">
                Discover trending skills, domains, and career paths with the most popular and useful learning materials.
              </p>

              {/* Dynamic rotating text */}
              <div className="h-8 mb-8">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl font-semibold text-primary inline-block"
                  >
                    {rotatingWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search anything — skills, courses, topics, people..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchSuggestionsDebounced(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                  className="pl-12 pr-28 h-14 text-base rounded-2xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
                />
                <Button
                  type="submit"
                  className="absolute right-2 h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                >
                  Search
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 bg-card border border-border rounded-xl shadow-xl z-50 w-full overflow-hidden"
                  >
                    {suggestions.map((s: any, idx: number) => (
                      <button
                        key={`exp-${idx}`}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center gap-3 transition-colors border-b border-border/50 last:border-0"
                        onMouseDown={(ev) => {
                          ev.preventDefault();
                          if (s.kind === "domain") {
                            navigate(`/skills/${encodeURIComponent(s.name)}`);
                          } else if (s.link) {
                            window.open(s.link, "_blank");
                          } else if (s.kind === "skill") {
                            navigate(`/skills/${encodeURIComponent(s.name)}`);
                          } else if (s.kind === "explore") {
                            navigate(`/search?q=${encodeURIComponent(s.name)}&scope=explore`);
                          }
                          setShowSuggestions(false);
                        }}
                      >
                        <div className={`p-2 rounded-lg ${
                          s.kind === "domain" ? "bg-accent/20" :
                          s.kind === "skill" ? "bg-primary/10" :
                          "bg-muted"
                        }`}>
                          {s.kind === "domain" ? (
                            <Compass className="h-4 w-4 text-accent-foreground" />
                          ) : s.kind === "skill" ? (
                            <Rocket className="h-4 w-4 text-primary" />
                          ) : (
                            <Search className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.name}</div>
                          {s.description && <div className="text-xs text-muted-foreground truncate">{s.description}</div>}
                          {s.kind === "domain" && (
                            <div className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
                              View all resources <ArrowRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        {s.kind === "domain" && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">Domain</Badge>
                        )}
                        {s.kind === "skill" && (
                          <Badge variant="outline" className="text-[10px] shrink-0">Skill</Badge>
                        )}
                        {s.link && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </section>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <div className="sticky top-[57px] z-30 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 border-b border-border/50">
              <TabsList className="flex justify-start md:justify-center overflow-x-auto bg-muted/50 p-1.5 rounded-2xl gap-1 w-full max-w-fit mx-auto no-scrollbar">
                <TabsTrigger value="popular" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <TrendingUp className="h-4 w-4 mr-2" /> Popular
                </TabsTrigger>
                <TabsTrigger value="categories" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <GraduationCap className="h-4 w-4 mr-2" /> Degrees
                </TabsTrigger>
                <TabsTrigger value="certifications" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <Award className="h-4 w-4 mr-2" /> Certifications
                </TabsTrigger>
                <TabsTrigger value="blogs" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <FileText className="h-4 w-4 mr-2" /> Blogs & Papers
                </TabsTrigger>
                <TabsTrigger value="resources" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <BookOpen className="h-4 w-4 mr-2" /> Resources
                </TabsTrigger>
                <TabsTrigger value="community" className="shrink-0 px-6 py-2.5 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium transition-all">
                  <Users className="h-4 w-4 mr-2" /> Community
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="popular" className="space-y-10">
              <PopularTab personalizedData={personalizedData} onExploreClick={handleExploreClick} />
            </TabsContent>

            <TabsContent value="categories">
              <DegreesTab personalizedData={personalizedData} />
            </TabsContent>

            <TabsContent value="certifications">
              <CertificationsTab personalizedData={personalizedData} />
            </TabsContent>

            <TabsContent value="blogs">
              <BlogsTab blogsAndPapers={blogsAndPapers} blogsLoading={blogsLoading} />
            </TabsContent>

            <TabsContent value="resources">
              <ResourcesTab personalizedData={personalizedData} />
            </TabsContent>

            <TabsContent value="community">
              <CommunityTab approvedResources={approvedResources} isLoadingApproved={isLoadingApproved} />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4 text-primary" />
              Explore. Learn. Grow. — Powered by SkillMetrics AI
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}

export default Explore;
